"use strict";

module.exports = function(sequelize, DataTypes) {

    var User = sequelize.define("user", {

        id:			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: 		{ type: DataTypes.STRING, allowNull: false },
        password: 	{ type: DataTypes.STRING, allowNull: false },
        salt:		{ type: DataTypes.STRING, /*allowNull: false*/ }
    });

    return User;
};