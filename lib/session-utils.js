"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNewSession = undefined;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SessionHandler = function SessionHandler(session) {
    return {
        nameSession: function nameSession(name) {
            return session.name = name;
        },
        getSession: function getSession() {
            return session;
        },
        pushMsg: function pushMsg(msg) {
            return session.messages.push(msg);
        },
        endSession: function endSession(endMsg) {
            return session.endTime = endMsg.ts;
        },
        map: function map(f) {
            return SessionHandler(f(session));
        },
        fold: function fold(f) {
            return f(session);
        }
    };
};

var createNewSession = exports.createNewSession = function createNewSession(startMsg /*, recordingChannels*/) {
    var session = {
        startTime: startMsg.ts,
        channel: startMsg.channel,
        messages: [],
        id: 0
    };

    // TODO Fire event

    return Object.assign({}, SessionHandler(session));
};

var startRecordingChannel = function startRecordingChannel() {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXNzaW9uLXV0aWxzLmpzIl0sIm5hbWVzIjpbIlNlc3Npb25IYW5kbGVyIiwibmFtZVNlc3Npb24iLCJzZXNzaW9uIiwibmFtZSIsImdldFNlc3Npb24iLCJwdXNoTXNnIiwibWVzc2FnZXMiLCJwdXNoIiwibXNnIiwiZW5kU2Vzc2lvbiIsImVuZFRpbWUiLCJlbmRNc2ciLCJ0cyIsIm1hcCIsImYiLCJmb2xkIiwiY3JlYXRlTmV3U2Vzc2lvbiIsInN0YXJ0TXNnIiwic3RhcnRUaW1lIiwiY2hhbm5lbCIsImlkIiwiT2JqZWN0IiwiYXNzaWduIiwic3RhcnRSZWNvcmRpbmdDaGFubmVsIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsU0FBakJBLGNBQWlCO0FBQUEsV0FDbEI7QUFDR0MscUJBQWE7QUFBQSxtQkFBUUMsUUFBUUMsSUFBUixHQUFlQSxJQUF2QjtBQUFBLFNBRGhCO0FBRUdDLG9CQUFZO0FBQUEsbUJBQU1GLE9BQU47QUFBQSxTQUZmO0FBR0dHLGlCQUFTO0FBQUEsbUJBQU9ILFFBQVFJLFFBQVIsQ0FBaUJDLElBQWpCLENBQXNCQyxHQUF0QixDQUFQO0FBQUEsU0FIWjtBQUlHQyxvQkFBWTtBQUFBLG1CQUFVUCxRQUFRUSxPQUFSLEdBQWtCQyxPQUFPQyxFQUFuQztBQUFBLFNBSmY7QUFLR0MsYUFBSztBQUFBLG1CQUFLYixlQUFlYyxFQUFFWixPQUFGLENBQWYsQ0FBTDtBQUFBLFNBTFI7QUFNR2EsY0FBTTtBQUFBLG1CQUFLRCxFQUFFWixPQUFGLENBQUw7QUFBQTtBQU5ULEtBRGtCO0FBQUEsQ0FBdkI7O0FBVU8sSUFBTWMsOENBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsUUFBRCxDQUFTLHVCQUFULEVBQXFDO0FBQ2pFLFFBQUlmLFVBQVU7QUFDVmdCLG1CQUFXRCxTQUFTTCxFQURWO0FBRVZPLGlCQUFTRixTQUFTRSxPQUZSO0FBR1ZiLGtCQUFVLEVBSEE7QUFJVmMsWUFBSTtBQUpNLEtBQWQ7O0FBT0E7O0FBRUEsV0FBT0MsT0FBT0MsTUFBUCxDQUNILEVBREcsRUFFSHRCLGVBQWVFLE9BQWYsQ0FGRyxDQUFQO0FBSUgsQ0FkTTs7QUFnQlAsSUFBTXFCLHdCQUF3QixTQUF4QkEscUJBQXdCLEdBQVUsQ0FBRSxDQUExQyIsImZpbGUiOiJzZXNzaW9uLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmNvbnN0IFNlc3Npb25IYW5kbGVyID0gc2Vzc2lvbiA9PiBcbiAgICAoe1xuICAgICAgICBuYW1lU2Vzc2lvbjogbmFtZSA9PiBzZXNzaW9uLm5hbWUgPSBuYW1lLFxuICAgICAgICBnZXRTZXNzaW9uOiAoKSA9PiBzZXNzaW9uLFxuICAgICAgICBwdXNoTXNnOiBtc2cgPT4gc2Vzc2lvbi5tZXNzYWdlcy5wdXNoKG1zZyksXG4gICAgICAgIGVuZFNlc3Npb246IGVuZE1zZyA9PiBzZXNzaW9uLmVuZFRpbWUgPSBlbmRNc2cudHMsXG4gICAgICAgIG1hcDogZiA9PiBTZXNzaW9uSGFuZGxlcihmKHNlc3Npb24pKSxcbiAgICAgICAgZm9sZDogZiA9PiBmKHNlc3Npb24pXG4gICAgfSlcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZU5ld1Nlc3Npb24gPSAoc3RhcnRNc2cvKiwgcmVjb3JkaW5nQ2hhbm5lbHMqLykgPT4ge1xuICAgIGxldCBzZXNzaW9uID0ge1xuICAgICAgICBzdGFydFRpbWU6IHN0YXJ0TXNnLnRzLFxuICAgICAgICBjaGFubmVsOiBzdGFydE1zZy5jaGFubmVsLFxuICAgICAgICBtZXNzYWdlczogW10sXG4gICAgICAgIGlkOiAwXG4gICAgfVxuXG4gICAgLy8gVE9ETyBGaXJlIGV2ZW50XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIFNlc3Npb25IYW5kbGVyKHNlc3Npb24pXG4gICApXG59XG5cbmNvbnN0IHN0YXJ0UmVjb3JkaW5nQ2hhbm5lbCA9IGZ1bmN0aW9uKCl7fVxuXG5cbiJdfQ==