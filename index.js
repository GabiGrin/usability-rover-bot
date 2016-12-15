const mock = require('./lib/mock')
const sessionUtils = require('./lib/session-utils')

let config = {};
let recordingChannels = [];
let session = {}

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

if (process.env.TOKEN || process.env.SLACK_TOKEN) {

    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


    /**
     * TODO: fixed b0rked reconnect behavior
     */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});

controller.on('bot_channel_join', function (bot, msg) {
    bot.reply(msg, "I'm here!")
    // TODO: Read from FS
    // session = JSON.parse(fs.read)
});

controller.hears('start', 'direct_message,direct_mention,mention', function(bot, msg) {
    bot.startConversation(msg ,function(err,convo) {
        convo.ask('How would you like to call it?',function(response,convo) {
            session = sessionUtils.createNewSession(session, msg, recordingChannels)
            session.nameSession(session, response.text)
            recordingChannels.push(msg.channel)
            convo.say('Starting ' + response.text);
            console.log('------- Start Recording 🆕 -------')
            console.log('Currently listenting to ', recordingChannels)
            convo.next()
        });
    });

});

controller.on('ambient', (bot, msg) => {
    if(recordingChannels.indexOf(msg.channel) > -1){
        session.pushMsg(msg)
    }
});

controller.hears('end', 'direct_mention,mention', function(bot,msg) {
    session.endSession(msg)
    
    // TODO Name by team and channel
    fs.writeFile(`./lib/data/${session.name}.json`, JSON.stringify(session), function (err) {
        if (err) return console.log(err);
    });

    bot.reply(msg, 'Finish Recording 🎊')
    
    console.log('------- Finish Recording 🎊 -------')
    console.log('session ', session)
    }
);