'use strict';

/**
 * Helpers for configuring a bot as an app
 * https://api.slack.com/slack-apps
 */

var Botkit = require('botkit');

var _bots = {};

function _trackBot(bot) {
    _bots[bot.config.token] = bot;
}

function die(err) {
    console.log(err);
    process.exit(1);
}

module.exports = {
    configure: function configure(port, clientId, clientSecret, config, onInstallation) {
        var controller = Botkit.slackbot(config).configureSlackApp({
            clientId: clientId,
            clientSecret: clientSecret,
            scopes: ['bot'] });

        controller.setupWebserver(process.env.PORT, function (err, webserver) {
            controller.createWebhookEndpoints(controller.webserver);

            controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
                if (err) {
                    res.status(500).send('ERROR: ' + err);
                } else {
                    res.send('Success!');
                }
            });
        });

        controller.on('create_bot', function (bot, config) {

            if (_bots[bot.config.token]) {
                // already online! do nothing.
            } else {

                bot.startRTM(function (err) {
                    if (err) {
                        die(err);
                    }

                    _trackBot(bot);

                    if (onInstallation) onInstallation(bot, config.createdBy);
                });
            }
        });

        controller.storage.teams.all(function (err, teams) {

            if (err) {
                throw new Error(err);
            }

            // connect all teams with bots up to slack!
            for (var t in teams) {
                if (teams[t].bot) {
                    var bot = controller.spawn(teams[t]).startRTM(function (err) {
                        if (err) {
                            console.log('Error connecting bot to Slack:', err);
                        } else {
                            _trackBot(bot);
                        }
                    });
                }
            }
        });

        return controller;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBzLmpzIl0sIm5hbWVzIjpbIkJvdGtpdCIsInJlcXVpcmUiLCJfYm90cyIsIl90cmFja0JvdCIsImJvdCIsImNvbmZpZyIsInRva2VuIiwiZGllIiwiZXJyIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJleGl0IiwibW9kdWxlIiwiZXhwb3J0cyIsImNvbmZpZ3VyZSIsInBvcnQiLCJjbGllbnRJZCIsImNsaWVudFNlY3JldCIsIm9uSW5zdGFsbGF0aW9uIiwiY29udHJvbGxlciIsInNsYWNrYm90IiwiY29uZmlndXJlU2xhY2tBcHAiLCJzY29wZXMiLCJzZXR1cFdlYnNlcnZlciIsImVudiIsIlBPUlQiLCJ3ZWJzZXJ2ZXIiLCJjcmVhdGVXZWJob29rRW5kcG9pbnRzIiwiY3JlYXRlT2F1dGhFbmRwb2ludHMiLCJyZXEiLCJyZXMiLCJzdGF0dXMiLCJzZW5kIiwib24iLCJzdGFydFJUTSIsImNyZWF0ZWRCeSIsInN0b3JhZ2UiLCJ0ZWFtcyIsImFsbCIsIkVycm9yIiwidCIsInNwYXduIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLElBQUlBLFNBQVNDLFFBQVEsUUFBUixDQUFiOztBQUVBLElBQUlDLFFBQVEsRUFBWjs7QUFFQSxTQUFTQyxTQUFULENBQW1CQyxHQUFuQixFQUF3QjtBQUNwQkYsVUFBTUUsSUFBSUMsTUFBSixDQUFXQyxLQUFqQixJQUEwQkYsR0FBMUI7QUFDSDs7QUFFRCxTQUFTRyxHQUFULENBQWFDLEdBQWIsRUFBa0I7QUFDZEMsWUFBUUMsR0FBUixDQUFZRixHQUFaO0FBQ0FHLFlBQVFDLElBQVIsQ0FBYSxDQUFiO0FBQ0g7O0FBRURDLE9BQU9DLE9BQVAsR0FBaUI7QUFDYkMsZUFBVyxtQkFBVUMsSUFBVixFQUFnQkMsUUFBaEIsRUFBMEJDLFlBQTFCLEVBQXdDYixNQUF4QyxFQUFnRGMsY0FBaEQsRUFBZ0U7QUFDdkUsWUFBSUMsYUFBYXBCLE9BQU9xQixRQUFQLENBQWdCaEIsTUFBaEIsRUFBd0JpQixpQkFBeEIsQ0FDYjtBQUNJTCxzQkFBVUEsUUFEZDtBQUVJQywwQkFBY0EsWUFGbEI7QUFHSUssb0JBQVEsQ0FBQyxLQUFELENBSFosRUFEYSxDQUFqQjs7QUFRQUgsbUJBQVdJLGNBQVgsQ0FBMEJiLFFBQVFjLEdBQVIsQ0FBWUMsSUFBdEMsRUFBMkMsVUFBU2xCLEdBQVQsRUFBYW1CLFNBQWIsRUFBd0I7QUFDL0RQLHVCQUFXUSxzQkFBWCxDQUFrQ1IsV0FBV08sU0FBN0M7O0FBRUFQLHVCQUFXUyxvQkFBWCxDQUFnQ1QsV0FBV08sU0FBM0MsRUFBcUQsVUFBU25CLEdBQVQsRUFBYXNCLEdBQWIsRUFBaUJDLEdBQWpCLEVBQXNCO0FBQ3ZFLG9CQUFJdkIsR0FBSixFQUFTO0FBQ0x1Qix3QkFBSUMsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCLFlBQVl6QixHQUFqQztBQUNILGlCQUZELE1BRU87QUFDSHVCLHdCQUFJRSxJQUFKLENBQVMsVUFBVDtBQUNIO0FBQ0osYUFORDtBQU9ILFNBVkQ7O0FBWUFiLG1CQUFXYyxFQUFYLENBQWMsWUFBZCxFQUE0QixVQUFVOUIsR0FBVixFQUFlQyxNQUFmLEVBQXVCOztBQUUvQyxnQkFBSUgsTUFBTUUsSUFBSUMsTUFBSixDQUFXQyxLQUFqQixDQUFKLEVBQTZCO0FBQ3pCO0FBQ0gsYUFGRCxNQUVPOztBQUVIRixvQkFBSStCLFFBQUosQ0FBYSxVQUFVM0IsR0FBVixFQUFlO0FBQ3hCLHdCQUFJQSxHQUFKLEVBQVM7QUFDTEQsNEJBQUlDLEdBQUo7QUFDSDs7QUFFREwsOEJBQVVDLEdBQVY7O0FBRUEsd0JBQUllLGNBQUosRUFBb0JBLGVBQWVmLEdBQWYsRUFBb0JDLE9BQU8rQixTQUEzQjtBQUN2QixpQkFSRDtBQVNIO0FBQ0osU0FoQkQ7O0FBbUJBaEIsbUJBQVdpQixPQUFYLENBQW1CQyxLQUFuQixDQUF5QkMsR0FBekIsQ0FBNkIsVUFBVS9CLEdBQVYsRUFBZThCLEtBQWYsRUFBc0I7O0FBRS9DLGdCQUFJOUIsR0FBSixFQUFTO0FBQ0wsc0JBQU0sSUFBSWdDLEtBQUosQ0FBVWhDLEdBQVYsQ0FBTjtBQUNIOztBQUVEO0FBQ0EsaUJBQUssSUFBSWlDLENBQVQsSUFBZUgsS0FBZixFQUFzQjtBQUNsQixvQkFBSUEsTUFBTUcsQ0FBTixFQUFTckMsR0FBYixFQUFrQjtBQUNkLHdCQUFJQSxNQUFNZ0IsV0FBV3NCLEtBQVgsQ0FBaUJKLE1BQU1HLENBQU4sQ0FBakIsRUFBMkJOLFFBQTNCLENBQW9DLFVBQVUzQixHQUFWLEVBQWU7QUFDekQsNEJBQUlBLEdBQUosRUFBUztBQUNMQyxvQ0FBUUMsR0FBUixDQUFZLGdDQUFaLEVBQThDRixHQUE5QztBQUNILHlCQUZELE1BRU87QUFDSEwsc0NBQVVDLEdBQVY7QUFDSDtBQUNKLHFCQU5TLENBQVY7QUFPSDtBQUNKO0FBRUosU0FuQkQ7O0FBc0JBLGVBQU9nQixVQUFQO0FBR0g7QUFsRVksQ0FBakIiLCJmaWxlIjoiYXBwcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSGVscGVycyBmb3IgY29uZmlndXJpbmcgYSBib3QgYXMgYW4gYXBwXG4gKiBodHRwczovL2FwaS5zbGFjay5jb20vc2xhY2stYXBwc1xuICovXG5cbnZhciBCb3RraXQgPSByZXF1aXJlKCdib3RraXQnKTtcblxudmFyIF9ib3RzID0ge307XG5cbmZ1bmN0aW9uIF90cmFja0JvdChib3QpIHtcbiAgICBfYm90c1tib3QuY29uZmlnLnRva2VuXSA9IGJvdDtcbn1cblxuZnVuY3Rpb24gZGllKGVycikge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb25maWd1cmU6IGZ1bmN0aW9uIChwb3J0LCBjbGllbnRJZCwgY2xpZW50U2VjcmV0LCBjb25maWcsIG9uSW5zdGFsbGF0aW9uKSB7XG4gICAgICAgIHZhciBjb250cm9sbGVyID0gQm90a2l0LnNsYWNrYm90KGNvbmZpZykuY29uZmlndXJlU2xhY2tBcHAoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xpZW50SWQ6IGNsaWVudElkLFxuICAgICAgICAgICAgICAgIGNsaWVudFNlY3JldDogY2xpZW50U2VjcmV0LFxuICAgICAgICAgICAgICAgIHNjb3BlczogWydib3QnXSwgLy9UT0RPIGl0IHdvdWxkIGJlIGdvb2QgdG8gbW92ZSB0aGlzIG91dCBhIGxldmVsLCBzbyBpdCBjYW4gYmUgY29uZmlndXJlZCBhdCB0aGUgcm9vdCBsZXZlbFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnRyb2xsZXIuc2V0dXBXZWJzZXJ2ZXIocHJvY2Vzcy5lbnYuUE9SVCxmdW5jdGlvbihlcnIsd2Vic2VydmVyKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLmNyZWF0ZVdlYmhvb2tFbmRwb2ludHMoY29udHJvbGxlci53ZWJzZXJ2ZXIpO1xuXG4gICAgICAgICAgICBjb250cm9sbGVyLmNyZWF0ZU9hdXRoRW5kcG9pbnRzKGNvbnRyb2xsZXIud2Vic2VydmVyLGZ1bmN0aW9uKGVycixyZXEscmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCgnRVJST1I6ICcgKyBlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKCdTdWNjZXNzIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250cm9sbGVyLm9uKCdjcmVhdGVfYm90JywgZnVuY3Rpb24gKGJvdCwgY29uZmlnKSB7XG5cbiAgICAgICAgICAgIGlmIChfYm90c1tib3QuY29uZmlnLnRva2VuXSkge1xuICAgICAgICAgICAgICAgIC8vIGFscmVhZHkgb25saW5lISBkbyBub3RoaW5nLlxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGJvdC5zdGFydFJUTShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZShlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgX3RyYWNrQm90KGJvdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uSW5zdGFsbGF0aW9uKSBvbkluc3RhbGxhdGlvbihib3QsIGNvbmZpZy5jcmVhdGVkQnkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGNvbnRyb2xsZXIuc3RvcmFnZS50ZWFtcy5hbGwoZnVuY3Rpb24gKGVyciwgdGVhbXMpIHtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb25uZWN0IGFsbCB0ZWFtcyB3aXRoIGJvdHMgdXAgdG8gc2xhY2shXG4gICAgICAgICAgICBmb3IgKHZhciB0ICBpbiB0ZWFtcykge1xuICAgICAgICAgICAgICAgIGlmICh0ZWFtc1t0XS5ib3QpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJvdCA9IGNvbnRyb2xsZXIuc3Bhd24odGVhbXNbdF0pLnN0YXJ0UlRNKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgY29ubmVjdGluZyBib3QgdG8gU2xhY2s6JywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RyYWNrQm90KGJvdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xuXG5cbiAgICB9XG59XG4iXX0=