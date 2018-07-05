/**
 * passport/callbackFailed.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.passport/callbackFailed();
 *     // -or-
 *     return res.passport/callbackFailed(responseData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'passport/callbackFailed'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: responseData }
 * ```
 */

module.exports = function passportCallbackFailed(responseData) {

  // Get access to `req` and `res`
  const req = this.req;
  const res = this.res;

  sails.log(responseData);

  if (!req.wantsJSON) {
    const action = req.param('action');
    // Only certain error messages are returned via req.flash('error', someError)
    // because we shouldn't expose internal authorization errors to the user.
    // We do return a generic error and the original request body.
    req.flash('form', req.body);
    if (responseData.errorCode !== undefined) {
      req.flash('error', responseData);
    }

    // If an error was thrown, redirect the user to the
    // login, register or disconnect action initiator view.
    // These views should take care of rendering the error messages.
    switch (action) {
      case 'register':
        return res.redirect('/register');
      case 'disconnect':
        return res.redirect('back');
      default:
        return res.redirect('/login');
    }
  }

  // Define the status code to send in the response.
  const statusCodeToSet = responseData.statusCode || 401;

  res.status(statusCodeToSet);

  // If no data was provided, use res.sendStatus().
  if (responseData === undefined) {
    sails.log.info('Ran custom response: res.passport/callbackFailed()');
  } else if (_.isError(responseData)) {
    // Else if the provided data is an Error instance, if it has
    // a toJSON() function, then always run it and use it as the
    // response body to send.  Otherwise, send down its `.stack`,
    // except in production use res.sendStatus().
    sails.log.info('Custom response `res.passport/callbackFailed()` called with an Error:', responseData);

    // If the error doesn't have a custom .toJSON(), use its `stack` instead--
    // otherwise res.json() would turn it into an empty dictionary.
    // (If this is production, don't send a response body at all.)
    if (!_.isFunction(responseData.toJSON) && process.env.NODE_ENV !== 'production') {
      return res.send(responseData.stack);
    } else {
      return res.json(responseData);
    }
  } else {
    // Set status code and send response data.
    return res.send(responseData);
  }
};
