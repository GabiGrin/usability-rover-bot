const fs = require('fs')

const start = function(session, msg, recordingChannels) {
    session.startTime = msg.ts;
    recordingChannels.push(msg.channel)
    session.messages = session.messages ? session.messages : []
}

const pushMsgToSession = function(session, msg) {
    session.messages.push(msg)
}

const saveSessionToFs = function(session, endMsg) {
    session.endTime = endMsg.ts;
    fs.writeFile('./lib/data/session.json', JSON.stringify(session), function (err) {
        if (err) return console.log(err);
    });
}

module.exports = {
    start,
    pushMsgToSession,
    saveSessionToFs
}
