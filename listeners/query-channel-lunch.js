const announceTodaysLunch = require('../skills/announce-todays-lunch');

module.exports = ({
  appState,
  rtmClient: rtm,
  webClient
}) => {
  if (!appState || !rtm || !webClient) {
    throw new TypeError('Missing data required to load module.');
  }

  const {
    endpoints: {
      ZEROCATER_MEALS_URL: mealURLTemplate
    },
    sites,
    subscribedChannels
  } = appState;

  if (!mealURLTemplate || !sites || !subscribedChannels) {
    throw new TypeError('Missing data required to load app state.');
  }

  rtm.on('message', async message => {
    const isBotUser = message.subtype && message.subtype === 'bot_message';
    const isOwnMessage = message.user === rtm.activeUserId;

    // NOTE: ignore own and bot messages
    if (!isBotUser && isOwnMessage) {
      return null;
    }

    const {
      channel: channelId,
      text
    } = message;

    const isInteraction = text.match(/!lunch/g);
    if (!subscribedChannels[channelId] || !isInteraction) {
      return null;
    }

    const { name: channelName } = subscribedChannels[channelId];
    const { companyId } = sites[channelName];

    try {
      const response = await announceTodaysLunch({
        channelId,
        companyId,
        mealURLTemplate,
        webClient
      });
      console.log('Announced today\'s lunch', {
        result: 'success',
        response
      });
    } catch (error) {
      console.error({
        result: 'failure',
        error
      });
    }
  });
};
