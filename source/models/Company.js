(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {

        return sequelize.define("companies", {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            user_id: { type: DataTypes.INTEGER },
            name: { type:DataTypes.STRING, default: "" },
            fellow_type: { type:DataTypes.STRING },
            primary_contact: DataTypes.STRING,
            location: DataTypes.STRING,
            year: DataTypes.STRING,
            nearFuture: DataTypes.TEXT,
            company_size: DataTypes.STRING,
            industry: DataTypes.STRING,
            bio: DataTypes.TEXT,
            description: DataTypes.STRING,
            developer_type: DataTypes.STRING,
            website_url: DataTypes.STRING,
            image_url: DataTypes.STRING,
            enabled: {

                type: DataTypes.INTEGER,
                defaultValue: 0
            }

        },{

            timestamps: false, // add updated_at and created_at
            paranoid: false // add deleted_at

        });
    };
}());
