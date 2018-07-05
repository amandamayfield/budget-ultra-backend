/**
 * Authentication callback endpoint.
 *
 * This endpoint handles everything related to creating and verifying Pass-
 * ports and users, both locally and from third-aprty providers.
 */
module.exports = {
  friendlyName: 'Callback',
  description: 'Create a authentication callback endpoint.',
  inputs: {},
  exits: {
    invalidCredentials: {
      responseType: 'passportCallbackFailed',
      description: 'invalid email and password combination',
      statusCode: 401,
    },
    authenticationFailed: {
      responseType: 'passportCallbackFailed',
      description: 'Authentication failed.',
    },
    authenticationSuccess: {},
    loggedIn: {
      responseType: 'redirect',
      description: 'User was logged in successfully.',
    },
  },
  fn: async function (inputs, exits) {
    let results = {};
    try {
      results = await sails.helpers.passport.callback(this.req, this.res);
    } catch (error) {
      sails.log(error.code);
      if (error.code === 'invalidCredentials') {
        return exits.invalidCredentials({
          errorCode: 'Error.Passport.InvalidCredentials',
          developerMessage: 'Invalid email and password combination.',
          statusCode: 401,
        });
      } else if (error.code === 'E_UNIQUE') {
        return exits.emailInUse({
          errorCode: 'Error.Passport.User.Email.Unique',
          developerMessage: 'That email address is already in use.',
          statusCode: 400,
        });
      } else if (error.code === 'E_INVALID_NEW_RECORD') {
        debugger;
        // return exits.
      }

      return exits.authenticationFailed({
        errorCode: 'Error.Passport.Generic',
        developerMessage: 'A problem was encountered while trying to process your request. Please try again.',
        statusCode: 401,
      });
    }

    const { user, info } = results;

    if (!user || (info && Object.keys(info).length !== 0)) {
      return exits.authenticationFailed(null, info);
    }

    this.req.login(user, (loginError) => {
      sails.log('login callback');
      if (loginError) {
        sails.log.warn(loginError);
        return exits.authenticationFailed(loginError);
      }

      // Upon successful login, optionally redirect the user if there is a
      // `next` query param
      if (this.req.query.next) {
        const url = sails.helpers.buildCallbackNextUrl(this.req);
        return exits.loggedIn(url);
      }

      let redirect = this.req.flash('next');
      redirect = redirect ? redirect[0] : '/account';

      return exits.loggedIn(redirect);
    });
  },
};
