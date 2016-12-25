[![image](https://cloud.githubusercontent.com/assets/2289769/20545056/9fa044ea-b115-11e6-9314-ba3e6516e573.png)](https://github.com/NirBenita/usability-rover-client)

# Usability Rover
A dead simple Slack bot to help you and your team record conversation.
Also comes with a [🎨 client side](https://github.com/NirBenita/usability-rover-client).

## Usage
1. Invite @usability-rover to the channel.

2. `"@usability-rover start"`
This will begin a recording of all conversations in the channel.

3. Discuss and note over Slack with your team.

4. `"@usability-rover end"`
Finish the session, and store it at ./lib/data

## Botkit's awesome setup guide
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
