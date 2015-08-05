var express = require('express');
var app = express();

var models = require('../models');
var Companies = models.companies;
var Tags = models.tags;

// GET /companies - get all companies
app.get('/', function getCompanies(req, res) {

    Companies.all({

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
        image_url: req.body.image_url

    }).then(function(err, company) {

        res.send(company);
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
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        res.send(company);
    });

});

// PUT /companies/:id - updates an existing company record
app.put('/:id', function putCompany(req, res) {

    // Handle image upload here -- create image_url for below
    var image_url = "";

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
        company.image_url = image_url;

        company.save();

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

