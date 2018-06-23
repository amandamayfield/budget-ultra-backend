/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': true,
  'auth/changePassword': 'is-logged-in',

  // models
  'account/create'     : 'uuid-id',
  'category/create'    : 'uuid-id',
  'goal/create'        : 'uuid-id',
  'payee/create'       : 'uuid-id',
  'profile/create'     : 'uuid-id',
  'transaction/create' : 'uuid-id',
  'user/create'        : 'uuid-id',
};
