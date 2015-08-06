console.log('hello world');
var express = require('express');
//var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');
var pg = require('pg');
var Sequelize = require('sequelize');

var models = require('./source/models');
var fellows = require('./source/routes/fellows');
var companies = require('./source/routes/companies');
var tags = require('./source/routes/tags');
var votes = require('./source/routes/votes');
var users = require('./source/routes/users');

var app = express();

/**
 *
 * This makes getting Posted Data from req.body work
 *
 */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api/v1/fellows', fellows);
app.use('/api/v1/companies', companies);
app.use('/api/v1/tags', tags);
app.use('/api/v1/votes', votes);
app.use('/api/v1/users', users);

/** Server Startup **/

models.sequelize.sync().then(function () {

    var server = app.listen(3000, function createServer() {
        var host = server.address().address;
        var port = server.address().port;

        console.log("HFPortal app listening at http://%s:%s", host, port);
    });
});