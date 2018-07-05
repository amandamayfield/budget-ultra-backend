/**
 * flash hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineFlashHook(sails) {

  function flash (key, value) {
    if (value === undefined) {
      return sails.session.flash[key];
    }

    if (sails.session.nextFlash[key] === undefined) {
      sails.session.nextFlash[key] = [];
    }

    sails.session.nextFlash[key].push(value);
  }

  return {

    defaults: {
      __configKey_: {},
    },

    routes: {
      before: {
        '*': function (request, response, next) {
          request.flash = flash;
          sails.session.flash = sails.session.nextFlash;
          sails.session.nextFlash = {};

          return next();
        }
      }
    },

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {

      sails.log.info('Initializing custom hook (`flash`)');

      if (!sails.session) {
        sails.log.info('No session storage. Skipping hook');

        return done();
      }

      sails.session.flash = {};
      sails.session.nextFlash = {};

      // Be sure and call `done()` when finished!
      // (Pass in Error as the first argument if something goes wrong to cause Sails
      //  to stop loading other hooks and give up.)
      return done();

    },

  };

};
