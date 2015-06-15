'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

// module name is subject to change
var tutorialApp = angular.module('tutorialApp', ['ngRoute', 'ngCookies', 'base64']);

// controllers
require('./userbar/controllers/userbar_controller')(tutorialApp);

// services

// directives

tutorialApp.config(['$routeProvider', function($routeProvider) {
  // routes go here
}]);
