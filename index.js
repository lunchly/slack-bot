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

  const listeners = await getAllListeners({ basePath: __dirname });
  const log = await Promise.all(listeners.map(async listener => {
    const attachedListeners = [];

    try {
      const result = await listener({
        appState,
        rtmClient,
        webClient
      });

      attachedListeners.push(result);

      return attachedListeners;
    } catch (error) {
      logger.error('An error occured initializing listener.', error);
    }
  }));

  logger.debug('Attached listeners.', log);

  rtmClient.start();
})();
