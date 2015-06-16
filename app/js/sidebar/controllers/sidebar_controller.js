'use strict';

/*
 * Controller for user sidebar
 */

module.exports = function(app) {
  app.controller('sidebarController', ['$scope', '$http', function($scope, $http) {
    $scope.errors = [];
    $scope.tags = [];

    $scope.getTags = function() {
      $http.get('/api/tutorial/tags')
        .success(function(data) {
          data.forEach(function(tag) {
            $scope.tags.push(tag);
          });
        })
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'error retrieving tags'});
        });
    };
  }]);
};
