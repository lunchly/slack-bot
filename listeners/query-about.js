const logger = require('../logger');
const tracker = require('../tracker');

module.exports = ({
  action,
  appState
}) => {
  const { clients: { rtm } } = appState;
  rtm.on('message', async message => {
    const {
      channel,
      text
    } = message;

    const isNotBotUser = Boolean(message.subtype !== 'bot_message');
    const isNotOwnMessage = message.user !== rtm.activeUserId;

    const isTrue = result => result === true;
    const isInteraction = [
      /!lunchly/ig.test(text),
      /what is lunchly/ig.test(text),
      /who is lunchly/ig.test(text),
      /how does lunchly/ig.test(text)
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
      channel,
      listener: 'QUERY_ABOUT',
      text
    });

    const result = await action({ appState, message });
    logger.debug('QUERY_ABOUT completed an action.', result);
  });
};
