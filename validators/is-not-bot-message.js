const isNotBotMessage = message => message.subtype !== 'bot_message';

module.exports = isNotBotMessage;
