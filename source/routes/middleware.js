(function() {

    "use strict";

    /** Define Middleware for routes **/

    var isOwnerOrAdmin = function( req, res, next ) {

        // User must be logged in and must either
        // - be the user being edited
        // - be an admin
        var currentUser = req.user;

        if( currentUser.userType === 'Admin' ) {
            return next();
        }
        // user is not admin, so check if they match the user being posted
        else if( currentUser.id !== parseInt( req.params.id ) )
        {
            console.log(currentUser.id + "!=" + req.params.id );
            res.send( 'Unauthorized' );
            return;
        }

    };

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

        isOwnerOrAdmin: isOwnerOrAdmin,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        isFellow: isFellow,
        isCompany: isCompany
    };

}());
