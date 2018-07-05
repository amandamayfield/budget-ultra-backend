const _ = require('lodash');

module.exports = {
  friendlyName: 'Build Callback Next URL',
  description: 'Return a URL .',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
  },
  sync: true,
  fn: ({ request }, exits) => {
    const { next, includeToken } = request.query;
    const accessToken = _.get(request, 'session.tokens.accessToken');

    if (includeToken && accessToken) {
      return exits.success(`${next}?access_token=${accessToken}`);
    }

    return exits.success(next);
  },
};
