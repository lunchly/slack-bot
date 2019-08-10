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

    console.log('checking using text...', text);

    const isNotBotUser = Boolean(message.subtype !== 'bot_message');
    const isNotOwnMessage = message.user !== rtm.activeUserId;

    const checks = [
      /!lunch/ig.test(text),
      /what.{1}s for lunch/ig.test(text),
      /what is for lunch/ig.test(text),
      /what is today.{1}s lunch/ig.test(text),
      /what.{1}s for lunch/ig.test(text)
    ];

    const isTrue = result => result === true;
    const isInteraction = checks.some(isTrue);

    const shouldRespondChecks = [
      isNotBotUser,
      isNotOwnMessage,
      isInteraction
    ];
    const shouldRespond = shouldRespondChecks.every(isTrue);

    if (!shouldRespond) {
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
