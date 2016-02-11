(function() {

    "use strict";

    var fs        = require("fs");
    var path      = require("path");
    var Sequelize = require("sequelize");


    var sequelize = new Sequelize( process.env.DATABASE_URL || "postgres://localhost:5432/hfportal", { timezone: '+00:00' });
    
    var env       = process.env.NODE_ENV || "development";

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

    db.users.hasOne( db.companies, { foreignKey: 'user_id' } );
    db.users.hasOne( db.fellows, { foreignKey: 'user_id' } );

    db.companies.belongsToMany(db.tags, {through: 'companies_tags'});
    db.tags.belongsToMany(db.companies, {through: 'companies_tags'});

    db.fellows.belongsToMany(db.tags, {through: 'fellows_tags'});
    db.tags.belongsToMany(db.fellows, {through: 'fellows_tags'});

    db.users.belongsToMany( db.users, {
        as: 'VotesFor',
        through: 'votes',
        foreignKey: 'votee_id',
        otherKey: 'voter_id'

    });

    db.users.belongsToMany( db.users, {
        as: 'VotesCast',
        through: 'votes',
        foreignKey: 'voter_id',
        otherKey: 'votee_id'
    });

    module.exports = db;

}());
