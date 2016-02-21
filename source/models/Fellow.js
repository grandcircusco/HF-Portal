(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {

        return sequelize.define("fellows", {

            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            user_id: { type: DataTypes.INTEGER },
            first_name: { type:DataTypes.STRING, default: "" },
            last_name: { type:DataTypes.STRING, default: "" },
            email: DataTypes.STRING,
            university: DataTypes.STRING,
            major: DataTypes.STRING,
            bio: DataTypes.TEXT,
            interests: DataTypes.TEXT,
            resume_file_path: DataTypes.STRING,
            image_url: DataTypes.STRING,
            website_url: DataTypes.STRING

        },{

            timestamps: false, // add updated_at and created_at
            paranoid: false // add deleted_at

        });

    };
}());
