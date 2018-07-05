/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {

  create: async (request, response) => {
    try {
      const { user } = await sails.helpers.passport.protocols.local.register(request.body);
      return response.ok(user);
    } catch (error) {
      sails.log.error(error);
      // @DEPRECATED
      return response.negotiate(error);
    }

  },

  update: async (request, response) => {
    try {
      const { user } = await sails.helpers.passport.protocols.local.update(request.body);
      return response.ok(user);
    } catch (error) {
      sails.log.error(error);
      // @DEPRECATED
      return response.negotiate(error);
    }
  },

};
