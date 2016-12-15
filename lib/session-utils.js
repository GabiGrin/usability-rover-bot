"use strict";

const fs = require('fs')

const SessionHandler = session => 
    ({
        nameSession: name => session.name = name,
        getSession: () => session,
        pushMsg: msg => session.messages.push(msg),
        endSession: endMsg => session.endTime = endMsg.ts,
        map: f => SessionHandler(f(session)),
        fold: f => f(session)
    })

const createNewSession = (startMsg/*, recordingChannels*/) => {
    let session = {
        startTime: startMsg.ts,
        channel: startMsg.channel,
        messages: [],
        id: 0
    }

    // TODO Fire event

    return Object.assign(
        {},
        SessionHandler(session)
   )
}

const startRecordingChannel = function(){}



module.exports = {
    createNewSession
}
