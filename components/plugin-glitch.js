const request = require('request');

module.exports = controller => {
  const {
    env: {
      PROJECT_DOMAIN
    }
  } = process;

  const keepalive = () => {
    request({ url: `http://${PROJECT_DOMAIN}.glitch.me` }, () => {
      setTimeout(() => {
        keepalive();
      }, 55000);
    });
  };

  // NOTE: check if running on Glitch
  if (process.env.PROJECT_DOMAIN) {
    // NOTE: register with studio using the provided domain name
    controller.registerDeployWithStudio(`${PROJECT_DOMAIN}.glitch.me`);

    // NOTE: make a web call to self every 55 seconds to avoid the process
    // being put to sleep.
    keepalive();
  }
};
