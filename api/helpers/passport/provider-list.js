module.exports = {
  friendlyName: 'Provider list',
  description: 'Compiles a list of passport providers based on your `sails.config.passport`.',
  inputs: {
    userId: {
      type: 'string',
      example: '1234567890abcdef1234567890abcdef',
      description: 'The currently logged in user ID',
      required: false,
    },
  },
  exits: {},
  fn: async function ({ userId }, exits) {
    const userProviders = [];

    if (userId) {
      const user = await User.findOne({ id: userId }).populate('passports');
      userProviders.push(...user.passports.map((passport) => passport.provider));
    }

    const { strategies } = sails.config.passport;
    const providers = {};

    Object.keys(strategies).forEach((key) => {
      if (key === 'local' || key === 'bearer') {
        return;
      }

      providers[key] = {
        name: strategies[key].name,
        slug: key,
        isConnected: userProviders.includes(key),
      };
    });

    exits.success({providers});
  },
};
