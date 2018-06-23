/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const interceptJson = (response) => (error) => response.json(error);

module.exports = {

  create: async (request, response) => {
    const payload = request.body || request.params;
    const { id, email, password, username } = payload;
    const newUser = await User.create({ id, email, password, username })
      .intercept('E_UNIQUE', interceptJson(response))
      .intercept({ name: 'UsageError' }, interceptJson(response))
      .fetch();

    response.json(newUser);
  },

};
