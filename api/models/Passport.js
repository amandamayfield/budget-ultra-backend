/**
 * Passport.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltError, salt) => {
      bcrypt.hash(password, salt, null, (hashError, hash) => {
        if (hashError) {
          return reject(hashError);
        }

        return resolve({ password: hash });
      });
    });
  });
};

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    // Required field: Protocol
    //
    // Defines the protocol to use for the passport. When employing the local
    // strategy, the protocol will be set to 'local'. When using a third-party
    // strategy, the protocol will be set to the standard used by the third-
    // party service (e.g. 'oauth', 'oauth2', 'openid').
    protocol: { type: 'string', required: true, regex: /^[a-z0-9]+$/i },

    // Local field: Password
    //
    // When the local strategy is employed, a password will be used as the
    // means of authentication along with either a username or an email.
    password: { type: 'string', minLength: 8 },
    // accessToken is used to authenticate API requests. it is generated when a
    // passport (with protocol 'local') is created for a user.
    accessToken: { type: 'string' },

    // Provider fields: Provider, identifer and tokens
    //
    // "provider" is the name of the third-party auth service in all lowercase
    // (e.g. 'github', 'facebook') whereas "identifier" is a provider-specific
    // key, typically an ID. These two fields are used as the main means of
    // identifying a passport and tying it to a local user.
    //
    // The "tokens" field is a JSON object used in the case of the OAuth stan-
    // dards. When using OAuth 1.0, a `token` as well as a `tokenSecret` will
    // be issued by the provider. In the case of OAuth 2.0, an `accessToken`
    // and a `refreshToken` will be issued.
    provider   : { type: 'string', regex: /^[a-z0-9\-]+$/i },
    identifier : { type: 'string' },
    tokens     : { type: 'json' },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    user: { model: 'User', required: true },

  },

  /**
   * Callback to be run before creating a Passport.
   *
   * @param {Object}   passport The soon-to-be-created Passport
   * @param {Function} next
   */
  beforeCreate: async (passport, next) => {
    try {
      const { password } = await hashPassword(passport.password);
      passport.password = password;
      return next();
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Callback to be run before updating a Passport.
   *
   * @param {Object}   passport Values to be updated
   * @param {Function} next
   */
  beforeUpdate: async (passport, next) => {
    try {
      const { password } = await hashPassword(passport.password);
      passport.password = password;
      return next();
    } catch (error) {
      return next(error);
    }
  }

};

