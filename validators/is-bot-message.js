const isBotMessage = message => message.subtype === 'bot_message';

module.exports = isBotMessage;
