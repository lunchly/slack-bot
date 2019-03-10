const {
  today
} = require('@lunchly/service-zerocrater');

module.exports = clients => {
  const {
    appState: {
      endpoints: {
        ZEROCRATER_MEALS_URL
      },
      sites,
      subscribedChannels
    },
    rtmClient: rtm,
    webClient: slack
  } = clients;

  rtm.on('message', async message => {
    // NOTE: ignore own messages and those from other bots
    if ((message.subtype && message.subtype === 'bot_message') ||
      (!message.subtype && message.user === rtm.activeUserId)) {
      return;
    }

    // NOTE: ignore messages from channels without sites defined
    const {
      channel: channelID,
      text
    } = message;
    if (!subscribedChannels[channelID]) {
      return;
    }

    // NOTE: ignore messages that don't include '!lunch'
    const isInteraction = text.match(/!lunch/g);
    if (!isInteraction) {
      return;
    }

    const {
      name: channelName
    } = subscribedChannels[channelID];
    const {
      zeroCaterID
    } = sites[channelName];

    let result = {};
    try {
      result = await today(zeroCaterID);
    } catch (error) {
      return console.error('No meal found for today.');
    }

    const {
      id,
      name,
      vendor_name: vendorName,
      vendor_image_url: vendorImageURL,
      vendor_description: vendorDescription
    } = result;

    const mealsURL = ZEROCRATER_MEALS_URL.replace('{companyId}', zeroCaterID);
    const mealURL = `${mealsURL}/${id}`;

    const messageTemplate = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

    const res = await slack.chat.postMessage({
      channel: channelID,
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
              url: mealsURL,
              value: 'upcoming_meals'
            }
          ]
        }
      ]
    });

    // `res` contains information about the posted message
    return console.log('Message sent:', res.ts);
  });
};
