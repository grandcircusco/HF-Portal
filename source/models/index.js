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

    db.users.belongsToMany( db.users, { as: 'VotesFor', through: 'votes', foreignKey: 'votee_id',  otherKey: 'voter_id' });
    db.users.belongsToMany( db.users, { as: 'VotesCast', through: 'votes', foreignKey: 'voter_id',  otherKey: 'votee_id' });

    //User.belongsToMany(Project, { as: 'Tasks', through: 'worker_tasks', foreignKey: 'userId', otherKey: 'projectId'})
    //
    //db.fellows.belongsToMany(db.companies, {as: 'Votees', through: 'votes_for_fellows'}); //companies as voters
    //db.companies.belongsToMany(db.fellows, {as: 'Voters', through: 'votes_for_fellows'}); //fellows as votees
    //
    //db.fellows.belongsToMany(db.companies, {as: 'Voters', through: 'votes_for_companies'}); //companies as votees
    //db.companies.belongsToMany(db.fellows, {as: 'Votees', through: 'votes_for_companies'}); //fellows as voters

    module.exports = db;
}());
