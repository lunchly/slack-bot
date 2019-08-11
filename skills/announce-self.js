const describeSelf = require('../actions/describe-self');
const queryAboutListener = require('../listeners/query-about');

const skill = appState => {
  try {
    queryAboutListener({
      action: describeSelf,
      appState
    });

    return {
      status: 'loaded',
      id: 'ANNOUNCE_SELF'
    };
  } catch (error) {
    return {
      status: 'failed',
      id: 'ANNOUNCE_SELF',
      error
    };
  }
};

module.exports = skill;
