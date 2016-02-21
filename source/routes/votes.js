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


                if ( data.length >= 10 ) {

                    if( voter.userType === 'Fellow' )
                    {
                        res.status( 500 ).send( 'You are limited to showing interest in 10 companies. You have reached the limit already.' );
                    }
                    else if( voter.userType === 'Company' )
                    {
                        res.status( 500 ).send( 'You are limited to showing interest in 10 fellows. You have reached the limit already.' );
                    }


                }
                else {

                    // Make sure vote does not already exist
                    data.forEach( function( element, index, array ){

                        if( element.votee_id === votee.id )
                        {
                            if( voter.userType === 'Fellow' )
                            {
                                res.status( 500 ).send( "You have already shown interest in this company " );
                            }
                            else if( voter.userType === 'Company' )
                            {
                                res.status( 500 ).send( "You have already shown interest in this fellow " );
                            }


                        }

                    });

                    voter.addVotesCast( votee.id );
                    res.send( "Vote Added" );

                }

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
app.delete('/:vote_id', function (req, res) {

    // TODO -- this should only run if the signed in user owns the vote

    var vote = Votes.findOne({

        where: {

            id: req.params.vote_id
        }

    }).then( function( vote ){

        // success callback
        vote.destroy();
        res.send("Vote Removed");

    }, function(){

        // error callback
        res.status( 500 ).send( "Error removing vote" );
    });

});


module.exports = app;



