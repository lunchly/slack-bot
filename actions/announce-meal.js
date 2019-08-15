const { today } = require('@lunchly/service-zerocater');
const buildSlackResponse = require('../utils/build-slack-response');
const isToday = require('../validators/is-today');
const logger = require('../logger');

const todaysLunch = {};

const announceMeal = async ({
  appState: {
    clients: { web },
    endpoints,
    sites,
    subscribedChannels
  },
  message: { channel: channelId }
}) => {
  logger.debug(`Action ANNOUNCE_MEAL called in channel ${channelId}.`);

  const { ZEROCATER_MEALS_URL: mealURLTemplate } = endpoints;
  const { name: channelName } = subscribedChannels[channelId];
  const { companyId } = sites[channelName];

  Object.keys(subscribedChannels).forEach(channel => {
    if (!todaysLunch[channel]) {
      todaysLunch[channel] = {};
    }
  });

  if (!todaysLunch[channelId].meal || !todaysLunch[channelId].timestamp || !isToday(todaysLunch[channelId].timestamp)) {
    logger.debug('Missing or stale meal data. Fetching new meal data.');

    let meal;

    try {
      meal = await today(companyId);
    } catch (error) {
      logger.debug('Failed to find a meal for today.', {
        error
      });
    }

    if (!meal) {
      web.chat.postMessage({
        as_user: true,
        channel: channelId,
        text: 'Sorry, I couldn\'t find a meal for today.'
      });
      return {
        action: 'ANNOUNCE_MEAL',
        result: 'failure',
        message: 'No meal found for today.'
      };
    }

    const timestamp = new Date();
    todaysLunch[channelId] = {
      meal,
      timestamp
    };
  }

  const {
    id,
    name,
    vendor_description: vendorDescription,
    vendor_image_url: vendorImageURL,
    vendor_name: vendorName
  } = todaysLunch[channelId].meal;

  const mealURL = mealURLTemplate.replace('{companyId}', companyId);
  const mealsHyperlinkURL = `${mealURL}/${id}`;
  const text = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

  const response = buildSlackResponse({
    channelId,
    mealURL,
    mealsHyperlinkURL,
    text,
    vendorImageURL,
    vendorName
  });

  const result = await web.chat.postMessage(response);
  return result;
};

module.exports = announceMeal;
