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

    $scope.voteUp = function(tutorial) {
      var id = tutorial.uuid;
      var obj = {
        up: true
      };
      vote(id, obj);
    };

    $scope.voteDn = function(tutorial) {
      var id = tutorial.uuid;
      var obj = {
        down: true
      };
      vote(id, obj);
    };

    function vote(id, obj) {
      $http.put('/api/tutorial/addvote/' + id, obj)
        .success(function(data) {
          $scope.getAll();
        })
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'could not update vote'});
        });
    }


  }]);
};
