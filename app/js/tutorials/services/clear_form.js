'use strict';

module.exports = function(app) {
  app.factory('clearForm', function() {
    return function(form) {
      var prop = Object.keys(form);
      prop.forEach(function(val, i, arr) {
        form[arr[i]] = '';
      });
    };
  });
};
