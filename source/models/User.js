(function() {
	"use strict";

	module.exports = function(sequelize, DataTypes) {

	    return sequelize.define( "users", {

	        id:			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	        email: 		{ type: DataTypes.STRING, allowNull: false },
	        userType:   { type: DataTypes.STRING, allowNull: false },
	        password: 	{ type: DataTypes.STRING, allowNull: false }

	    },
		{
			timestamps: false,
			paranoid: false,
			// prevent password and dates getting returned by default from queries
			scopes: {

				public: {

					attributes: ['id', 'email', 'userType']
				}
			}
		});
	};
}());
