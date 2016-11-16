const fs = require('fs')

const start = function(session, msg, recordingChannels) {
    session.startTime = msg.ts;
    session.channel = msg.channel
    recordingChannels.push(msg.channel)
    session.messages = session.messages ? session.messages : []

    // TODO session.id
}

const pushMsgToSession = function(session, msg) {
    session.messages.push(msg)
}

const nameSession = function(session, name) {
    session.name = name
}

const saveSessionToFs = function(session, endMsg) {
    session.endTime = endMsg.ts;
    // TODO Name by team and channel
    fs.writeFile(`./lib/data/${session.name}.json`, JSON.stringify(session), function (err) {
        if (err) return console.log(err);
    });
}

module.exports = {
    start,
    pushMsgToSession,
    saveSessionToFs,
    nameSession
}
