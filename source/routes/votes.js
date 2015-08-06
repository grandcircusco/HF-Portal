var express = require('express');
var app = express();
var Sequelize = require("sequelize");

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;


function resolvePromisesAndPost(voter, votee) {
  voter.then(function(voter){
    votee.then(function(votee){
      voter.getVotees().then( function(data) {
        if(data.length >= 5) {
          res.status(500).send('Something broke!');
        }
        else {
          voter.addVotee(votee);
          res.send("Vote Added");
        }
      });
    });
  });
}

function resolvePromisesAndDelete(voter, votee) {
  voter.then(function(voter){
    votee.then(function(votee){
      voter.getVotees().then( function(data) {
        voter.removeVotee(votee);
        res.send("Vote deleted!");
      });
    });
  });
}


// GET /fellow/:id - Gets all companies voted on by one fellow
app.get('/fellow/:id', function getFellowVotes(req, res) {
  var fellow = Fellows.findOne({
    where: {
      id: req.params.id
    }
  });

  fellow.then(function(fellow) {
    return fellow.getVotees();
  })
  .then( function(companies) {
    res.send(companies);
  });

});



// POST /fellow/ - Fellow votes for a company
app.post('/fellow/', function postFellowVote(req, res) {

  var company = Companies.findOne({
    where: {
      id: req.body.company_id
    }

  });

  var fellow = Fellows.findOne({
    where: {
      id: req.body.fellow_id
    }

  });

  resolvePromisesAndPost(fellow, company);

});


// POST /company/ - Company votes for a fellow
app.post('/company/', function postCompanyVote(req, res) {

  var company = Companies.findOne({
    where: {
      id: req.body.company_id
    }

  });

  var fellow = Fellows.findOne({
    where: {
      id: req.body.fellow_id
    }

  });

  resolvePromisesAndPost(company, fellow);

});


// GET /company/:id - Gets all fellows voted on by one company
app.get('/company/:id', function getCompanyVotes(req, res) {
  var company = Companies.findOne({
    where: {
      id: req.params.id
    }
  });

  company.then( function(company) {
    return company.getVotees();
  })
  .then( function(fellows) {
    res.send(fellows);
  });

});



// DELETE / - Deletes a fellow's vote
app.delete('/fellow/', function(req, res) {

  var company = Companies.findOne({
    where: {
      id: req.body.company_id
    }
  });

  var fellow = Fellows.findOne({
    where: {
      id: req.body.fellow_id
    }
  });

  resolvePromisesAndDelete(fellow, company);

});

// DELETE / - Deletes a company's vote
app.delete('/company/', function(req, res) {

  var company = Companies.findOne({
    where: {
      id: req.body.company_id
    }

  });

  var fellow = Fellows.findOne({
    where: {
      id: req.body.fellow_id
    }

  });

  resolvePromisesAndDelete(company, fellow);

});


module.exports = app;



