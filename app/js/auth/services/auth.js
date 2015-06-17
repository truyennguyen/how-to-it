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

        // auth.signIn log in an existing user. store the access token in a
        // cookie
        signIn: function signIn(user, callback) {
          var encoded = $base64.encode(user.email + ':' + user.password);
          $http.get('/api/sign_in', {
              headers: {'Authorization': 'Basic ' + encoded}
            })
            .success(function(data) {
              $cookies.put('eat', data.token); // data.token?
              callback(null);
            })
            .error(function(data) {
              callback(data);
            });
        },

        // auth.create sends a post request with current user information to
        // '/api/create_user'
        create: function create(user, callback) {
          $http.post('/api/create_user', user)
            .success(function(data) {
              $cookies.put('eat', data.token); // data.token?
              callback(null);
            })
            .error(function(data) {
              callback(data);
            });
        },

        //auth.logout sets the eat to an empty string
        logout: function logout() {
          $cookies.put('eat', '');
        },

        // auth.isSignedIn checks if eat exists and if it has any length
        // returns the result
        isSignedIn: function isSignedIn() {
          return !!($cookies.get('eat') && $cookies.get('eat').length);
        }
      };
    }]);
};
