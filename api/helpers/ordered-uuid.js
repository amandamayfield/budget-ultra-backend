/**
 * Example of reordering process below
 * 12 34 56 78 - 90 ab - cd ef - 12 34 - 56 78 90 ab cd ef
 *  0  1  2  3    4  5    6  7    8  9   10 11 12 13 14 15
 * -------------------------------------------------------
 *  6  7    4  5    0  1  2  3    8  9   10 11 12 13 14 15
 * cd ef - 90 ab - 12 34 56 78 - 12 34 - 56 78 90 ab cd ef
 */

const uuidv1 = require('uuid/v1');

module.exports = {
  friendlyName: 'Ordered UUID Generator',
  description: 'Generates and reorders a UUIDv1 to use the least volatile time bytes first',
  inputs: {},
  sync: true,
  fn: (inputs, exits) => {
    const pieces = [];
    uuidv1(null, pieces);
    const orderedId = [
      ...pieces.slice(6, 7),
      ...pieces.slice(4, 5),
      ...pieces.slice(0, 3),
      ...pieces.slice(8),
    ].join('');

    return exits.success(orderedId);
  },
};
