module.exports = {
  friendlyName: 'passport::protocols::oauthTwo',
  description: 'OAuth 2.0 Authentication Protocol',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
    accessToken: {
      type: 'string',
      description: 'The bearer, or access, token to be used in authentication.',
      required: true,
    },
    refreshToken: {
      type: 'string',
      description: 'The bearer, or access, token to be used in authentication.',
      required: false,
    },
    profile: {
      type: 'ref',
      description: 'The profile from the OAuth provider',
      required: true,
    },
    // done: {
    //   type: 'ref',
    //   description: 'The passed callback',
    //   required: false,
    // },
  },
  /**
   * Bearer Authentication is for authorizing API requests. Once
   * a user is created, a token is also generated for that user
   * in its passport. This token can be used to authenticate
   * API requests.
   */
  fn: async ({request, accessToken, refreshToken, profile}, exits) => {
    var query = {
      identifier: profile.id,
      protocol: 'oauth2',
      tokens: { accessToken }
    };

    if (!_.isUndefined(refreshToken)) {
      query.tokens.refreshToken = refreshToken;
    }

    let results = {};
    try {
      results = await sails.helpers.passport.connect(request, query, profile);
    } catch (error) {
      return exits.error(error);
    }

    return exits.success(results);
  },
};
