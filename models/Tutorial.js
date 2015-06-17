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
  upVotes: {type: [String], default: []},
  upVotesSize: {type: Number, default: 0},
  downVotes: {type: [String], default: []},
  downVotesSize: {type: Number, default: 0},
  tags: [String],
  caption: String
});

tutorialSchema.methods.generateUuid = function() {
  this.uuid = uuid.v4();
};

module.exports = mongoose.model('Tutorial', tutorialSchema);
