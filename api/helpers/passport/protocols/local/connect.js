module.exports = {
  friendlyName: 'passport::protocols::local::connect',
  description: 'Assign local passport to user.',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
    response: {
      type: 'ref',
      description: 'The current response object (res)',
      required: false,
    },
  },
  /**
   * This function can be used to assign a local Passport to a user who doens't
   * have one already. This would be the case if the user registered using a
   * third-party service and therefore never set a password.
   */
  fn: async function ({request}, exits) {
    const user = request.user;
    const password = request.param('password');
    const query = {
      protocol : 'local',
      user: user.id,
    };

    let passport = null;
    try {
      passport = await Passport.findOne(query).fetch();
    } catch (error) {
      return exits.error(error);
    }

    if (!passport) {
      query.password = password;

      try {
        await Passport.create(query);
      } catch (error) {
        return exits.error(error, user);
      }
    }

    return exits.success(user);
  },
};
