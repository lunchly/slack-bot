const announceMeal = require('../actions/announce-meal');
const lunchQueryListener = require('../listeners/query-todays-lunch');

const skill = appState => {
  try {
    const listenerAttachmentResult = lunchQueryListener({
      action: announceMeal,
      appState
    });

    return {
      result: 'success',
      data: { ...listenerAttachmentResult }
    };
  } catch (error) {
    return {
      result: 'failure',
      error
    };
  }
};

module.exports = skill;
