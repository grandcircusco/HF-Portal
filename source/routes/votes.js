var express = require('express');
var app = express();

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;

/** Votes **/

// POST /api/vote - Creates a new vote
app.post('/api/v1/votes', function putVote(req, res) {

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
        company.addVotee(fellow);
    }
    else if (req.body.type = "fellow") {
        fellow.addVotee(company);
    }

});

module.exports = app;