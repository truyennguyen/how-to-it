'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');
require('angular-bootstrap');

// module name is subject to change
var tutorialApp = angular.module('tutorialApp', ['ngRoute', 'ngCookies', 'base64', 'ui.bootstrap']);

// services
require('./auth/services/auth')(tutorialApp);

// controllers
require('./tutorials/controllers/tutorials_controllers')(tutorialApp);
require('./sidebar/controllers/sidebar_controller')(tutorialApp);
require('./auth/controllers/auth_controller')(tutorialApp);

// directives
require('./sidebar/directives/sidebar_directive')(tutorialApp);
require('./tutorials/directives/tutorials_directive')(tutorialApp);

tutorialApp.config(['$routeProvider', function($routeProvider) {
  // angular routes go here
  $routeProvider
    .when('/sign_in', {
      templateUrl: 'templates/views/sign_in.html',
      controller: 'authController'
    })
    .when('/create_user', {
      templateUrl: 'templates/views/create_user.html',
      controller: 'authController'
    });
}]);
