# Lunchly

> Slack bot that announces catered meals

Lunchly is a bot built on top of the [`botkit-starter-slack`](https://github.com/howdyai/botkit-starter-slack) boilerplate. It responds to today's lunch with information about today's meal and a link to learn more about upcoming meals.


### Roadmap

- [x] Integrate with ZeroCater
- [ ] Support a unique meal provider per channel
- [ ] Add support for scheduled announcements


### Install Lunchly

Lunchly runs on Node.js 8+. To get started, clone this repository and install dependencies.

```sh
git clone https://github.com/lunchly/slack-bot.git
```

Install dependencies, including [Botkit](https://github.com/howdyai/botkit):

```sh
cd slack-bot && npm install
```


#### Set up your Slack Application
Once you have setup your Botkit development enviroment, the next thing you will want to do is set up a new Slack application via the [Slack developer portal](https://api.slack.com/). This is a multi-step process, but only takes a few minutes.

* [Read this step-by-step guide](https://botkit.ai/docs/provisioning/slack-events-api.html) to make sure everything is set up.

* Check out this [handy video walkthrough](https://youtu.be/us2zdf0vRz0) for setting up this project with Glitch.

Copy `.env.default` to `.env`.

Update the `.env` file with your newly acquired tokens.

Launch your bot application by typing:

`npm run dev` (or `npm run start` in production)

Now, visit your new bot's login page: http://localhost:3000/login


# Developer & Support Community

You can find full documentation for Botkit on the [GitHub page](https://github.com/howdyai/botkit/blob/master/readme.md). Botkit Studio users can access the [Botkit Studio Knowledge Base](https://botkit.groovehq.com/help_center) for help in managing their account.


## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
