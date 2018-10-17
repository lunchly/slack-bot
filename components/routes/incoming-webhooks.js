const debug = require('debug')('botkit:incoming-webhooks');

module.exports = (webserver, controller) => {
  debug('Configured /slack/receive url');

  webserver.post('/slack/receive', (req, res) => {
    // Enforce token check here
    res.status(200);

    // Pass the webhook to be processed
    controller.handleWebhookPayload(req, res);
  });
};
