const debug = require('debug')('botkit:channel-join');

module.exports = controller => {
  controller.on('bot_channel_join', (bot, message) => {
    try {
      controller.studio.run(
        bot,
        'channel_join',
        message.user,
        message.channel,
        message
      );
    } catch (error) {
      debug('Error: encountered an error loading onboarding script from Botkit Studio:', error);
    }
  });
};
