var express = require('express');
var app = express();

var models = require('../models');
var Users = models.users;
var Fellows = models.fellows; //TODO Delete this line

// POST /users/login - try to login a user
app.post('/login', function loginUser(req, res) {

	Users.findOne({
		where: {
			email: req.body.email
		}
	}).then(function(user) {
		console.log(user);
		res.send(user);
	});

});

app.post('/create', function createUser(req, res) {

	console.log('creating');
	console.log('Email: ',req.body.email);
	Users.findOne({
		where: {
			email: req.body.email
		}
	}).then(function(user) {
		if(user === null) {
			console.log('Creating new user');
			Users.create({
				email: req.body.email,
				password: req.body.password
			}).then(function(err, user) {
				res.send(user);
			});
		}
		res.send(user);
	});

	
});

module.exports = app;