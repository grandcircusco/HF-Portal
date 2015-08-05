var express = require('express');
var app = express();
var Sequelize = require("sequelize");

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;

/** Votes **/


// GET /api/v1/votes/fellow/:id
app.get('/', function getAll(req, res) {


});

// GET /api/v1/votes/fellow/:id
app.get('/fellow/:id', function getFellowVotes(req, res) {
  var fellow = Fellows.findOne({
    where: {
      id: req.params.id
    }
  });

  fellow.then(function(fellow) {
    return fellow.getVotees();
  })
  .then(function(companies){
    console.log("hello\n\n\n"+companies);
    res.send(companies);
  });

});

// POST /api/v1/votes/ - Creates a new vote
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

  if (req.body.type = "company") {
    resolvePromises(company, fellow);
  }
  else if (req.body.type = "fellow") {
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
            voter.addVotee(votee);  //fellow.addVotee(company)  -> INSERT INTO company_votes
            res.send('Vote added');
          }
        })
      })
    });
  }
});

module.exports = app;



