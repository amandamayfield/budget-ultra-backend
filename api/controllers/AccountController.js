/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const interceptJson = (response) => (error) => response.json(error);

module.exports = {

  create: async (request, response) => {
    const { id } = request.body;
    const newModel = await Account.create({ id })
      .intercept('E_UNIQUE', interceptJson(response))
      .intercept({ name: 'UsageError' }, interceptJson(response))
      .fetch();

    response.json(newModel);
  },

};
