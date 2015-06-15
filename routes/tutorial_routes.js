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
		var tutUuid = req.param('tutUuid');
		var userUuid = req.param('userUuid');
		Tutorial.findOne({'uuid': tutUuid}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'unable to find this Tutorial'});
			}

			for(var i = 0; i < data.votes.length; i++){
				if(data.votes[i] === userUuid)
					return res.status(500).json({msg: 'This user voted, no need to vote more'});
			}

			data.votes.push(userUuid);
			data.save(function(err){
				if(err)
					return res.status(500).json({msg: 'unable to save'});
			});
			res.json({msg: data});
		});
	});

	//remove a vote to a tutorial
	// /api/tutorial/removevote?tutUuid=2222&userUuid=1111
	router.get('/tutorial/removevote', function(req, res){
		var tutUuid = req.param('tutUuid');
		var userUuid = req.param('userUuid');
		Tutorial.findOne({'uuid': tutUuid}, function(err, data){
			if(err){
				console.log(err);
				return res.status(500).json({msg: 'unable to find this Tutorial'});
			}

			for(var i = 0; i < data.votes.length; i++){
				if(data.votes[i] === userUuid){

					data.votes.splice(i, 1);
					data.save(function(err){
						if(err)
							return res.status(500).json({msg: 'unable to save'});
					});
				}
			}
			res.json({msg: 'Vote has been removed'});
		});
	});
};