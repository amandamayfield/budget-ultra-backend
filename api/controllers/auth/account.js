module.exports = {
  friendlyName: 'Account',
  description: 'Account auth.',
  inputs: {},
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/account',
      description: 'Successfully found user. Showing personalized account page.',
    },
  },
  fn: async function (inputs, exits) {
    const userId = this.req.user.id;
    const { providers } = await sails.helpers.passport.providerList(userId);

    exits.success({ providers });
  }
};
