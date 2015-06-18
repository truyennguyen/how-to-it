'use strict';

var _ = require('lodash/collection');

module.exports = function(app){
  app.controller('tutorialsController', ['$scope', '$http', '$cookies', 'clearForm', function($scope, $http, $cookies, clearForm){
    $scope.errors = [];
    $scope.tutorials = [];
    // these should be rendered in a better way
    $scope.tags = [
      'JavaScript',
      'Node.js',
      'Express',
      'Grunt',
      'Angular.js',
      'React',
      'Flux',
      'lodash',
      'io.js',
      'Mocha',
      'Chai',
      'Mongoose',
      'MongoDB',
      'Sequalize',
      'PostgreSQL',
      'Webpack',
      'Browserify',
      'Bower',
      'Gulp',
      'Jasmine',
      'Karma'
    ];
    $scope.tag = {
      tags: []
    };
    $scope.create = false;

    // is this actually going into the header?
    var eat = $cookies.get('eat');
    $http.defaults.headers.common.eat = eat;

    $scope.creationMode = function() {
      return $scope.create;
    };

    $scope.toggleCreate = function() {
      $scope.create ? $scope.create = false : $scope.create = true; // jshint ignore:line
    };

    $scope.getAll = function(filter){
      $http.get('/api/tutorial')
        .success(function(data){
          if (filter) {
            $scope.tutorials = _.filter(data, function(obj) {
              return _.includes(obj.tags, filter);
            });
          } else {
            $scope.tutorials = data;
          }
        })
        .error(function(data){
          console.log(data);
          $scope.errors.push({msg: 'error retrieving tutorials'});
        });
    };

    $scope.addNewTutorial = function(tut){
      var newTut = angular.copy(tut);
      clearForm(tut);
      $scope.tutorials.push(newTut);

      $http.post('/api/tutorial', newTut)
        .success(function(data){
          $scope.getAll();
          $scope.toggleCreate();
        })
        .error(function(err){
          console.log(err);
          $scope.errors.push({msg: 'could not create new tutorial'});
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
