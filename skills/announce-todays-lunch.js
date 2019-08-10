const announceMeal = require('../actions/announce-meal');
const lunchQueryListener = require('../listeners/query-todays-lunch');

const skill = appState => {
  try {
    lunchQueryListener({
      action: announceMeal,
      appState
    });

    return {
      status: 'loaded',
      id: 'ANNOUNCE_TODAYS_LUNCH'
    };
  } catch (error) {
    return {
      status: 'failed',
      id: 'ANNOUNCE_TODAYS_LUNCH',
      error
    };
  }
};

module.exports = skill;
