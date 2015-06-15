'use strict';

/*
 * File: user_routes.js
 * --------------------
 * Basic user routes, get request to /sign_in to log user in. post request
 * to /create_user to create a new user. Both (all) routes should probably
 * redirect to /user which will be an account mainpage.
 */

var secret = process.env.APP_SECRET;

var bodyParser = require('body-parser');
var validator = require('validator');
var User = require('../models/User.js');
var eatAuth = require('../lib/eat_auth.js')(secret);


 module.exports = function userRoutes(router, passport) {
  router.use(bodyParser.json());

  // Will add passport basic strategy as middleware
  router.get('/sign_in', passport.authenticate('basic', {session: false}),
    function signIn(req, res) {
    // Route should create a new token, and redirect user to homepage?
    req.user.generateToken(secret, function generateToken(err, eat) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error generating token'});
      }
      res.json({eat: eat});
    });
  });

  router.post('/create_user', function createUser(req, res) {
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({msg: 'a valid email is required'});
    }
    if (typeof req.body.password != 'string' || req.body.password.length < 6) {
      return res.status(400).json({
        msg: 'password must be at least 6 characters'
      });
    }
    // create the new user record
    var newUser = new User();

    newUser.generateUuid();

    newUser.username = req.body.username;

    newUser.basic.email = req.body.email;

    newUser.generateHash(req.body.password, function generateHash(err, hash) {
      if (err) {
        return res.status(500).json({msg: 'Account could not be created'});
      }
      newUser.basic.password = hash;

      // Save newUser into the database
      newUser.save(function saveUser(err, user) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'Error saving user'});
        }

      user.generateToken(secret, function generateToken(err, eat) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'error generating token'});
        }
      res.json({eat: eat});
    });
      });
    });

  });

  router.put('/update_user', eatAuth, function updateUser(req, res) {
    // Find the user by Id
    User.findById(req.user._id, function findUser(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'Internal service error'});
      }
      if (req.body.toRead) {
        console.log(req.body.toRead);
        user.articles.toRead.push(req.body.toRead);
      }
      user.save(function saveUpdatedUser(err, user) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'Internal service error'});
        }
        res.json(user);
      })
    });
  });

 };
