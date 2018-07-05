module.exports = {
  friendlyName: 'passport::protocols::local::update',
  description: 'Alias for passport::protocols::local::updateUser',
  inputs: {
    user: {
      type: 'ref',
      description: 'The user to be updated',
      required: true,
    },
  },
  fn: async function ({user}, exits) {
    try {
      const results = await sails.helpers.passport.protocols.local.updateUser(user);
      return exits.success(results);
    } catch (error) {
      exits.error(error);
    }
  },
};
