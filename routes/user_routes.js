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

  // toRead is a queue of articles that the user wants to read.
  // if an add property is included on req.body the value of add will be
  // pushed onto the end of the queue. If this route is hit without an
  // add property the first item is returned from the queue.
  router.put('/articles/toread', eatAuth, function toRead(req, res) {
    // find the user by id
    var article;
    User.findById(req.user._id, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error finding user'});
      }
      if (req.body.add) {
        article = req.body.add;
        user.articles.toRead.push(article);
      } else {
        article = user.articles.toRead.$shift();
      }
      user.save(function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'error updating user'});
        }
        return res.json({msg: article});
      });
    });
  });

  // hasRead functions like bookmarks for the user. This route can be called
  // with either add to add an article to the bookmarks or remove to remove
  router.put('/articles/hasread', eatAuth, function hasRead(req, res) {
    User.findById(req.user._id, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error finding user'});
      }

      if (req.body.add) {
        user.articles.hasRead.push(req.body.add);
      } else if (req.body.remove) {
        user.articles.hasRead.pull(req.body.remove);
      }

      user.save(function(err, data) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'error updating user'});
        }
        return res.json({msg: 'hasRead update successful'});
      });
    });
  });

  // isReading contains an article that the user is currently reading.
  // This route currently just overwrites whatever is included in isReading
  // but should eventually include additional functionality
  router.put('/articles/isreading', eatAuth, function isReading(req, res) {
    var article;
    User.findById(req.user._id, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'error finding user'});
      }
      // If we aren't setting isReading, return whatever it contains
      if (!req.body.set) {
         article = user.articles.isReading;
         return res.json({msg: article});
      }
      // otherwise set it and return what was set
      article = req.body.set;
      user.articles.isReading = article;
      user.save(function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).json({msg: 'There was an error saving your article'});
        }
        return res.json({msg: article});
      });
    });
  });
 };
