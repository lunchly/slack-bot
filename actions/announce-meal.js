const { today } = require('@lunchly/service-zerocater');
const buildSlackResponse = require('../utils/build-slack-response');
const isToday = require('../utils/is-today');
const logger = require('../logger');

let todaysLunch = {};

const announceMeal = async ({
  appState: {
    clients: { web },
    endpoints,
    sites,
    subscribedChannels
  },
  message: { channel: channelId }
}) => {
  logger.debug('Action ANNOUNCE_MEAL called.');

  const { ZEROCATER_MEALS_URL: mealURLTemplate } = endpoints;
  const { name: channelName } = subscribedChannels[channelId];
  const { companyId } = sites[channelName];

  if (!todaysLunch.meal || (!todaysLunch.timestamp && !isToday(todaysLunch.timestamp))) {
    logger.debug('No existing or expired meal data found. Attempting to fetch a new meal.');

    let meal;

    try {
      meal = await today(companyId);
      logger.debug('Fetched and found meal for today\'s meal..', meal);
    } catch (error) {
      logger.debug('Failed to find a meal for today.', {
        error
      });
    }

    if (!meal) {
      return {
        action: 'ANNOUNCE_MEAL',
        result: 'failure',
        message: 'No meal found for today.'
      };
    }

    const timestamp = new Date();
    todaysLunch = meal && {
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
  } = todaysLunch.meal;

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
