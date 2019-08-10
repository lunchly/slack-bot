const { today } = require('@lunchly/service-zerocater');

// const announceMeal = require('../actions/announce-meal');
const isToday = require('../utils/is-today');
const queryTodaysLunch = require('../listeners/query-todays-lunch');

let todaysLunch = {};

const skill = async ({
  appState,
  clients: { rtm, web },
  config: {
    ZEROCATER_MEALS_URL: mealURLTemplate
  }
}) => {
  if (!appState || !rtm || !web) {
    throw new TypeError('Missing data required to load module.');
  }

  const {
    sites,
    subscribedChannels
  } = appState;

  if (!mealURLTemplate || !sites || !subscribedChannels) {
    throw new TypeError('Required items not found in app state.');
  }

  let meal;

  if (!todaysLunch.meal || (!todaysLunch.timestamp && !isToday(todaysLunch.timestamp))) {
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
    // NOTE(cvogt): load `today's lunch` listener
    const result = queryTodaysLunch(todaysLunch.meal);

    return {
      result: 'success',
      data: { ...result }
    };
  } catch (error) {
    return {
      result: 'failure',
      error
    };
  }

};

module.exports = skill;
