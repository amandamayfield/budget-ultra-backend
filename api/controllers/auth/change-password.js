module.exports = {
  friendlyName: 'Change password',
  description: 'Simple action for changing an authenticated users password.',
  inputs: {},
  exits: {
    success: {
      responseType: 'view',
      viewTemplatePath: 'auth/changePassword',
    }
  },
  fn: async function (inputs, exits) {
    const { id } = this.req.user;
    const viewData = { userId: id };

    if (this.req.method === 'POST') {
      const { password, confirmPassword } = this.req.body;
      if (password === confirmPassword) {
        await Passport.update({ provider: 'local', user: id }, { password });
      } else {
        viewData.error = { errorCode: 'password-mismatch', developerMessage: 'Password did not match' };
      }
    }

    exits.success(viewData);
  },
};
