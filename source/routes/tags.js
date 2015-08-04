var express = require('express');
var app = express();

var models = require('../models');
var Tags = models.tags;

/** Tags **/

// GET /api/tags - get all companies
app.get('/api/v1/tags', function getTags(req, res) {

    /*Tags.create({
        name: "Javascript"
    });

    Tags.create({
        name: "HTML"
    });

    Tags.create({
        name: "CSS"
    });

    Tags.create({
        name: "C++"
    });

    Tags.create({
        name: "Java"
    });

    Tags.create({
        name: "PHP"
    });

    Tags.create({
        name: "Node"
    });

    Tags.create({
        name: "Angular"
    });

    Tags.create({
        name: "MySQL"
    });

    Tags.create({
        name: "PostgreSQL"
    });*/


    Tags.all().then(function(tags) {

        res.send(tags);
    });

});

module.exports = app;
