var express = require('express');
var multer  = require('multer');


// Image Upload
// var upload = multer({ dest: './public/assets/images/' });
var app = express();
var models = require('../models');
var Fellows = models.fellows;
var Tags = models.tags;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/images/')
  },
  filename: function (req, file, cb) {
    console.log(file);
    var ext = "." + file.mimetype.split('/')[1];
    //console.log("********************"+ file.fieldname);
    cb(null, file.fieldname + "_"+ Date.now() + ext);
  }
});

var upload = multer({ storage: storage });



// GET /fellows - get all fellows
app.get('/', function getFellows(req, res) {

    Fellows.all({

        where: {

            first_name: {ne: null}
        },
        include: [{
            model: Tags
        }]

    }).then(function(fellows) {

        res.send(fellows);
    });

});

// GET /fellows/:id - get one fellow
app.get('/:id', function getFellow(req, res){

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

// POST /fellows - create a new fellow record
app.post('/', function postFellow(req, res) {

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

// Post profile photo
// app.post('/uploads/:id', upload.single('profile'), function (req, res, next) {
//
//   // Fellows.findOne({
//   //     where: {
//   //         id: req.params.id
//   //     }
//   // }).then(function(fellow) {
//   //
//   //     res.send(fellow);
//   // });
//
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
//   console.log(req.file.originalname);
//   res.send('uploading file');
//
// });

// PUT /fellows/:id - updates an existing fellow record
app.put('/:id', upload.single('fellow_profile'), function putFellow(req, res) {


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
        //console.log("####################"+req.file.path);
        fellow.image_url = req.file.path;


        fellow.save();

        res.send(fellow);
    });

});

// DELETE /fellows/:id - deletes an existing fellow record
app.delete('/:id', function deleteFellow(req, res) {

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
