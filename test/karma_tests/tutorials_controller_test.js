'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('tutorials controller', function(){
  var $ControllerConstructor;
  var $httpBackend;
  var $scope;

  beforeEach(angular.mock.module('tutorialApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller){
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a new tutorial', function(){
    var tutorialsController = $ControllerConstructor('tutorialsController', {$scope: $scope});
    expect(typeof tutorialsController).toBe('object');
    expect(Array.isArray($scope.tags)).toBe(true);
    expect(typeof $scope.getAll).toBe('function');
  });

  describe('REST functionality', function(){
    beforeEach(angular.mock.inject(function(_$httpBackend_){
      $httpBackend = _$httpBackend_;
      this.tutorialsController = $ControllerConstructor('tutorialsController', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should correctly handle errors', function() {
      $httpBackend.expectGET('/api/tutorial').respond(500, {msg: 'server error'}) ;
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('error retrieving tutorials');
    });

    it('should be able to save a new tutorial', function(){
      var newTutorial= {caption: 'testCaption', link: 'testLink', rank: 0};
      $httpBackend.expectPOST('/api/tutorial').respond(200, {caption: 'testCaption', link: 'testLink'});
      $scope.addNewTutorial(newTutorial);
      expect($scope.tutorials[0].caption).toBe('testCaption');
      expect($scope.tutorials[0].link).toBe('testLink');
      $httpBackend.expectGET('/api/tutorial').respond(200);
      $httpBackend.flush();
    });

    it('should add a new tutorial even on server error', function() {

    });

    it('should be able to get all', function() {
      $httpBackend.expectGET('/api/tutorial').respond(200, [{caption: 'test', link: 'test.com', description: 'testing' }]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.tutorials[0].caption).toBe('test');
      expect($scope.tutorials[0].link).toBe('test.com');
      expect($scope.tutorials[0].description).toBe('testing');
    });
  });
});
