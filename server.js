var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var Sequelize = require('sequelize');
var gzippo = require('gzippo');

var models = require('./source/models');
var fellows = require('./source/routes/fellows');
var companies = require('./source/routes/companies');
var tags = require('./source/routes/tags');
var votes = require('./source/routes/votes');
var users = require('./source/routes/users');

var app = express();

console.log("Setting port: ");
app.set('port', (process.env.PORT || 5000));
console.log('Port set: ' + app.get('port'));

/**
 *
 * This makes getting Posted Data from req.body work
 *
 */
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(gzippo.staticGzip(__dirname + '/public'));
app.use(gzippo.compress());


app.use('/api/v1/fellows', fellows);
app.use('/api/v1/companies', companies);
app.use('/api/v1/tags', tags);
app.use('/api/v1/votes', votes);
app.use('/api/v1/users', users);

/** Server Startup **/
try{
    models.sequelize.sync().then(function () {

        var server = app.listen(app.get('port'), function createServer() {
            var host = server.address().address;
            var port = server.address().port;

            console.log("HFPortal app listening at http://%s:%s", host, port);
        });
    });

}catch(err) {
	console.log("goodbye world, I'm crashing");
} 

