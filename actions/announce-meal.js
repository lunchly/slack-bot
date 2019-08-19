const buildSlackResponse = require('../utils/build-slack-response');
const logger = require('../logger');

const announceMeal = appState => async interaction => {
  const { channel, companyId, meal } = interaction;
  const {
    endpoints: { ZEROCATER_MEALS_URL: mealURLTemplate },
    clients: { web }
  } = appState;

  const {
    id,
    name,
    vendor_description: vendorDescription,
    vendor_image_url: vendorImageURL,
    vendor_name: vendorName
  } = meal;

  logger.debug('Running action.', {
    action: 'ANNOUNCE_MEAL',
    channel,
    companyId
  });

  const mealURL = mealURLTemplate.replace('{companyId}', companyId);
  const mealsHyperlinkURL = `${mealURL}/${id}`;
  const text = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

  const response = buildSlackResponse({
    channel,
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
