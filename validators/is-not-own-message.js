const isNotOwnMessage = (message, activeUserId) => message.user !== activeUserId;

module.exports = isNotOwnMessage;
