const debug = require('debug')('botkit:user-registration');

module.exports = controller => {
  /* Handle event caused by a user logging in with oauth */
  controller.on('oauth:success', payload => {
    debug('Got a successful login!', payload);

    if (!payload.identity.team_id) {
      debug('Error: received an oauth response without a team id', payload);
    }

    controller.storage.teams.get(payload.identity.team_id, (err, team) => {
      const isNewTeam = !team;

      if (err) {
        debug('Error: could not load team from storage system:', payload.identity.team_id, err);
      }

      if (!team) {
        team = {
          createdBy: payload.identity.user_id,
          id: payload.identity.team_id,
          name: payload.identity.team,
          url: payload.identity.url
        };
      }

      team.bot = {
        app_token: payload.access_token,
        createdBy: payload.identity.user_id,
        token: payload.bot.bot_access_token,
        user_id: payload.bot.bot_user_id
      };

      const testbot = controller.spawn(team.bot);
      testbot.api.auth.test({}, (err, botAuth) => {
        if (err) {
          debug('Error: could not authenticate bot user', err);
        } else {
          team.bot.name = botAuth.user;

          // Add info expected by Botkit
          testbot.identity = botAuth;

          testbot.identity.id = botAuth.user_id;
          testbot.identity.name = botAuth.user;

          testbot.team_info = team;

          // Replace this with your own database!
          controller.storage.teams.save(team, error => {
            if (err) {
              debug('Error: could not save team record:', error);
            } else {
              controller.trigger(isNewTeam ? 'create_team' : 'update_team', [ testbot, team ]);
            }
          });
        }
      });
    });
  });

  controller.on('create_team', (bot, team) => {
    const { config } = bot;

    debug('Team created:', team);

    // Trigger an event that will establish an RTM connection for this bot
    controller.trigger('rtm:start', [ config ]);

    // Trigger an event that will cause this team to receive onboarding messages
    controller.trigger('onboard', [ bot, team ]);
  });

  controller.on('update_team', (bot, team) => {
    debug('Team updated:', team);

    // Trigger an event that will establish an RTM connection for this bot
    controller.trigger('rtm:start', [ bot ]);
  });
};
