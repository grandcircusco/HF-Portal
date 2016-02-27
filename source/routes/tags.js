var express = require('express');
var app = express();

var Middleware = require('./middleware');

var models = require('../models');
var Tags = models.tags;

/** Tags **/

// GET /api/tags - get all tags
app.get('/', function getTags(req, res) {


    Tags.all({

        order: '"name" ASC'

    }).then(function(tags) {

        res.send(tags);
    });

});

// POST /api/tags - create a tag
app.post('/', Middleware.isLoggedIn, function createTag( req, res ){

    // find tags by case insensitive compare
    Tags.findOne({

        where: {
            name: {

                ilike: req.body.name
            }
        }

    }).then( function( tag ){

        if( tag === null ){

            // no tag found, so create
            Tags.create({

                'name': req.body.name

            }).then( function( tag ){

                res.send( tag );
            });
        }
        else{

            // tag already exists
            res.status(400).send({ error: 'Tag already exists' });
        }

    });

});

// PUT /api/tags/:id - update a tag
app.put('/:id', Middleware.isAdmin, function putTag(req, res) {

    Tags.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(tag) {

        if( tag !== null ){

            tag.name = req.body.name;
            tag.save();

            res.send( tag );
        }
        else{

            res.status(400).send({ error: 'Tag not found' });
        }

    });

});


// DELETE /votes/ - Deletes a fellow's vote
app.delete('/:tag_id', Middleware.isAdmin, function (req, res) {

    Tags.findOne({

        where: {
            id: req.params.tag_id
        }

    }).then(function(tag) {

        if( tag !== null ){

            tag.destroy();

            res.send( '1' );
        }
        else{

            res.status(400).send({ error: 'Tag not found' });
        }

    });
});

module.exports = app;
