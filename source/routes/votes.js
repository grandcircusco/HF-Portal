var express = require('express');
var app = express();
var Sequelize = require("sequelize");

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;


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


// POST / - Creates a new vote
app.post('/', function putVote(req, res) {

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

  if (req.body.type === "company") {
    resolvePromises(company, fellow);
  }
  else if (req.body.type === "fellow") {
    resolvePromises(fellow, company);
  }

  function resolvePromises(voter, votee) {
    voter.then(function(voter){
      votee.then(function(votee){
        voter.getVotees().then( function(data) {
          if(data.length >= 5) {
            res.status(500).send('Something broke!');
          }
          else {
            voter.addVotee(votee);
            res.send("Vote added!");
          }
        })
      })
    });
  }
});

// DELETE / - Deletes a vote
app.delete('/', function(req, res) {

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

  if (req.body.type === "company") {
    resolvePromises(company, fellow);
  }
  else if (req.body.type === "fellow") {
    resolvePromises(fellow, company);
  }

  function resolvePromises(voter, votee) {
    voter.then(function(voter){
      votee.then(function(votee){
        voter.getVotees().then( function(data) {
          voter.removeVotee(votee);
          res.send("Vote deleted!");
        })
      })
    });
  }

});

module.exports = app;



