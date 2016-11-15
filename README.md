# Usability Rover
The simplest way for your team to record and document usability tests.

# Botkit's awesome setup guide
1. Fork this project.
2. Open up your favorite terminal app, and clone your new repository to your local computer.
3. This is a Node.js project, so you’ll need to install the various dependencies by running:
    npm install
4. Edit `package.json` to give your bot a name and update the GitHub URLs to reflect the location of your fork in GitHub.
5. Go to https://my.slack.com/apps/new/A0F7YS25R-bots and pick a name for your new bot.
6. Once you’ve clicked “Add integration,” you’ll be taken to a page where you can further customize your bot. Of importance is the bot token—take note of it now.
7. Once you have the token, you can run your bot easily:

    ```bash
    TOKEN=xoxb-your-token-here npm start
    ```

    Your bot will now attempt to log into your team, and you should be able talk to it. Telling it to "start"

8. Botkit is structured around event listeners. The most important is the “hear” listener, which kicks off an action when your bot hears something. `index.js` contains the core logic, and has this event listener:

    ```javascript
    controller.hears('hello','direct_message', function(bot,message) {
        bot.reply(message, 'Hello!');
    });
    ```

    This event handler is triggered when the bot receives a direct message from a user that contains the word “hello.”

    The bot responds in the direct message with, “Hello!”

9. You can listen to any kind of message or you can configure your bot to only listen to direct messages or specific @-mentions of your bot. It’s up to you! To start let’s re-write the event listener to be more  flexible about the greetings it is listening for:
    ```javascript
    controller.hears(['hello', 'hi', 'greetings'], ['direct_mention', 'mention', 'direct_message'], function(bot,message) {
         bot.reply(message, 'Hello!');
     });
    ```

    Now our bot will respond any time it sees “hello,” “hi,” or “greetings” in either a DM or a message that @-mentions the bot. (Don’t forget to restart your bot after each edit!)
