(function(){

    "use strict";

    module.exports = function(sequelize, DataTypes) {


        return sequelize.define("company_tag", {

            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            company_id: { type: DataTypes.INTEGER },
            tag_id: { type: DataTypes.INTEGER }

        },{

            timestamps: false, // add updated_at and created_at
            paranoid: false // add deleted_at

        });

    };

})();

