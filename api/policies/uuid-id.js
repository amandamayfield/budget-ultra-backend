/**
 * Hacky way to enforce automatic generation of IDs for API routes.
 */
module.exports = async (request, response, next) => {
  const orderedId = sails.helpers.orderedUuid();

  if (request.method === 'GET') {
    request.params.id = orderedId;
  } else if (request.method === 'POST') {
    request.body.id = orderedId;
  }
  next();
};
