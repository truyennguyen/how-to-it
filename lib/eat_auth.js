/*
 * File: eat_auth.js
 * -----------------
 * Eat authorization middleware function. Tokens contain timestamp and can
 * be set to expire, currently, tokens only invalidate on server restart
 */

var eat = require('eat');
var User = require('../models/User.js');

module.exports = function eatAuthFactory(secret) {
  return function eatAuth(req, res, next) {
    var token = req.headers.eat || req.body.eat;

    // If no token present redirect user to the sign_in page
    if (!token) {
      return res.redirect('/sign_in');
    }

    eat.decode(token, secret, function decode(err, decoded) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error decoding token'});
      }

      // token decoded find the user information
      User.findOne({uuid: decoded.id}, function findUser(err, user) {

        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal service error'});
        }

        if (!user) {
          console.log('no user found for that token');
          return res.status(500).json({msg: 'not authorized'});
        }

        req.user = user;
        next();
      });
    });

  };

};
