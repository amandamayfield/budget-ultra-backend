module.exports = {
  friendlyName: 'Logout',
  description: 'Logout auth.',
  inputs: {},
  exits: {
    next: {
      responseType: 'redirect',
    }
  },
  fn: async function (inputs, exits) {
    this.req.logout();

    if (this.req.isSocket) {
      return exits.success();
    }

    return exits.next(this.req.query.next || '/');
  },
};
