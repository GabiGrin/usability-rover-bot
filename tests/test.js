"use strict";

const test = require('tape')
const mock = require('../lib/mock')
const sessionUtils = require('../lib/session-utils')

test('Session factory.', (assert) => {
    let mockSession,
        mockSessionState,
        sessionTimestamp,
        sessionChannel,
        sessionMessages,
        sessionId

    mockSession = sessionUtils.createNewSession(mock.startMsg)
    mockSessionState = mockSession.getSession()
    // console.log(mockSessionState)

    assert.equal(typeof mockSessionState, 'object',
        'Expect an object')

    sessionTimestamp = mockSessionState.startTime
    assert.ok(sessionTimestamp,
        'Expect to find a session starting time')

    sessionChannel = mockSessionState.channel
    assert.ok(sessionChannel,
        'Expect to find a session channel')

    sessionMessages = mockSessionState.messages
    assert.equal(sessionMessages.length, 0,
        'Expect to find an empty messages array')

    sessionId = mockSessionState.id
    assert.equal(sessionId, 0,
        'Expect to find an ID 0')

    assert.end()
});

test('Given a session, add a name.', (assert) => {
    let mockSession,
        mockSessionStateName    

    mockSession = sessionUtils.createNewSession(mock.startMsg)
    mockSessionStateName = mockSession.getSession().name

    assert.equal(mockSessionStateName, undefined,
        'Expected session name to be empty');
    
    mockSession.nameSession('gaga')    

    mockSessionStateName = mockSession.getSession().name
    assert.equal(mockSessionStateName, 'gaga',
        'Expected session name to be gaga');

    assert.end();
});

test('Add a message to the session', (assert) => {
    let mockSession,
        mockSessionMessages    

    mockSession = sessionUtils.createNewSession(mock.startMsg)
    mockSessionMessages = mockSession.getSession().messages

    assert.equal(mockSessionMessages.length, 0,
        'Expected messages array to be empty');
    
    mockSession.pushMsg(mock.messages[0])

    assert.equal(mockSessionMessages.length, 1,
        'Expected messages array to have one item');

    assert.end();
});
