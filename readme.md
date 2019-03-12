# Lunchly [![CircleCI](https://circleci.com/gh/lunchly/slack-bot/tree/master.svg?style=svg)](https://circleci.com/gh/lunchly/slack-bot/tree/master)

> Slack bot that announces daily catered meals

Lunchly is a Slack bot built to improve daily meal announcements for companies that have scheduled food catering. Right now it only supports ZeroCater because that is the service we use at work. Feel welcome to submit a pull request to add support for other catering services.


### Requirements

Lunchly runs on Node 8+ and uses Slack's [Real Time Messaging API](https://api.slack.com/rtm) and [Web API](https://api.slack.com/web). ZeroCater integration is provided via the [@lunchly/service-zerocrater](https://github.com/lunchly/service-zerocater) plugin, which exposes a `today()` method to fetch today's meal.


### Install

To get started, clone this repository and install dependencies using `npm`.

```sh
# Get the code
git clone https://github.com/lunchly/slack-bot.git

# Install dependencies
npm install
```


### Configure

Once you have complete the above steps your instance of Lunchly is ready to be configured. A list of channels to monitor and their associated ZeroCater account IDs is required. Your ZeroCater account ID can be found in the URL of your account's meal page.

1. Copy `sites.example.json` to `sites.json` and replace with your values.

2. If you don't already have one, [create a new bot user](https://api.slack.com/bot-users#creating-bot-user) for your Slack team. You'll need the [bot token](https://api.slack.com/docs/token-types#bot) (begins with `xoxb-`) to run Lunchly.


### Run

To run Lunchly, ensure the configuration steps above are completed, and do the following:


###### Development

```SLACK_BOT_API_TOKEN=xoxb-0000-your-token npm run dev```


###### Production

```SLACK_BOT_API_TOKEN=xoxb-0000-your-token npm run start```


## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
