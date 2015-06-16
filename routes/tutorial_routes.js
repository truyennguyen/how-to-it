'use strict';

var bodyParser = require('body-parser');
var Tutorial = require('../models/Tutorial');
var webShotFunction = require('../lib/web_shot_func.js');
var uuid = require('uuid');

module.exports = function(router){
	router.use(bodyParser.json());

	//get all tutorials
	router.get('/tutorial', function(req, res){
		Tutorial.find({}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'error to get tutorials'});
			}
			res.json(data);
		});
	});

	//Search a tutorial by caption
	router.get('/tutorial/search', function(req, res){
		Tutorial.findOne({'caption': req.query.captionSearch}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'unable to find this Tutorial'});
			}
			res.json({msg: data});
		});
	});

	//add a new tutorials
	router.post('/tutorial', function(req ,res){
		// generate filename for tutorial screenshot
		var imgAddress = './img/' + uuid.v4() + '.jpeg';
		webShotFunction(req.body.link, imgAddress);
		var newTutorial = new Tutorial();
		newTutorial.generateUuid();
		newTutorial.link = req.body.link;
		newTutorial.img = imgAddress;
		newTutorial.caption = req.body.caption;
		newTutorial.upVotes = [];
		newTutorial.downvotes = [];
		newTutorial.tags = req.body.tags;
		newTutorial.save(function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'error to add tutorial'});
			}
			res.json({msg: data});
		});
	});

	// add a vote to a tutorial
	router.put('/tutorial/addvote/:id', function(req, res) {
		var tutUuid = req.params.id;
		var vote = req.body.vote;
		var userUuid = req.body.uuid; // This may need to be adjusted for auth

		Tutorial.findOne({'uuid': tutUuid}, function(err, data) {
			if (err) {
				console.log(err);
				return res.status(500).json({msg: 'unable to find tutorial'});
			}
			// Disable on front end to avoid this check
			var up = data.upVotes.indexOf(userUuid);
			var down = data.downVotes.indexOf(userUuid);

			if (up === -1 && down === -1) {
				// Need to pass true/false variable with req to determine up/down
				// 'vote' is our current placeholder
				vote ? data.upVotes.push(userUuid) : data.downVotes.push(userUuid);

				data.save(function(err) {
					if (err) {
						return res.status(500).json({msg: 'unable to save'});
					}
					return res.status(200).json(data);
				});
			} else {
				res.status(403).json({msg: 'vote already submitted'});
			}
		});
	});

	// generate a list of available tags
	// TODO: test
	router.get('/tutorial/tags', function(req, res) {
		Tutorial.find().distinct('tags', function(err, data) {
			if (err) {
				console.log(err);
				return res.status(500).json({msg: 'unable to populate tags'});
			}
			res.status(200).json(data);
		});
	});
};
