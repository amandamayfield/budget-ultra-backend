const url = require('url');
const _ = require('lodash');
const passport = require('passport');

passport.serializeUser((user, done) => done(null, user.user ? user.user.id : user.id));
passport.deserializeUser((id, done) => User.findOne({ id }, done));

module.exports = function () {
  return {
    initialize: function (next) {
      const { baseUrl } = sails.config.custom;
      const { strategies } = sails.config.passport;
      const { protocols } = sails.helpers.passport;

      const localStrategyCallback = async (request, identifier, password, done) => {
        try {
          const { user, info, status } = await protocols.local.login(request, identifier, password);

          return done(null, user, info, status);
        } catch (error) {
          return done(error);
        }
      };

      _.each(strategies, (strategy, key) => {
        const options = { passReqToCallback: true };
        const Strategy = strategies[key].strategy;

        if (key === 'local') {
          // Since we need to allow users to login using both usernames as well as
          // emails, we'll set the username field to something more generic.
          _.extend(options, { usernameField: 'identifier' });

          // Only load the local strategy if it's enabled in the config
          if (strategies.local) {
            passport.use(new Strategy(options, localStrategyCallback));
          }

          return;
        }

        const { protocol } = strategies[key];
        let { callback } = strategies[key];

        const strategyCallback = async (...rest) => {
          const params = rest.slice(0, -1);
          const done = rest[rest.length - 1];

          try {
            const results = await protocols[protocol](...params);
            sails.log('strategy callback results', results);
            return done(null, results.user);
          } catch (error) {
            return done(error);
          }
        };

        if (!callback) {
          callback = `/auth/${key}/callback`;
        }

        switch (protocol) {
          case 'oauth':
          case 'oauthTwo':
            options.callbackURL = url.resolve(baseUrl, callback);
            break;

          case 'openid':
            options.returnURL = url.resolve(baseUrl, callback);
            options.realm = baseUrl;
            options.profile = true;
            break;
        }

        // Merge the default options with any options defined in the config. All
        // defaults can be overriden, but I don't see a reason why you'd want to
        // do that.
        _.extend(options, strategies[key].options);

        passport.use(new Strategy(options, strategyCallback));
      });

      return next();
    },

    routes: {
      before: {
        '/*': {
          skipAssets: true,
          fn: async function (request, response, next) {
            response.locals.user = undefined;

            if (request.user) {
              response.locals.user = User.customToJSON.call(request.user);
            }

            next();
          },
        }
      }
    }
  };
};
