/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {

  login: (request, response) => {
    passport.authenticate('local', (authError, user, { message }) => {
      if (authError || !user) {
        return response.send({ message, user });
      }

      request.logIn(user, (loginError) => {
        if (loginError) {
          response.send(loginError);
        }

        return response.send({ message, user });
      });
    })(request, response);
  },

  logout: (request, response) => {
    request.logout();
    response.redirect('/');
  },

};

