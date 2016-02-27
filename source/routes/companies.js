var express = require('express');
var multer  = require('multer');
var app = express();

var Middleware = require('./middleware');

var models = require('../models');
var Companies = models.companies;
var Fellows = models.fellows;
var Tags = models.tags;
var Users = models.users;

// Image Upload
// var upload = multer({ dest: './public/assets/images/' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/images/profile');
  },
  filename: function (req, file, cb) {

      var ext = "." + file.mimetype.split('/')[1];
      var file_name = file.fieldname + "_"+ Date.now() + ext;
      cb(null, file_name);
  }
});

var upload = multer({ storage: storage });


// GET /companies - get all companies
app.get('/', function getCompanies(req, res) {

    Companies.all({

        where: {

            name: {ne: null},
            enabled: 1
        },
        order: '"name" ASC',
        include: [{
            model: Tags
        }]

    }).then(function(companies) {

        res.send(companies);
    });

});

// POST /companies - create a new company record
app.post('/', Middleware.isAdmin, function postCompany(req, res) {
    //res.send('POST request - create a new company record');

    // Take POST data and build a Company Object (sequelize)
    Companies.create({

        user_id: req.body.user_id,
        name: req.body.name,
        primary_contact: req.body.primary_contact,
        location: req.body.location,
        company_size: req.body.company_size,
        industry: req.body.industry,
        bio: req.body.bio,
        description: req.body.description,
        developer_type: req.body.developer_type,
        website_url: req.body.website_url,
        image_url: req.body.image_url,
        enabled: req.body.enabled

    }).then(function( company) {

        // get loaded fellow obj
        Companies.findOne({

            where: {
                id: company.id
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

                        model: Fellows
                    }]
                },
                {

                    model: Users,
                    as: 'VotesCast',
                    attributes: ['id', 'email', 'userType'],
                    include: [{

                        model: Fellows
                    }]
                }]
            }]

        }).then(function(company) {

            res.send(company);
        });

     });
});

// GET /companies - get all companies
app.get('/users', function getCompanies(req, res) {

    Companies.all({

        order: '"name" ASC',
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

                    model: Fellows
                }]
            },
            {

                model: Users,
                as: 'VotesCast',
                attributes: ['id', 'email', 'userType'],
                include: [{

                    model: Fellows
                }]
            }]
        }]

    }).then(function(companies) {

        res.send(companies);
    });

});

// GET /companies/:id - get one company
app.get('/:id', function getCompany(req, res) {
    //res.send('GET request - get a company record');
    Companies.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
        },{
            model: Users
        }]

    }).then(function(company) {

        res.send(company);
    });

});

// GET /companies/user_id/:id - get one company by user_id
app.get('/user_id/:user_id', function getFellow(req, res){

    //res.send('GET request - get a company record');
    Companies.findOne({

        where: {
            user_id: req.params.user_id
        },
        include: [{

            model: Tags

        },{
            model: Users
        }]

    }).then(function(company) {

        res.send(company);
    });
});

// PUT /companies/:id - updates an existing company record
app.put('/:id', Middleware.isLoggedIn, upload.single('file'),function putCompany(req, res) {

    Companies.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        var currentUser = req.user;
        if( currentUser.userType !== 'Admin' ) {

            if (company.user_id !== currentUser.id) {

                res.send('Unauthorized');
                return;
            }
        }

        company.user_id = req.body.user_id;
        company.name = req.body.name;
        company.primary_contact = req.body.primary_contact;
        company.location = req.body.location;
        company.company_size = req.body.company_size;
        company.industry = req.body.industry;
        company.bio = req.body.bio;
        company.description = req.body.description;
        company.developer_type = req.body.developer_type;
        company.website_url = req.body.website_url;

        company.image_url = req.body.image_url;
        company.enabled = req.body.enabled;

        company.save();

        // remove all tags, then re-add currently posted tags
        company.setTags(null).then(function() {

            console.log( req.body.tags );

            if ( Array.isArray(req.body.tags) ) {

                req.body.tags.forEach(function (tag) {

                    if( typeof tag.name !== "undefined" ) {

                        Tags.findOne({

                            where: {
                                name: {

                                    ilike: tag.name
                                }
                            }

                        }).then(function (tagObj) {

                            if( tagObj ){

                                company.addTag(tagObj);
                            }
                            else {

                                Tags.create({

                                    name: tag.name

                                }).then(function (tagObj) {

                                    company.addTag(tagObj);
                                });
                            }
                        });
                    }
                });
            }

        });

        res.send(company);
    });

});

// DELETE /companies/:id - deletes an existing company record
app.delete('/:id', Middleware.isAdmin, function deleteCompany(req, res) {

    Companies.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(company) {

        company.destroy();

        res.send("Company Deleted");
    });

});

module.exports = app;
