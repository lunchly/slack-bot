const buildSlackResponse = require('../utils/build-slack-response');

const announceMeal = async (meal, channelId, companyId, webClient) => {
  const {
    id,
    name,
    vendor_description: vendorDescription,
    vendor_image_url: vendorImageURL,
    vendor_name: vendorName
  } = meal;

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

  const result = await webClient.chat.postMessage(response);
  return result;
};

module.exports = announceMeal;
