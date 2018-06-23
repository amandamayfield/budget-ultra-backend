const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt-nodejs');
const usernameField = 'email';
const passwordField = 'password';
const localStrategyParams = { usernameField, passwordField };
const registerParams = Object.assign({}, localStrategyParams, {passReqToCallback: true });
const googleParams = {
  // Make sure you add the Google+ API to your application
  clientID: 'GOOGLE_APP_ID',
  clientSecret: 'GOOGLE_APP_SECRET',
  // Google doesn't allow the use of localhost in the callbackURL
  // Visit www.displaymyhostname.com and use your host name in the application and callbackURL below
  callbackURL: 'http://HOSTNAME.com:PORT/auth/google/callback'
};

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findOne({ id }, done));

passport.use(new LocalStrategy(localStrategyParams, (email, password, done) => {
  User.findOne({ email }, (error, user) => {
    if (error) {
      return done(error);
    }

    if (!user) {
      return done(null, false, { message: 'Username and password combination not valid' });
    }

    bcrypt.compare(password, user.password, (passwordError, result) => {
      if (!result) {
        return done(null, false, { message: 'Username and password combination not valid' });
      }

      let userDetails = {
        id: user.id,
        email: user.email,
      };

      return done(null, userDetails, { message: 'Login Successful' });
    });
  });
}));

// Register a new local user
passport.use('register', new LocalStrategy(registerParams, (request, email, password, done) => {
  User.findOne({ email }, function(error, user){
    if (error) {
      return done(error, false, {message: 'Something went wrong'});
    }

    if (user) {
      const { googleId } = user;
      if (googleId) {
        User.update({ googleId }, { password }, function(err, user){
          if (err) {
            return done(err, false, {message: 'Tried to add a password to your account but something went wrong'});
          }

          // Create object to send back
          const returnUser = {
            email: user[0].email,
            createdAt: user[0].createdAt,
            id: user[0].id,
          };

          return done(null, returnUser, { message: 'You were already registered with Google but we added the password to your account and assigned a username.  You can login either way now'});
        });
      } else {
        return done(null, false, {message: 'User already exists'});
      }
    }
    User.create({ email, password }, function(createError, user){
      if (createError) {
        return done(createError, false, { message: 'Something went wrong' });
      }

      const returnUser = {
        email: user.email,
        createdAt: user.createdAt,
        id: user.id,
      };

      return done(null, returnUser, { message: 'User created Successfully' });
    });
  })
}));

passport.use(new GoogleStrategy(googleParams, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;

  User.findOne({ email }, (error, user) => {
    if (error) {
      return done(error);
    }

    // No user found, then create an account
    if (!user || user === 'false') {
      User.create({ googleId: profile.id, email }, (createError, user) => {
        if (createError) {
          return done(createError, false, { message: 'Something went wrong' });
        }

        // Create object to send back
        const returnUser = {
          email,
          createdAt: user.createdAt,
          id: user.id
        };

        return done(null, returnUser, { message: 'Google user created' });
      })
    } else {
      // Found an account, link account to Facebook ID
      User.update({ email }, { googleId: profile.id }, (updateError, user) => {
        if (updateError) {
          return done(updateError, false, { message: 'Something went wrong' });
        }

        // Create object to send back
        const returnUser = {
          email: user[0].email,
          createdAt: user[0].createdAt,
          id: user[0].id
        };

        return done(null, returnUser, { message: 'User already registered, linked Google account' });
      });
    }
  });
}));
