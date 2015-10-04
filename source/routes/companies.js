var express = require('express');
var multer  = require('multer');
var app = express();

var models = require('../models');
var Companies = models.companies;
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

            name: {ne: null}
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
app.post('/', function postCompany(req, res) {
    //res.send('POST request - create a new company record');

    // Take POST data and build a Company Object (sequelize)
    Companies.create({

        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        primary_contact: req.body.primary_contact,
        company_size: req.body.company_size,
        industry: req.body.industry,
        description: req.body.description,
        founding_year: req.body.founding_year,
        founders: req.body.founders,
        website_url: req.body.website_url,
        linked_in_url: req.body.linked_in_url,
        image_url: req.body.image_url,
        location: req.body.location

    }).then(function(err, company) {

        console.log(company);
        console.log(err);

        res.send(company);
     });
});

// GET /companies - get all companies
app.get('/users', function getCompanies(req, res) {

    Companies.all({

        where: {

            name: {ne: null}
        },
        order: '"name" ASC',
        include: [{ all: true }]

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
        }]

    }).then(function(company) {

        res.send(company);
    });
});

// PUT /companies/:id - updates an existing company record
app.put('/:id', upload.single('file'),function putCompany(req, res) {

    Companies.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        company.user_id = req.body.user_id;
        company.name = req.body.name;
        company.email = req.body.email;
        company.primary_contact = req.body.primary_contact;
        company.company_size = req.body.company_size;
        company.industry = req.body.industry;
        company.bio = req.body.bio;
        company.founding_year = req.body.founding_year;
        company.founders = req.body.founders;
        company.website_url = req.body.website_url;
        company.linked_in_url = req.body.linked_in_url;
        //company.image_url = req.body.image_url;
        company.image_url = req.file.path;
        company.location = req.body.location;

        company.save();

        company.setTags(null).then(function() {

            var tags = req.body.tags;
            if (Array.isArray(tags)) {
                tags.forEach(function (tag_id) {

                    Tags.findOne({
                        where: {
                            id: parseInt(tag_id)
                        }
                    }).then(function (tagObj) {

                        company.addTag(tagObj);
                    });
                });
            }

        });

        res.send(company);
    });

});

// DELETE /companies/:id - deletes an existing company record
app.delete('/:id', function deleteCompany(req, res) {

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
