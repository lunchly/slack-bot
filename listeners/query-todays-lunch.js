const logger = require('../logger');
const tracker = require('../tracker');

module.exports = ({
  action,
  appState
}) => {
  const {
    clients: { rtm },
    subscribedChannels
  } = appState;

  rtm.on('message', async message => {
    const {
      channel,
      text
    } = message;

    const isBotUser = Boolean(message.subtype && message.subtype === 'bot_message');
    const isOwnMessage = message.user === rtm.activeUserId;

    if (!isBotUser && isOwnMessage) {
      return null;
    }

    const isInteraction = text.match(/!lunch/g);
    if (!subscribedChannels[channel] || !isInteraction) {
      return null;
    }

    tracker.track('New interaction detected.', {
      channel,
      listener: 'QUERY_CHANNEL_LUNCH',
      text
    });

    const result = await action({ appState, message });
    logger.debug('QUERY_CHANNEL_LUNCH completed an action.', result);
  });
};
