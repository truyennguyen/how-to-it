'use strict';

/*
 * User model
 * Contains methods to generate uuid, hash, token
 * and check password
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');
var uuid = require('uuid');

var userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String}
  },
  uuid: String,
  articles: {
    toRead: String,
    isReading: String,
    hasRead: String
  },
  categories: [String]
});


userSchema.methods.generateUuid = function() {
  this.uuid = uuid.v4();
};

userSchema.methods.generateHash = function(password, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    bcrypt.hash(password, salt, null, function(err, hash) {
      if (err) {
        callback(err);
      }
      callback(null, hash);
    });
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  bcrypt.compare(password, this.basic.password, function(err, res) {
    if (err) {
      callback(err);
    }
    callback(null, res);
  });
};

// generate token using _id but could use uuid
userSchema.methods.generateToken = function(secret, callback) {
  eat.encode({id: this._id}, secret, callback);
};

module.exports = mongoose.model('User', userSchema);
