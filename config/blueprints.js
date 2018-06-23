/**
 * Blueprint API Configuration
 * (sails.config.blueprints)
 *
 * For background on the blueprint API in Sails, check out:
 * https://sailsjs.com/docs/reference/blueprint-api
 *
 * For details and more available options, see:
 * https://sailsjs.com/config/blueprints
 */

module.exports.blueprints = {

  /***************************************************************************
  *                                                                          *
  * Automatically expose implicit routes for every action in your app?       *
  *                                                                          *
  ***************************************************************************/

  // actions: false,


  /***************************************************************************
  *                                                                          *
  * Automatically expose RESTful routes for your models?                     *
  *                                                                          *
  ***************************************************************************/

  rest: true,


  /***************************************************************************
  *                                                                          *
  * Automatically expose CRUD "shortcut" routes to GET requests?             *
  * (These are enabled by default in development only.)                      *
  * '/:model/find/:id?'                                                      *
  * '/:model/create'                                                         *
  * '/:model/update/:id'                                                     *
  * '/:model/destroy/:id'                                                    *
  *                                                                          *
  ***************************************************************************/

  // shortcuts: true,


  /***************************************************************************
  *                                                                          *
  * Optional mount path prefix (e.g. '/api/v2') for all blueprint routes,    *
  * including `rest`, `actions`, and `shortcuts`. This only applies to       *
  * implicit blueprint ("shadow") routes, not your custom routes.)           *
  *                                                                          *
  ***************************************************************************/

  prefix: '/api/v1',


  /***************************************************************************
  *                                                                          *
  * Optional mount path prefix for all REST blueprint routes on a            *
  * controller, e.g. '/api/v2'. (Does not include `actions` and `shortcuts`  *
  * routes.) This allows you to take advantage of REST blueprint routing,    *
  * even if you need to namespace your RESTful API methods. Will be joined   *
  * to your `prefix` config, e.g. `prefix: '/api'` and `restPrefix: '/rest'` *
  * RESTful actions will be available under `/api/rest`.                     *
  *                                                                          *
  ***************************************************************************/

  // restPrefix: '',


  /***************************************************************************
  *                                                                          *
  * Whether to use plural model names in blueprint routes, e.g. `/users` for *
  * the `User` model. (This only applies to blueprint autoroutes, not manual *
  * routes from `sails.config.routes`)                                       *
  *                                                                          *
  ***************************************************************************/

  pluralize: true,

};
