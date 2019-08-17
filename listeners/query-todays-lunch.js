const logger = require('../logger');
const tracker = require('../tracker');

const isBotMessage = require('../validators/is-bot-message');
const isOwnMessage = require('../validators/is-own-message');
const isTrue = require('../validators/is-true');

module.exports = ({
  action,
  appState
}) => {
  const { clients: { rtm } } = appState;
  const { activeUserId } = rtm;

  rtm.on('message', async message => {
    const {
      channel,
      text,
      type: messageType,
      user: messageUser
    } = message;

    const isInteraction = [
      /!lunch/ig.test(text),
      /lunch is here/ig.test(text),
      /what is for lunch/ig.test(text),
      /what is today.{1}s lunch/ig.test(text),
      /what.{1}s for lunch/ig.test(text),
      /what.{1}s for lunch/ig.test(text)
    ].some(isTrue);

    const shouldRespond = [
      !isBotMessage(message),
      !isOwnMessage(message, activeUserId),
      isInteraction
    ].every(isTrue);

    if (!shouldRespond) {
      return null;
    }

    tracker.track('New interaction detected.', {
      activeUserId,
      channel,
      listener: 'QUERY_CHANNEL_LUNCH',
      messageType,
      messageUser,
      text
    });

    const result = await action({ appState, message });
    logger.debug('QUERY_CHANNEL_LUNCH completed an action.', result);
  });
};
