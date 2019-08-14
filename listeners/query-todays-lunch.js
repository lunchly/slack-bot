const logger = require('../logger');
const tracker = require('../tracker');

module.exports = ({
  action,
  appState
}) => {
  const { clients: { rtm } } = appState;
  rtm.on('message', async message => {
    const {
      bot_id: botId,
      channel,
      text,
      type,
      user
    } = message;

    const isNotBotUser = Boolean(message.subtype !== 'bot_message');
    const isNotOwnMessage = message.user !== rtm.activeUserId;

    const isTrue = result => result === true;
    const isInteraction = [
      /!lunch/ig.test(text),
      /lunch is here/ig.test(text),
      /what.{1}s for lunch/ig.test(text),
      /what is for lunch/ig.test(text),
      /what is today.{1}s lunch/ig.test(text),
      /what.{1}s for lunch/ig.test(text)
    ].some(isTrue);

    const shouldRespond = [
      isNotBotUser,
      isNotOwnMessage,
      isInteraction
    ].every(isTrue);

    if (!shouldRespond) {
      return null;
    }

    tracker.track('New interaction detected.', {
      botId,
      channel,
      listener: 'QUERY_CHANNEL_LUNCH',
      text,
      type,
      user
    });

    const result = await action({ appState, message });
    logger.debug('QUERY_CHANNEL_LUNCH completed an action.', result);
  });
};
