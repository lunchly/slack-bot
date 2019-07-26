const { today } = require('@lunchly/service-zerocater');

const buildSlackResponse = require('../utils/build-slack-response');

/**
 * Sets a Date object to midnight.
 * @param {Date} date The Date object to update.
 * @returns {Date} The updated Date object.
 */
const setDateToMidnight = date => {
  return date.setHours(0, 0, 0, 0);
};

/**
 * Validate that a date object is set to today.
 * @param {Date} date The date to check.
 * @returns {Boolean} The result of the check.
 */
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

  let meal;

  if (!todaysLunch.meal || (todaysLunch.timestamp && !isToday(todaysLunch.timestamp))) {
    try {
      meal = await today(companyId);
    } catch (error) {
      return {
        result: 'failure',
        error
      };
    }

    if (!meal) {
      throw new Error('No meal found for today.');
    }

    const timestamp = new Date();
    todaysLunch = meal && {
      meal,
      timestamp
    };
  }

  try {
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

    const postMessageResult = await webClient.chat.postMessage(response);

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
