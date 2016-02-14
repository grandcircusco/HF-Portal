var express = require('express');
var app = express();
var Sequelize = require("sequelize");

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;
var Users = models.users;
var Votes = models.votes;

// GET /votes/ - Company votes for a fellow
app.get('/:voter_id', function getVote(req, res) {


    var votes = Votes.findAll({

        where: {

            voter_id: req.params.voter_id
        },
        include: [{

            model: Users,
            as: 'Votee',
            include: [{

                model: Fellows
            },
            {

                model: Companies
            }]
        }]

    }).then( function( votes ) {

        res.send( votes );
    });


});


function resolvePromisesAndPost( voter, votee, res ) {

    voter.then( function ( voter ) {

        votee.then( function ( votee ) {

            voter.getVotesCast().then( function ( data ) {

                if ( data.length >= 5 ) {

                    res.status( 500 ).send( 'Voting limit reached' );

                }
                else {

                    // Make sure vote does not already exist
                    data.forEach( function( element, index, array ){

                        if( element.votee_id === votee.id )
                        {
                            res.send( "Vote already exists" );
                        }

                    });

                    voter.addVotesCast( votee.id );
                    res.send( "Vote Added" );

                }

            });

        });

    });
}

function resolvePromisesAndDelete(voter, votee, res) {

    voter.then(function (voter) {

        votee.then(function (votee) {

            voter.getVotees().then(function (data) {

                voter.removeVotee(votee);
                res.send("Vote deleted!");

            });

        });

    });
}


// POST /votes/ - Company votes for a fellow
app.post('/', function postVote(req, res) {

    // TODO - This should enforce that the users are of different types
    // - ex: Fellows only vote for companies, not other fellows.
    // - This is enforced on the front end

    var voter = Users.unscoped().findOne({

        where: {
            id: req.body.voter_id
        }

    });

    var votee = Users.unscoped().findOne({

        where: {
            id: req.body.votee_id
        }

    });

    resolvePromisesAndPost(voter, votee, res);

});


// DELETE /votes/ - Deletes a fellow's vote
app.delete('/', function (req, res) {

    var company = Companies.findOne({
        where: {
            id: req.body.votee_id
        }
    });

    var fellow = Fellows.findOne({
        where: {
            id: req.body.voter_id
        }
    });

    resolvePromisesAndDelete(fellow, company, res);

});


module.exports = app;



