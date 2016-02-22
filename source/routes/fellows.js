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

    // @TODO - This eager loads
    Fellows.all({

        order: '"last_name" ASC',
        include: [{

            model: Tags
        },{

            model: Users,
            attributes: ['id', 'email', 'userType'],
            include: [{

                model: Users,
                as: 'VotesFor',
                attributes: ['id', 'email', 'userType'],
                include: [{

                    model: Companies
                }]
            },
            {

                model: Users,
                as: 'VotesCast',
                attributes: ['id', 'email', 'userType'],
                include: [{

                    model: Companies
                }]
            }]

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

        },{
            model: Users
        }]

    }).then(function(fellow) {

        res.send(fellow);
    });
});

// POST /fellows - create a new fellow record
// ** Create a new fellow and fetch relations -- admin page expects certain data
app.post('/', function postFellow(req, res) {

    Fellows.create({

        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        //university: req.body.university,
        //major: req.body.major,
        bio: req.body.bio,
        interests: req.body.interests,
        description: req.body.description,
        git_hub: req.body.git_hub,
        portfolio: req.body.portfolio,
        developer_type: req.body.developer_type,
        question: req.body.question,
        answer: req.body.answer,
        image_url: req.body.image_url

    }).then(function( fellow ) {

        // get loaded fellow obj
        Fellows.findOne({

            where: {
                id: fellow.id
            },
            include: [{
                model: Tags
            },{
                model: Users,
                attributes: ['id', 'email', 'userType'],
                include: [{

                    model: Users,
                    as: 'VotesFor',
                    attributes: ['id', 'email', 'userType'],
                    include: [{

                        model: Companies
                    }]
                },
                {

                    model: Users,
                    as: 'VotesCast',
                    attributes: ['id', 'email', 'userType'],
                    include: [{

                        model: Companies
                    }]
                }]
            }]

        }).then(function(fellow) {

            res.send(fellow);
        });

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
        //fellow.university = req.body.university;
        //fellow.major = req.body.major;
        fellow.bio = req.body.bio;
        fellow.interests = req.body.interests;
        fellow.description = req.body.description;
        fellow.git_hub = req.body.git_hub;
        fellow.portfolio = req.body.portfolio;
        fellow.developer_type = req.body.developer_type;

        fellow.question = req.body.question;
        fellow.answer = req.body.answer;

        fellow.image_url = req.body.image_url;

        fellow.save();

        //console.log( req.body.tags );

        // remove all tags, then re-add currently posted tags
        fellow.setTags(null).then(function() {


            if (Array.isArray(req.body.tags)) {

                req.body.tags.forEach(function ( tag ) {

                    if( typeof tag.id !== "undefined" ) {

                        Tags.findOne({

                            where: {
                                id: parseInt(tag.id)
                            }

                        }).then(function (tagObj) {

                            fellow.addTag(tagObj);
                        });
                    }
                    else{

                        Tags.create({

                            name: tag.name
                        }).then( function( tagObj ){

                            console.log(tagObj);

                            company.addTag(tagObj);
                        });
                    }
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
