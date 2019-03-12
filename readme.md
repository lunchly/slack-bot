# Lunchly [![CircleCI](https://circleci.com/gh/lunchly/slack-bot/tree/master.svg?style=svg)](https://circleci.com/gh/lunchly/slack-bot/tree/master)

> Slack bot that announces daily catered meals

Lunchly is a Slack bot that posts consistent, useful daily meal announcements for companies with scheduled food catering. It only supports ZeroCater because that is the catering service used at my office, but feel welcome to submit a pull request adding support for other catering services.


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


### Use

Lunchly listens for `!lunch` in all channels it is a member of. If a meal is found for that day then the bot will post a message containing details about the meal.

![Lunchly screenshot, ZeroCater integration](https://lh3.googleusercontent.com/DkLYhUan8xUOZs6E9JaMy55TiDWjqopBHZOMsUXqMIPlipYxb79HutY64aEfsAUjNGPtxZOlKuVTIbgltkDD_LoCgkzgWWtOaeCVF_Qan8tbEytbTvaWOJ8g53JW85D4SFi4Oe5lEBiPY7dC71Z21jcAyAJlAcBv6cj4SzQHCIeM2YR8q42egTynPyMHXSYjDG1Z8fCKn50vVqBfrqYxFuQEM5SE7_6CH6KeMFg37ISStgeQSCuobxSJsnO2sHxGpeIp4_b0MvdZTZu3tMo5IS3lNLsZh35nDacKEpbDEM0UBGWFbiTRJmsywju0K9uQZD9bZX5crZ6RGCHkiv4JV6-M8laaDwXUfoxtocnKY5kNLNO5ZfuTcKlOBUycWEgjYKRRjrX_mhjOxQlZJa7FC8OdsbQ3jcItDr2tx7te_Q6OU5z_itOi0VP1Oj82WlNskW7saoaNYAcrIvBzlnKDyeF2E-bFzjGI5StHxXo1W7BsUuBkvA0KUIo7IQVWMf8RVq3FIkkzyKj-TeCZqvgjKzRFGY6B9vSSe82MI1zn1B2SOcjD4Wb5djHgzDSf9-ofa6sEunQ0ZE_tg_Otga__jop57WcjiBhH7rwPY6-7_vWydSCp2vNFTZ4hz9TneoMcYmOXZv0IZH76dZZhXIeCZpRykpjwb9Xu=w1310-h414-no)

## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
