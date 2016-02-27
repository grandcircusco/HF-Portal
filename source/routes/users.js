var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;

var models = require('../models');
var Users = models.users;
var Middleware = require('./middleware');

/** User Auth - Passport **/

passport.use(new PassportLocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {

		Users.findOne({

			where: {
				email: {

					ilike: email
				}
			}

		}).then(function (user) {

			if (user === null) {

				return done(null, false, { message: 'Incorrect credentials.' });
			}

			if ( bcrypt.compareSync( password, user.password) ) {

				return done(null, user);
			}

			return done(null, false, { message: 'Incorrect credentials.' });
		});
	}
));

passport.serializeUser(function( user, done ) {

	done(null, {

		id: user.id,
		email: user.email,
		userType: user.userType
	});
});

passport.deserializeUser(function( user, done ) {

	models.users.findOne({

		where: {
			'id': user.id
		}

	}).then(function (user) {

		if (user === null) {

			done(new Error('Wrong user id.'));
		}

		done(null, user);
	});
});


/** User Routes **/

app.get( '/:user_id/votes', Middleware.isLoggedIn, function( req, res ){

	Users.scope('public').findOne({

		where: {

			id: req.params.user_id
		},
		include: [
			{ model: Users, as: 'VotesFor' },
			{ model: Users, as: 'VotesCast' }
		]

	}).then(function(user) {

		var results = {

			votesFor: user.VotesFor,
			votesCast: user.VotesCast
		};

		res.send(results);
	});

});

// POST /users/login - try to login a user
app.post('/login',

	passport.authenticate('local', {
		successRedirect: '/api/v1/users/login/success',
		failureRedirect: '/api/v1/users/login/failure'
	})

);

// Check to see if a user is currently logged in, if so return their info
app.get('/confirm-login', function (req, res) {

	var user = req.user;

	if( user !== undefined ) {
		user.password = '';
	}

	res.send( user );
});

// success login redirect - return session user info
app.get( '/login/success', function( req, res ){

	res.json({

		success: true,
		user: req.session.passport.user
	});
});

// login failure - return error message
app.get( '/login/failure', function( req, res ){

	res.json({
		success: false,
		message: 'Invalid username or password.'
	});
});

// Log user out
app.get( '/logout', function( req, res ){

	req.logout();
	res.end();
});


// Create a new user
app.post('/create', Middleware.isAdmin, function createUser(req, res) {

	// check if a user with the same email doesn't already exist
	Users.findOne({

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

// PUT /users/:id - updates an existing user record
app.put('/:id', Middleware.isOwnerOrAdmin, function putUser(req, res) {

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

// DELETE /users/ - Deletes a user
app.delete('/:user_id', Middleware.isAdmin, function (req, res) {

	Users.findOne({

		where: {
			id: req.params.user_id
		}

	}).then(function(user) {

		if( user !== null ){

			user.destroy();

			res.send( '1' );
		}
		else{

			res.status(400).send({ error: 'User not found' });
		}

	});
});


module.exports = app;
