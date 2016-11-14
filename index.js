const fs = require('fs')

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


let recordingChannels = [];
let session = {}
let mockStartMsg = {
    "type": "message",
    "channel": "C2CU76YDB",
    "user": "U2CTXB49J",
    "text": "@ur start",
    "ts": "1479141248.000002",
    "team": "T2CSKBAE7",
    "event": "ambient"
};
let mockEndMsg = {
    "type": "message",
    "channel": "C2CU76YDB",
    "user": "U2CTXB49J",
    "text": "@ur end",
    "ts": "1479117841.000034",
    "team": "T2CSKBAE7",
    "event": "ambient"
};

let mockSession = [{
    "type": "message",
    "channel": "C2CU76YDB",
    "user": "U2CTXB49J",
    "text": "This product is terrible!",
    "ts": "1479117541.000034",
    "team": "T2CSKBAE7",
    "event": "ambient"
}, {
    "type": "message",
    "channel": "C2CU76YDB",
    "user": "U2CTXB49J",
    "text": "Testing a product",
    "ts": "1479141266.000005",
    "team": "T2CSKBAE7",
    "event": "ambient"
}, {
    "type": "message",
    "channel": "C2CU76YDB",
    "user": "U2CTXB49J",
    "text": "Let's see how this goes",
    "ts": "1479141271.000006",
    "team": "T2CSKBAE7",
    "event": "ambient"
}];

    /**
     * TODO: fixed b0rked reconnect behavior
     */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');

    // simulate user input
    start(mockStartMsg)
    mockSession.map( msg => pushMsgToSession(msg))
    saveSessionToFs(session, mockEndMsg.ts)

});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */

const start = function(msg) {
    session.startTime = msg.ts;
    recordingChannels.push(msg.channel)
    session.messages = session.messages ? session.messages : []
}

const pushMsgToSession = function(msg) {
    session.messages.push(msg)
}

const saveSessionToFs = function(session, endTime) {
    session.endTime = endTime;
    fs.writeFile('./lib/data/session.json', JSON.stringify(session), function (err) {
      if (err) return console.log(err);
    });
}

controller.on('bot_channel_join', function (bot, msg) {
    bot.reply(msg, "I'm here!")
    session = JSON.parse(fs.read)
});

controller.hears('start', 'direct_message,direct_mention,mention', function(bot, msg) {
    bot.reply(msg, 'Starting usability session!');

    start(msg)

    console.log('------- Start Recording 🆕 -------')
    console.log('Currently listenting to ', recordingChannels)
});

controller.on('ambient', (bot, msg) => {
    if(recordingChannels.indexOf(msg.channel) > -1){
        pushMsgToSession(msg)
    }
});

controller.hears('end', 'direct_mention,mention', function(bot,msg) {
    bot.reply(msg, 'Finish Recording 🎊')

    saveSessionToFs(session, msg.ts)

    console.log('------- Finish Recording 🎊 -------')
    console.log('session ', session)
    }
);
