module.exports = {
  friendlyName: 'Provider',
  description: 'Create a third-party authentication endpoint.',
  inputs: {},
  exits: {
    success: {
      responseType: 'redirect',
    },
    authError: {
      responseType: 'redirect',
    },
  },
  fn: async function (inputs, exits) {
    const next = this.req.param('next');
    this.req.flash('next', next);
    try {
      await sails.helpers.passport.endpoint(this.req, this.res);
    } catch (error) {
      sails.log(error);
      return exits.authError('/login');
    }

    return exits.success(sails.config.custom.loggedInRoute);
  },
};
