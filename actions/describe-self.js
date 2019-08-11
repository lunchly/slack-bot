const logger = require('../logger');

const { version } = require('../package.json');

const describeSelf = async ({
  appState: { clients: { web } },
  message: { channel: channelId }
}) => {
  logger.debug('Action DESCRIBE_SELF called.');

  const response = {
    as_user: true,
    channel: channelId,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `
Hi, I'm Lunchly v${version}. I'm a bot that announces catered meals in Slack. Learn more about me at https://github.com/lunchly/slack-bot.`
        },
        accessory: {
          type: 'image',
          image_url: 'https://avatars1.githubusercontent.com/u/43972259?s=200&v=4',
          alt_text: 'Lunchly Avatar'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Lunchly On GitHub'
            },
            url: 'https://github.com/lunchly/slack-bot',
            value: 'lunchly_github'
          }
        ]
      }
    ]
  };

  const result = await web.chat.postMessage(response);
  return result;
};

module.exports = describeSelf;
