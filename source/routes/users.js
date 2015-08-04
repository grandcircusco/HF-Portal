var express = require('express');
var app = express();
var bcrypt = require('bcrypt');

var models = require('../models');
var Users = models.users;

// POST /users/login - try to login a user
app.post('/login', function loginUser(req, res) {

	Users.findOne({
		where: {
			email: req.body.email
		}
	}).then(function(user) {
		bcrypt.compare(req.body.password, user.password, function(err, res) {
			if(res === true) {
				console.log('password is correct!');
			} else {
				console.log('Wrong password!');
			}
		});
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
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
					Users.create({
						email: req.body.email,
						password: hash
					}).then(function(err, user) {
						res.send(user);
					});
				});
			});
			
		}
		res.send(user);
	});

	
});

module.exports = app;