const passport = require('passport');

module.exports = {
  friendlyName: 'passport::callback',
  description: 'Interface for passport. Authentication callback endpoint',
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
  exits: {
    invalidCredentials: {
      responseType: 'invalidCredentials',
      description: 'Invalid email and password combination.',
      status: 401,
    },
  },
  fn: async ({ request, response }, exits) => {
    const provider = request.param('provider', 'local');
    const action = request.param('action');

    async function runProtocol(protocol) {
      const results = await protocol(request);
      return exits.success(results);
    }

    function sailsifyPassport (error, user, info, status) {
      sails.log('passport callback');
      if (error) {
        sails.log('encountered an error');
        // Login Errors
        if (error.code === 'emailNotFound' || error.code === 'invalidPassword') {
          return exits.invalidCredentials(error.raw);
        }

        // Registration Errors
        sails.log.error(error);
        if (error.code === '') {
          return exits.error(error);
        }

        return exits.error(error);
      }

      sails.log('passport method success', user, info, status);
      return exits.success({ user, info, status });
    }

    if (provider === 'local' && action !== undefined) {
      const { protocols } = sails.helpers.passport;
      if (action === 'register' && !request.user) {
        return await runProtocol(protocols.local.register.bind(null, request.body));
      } else if (action === 'connect' && req.user) {
        return await runProtocol(protocols.local.connect);
      } else {
        return exits.error(new Error('Invalid action'));
      }
    }

    if (action === 'disconnect' && request.user) {
      await sails.helpers.passport.disconnect(request);
      return exits.success({});
    } else {
      sails.log('Authenticating...');
      // The provider will redirect the user to this URL after approval. Finish
      // the authentication process by attempting to obtain an access token. If
      // access was granted, the user will be logged in. Otherwise, authentication
      // has failed.
      passport.authenticate(provider, sailsifyPassport)(request, response, request.next);
    }
  },
};
