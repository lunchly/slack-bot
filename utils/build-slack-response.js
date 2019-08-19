const buildSlackResponse = ({
  channel,
  mealURL,
  mealsHyperlinkURL,
  text,
  vendorImageURL,
  vendorName
}) => {
  return {
    as_user: true,
    channel,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text
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
  };
};

module.exports = buildSlackResponse;
