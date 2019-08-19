const describeSelf = require('../actions/describe-self');
const queryAboutListener = require('../listeners/query-about');

const skill = appState => {
  const interactionHandler = describeSelf(appState);
  const listener = queryAboutListener(appState);

  listener.on('interaction', interactionHandler);

  return {
    status: 'loaded',
    id: 'ANNOUNCE_SELF'
  };
};

module.exports = skill;
