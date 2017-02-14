/**
 * app.routes
 * @desc    contains the routes for the app
 */

var app = angular.module('app', ['ngRoute', 'ngFileUpload', 'ngSanitize', 'ui.bootstrap', 'ui.select',
    'app.config', 'app.home', 'app.companies', 'app.fellows', 'app.tags', 'app.profile', 'app.votes', 'app.alert' ])
    .run(run);

/**
 *   * @name config
 *     * @desc Define valid application routes
 *       */
 app.config(function($routeProvider, $locationProvider){

    $routeProvider
    .when('/', {
        controller  : 'HomeController',
        templateUrl : 'source/app/home/home.html'
    })
    .when('/fellows', {
        controller: 'FellowsController',
        templateUrl: 'source/app/fellows/fellows.html',
        resolve: { loggedIn: checkLoggedin }
    })
    .when('/fellows/:fellow_id', {
        controller: 'FellowController',
        templateUrl: 'source/app/fellows/fellow.html',
        resolve: { loggedIn: checkLoggedin }
    })
    .when('/companies', {
        controller: 'CompaniesController',
        templateUrl: 'source/app/companies/companies.html',
        resolve: { loggedIn: checkLoggedin }
    })
    .when('/companies/:company_id', {
        controller: 'CompanyController',
        templateUrl: 'source/app/companies/company.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when('/tags', {
        controller: 'TagsController',
        templateUrl: 'source/app/tags/tags.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when('/profile', {
        controller: 'ProfileController',
        templateUrl: 'source/app/profile/profile.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when('/profile/admin', {
        controller: 'AdminProfileController',
        templateUrl: 'source/app/profile/partials/admin-profile.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when('/profile/fellow', {
        controller: 'FellowsProfileController',
        templateUrl: 'source/app/profile/partials/fellow-profile.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when('/profile/company', {
        controller: 'CompanyProfileController',
        templateUrl: 'source/app/profile/partials/company-profile.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when( '/votes', {
        controller: 'VotesController',
        templateUrl: 'source/app/votes/partials/votes.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when( '/votes/fellow', {
        controller: 'FellowVotesController',
        templateUrl: 'source/app/votes/partials/fellow-votes.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .when( '/votes/company', {
        controller: 'CompanyVotesController',
        templateUrl: 'source/app/votes/partials/company-votes.html',
        resolve: { loggedIn: checkLoggedin }
    })

    .otherwise({ redirectTo: '/' });

});

// On paths that require login, make sure the login is confirmed before the route is loaded.
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, CONFIG, User){

    // Initialize a new promise
    var deferred = $q.defer();

    // keep user logged in after page refresh
    // Check backend for existing user in session and update User Service
    $http.get( CONFIG.SERVICE_URL + '/api/v1/users/confirm-login' )
        .success(function (user) {

            //console.log( user );

            if (user && user.id) {

                User.SetCredentials( user.id, user.email, user.userType );
                deferred.resolve();
            }
            else{

                deferred.reject();
                $location.url('/');
            }

        });

    return deferred.promise;
};

app.controller('RoutingController', RoutingController)
.controller('LoginModalInstanceController', LoginModalInstanceController);

RoutingController.$inject = ['$scope', '$modal', '$window', 'User', '$location', '$anchorScroll'];
LoginModalInstanceController.$inject = ['$scope', '$modalInstance', 'User'];

function RoutingController($scope, $modal, $window, User, $location, $anchorScroll) {

    $scope.isUserLoggedIn = false;
    updateLoginStatus();

    $scope.scrollTo = function(id){

        $location.hash(id);
        $anchorScroll();
    };

    function updateLoginStatus(){

        $scope.isUserLoggedIn = User.isUserLoggedIn();
        $scope.isUserAdmin = User.isUserAdmin();
        $scope.isUserFellow = User.isUserFellow();
        $scope.isUserCompany = User.isUserCompany();
    }

    //
    //
    // login stuff used to be here, we left the event listener here b/c it works here
    //
    //
    
    $scope.$on('loginStatusChanged', updateLoginStatus);

    $scope.logoutUser = function(){

        User.ClearCredentials();

        $scope.isUserLoggedIn = false;
        $scope.isUserAdmin = false;
        $scope.isUserFellow = false;
        $scope.isUserCompany = false;

        $window.location.reload();
    };
}
    //

function LoginModalInstanceController ($scope, $modalInstance, User) {

    // save this through a refresh
    $scope.loginForm = {

        email: "",
        password: "",
        errors: []
    };

    $scope.login = function(loginForm) {

        $scope.loginForm.errors = [];

        User.login(loginForm).success(function( data ){

            if( data.success ){

                var user = data.user;

                $modalInstance.close();

                User.SetCredentials( user.id, user.email, user.userType );
            }
            else{

                $scope.loginForm.errors.push( "Invalid user credentials" );
            }

        }).error( function(error){

            $scope.loginForm.errors.push( "Invalid user credentials" );
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}


run.$inject = ['$http', 'User', 'CONFIG'];
function run($http, User, CONFIG ){



}


/**
 * Helper Functions
 **/

var HFHelpers = HFHelpers || {};

HFHelpers.helpers = {

    slugify: function(str) {
        
        return str.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    },

    paragraphize: function( str ) {

        if( typeof str !== 'string' ) return '';

        var parts = str.split( "\n" );
        return ( parts.length > 0 ? '<p>' + parts.join('</p><p>') + '</p>' : '' );
    }
};

app.filter("sanitize", ['$sce', function($sce) {

    return function(htmlCode){

        return $sce.trustAsHtml(htmlCode);
    };
}]);

app.filter('propsFilter', function() {

    return function(items, props) {

        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
