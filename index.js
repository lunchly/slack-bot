const {
  LogLevel,
  RTMClient,
  WebClient
} = require('@slack/client');

const { ENDPOINTS } = require('./constants');
const initialState = require('./initial-state');

const getSubscribedChannels = require('./utils/get-subscribed-channels');
const getSites = require('./utils/get-sites');

const token = process.env.SLACK_BOT_API_TOKEN;

const plugins = [
  require('./todays-lunch')
];

const rtmClient = new RTMClient(token, {
  logLevel: LogLevel.INFO
});
const webClient = new WebClient(token);

(async () => {
  // NOTE: initiates a blocking request to fetch all of the public Slack
  // channels and returns a dictionary keyed by the channel ID.
  const subscribedChannels = await getSubscribedChannels(webClient);

  const appState = {
    ...initialState,
    endpoints: ENDPOINTS,
    sites: getSites(),
    subscribedChannels
  };

  await Promise.all(plugins.map(async plugin => {
    if (typeof plugin === 'function') {
      await plugin({
        appState,
        rtmClient,
        webClient
      });
    }

    if (typeof plugin.default === 'function') {
      await plugin.default({
        appState,
        rtmClient,
        webClient
      });
    }
  }));
})();

rtmClient.start();
