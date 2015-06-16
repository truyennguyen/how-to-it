'use script';

/*
 * File: auth_controller.js
 * ------------------------
 * Controller for site authentication
 */

 module.exports = function authController(app) {
  app.controller('authController', ['$scope', '$location', 'auth',
    function($scope, $location, auth) {
      $scope.errors = [];

      // Create a new user
      $scope.authCreate = function(user) {
        if (user.password === user.confirmation) {
          auth.create(user, function(err) {
            if (err) {
              console.log(err);
              return $scope.errors.push(err);
            }
            console.log('Account created successfully');
            // Will redirect to main page.

          });
        }
      };

      // Sign in an existing user
      $scope.authSignIn = function(user) {
        auth.signIn(user, function(err) {
          if (err) {
            console.log(err);
            return $scope.errors.push(err);
          }
          console.log('Sign in successful');
          // Will redirect to main page.
        });
      }
    }]);
 };
