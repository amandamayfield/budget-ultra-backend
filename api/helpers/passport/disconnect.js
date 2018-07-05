module.exports = {
  friendlyName: 'passport::disconnect',
  description: 'Disconnect a passport from a user',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    }
  },
  exits: {},
  fn: async ({request}, exits) => {
    const user = request.user;
    const provider = request.param('provider');

    try {
      const passport = await Passport.findOne({
        provider,
        user: user.id
      });
      await Passport.destroy(passport.id);
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }

    return exits.success(user);
  },
};
