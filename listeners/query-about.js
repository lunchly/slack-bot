const EventEmitter = require('events');
const logger = require('../logger');
const tracker = require('../tracker');

const isBotMessage = require('../validators/is-bot-message');
const isOwnMessage = require('../validators/is-own-message');
const isTrue = require('../validators/is-true');

module.exports = appState => {
  const { clients: { rtm } } = appState;
  const { activeUserId } = rtm;

  const listener = new EventEmitter();

  rtm.on('message', async message => {
    const {
      channel,
      text,
      user: messageUser,
      type: messageType
    } = message;

    const isInteraction = [
      /how does lunchly/ig.test(text),
      /what is lunchly/ig.test(text),
      /who is lunchly/ig.test(text)
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
      listener: 'QUERY_ABOUT',
      messageType,
      messageUser,
      text
    });

    listener.emit('interaction', { message });
  });

  return listener;
};
