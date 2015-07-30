var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var Sequelize = require('sequelize');

// var fellow = require('./fellow');
// var company = require('./company');

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
 * Sequelize and Model Definitions
 */
var sequelize = new Sequelize("postgres://localhost:5432/hfportal");

var Tag = sequelize.define("tags", {

    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING
});

var Company = sequelize.define("companies", {

    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    primary_contact: Sequelize.STRING,
    company_size: Sequelize.INTEGER,
    industry: Sequelize.STRING,
    description: Sequelize.TEXT,
    founding_year: Sequelize.INTEGER,
    founders: Sequelize.STRING,
    image_url: Sequelize.STRING

},{

  timestamps: true

});

var Fellow = sequelize.define("fellows", {

    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    university: Sequelize.STRING,
    major: Sequelize.STRING,
    bio: Sequelize.TEXT,
    image_url: Sequelize.STRING

},{

    timestamps: true

});

Company.belongsToMany(Tag, {through: 'companies_tags'});
Tag.belongsToMany(Company, {through: 'companies_tags'});

Fellow.belongsToMany(Tag, {through: 'fellows_tags'});
Tag.belongsToMany(Fellow, {through: 'fellows_tags'});

sequelize.sync().then(function() {

});


//app.get('/', function (req, res) {
//
//
//  res.send('source/app/home/home.html');
//});

/** Routes **/

// GET /fellows - get all fellows
app.get('/api/v1/fellows', function getFellows(req, res) {

    Fellow.all({

        include: [{
            model: Tag
        }]

    }).then(function(fellows) {

        res.send(fellows);
    });

});

// POST /api/fellows - create a new fellow record
app.post('/api/v1/fellows', function postFellow(req, res) {

    Fellow.create({

        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        university: req.body.university,
        major: req.body.major,
        bio: req.body.bio,
        image_url: req.body.image_url

    }).success(function(err, fellow) {

        res.send(fellow);
    });

});

app.get('/api/v1/fellows/:id', function getFellow(req, res){

    //res.send('GET request - get a company record');
    Fellow.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tag
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(fellow) {

        res.send(fellow);
    });
});

// PUT /api/fellows/:id - updates an existing fellow record
app.put('/api/v1/fellows/:id', function putFellow(req, res) {

    Fellow.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tag
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

    Company.all({

        include: [{
            model: Tag
        }]

    }).then(function(companies) {

        res.send(companies);
    });

});

// POST /api/companies - create a new company record
app.post('/api/v1/companies', function postCompany(req, res) {
    //res.send('POST request - create a new company record');

    // Take POST data and build a Company Object (sequelize)
    Company.create({

        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        primary_contact: req.body.primary_contact,
        company_size: req.body.company_size,
        industry: req.body.industry,
        description: req.body.description,
        founding_year: req.body.founding_year,
        founders: req.body.founders,
        image_url: req.body.image_url

    }).success(function(err, company) {

        res.send(company);
     });

});

app.get('/api/v1/companies/:id', function getCompany(req, res) {
    //res.send('GET request - get a company record');
    Company.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tag
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        res.send(company);
    });

});

// PUT /api/companies/:id - updates an existing company record
app.put('/api/v1/companies/:id', function putCompany(req, res) {

    Company.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tag
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
        company.image_url = req.body.image_url;

        company.save();

        res.send(company);
    });

});

// DELETE /api/companies/:id - deletes an existing company record
app.delete('/api/companies/:id', function deleteCompany(req, res) {
    res.send('DELETE request - delete a company record');
});



/** Server Startup **/

var server = app.listen(3000, function createServer() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("HFPortal app listening at http://%s:%s", host, port);
});


