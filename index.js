const {
  LogLevel,
  RTMClient,
  WebClient
} = require('@slack/client');

const { ENDPOINTS } = require('./constants');
const initialState = require('./initial-state');
const logger = require('./logger');

const getAllSkills = require('./utils/get-all-skills');
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

  const skills = await getAllSkills({ basePath: __dirname });
  await Promise.all(skills.map(async skill => {
    try {
      if (typeof skill === 'function') {
        return await skill({
          appState,
          rtmClient,
          webClient
        });
      }

      if (typeof skill.default === 'function') {
        return await skill.default({
          appState,
          rtmClient,
          webClient
        });
      }
    } catch (error) {
      logger.error('Error loading skill', error);
    }
  }));
})();

rtmClient.start();
