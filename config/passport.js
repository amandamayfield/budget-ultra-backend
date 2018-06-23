const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findOne({ id }, done));

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, (username, password, done) => {
  User.findOne({ username }, (error, user) => {
    if (error) {
      return done(error);
    }

    if (!user) {
      return done(null, false, { message: 'Username and password combination not valid' });
    }

    bcrypt.compare(password, user.password, (passwordError, result) => {
      if (!result) {
        return done(null, false, { message: 'Username and password combination not valid' })
      }

      let userDetails = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      return done(null, userDetails, { message: 'Login Successful' });
    });
  });
}))
