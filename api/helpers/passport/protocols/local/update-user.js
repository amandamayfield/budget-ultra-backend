module.exports = {
  friendlyName: 'passport::protocols::local::updateUser',
  description: 'Update a user',
  inputs: {
    user: {
      type: 'ref',
      description: 'The user to be updated',
      required: true,
    },
  },
  /**
   * This method updates an user based on its id and assign the newly created
   * user a local Passport.
   */
  fn: async ({user}, exits) => {
    const password = user.password;
    const userId = user.id;
    delete user.password;

    const userQuery = { id: userId };
    try {
      await User.update(userQuery, user);
    } catch (error) {
      sails.log.error(error);
      if (error.code === 'E_VALIDATION') {
        return exits.error(new Error({ originalError: error }));
      }

      return exits.error(error);
    }

    // Check if password has a string to replace it
    if (!!password) {
      try {
        await Passport.update({ protocol: 'local', user: userId }, { password });
      } catch (error) {
        sails.log.error(error);
        if (saveError.code === 'E_VALIDATION') {
          return exits.error(new Error({ originalError: error }));
        }

        return exits.error(error);
      }
    }

    return exits.success({ user });
  },
};
