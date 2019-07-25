const {
  LogLevel,
  RTMClient,
  WebClient
} = require('@slack/client');

const { ENDPOINTS } = require('./constants');
const initialState = require('./initial-state');
const logger = require('./logger');

const getAllListeners = require('./utils/get-all-listeners');
const getSites = require('./utils/get-sites');
const getSubscribedChannels = require('./utils/get-subscribed-channels');

const slackAPIToken = process.env.SLACK_BOT_API_TOKEN;

const rtmClient = new RTMClient(slackAPIToken, { logLevel: LogLevel.INFO });
const webClient = new WebClient(slackAPIToken);

(async () => {
  const subscribedChannels = await getSubscribedChannels(webClient);

  const appState = {
    ...initialState,
    endpoints: ENDPOINTS,
    sites: getSites(),
    subscribedChannels
  };


  // NOTE: a listener should RETURN a result contract, but can throw
  // its own errors. A result contract should include a status (SUCCESS, FAILURE)
  // and any additional data relevant to the status.
  const listeners = await getAllListeners({ basePath: __dirname });
  await Promise.all(listeners.map(async listener => {
    try {
      await listener({
        appState,
        rtmClient,
        webClient
      });
    } catch (error) {
      logger.error('Unable to initialize listener.', error);
    }
  }));

  rtmClient.start();
})();
