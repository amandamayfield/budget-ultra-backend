module.exports = {
  friendlyName: 'Disconnect',
  description: 'Disconnects a passport from a user.',
  inputs: {},
  exits: {
    success: {
      responseType: 'redirect',
    },
  },
  fn: async function (inputs, exits) {
    await sails.helpers.passport.disconnect(request);
    return exits.success(this.req.query.next || 'back');
  }
};
