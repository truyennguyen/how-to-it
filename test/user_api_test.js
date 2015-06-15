'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/tutorials_development_test';
require('../server.js'); //run our server
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var User = require('../models/User.js');

chai.use(chaihttp);

var domain = 'localhost:3000';

var testUser = {
  username: 'testy',
  email: 'testy@example.com',
  password: 'waffles'
};

describe('User routes', function() {

  it('should be able to create a new user', function(done) {
    chai.request(domain)
      .post('/api/create_user')
      .send(testUser)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body.eat).to.eql('string');
        testUser.eat = res.body.eat;
        done();
      });
  });

  it('should be able to log a user in', function(done) {
    chai.request(domain)
      .get('/api/sign_in')
      .auth(testUser.email, testUser.password)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body.eat).to.eql('string');
        done();
      });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase();
    done();
  })
});
