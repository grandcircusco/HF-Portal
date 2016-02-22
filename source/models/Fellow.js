(function() {
    "use strict";

    module.exports = function(sequelize, DataTypes) {

        return sequelize.define("fellows", {

            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            user_id: { type: DataTypes.INTEGER },
            first_name: { type:DataTypes.STRING, default: "" },
            last_name: { type:DataTypes.STRING, default: "" },
            university: DataTypes.STRING,
            major: DataTypes.STRING,
            bio: DataTypes.TEXT,
            interests: DataTypes.TEXT,
            description: DataTypes.STRING,
            git_hub: DataTypes.STRING,
            portfolio: DataTypes.STRING,
            developer_type: DataTypes.STRING,
            question: DataTypes.STRING,
            answer: DataTypes.STRING,
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
