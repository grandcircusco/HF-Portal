(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {

        return sequelize.define( "votes", {

                id:		  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                voter_id: { type: DataTypes.INTEGER },
                votee_id: { type: DataTypes.INTEGER }

            },{

                timestamps: false
        });
    };
}());
