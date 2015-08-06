"use strict";

var express = require('express');
var multer  = require('multer');
var upload = multer({ dest: '.../.../assets/images/' });

var app = express();

app.post('/company', upload.single('avatar'), function (req, res) {
    console.dir(req.files);
});

module.exports = function(sequelize, DataTypes) {

    var Company = sequelize.define("companies", {

        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        primary_contact: DataTypes.STRING,
        company_size: DataTypes.INTEGER,
        industry: DataTypes.STRING,
        description: DataTypes.TEXT,
        founding_year: DataTypes.INTEGER,
        founders: DataTypes.STRING,
        website_url: DataTypes.STRING,
        linked_in_url: DataTypes.STRING,
        image_url: DataTypes.STRING

    },{

        timestamps: true, // add updated_at and created_at
        paranoid: true // add deleted_at

    });

    return Company;
};
