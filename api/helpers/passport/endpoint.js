const passport = require('passport');

module.exports = {
  friendlyName: 'passport::endpoint',
  description: 'Create an authentication endpoint',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
    response: {
      type: 'ref',
      description: 'The current response object (res)',
      required: true,
    },
  },
  exits: {},
  fn: async ({request, response}, exits) => {
    const { strategies } = sails.config.passport;
    const provider = request.param('provider');
    const options = {};

    function sailsifyPassport (error, user, info, status) {
      if (error) {
        sails.log.error('passport callback', error);
        return exits.error(error);
      }

      sails.log('passport method success');
      return exits.success({ user, info, status });
    }

    // If a provider doesn't exist for this endpoint, send the user back to the
    // login page
    if (!_.has(strategies, provider)) {
      sails.log.warn('strategy has no provider');
      return exits.error(new Error('strategy has no provider'));
    }

    // Attach scope if it has been set in the config
    if (_.has(strategies[provider], 'scope')) {
      options.scope = strategies[provider].scope;
    }

    // Redirect the user to the provider for authentication. When complete,
    // the provider will redirect the user back to the application at
    //     /auth/:provider/callback
    passport.authenticate(provider, options, sailsifyPassport)(request, response, request.next);
  },
};
