/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const interceptJson = (error) => response.json(error);

module.exports = {

  create: async (request, response) => {
    const { id, email, password, username } = request.body;
    const newUser = await User.create({ id, email, password, username })
      .intercept('E_UNIQUE', interceptJson)
      .intercept({ name: 'UsageError' }, interceptJson)
      .fetch();

    response.json(newUser);
  },

};
