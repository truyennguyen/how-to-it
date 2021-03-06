'use strict';

/*
 * Tutorial model
 * Contains method to generate uuid
 */

var mongoose = require('mongoose');
var uuid = require('uuid');

var tutorialSchema = mongoose.Schema({
  uuid: String,
  link: String,
  img: String,
  description: String,
  voted: [String],
  rank: Number,
  tags: [String],
  caption: String
});

tutorialSchema.methods.generateUuid = function() {
  this.uuid = uuid.v4();
};

module.exports = mongoose.model('Tutorial', tutorialSchema);
