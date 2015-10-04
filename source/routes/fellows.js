var express = require('express');
var multer  = require('multer');
var app = express();

var models = require('../models');
var Fellows = models.fellows;
var Companies = models.companies;
var Tags = models.tags;
var Users = models.users;

// Image Upload
// var upload = multer({ dest: './public/assets/images/' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/images/profile/');
  },
  filename: function (req, file, cb) {

      var ext = "." + file.mimetype.split('/')[1];
      var file_name = file.fieldname + "_"+ Date.now() + ext;
      cb(null, file_name);

  }
});
var upload = multer({ storage: storage });

// GET /fellows - get all fellows
app.get('/', function getFellows(req, res) {

    Fellows.all({

        where: {

            first_name: {ne: null}
        },
        order: '"last_name" ASC',
        include: [{
            model: Tags
        }]

    }).then(function(fellows) {

        res.send(fellows);
    });

});

// GET /fellows - get all fellows
app.get('/users', function getFellows(req, res) {

    Fellows.all({

        where: {

            first_name: {ne: null}
        },
        order: '"last_name" ASC',
        include: [{ all: true }]

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
        }]

    }).then(function(fellow) {

        res.send(fellow);
    });
});

// GET /fellows/user_id/:id - get one fellow by user_id
app.get('/user_id/:user_id', function getFellow(req, res){

    //res.send('GET request - get a company record');
    Fellows.findOne({

        where: {
            user_id: req.params.user_id
        },
        include: [{
            model: Tags
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
        image_url: req.body.image_url,
        website_url: req.body.website_url

    }).then(function(err, fellow) {

        res.send(fellow);
    });

});


// PUT /fellows/:id - updates an existing fellow record
app.put('/:id', upload.single('file'), function putFellow(req, res) {

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
        //fellow.resume_file_path = req.body.resume_file_path;
        fellow.image_url = req.file.path;
        //fellow.image_url = req.body.image_url;
        fellow.website_url = req.body.website_url;

        fellow.save();

        fellow.setTags(null).then(function() {

            var tags = req.body.tags;
            if (Array.isArray(tags)) {
                tags.forEach(function (tag_id) {

                    Tags.findOne({
                        where: {
                            id: parseInt(tag_id)
                        }
                    }).then(function (tagObj) {

                        fellow.addTag(tagObj);
                    });
                });
            }

        });

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
