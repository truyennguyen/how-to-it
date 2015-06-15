/*
 * File: web_shot_func.js
 * -----------------------
 * This file exports a function that takes a website address and uses
 * the webshot module to take a screenshot which gets stored in our
 * img folder as the address name plus '.jpeg'
 */

var webshot = require('webshot');

var options = {
  shotSize: {
    width: 'all',
    height: 432
  },
};

module.exports = function webShotFunction(address, imgAddress) {
  webshot(address, imgAddress, options, function(err) {
    if (err) {
      console.log(err);
    }
  });
};
