module.exports = {
  friendlyName: 'passport::protocols::local::register',
  description: 'Alias for passport::protocols::local::createUser',
  inputs: {
    user: {
      type: 'ref',
      description: 'The user to be created',
      required: true,
    },
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: false,
    },
    response: {
      type: 'ref',
      description: 'The current response object (res)',
      required: false,
    },
  },
  fn: async function ({user}, exits) {
    try {
      const results = await sails.helpers.passport.protocols.local.createUser(user);
      return exits.success({ user: results });
    } catch (error) {
      exits.error(error);
    }
  },
};
