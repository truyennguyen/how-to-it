'use strict';

/*
 * Sidebar directive
 */

module.exports = function(app) {
  app.directive('sidebarDirective', function() {
    return {
      restrict: 'AC',
      replace: true,
      templateUrl: '/templates/directives/sidebar.html'
    }
  });
};
