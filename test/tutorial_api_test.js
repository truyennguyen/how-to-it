'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/tutorials_development_test';
require('../server.js'); //run our server
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var Tutorial = require('../models/Tutorial');

chai.use(chaihttp);

describe('Tutorial REST api tests', function(){
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	before(function(done){
		var testTutorial = new Tutorial();
		testTutorial.generateUuid();
		testTutorial.link = "this is link1";
		testTutorial.caption = "A1";
		testTutorial.upVotes = [];
		testTutorial.downVotes = [];
		testTutorial.tags = ['AngularJS', 'JavaScript'];

		testTutorial.save(function(err, data){
			if(err) throw err;

			this.testTutorial = data;
			done();
		}.bind(this));
	});

	it('should be able to have a tutorial in before block', function(){
		expect(this.testTutorial.link).to.eql('this is link1');
		expect(this.testTutorial.caption).to.eql('A1');
	});

	it('should be able to create 1st tutorial', function(done) {
		chai.request('localhost:3000')
			.post('/api/tutorial')
			.send({link:"this is link2", caption:"A2", tags: ['JavaScript', 'Node.js']})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg.link).to.eql('this is link2');
				expect(res.body.msg.caption).to.eql('A2');
				done();
			});
	});

	it('should be able to add an up vote from userID1 to link1', function(done) {
		var tutUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.put('/api/tutorial/addvote/' + tutUuid)
			.send({uuid: 'userID1', vote: true})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.upVotes).to.have.length(1);
				expect(res.body.upVotes).to.include('userID1');
				expect(res.body.downVotes).to.have.length(0);
				done();
			});
	});

	it('should be able to add a down vote from userID2 to link1', function(done) {
		var tutUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.put('/api/tutorial/addvote/' + tutUuid)
			.send({uuid: 'userID2', vote: false})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.upVotes).to.have.length(1);
				expect(res.body.upVotes).to.not.include('userID2');
				expect(res.body.downVotes).to.have.length(1);
				expect(res.body.downVotes).to.include('userID2');
				done();
			});
	});

	it('should prevent a user from voting multiple times', function(done) {
		var tutUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.put('/api/tutorial/addvote/' + tutUuid)
			.send({uuid: 'userID1', vote: true})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg).to.equal('vote already submitted');
				done();
			})
	});

	it('should be able to get all', function(done) {
		chai.request('localhost:3000')
			.get('/api/tutorial')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.have.length(2);
				expect(Array.isArray(res.body)).to.eql(true);
				done();
			});
	});

	it('should be able to generate a list of unique tags', function(done) {
		chai.request('localhost:3000')
			.get('/api/tutorial/tags')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body).to.have.length(3);
				expect(Array.isArray(res.body)).to.eql(true);
				done();
			});
	});
});
