var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var Sequelize = require('sequelize');
var gzippo = require('gzippo');
var aws = require('aws-sdk');

var cookieParser = require('cookie-parser');
var passport = require('passport');

var models = require('./source/models');
var fellows = require('./source/routes/fellows');
var companies = require('./source/routes/companies');
var tags = require('./source/routes/tags');
var votes = require('./source/routes/votes');
var users = require('./source/routes/users');

var bcrypt = require('bcrypt');

var app = express();

// set up a route to redirect http to https
//app.get('*',function(req,res){
//
//    res.redirect( 301, 'http://hackerfellows.com' );
//});
//
// SSL Certbot Acme-challenge
app.get('/.well-known/acme-challenge/rmE6rFXlwjSQJpAivrx5ZW1xl-twZ-adk7VPxir_YKI', function(req, res) {
    res.send('rmE6rFXlwjSQJpAivrx5ZW1xl-twZ-adk7VPxir_YKI.D05WGXmxZv20NpqTnfc6pyPUXLBjuuas7m85bi9EcGM');
});

console.log("Setting port: ");
app.set('port', (process.env.PORT || 5000));
console.log('Port set: ' + app.get('port'));

/** This makes getting Posted Data from req.body work */
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(gzippo.staticGzip(__dirname));// + '/public'));
app.use(gzippo.compress());

// Authentication stuff
app.use(cookieParser());

// This must be done before passport is initialized
app.use(require('express-session')({
    secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/v1/fellows', fellows);
app.use('/api/v1/companies', companies);
app.use('/api/v1/tags', tags);
app.use('/api/v1/votes', votes);
app.use('/api/v1/users', users);


//application -------------------------------------------------------------
app.get('/', function(req, res) {
  res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

app.get('/sign_s3', function(req, res){

    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3_params, function(err, data){

        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

/** Server Startup **/
try{
    models.sequelize.sync().then(function () {

        var server = app.listen(app.get('port'), function createServer() {
            var host = server.address().address;
            var port = server.address().port;

            // check for and create admin user if not present
            models.users.findOne({

                where: {
                    email: {

                        ilike: 'admin@hackerfellows.com'
                    }
                }

            }).then( function( user ){

                if( user === null ) {

                    bcrypt.genSalt(10, function(err, salt) {

                        bcrypt.hash( 'password', salt, function(err, hash) {

                            models.users.create({

                                email: 'admin@hackerfellows.com',
                                password: hash,
                                userType: 'Admin'

                            }).then(function(user) {

                                console.log( "Default user admin@hackerfellows.com" );

                            });
                        });
                    });

                }
            });

            console.log("HFPortal app listening at http://%s:%s", host, port);
        });
    });

}
catch(err) {
	console.log("goodbye world, I'm crashing");
}
