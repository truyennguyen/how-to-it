'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

// module name is subject to change
var tutorialApp = angular.module('tutorialApp', ['ngRoute', 'ngCookies', 'base64']);

// controllers
require('./sidebar/controllers/sidebar_controller')(tutorialApp);

// services

// directives
require('./sidebar/directives/sidebar_directive')(tutorialApp);

tutorialApp.config(['$routeProvider', function($routeProvider) {
  // angular routes go here
}]);
