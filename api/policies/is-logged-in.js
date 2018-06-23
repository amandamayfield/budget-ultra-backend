/**
 * Passport.js will fill out the `request.user` object when the user is logged in.
 */
module.exports = async (request, response, next) => {
  if (!request.user) {
    response.redirect('/login');
  }

  next();
};
