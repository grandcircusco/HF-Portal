var express = require('express');
var app = express();
var bcrypt = require('bcrypt');

var models = require('../models');
var Users = models.users;

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

					// remove password from returned user object
					// -- we can accomplish this using scopes,
					//    but need to get the password to compare
					user.password = '';
					
					//console.log('password is correct!');
					res.send(user);

				} else {

					res.status(400).send({ error: 'Incorrect Password' });
				}
			});

		}
		else{

			res.status(400).send({ error: 'No User Found' });
		}
	});

});

app.post('/create', function createUser(req, res) {

	// check if a user with the same email doesn't already exist
	Users.scope('public').findOne({

		where: {
			email: {

				ilike: req.body.email
			}
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

						res.send(user);

					});
				});
			});

		}else{

			res.status(400).send({ error: 'Email already exists' });
		}
	});

});

// PUT /users/:id - updates an existing fellow record
app.put('/:id', function putUser(req, res) {

	Users.findOne({

		where: {
			id: req.params.id
		}

	}).then(function(user) {

		user.email = req.body.email;
		user.save();

		if( req.body.password !== undefined && req.body.password.length > 0 ){

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
