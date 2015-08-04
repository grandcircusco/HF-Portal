var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var Sequelize = require('sequelize');

var models = require('./source/models');
var fellows = require('./source/routes/fellows');
var companies = require('./source/routes/companies');
var tags = require('./source/routes/tags');

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


// // Error message
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // error handler
// // no stacktraces leaked to user unless in development environment
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: (app.get('env') === 'development') ? err : {}
//     });
// });

module.exports = app;


/** Server Startup **/

models.sequelize.sync().then(function () {

    var server = app.listen(3000, function createServer() {
        var host = server.address().address;
        var port = server.address().port;

        console.log("HFPortal app listening at http://%s:%s", host, port);
    });
});



