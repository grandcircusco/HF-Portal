(function() {
	"use strict";

	module.exports = function(sequelize, DataTypes) {

	    var User = sequelize.define("users", {

	        id:			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	        email: 		{ type: DataTypes.STRING, allowNull: false },
	        userType:   { type: DataTypes.STRING, allowNull: false },
	        password: 	{ type: DataTypes.STRING, allowNull: false }
	    },{
			instanceMethods: {
				toJSON: function(){

					var values = this.get();

					console.log(values);

					delete values.password;
					return values;
				}
			}
		});

	    return User;
	};
}());
