'use strict'

module.exports = function(app){
    app.directive('tutorialsDirective', function(){
        return {
            restrict: 'AC',
            replace: true,
            templateUrl: '/templates/directives/tutorials.html'
        };
    });
};