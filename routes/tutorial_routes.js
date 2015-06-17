'use strict';

var bodyParser = require('body-parser');
var Tutorial = require('../models/Tutorial');
var webShotFunction = require('../lib/web_shot_func.js');
var uuid = require('uuid');

module.exports = function(router){
	router.use(bodyParser.json());

	//Get all tutorials, sort by upVotesSize
	router.get('/tutorial', function(req, res){
		Tutorial.find( { $query: {}, $orderby: { upVotesSize: -1 } }, function(err, data){
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
			res.json(data);
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
		newTutorial.tags = req.body.tags;
		newTutorial.rank = 0;
		newTutorial.save(function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'error to add tutorial'});
			}
			res.json({msg: data});
		});
	});

	router.put('/tutorial/addvote/:id', function(req, res) {

		Tutorial.findOne({'uuid': req.params.id}, function(err, data) {
			if (err) {
				console.log(err);
				return res.status(500).json({msg: 'unable to find tutorial'});
			}
			// If there is an up vote present add one to rank. otherwise subtract one
			req.body.up ? data.rank += 1 : data.rank -= 1;

			data.save(function(err, updated) {
				if (err) {
					console.log(err);
					return res.status(500).json({msg: 'unable to process vote'});
				}
				res.json(updated);
			});
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
