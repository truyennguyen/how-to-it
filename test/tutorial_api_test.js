'use strict';

process.env.MONGO_URI = 'mongodb://localhost/tutorials_development';
require('../server.js'); //run our server
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var Tutorial = require('../models/Tutorial');

chai.use(chaihttp);

describe('Tutorial REST api tests', function(){
	after(function(done) {
		//mongoose.connection.db.dropDatabase(function() {
			done();
		//});
	});

	before(function(done){
		var testTutorial = new Tutorial();
		testTutorial.generateUuid();
		testTutorial.link = "this is link1";
		testTutorial.caption = "A1";
		testTutorial.votes = [];
		testTutorial.tags = [];

		console.log(testTutorial);

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
			.send({link:"this is link2", caption:"A2"})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg.link).to.eql('this is link2');
				expect(res.body.msg.caption).to.eql('A2');
				done();
			});
	});

	it('should be able to add a vote from userID1 to link1', function(done){
		var tutorialUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.get('/api/tutorial/addvote?tutUuid=' + tutorialUuid +'&userUuid=userID1')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg.link).to.eql('this is link1');
				expect(res.body.msg.caption).to.eql('A1');
				expect(res.body.msg.votes[0]).to.eql('userID1');
				done();
			});		
	});

	it('should be able to add a vote from userID2 to link1', function(done){
		var tutorialUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.get('/api/tutorial/addvote?tutUuid=' + tutorialUuid +'&userUuid=userID2')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg.link).to.eql('this is link1');
				expect(res.body.msg.caption).to.eql('A1');
				expect(res.body.msg.votes[0]).to.eql('userID1');
				expect(res.body.msg.votes[1]).to.eql('userID2');
				done();
			});		
	});

	it('should be able to add a vote from userID3 to link1', function(done){
		var tutorialUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.get('/api/tutorial/addvote?tutUuid=' + tutorialUuid +'&userUuid=userID3')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg.link).to.eql('this is link1');
				expect(res.body.msg.caption).to.eql('A1');
				expect(res.body.msg.votes[0]).to.eql('userID1');
				expect(res.body.msg.votes[1]).to.eql('userID2');
				expect(res.body.msg.votes[2]).to.eql('userID3');
				done();
			});
	});

	it('should be able to remove vote userID2 from link1', function(done){
		var tutorialUuid = this.testTutorial.uuid;
		chai.request('localhost:3000')
			.get('/api/tutorial/removevote?tutUuid=' + tutorialUuid +'&userUuid=userID2')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.msg.link).to.eql('this is link1');
				expect(res.body.msg.caption).to.eql('A1');
				expect(res.body.msg.votes[0]).to.eql('userID1');
				expect(res.body.msg.votes[1]).not.to.eql('userID2');
				expect(res.body.msg.votes[1]).to.eql('userID3');
				done();
			});
	});		

});