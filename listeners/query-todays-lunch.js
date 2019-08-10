const logger = require('../logger');
const tracker = require('../tracker');

module.exports = ({
  appState,
  clients: {
    rtm,
    web
  },
  config: {
    ZEROCATER_MEALS_URL: mealURLTemplate
  },
  subscribedChannels
}) => {
  rtm.on('message', async message => {
    const isBotUser = message.subtype && message.subtype === 'bot_message';
    const isOwnMessage = message.user === rtm.activeUserId;

    if (!isBotUser && isOwnMessage) {
      return null;
    }

    const {
      channel: channelId,
      text
    } = message;

    const isInteraction = text.match(/!lunch/g);
    if (!subscribedChannels[channelId] || !isInteraction) {
      return null;
    }

    tracker.track('New interaction detected.', {
      channelId,
      listener: 'QUERY_CHANNEL_LUNCH',
      text
    });

    const { name: channelName } = subscribedChannels[channelId];
    const { companyId } = sites[channelName];

    const result = await announceTodaysLunch({
      channelId,
      channelName,
      companyId,
      mealURLTemplate,
      web
    });

    logger.debug('Responded to query: QUERY_CHANNEL_LUNCH', {
      request: {
        channelId,
        channelName,
        companyId
      },
      result
    });
  });
};
