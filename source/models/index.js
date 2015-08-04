 "use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
//var config    = require(__dirname + '/../config/config.json')[env];
//var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sequelize = new Sequelize("postgres://localhost:5432/hfportal");
var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

 db.companies.belongsToMany(db.tags, {through: 'companies_tags'});
 db.tags.belongsToMany(db.companies, {through: 'companies_tags'});

 db.fellows.belongsToMany(db.tags, {through: 'fellows_tags'});
 db.tags.belongsToMany(db.fellows, {through: 'fellows_tags'});

 db.fellows.belongsToMany(db.companies, {as: 'Voters', through: 'company_votes'});
 db.companies.belongsToMany(db.fellows, {as: 'Votees', through: 'company_votes'});

 db.fellows.belongsToMany(db.companies, {as: 'Votees', through: 'fellow_votes'});
 db.companies.belongsToMany(db.fellows, {as: 'Voters', through: 'fellow_votes'});


