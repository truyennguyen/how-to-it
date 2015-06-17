'use strict';

// Removed 'replace: true' so that html would generate properly
module.exports = function(app) {
  app.directive('navbarDirective', function() {
    return {
      restrict: 'AC',
      templateUrl: '/templates/directives/navbar.html',
      controller: ['$scope', '$location', 'auth', function($scope, $location, auth) {
        $scope.signedIn = function() {
          return auth.isSignedIn();
        };

        $scope.signOut = function() {
          auth.logout();
          $location.path('/#');
        };
      }]
    };
  });
};
