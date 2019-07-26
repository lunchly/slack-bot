const announceTodaysLunch = require('../skills/announce-todays-lunch');
const logger = require('../logger');
const tracker = require('../tracker');

const LISTENER = 'QUERY_CHANNEL_LUNCH';

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
    throw new TypeError('Required items not found in app state.');
  }

  rtm.on('message', async message => {
    const isBotUser = message.subtype && message.subtype === 'bot_message';
    const isOwnMessage = message.user === rtm.activeUserId;

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

    tracker.track('New interaction detected.', {
      channelId,
      listener: LISTENER,
      text
    });

    const { name: channelName } = subscribedChannels[channelId];
    const { companyId } = sites[channelName];

    const result = await announceTodaysLunch({
      channelId,
      channelName,
      companyId,
      mealURLTemplate,
      webClient
    });

    logger.debug('Responded to query: QUERY_CHANNEL_LUNCH', {
      request: {
        channelId,
        channelName,
        companyId
      },
      result
    });
  });
};
