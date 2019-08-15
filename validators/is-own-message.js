const isOwnMessage = (message, activeUserId) => message.user === activeUserId;

module.exports = isOwnMessage;
