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

    $scope.vote = function(vote, tutorial){
      var req = {
        method: 'PUT',
        url: '/api/tutorial/addvote/' + tutorial.uuid,
        data: {uuid: 'userID77', vote: vote}
      }

      $http(req)
      .success(function(data){
      })
      .error(function(data){
        console.log(data);
          $scope.errors.push({msg: 'could not change the vote'});
      });
    };
  }]);
};
