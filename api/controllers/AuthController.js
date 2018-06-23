/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

const strategyScopeMap = {
  local: {},
  register: {},
  google: { scope: ['profile','email'] },
};

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

  register: function(request, response) {
    passport.authenticate('register', {}, (authError, user, { message }) => {
      if (authError || !user) {
        return response.send({
          message,
          user,
          text: 'failed'
        });
      }

      request.logIn(user, function(loginError) {
        if (loginError) {
          return response.send(loginError);
        }
        return response.send({
          message,
          user,
        });
      });
    })(request, response);
  },

  socialAuth: function(request, response) {
    const { strategy } = request.param;

    scopes = strategyScopeMap[strategy];

    if (scopes === undefined) {
      return response.redirect('/signup');
    }

    passport.authenticate(strategy, scopes, (authError, user, { message }) => {
      if (authError || !user) {
        return response.send({
          message,
          user,
          text: 'failed'
        });
      }

      request.logIn(user, function(loginError) {
        if (loginError) {
          return response.send(loginError);
        }
        return response.send({
          message,
          user,
        });
      });
    })(request, response);
  },

  provider: (request, response) => {
    sails.services.passport.endpoint(request, response);
  },

  callback: (request, response) => {
    const action = request.param('action');

    function negotiateError (err) {
      if (action === 'register') {
        response.redirect('/register');
      }
      else if (action === 'login') {
        response.redirect('/login');
      }
      else if (action === 'disconnect') {
        response.redirect('back');
      }
      else {
        // make sure the server always returns a response to the client
        // i.e passport-local bad username/email or password
        response.send(403, err);
      }
    }

    sails.services.passport.callback(request, response, function (err, user, info, status) {
      if (err || !user) {
        sails.log.warn(user, err, info, status);
      if(!err && info) {
        return negotiateError(info);
      }
        return negotiateError(err);
      }

      request.login(user, function (err) {
        if (err) {
          sails.log.warn(err);
          return negotiateError(err);
        }

        request.session.authenticated = true;

        // Upon successful login, optionally redirect the user if there is a
        // `next` query param
        if (request.query.next) {
          var url = sails.services.authservice.buildCallbackNextUrl(request);
          response.status(302).set('Location', url);
        }

        sails.log('user', user, 'authenticated successfully');
        return response.json(user);
      });
    });
  },

  logout: (request, response) => {
    request.logout();
    response.redirect('/');
  },

  changePassword: async (request, response) => {
    const { id } = request.user;
    const viewData = { userId: id };

    if (request.method === 'POST') {
      const user = await User.find({ id })

      const { password, confirmPassword } = request.body;

      if (password === confirmPassword) {
        user.password = password;
        user.savee()
      } else {
        viewData.error = { error_code: 'password-mismatch', developer_message: 'Password did not match' };
      }
    }

    response.view('pages/change-password', { userId: id });
  },

};

