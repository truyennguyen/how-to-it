'use strict';

module.exports = function(app){
  app.controller('tutorialsController', ['$scope', '$http', function($scope, $http){
    $scope.errors = [];
    $scope.tutorials = [];

    $scope.getAll = function(){
      $http.get('/api/tutorial')
        .success(function(data){
          $scope.tutorials = data;
        })
        .error(function(data){
          console.log(data);
          $scope.errors.push({msg: 'error retrieving tutorials'});
        });
    };
  }]);
};
