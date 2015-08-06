(function() {
    "use strict";

    var fs        = require("fs");
    var path      = require("path");
    var Sequelize = require("sequelize");
    var sequelize = new Sequelize(process.env.DATABASE_URL || "postgres://localhost:5432/hfportal");
    var env       = process.env.NODE_ENV || "development";
    //var config    = require(__dirname + '/../config/config.json')[env];
    //var sequelize = new Sequelize(config.database, config.username, config.password, config);
    var db        = {};

    fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    db.companies.belongsToMany(db.tags, {through: 'companies_tags'});
    db.tags.belongsToMany(db.companies, {through: 'companies_tags'});

    db.fellows.belongsToMany(db.tags, {through: 'fellows_tags'});
    db.tags.belongsToMany(db.fellows, {through: 'fellows_tags'});

    db.fellows.belongsToMany(db.companies, {as: 'Voters', through: 'company_votes'}); //companies as voters
    db.companies.belongsToMany(db.fellows, {as: 'Votees', through: 'company_votes'}); //fellows as votees

    db.fellows.belongsToMany(db.companies, {as: 'Votees', through: 'fellow_votes'}); //companies as votees
    db.companies.belongsToMany(db.fellows, {as: 'Voters', through: 'fellow_votes'}); //fellows as voters

    module.exports = db;
}());
