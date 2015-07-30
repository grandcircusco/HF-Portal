"use strict";

module.exports = function(sequelize, DataTypes) {

    var Tag = sequelize.define("tags", {

        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING
    });

    return Tag;
};