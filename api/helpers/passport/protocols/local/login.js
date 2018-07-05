const bcrypt = require('bcrypt-nodejs');

module.exports = {
  friendlyName: 'passport::protocols::local::',
  description: 'Validate a login request.',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
    identifier: {
      type: 'string',
      example: 'admin@gmail.com',
      description: 'The identifier of the user requesting to be logged in',
      required: true,
    },
    password: {
      type: 'string',
      example: 'admin123',
      description: 'The user submitted password for verification.',
      required: true,
    },
  },
  exits: {
    invalidPassword: {
      responseType: 'invalidPassword',
      description: 'An incorrect password was entered.',
      statusCode: 401,
    },
    emailNotFound: {
      responseType: 'emailNotFound',
      description: 'No user with the specified email was found.',
      statusCode: 401,
    },
  },
  /**
   * Looks up a user using the supplied identifier (email or username) and then
   * attempts to find a local Passport associated with the user. If a Passport is
   * found, its password is checked against the password supplied in the form.
   */
  fn: async function ({request, identifier, password}, exits) {
    const query = { email: identifier };

    let user = null;
    try {
      user = await User.findOne(query);
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }

    if (!user) {
      return exits.emailNotFound({ user: false, info: 'Error.Passport.InvalidCredentials', status: 401 });
    }

    const passportQuery = {
      protocol: 'local',
      user: user.id,
    };

    let foundPassport;
    try {
      foundPassport = await Passport.findOne(passportQuery);
    } catch (error) {
      sails.log.warn('ignoring error -- ', error);
    }

    if (foundPassport) {
      return bcrypt.compare(password, foundPassport.password, (error, result) => {
        if (error) {
          sails.log.error('bcrypt error', error);
          return exits.error(error);
        }

        if (!result) {
          // sails.log.warn('Was going to set flash data here. Should probably fix that');
          request.flash('error', {
            errorCode: 'Error.Passport.InvalidCredentials',
            developerMessage: '',
            statusCode: 401,
          });
          sails.log('incorrect password');
          return exits.success({ user: false });
        }

        sails.log('successful login attempt');
        return exits.success({ user, passport: foundPassport });
      });
    }

    // sails.log.warn('Was going to set flash data here. Should probably fix that');
    request.flash('error', {
      errorCode: 'Error.Passport.Password.NotSet',
      developerMessage: '',
      statusCode: 401,
    });

    sails.log('user does not have a local passport');
    return exits.success({ user: false });
  },
};
