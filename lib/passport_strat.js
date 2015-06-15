/*
 * File: passport_strat.js
 * -----------------------
 * Basic strategy for passport middleware, function will call the done callback
 * in the typical nodejs callback style. first argument represents an error.
 * second argument will contain false if authentication failed or the
 * authenticated user if auth succeeds.
 */

var Basic = require('passport-http').BasicStrategy;
var User = require('../models/User.js');

module.exports = function passportBasic(passport) {
  passport.use('basic', new Basic({}, function verify(email, pswd, done) {
    User.findOne({'basic.email': email}, function findUser(err, user) {
      if (err) {
        return done('There was an error processing your request');
      }
      // If there is no user return done(null, false) to indicate failure
      if (!user) {
        return done(null, false);
      }

      user.checkPassword(pswd, function validatePassword(err, data) {
        if (err) {
          return done('There was an error verifying your password');
        }

        // If not valid return done(null, false) to indicate failure
        if (!data) {
          return done(null, false);
        }

        // return the authenticate user
        return done(null, user);

      });

    });

  }));

};
