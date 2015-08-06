(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {

        var Fellow = sequelize.define("fellows", {

            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            user_id: { type: DataTypes.INTEGER },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            university: DataTypes.STRING,
            major: DataTypes.STRING,
            bio: DataTypes.TEXT,
            interests: DataTypes.TEXT,
            resume_file_path: DataTypes.STRING,
            image_url: DataTypes.STRING

        },{

            timestamps: true, // add updated_at and created_at
            paranoid: true // add deleted_at

        });

        return Fellow;
    };
}());
