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

const skillsRegistry = [];
const slackAPIToken = process.env.SLACK_BOT_API_TOKEN;

const rtmClient = new RTMClient(slackAPIToken, { logLevel: LogLevel.INFO });
const webClient = new WebClient(slackAPIToken);

(async () => {
  const skills = await getAllSkills({ basePath: __dirname });
  const subscribedChannels = await getSubscribedChannels(webClient);

  const appState = {
    ...initialState,
    endpoints: ENDPOINTS,
    sites: getSites(),
    subscribedChannels
  };

  await Promise.all(skills.map(async skill => {
    try {
      const loadedSkill = await skill({
        appState,
        clients: {
          rtm: rtmClient,
          web: webClient
        },
        config: {} // TODO: connect this
      });

      skillsRegistry.push(loadedSkill);

      return skillsRegistry;
    } catch (error) {
      logger.error('An error occured initializing listener.', error);
    }
  }));

  logger.info(`Attached ${skillsRegistry.length} skills.`);

  rtmClient.start();
})();
