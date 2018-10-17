const fs = require('fs');
const path = require('path');
const env = require('node-env-file');
const Botkit = require('botkit');
const debug = require('debug')('botkit:main');

try {
  env(path.join(__dirname, '/.env'));
} catch (error) {
  debug('Error starting Launchly %O', error);
}

const usageTip = () => {
  console.log('~~~~~~~~~~');
  console.log('Lunchly');
  console.log('Execute your bot application like this:');
  console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
  console.log('Get Slack app credentials here: https://api.slack.com/apps');
  console.log('Get a Botkit Studio token here: https://studio.botkit.ai/');
  console.log('~~~~~~~~~~');
};

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT || !process.env.zerocrater_company_id) {
  usageTip();
}

const botOptions = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  debug: process.env.DEBUG,
  scopes: [ 'bot' ],
  studio_token: process.env.studio_token,
  studio_command_uri: process.env.studio_command_uri,
  zerocrater_company_id: process.env.zerocrater_company_id
};

// NOTE: Use a mongo database if specified, otherwise store in a JSON file local
// to the app. Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
  const mongoStorage = require('botkit-storage-mongo')({
    mongoUri: process.env.MONGO_URI
  });
  botOptions.storage = mongoStorage;
} else {
  // NOTE: store user data in a simple JSON format
  botOptions.json_file_store = path.join(__dirname, '/.data/db/');
}

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(botOptions);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(path.join(__dirname, '/components/express-webserver.js'))(controller);

if (!process.env.clientId || !process.env.clientSecret) {
  // Load in some helpers that make running Botkit on Glitch.com better
  require(path.join(__dirname, '/components/plugin-glitch.js'))(controller);

  webserver.get('/', (req, res) => {
    res.render('installation', {
      studio_enabled: controller.config.studio_token,
      domain: req.get('host'),
      protocol: req.protocol,
      glitch_domain: process.env.PROJECT_DOMAIN,
      layout: 'layouts/default'
    });
  });

  const glitchURL = 'https://' + process.env.PROJECT_DOMAIN + '.glitch.me/';
  console.log(`WARNING: This application is not fully configured to work with Slack. Please see instructions at ${glitchURL}`);
} else {
  webserver.get('/', (req, res) => {
    res.render('index', {
      domain: req.get('host'),
      protocol: req.protocol,
      glitch_domain: process.env.PROJECT_DOMAIN,
      layout: 'layouts/default'
    });
  });

  // Set up a simple storage backend for keeping a record of customers
  // who sign up for the app via the oauth
  require(path.join(__dirname, '/components/user-registration.js'))(controller);

  // Send an onboarding message when a new team joins
  require(path.join(__dirname, '/components/onboarding.js'))(controller);

  // Load in some helpers that make running Botkit on Glitch.com better
  require(path.join(__dirname, '/components/plugin-glitch.js'))(controller);

  // Enable advanced botkit studio metrics
  require('botkit-studio-metrics')(controller);

  fs.readdirSync(path.join(__dirname, 'skills')).forEach(file => {
    require(`./skills/${file}`)(controller);
  });

  // This captures and evaluates any message sent to the bot as a DM
  // or sent to the bot in the form "@bot message" and passes it to
  // Botkit Studio to evaluate for trigger words and patterns.
  // If a trigger is matched, the conversation will automatically fire!
  // You can tie into the execution of the script using the functions
  // controller.studio.before, controller.studio.after and controller.studio.validate
  if (process.env.studio_token) {
    controller.on('direct_message,direct_mention,mention', async (bot, message) => {
      try {
        const convo = await controller.studio.runTrigger(
          bot,
          message.text,
          message.user,
          message.channel,
          message
        );
        if (convo) {
          // NOTE: set variables here that are needed for EVERY script use
          // controller.studio.before('script') to set variables specific
          // to a script
          convo.setVar('current_time', new Date());
        } else {
          // NOTE: no trigger was matched. If you want your bot to respond to
          // every message, define a 'fallback' script in Botkit Studio and
          // uncomment the line below.

          // controller.studio.run(bot, 'fallback', message.user, message.channel);
        }
      } catch (error) {
        bot.reply(message, `I experienced an error with a request to Botkit Studio: ${error}`);
        debug('Botkit Studio %O', error);
      }
    });
  } else {
    console.log('~~~~~~~~~~');
    console.log('NOTE: Botkit Studio functionality has not been enabled');
    console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
  }
}
