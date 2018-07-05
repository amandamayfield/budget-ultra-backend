module.exports = {
  friendlyName: 'Register',
  description: 'Register auth.',
  inputs: {},
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'auth/register',
      description: 'Anonymous user detected, showing register screen',
    },
    loggedIn: {
      responseType: 'redirect',
      description: 'User already logged in, redirecting.',
    },
  },
  fn: async function (inputs, exits) {
    if (this.req.user) {
      exits.loggedIn(sails.config.custom.loggedInRoute);
    }

    const { providers } = await sails.helpers.passport.providerList();

    exits.success({
      providers: providers,
      errors: this.req.flash('error'),
      messages: this.req.flash('message'),
    });
  },
};
