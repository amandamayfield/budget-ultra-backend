module.exports = {
  friendlyName: 'Login',
  description: 'Login auth.',
  inputs: {},
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'auth/login',
      description: 'Anonymous user detected, showing login screen',
    },
    loggedIn: {
      responseType: 'redirect',
      description: 'User already logged in, redirecting.',
    },
  },
  fn: async function (input, exits) {
    if (this.req.user) {
      return exits.loggedIn(sails.config.custom.loggedInRoute);
    }

    const { providers } = await sails.helpers.passport.providerList();

    exits.success({
      providers,
      errors: this.req.flash('error'),
      messages: this.req.flash('message'),
    });
  },
};
