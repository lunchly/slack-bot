const { today } = require('@lunchly/service-zerocater');
const logger = require('../logger');

/**
 * Sets a Date object to midnight.
 * @param {Date} date The Date object to update.
 * @returns {Date}
 */
const setDateToMidnight = date => {
  return date.setHours(0, 0, 0, 0);
};

const isToday = date => {
  const now = new Date();
  return setDateToMidnight(date) === setDateToMidnight(now);
};

let todaysLunch = {};

const announceTodaysLunch = async props => {
  const {
    channelId,
    companyId,
    mealURLTemplate,
    webClient
  } = props;

  try {
    if (!todaysLunch.meal || (todaysLunch.timestamp && !isToday(todaysLunch.timestamp))) {
      const meal = await today(companyId);

      if (!meal) {
        throw new Error('No meal found for today.');
      }

      const timestamp = new Date();
      todaysLunch = meal && {
        meal,
        timestamp
      };

      logger.debug('Meal data fetched.', {
        companyId,
        skill: 'ANNOUNCE_TODAYS_LUNCH',
        timestamp
      });
    }

    const {
      id,
      name,
      vendor_name: vendorName,
      vendor_image_url: vendorImageURL,
      vendor_description: vendorDescription
    } = todaysLunch.meal;

    const mealURL = mealURLTemplate.replace('{companyId}', companyId);
    const mealsHyperlinkURL = `${mealURL}/${id}`;
    const message = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

    logger.debug('Message data generated.', {
      companyId,
      mealURL,
      mealsHyperlinkURL,
      message
    });

    const postMessageResult = await webClient.chat.postMessage({
      as_user: true,
      channel: channelId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
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
      data: { ...postMessageResult }
    };
  } catch (error) {
    return {
      result: 'failure',
      error
    };
  }
};

module.exports = announceTodaysLunch;
