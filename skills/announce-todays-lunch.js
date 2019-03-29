const { today } = require('@lunchly/service-zerocater');

const logger = require('../logger');
const tracker = require('../tracker');

module.exports = ({
  appState,
  rtmClient: rtm,
  webClient: slack
}) => {
  if (!appState || !rtm || !slack) {
    throw new TypeError('Missing data required to load module.');
  }

  const {
    endpoints: {
      ZEROCATER_MEALS_URL
    },
    sites,
    subscribedChannels
  } = appState;

  if (!ZEROCATER_MEALS_URL || !sites || !subscribedChannels) {
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
      channel: channelID,
      text
    } = message;

    const isInteraction = text.match(/!lunch/g);
    if (!subscribedChannels[channelID] || !isInteraction) {
      return null;
    }

    const { name: channelName } = subscribedChannels[channelID];
    const { companyId } = sites[channelName];

    const trackingProps = {
      channelName,
      channelID,
      companyId
    };

    let result = {};
    try {
      result = await today(companyId);
      tracker.track('Fetched today\'s meal', trackingProps);
    } catch (error) {
      tracker.track('Unable to fetch today\'s meal', trackingProps);
      return logger.error('No meal found for today.', {
        channel: channelName,
        companyId
      });
    }

    const {
      id,
      name,
      vendor_name: vendorName,
      vendor_image_url: vendorImageURL,
      vendor_description: vendorDescription
    } = result;

    const mealsURL = ZEROCATER_MEALS_URL.replace('{companyId}', companyId);
    const mealURL = `${mealsURL}/${id}`;
    const messageTemplate = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

    const postMessageResult = await slack.chat.postMessage({
      as_user: true,
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

    tracker.track('Announced today\'s lunch', {
      ...trackingProps,
      timestamp: postMessageResult.ts
    });

    return logger.log('Today\'s lunch announced', {
      channel: channelID,
      companyId,
      timestamp: postMessageResult.ts
    });
  });
};
