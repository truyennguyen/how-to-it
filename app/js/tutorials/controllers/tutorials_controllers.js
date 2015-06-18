'use strict';

var _ = require('lodash/collection');

module.exports = function(app){
  app.controller('tutorialsController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){
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

    // is this actually going into the header?
    var eat = $cookies.get('eat');
    $http.defaults.headers.common.eat = eat;

    $scope.getAll = function(filter){
      $http.get('/api/tutorial')
        .success(function(data){
          if (filter) {
            $scope.tutorials = _.filter(data, function(obj) {
              return _.includes(obj.tags, filter);
            });
          } else {
            $scope.tutorials = data;
            console.log(data);
          }
          console.log($scope.tutorials);
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
