'use strict';

/*
 * File: auth.js
 * --------------
 * authentication Service for authController
 */

module.exports = function authService(app) {
  app.factory('auth', ['$http', '$cookies', '$base64',
    function($http, $cookies, $base64) {
      return {

        // auth.create sends a post request with current user information to
        // '/api/create_user'
        create: function create(user, callback) {
          $http.post('/api/create_user', user)
            .success(function(data) {
              console.log(data);
              $cookies.put('eat', data.eat);
              callback(null);
            })
            .error(function(data) {
              callback(data);
            });
        }
      };
    }]);
};
