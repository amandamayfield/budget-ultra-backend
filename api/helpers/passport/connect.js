const _ = require('lodash');

module.exports = {
  friendlyName: 'passport::connect',
  description: 'Connect a third-party profile to a local user',
  inputs: {
    request: {
      type: 'ref',
      description: 'The current request object (req)',
      required: true,
    },
    query: {
      type: 'ref',
      description: 'The current response object (res)',
      required: true,
    },
    profile: {
      type: 'ref',
      description: 'The profile from the OAuth provider',
      required: true,
    },
  },
  exits: {},
  /**
   * This is where most of the magic happens when a user is authenticating with a
   * third-party provider. What it does, is the following:
   *
   *   1. Given a provider and an identifier, find a matching Passport.
   *   2. From here, the logic branches into two paths.
   *
   *     - A user is not currently logged in:
   *       1. If a Passport wassn't found, create a new user as well as a new
   *          Passport that will be assigned to the user.
   *       2. If a Passport was found, get the user associated with the passport.
   *
   *     - A user is currently logged in:
   *       1. If a Passport wasn't found, create a new Passport and associate it
   *          with the already logged in user (ie. "Connect")
   *       2. If a Passport was found, nothing needs to happen.
   *
   * As you can see, this function handles both "authentication" and "authori-
   * zation" at the same time. This is due to the fact that we pass in
   * `passReqToCallback: true` when loading the strategies, allowing us to look
   * for an existing session in the request and taking action based on that.
   *
   * For more information on auth(entication|rization) in Passport.js, check out:
   * http://passportjs.org/guide/authenticate/
   * http://passportjs.org/guide/authorize/
   */
  fn: async ({request, query, profile}, exits) => {
    let user = {};
    let passport = null;

    // Use profile.provider or fallback to the query.provider if it is undefined
    // as is the case for OpenID, for example
    const provider = profile.provider || request.param('provider');

    request.session.tokens = query.tokens;

    // Get the authentication provider from the query.
    query.provider = provider;

    // If the provider cannot be identified we cannot match it to a passport so
    // throw an error and let whoever's done in line take care of it.
    if (!provider) {
      return exits.error(new Error('No authentication provider was identified.'));
    }

    // If the profile object contains a list of emails, grab the first one and
    // add it to the user.
    if (profile.emails && profile.emails[0]) {
      user.email = profile.emails[0].value;
    }

    // If neither an email or a username was available in the profile, we don't
    // have a way of identifying the user in the future. Throw an error and let
    // whoever's done in the line take care of it.
    if (!user.username && !user.email) {
      return exits.error(new Error('Neither a username nor email was available'));
    }

    const identifier = query.identifier.toString();
    try {
      passport = await Passport.findOne({provider, identifier});
    } catch (error) {
      sails.log.error(error);
      exits.error(error);
    }
    if (!request.user) {
      // Scenario: A new user is attempting to sign up using a third-party
      //           authentication provider.
      // Action:   Create a new user and assign them a passport.
      if (!passport) {
        sails.log('creating new user based off connected account', request.user);
        user.id = sails.helpers.orderedUuid();
        try {
          user = await User.create(user).fetch();

          sails.log('creating passport for newly created user');
          await Passport.create(_.extend({
            id: sails.helpers.orderedUuid(),
            user: user.id,
          }, query));
        } catch (error) {
          return exits.error(error);
        }

        return exits.success({ user });
      }

      // Scenario: An existing user is trying to log in using an already
      //           connected passport.
      // Action:   Get the user associated with the passport.
      // If the tokens have changed since the last session, update them
      if (_.has(query, 'tokens') && query.tokens !== passport.tokens) {
        passport.tokens = query.tokens;
      }

      // Save any updates to the Passport before moving on
      try {
        sails.log('Updating existing passport based on this login attempt, no user creation');
        await Passport.update({ id: passport.id }, { tokens: passport.tokens });
        // Fetch the user associated with the Passport
        user = await User.findOne(passport.user);
      } catch (error) {
        return exits.error(error);
      }

      return exits.success({ user });
    }

    // Scenario: A user is currently logged in and trying to connect a new
    //           passport.
    // Action:   Create and assign a new passport to the user.
    if (!passport) {
      sails.log('creating passport for existing user');
      try {
        passport = await Passport.create(_.extend({
          id: sails.helpers.orderedUuid(),
          user: request.user.id,
        }, query)).fetch();
      } catch (error) {
        return exits.error(error);
      }

      return exits.success({ user: request.user });

    }
    // Scenario: The user is a nutjob or spammed the back-button.
    // Action:   Simply pass along the already established session.
    sails.log('user already logged in, already has passport');
    return exits.success({ user: request.user });
  },
};
