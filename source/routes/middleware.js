(function() {

    "use strict";

    /** Define Middleware for routes **/

    var isLoggedIn = function (req, res, next) {

        if (req.isAuthenticated()) {

            return next();
        }

        return res.send( 'Unauthorized' );
    };

    // verify the logged in user is an admin
    var isAdmin = function (req, res, next) {

        if (req.isAuthenticated()) {

            var user = req.user;

            if( user.userType === 'Admin' ){

                return next();
            }
        }

        return res.send( 'Unauthorized' );
    };

    // verify the logged in user is an admin
    var isFellow = function (req, res, next) {

        if (req.isAuthenticated()) {

            var user = req.user;

            if( user.userType === 'Fellow' ){

                return next();
            }
        }

        return res.send( 'Unauthorized' );
    };

    // verify the logged in user is an admin
    var isCompany = function (req, res, next) {

        if (req.isAuthenticated()) {

            var user = req.user;

            if( user.userType === 'Company' ){

                return next();
            }
        }

        return res.send( 'Unauthorized' );
    };


    module.exports = {

        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        isFellow: isFellow,
        isCompany: isCompany
    };

}());
