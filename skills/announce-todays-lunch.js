const { today } = require('@lunchly/service-zerocater');

const announceMeal = require('../actions/announce-meal');
const isToday = require('../validators/is-today');
const logger = require('../logger');
const queryLunchListener = require('../listeners/query-todays-lunch');

const state = {
  mealsByChannel: {}
};

const getMeal = async (channel, companyId) => {
  const { mealsByChannel } = state;

  if (
    !mealsByChannel[channel].meal ||
    !mealsByChannel[channel].timestamp ||
    !isToday(mealsByChannel[channel].timestamp)
  ) {
    logger.debug('Missing or stale meal data. Fetching new meal data.');

    try {
      const meal = await today(companyId);
      const timestamp = new Date();
      mealsByChannel[channel] = {
        meal,
        timestamp
      };
    } catch (error) {
      mealsByChannel[channel] = {};
      logger.debug('Failed to fetch a meal for today.', {
        channel,
        error
      });
    }
  }

  const { meal } = mealsByChannel[channel];
  const result = meal ? {
    result: 'success',
    meal
  } : {
    result: 'failure'
  };

  return result;
};

const skill = async appState => {
  const { clients: { web } = {}, sites, subscribedChannels } = appState;
  const { mealsByChannel } = state;

  Object.keys(subscribedChannels).forEach(channel => {
    if (!mealsByChannel[channel]) {
      mealsByChannel[channel] = {};
    }
  });

  const interactionHandler = announceMeal(appState);
  const listener = queryLunchListener(appState);

  listener.on('interaction', async interaction => {
    const { message: { channel } = {} } = interaction;
    const { name: channelName } = subscribedChannels[channel];
    const { companyId } = sites[channelName];

    const { meal, result } = await getMeal(channel, companyId);

    if (result !== 'success') {
      web.chat.postMessage({
        as_user: true,
        channel,
        text: 'Sorry, I couldn\'t find a meal for today.'
      });
      return;
    }

    await interactionHandler({
      channel,
      companyId,
      meal
    });
  });

  return {
    status: 'loaded',
    id: 'ANNOUNCE_TODAYS_LUNCH'
  };
};

module.exports = skill;
