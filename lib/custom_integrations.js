'use strict';

/**
 * Helpers for configuring a bot as a custom integration
 * https://api.slack.com/custom-integrations
 */

var Botkit = require('botkit');

function die(err) {
    console.log(err);
    process.exit(1);
}

module.exports = {
    configure: function configure(token, config, onInstallation) {

        var controller = Botkit.slackbot(config);

        var bot = controller.spawn({
            token: token
        });

        bot.startRTM(function (err, bot, payload) {

            if (err) {
                die(err);
            }

            if (onInstallation) onInstallation(bot);
        });

        return controller;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jdXN0b21faW50ZWdyYXRpb25zLmpzIl0sIm5hbWVzIjpbIkJvdGtpdCIsInJlcXVpcmUiLCJkaWUiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwicHJvY2VzcyIsImV4aXQiLCJtb2R1bGUiLCJleHBvcnRzIiwiY29uZmlndXJlIiwidG9rZW4iLCJjb25maWciLCJvbkluc3RhbGxhdGlvbiIsImNvbnRyb2xsZXIiLCJzbGFja2JvdCIsImJvdCIsInNwYXduIiwic3RhcnRSVE0iLCJwYXlsb2FkIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLElBQUlBLFNBQVNDLFFBQVEsUUFBUixDQUFiOztBQUVBLFNBQVNDLEdBQVQsQ0FBYUMsR0FBYixFQUFrQjtBQUNkQyxZQUFRQyxHQUFSLENBQVlGLEdBQVo7QUFDQUcsWUFBUUMsSUFBUixDQUFhLENBQWI7QUFDSDs7QUFFREMsT0FBT0MsT0FBUCxHQUFpQjtBQUNiQyxlQUFXLG1CQUFVQyxLQUFWLEVBQWlCQyxNQUFqQixFQUF5QkMsY0FBekIsRUFBeUM7O0FBRWhELFlBQUlDLGFBQWFkLE9BQU9lLFFBQVAsQ0FBZ0JILE1BQWhCLENBQWpCOztBQUVBLFlBQUlJLE1BQU1GLFdBQVdHLEtBQVgsQ0FBaUI7QUFDdkJOLG1CQUFPQTtBQURnQixTQUFqQixDQUFWOztBQUtBSyxZQUFJRSxRQUFKLENBQWEsVUFBVWYsR0FBVixFQUFlYSxHQUFmLEVBQW9CRyxPQUFwQixFQUE2Qjs7QUFFdEMsZ0JBQUloQixHQUFKLEVBQVM7QUFDTEQsb0JBQUlDLEdBQUo7QUFDSDs7QUFFRCxnQkFBR1UsY0FBSCxFQUFtQkEsZUFBZUcsR0FBZjtBQUV0QixTQVJEOztBQVVBLGVBQU9GLFVBQVA7QUFDSDtBQXJCWSxDQUFqQiIsImZpbGUiOiJjdXN0b21faW50ZWdyYXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBIZWxwZXJzIGZvciBjb25maWd1cmluZyBhIGJvdCBhcyBhIGN1c3RvbSBpbnRlZ3JhdGlvblxuICogaHR0cHM6Ly9hcGkuc2xhY2suY29tL2N1c3RvbS1pbnRlZ3JhdGlvbnNcbiAqL1xuXG52YXIgQm90a2l0ID0gcmVxdWlyZSgnYm90a2l0Jyk7XG5cbmZ1bmN0aW9uIGRpZShlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIHByb2Nlc3MuZXhpdCgxKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29uZmlndXJlOiBmdW5jdGlvbiAodG9rZW4sIGNvbmZpZywgb25JbnN0YWxsYXRpb24pIHtcblxuICAgICAgICB2YXIgY29udHJvbGxlciA9IEJvdGtpdC5zbGFja2JvdChjb25maWcpO1xuXG4gICAgICAgIHZhciBib3QgPSBjb250cm9sbGVyLnNwYXduKHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGJvdC5zdGFydFJUTShmdW5jdGlvbiAoZXJyLCBib3QsIHBheWxvYWQpIHtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGRpZShlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihvbkluc3RhbGxhdGlvbikgb25JbnN0YWxsYXRpb24oYm90KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG59OyJdfQ==