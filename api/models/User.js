/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');

const hashPassword = (user) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltError, salt) => {
      bcrypt.hash(user.password, salt, null, (hashError, hash) => {
        if (hashError) {
          return reject(hashError);
        }

        return resolve({ password: hash });
      });
    });
  });
};

module.exports = {

  primaryKey: 'id',

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    profiles: {
      collection: 'profile',
      via: 'users',
    },

  },

  customToJSON: function () {
    return _.omit(this, ['password']);
  },
  beforeCreate: async (user, next) => {
    try {
      const { password } = await hashPassword(user);
      user.password = password;
      return next();
    } catch (error) {
      return next(error);
    }
  },

  beforeUpdate: async (user, next) => {
    try {
      const { password } = await hashPassword(user);
      user.password = password;
      return next();
    } catch (error) {
      return next(error);
    }
  }

};

