var express = require('express');
var app = express();

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;

/** Votes **/


// GET /api/v1/votes/fellow/:id
app.get('')

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
      company.then(function(company){
        fellow.then(function(fellow){
          //var votes = company.getVotees();
          console.log("FELLOW\n");
          console.log(votes);


          console.log(fellow);
          console.log("COMPANY\n");
          console.log(company);
          company.addVotee(fellow);
        })
      })
    }
    else if (req.body.type = "fellow") {
      company.then(function(company){
        fellow.then(function(fellow){
          console.log(fellow);
          fellow.addVotee(company);
        })
      })
    }

    res.send('Vote added');
});

module.exports = app;



