const { today } = require('@lunchly/service-zerocater');

module.exports = async ({
  channelId,
  companyId,
  mealURLTemplate,
  webClient
}) => {
  let result = {};

  try {
    result = await today(companyId);
  } catch (error) {
    return {
      result: 'failure',
      data: {
        error
      }
    };
  }

  const {
    id,
    name,
    vendor_name: vendorName,
    vendor_image_url: vendorImageURL,
    vendor_description: vendorDescription
  } = result;

  const mealURL = mealURLTemplate.replace('{companyId}', companyId);
  const mealsHyperlinkURL = `${mealURL}/${id}`;
  const messageTemplate = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

  const postMessageResult = await webClient.chat.postMessage({
    as_user: true,
    channel: channelId,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: messageTemplate
        },
        accessory: {
          type: 'image',
          image_url: vendorImageURL,
          alt_text: vendorName
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'About this meal'
            },
            url: mealURL,
            value: 'about_meal'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Upcoming meals'
            },
            url: mealsHyperlinkURL,
            value: 'upcoming_meals'
          }
        ]
      }
    ]
  });

  return {
    result: 'success',
    data: {
      ...postMessageResult
    }
  };
};
