"use strict";

var _mock = require('./mock');

var _mock2 = _interopRequireDefault(_mock);

var _sessionUtils = require('./session-utils');

var _sessionUtils2 = _interopRequireDefault(_sessionUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {};
var recordingChannels = [];
var session = {};

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({ user: installer }, function (err, convo) {
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
        storage: BotkitStorage({ mongoUri: process.env.MONGOLAB_URI })
    };
} else {
    config = {
        json_file_store: process.env.TOKEN ? './db_slack_bot_ci/' : './db_slack_bot_a/' };
}

if (process.env.TOKEN || process.env.SLACK_TOKEN) {

    var customIntegration = require('./custom_integrations');
    var token = process.env.TOKEN ? process.env.TOKEN : process.env.SLACK_TOKEN;
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
    bot.reply(msg, "I'm here!");
    // TODO: Read from FS
    // session = JSON.parse(fs.read)
});

controller.hears('start', 'direct_message,direct_mention,mention', function (bot, msg) {
    bot.startConversation(msg, function (err, convo) {
        convo.ask('How would you like to call it?', function (response, convo) {
            session = _sessionUtils2.default.createNewSession(session, msg, recordingChannels);
            session.nameSession(session, response.text);
            recordingChannels.push(msg.channel);
            convo.say('Starting ' + response.text);
            console.log('------- Start Recording 🆕 -------');
            console.log('Currently listenting to ', recordingChannels);
            convo.next();
        });
    });
});

controller.on('ambient', function (bot, msg) {
    if (recordingChannels.indexOf(msg.channel) > -1) {
        session.pushMsg(msg);
    }
});

controller.hears('end', 'direct_mention,mention', function (bot, msg) {
    session.endSession(msg);

    // TODO Name by team and channel
    fs.writeFile('./data/' + session.name + '.json', JSON.stringify(session), function (err) {
        if (err) return console.log(err);
    });

    bot.reply(msg, 'Finish Recording 🎊');

    console.log('------- Finish Recording 🎊 -------');
    console.log('session ', session);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJyZWNvcmRpbmdDaGFubmVscyIsInNlc3Npb24iLCJvbkluc3RhbGxhdGlvbiIsImJvdCIsImluc3RhbGxlciIsInN0YXJ0UHJpdmF0ZUNvbnZlcnNhdGlvbiIsInVzZXIiLCJlcnIiLCJjb252byIsImNvbnNvbGUiLCJsb2ciLCJzYXkiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09MQUJfVVJJIiwiQm90a2l0U3RvcmFnZSIsInJlcXVpcmUiLCJzdG9yYWdlIiwibW9uZ29VcmkiLCJqc29uX2ZpbGVfc3RvcmUiLCJUT0tFTiIsIlNMQUNLX1RPS0VOIiwiY3VzdG9tSW50ZWdyYXRpb24iLCJ0b2tlbiIsImNvbnRyb2xsZXIiLCJjb25maWd1cmUiLCJleGl0Iiwib24iLCJtc2ciLCJyZXBseSIsImhlYXJzIiwic3RhcnRDb252ZXJzYXRpb24iLCJhc2siLCJyZXNwb25zZSIsImNyZWF0ZU5ld1Nlc3Npb24iLCJuYW1lU2Vzc2lvbiIsInRleHQiLCJwdXNoIiwiY2hhbm5lbCIsIm5leHQiLCJpbmRleE9mIiwicHVzaE1zZyIsImVuZFNlc3Npb24iLCJmcyIsIndyaXRlRmlsZSIsIm5hbWUiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxTQUFTLEVBQWI7QUFDQSxJQUFJQyxvQkFBb0IsRUFBeEI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7O0FBRUEsU0FBU0MsY0FBVCxDQUF3QkMsR0FBeEIsRUFBNkJDLFNBQTdCLEVBQXdDO0FBQ3BDLFFBQUlBLFNBQUosRUFBZTtBQUNYRCxZQUFJRSx3QkFBSixDQUE2QixFQUFDQyxNQUFNRixTQUFQLEVBQTdCLEVBQWdELFVBQVVHLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUNsRSxnQkFBSUQsR0FBSixFQUFTO0FBQ0xFLHdCQUFRQyxHQUFSLENBQVlILEdBQVo7QUFDSCxhQUZELE1BRU87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QXhCLEVBQWtELFVBQVMzQixHQUFULEVBQWF5QixHQUFiLEVBQWtCO0FBQ2hFM0IsWUFBUXlDLFVBQVIsQ0FBbUJkLEdBQW5COztBQUVBO0FBQ0FlLE9BQUdDLFNBQUgsYUFBdUIzQyxRQUFRNEMsSUFBL0IsWUFBNENDLEtBQUtDLFNBQUwsQ0FBZTlDLE9BQWYsQ0FBNUMsRUFBcUUsVUFBVU0sR0FBVixFQUFlO0FBQ2hGLFlBQUlBLEdBQUosRUFBUyxPQUFPRSxRQUFRQyxHQUFSLENBQVlILEdBQVosQ0FBUDtBQUNaLEtBRkQ7O0FBSUFKLFFBQUkwQixLQUFKLENBQVVELEdBQVYsRUFBZSxxQkFBZjs7QUFFQW5CLFlBQVFDLEdBQVIsQ0FBWSxxQ0FBWjtBQUNBRCxZQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QlQsT0FBeEI7QUFDQyxDQVpMIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBtb2NrIGZyb20gJy4vbW9jaydcbmltcG9ydCBzZXNzaW9uVXRpbHMgZnJvbSAnLi9zZXNzaW9uLXV0aWxzJ1xuXG5sZXQgY29uZmlnID0ge307XG5sZXQgcmVjb3JkaW5nQ2hhbm5lbHMgPSBbXTtcbmxldCBzZXNzaW9uID0ge31cblxuZnVuY3Rpb24gb25JbnN0YWxsYXRpb24oYm90LCBpbnN0YWxsZXIpIHtcbiAgICBpZiAoaW5zdGFsbGVyKSB7XG4gICAgICAgIGJvdC5zdGFydFByaXZhdGVDb252ZXJzYXRpb24oe3VzZXI6IGluc3RhbGxlcn0sIGZ1bmN0aW9uIChlcnIsIGNvbnZvKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udm8uc2F5KCdJIGFtIGEgYm90IHRoYXQgaGFzIGp1c3Qgam9pbmVkIHlvdXIgdGVhbScpO1xuICAgICAgICAgICAgICAgIGNvbnZvLnNheSgnWW91IG11c3Qgbm93IC9pbnZpdGUgbWUgdG8gYSBjaGFubmVsIHNvIHRoYXQgSSBjYW4gYmUgb2YgdXNlIScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8qKlxuICogQ29uZmlndXJlIHRoZSBwZXJzaXN0ZW5jZSBvcHRpb25zXG4gKi9cbmlmIChwcm9jZXNzLmVudi5NT05HT0xBQl9VUkkpIHtcbiAgICB2YXIgQm90a2l0U3RvcmFnZSA9IHJlcXVpcmUoJ2JvdGtpdC1zdG9yYWdlLW1vbmdvJyk7XG4gICAgY29uZmlnID0ge1xuICAgICAgICBzdG9yYWdlOiBCb3RraXRTdG9yYWdlKHttb25nb1VyaTogcHJvY2Vzcy5lbnYuTU9OR09MQUJfVVJJfSksXG4gICAgfTtcbn0gZWxzZSB7XG4gICAgY29uZmlnID0ge1xuICAgICAgICBqc29uX2ZpbGVfc3RvcmU6ICgocHJvY2Vzcy5lbnYuVE9LRU4pPycuL2RiX3NsYWNrX2JvdF9jaS8nOicuL2RiX3NsYWNrX2JvdF9hLycpLCAvL3VzZSBhIGRpZmZlcmVudCBuYW1lIGlmIGFuIGFwcCBvciBDSVxuICAgIH07XG59XG5cbmlmIChwcm9jZXNzLmVudi5UT0tFTiB8fCBwcm9jZXNzLmVudi5TTEFDS19UT0tFTikge1xuXG4gICAgdmFyIGN1c3RvbUludGVncmF0aW9uID0gcmVxdWlyZSgnLi9jdXN0b21faW50ZWdyYXRpb25zJyk7XG4gICAgdmFyIHRva2VuID0gKHByb2Nlc3MuZW52LlRPS0VOKSA/IHByb2Nlc3MuZW52LlRPS0VOIDogcHJvY2Vzcy5lbnYuU0xBQ0tfVE9LRU47XG4gICAgdmFyIGNvbnRyb2xsZXIgPSBjdXN0b21JbnRlZ3JhdGlvbi5jb25maWd1cmUodG9rZW4sIGNvbmZpZywgb25JbnN0YWxsYXRpb24pO1xufSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnRXJyb3I6IElmIHRoaXMgaXMgYSBjdXN0b20gaW50ZWdyYXRpb24sIHBsZWFzZSBzcGVjaWZ5IFRPS0VOIGluIHRoZSBlbnZpcm9ubWVudC4gSWYgdGhpcyBpcyBhbiBhcHAsIHBsZWFzZSBzcGVjaWZ5IENMSUVOVElELCBDTElFTlRTRUNSRVQsIGFuZCBQT1JUIGluIHRoZSBlbnZpcm9ubWVudCcpO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbn1cblxuXG4gICAgLyoqXG4gICAgICogVE9ETzogZml4ZWQgYjBya2VkIHJlY29ubmVjdCBiZWhhdmlvclxuICAgICAqL1xuLy8gSGFuZGxlIGV2ZW50cyByZWxhdGVkIHRvIHRoZSB3ZWJzb2NrZXQgY29ubmVjdGlvbiB0byBTbGFja1xuY29udHJvbGxlci5vbigncnRtX29wZW4nLCBmdW5jdGlvbiAoYm90KSB7XG4gICAgY29uc29sZS5sb2coJyoqIFRoZSBSVE0gYXBpIGp1c3QgY29ubmVjdGVkIScpO1xufSk7XG5cbmNvbnRyb2xsZXIub24oJ3J0bV9jbG9zZScsIGZ1bmN0aW9uIChib3QpIHtcbiAgICBjb25zb2xlLmxvZygnKiogVGhlIFJUTSBhcGkganVzdCBjbG9zZWQnKTtcbiAgICAvLyB5b3UgbWF5IHdhbnQgdG8gYXR0ZW1wdCB0byByZS1vcGVuXG59KTtcblxuY29udHJvbGxlci5vbignYm90X2NoYW5uZWxfam9pbicsIGZ1bmN0aW9uIChib3QsIG1zZykge1xuICAgIGJvdC5yZXBseShtc2csIFwiSSdtIGhlcmUhXCIpXG4gICAgLy8gVE9ETzogUmVhZCBmcm9tIEZTXG4gICAgLy8gc2Vzc2lvbiA9IEpTT04ucGFyc2UoZnMucmVhZClcbn0pO1xuXG5jb250cm9sbGVyLmhlYXJzKCdzdGFydCcsICdkaXJlY3RfbWVzc2FnZSxkaXJlY3RfbWVudGlvbixtZW50aW9uJywgZnVuY3Rpb24oYm90LCBtc2cpIHtcbiAgICBib3Quc3RhcnRDb252ZXJzYXRpb24obXNnICxmdW5jdGlvbihlcnIsY29udm8pIHtcbiAgICAgICAgY29udm8uYXNrKCdIb3cgd291bGQgeW91IGxpa2UgdG8gY2FsbCBpdD8nLGZ1bmN0aW9uKHJlc3BvbnNlLGNvbnZvKSB7XG4gICAgICAgICAgICBzZXNzaW9uID0gc2Vzc2lvblV0aWxzLmNyZWF0ZU5ld1Nlc3Npb24oc2Vzc2lvbiwgbXNnLCByZWNvcmRpbmdDaGFubmVscylcbiAgICAgICAgICAgIHNlc3Npb24ubmFtZVNlc3Npb24oc2Vzc2lvbiwgcmVzcG9uc2UudGV4dClcbiAgICAgICAgICAgIHJlY29yZGluZ0NoYW5uZWxzLnB1c2gobXNnLmNoYW5uZWwpXG4gICAgICAgICAgICBjb252by5zYXkoJ1N0YXJ0aW5nICcgKyByZXNwb25zZS50ZXh0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tIFN0YXJ0IFJlY29yZGluZyDwn4aVIC0tLS0tLS0nKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0N1cnJlbnRseSBsaXN0ZW50aW5nIHRvICcsIHJlY29yZGluZ0NoYW5uZWxzKVxuICAgICAgICAgICAgY29udm8ubmV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTtcblxuY29udHJvbGxlci5vbignYW1iaWVudCcsIChib3QsIG1zZykgPT4ge1xuICAgIGlmKHJlY29yZGluZ0NoYW5uZWxzLmluZGV4T2YobXNnLmNoYW5uZWwpID4gLTEpe1xuICAgICAgICBzZXNzaW9uLnB1c2hNc2cobXNnKVxuICAgIH1cbn0pO1xuXG5jb250cm9sbGVyLmhlYXJzKCdlbmQnLCAnZGlyZWN0X21lbnRpb24sbWVudGlvbicsIGZ1bmN0aW9uKGJvdCxtc2cpIHtcbiAgICBzZXNzaW9uLmVuZFNlc3Npb24obXNnKVxuICAgIFxuICAgIC8vIFRPRE8gTmFtZSBieSB0ZWFtIGFuZCBjaGFubmVsXG4gICAgZnMud3JpdGVGaWxlKGAuL2RhdGEvJHtzZXNzaW9uLm5hbWV9Lmpzb25gLCBKU09OLnN0cmluZ2lmeShzZXNzaW9uKSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcblxuICAgIGJvdC5yZXBseShtc2csICdGaW5pc2ggUmVjb3JkaW5nIPCfjoonKVxuICAgIFxuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tIEZpbmlzaCBSZWNvcmRpbmcg8J+OiiAtLS0tLS0tJylcbiAgICBjb25zb2xlLmxvZygnc2Vzc2lvbiAnLCBzZXNzaW9uKVxuICAgIH1cbik7Il19