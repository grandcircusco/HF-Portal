var express = require('express');
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

var app = express();

var API_ROOT = '/api/v1';

/**
 *
 * This makes getting Posted Data from req.body work
 *
 */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


/** Routes **/

// GET /fellows - get all fellows
app.get(API_ROOT + '/fellows', function getFellows(req, res) {

    Fellows.all({

        include: [{
            model: Tags
        }]

    }).then(function(fellows) {

        res.send(fellows);
    });

});

// POST /api/fellows - create a new fellow record
app.post(API_ROOT + '/fellows', function postFellow(req, res) {

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

app.get(API_ROOT + '/fellows/:id', function getFellow(req, res){

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
app.put(API_ROOT + '/fellows/:id', function putFellow(req, res) {

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
app.delete(API_ROOT + '/fellows/:id', function deleteFellow(req, res) {

    Fellows.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(fellow) {

        fellow.destroy();

        res.send("Fellow Deleted");
    });

});


// GET /api/companies - get all companies
app.get(API_ROOT + '/companies', function getCompanies(req, res) {

    Companies.all({

        include: [{
            model: Tags
        }]

    }).then(function(companies) {

        res.send(companies);
    });

});

// POST /api/companies - create a new company record
app.post(API_ROOT + '/companies', function postCompany(req, res) {
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

app.get(API_ROOT + '/companies/:id', function getCompany(req, res) {
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
app.put(API_ROOT + '/companies/:id', function putCompany(req, res) {

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
app.delete(API_ROOT + '/companies/:id', function deleteCompany(req, res) {

    Companies.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(company) {

        company.destroy();

        res.send("Company Deleted");
    });

});

// POST /api/vote - Creates a new vote
app.post(API_ROOT + '/vote', function putVote(req, res) {

    var company = Companies.findOne({

        where: {
            id: req.body.company_id
        }

    });

    var fellow = Fellows.findOne({

        where: {
            id: req.body.fellow_id
        }

    });

    if (req.body.type = "company") {
        company.addVotee(fellow);
    }
    else if (req.body.type = "fellow") {
        fellow.addVotee(company);
    }

});


/** Tags **/

// GET /api/tags - get all tags
app.get(API_ROOT + '/tags', function getTags(req, res) {

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


/** Server Startup **/


models.sequelize.sync().then(function () {

    var server = app.listen(3000, function createServer() {
        var host = server.address().address;
        var port = server.address().port;

        console.log("HFPortal app listening at http://%s:%s", host, port);
    });
});



