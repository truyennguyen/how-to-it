'use strict';

var mongoose = require('mongoose');

var tutorialSchema = mongoose.Schema({
  uuid: String,
  link: String,
  votes: [String],
  tags: [String],
  caption: String
});

tutorialSchema.methods.generateUuid = function() {
  this.uuid = uuid.v4();
}

module.exports = mongoose.model('Tutorial', tutorialSchema);
