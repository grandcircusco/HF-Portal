var express = require('express');
var app = express();
var bcrypt = require('bcrypt');

var models = require('../models');
var Users = models.users;

app.get( '/:user_id/votes', function( req, res ){

	Users.scope('public').findOne({

		where: {

			id: req.params.user_id
		},
		include: [
			{ model: Users, as: 'VotesFor' },
			{ model: Users, as: 'VotesCast' }
		]

	}).then(function(user) {

		// @TODO - build full user info object here?

		var results = {

			votesFor: user.VotesFor,
			votesCast: user.VotesCast
		};

		res.send(results);
	});

});


// POST /users/login - try to login a user
app.post('/login', function loginUser(req, res) {

	// ilike does case in-sensitive compare of email
	Users.findOne({

		where: {
			email: {

				ilike: req.body.email
			}
		}
	}).then(function(user) {

		if( user !== null ) {

			bcrypt.compare(req.body.password, user.password, function (err, result) {

				if (result === true) {

					//console.log('password is correct!');
					res.send(user);

				} else {

					//console.log('Wrong password!');
					res.sendStatus(401);
				}
			});

		}
		else{

			//console.log("No user found");
			res.send(0);
		}
	});

});

app.post('/create', function createUser(req, res) {

	//console.log('creating');
	//console.log(req.body);
	Users.scope('public').findOne({
		where: {
			email: req.body.email
		}
	}).then(function(user) {

		if( user === null ) {

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
					Users.create({
						email: req.body.email,
						password: hash,
						userType: req.body.userType
					}).then(function(user) {

						console.log(user);
						res.send(user);
					});
				});
			});

		}else{

			res.send("User already exists");
		}
	});

});

// PUT /users/:id - updates an existing fellow record
app.put('/:id', function putUser(req, res) {

	console.log(req.body);

	Users.findOne({

		where: {
			id: req.params.id
		}

	}).then(function(user) {

		user.email = req.body.email;
		user.save();

		if( req.body.password.length > 0 ){

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {

					user.password = hash;
					user.save();
				});
			});
		}
		else{

			res.send(user);
		}

	});

});

module.exports = app;
