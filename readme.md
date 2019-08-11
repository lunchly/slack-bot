# Lunchly [![CircleCI](https://circleci.com/gh/lunchly/slack-bot/tree/master.svg?style=svg)](https://circleci.com/gh/lunchly/slack-bot/tree/master) [![codecov](https://codecov.io/gh/lunchly/slack-bot/branch/master/graph/badge.svg)](https://codecov.io/gh/lunchly/slack-bot)

> Slack bot that announces daily catered meals

Lunchly is a Slack bot that posts daily meal announcements for companies with scheduled meal catering. Using Skills, Listeners, and Actions, Lunchly can be extended to support different vendors and interactions. It comes with built-in ZeroCater support.


#### Requirements

Lunchly runs on Node 8.3+ and uses Slack's [Real Time Messaging API](https://api.slack.com/rtm) and [Web API](https://api.slack.com/web) clients. ZeroCater integration is provided via the [@lunchly/service-zerocater](https://github.com/lunchly/service-zerocater) plugin.


### Install

To get started, clone this repository and install dependencies using `npm`.

```sh
# Get the code
git clone https://github.com/lunchly/slack-bot.git

# Install dependencies
npm install
```


### Configuration

Lunchly configuration is kept inside of a _/sites.json_ file in the project room. This file defines a list of channels to monitor and their associated ZeroCater account IDs.

> Your ZeroCater account ID can be found in the URL of your account's meal page.

1. Copy `sites.example.json` to `sites.json` and replace with your values.

2. If you don't already have one, [create a new bot user](https://api.slack.com/bot-users#creating-bot-user) for your Slack team. You'll need the [bot token](https://api.slack.com/docs/token-types#bot) (begins with `xoxb-`) to run Lunchly.


### Run

To run Lunchly, ensure the configuration steps above are completed, and do the following:


###### Development

```SLACK_BOT_API_TOKEN=xoxb-0000-your-token npm run dev```


###### Production

```SLACK_BOT_API_TOKEN=xoxb-0000-your-token npm run start```


### Use

Lunchly listens for interactions in all channels it is a member of. If a meal is found for that day then the bot will post a message containing details about the meal.

Triggers*: `!lunch`, `what's for lunch`, `what is for lunch`, `what is today's lunch`, `what's for lunch`

_Apostrophe optional. Case insensitive._

![Lunchly screenshot, ZeroCater integration](screenshot.png)

## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
