module.exports = {
  friendlyName: 'passport::protocols::bearer',
  description: 'Bearer Authentication Protocol',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
    token: {
      type: 'string',
      description: 'The bearer, or access, token to be used in authentication.',
      required: true,
    },
    done: {
      type: 'ref',
      description: 'The passed callback',
      required: true,
    },
  },
  /**
   * Bearer Authentication is for authorizing API requests. Once
   * a user is created, a token is also generated for that user
   * in its passport. This token can be used to authenticate
   * API requests.
   */
  fn: async ({request, token, done}) => {
    Passport.findOne({ accessToken: token }).exec((err, passport) => {
      if (err) {
        return done(err);
      }

      if (!passport) {
        return done(null, false);
      }

      User.findOne({id: passport.user}).exec((err, user) => {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        // delete access_token from params
        // to avoid conflicts with blueprints query builder
        delete request.query.access_token;
        return done(null, user, { scope: 'all' });
      });
    });
  },
};
