var express = require('express');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');
var pg = require('pg');
var Sequelize = require('sequelize');

/**
 * Sequelize and Model Definitions
 */
var models = require('./source/models');
var Companies = models.companies;
var Fellows = models.fellows;
var Tags = models.tags;

console.log(models);

var app = express();

/**
 *
 * This makes getting Posted Data from req.body work
 *
 */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/**
 * Set up Stormpath - used for managing user signup/authentication,
 *  as well as forgotten passwords, etc.
 */
app.use(stormpath.init(app, {
    apiKeyFile: '/Users/camherringshaw/.stormpath/apiKey.properties',
    secretKey:  'GuMS4HZVaP3rlcUwfwanwRdasz3OoiYOCbJMaBXUNQIl5cZW1t3Yzcpi5396', //Arbitrary random string
    application: 'https://api.stormpath.com/v1/applications/3zenLEfJmn6ce4dCuePlzi',
    enableForgotPassword: true
}));



/** Routes **/

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
  res.send('DELETE request - delete a fellow record');
});


// GET /api/companies - get all companies
app.get('/api/v1/companies', function getCompanies(req, res) {

    Companies.all({

        include: [{
            model: Tags
        }]

    }).then(function(companies) {

        res.send(companies);
    });

});

// POST /api/companies - create a new company record
app.post('/api/v1/companies', function postCompany(req, res) {
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
        image_url: req.body.image_url

    }).then(function(err, company) {

        res.send(company);
     });

});

app.get('/api/v1/companies/:id', function getCompany(req, res) {
    //res.send('GET request - get a company record');
    Companies.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        res.send(company);
    });

});

// PUT /api/companies/:id - updates an existing company record
app.put('/api/v1/companies/:id', function putCompany(req, res) {

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
        company.description = req.body.description;
        company.founding_year = req.body.founding_year;
        company.founders = req.body.founders;
        company.website_url = req.body.website_url;
        company.linked_in_url = req.body.linked_in_url;
        company.image_url = req.body.image_url;

        company.save();

        res.send(company);
    });

});

// DELETE /api/companies/:id - deletes an existing company record
app.delete('/api/companies/:id', function deleteCompany(req, res) {
    res.send('DELETE request - delete a company record');
});

// Set up paths for Stormpath
app.get('/secret', stormpath.loginRequired, function(req, res) {
    res.send('secret page!');
});


/** Server Startup **/


// models.sequelize.sync().then(function () {

    var server = app.listen(3000, function createServer() {
        var host = server.address().address;
        var port = server.address().port;

        console.log("HFPortal app listening at http://%s:%s", host, port);
    });
// });



