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

    // simulate user input
    sessionUtils.nameSession(session, mock.session.name)
    sessionUtils.start(session, mock.startMsg, recordingChannels)
    mock.session.messages.map( msg => sessionUtils.pushMsgToSession(session, msg))
    sessionUtils.saveSessionToFs(session, mock.endMsg)

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
            sessionUtils.nameSession(session, response.text)
            convo.say('Starting ' + response.text);
            convo.next()
        });
    });

    sessionUtils.start(session, msg, recordingChannels)

    console.log('------- Start Recording 🆕 -------')
    console.log('Currently listenting to ', recordingChannels)
});

controller.on('ambient', (bot, msg) => {
    if(recordingChannels.indexOf(msg.channel) > -1){
        sessionUtils.pushMsgToSession(session, msg)
    }
});

controller.hears('end', 'direct_mention,mention', function(bot,msg) {
    bot.reply(msg, 'Finish Recording 🎊')

    sessionUtils.saveSessionToFs(session, msg)

    console.log('------- Finish Recording 🎊 -------')
    console.log('session ', session)
    }
);
