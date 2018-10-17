const request = require('request');
const debug = require('debug')('botkit:register_with_studio');

module.exports = (webserver, controller) => {
  const {
    config: {
      studio_command_uri: studioCommandURI,
      studio_token: studioToken
    }
  } = controller;
  let registeredThisSession = false;

  controller.registerDeployWithStudio = host => {
    if (!registeredThisSession && studioToken) {
      // NOTE: send information about this instance to Botkit Studio in order
      // to display in the hosting tab
      const instance = {
        url: host,
        version: controller.version(),
        ts: new Date()
      };

      request({
        method: 'post',
        uri: (studioCommandURI || 'https://studio.botkit.ai') + `/api/v1/bots/phonehome?access_token=${studioToken}`,
        form: instance
      }, (err, res, body) => {
        registeredThisSession = true;

        if (err) {
          debug('Error registering instance with Botkit Studio', err);
        } else {
          try {
            const { error } = JSON.parse(body);
            if (error) {
              debug('Error registering instance with Botkit Studio', error);
            }
          } catch (error) {
            debug('Error registering instance with Botkit Studio', error);
          }
        }
      });
    }
  };

  if (webserver && studioToken) {
    webserver.use((req, res, next) => {
      controller.registerDeployWithStudio(req.get('host'));
      next();
    });
  }
};
