'use strict';

var bodyParser = require('body-parser');
var Tutorial = require('../models/Tutorial');

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
		var newTutorial = new Tutorial();
		newTutorial.generateUuid();
		newTutorial.link = req.body.link;
		newTutorial.caption = req.body.caption;
		newTutorial.votes = [];
		newTutorial.tags = [];
		newTutorial.save(function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'error to add tutorial'});
			}
			res.json({msg: data});
		});
	});

	//add a vote to a tutorial
	// /api/tutorial/addvote?tutUuid=2222&userUuid=1111
	router.get('/tutorial/addvote', function(req, res){
		var tutUuid = req.query.tutUuid;
		var userUuid = req.query.userUuid;
		Tutorial.findOne({'uuid': tutUuid}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'unable to find this tutorial'});
			}

			var index = data.votes.indexOf(userUuid);
			if (index === -1) {
				data.votes.push(userUuid);
				data.save(function(err){
					if(err)
						return res.status(500).json({msg: 'unable to save'});
				});
				res.json({msg: data});
			}
		});
	});

	//remove a vote to a tutorial
	// /api/tutorial/removevote?tutUuid=2222&userUuid=1111
	router.get('/tutorial/removevote', function(req, res){
		var tutUuid = req.query.tutUuid;
		var userUuid = req.query.userUuid;
		Tutorial.findOne({'uuid': tutUuid}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'unable to find this Tutorial'});
			}

			var index = data.votes.indexOf(userUuid);
			if (index !== -1) {
				data.votes.splice(index, 1);
				data.save(function(err) {
					if (err) {
						return res.status(500).json({msg: 'unable to save'});
					}
					res.status(200).json({msg: data});
				});
			}
		});
	});
};
