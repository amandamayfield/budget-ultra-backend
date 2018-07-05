const base64URL = require('base64url');
const crypto = require('crypto');

function generateToken() {
  return base64URL(crypto.randomBytes(48));
}

module.exports = {
  friendlyName: 'passport::protocols::local::createUser',
  description: 'Register a new user.',
  inputs: {
    userParams: {
      type: 'ref',
      description: 'The user to be updated',
      required: true,
    },
  },
  /**
   * This method creates a new user from a specified email, username and password
   * and assign the newly created user a local Passport.
   */
  fn: async ({userParams}, exits) => {
    sails.log('passport::protocols::local::createUser');

    let user = null;

    userParams.id = sails.helpers.orderedUuid();

    const { password } = userParams;
    delete userParams.password;

    try {
      user = await User.create(userParams).fetch();

      const accessToken = generateToken();
      await Passport.create({
        id: sails.helpers.orderedUuid(),
        protocol: 'local',
        user: user.id,
        password,
        accessToken,
      });

      exits.success(user);
    } catch (error) {
      sails.log.error(error);

      let cause = error;
      if (error.code === 'E_VALIDATION') {
        cause = new Error({ originalError: error });
      }

      // Cleanup users on failure
      if (user) {
        try {
          await User.destroy(user);
          return exits.error(cause);
        } catch (destroyError) {
          return exits.error(destroyError);
        }
      }

      return exits.error(cause);
    }
  }
};
