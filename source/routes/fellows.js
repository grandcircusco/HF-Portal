var express = require('express');
var app = express();

var models = require('../models');
var Fellows = models.fellows;

// GET /fellows - get all fellows
app.get('/api/v1/fellows', function getFellows(req, res) {

    Fellows.all({

        include: [{
            model: Tags
        }]

    }).then(function(fellows) {

        res.send(fellows);
    });

});

// GET /fellows/:id - get one fellow
app.get('/api/v1/fellows/:id', function getFellow(req, res){

    //res.send('GET request - get a company record');
    Fellows.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(fellow) {

        res.send(fellow);
    });
});

// POST /api/fellows - create a new fellow record
app.post('/api/v1/fellows', function postFellow(req, res) {

    Fellows.create({

        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        university: req.body.university,
        major: req.body.major,
        bio: req.body.bio,
        interests: req.body.interests,
        resume_file_path: req.body.resume_file_path,
        image_url: req.body.image_url

    }).then(function(err, fellow) {

        res.send(fellow);
    });

});


// PUT /api/fellows/:id - updates an existing fellow record
app.put('/api/v1/fellows/:id', function putFellow(req, res) {

    Fellows.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(fellow) {

        fellow.user_id = req.body.user_id;
        fellow.first_name = req.body.first_name;
        fellow.last_name = req.body.last_name;
        fellow.email = req.body.email;
        fellow.university = req.body.university;
        fellow.major = req.body.major;
        fellow.bio = req.body.bio;
        fellow.interests = req.body.interests;
        fellow.resume_file_path = req.body.resume_file_path;
        fellow.image_url = req.body.image_url;

        fellow.save();

        res.send(fellow);
    });

});

// DELETE /api/fellows/:id - deletes an existing fellow record
app.delete('/api/v1/fellows/:id', function deleteFellow(req, res) {

    Fellows.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(fellow) {

        fellow.destroy();

        res.send("Fellow Deleted");
    });

});


module.exports = app;
