"use strict";

const fs = require('fs')

const sessionHandler = (session) => ({
    nameSession: (name) => session.name = name,
    getSession: () => {return session},
    pushMsg: (msg) => session.messages.push(msg)
})

const createNewSession = (startMsg/*, recordingChannels*/) => {
    let session = {
        startTime: startMsg.ts,
        channel: startMsg.channel,
        messages: [],
        id: 0
    }

    // Fire event

    return Object.assign(
        {},
        sessionHandler(session)
   )
}
// const pushMsgToSession = function(session, msg) {
//     session.messages.push(msg)
// }
//
// const nameSession = function(session, name) {
//     session.name = name
// }

const startRecordingChannel = function(){}

const saveSessionToFs = function(session, endMsg) {
    session.endTime = endMsg.ts;
    // TODO Name by team and channel
    fs.writeFile(`./lib/data/${session.name}.json`, JSON.stringify(session), function (err) {
        if (err) return console.log(err);
    });
}

module.exports = {
    createNewSession
}
