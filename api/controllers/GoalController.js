/**
 * GoalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const interceptJson = (error) => response.json(error);

module.exports = {

  create: async (request, response) => {
    const { id } = request.body;
    const newModel = await Goal.create({ id })
      .intercept('E_UNIQUE', interceptJson)
      .intercept({ name: 'UsageError' }, interceptJson)
      .fetch();

    response.json(newModel);
  },

};
