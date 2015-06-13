'use strict';

var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var app = express();

process.env.APP_SECRET = process.env.APP_SECRET || 'howtoit';

var tutorialRoutes = express.Router(); // This name can be subject to change
var userRoutes = express.Router();

mongoose.connect(process.env.MONGOLAB_URI ||
                'mongodb://localhost/tutorials_development');

app.use(passport.initialize());
require('./lib/passport_strat')(passport);

app.use(express.static(__dirname + '/build'));

require('./routes/tutorial_routes')(tutorialRoutes); // Also subject to change
require('./routes/user_routes')(userRoutes);

app.use('/api', tutorialRoutes);
app.use('/api', userRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on port ' + (process.env.PORT || 3000));
});
