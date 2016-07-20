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
    .when('/fellows/:fellow_id/:fellow_name', {
        controller: 'FellowController',
        templateUrl: 'source/app/fellows/fellow.html',
        resolve: { loggedIn: checkLoggedin }
    })
    .when('/companies', {
        controller: 'CompaniesController',
        templateUrl: 'source/app/companies/companies.html',
        resolve: { loggedIn: checkLoggedin }
    })
    .when('/companies/:company_id/:company_name', {
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

    $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'source/app/profile/partials/login-page.html',
            controller: 'LoginModalInstanceController',
            size: ''
        });

        modalInstance.result.then(function(){

            updateLoginStatus();
        });
    };

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
/**
 * A place to put app wide config stuff
 *
 */
angular.module('app.config', [])
    .constant('CONFIG', {
        'APP_NAME': 'Hacker Fellow Portal',
        'APP_VERSION': '1.0',
        'SERVICE_URL': ''
    });


//var rootUrl = 'https://quiet-cove-6830.herokuapp.com';
// var rootUrl = "https://boiling-springs-7523.herokuapp.com";
/**
 * alert module
 */

(function () {
    'use strict';

    angular
        .module('app.alert', [
            'app.alert.controllers',
            'app.alert.services'
        ]);

    //declare the controllers module
    angular
        .module('app.alert.controllers', []);

    //declare the services module
    angular
        .module('app.alert.services', []);


})();

/**
 * companies module
 */

(function () {
  'use strict';

  angular
    .module('app.companies', [
        'app.companies.controllers',
        'app.companies.services',
        'app.companies.directives'
        ]);

  //declare the controllers module
  angular
    .module('app.companies.controllers', []);

  //declare the services module
  angular
    .module('app.companies.services', []);

  // declare the directives module
  angular
    .module('app.companies.directives', []);

})();

/**
 * fellows module
 */

(function () {
  'use strict';

  angular
    .module('app.fellows', [
        'app.fellows.controllers',
        'app.fellows.services',
        'app.fellows.directives'
        ]);

  //declare the controllers module
  angular
    .module('app.fellows.controllers', []);

  //declare the services module
  angular
    .module('app.fellows.services', []);

  //declare the directives module
  angular
    .module('app.fellows.directives', []);


})();

/**
 * home module
 */

(function () {
  'use strict';

  angular
    .module('app.home', [
        'app.home.controllers',
        //'app.home.services'
        ]);

  //declare the controllers module
  angular
    .module('app.home.controllers', []);

  //declare the directives module
  angular
    .module('app.home.directives', []);
    //how about this
})();

/**
 * tags module
 */

(function () {
    'use strict';

    angular
        .module('app.tags', [

            'app.tags.controllers',
            'app.tags.services'
        ]);

    //declare the services module
    angular
        .module('app.tags.services', []);


    //declare the controllers module
    angular
        .module('app.tags.controllers', []);



})();

/**
 * profile module
 */

 (function () {
  'use strict';

      angular
          .module('app.profile', [
              'app.profile.controllers',
              'app.profile.services',
              'app.fellows.services',
              'app.companies.services'
            ]);

      //declare the controllers module
      angular
        .module('app.profile.controllers', []);

     //declare the services module
     angular
         .module('app.profile.services', []);

})();

/**
 * votes module
 */

(function () {
  'use strict';

    angular
        .module('app.votes', [

            'app.votes.controllers',
            'app.votes.services'
        ]);

    //declare the services module
    angular
        .module('app.votes.services', []);


    //declare the controllers module
    angular
        .module('app.votes.controllers', []);



})();

/**
 * AlertController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.alert.controllers')
        .controller('AlertController', AlertController);

    AlertController.$inject = ['$scope', 'Alert'];

    /**
     * @namespace FellowsController
     */
    function AlertController( $scope, Alert ) {

        activate();

        function activate() {
            //console.log('activated fellows controller!');
        }

        $scope.alert = Alert.alert;

        // Close alert window
        $scope.closeAlert = function(){

            Alert.closeAlert();
        };
    }


})();

/**
 * Alert
 * @namespace app.alert.services
 */
(function () {
    'use strict';

    angular
        .module('app.alert.services')
        .service('Alert', Alert);

    Alert.$inject = ['$timeout'];



    /**
     * @namespace Alert
     */
    function Alert( $timeout ) {


        return {
            alert: {
                message: '',
                type: 'info',
                show: false
            },
            showAlert: function(newMessage, newType) {

                if( Array.isArray( newMessage ) )
                {
                    this.alert.message = newMessage.join( '<br />' );
                }
                else {

                    this.alert.message = newMessage;
                }

                this.alert.type = newType;
                this.alert.show = true;

                // I think this is ok?
                // For some reason I wanted the alert to auto clear and couldn't figure a
                // better way to have a timeout automatically close the alert. I feel like
                // this is some sort of scoping weirdness going on here, but it works and I
                // am tired, so it is getting committed ;-p
                var alert = this.alert;
                $timeout( function(){ alert.show = false; },  5000 );
            },
            closeAlert: function() {

                this.alert.message = '';
                this.alert.type = 'info';
                this.alert.show = false;
            }
        };

    }

})();

/**
 * CompaniesController
 * @namespace app.companies.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.companies.controllers')
        .controller('CompaniesController', CompaniesController);

    CompaniesController.$inject = ['$scope', '$modal', 'Companies'];

    /**
     * @namespace CompaniesController
     */
    function CompaniesController($scope, $modal, Companies) {

        activate();

        function activate() {
            //console.log('activated companies controller!');
        }

        Companies.all().success(function (companies) {

            $scope.companies = companies;
        });

        $scope.helpers = HFHelpers.helpers;

        $scope.openModal = function (company) {

            $scope.company = company;

            var modalInstance = $modal.open({

                templateUrl: 'source/app/companies/partials/company_detail_view.html',
                controller: 'CompaniesModalInstanceController',
                size: 'lg',
                resolve: {
                    company: function () {
                        return company;
                    }
                }

            });

        };

    }

    /**
     * Companies Modal Instance Controller
     * @namespace app.fellows.controllers
     */

    angular
        .module('app.companies.controllers')
        .controller('CompaniesModalInstanceController', CompaniesModalInstanceController);

    CompaniesModalInstanceController.$inject = ['$scope', '$modalInstance',
        'company', 'Votes', 'User'];

    function CompaniesModalInstanceController($scope, $modalInstance, company, Votes, User) {

        $scope.company = company;

        $scope.ok = function () {
            $modalInstance.close($scope.company);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    }

})();

/**
 * CompaniesController
 * @namespace app.companies.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.companies.controllers')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = [ '$routeParams', '$scope', '$timeout', 'Companies', 'User', 'Votes', 'Alert'];

    /**
     * @namespace CompaniesController
     */
    function CompanyController( $routeParams, $scope, $timeout, Companies, User, Votes, Alert) {

        activate();

        function activate() {
            //console.log('activated companies controller!');
        }

        $scope.helpers = HFHelpers.helpers;
        
        $scope.votesFor = [];
        $scope.votesCast = [];
        $scope.currentUser = User.getCurrentUser();

        Companies.get( $routeParams.company_id ).success(function (company) {

            $scope.company = company;

            User.getVotes( company.user_id ).success( function( votes ){

                $scope.votesFor = votes.votesFor;
                $scope.votesCast = votes.votesCast;
            });
        });

        $scope.currentUserVoted = function currentUserVoted(){

            for( var i = 0; i < $scope.votesFor.length; i++ ){

                var element = $scope.votesFor[i];
                if( element.id == $scope.currentUser.id ) return true;
            }
            return false;
        };

        $scope.isFellow = function(){

            return ( $scope.currentUser.userType === "Fellow");
        };

        $scope.vote = function vote(company) {


            if( $scope.isFellow() ) {

                $scope.loading = true;

                return Votes.create($scope.currentUser.id, company.user_id)
                    .success(function (vote) {

                        $timeout(function () {

                            $scope.loading = false;
                            $scope.done = true;

                        }, 1500);

                        return vote;
                    })
                    .catch(function (err) {

                        Alert.showAlert( err.data, "info" );

                        $scope.loading = false;
                    });
            }
        };

    }

})();

(function() {
    'use strict';

    angular
        .module('app.companies.directives')
        .directive('companyCard', companyCard);


    function companyCard() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            templateUrl: '/source/app/companies/partials/company_card.html'/*,
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                });
            }*/
        };
    }

})();
/**
* Companies
* @namespace app.companies.services
*/
(function () {
  'use strict';

  angular
    .module('app.companies.services')
    .service('Companies', Companies);

  Companies.$inject = ['$http', 'Upload', 'CONFIG'];

  /**
  * @namespace Companies
  */
  function Companies($http, Upload, CONFIG) {

    var rootUrl = CONFIG.SERVICE_URL;

    return {
      all: all,
      allWithUser: allWithUser,
      get: get,
      getByUserId: getByUserId,
      create: create,
      update: update,
      destroy: destroy
    };

    ////////////////////

    /**
     * @name all
     * @desc get all the companies
     */
    function all() {
      return $http.get(rootUrl + '/api/v1/companies/');
    }

    /**
     * @name all
     * @desc get all the companies with their user account info
     */
    function allWithUser() {
      return $http.get(rootUrl + '/api/v1/companies/users');
    }

    /**
     * @name get
     * @desc get just one company
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/companies/' + parseInt(id) );
    }

    /**
    * @name getByUserId
    * @desc get just one company by user id
    */
    function getByUserId(user_id) {
      return $http.get(rootUrl + '/api/v1/companies/user_id/' + parseInt(user_id) );
    }


    /**
     * @name create
     * @desc creeate a new company record
     */
    function create(company) {
      return $http.post(rootUrl + '/api/v1/companies/', company);
    }

    /**
     * @name update
     * @desc updates a company record
     */
    function update(company) {

      //return Upload.upload({
      //  url: rootUrl + '/api/v1/companies/' + company.id,
      //  fields: company,
      //  file: company.file,
      //  method: 'PUT'
      //
      //});

      return $http.put(rootUrl + '/api/v1/companies/' + company.id, company);
    }

    /**
     * @name destroy
     * @desc destroy a company record
     */
    function destroy(id) {
      return $http.delete(rootUrl + '/api/v1/companies/' + id);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('app.fellows.directives')
    .directive('fellowCard', fellowCard);

  //ng-fellow-card
 function fellowCard() {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: '/source/app/fellows/partials/fellow_card.html'/*,
       link: function(scope, elem, attrs) {
        elem.bind('click', function() {
        });
       } */
    };
  }
})();

/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.controllers')
        .controller('FellowController', FellowController);

    FellowController.$inject = ['$routeParams', '$scope', '$timeout', 'Fellows', 'User', 'Votes'];

    /**
     * @namespace FellowsController
     */
    function FellowController($routeParams, $scope, $timeout, Fellows, User, Votes) {

        activate();

        function activate() {
            //console.log('activated fellows controller!');
        }

        $scope.helpers = HFHelpers.helpers;

        $scope.votesFor = [];
        $scope.votesCast = [];
        $scope.currentUser = User.getCurrentUser();

        Fellows.get( $routeParams.fellow_id ).success(function (fellow) {

            $scope.fellow = fellow;

            User.getVotes( fellow.user_id ).success( function( votes ){

                $scope.votesFor = votes.votesFor;
                $scope.votesCast = votes.votesCast;
            });
        });

        $scope.currentUserVoted = function currentUserVoted(){

            for( var i = 0; i < $scope.votesFor.length; i++ ){

                var element = $scope.votesFor[i];
                if( element.id == $scope.currentUser.id ) return true;
            }
            return false;
        };

        $scope.isCompany = function(){

            return ( $scope.currentUser.userType === "Company" );
        };

        $scope.vote = function vote(fellow) {

            if ( $scope.isCompany() ) {

                $scope.loading = true;

                Votes.create($scope.currentUser.id, fellow.user_id)
                    .success(function (vote) {

                        console.log( vote );

                        console.log("success");
                        return vote;
                    })
                    .catch(function (err) {

                        console.log("Error: "+err);
                    })
                    .finally(function () {

                        $timeout(function () {

                            $scope.loading = false;
                            $scope.done = true;

                        }, 1500);

                    });
            }
        };

    }


})();

/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.controllers')
        .controller('FellowsController', FellowsController);

    FellowsController.$inject = ['$scope', '$modal', 'Fellows'];

    /**
     * @namespace FellowsController
     */
    function FellowsController($scope, $modal, Fellows) {

        activate();

        function activate() {
            //console.log('activated fellows controller!');
        }

        $scope.helpers = HFHelpers.helpers;

        Fellows.all().success(function (fellows) {

            $scope.fellows = fellows;
        });

        $scope.openModal = function (fellow) {

            $scope.fellow = fellow;

            var modalInstance = $modal.open({

                templateUrl: 'source/app/fellows/partials/fellow_detail_view.html',
                controller: 'FellowsModalInstanceController',
                size: 'lg',
                resolve: {
                    fellow: function () {
                        return fellow;
                    }
                }

            });

        };


    }

    /**
     * Fellows Modal Instance Controller
     * @namespace app.fellows.controllers
     */
    angular
        .module('app.fellows.controllers')
        .controller('FellowsModalInstanceController', FellowsModalInstanceController);

    FellowsModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow',
        'Votes', 'User', '$timeout'];

    function FellowsModalInstanceController($scope, $modalInstance, fellow, Votes, User) {

        $scope.fellow = fellow;

        //console.log(fellow);

        $scope.ok = function ok() {
            $modalInstance.close($scope.fellow);
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };

    }

})();

/**
* HomeController
* @namespace app.home.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.home.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Fellows'];

  /**
  * @namespace HomeController
  */
  function HomeController($scope, Fellows) {

    var vm = this;

    //Fellows.all().success(function(fellows){
    //
    //  $scope.fellows = fellows;
    //});

    activate();

    function activate() {
      //console.log('activated home controller!');
      //Home.all();
    }
  }
})();

/**
 * Fellows
 * @namespace app.fellows.services
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.services')
        .service('Fellows', Fellows);

    Fellows.$inject = ['$http', 'Upload', 'CONFIG'];


    /**
     * @namespace Fellows
     * @returns {Service}
     */
    function Fellows($http, Upload, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {
            all: all,
            allWithUser: allWithUser,
            get: get,
            getByUserId: getByUserId,
            create: create,
            update: update,
            destroy: destroy
        };

        ////////////////////

        /**
         * @name all
         * @desc get all the fellows
         */
        function all() {

            return $http.get(rootUrl + '/api/v1/fellows');
        }

        /**
         * @name all
         * @desc get all the fellows with their user account info
         */
        function allWithUser() {

            return $http.get(rootUrl + '/api/v1/fellows/users');
        }

        /**
         * @name get
         * @desc get one fellow
         */
        function get(id) {

            return $http.get(rootUrl + '/api/v1/fellows/' + id);
        }

        /**
         * @name getByUserId
         * @desc get one fellow by user_id
         */
        function getByUserId(user_id) {

            return $http.get(rootUrl + '/api/v1/fellows/user_id/' + user_id);
        }


        /**
         * @name create
         * @desc creeate a new fellow record
         */
        function create(fellow) {
            return $http.post(rootUrl + '/api/v1/fellows/', fellow);
        }

        /**
         * @name update
         * @desc updates a fellow record
         */
        function update(fellow) {

            //return Upload.upload({
            //    url: rootUrl + '/api/v1/fellows/' + fellow.id,
            //    fields: fellow,
            //    file: fellow.file,
            //    method: 'PUT'
            //
            //});

            return $http.put(rootUrl + '/api/v1/fellows/' + fellow.id, fellow);
        }

        /**
         * @name destroy
         * @desc destroy a fellow record
         */
        function destroy(id) {
            return $http.delete(rootUrl + '/api/v1/fellows/' + id);
        }

    }

})();

/**
 * TagsController
 * @namespace app.tags.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.tags.controllers' )
        .controller( 'TagsController', TagsController );

    TagsController.$inject = [ '$scope', '$location', '$modal', 'User', 'Tags' ];

    /**
     * @namespace TagsController
     */
    function TagsController( $scope, $location, $modal, User, Tags ) {

        var vm = this;

        $scope.newTag = '';

        if( User.isUserAdmin() ) {

            Tags.all().success( function( tags ){

                $scope.tags = tags;
            });

        }
        else{

            $location.path("/");
        }

        $scope.addTag = function( newTag ){

            Tags.create( newTag ).then( function( response ){

                var newTag = response.data;

                $scope.newTag = '';
                $scope.tags.unshift( newTag );
            });
        };

        $scope.editTag = function( tag ){

            // show modal with tag
            var modalInstance = $modal.open({

                templateUrl: 'source/app/tags/partials/edit-tag-form.html',
                controller: 'EditTagsModalInstanceController',
                size: 'md',
                resolve: {
                    tag: function() {

                        return tag;
                    }
                }

            });

            // show success/failure
            return false;
        };

        $scope.removeTag = function( tag ){

            var c = confirm( "Are you sure you want to delete " + tag.name + "?");

            if( c ){

                Tags.destroy( tag.id).then( function(){

                    // now update available tags
                    Tags.all().success( function( tags ){

                        $scope.tags = tags;
                    });
                });
            }
        };

    }

    angular
        .module('app.tags.controllers')
        .controller('EditTagsModalInstanceController', EditTagsModalInstanceController);

    EditTagsModalInstanceController.$inject = ['$scope', '$modalInstance', 'tag', 'Tags' ];
    function EditTagsModalInstanceController ($scope, $modalInstance, tag, Tags) {

        $scope.tag = tag;

        $scope.ok = function ok() {

            Tags.update( $scope.tag ).then(function(newTag){

                $modalInstance.close( newTag );

            },
            function(){

                // error callback
                $scope.errors = [ "There was an error updating the tag" ];
            });

        };

        $scope.cancel = function cancel() {

            $modalInstance.dismiss('cancel');
        };
    }

})();

/**
 * Votes
 * @namespace app.tags.services
 */


(function () {
    'use strict';

    angular
        .module('app.tags.services')
        .service('Tags', Tags);

    Tags.$inject = ['$http', 'CONFIG'];


    /**
     * @namespace Tags
     */
    function Tags($http, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {

            all: all,
            get: get,
            update: update,
            create: create,
            destroy: destroy
        };

        /**
         * @name get all tags
         * @desc get all possible tags
         */
        function all(){

            return $http.get( rootUrl + '/api/v1/tags' );
        }

        /**
         * @name get a tag
         * @desc get a tag by tag_id
         */
        function get( tag_id ){

            return $http.get(rootUrl + '/api/v1/tags/' + tag_id );
        }


        /**
         * @name create
         * @desc create a tag by name
         */
        function create( name ) {


            return $http.post(rootUrl + '/api/v1/tags/', {

                name: name
            });
        }

        /**
         * @name update
         * @desc update a tag
         */
        function update( tag ) {

            return $http.put(rootUrl + '/api/v1/tags/' + tag.id, tag);
        }

        /**
         * @name destroy
         * @desc destroy a vote record
         */
        function destroy(id) {

            return $http.delete(rootUrl + '/api/v1/tags/' + id);
        }
    }


})();


/**
* AdminProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('AdminProfileController', AdminProfileController);

    AdminProfileController.$inject = ['$scope', '$location', '$modal', '$window', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $location, $modal, $window, User, Fellows, Companies) {

        // TODO - Probably can handle this in routes or with middleware or some kind
        if( !User.isUserLoggedIn() ) {

            $location.path("/");
            return;
        }

        // Make sure current user is an Admin
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Admin" ){

            $location.path("/profile");
            return;
        }

        $scope.fellows = [];
        $scope.companies = [];
        $scope.userListLoad = function() {

            if( $scope.fellows.length === 0 ) {

                Fellows.allWithUser().success(function (fellows) {

                    $scope.fellows = fellows;

                });
            }

            if( $scope.companies.length === 0 ) {

                Companies.allWithUser().success(function (companies) {

                    $scope.companies = companies;
                });
            }
        };
        $scope.userListLoad();


        $scope.fellowVotes = function( fellow ){

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/fellow-votes.html',
                controller: 'FellowVotesModalInstanceController',
                size: 'md',
                resolve: {

                    fellow: function(){
                        return fellow;
                    }
                }

            });

            // show success/failure
            return false;

        };

        $scope.companyVotes = function( company ){

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/company-votes.html',
                controller: 'CompanyVotesModalInstanceController',
                size: 'md',
                resolve: {

                    company: function(){
                        return company;
                    }
                }

            });

            // show success/failure
            return false;

        };

        $scope.editFellow = function(fellow){

            // send user data to service

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/edit-fellow-form.html',
                controller: 'EditFellowModalInstanceController',
                size: 'md',
                resolve: {
                    fellow: function() {

                        return fellow;
                    }
                }

            });

            // show success/failure
            return false;
        };

        $scope.editCompany= function(company){

            // send user data to service

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/edit-company-form.html',
                controller: 'EditCompanyModalInstanceController',
                size: 'md',
                resolve: {
                    company: function(){
                        return company;
                    }
                }

            });

            // show success/failure
            return false;
        };


        // @TODO - Implement Later
        $scope.archiveFellow = function(user){

            console.log("Archive User: "+user.id);
            // send user data to service

            // show success/failure
            return false;
        };


        /* Create User */
        $scope.createUser = function (user) {

            var modalInstance = $modal.open({
                templateUrl: 'source/app/profile/partials/admin/new-user-form.html',
                controller: 'CreateUserModalInstanceController',
                size: 'md',
                resolve: {
                    
                }
            });

            modalInstance.result.then( function( response ) {

                var newItem = response.data;

                if( newItem.user.userType === 'Fellow' )
                {
                    $scope.fellows.unshift( newItem );
                }
                else if( newItem.user.userType === 'Company' )
                {
                    $scope.companies.unshift( newItem );
                }

            });
        };

        $scope.removeFellow = function( fellow ){

            var c = confirm( "Are you sure you want to delete " + fellow.first_name + " " + fellow.last_name + "?");

            if( c ){

                // remove fellow
                Fellows.destroy( fellow.id ).then( function(){

                    // now remove user
                    User.destroy( fellow.user_id).then( function(){

                        // reload users
                        $window.location.reload();
                    });
                });
            }
        };

        $scope.removeCompany = function( company ){

            var c = confirm( "Are you sure you want to delete " + company.name + "?");

            if( c ){

                // remove company
                Companies.destroy( company.id ).then( function(){

                    // now remove user
                    User.destroy( company.user_id).then( function(){

                        // reload users
                        $window.location.reload();
                    });
                });
            }
        };
    }


    /**
     * Modal Instance Controllers
     * @namespace app.fellows.controllers
     */

    angular
        .module('app.fellows.controllers')
        .controller('EditFellowModalInstanceController', EditFellowModalInstanceController)
        .controller('EditCompanyModalInstanceController', EditCompanyModalInstanceController)
        .controller('CreateUserModalInstanceController', CreateUserModalInstanceController)
        .controller('CompanyVotesModalInstanceController', CompanyVotesModalInstanceController)
        .controller('FellowVotesModalInstanceController', FellowVotesModalInstanceController);

    EditFellowModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow', 'User', 'Fellows' ];
    function EditFellowModalInstanceController ($scope, $modalInstance, fellow, User, Fellows) {

        $scope.user = fellow.user;
        $scope.fellow = fellow;

        $scope.init = function(){

            $("[name='enabled']").bootstrapSwitch({

                onText: "Visible",
                offText: "Hidden",
                state: $scope.fellow.enabled,
                onSwitchChange: function (event, state) {

                    $scope.fellow.enabled = ( state ) ? 1 : 0;
                }
            });
        };

        $scope.ok = function ok() {

            User.update($scope.user).then(function(newUser){

                // success callback
                $scope.user = newUser;

                // user is updated, so now update fellow
                Fellows.update( $scope.fellow ).then(function(newFellow){

                    // success callback
                    $scope.fellow = newFellow;

                    $modalInstance.close();
                },
                function(){

                    // error callback
                    $scope.errors = [ "There was an error updating the fellow" ];
                });

            },
            function(){

                // error callback
                $scope.errors = [ "There was an error updating the fellow" ];
            });

        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };
    }

    EditCompanyModalInstanceController.$inject = ['$scope', '$modalInstance', 'company', 'User', 'Companies' ];
    function EditCompanyModalInstanceController ($scope, $modalInstance, company, User, Companies) {

        $scope.user = company.user;
        $scope.company = company;

        $scope.init = function(){

            $("[name='enabled']").bootstrapSwitch({

                onText: "Visible",
                offText: "Hidden",
                state: $scope.company.enabled,
                onSwitchChange: function (event, state) {

                    $scope.company.enabled = ( state ) ? 1 : 0;
                }
            });
        };

        $scope.ok = function ok() {

            User.update($scope.user).then( function( newUser ){

                // success callback
                $scope.user = newUser;

                Companies.update($scope.company).then( function( newCompany ){

                    // success callback
                    $scope.company = newCompany;

                    $modalInstance.close();

                }, function(){

                    // error callback
                    $scope.errors = [ "There was an error updating the company" ];
                });

            }, function(){

                // error callback
                $scope.errors = [ "There was an error updating the company" ];
            });

            $modalInstance.close($scope.user);
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };
    }

    FellowVotesModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow' ];
    function FellowVotesModalInstanceController( $scope, $modalInstance, fellow ){

        $scope.user = fellow.user;
        $scope.fellow = fellow;

        // Check fellow VotesFor to see if a company voted for a fellow
        $scope.companyVotedForFellow = function( company_user_id ){

            for( var i = 0; i < fellow.user.VotesFor.length; i++ )
            {
                var vote = fellow.user.VotesFor[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        // Check fellow VotesCast to see if they voted for a company
        $scope.fellowVotedForCompany = function( company_user_id ){

            for( var i = 0; i < fellow.user.VotesCast.length; i++ )
            {
                var vote = fellow.user.VotesCast[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        $scope.ok = function ok() {

            $modalInstance.close();
        };
    }

    CompanyVotesModalInstanceController.$inject = ['$scope', '$modalInstance', 'company' ];
    function CompanyVotesModalInstanceController( $scope, $modalInstance, company ){

        $scope.company = company;

        // Check fellow VotesCast to see if they voted for a company
        $scope.fellowVotedForCompany = function( company_user_id ){

            for( var i = 0; i < company.user.VotesFor.length; i++ )
            {
                var vote = company.user.VotesFor[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        // Check fellow VotesFor to see if a company voted for a fellow
        $scope.companyVotedForFellow = function( company_user_id ){

            for( var i = 0; i < company.user.VotesCast.length; i++ )
            {
                var vote = company.user.VotesCast[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        $scope.ok = function ok() {

            $modalInstance.close();
        };
    }

    CreateUserModalInstanceController.$inject = ['$scope', '$modalInstance', 'User', 'Fellows', 'Companies' ];
    function CreateUserModalInstanceController ($scope, $modalInstance, User, Fellows, Companies) {

        $scope.verify_password = "";

        $scope.create = function (user){

            $scope.errors = [];

            // Form is being validated by angular, but leaving this just in case
            if( typeof user  === "undefined"){

                $scope.errors.push( "Add some data first" );

            }
            else {

                if( typeof user.email === "undefined" ) {

                    $scope.errors.push( "Enter an email" );
                }

                if( typeof user.password === "undefined" ) {

                    $scope.errors.push( "Enter a password" );
                }

                if( typeof user.userType === "undefined" ) {

                    $scope.errors.push( "Choose a user type" );
                }

                if( user.password !== $scope.verify_password ){

                    $scope.errors.push( "Passwords do not match" );
                }
            }


            if( $scope.errors.length === 0 ){

                // send user to API via Service
                User.create(user).then( function(response) {

                    // create user success callback
                    //console.log(response);

                    console.log( user );

                    var user_id = response.data.id;

                    if( user.userType === "Fellow" ){

                        var fellow_post = {

                            first_name: "",
                            last_name: "",
                            user_id: user_id
                        };
                        Fellows.create(fellow_post).then( function( fellow ){

                            // create fellow success callback
                            console.log( fellow );
                            $modalInstance.close( fellow );

                        }, function( response ){

                            // create fellow error callback
                            console.log( response );
                            $scope.errors.push( response.data.error );
                        });
                    }
                    else if( user.userType === "Company" ){

                        var company_post = {

                            name: "",
                            user_id: user_id
                        };
                        Companies.create(company_post).then( function( company ){

                            // create company success callback
                            $modalInstance.close( company );

                        }, function( response ){

                            // create fellow error callback
                            console.log( response );
                            $scope.errors.push( response.data.error );
                        });
                    }

                }, function( response ){

                    // create user error callback

                    console.log( response );
                    $scope.errors.push( response.data.error );
                });
            }
        };
        
        $scope.cancel = function cancel() {

            $modalInstance.dismiss('cancel');
        };


    }

})();

/**
* CompanyProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('CompanyProfileController', CompanyProfileController);

    CompanyProfileController.$inject = ['$scope', '$location', 'Companies', 'User', 'Tags', 'Alert'];

    /**
    * @namespace CompanyProfileController
    */
    function CompanyProfileController($scope, $location, Companies, User, Tags, Alert) {
        var vm = this;

        // Probably can handle this in the routes or with middleware of some kind
        if( !User.isUserLoggedIn() ) {

            //$location.path("/");
            return;
        }

        $scope.tagTransform = function (newTag) {

            var tag = {

                name: newTag
            };

            return tag;
        };

        // Make sure current user is a Company
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Company" ){

            $location.path("/profile");
            return;
        }

        $scope.tags = [];
        function getCompany() {

            var currentUser = User.getCurrentUser();

            Companies.getByUserId(currentUser.id).success(function (company) {

                $scope.company = company;
                console.log( $scope.company );

                $("[name='enabled']").bootstrapSwitch({

                    onText: "Visible",
                    offText: "Hidden",
                    state: company.enabled,
                    onSwitchChange: function (event, state) {

                        company.enabled = ( state ) ? 1 : 0;
                    }
                });

                Tags.all().success(function (tags) {

                    $scope.tags = tags;
                });
            });
        }
        getCompany();
        //$scope.$on( 'loginStatusChanged',  getCompany);

        activate();

        function activate() {

            //console.log('activated profile controller!');
            //Profile.all();
        }

        $scope.update = function(company) {

            //console.log( company.tags );

            var errors = [];
            if( typeof company.bio != 'undefined' && company.bio !== null )
            {
                if (company.bio.length > 350) {
                    angular.element("#bio").addClass('error');
                    errors.push("The bio field can only be 350 characters maximum");
                }
                else {

                    angular.element("#bio").removeClass('error');
                }
            }

            if( errors.length  === 0 )
            {
                // send companies info to API via Service
                Companies.update(company).success(function (newCompanyData) {

                    // ** Trigger Success message here
                    company = newCompanyData;

                    // hide update message
                    $("#profile-photo").find(".upload-status").hide();

                    Alert.showAlert('Your profile has been updated', 'success');
                });
            }
            else
            {
                Alert.showAlert( errors, 'error' );
            }
        };

        /** S3 File uploading **/
        $scope.getS3Key = function(){


            var files = document.getElementById("file_input").files;
            var file = files[0];

            if(file === null){

                alert("No file selected.");
            }
            else{

                get_signed_request(file);
            }
        };

        function get_signed_request(file){

            var xhr = new XMLHttpRequest();

            // Trying to prevent naming collisions by appending the unique user_id to file name
            // -- remove and save the extension - should be the last part
            // -- want to make sure we allow . in the filename outside of extension
            var pieces = file.name.split(".");
            var extension = pieces.pop();
            var file_name = pieces.join(".") + "-" + $scope.company.user_id + "." + extension;

            xhr.open("GET", "/sign_s3?file_name="+file_name+"&file_type="+file.type);
            xhr.onreadystatechange = function(){

                if(xhr.readyState === 4){

                    if(xhr.status === 200){

                        var response = JSON.parse(xhr.responseText);
                        upload_file(file, response.signed_request, response.url);
                    }
                    else{

                        alert("Could not get signed URL.");
                    }
                }
            };
            xhr.send();
        }

        function upload_file(file, signed_request, url){

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", signed_request);
            xhr.setRequestHeader('x-amz-acl', 'public-read');

            $("#profile-photo").find(".uploading").show();

            xhr.onload = function() {

                if (xhr.status === 200) {

                    //  Set image preview
                    document.getElementById("preview").src = url;

                    // Update company model
                    $scope.company.image_url = url;

                    // Angular is weird when updating images that started with an empty string
                    // removing ng-hide to force update
                    $("#preview").removeClass('ng-hide');
                    $(".user-photo").find(".placeholder").hide();
                    $("#profile-photo").find(".upload-status").show();
                    $("#profile-photo").find(".uploading").hide();
                }
            };

            xhr.onerror = function() {

                alert("Could not upload file.");
            };

            xhr.send(file);
        }

    }

})();

/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope', '$location', 'Fellows', 'Tags', 'User', 'S3', 'Alert' ];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, Fellows, Tags, User, S3, Alert ) {

        var vm = this;

        // Probably can handle this in the routes or with middleware of some kind
        if( !User.isUserLoggedIn() ) {

            //$location.path("/");
            return;
        }

        $scope.tagTransform = function (newTag) {

            var tag = {

                name: newTag
            };

            return tag;
        };

        // Make sure current user is a Fellow
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Fellow" ){

            $location.path("/profile");
            return;
        }

        $scope.tags = [];

        function getFellow() {

            console.log( "Get Fellow" );

            var currentUser = User.getCurrentUser();

            Fellows.getByUserId(currentUser.id).success(function (fellow) {

                $scope.fellow = fellow;

                $("[name='enabled']").bootstrapSwitch({

                    onText: "Visible",
                    offText: "Hidden",
                    state: fellow.enabled,
                    onSwitchChange: function (event, state) {

                        fellow.enabled = ( state ) ? 1 : 0;
                    }
                });

                Tags.all().success(function (tags) {

                    $scope.tags = tags;
                });

            });
        }
        getFellow();

        activate();

        function activate() {
            //console.log('activated profile controller!');
            //Profile.all();
        }


        $scope.update = function(fellow, file) {

            // TODO - there is a better way to do this error checking
            var errors = [];
            if( fellow.bio.length > 350 )
            {
                angular.element( "#bio" ).addClass( 'error' );
                errors.push( "The bio field can only be 350 characters maximum");
            }
            else{

                angular.element( "#bio" ).removeClass( 'error' );
            }

            if( fellow.interests.length > 350 )
            {
                angular.element( "#interests" ).addClass( 'error' );
                errors.push( "The interesting things you have coded field can only be 350 characters maximum");
            }
            else{

                angular.element( "#interests" ).removeClass( 'error' );
            }

            if( fellow.description.length > 25 )
            {
                angular.element( "#description" ).addClass( 'error' );
                errors.push( "The phrase field can only be 25 characters maximum");
            }
            else{

                angular.element( "#description" ).removeClass( 'error' );
            }

            if( fellow.answer.length > 250 )
            {
                angular.element( "#answer" ).addClass( 'error' );
                errors.push( "The answer field can only be 250 characters maximum");
            }
            else{

                angular.element( "#answer" ).removeClass( 'error' );
            }

            if( errors.length  === 0 )
            {
                // send fellows info to API via Service
                Fellows.update(fellow).success(function (newFellowData) {

                    // ** Trigger Success message here
                    fellow = newFellowData;

                    // hide update message
                    $("#profile-photo").find(".upload-status").hide();

                    Alert.showAlert('Your profile has been updated', 'success');
                });
            }
            else{

                Alert.showAlert( errors, 'error' );
            }
        };

        /** S3 File uploading **/
        $scope.getS3Key = function(){


            var files = document.getElementById("file_input").files;
            var file = files[0];

            if(file === null){

                alert("No file selected.");
            }
            else{

                get_signed_request(file);
            }
        };


        function get_signed_request(file){

            var xhr = new XMLHttpRequest();

            // Trying to prevent naming collisions by appending the unique user_id to file name
            // -- remove and save the extension - should be the last part
            // -- want to make sure we allow . in the filename outside of extension
            var pieces = file.name.split(".");
            var extension = pieces.pop();
            var file_name = pieces.join(".") + "-" + $scope.fellow.user_id + "." + extension;

            xhr.open("GET", "/sign_s3?file_name="+file_name+"&file_type="+file.type);
            xhr.onreadystatechange = function(){

                if(xhr.readyState === 4){

                    if(xhr.status === 200){

                        var response = JSON.parse(xhr.responseText);
                        upload_file(file, response.signed_request, response.url);
                    }
                    else{

                        alert("Could not get signed URL.");
                    }
                }
            };
            xhr.send();
        }

        function upload_file(file, signed_request, url){

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", signed_request);
            xhr.setRequestHeader('x-amz-acl', 'public-read');

            $("#profile-photo").find(".uploading").show();

            xhr.onload = function() {

                if (xhr.status === 200) {

                    //  Set image preview
                    document.getElementById("preview").src = url;

                    // Update fellow model
                    $scope.fellow.image_url = url;

                    // Angular is weird when updating images that started with an empty string
                    // removing ng-hide to force update
                    $("#preview").removeClass('ng-hide');
                    $(".user-photo").find(".placeholder").hide();
                    $("#profile-photo").find(".upload-status").show();
                    $("#profile-photo").find(".uploading").hide();
                }
            };

            xhr.onerror = function() {

                alert("Could not upload file.");
            };

            xhr.send(file);
        }
    }

})();
/**
* ProfileController
* @namespace app.profile.controllers
*/
(function () {
  'use strict';

  angular
  .module('app.profile.controllers')
  .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$location', 'User'];
  /**
  * @namespace ProfileController
  */
  function ProfileController($scope, $location, User) {

      var vm = this;

      if( User.isUserLoggedIn() ) {

          var currentUser = User.getCurrentUser();

          // redirect the user based on their type
          if (currentUser.userType === 'Admin') {
              //console.log("Like a boss");
              $location.path("/profile/admin");
          }
          else if (currentUser.userType === 'Fellow') {
              //console.log("Like a fella");
              $location.path("/profile/fellow");
          }
          else if (currentUser.userType === 'Company') {
              //console.log("Like a company");
              $location.path("/profile/company");
          }
      }
      else{

           $location.path("/");
      }

  }


})();

/**
 * S3
 * @namespace app.services
 */
(function () {
    'use strict';

    // @TODO -- Implement the S3 service


    angular
        .module('app.profile.services')
        .service('S3', S3);

    S3.$inject = ['$http', 'CONFIG'];

    /**
     * @namespace S3
     * @returns {Service}
     */
    function S3($http, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {

            getS3Key: getS3Key,
            uploadFile: uploadFile
        };

        ////////////////////

        // Get the image file and trigger request to S3
        function getS3Key( file, user_id ){

            if(file !== null){

                // Trying to prevent naming collisions by appending the unique user_id to file name
                // -- remove and save the extension - should be the last part
                // -- want to make sure we allow . in the filename outside of extension
                var pieces = file.name.split(".");
                var extension = pieces.pop();
                var file_name = user_id + "-" + pieces.join(".") + "." + extension;

                return $http({

                    method: 'GET',
                    url: "/sign_s3?file_name="+file_name+"&file_type="+file.type

                });
            }
        }

        // Actually upload the new file to S3
        // -- puts the new url in a hidden form element
        function uploadFile(file, signed_request, url){

            // ** THIS DOES NOT WORK **/

            return $http({

                method: 'PUT',
                url: signed_request,
                headers: {
                    'x-amz-acl': 'public-read'
                },
                data: file,
                contentType: file.type

            });

            //var xhr = new XMLHttpRequest();
            //xhr.open("PUT", signed_request);
            //xhr.setRequestHeader('x-amz-acl', 'public-read');
            //
            //xhr.onload = function() {
            //
            //    if (xhr.status === 200) {
            //
            //        return url;
            //    }
            //};
            //
            //xhr.onerror = function() {
            //
            //    alert("Could not upload file.");
            //};
            //
            //xhr.send(file);
        }
    }

})();

/**
 * Profile
 * @namespace app.profile.services
 */
(function () {
  'use strict';

  angular
    .module('app.profile.services')
    .factory('User', User);

  User.$inject = ['$rootScope', '$http', 'CONFIG'];

  /**
   * @namespace User
   * @returns {Service}
   */
  function User($rootScope, $http, CONFIG) {

      var rootUrl = CONFIG.SERVICE_URL;

      // Will hold info for the currently logged in user
      var currentUser = {};

      function getCurrentUser() {

          return currentUser;
      }

      function setCurrentUser(user) {

          currentUser = user;
      }

      function getVotes( user_id ){

          return $http.get(rootUrl + '/api/v1/users/' + user_id + '/votes' );
      }

      /**
       * @name login
       * @desc login a new user record
       */
      function login(user) {
          return $http.post(rootUrl + '/api/v1/users/login', user);
      }

      return {

          //all: all,
          //get: get,
          getVotes: getVotes,
          create: create,
          login: login,
          update: update,
          destroy: destroy,
          SetCredentials: SetCredentials,
          ClearCredentials: ClearCredentials,
          getCurrentUser: getCurrentUser,
          setCurrentUser: setCurrentUser,
          isUserLoggedIn: isUserLoggedIn,
          isUserAdmin: isUserAdmin,
          isUserFellow: isUserFellow,
          isUserCompany: isUserCompany
      };


      /**
       * @name all
       * @desc get all the users
       */
      //function all() {
      //
      //    return [];
      //
      //    //return $http.get(rootUrl + '/api/v1/companies/');
      //}

      /**
       * @name get
       * @desc get just one user
       */
      //function get(id) {
      //    return $http.get(rootUrl + '/api/v1/users/' + parseInt(id) );
      //}

      /**
       * @name create
       * @desc create a new user record
       */
      function create(user) {

          return $http.post(rootUrl + '/api/v1/users/create', user);
      }

      /**
       * @name update
       * @desc updatea a user record
       */
      function update(user) {

          return $http.put(rootUrl + '/api/v1/users/' + user.id, user);
      }

      /**
       * @name destroy
       * @desc destroy a user record
       */
      function destroy(id) {
          return $http.delete(rootUrl + rootUrl + '/api/v1/users/' + id);
      }

      function isUserLoggedIn(){

          if( Object.keys(currentUser).length > 0 ){

              return true;
          }
          else return false;
      }

      function isUserAdmin(){

          if( currentUser.userType === 'Admin' )
          {
              return true;
          }
          else return false;
      }

      function isUserFellow(){

          if( currentUser.userType === 'Fellow' )
          {
              return true;
          }
          else return false;
      }

      function isUserCompany(){

          if( currentUser.userType === 'Company' )
          {
              return true;
          }
          else return false;
      }

      function SetCredentials(id, username, userType) {

          var authdata = Base64.encode(id + ':' + username + ':' + userType);

          currentUser = {
              id: id,
              username: username,
              userType: userType,
              authdata: authdata
          };

          loginStatusChanged();
      }

      function ClearCredentials() {

          $http.get( rootUrl + '/api/v1/users/logout' ).then( function(){

              currentUser = {};
          });

          loginStatusChanged();
      }


      function loginStatusChanged() {

          $rootScope.$broadcast('loginStatusChanged');
      }

  }

  // Base64 encoding service used by AuthenticationService
  var Base64 = {

    keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
          this.keyStr.charAt(enc1) +
          this.keyStr.charAt(enc2) +
          this.keyStr.charAt(enc3) +
          this.keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = this.keyStr.indexOf(input.charAt(i++));
        enc2 = this.keyStr.indexOf(input.charAt(i++));
        enc3 = this.keyStr.indexOf(input.charAt(i++));
        enc4 = this.keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };

})();

/**
 * Votes
 * @namespace app.votes.services
 */


(function () {
    'use strict';

    angular
        .module('app.votes.services')
        .service('Votes', Votes);

    Votes.$inject = ['$http', 'CONFIG'];


    /**
     * @namespace Votes
     */
    function Votes($http, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {

            get: get,
            create: create,
            destroy: destroy
        };

        /**
         * @name get votes
         * @desc get the votes for a user
         */
        function get( voter_id ){

            return $http.get(rootUrl + '/api/v1/votes/' + voter_id );
        }


        /**
         * @name create
         * @desc cast a vote for a user
         */
        function create( voter_id, votee_id ) {

            //console.log( voter_id + " " + votee_id );

            return $http.post(rootUrl + '/api/v1/votes/', {

                voter_id: voter_id,
                votee_id: votee_id
            });
        }

        /**
         * @name destroy
         * @desc destroy a vote record
         */
        function destroy(id) {

            return $http.delete(rootUrl + '/api/v1/votes/' + id);
        }
    }


})();


/**
 * AdminVotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'AdminVotesController', AdminVotesController );

    AdminVotesController.$inject = [ '$scope', '$location', 'User', 'Votes' ];
    /**
     * @namespace VoteController
     */
    function AdminVotesController($scope, $location, User, Votes) {

        var vm = this;

        $scope.helpers = HFHelpers.helpers;

        if( User.isUserLoggedIn() ) {

        }
        else{

            $location.path("/");
        }



    }


})();

/**
 * CompanyVotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'CompanyVotesController', CompanyVotesController );

    CompanyVotesController.$inject = [ '$scope', '$location', 'User', 'Votes' ];
    /**
     * @namespace VoteController
     */
    function CompanyVotesController($scope, $location, User, Votes) {

        var vm = this;

        $scope.helpers = HFHelpers.helpers;

        if( User.isUserLoggedIn() ) {

            $scope.currentUser = User.getCurrentUser();

            Votes.get( $scope.currentUser.id ).success( function( votes ){

                $scope.votes = votes;
            });
        }
        else{

            $location.path("/");
        }

        $scope.removeVote = function( vote ){

            // be sure it wasn't an accidental click
            var c = confirm( "Are you sure you want to remove your vote?");
            if( !c ) return;

            Votes.destroy( vote.id ).then( function( response ){

                // remove vote from $scote.votes
                for( var i = 0; $scope.votes.length; i++ ){

                    var item = $scope.votes[i];

                    if( item.id === vote.id ){

                        $scope.votes.splice(i, 1);
                        break;
                    }
                }

            });
        };

    }


})();

/**
 * FellowVotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'FellowVotesController', FellowVotesController );

    FellowVotesController.$inject = [ '$scope', '$location', 'User', 'Votes' ];
    /**
     * @namespace VoteController
     */
    function FellowVotesController($scope, $location, User, Votes) {

        var vm = this;

        $scope.helpers = HFHelpers.helpers;

        if( User.isUserLoggedIn() ) {

            $scope.currentUser = User.getCurrentUser();

            Votes.get( $scope.currentUser.id ).success( function( votes ){

                $scope.votes = votes;
            });

        }
        else{

            $location.path("/");
        }

        $scope.removeVote = function( vote ){

            // be sure it wasn't an accidental click
            var c = confirm( "Are you sure you want to remove your vote?");
            if( !c ) return;

            Votes.destroy( vote.id ).then( function( response ){

                // remove vote from $scote.votes
                for( var i = 0; $scope.votes.length; i++ ){

                    var item = $scope.votes[i];

                    if( item.id === vote.id ){

                        $scope.votes.splice(i, 1);
                        break;
                    }
                }

            });
        };
    }


})();

/**
 * VotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'VotesController', VotesController );

    VotesController.$inject = [ '$scope', '$location', 'User', 'Votes' ];
    /**
     * @namespace VoteController
     */
    function VotesController($scope, $location, User, Votes) {

        var vm = this;

        if( User.isUserLoggedIn() ) {

            var currentUser = User.getCurrentUser();

            // redirect the user based on their type
            if (currentUser.userType === 'Admin') {
                $location.path("/votes/admin");
            }
            else if (currentUser.userType === 'Fellow') {
                $location.path("/votes/fellow");
            }
            else if (currentUser.userType === 'Company') {
                $location.path("/votes/company");
            }
        }
        else{

            $location.path("/");
        }



    }


})();

/*! 7.3.9 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="7.3.9",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function g(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&f?{loaded:a.loaded+d._start,total:d._file.size,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){f&&d._chunkSize&&!d._finished?(g({loaded:d._end,total:d._file.size,config:d,type:"progress"}),e.upload(d)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,g(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,g(h(a)))},!1))}},f?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):i():i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},k}var e=this;this.isResumeSupported=function(){return window.Blob&&(new Blob).slice};var f=this.isResumeSupported();this.upload=function(a){function b(c,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))c.append(e,d);else if("form"===a.sendFieldsAs)if(angular.isObject(d))for(var f in d)d.hasOwnProperty(f)&&b(c,d[f],e+"["+f+"]");else c.append(e,d);else d=angular.isString(d)?d:angular.toJson(d),"json-blob"===a.sendFieldsAs?c.append(e,new Blob([d],{type:"application/json"})):c.append(e,d)}function c(a){return a instanceof Blob||a.flashId&&a.name&&a.size}function g(b,d,e){if(c(d)){if(a._file=a._file||d,null!=a._start&&f){a._end&&a._end>=d.size&&(a._finished=!0,a._end=d.size);var h=d.slice(a._start,a._end||d.size);h.name=d.name,d=h,a._chunkSize&&(b.append("chunkSize",a._end-a._start),b.append("chunkNumber",Math.floor(a._start/a._chunkSize)),b.append("totalSize",a._file.size))}b.append(e,d,d.fileName||d.name)}else{if(!angular.isObject(d))throw"Expected file object in Upload.upload file option: "+d.toString();for(var i in d)if(d.hasOwnProperty(i)){var j=i.split(",");j[1]&&(d[i].fileName=j[1].replace(/^\s+|\s+$/g,"")),g(b,d[i],j[0])}}}return a._chunkSize=e.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(c){var d,e=new FormData,f={};for(d in a.fields)a.fields.hasOwnProperty(d)&&(f[d]=a.fields[d]);c&&(f.data=c);for(d in f)if(f.hasOwnProperty(d)){var h=f[d];a.formDataAppender?a.formDataAppender(e,d,h):b(e,h,d)}if(null!=a.file)if(angular.isArray(a.file))for(var i=0;i<a.file.length;i++)g(e,a.file[i],"file");else g(e,a.file,"file");return e}),d(a)},this.http=function(b){return b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=e.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1e3*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1e6*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1e9*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","UploadResize",function(a,b,c,d){var e=d;return e.getAttrWithDefaults=function(a,b){return null!=a[b]?a[b]:null==e.defaults[b]?e.defaults[b]:e.defaults[b].toString()},e.attrGetter=function(b,c,d,e){if(!d)return this.getAttrWithDefaults(c,b);try{return e?a(this.getAttrWithDefaults(c,b))(d,e):a(this.getAttrWithDefaults(c,b))(d)}catch(f){if(b.search(/min|max|pattern/i))return this.getAttrWithDefaults(c,b);throw f}},e.updateModel=function(c,d,f,g,h,i,j){function k(){var j=h&&h.length?h[0]:null;if(c){var k=!e.attrGetter("ngfMultiple",d,f)&&!e.attrGetter("multiple",d)&&!p;a(e.attrGetter("ngModel",d)).assign(f,k?j:h)}var l=e.attrGetter("ngfModel",d);l&&a(l).assign(f,h),g&&a(g)(f,{$files:h,$file:j,$newFiles:m,$duplicateFiles:n,$event:i}),b(function(){})}function l(a,b){var c=e.attrGetter("ngfResize",d,f);if(!c||!e.isResizeSupported())return b();for(var g=a.length,h=function(){g--,0===g&&b()},i=function(b){return function(c){a.splice(b,1,c),h()}},j=function(a){return function(b){h(),a.$error="resize",a.$errorParam=(b?(b.message?b.message:b)+": ":"")+(a&&a.name)}},k=0;k<a.length;k++){var l=a[k];l.$error||0!==l.type.indexOf("image")?h():e.resize(l,c.width,c.height,c.quality).then(i(k),j(l))}}var m=h,n=[],o=(c&&c.$modelValue||d.$$ngfPrevFiles||[]).slice(0),p=e.attrGetter("ngfKeep",d,f);if(p===!0){if(!h||!h.length)return;var q=!1;if(e.attrGetter("ngfKeepDistinct",d,f)===!0){for(var r=o.length,s=0;s<h.length;s++){for(var t=0;r>t;t++)if(h[s].name===o[t].name){n.push(h[s]);break}t===r&&(o.push(h[s]),q=!0)}if(!q)return;h=o}else h=o.concat(h)}d.$$ngfPrevFiles=h,j?k():e.validate(h,c,d,f,e.attrGetter("ngfValidateLater",d),function(){l(h,function(){b(function(){k()})})});for(var u=o.length;u--;){var v=o[u];window.URL&&v.blobUrl&&(URL.revokeObjectURL(v.blobUrl),delete v.blobUrl)}},e}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"id"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');return n(a),a.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:a}),document.body.appendChild(a[0]),a}function p(c){if(b.attr("disabled")||t("ngfSelectDisabled",a))return!1;var d=q(c);return null!=d?d:(r(c),e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1)}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)},u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),j.registerValidators(d,w,c,a),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),a.$on("$destroy",function(){k()||w.remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.dataUrl:a.blobUrl)||a.dataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ngf-hide"):e.addClass("ngf-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;if("ngfThumbnail"===g&&(d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),0===d.width&&window.getComputedStyle)){var f=getComputedStyle(e[0]);d={width:parseInt(f.width.slice(0,-2)),height:parseInt(f.height.slice(0,-2))}}return angular.isString(c)?(e.removeClass("ngf-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ngf-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.dataUrl=function(a,d){if(d&&null!=a.dataUrl||!d&&null!=a.blobUrl){var e=c.defer();return b(function(){e.resolve(d?a.dataUrl:a.blobUrl)}),e.promise}var f=d?a.$ngfDataUrlPromise:a.$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!d){var e;try{e=c.createObjectURL(a)}catch(f){return void b(function(){a.blobUrl="",g.reject()})}b(function(){a.blobUrl=e,e&&g.resolve(e)})}else{var h=new FileReader;h.onload=function(c){b(function(){a.dataUrl=c.target.result,g.resolve(c.target.result)})},h.onerror=function(){b(function(){a.dataUrl="",g.reject()})},h.readAsDataURL(a)}}else b(function(){a[d?"dataUrl":"blobUrl"]="",g.reject()})}),f=d?a.$ngfDataUrlPromise=g.promise:a.$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[d?"$ngfDataUrlPromise":"$ngfBlobUrlPromise"]}),f},d}]);var c=angular.element("<style>.ngf-hide{display:none !important}</style>");document.getElementsByTagName("head")[0].appendChild(c[0]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){var b="",c=[];if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])b=a.substring(1,a.length-1);else{var e=a.split(",");if(e.length>1)for(var f=0;f<e.length;f++){var g=d(e[f]);g.regexp?(b+="("+g.regexp+")",f<e.length-1&&(b+="|")):c=c.concat(g.excludes)}else 0===a.indexOf("!")?c.push("^((?!"+d(a.substring(1)).regexp+").)*$"):(0===a.indexOf(".")&&(a="*"+a),b="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",b=b.replace(/\\\*/g,".*").replace(/\\\?/g,"."))}return{regexp:b,excludes:c}}var e=a;return e.registerValidators=function(a,b,c,d){function f(a){angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})}a&&(a.$ngfValidations=[],a.$formatters.push(function(g){return e.attrGetter("ngfValidateLater",c,d)||!a.$$ngfValidated?(e.validate(g,a,c,d,!1,function(){f(a),a.$$ngfValidated=!1}),g&&0===g.length&&(g=null),!b||null!=g&&0!==g.length||b.val()&&b.val(null)):(f(a),a.$$ngfValidated=!1),g}))},e.validatePattern=function(a,b){if(!b)return!0;var c=d(b),e=!0;if(c.regexp&&c.regexp.length){var f=new RegExp(c.regexp,"i");e=null!=a.type&&f.test(a.type)||null!=a.name&&f.test(a.name)}for(var g=c.excludes.length;g--;){var h=new RegExp(c.excludes[g],"i");e=e&&(null==a.type||h.test(a.type))&&(null==a.name||h.test(a.name))}return e},e.validate=function(a,b,c,d,f,g){function h(c,d,e){if(a){for(var f="ngf"+c[0].toUpperCase()+c.substr(1),g=a.length,h=null;g--;){var i=a[g],k=j(f,{$file:i});null==k&&(k=d(j("ngfValidate")||{}),h=null==h?!0:h),null!=k&&(e(i,k)||(i.$error=c,i.$errorParam=k,a.splice(g,1),h=!1))}null!==h&&b.$ngfValidations.push({name:c,valid:h})}}function i(c,d,e,f,h){if(a){var i=0,l=!1,m="ngf"+c[0].toUpperCase()+c.substr(1);a=void 0===a.length?[a]:a,angular.forEach(a,function(a){if(0!==a.type.search(e))return!0;var n=j(m,{$file:a})||d(j("ngfValidate",{$file:a})||{});n&&(k++,i++,f(a,n).then(function(b){h(b,n)||(a.$error=c,a.$errorParam=n,l=!0)},function(){j("ngfValidateForce",{$file:a})&&(a.$error=c,a.$errorParam=n,l=!0)})["finally"](function(){k--,i--,i||b.$ngfValidations.push({name:c,valid:!l}),k||g.call(b,b.$ngfValidations)}))})}}b=b||{},b.$ngfValidations=b.$ngfValidations||[],angular.forEach(b.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return e.attrGetter(a,c,d,b)};if(f)return void g.call(b);if(b.$$ngfValidated=!0,null==a||0===a.length)return void g.call(b);if(a=void 0===a.length?[a]:a.slice(0),h("pattern",function(a){return a.pattern},e.validatePattern),h("minSize",function(a){return a.size&&a.size.min},function(a,b){return a.size>=e.translateScalars(b)}),h("maxSize",function(a){return a.size&&a.size.max},function(a,b){return a.size<=e.translateScalars(b)}),h("validateFn",function(){return null},function(a,b){return b===!0||null===b||""===b}),!a.length)return void g.call(b,b.$ngfValidations);var k=0;i("maxHeight",function(a){return a.height&&a.height.max},/image/,this.imageDimensions,function(a,b){return a.height<=b}),i("minHeight",function(a){return a.height&&a.height.min},/image/,this.imageDimensions,function(a,b){return a.height>=b}),i("maxWidth",function(a){return a.width&&a.width.max},/image/,this.imageDimensions,function(a,b){return a.width<=b}),i("minWidth",function(a){return a.width&&a.width.min},/image/,this.imageDimensions,function(a,b){return a.width>=b}),i("ratio",function(a){return a.ratio},/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++){var f=c[e],g=f.search(/x/i);f=g>-1?parseFloat(f.substring(0,g))/parseFloat(f.substring(g+1)):parseFloat(f),Math.abs(a.width/a.height-f)<1e-4&&(d=!0)}return d}),i("maxDuration",function(a){return a.duration&&a.duration.max},/audio|video/,this.mediaDuration,function(a,b){return a<=e.translateScalars(b)}),i("minDuration",function(a){return a.duration&&a.duration.min},/audio|video/,this.mediaDuration,function(a,b){return a>=e.translateScalars(b)}),i("validateAsyncFn",function(){return null},/./,function(a,b){return b},function(a){return a===!0||null===a||""===a}),k||g.call(b,b.$ngfValidations)},e.imageDimensions=function(a){if(a.width&&a.height){var d=b.defer();return c(function(){d.resolve({width:a.width,height:a.height})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void f.reject("not image"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.width=b,a.height=c,f.resolve({width:b,height:c})}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?e():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",e);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){f.reject("load error")})}),a.$ngfDimensionPromise=f.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},e.mediaDuration=function(a){if(a.duration){var d=b.defer();return c(function(){d.resolve(a.duration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void f.reject("not media"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.duration=b,h.remove(),f.resolve(b)}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?e():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",e);var i=0;g(),angular.element(document.body).append(h)},function(){f.reject("load error")})}),a.$ngfDurationPromise=f.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},e}]),ngFileUpload.service("UploadResize",["UploadValidate","$q","$timeout",function(a,b,c){var d=a,e=function(a,b,c,d){var e=Math.min(c/a,d/b);return{width:a*e,height:b*e}},f=function(a,c,d,f,g){var h=b.defer(),i=document.createElement("canvas"),j=document.createElement("img");return 0===c&&(c=j.width,d=j.height),j.onload=function(){try{var a=e(j.width,j.height,c,d);i.width=a.width,i.height=a.height;var b=i.getContext("2d");b.drawImage(j,0,0,a.width,a.height),h.resolve(i.toDataURL(g||"image/WebP",f||1))}catch(k){h.reject(k)}},j.onerror=function(){h.reject()},j.src=a,h.promise},g=function(a){for(var b=a.split(","),c=b[0].match(/:(.*?);/)[1],d=atob(b[1]),e=d.length,f=new Uint8Array(e);e--;)f[e]=d.charCodeAt(e);return new Blob([f],{type:c})};return d.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")},d.resize=function(a,e,h,i){var j=b.defer();return 0!==a.type.indexOf("image")?(c(function(){j.resolve("Only images are allowed for resizing!")}),j.promise):(d.dataUrl(a,!0).then(function(b){f(b,e,h,i,a.type).then(function(b){var c=g(b);c.name=a.name,j.resolve(c)},function(){j.reject()})},function(){j.reject()}),j.promise)},d}]),function(){function a(a,c,d,e,f,g,h,i){function j(){return c.attr("disabled")||n("ngfDropDisabled",a)}function k(a,b,c,d){var e=n("ngfDragOverClass",a,{$event:c}),f=n("ngfDragOverClass")||"dragover";if(angular.isString(e))return void d(e);if(e&&(e.delay&&(r=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g)for(var h=n("ngfPattern",a,{$event:c}),j=0;j<g.length;j++)if("file"===g[j].kind||""===g[j].kind){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}}d(f)}function l(a,b,c,d){function e(a,b,c){if(null!=b)if(b.isDirectory){var d=(c||"")+b.name;a.push({name:b.name,type:"directory",path:d});var f=b.createReader(),g=[];i++;var h=function(){f.readEntries(function(d){try{if(d.length)g=g.concat(Array.prototype.slice.call(d||[],0)),h();else{for(var f=0;f<g.length;f++)e(a,g[f],(c?c:"")+b.name+"/");i--}}catch(j){i--,console.error(j)}},function(){i--})};h()}else i++,b.file(function(b){try{i--,b.path=(c?c:"")+b.name,a.push(b)}catch(d){i--,console.error(d)}},function(){i--})}var f=[],i=0,j=a.dataTransfer.items;if(j&&j.length>0&&"file"!==h.protocol())for(var k=0;k<j.length;k++){if(j[k].webkitGetAsEntry&&j[k].webkitGetAsEntry()&&j[k].webkitGetAsEntry().isDirectory){var l=j[k].webkitGetAsEntry();if(l.isDirectory&&!c)continue;null!=l&&e(f,l)}else{var m=j[k].getAsFile();null!=m&&f.push(m)}if(!d&&f.length>0)break}else{var n=a.dataTransfer.files;if(null!=n)for(var o=0;o<n.length&&(f.push(n.item(o)),d||!(f.length>0));o++);}var p=0;!function q(a){g(function(){if(i)10*p++<2e4&&q(10);else{if(!d&&f.length>1){for(k=0;"directory"===f[k].type;)k++;f=[f[k]]}b(f)}},a||0)}()}var m=b(),n=function(a,b,c){return i.attrGetter(a,d,b,c)};if(n("dropAvailable")&&g(function(){a[n("dropAvailable")]?a[n("dropAvailable")].value=m:a[n("dropAvailable")]=m}),!m)return void(n("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));i.registerValidators(e,null,d,a);var o,p=null,q=f(n("ngfStopPropagation")),r=1;c[0].addEventListener("dragover",function(b){if(!j()){if(b.preventDefault(),q(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(p),o||(o="C",k(a,d,b,function(a){o=a,c.addClass(o)}))}},!1),c[0].addEventListener("dragenter",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(){j()||(p=g(function(){o&&c.removeClass(o),o=null},r||1))},!1),c[0].addEventListener("drop",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation(),o&&c.removeClass(o),o=null,l(b,function(c){i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)},n("ngfAllowDir",a)!==!1,n("multiple")||n("ngfMultiple",a)))},!1),c[0].addEventListener("paste",function(b){if(!j()){var c=[],f=b.clipboardData||b.originalEvent.clipboardData;if(f&&f.items){for(var g=0;g<f.items.length;g++)-1!==f.items[g].type.indexOf("image")&&c.push(f.items[g].getAsFile());i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)}}},!1)}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImFsZXJ0cy9hbGVydC5tb2R1bGUuanMiLCJjb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImZlbGxvd3MvZmVsbG93cy5tb2R1bGUuanMiLCJob21lL2hvbWUubW9kdWxlLmpzIiwidGFncy90YWdzLm1vZHVsZS5qcyIsInByb2ZpbGUvcHJvZmlsZS5tb2R1bGUuanMiLCJ2b3Rlcy92b3Rlcy5tb2R1bGUuanMiLCJhbGVydHMvY29udHJvbGxlci9hbGVydC5jb250cm9sbGVyLmpzIiwiYWxlcnRzL3NlcnZpY2VzL2FsZXJ0LnNlcnZpY2UuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFuaWVzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFueS5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiY29tcGFuaWVzL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwiZmVsbG93cy9kaXJlY3RpdmVzL2ZlbGxvd0NhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3cuY29udHJvbGxlci5qcyIsImZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93cy5jb250cm9sbGVyLmpzIiwiaG9tZS9jb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJmZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsInRhZ3MvY29udHJvbGxlcnMvdGFncy5jb250cm9sbGVyLmpzIiwidGFncy9zZXJ2aWNlcy90YWdzLnNlcnZpY2UuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2FkbWluUHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9jb21wYW55UHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9mZWxsb3dzUHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9wcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL3NlcnZpY2VzL3MzLnNlcnZpY2UuanMiLCJwcm9maWxlL3NlcnZpY2VzL3VzZXIuc2VydmljZS5qcyIsInZvdGVzL3NlcnZpY2VzL3ZvdGVzLnNlcnZpY2UuanMiLCJ2b3Rlcy9jb250cm9sbGVycy9hZG1pblZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9jb250cm9sbGVycy9jb21wYW55Vm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2ZlbGxvd1ZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9jb250cm9sbGVycy92b3Rlcy5jb250cm9sbGVyLmpzIiwibmctZmlsZS11cGxvYWQubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDblNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBhcHAucm91dGVzXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXG4gKi9cblxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nRmlsZVVwbG9hZCcsICduZ1Nhbml0aXplJywgJ3VpLmJvb3RzdHJhcCcsICd1aS5zZWxlY3QnLFxuICAgICdhcHAuY29uZmlnJywgJ2FwcC5ob21lJywgJ2FwcC5jb21wYW5pZXMnLCAnYXBwLmZlbGxvd3MnLCAnYXBwLnRhZ3MnLCAnYXBwLnByb2ZpbGUnLCAnYXBwLnZvdGVzJywgJ2FwcC5hbGVydCcgXSlcbiAgICAucnVuKHJ1bik7XG5cbi8qKlxuICogICAqIEBuYW1lIGNvbmZpZ1xuICogICAgICogQGRlc2MgRGVmaW5lIHZhbGlkIGFwcGxpY2F0aW9uIHJvdXRlc1xuICogICAgICAgKi9cbiBhcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XG5cbiAgICAkcm91dGVQcm92aWRlclxuICAgIC53aGVuKCcvJywge1xuICAgICAgICBjb250cm9sbGVyICA6ICdIb21lQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsIDogJ3NvdXJjZS9hcHAvaG9tZS9ob21lLmh0bWwnXG4gICAgfSlcbiAgICAud2hlbignL2ZlbGxvd3MnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvd3MuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG4gICAgLndoZW4oJy9mZWxsb3dzLzpmZWxsb3dfaWQvOmZlbGxvd19uYW1lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvdy5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcbiAgICAud2hlbignL2NvbXBhbmllcycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL2NvbXBhbmllcy5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcbiAgICAud2hlbignL2NvbXBhbmllcy86Y29tcGFueV9pZC86Y29tcGFueV9uYW1lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL2NvbXBhbnkuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG5cbiAgICAud2hlbignL3RhZ3MnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdUYWdzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC90YWdzL3RhZ3MuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUvYWRtaW4nLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblByb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4tcHJvZmlsZS5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9mZWxsb3cnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9mZWxsb3ctcHJvZmlsZS5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9jb21wYW55Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvY29tcGFueS1wcm9maWxlLmh0bWwnLFxuICAgICAgICByZXNvbHZlOiB7IGxvZ2dlZEluOiBjaGVja0xvZ2dlZGluIH1cbiAgICB9KVxuXG4gICAgLndoZW4oICcvdm90ZXMnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvdm90ZXMuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG5cbiAgICAud2hlbiggJy92b3Rlcy9mZWxsb3cnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvZmVsbG93LXZvdGVzLmh0bWwnLFxuICAgICAgICByZXNvbHZlOiB7IGxvZ2dlZEluOiBjaGVja0xvZ2dlZGluIH1cbiAgICB9KVxuXG4gICAgLndoZW4oICcvdm90ZXMvY29tcGFueScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvY29tcGFueS12b3Rlcy5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcblxuICAgIC5vdGhlcndpc2UoeyByZWRpcmVjdFRvOiAnLycgfSk7XG5cbn0pO1xuXG4vLyBPbiBwYXRocyB0aGF0IHJlcXVpcmUgbG9naW4sIG1ha2Ugc3VyZSB0aGUgbG9naW4gaXMgY29uZmlybWVkIGJlZm9yZSB0aGUgcm91dGUgaXMgbG9hZGVkLlxudmFyIGNoZWNrTG9nZ2VkaW4gPSBmdW5jdGlvbigkcSwgJHRpbWVvdXQsICRodHRwLCAkbG9jYXRpb24sICRyb290U2NvcGUsIENPTkZJRywgVXNlcil7XG5cbiAgICAvLyBJbml0aWFsaXplIGEgbmV3IHByb21pc2VcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgLy8ga2VlcCB1c2VyIGxvZ2dlZCBpbiBhZnRlciBwYWdlIHJlZnJlc2hcbiAgICAvLyBDaGVjayBiYWNrZW5kIGZvciBleGlzdGluZyB1c2VyIGluIHNlc3Npb24gYW5kIHVwZGF0ZSBVc2VyIFNlcnZpY2VcbiAgICAkaHR0cC5nZXQoIENPTkZJRy5TRVJWSUNFX1VSTCArICcvYXBpL3YxL3VzZXJzL2NvbmZpcm0tbG9naW4nIClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHVzZXIpIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdXNlciApO1xuXG4gICAgICAgICAgICBpZiAodXNlciAmJiB1c2VyLmlkKSB7XG5cbiAgICAgICAgICAgICAgICBVc2VyLlNldENyZWRlbnRpYWxzKCB1c2VyLmlkLCB1c2VyLmVtYWlsLCB1c2VyLnVzZXJUeXBlICk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi51cmwoJy8nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuYXBwLmNvbnRyb2xsZXIoJ1JvdXRpbmdDb250cm9sbGVyJywgUm91dGluZ0NvbnRyb2xsZXIpXG4uY29udHJvbGxlcignTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG5Sb3V0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJyR3aW5kb3cnLCAnVXNlcicsICckbG9jYXRpb24nLCAnJGFuY2hvclNjcm9sbCddO1xuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnVXNlciddO1xuXG5mdW5jdGlvbiBSb3V0aW5nQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgJHdpbmRvdywgVXNlciwgJGxvY2F0aW9uLCAkYW5jaG9yU2Nyb2xsKSB7XG5cbiAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBmYWxzZTtcbiAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xuXG4gICAgJHNjb3BlLnNjcm9sbFRvID0gZnVuY3Rpb24oaWQpe1xuXG4gICAgICAgICRsb2NhdGlvbi5oYXNoKGlkKTtcbiAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2dpblN0YXR1cygpe1xuXG4gICAgICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IFVzZXIuaXNVc2VyTG9nZ2VkSW4oKTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckFkbWluID0gVXNlci5pc1VzZXJBZG1pbigpO1xuICAgICAgICAkc2NvcGUuaXNVc2VyRmVsbG93ID0gVXNlci5pc1VzZXJGZWxsb3coKTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckNvbXBhbnkgPSBVc2VyLmlzVXNlckNvbXBhbnkoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvbG9naW4tcGFnZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgIHNpemU6ICcnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdXBkYXRlTG9naW5TdGF0dXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS4kb24oJ2xvZ2luU3RhdHVzQ2hhbmdlZCcsIHVwZGF0ZUxvZ2luU3RhdHVzKTtcblxuICAgICRzY29wZS5sb2dvdXRVc2VyID0gZnVuY3Rpb24oKXtcblxuICAgICAgICBVc2VyLkNsZWFyQ3JlZGVudGlhbHMoKTtcblxuICAgICAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckFkbWluID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5pc1VzZXJGZWxsb3cgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckNvbXBhbnkgPSBmYWxzZTtcblxuICAgICAgICAkd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIFVzZXIpIHtcblxuICAgIC8vIHNhdmUgdGhpcyB0aHJvdWdoIGEgcmVmcmVzaFxuICAgICRzY29wZS5sb2dpbkZvcm0gPSB7XG5cbiAgICAgICAgZW1haWw6IFwiXCIsXG4gICAgICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgICAgICBlcnJvcnM6IFtdXG4gICAgfTtcblxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKGxvZ2luRm9ybSkge1xuXG4gICAgICAgICRzY29wZS5sb2dpbkZvcm0uZXJyb3JzID0gW107XG5cbiAgICAgICAgVXNlci5sb2dpbihsb2dpbkZvcm0pLnN1Y2Nlc3MoZnVuY3Rpb24oIGRhdGEgKXtcblxuICAgICAgICAgICAgaWYoIGRhdGEuc3VjY2VzcyApe1xuXG4gICAgICAgICAgICAgICAgdmFyIHVzZXIgPSBkYXRhLnVzZXI7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuXG4gICAgICAgICAgICAgICAgVXNlci5TZXRDcmVkZW50aWFscyggdXNlci5pZCwgdXNlci5lbWFpbCwgdXNlci51c2VyVHlwZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2dpbkZvcm0uZXJyb3JzLnB1c2goIFwiSW52YWxpZCB1c2VyIGNyZWRlbnRpYWxzXCIgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KS5lcnJvciggZnVuY3Rpb24oZXJyb3Ipe1xuXG4gICAgICAgICAgICAkc2NvcGUubG9naW5Gb3JtLmVycm9ycy5wdXNoKCBcIkludmFsaWQgdXNlciBjcmVkZW50aWFsc1wiICk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIH07XG59XG5cblxucnVuLiRpbmplY3QgPSBbJyRodHRwJywgJ1VzZXInLCAnQ09ORklHJ107XG5mdW5jdGlvbiBydW4oJGh0dHAsIFVzZXIsIENPTkZJRyApe1xuXG5cblxufVxuXG5cbi8qKlxuICogSGVscGVyIEZ1bmN0aW9uc1xuICoqL1xuXG52YXIgSEZIZWxwZXJzID0gSEZIZWxwZXJzIHx8IHt9O1xuXG5IRkhlbHBlcnMuaGVscGVycyA9IHtcblxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJykgICAgICAgICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggLVxuICAgICAgICAgICAgLnJlcGxhY2UoL1teXFx3XFwtXSsvZywgJycpICAgICAgIC8vIFJlbW92ZSBhbGwgbm9uLXdvcmQgY2hhcnNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC1cXC0rL2csICctJykgICAgICAgICAvLyBSZXBsYWNlIG11bHRpcGxlIC0gd2l0aCBzaW5nbGUgLVxuICAgICAgICAgICAgLnJlcGxhY2UoL14tKy8sICcnKSAgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XG4gICAgICAgICAgICAucmVwbGFjZSgvLSskLywgJycpOyAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIGVuZCBvZiB0ZXh0XG4gICAgfSxcblxuICAgIHBhcmFncmFwaGl6ZTogZnVuY3Rpb24oIHN0ciApIHtcblxuICAgICAgICBpZiggdHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgKSByZXR1cm4gJyc7XG5cbiAgICAgICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KCBcIlxcblwiICk7XG4gICAgICAgIHJldHVybiAoIHBhcnRzLmxlbmd0aCA+IDAgPyAnPHA+JyArIHBhcnRzLmpvaW4oJzwvcD48cD4nKSArICc8L3A+JyA6ICcnICk7XG4gICAgfVxufTtcblxuYXBwLmZpbHRlcihcInNhbml0aXplXCIsIFsnJHNjZScsIGZ1bmN0aW9uKCRzY2UpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbihodG1sQ29kZSl7XG5cbiAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbENvZGUpO1xuICAgIH07XG59XSk7XG5cbmFwcC5maWx0ZXIoJ3Byb3BzRmlsdGVyJywgZnVuY3Rpb24oKSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oaXRlbXMsIHByb3BzKSB7XG5cbiAgICAgICAgdmFyIG91dCA9IFtdO1xuXG4gICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU1hdGNoZXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocHJvcHMpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IGtleXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gcHJvcHNbcHJvcF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1bcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtTWF0Y2hlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdGVtTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExldCB0aGUgb3V0cHV0IGJlIHRoZSBpbnB1dCB1bnRvdWNoZWRcbiAgICAgICAgICAgIG91dCA9IGl0ZW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xufSk7IiwiLyoqXG4gKiBBIHBsYWNlIHRvIHB1dCBhcHAgd2lkZSBjb25maWcgc3R1ZmZcbiAqXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXG4gICAgLmNvbnN0YW50KCdDT05GSUcnLCB7XG4gICAgICAgICdBUFBfTkFNRSc6ICdIYWNrZXIgRmVsbG93IFBvcnRhbCcsXG4gICAgICAgICdBUFBfVkVSU0lPTic6ICcxLjAnLFxuICAgICAgICAnU0VSVklDRV9VUkwnOiAnJ1xuICAgIH0pO1xuXG5cbi8vdmFyIHJvb3RVcmwgPSAnaHR0cHM6Ly9xdWlldC1jb3ZlLTY4MzAuaGVyb2t1YXBwLmNvbSc7XG4vLyB2YXIgcm9vdFVybCA9IFwiaHR0cHM6Ly9ib2lsaW5nLXNwcmluZ3MtNzUyMy5oZXJva3VhcHAuY29tXCI7IiwiLyoqXG4gKiBhbGVydCBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0JywgW1xuICAgICAgICAgICAgJ2FwcC5hbGVydC5jb250cm9sbGVycycsXG4gICAgICAgICAgICAnYXBwLmFsZXJ0LnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LnNlcnZpY2VzJywgW10pO1xuXG5cbn0pKCk7XG4iLCIvKipcbiAqIGNvbXBhbmllcyBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcblxuICAvLyBkZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJywgW10pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiBmZWxsb3dzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MnLCBbXG4gICAgICAgICdhcHAuZmVsbG93cy5jb250cm9sbGVycycsXG4gICAgICAgICdhcHAuZmVsbG93cy5zZXJ2aWNlcycsXG4gICAgICAgICdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnLCBbXSk7XG5cblxufSkoKTtcbiIsIi8qKlxuICogaG9tZSBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lJywgW1xuICAgICAgICAnYXBwLmhvbWUuY29udHJvbGxlcnMnLFxuICAgICAgICAvLydhcHAuaG9tZS5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmRpcmVjdGl2ZXMnLCBbXSk7XG4gICAgLy9ob3cgYWJvdXQgdGhpc1xufSkoKTtcbiIsIi8qKlxuICogdGFncyBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhZ3MnLCBbXG5cbiAgICAgICAgICAgICdhcHAudGFncy5jb250cm9sbGVycycsXG4gICAgICAgICAgICAnYXBwLnRhZ3Muc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLnNlcnZpY2VzJywgW10pO1xuXG5cbiAgICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhZ3MuY29udHJvbGxlcnMnLCBbXSk7XG5cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBwcm9maWxlIG1vZHVsZVxuICovXG5cbiAoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnXG4gICAgICAgICAgICBdKTtcblxuICAgICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICAgYW5ndWxhclxuICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIHZvdGVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzJywgW1xuXG4gICAgICAgICAgICAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAudm90ZXMuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycsIFtdKTtcblxuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5jb250cm9sbGVycycsIFtdKTtcblxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEFsZXJ0Q29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FsZXJ0Q29udHJvbGxlcicsIEFsZXJ0Q29udHJvbGxlcik7XG5cbiAgICBBbGVydENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQWxlcnRDb250cm9sbGVyKCAkc2NvcGUsIEFsZXJ0ICkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgZmVsbG93cyBjb250cm9sbGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmFsZXJ0ID0gQWxlcnQuYWxlcnQ7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxlcnQgd2luZG93XG4gICAgICAgICRzY29wZS5jbG9zZUFsZXJ0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgQWxlcnQuY2xvc2VBbGVydCgpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBBbGVydFxuICogQG5hbWVzcGFjZSBhcHAuYWxlcnQuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdBbGVydCcsIEFsZXJ0KTtcblxuICAgIEFsZXJ0LiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG5cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBBbGVydFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEFsZXJ0KCAkdGltZW91dCApIHtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGVydDoge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3dBbGVydDogZnVuY3Rpb24obmV3TWVzc2FnZSwgbmV3VHlwZSkge1xuXG4gICAgICAgICAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG5ld01lc3NhZ2UgKSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0Lm1lc3NhZ2UgPSBuZXdNZXNzYWdlLmpvaW4oICc8YnIgLz4nICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQubWVzc2FnZSA9IG5ld01lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC50eXBlID0gbmV3VHlwZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnNob3cgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gSSB0aGluayB0aGlzIGlzIG9rP1xuICAgICAgICAgICAgICAgIC8vIEZvciBzb21lIHJlYXNvbiBJIHdhbnRlZCB0aGUgYWxlcnQgdG8gYXV0byBjbGVhciBhbmQgY291bGRuJ3QgZmlndXJlIGFcbiAgICAgICAgICAgICAgICAvLyBiZXR0ZXIgd2F5IHRvIGhhdmUgYSB0aW1lb3V0IGF1dG9tYXRpY2FsbHkgY2xvc2UgdGhlIGFsZXJ0LiBJIGZlZWwgbGlrZVxuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgc29tZSBzb3J0IG9mIHNjb3Bpbmcgd2VpcmRuZXNzIGdvaW5nIG9uIGhlcmUsIGJ1dCBpdCB3b3JrcyBhbmQgSVxuICAgICAgICAgICAgICAgIC8vIGFtIHRpcmVkLCBzbyBpdCBpcyBnZXR0aW5nIGNvbW1pdHRlZCA7LXBcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnQgPSB0aGlzLmFsZXJ0O1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KCBmdW5jdGlvbigpeyBhbGVydC5zaG93ID0gZmFsc2U7IH0sICA1MDAwICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2VBbGVydDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0Lm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnR5cGUgPSAnaW5mbyc7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5zaG93ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiAqIENvbXBhbmllc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgQ29tcGFuaWVzQ29udHJvbGxlcik7XG5cbiAgICBDb21wYW5pZXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnQ29tcGFuaWVzJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIENvbXBhbmllc0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW5pZXNDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBDb21wYW5pZXMpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGNvbXBhbmllcyBjb250cm9sbGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgQ29tcGFuaWVzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoY29tcGFueSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2RldGFpbF92aWV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wYW55O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcGFuaWVzIE1vZGFsIEluc3RhbmNlIENvbnRyb2xsZXJcbiAgICAgKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gICAgICovXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cbiAgICBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLFxuICAgICAgICAnY29tcGFueScsICdWb3RlcycsICdVc2VyJ107XG5cbiAgICBmdW5jdGlvbiBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55LCBWb3RlcywgVXNlcikge1xuXG4gICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuY29tcGFueSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiAqIENvbXBhbmllc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW55Q29udHJvbGxlcicsIENvbXBhbnlDb250cm9sbGVyKTtcblxuICAgIENvbXBhbnlDb250cm9sbGVyLiRpbmplY3QgPSBbICckcm91dGVQYXJhbXMnLCAnJHNjb3BlJywgJyR0aW1lb3V0JywgJ0NvbXBhbmllcycsICdVc2VyJywgJ1ZvdGVzJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIENvbXBhbmllc0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55Q29udHJvbGxlciggJHJvdXRlUGFyYW1zLCAkc2NvcGUsICR0aW1lb3V0LCBDb21wYW5pZXMsIFVzZXIsIFZvdGVzLCBBbGVydCkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gW107XG4gICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSBbXTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgIENvbXBhbmllcy5nZXQoICRyb3V0ZVBhcmFtcy5jb21wYW55X2lkICkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFueSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIFVzZXIuZ2V0Vm90ZXMoIGNvbXBhbnkudXNlcl9pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gdm90ZXMudm90ZXNGb3I7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IHZvdGVzLnZvdGVzQ2FzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCAkc2NvcGUudm90ZXNGb3IubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHNjb3BlLnZvdGVzRm9yW2ldO1xuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50LmlkID09ICRzY29wZS5jdXJyZW50VXNlci5pZCApIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0ZlbGxvdyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAoICRzY29wZS5jdXJyZW50VXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGNvbXBhbnkpIHtcblxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmlzRmVsbG93KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVm90ZXMuY3JlYXRlKCRzY29wZS5jdXJyZW50VXNlci5pZCwgY29tcGFueS51c2VyX2lkKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodm90ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b3RlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoIGVyci5kYXRhLCBcImluZm9cIiApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgY29tcGFueUNhcmQpO1xuXG5cbiAgICBmdW5jdGlvbiBjb21wYW55Q2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4qIENvbXBhbmllc1xuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xuXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XG5cbiAgLyoqXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNcbiAgKi9cbiAgZnVuY3Rpb24gQ29tcGFuaWVzKCRodHRwLCBVcGxvYWQsIENPTkZJRykge1xuXG4gICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsOiBhbGwsXG4gICAgICBhbGxXaXRoVXNlcjogYWxsV2l0aFVzZXIsXG4gICAgICBnZXQ6IGdldCxcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGwoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWxsXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGxXaXRoVXNlcigpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VycycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFxuICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIHBhcnNlSW50KGlkKSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQG5hbWUgZ2V0QnlVc2VySWRcbiAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55IGJ5IHVzZXIgaWRcbiAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VyX2lkLycgKyBwYXJzZUludCh1c2VyX2lkKSApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY3JlYXRlXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb21wYW55KSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb21wYW55KSB7XG5cbiAgICAgIC8vcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgLy8gIHVybDogcm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCxcbiAgICAgIC8vICBmaWVsZHM6IGNvbXBhbnksXG4gICAgICAvLyAgZmlsZTogY29tcGFueS5maWxlLFxuICAgICAgLy8gIG1ldGhvZDogJ1BVVCdcbiAgICAgIC8vXG4gICAgICAvL30pO1xuXG4gICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGNvbXBhbnkuaWQsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgY29tcGFueSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkKTtcbiAgICB9XG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycpXG4gICAgLmRpcmVjdGl2ZSgnZmVsbG93Q2FyZCcsIGZlbGxvd0NhcmQpO1xuXG4gIC8vbmctZmVsbG93LWNhcmRcbiBmdW5jdGlvbiBmZWxsb3dDYXJkKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19jYXJkLmh0bWwnLyosXG4gICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgfSk7XG4gICAgICAgfSAqL1xuICAgIH07XG4gIH1cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dDb250cm9sbGVyJywgRmVsbG93Q29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnRmVsbG93cycsICdVc2VyJywgJ1ZvdGVzJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93Q29udHJvbGxlcigkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIEZlbGxvd3MsIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgICRzY29wZS52b3Rlc0ZvciA9IFtdO1xuICAgICAgICAkc2NvcGUudm90ZXNDYXN0ID0gW107XG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICBGZWxsb3dzLmdldCggJHJvdXRlUGFyYW1zLmZlbGxvd19pZCApLnN1Y2Nlc3MoZnVuY3Rpb24gKGZlbGxvdykge1xuXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgICAgICBVc2VyLmdldFZvdGVzKCBmZWxsb3cudXNlcl9pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gdm90ZXMudm90ZXNGb3I7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IHZvdGVzLnZvdGVzQ2FzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCAkc2NvcGUudm90ZXNGb3IubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHNjb3BlLnZvdGVzRm9yW2ldO1xuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50LmlkID09ICRzY29wZS5jdXJyZW50VXNlci5pZCApIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0NvbXBhbnkgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gKCAkc2NvcGUuY3VycmVudFVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGZlbGxvdykge1xuXG4gICAgICAgICAgICBpZiAoICRzY29wZS5pc0NvbXBhbnkoKSApIHtcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIFZvdGVzLmNyZWF0ZSgkc2NvcGUuY3VycmVudFVzZXIuaWQsIGZlbGxvdy51c2VyX2lkKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodm90ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdm90ZSApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm90ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIrZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NDb250cm9sbGVyJywgRmVsbG93c0NvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdGZWxsb3dzJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93c0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIEZlbGxvd3MpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3dzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChmZWxsb3cpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlbGxvdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmVsbG93cyBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyXG4gICAgICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JyxcbiAgICAgICAgJ1ZvdGVzJywgJ1VzZXInLCAnJHRpbWVvdXQnXTtcblxuICAgIGZ1bmN0aW9uIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmZWxsb3csIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGZlbGxvdyk7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuZmVsbG93KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogSG9tZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmVsbG93cyddO1xuXG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcbiAgKi9cbiAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlLCBGZWxsb3dzKSB7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgLy9GZWxsb3dzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZmVsbG93cyl7XG4gICAgLy9cbiAgICAvLyAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xuICAgIC8vfSk7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgaG9tZSBjb250cm9sbGVyIScpO1xuICAgICAgLy9Ib21lLmFsbCgpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c1xuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnKVxuICAgICAgICAuc2VydmljZSgnRmVsbG93cycsIEZlbGxvd3MpO1xuXG4gICAgRmVsbG93cy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1xuICAgICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3MoJGh0dHAsIFVwbG9hZCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFsbDogYWxsLFxuICAgICAgICAgICAgYWxsV2l0aFVzZXI6IGFsbFdpdGhVc2VyLFxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBnZXRCeVVzZXJJZDogZ2V0QnlVc2VySWQsXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGFsbFxuICAgICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGwoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgZmVsbG93cyB3aXRoIHRoZWlyIHVzZXIgYWNjb3VudCBpbmZvXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGxXaXRoVXNlcigpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VycycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXRCeVVzZXJJZFxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvdyBieSB1c2VyX2lkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRCeVVzZXJJZCh1c2VyX2lkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvdXNlcl9pZC8nICsgdXNlcl9pZCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGUoZmVsbG93KSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nLCBmZWxsb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICAgKiBAZGVzYyB1cGRhdGVzIGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGZlbGxvdykge1xuXG4gICAgICAgICAgICAvL3JldHVybiBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgIC8vICAgIHVybDogcm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGZlbGxvdy5pZCxcbiAgICAgICAgICAgIC8vICAgIGZpZWxkczogZmVsbG93LFxuICAgICAgICAgICAgLy8gICAgZmlsZTogZmVsbG93LmZpbGUsXG4gICAgICAgICAgICAvLyAgICBtZXRob2Q6ICdQVVQnXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy99KTtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLCBmZWxsb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAgICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBUYWdzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudGFncy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC50YWdzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnVGFnc0NvbnRyb2xsZXInLCBUYWdzQ29udHJvbGxlciApO1xuXG4gICAgVGFnc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnJG1vZGFsJywgJ1VzZXInLCAnVGFncycgXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVGFnc0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBUYWdzQ29udHJvbGxlciggJHNjb3BlLCAkbG9jYXRpb24sICRtb2RhbCwgVXNlciwgVGFncyApIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5uZXdUYWcgPSAnJztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJBZG1pbigpICkge1xuXG4gICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB0YWdzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudGFncyA9IHRhZ3M7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5hZGRUYWcgPSBmdW5jdGlvbiggbmV3VGFnICl7XG5cbiAgICAgICAgICAgIFRhZ3MuY3JlYXRlKCBuZXdUYWcgKS50aGVuKCBmdW5jdGlvbiggcmVzcG9uc2UgKXtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdUYWcgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5ld1RhZyA9ICcnO1xuICAgICAgICAgICAgICAgICRzY29wZS50YWdzLnVuc2hpZnQoIG5ld1RhZyApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmVkaXRUYWcgPSBmdW5jdGlvbiggdGFnICl7XG5cbiAgICAgICAgICAgIC8vIHNob3cgbW9kYWwgd2l0aCB0YWdcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3RhZ3MvcGFydGlhbHMvZWRpdC10YWctZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRhZzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5yZW1vdmVUYWcgPSBmdW5jdGlvbiggdGFnICl7XG5cbiAgICAgICAgICAgIHZhciBjID0gY29uZmlybSggXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIFwiICsgdGFnLm5hbWUgKyBcIj9cIik7XG5cbiAgICAgICAgICAgIGlmKCBjICl7XG5cbiAgICAgICAgICAgICAgICBUYWdzLmRlc3Ryb3koIHRhZy5pZCkudGhlbiggZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBub3cgdXBkYXRlIGF2YWlsYWJsZSB0YWdzXG4gICAgICAgICAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyggZnVuY3Rpb24oIHRhZ3MgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRhZ3MgPSB0YWdzO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhZ3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEVkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAndGFnJywgJ1RhZ3MnIF07XG4gICAgZnVuY3Rpb24gRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgdGFnLCBUYWdzKSB7XG5cbiAgICAgICAgJHNjb3BlLnRhZyA9IHRhZztcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgVGFncy51cGRhdGUoICRzY29wZS50YWcgKS50aGVuKGZ1bmN0aW9uKG5ld1RhZyl7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSggbmV3VGFnICk7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgLy8gZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gWyBcIlRoZXJlIHdhcyBhbiBlcnJvciB1cGRhdGluZyB0aGUgdGFnXCIgXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc1xuICogQG5hbWVzcGFjZSBhcHAudGFncy5zZXJ2aWNlc1xuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1RhZ3MnLCBUYWdzKTtcblxuICAgIFRhZ3MuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVGFnc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFRhZ3MoJGh0dHAsIENPTkZJRykge1xuXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgIGFsbDogYWxsLFxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXQgYWxsIHRhZ3NcbiAgICAgICAgICogQGRlc2MgZ2V0IGFsbCBwb3NzaWJsZSB0YWdzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGwoKXtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCggcm9vdFVybCArICcvYXBpL3YxL3RhZ3MnICk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0IGEgdGFnXG4gICAgICAgICAqIEBkZXNjIGdldCBhIHRhZyBieSB0YWdfaWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldCggdGFnX2lkICl7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJyArIHRhZ19pZCApO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXG4gICAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIHRhZyBieSBuYW1lXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGUoIG5hbWUgKSB7XG5cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJywge1xuXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZSBhIHRhZ1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCB0YWcgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJyArIHRhZy5pZCwgdGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgICAqIEBkZXNjIGRlc3Ryb3kgYSB2b3RlIHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyBpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcblxuIiwiLyoqXG4qIEFkbWluUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgQWRtaW5Qcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyRtb2RhbCcsICckd2luZG93JywgJ1VzZXInLCAnRmVsbG93cycsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuICAgICAqL1xuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCAkbW9kYWwsICR3aW5kb3csIFVzZXIsIEZlbGxvd3MsIENvbXBhbmllcykge1xuXG4gICAgICAgIC8vIFRPRE8gLSBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvciBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYW4gQWRtaW5cbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiQWRtaW5cIiApe1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBbXTtcbiAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IFtdO1xuICAgICAgICAkc2NvcGUudXNlckxpc3RMb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuZmVsbG93cy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBGZWxsb3dzLmFsbFdpdGhVc2VyKCkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93cykge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmNvbXBhbmllcy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBDb21wYW5pZXMuYWxsV2l0aFVzZXIoKS5zdWNjZXNzKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUudXNlckxpc3RMb2FkKCk7XG5cblxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZXMgPSBmdW5jdGlvbiggZmVsbG93ICl7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZmVsbG93LXZvdGVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmVsbG93O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jb21wYW55Vm90ZXMgPSBmdW5jdGlvbiggY29tcGFueSApe1xuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2NvbXBhbnktdm90ZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgICAgICAgICBjb21wYW55OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmVkaXRGZWxsb3cgPSBmdW5jdGlvbihmZWxsb3cpe1xuXG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZWRpdC1mZWxsb3ctZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZmVsbG93OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlbGxvdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmVkaXRDb21wYW55PSBmdW5jdGlvbihjb21wYW55KXtcblxuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2VkaXQtY29tcGFueS1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wYW55O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIEBUT0RPIC0gSW1wbGVtZW50IExhdGVyXG4gICAgICAgICRzY29wZS5hcmNoaXZlRmVsbG93ID0gZnVuY3Rpb24odXNlcil7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXJjaGl2ZSBVc2VyOiBcIit1c2VyLmlkKTtcbiAgICAgICAgICAgIC8vIHNlbmQgdXNlciBkYXRhIHRvIHNlcnZpY2VcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qIENyZWF0ZSBVc2VyICovXG4gICAgICAgICRzY29wZS5jcmVhdGVVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vbmV3LXVzZXItZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdJdGVtID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgIGlmKCBuZXdJdGVtLnVzZXIudXNlclR5cGUgPT09ICdGZWxsb3cnIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3dzLnVuc2hpZnQoIG5ld0l0ZW0gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiggbmV3SXRlbS51c2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcy51bnNoaWZ0KCBuZXdJdGVtICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUucmVtb3ZlRmVsbG93ID0gZnVuY3Rpb24oIGZlbGxvdyApe1xuXG4gICAgICAgICAgICB2YXIgYyA9IGNvbmZpcm0oIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBcIiArIGZlbGxvdy5maXJzdF9uYW1lICsgXCIgXCIgKyBmZWxsb3cubGFzdF9uYW1lICsgXCI/XCIpO1xuXG4gICAgICAgICAgICBpZiggYyApe1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGZlbGxvd1xuICAgICAgICAgICAgICAgIEZlbGxvd3MuZGVzdHJveSggZmVsbG93LmlkICkudGhlbiggZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBub3cgcmVtb3ZlIHVzZXJcbiAgICAgICAgICAgICAgICAgICAgVXNlci5kZXN0cm95KCBmZWxsb3cudXNlcl9pZCkudGhlbiggZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVsb2FkIHVzZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUucmVtb3ZlQ29tcGFueSA9IGZ1bmN0aW9uKCBjb21wYW55ICl7XG5cbiAgICAgICAgICAgIHZhciBjID0gY29uZmlybSggXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIFwiICsgY29tcGFueS5uYW1lICsgXCI/XCIpO1xuXG4gICAgICAgICAgICBpZiggYyApe1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGNvbXBhbnlcbiAgICAgICAgICAgICAgICBDb21wYW5pZXMuZGVzdHJveSggY29tcGFueS5pZCApLnRoZW4oIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbm93IHJlbW92ZSB1c2VyXG4gICAgICAgICAgICAgICAgICAgIFVzZXIuZGVzdHJveSggY29tcGFueS51c2VyX2lkKS50aGVuKCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZWxvYWQgdXNlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlcnNcbiAgICAgKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gICAgICovXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRGZWxsb3dNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEVkaXRGZWxsb3dNb2RhbEluc3RhbmNlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEVkaXRGZWxsb3dNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JywgJ1VzZXInLCAnRmVsbG93cycgXTtcbiAgICBmdW5jdGlvbiBFZGl0RmVsbG93TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdywgVXNlciwgRmVsbG93cykge1xuXG4gICAgICAgICRzY29wZS51c2VyID0gZmVsbG93LnVzZXI7XG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAkKFwiW25hbWU9J2VuYWJsZWQnXVwiKS5ib290c3RyYXBTd2l0Y2goe1xuXG4gICAgICAgICAgICAgICAgb25UZXh0OiBcIlZpc2libGVcIixcbiAgICAgICAgICAgICAgICBvZmZUZXh0OiBcIkhpZGRlblwiLFxuICAgICAgICAgICAgICAgIHN0YXRlOiAkc2NvcGUuZmVsbG93LmVuYWJsZWQsXG4gICAgICAgICAgICAgICAgb25Td2l0Y2hDaGFuZ2U6IGZ1bmN0aW9uIChldmVudCwgc3RhdGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93LmVuYWJsZWQgPSAoIHN0YXRlICkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgVXNlci51cGRhdGUoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24obmV3VXNlcil7XG5cbiAgICAgICAgICAgICAgICAvLyBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBuZXdVc2VyO1xuXG4gICAgICAgICAgICAgICAgLy8gdXNlciBpcyB1cGRhdGVkLCBzbyBub3cgdXBkYXRlIGZlbGxvd1xuICAgICAgICAgICAgICAgIEZlbGxvd3MudXBkYXRlKCAkc2NvcGUuZmVsbG93ICkudGhlbihmdW5jdGlvbihuZXdGZWxsb3cpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IG5ld0ZlbGxvdztcblxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gWyBcIlRoZXJlIHdhcyBhbiBlcnJvciB1cGRhdGluZyB0aGUgZmVsbG93XCIgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBmZWxsb3dcIiBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgRWRpdENvbXBhbnlNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnY29tcGFueScsICdVc2VyJywgJ0NvbXBhbmllcycgXTtcbiAgICBmdW5jdGlvbiBFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55LCBVc2VyLCBDb21wYW5pZXMpIHtcblxuICAgICAgICAkc2NvcGUudXNlciA9IGNvbXBhbnkudXNlcjtcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgJChcIltuYW1lPSdlbmFibGVkJ11cIikuYm9vdHN0cmFwU3dpdGNoKHtcblxuICAgICAgICAgICAgICAgIG9uVGV4dDogXCJWaXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgb2ZmVGV4dDogXCJIaWRkZW5cIixcbiAgICAgICAgICAgICAgICBzdGF0ZTogJHNjb3BlLmNvbXBhbnkuZW5hYmxlZCxcbiAgICAgICAgICAgICAgICBvblN3aXRjaENoYW5nZTogZnVuY3Rpb24gKGV2ZW50LCBzdGF0ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW55LmVuYWJsZWQgPSAoIHN0YXRlICkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgVXNlci51cGRhdGUoJHNjb3BlLnVzZXIpLnRoZW4oIGZ1bmN0aW9uKCBuZXdVc2VyICl7XG5cbiAgICAgICAgICAgICAgICAvLyBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBuZXdVc2VyO1xuXG4gICAgICAgICAgICAgICAgQ29tcGFuaWVzLnVwZGF0ZSgkc2NvcGUuY29tcGFueSkudGhlbiggZnVuY3Rpb24oIG5ld0NvbXBhbnkgKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gbmV3Q29tcGFueTtcblxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gWyBcIlRoZXJlIHdhcyBhbiBlcnJvciB1cGRhdGluZyB0aGUgY29tcGFueVwiIF07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBjb21wYW55XCIgXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUudXNlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIEZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdycgXTtcbiAgICBmdW5jdGlvbiBGZWxsb3dWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCAkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmZWxsb3cgKXtcblxuICAgICAgICAkc2NvcGUudXNlciA9IGZlbGxvdy51c2VyO1xuICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0ZvciB0byBzZWUgaWYgYSBjb21wYW55IHZvdGVkIGZvciBhIGZlbGxvd1xuICAgICAgICAkc2NvcGUuY29tcGFueVZvdGVkRm9yRmVsbG93ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGZlbGxvdy51c2VyLlZvdGVzRm9yLmxlbmd0aDsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdm90ZSA9IGZlbGxvdy51c2VyLlZvdGVzRm9yW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYoIHZvdGUuaWQgPT09IGNvbXBhbnlfdXNlcl9pZCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDaGVjayBmZWxsb3cgVm90ZXNDYXN0IHRvIHNlZSBpZiB0aGV5IHZvdGVkIGZvciBhIGNvbXBhbnlcbiAgICAgICAgJHNjb3BlLmZlbGxvd1ZvdGVkRm9yQ29tcGFueSA9IGZ1bmN0aW9uKCBjb21wYW55X3VzZXJfaWQgKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBmZWxsb3cudXNlci5Wb3Rlc0Nhc3QubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gZmVsbG93LnVzZXIuVm90ZXNDYXN0W2ldO1xuXG4gICAgICAgICAgICAgICAgaWYoIHZvdGUuaWQgPT09IGNvbXBhbnlfdXNlcl9pZCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnY29tcGFueScgXTtcbiAgICBmdW5jdGlvbiBDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlciggJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgY29tcGFueSApe1xuXG4gICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAvLyBDaGVjayBmZWxsb3cgVm90ZXNDYXN0IHRvIHNlZSBpZiB0aGV5IHZvdGVkIGZvciBhIGNvbXBhbnlcbiAgICAgICAgJHNjb3BlLmZlbGxvd1ZvdGVkRm9yQ29tcGFueSA9IGZ1bmN0aW9uKCBjb21wYW55X3VzZXJfaWQgKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBjb21wYW55LnVzZXIuVm90ZXNGb3IubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gY29tcGFueS51c2VyLlZvdGVzRm9yW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYoIHZvdGUuaWQgPT09IGNvbXBhbnlfdXNlcl9pZCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDaGVjayBmZWxsb3cgVm90ZXNGb3IgdG8gc2VlIGlmIGEgY29tcGFueSB2b3RlZCBmb3IgYSBmZWxsb3dcbiAgICAgICAgJHNjb3BlLmNvbXBhbnlWb3RlZEZvckZlbGxvdyA9IGZ1bmN0aW9uKCBjb21wYW55X3VzZXJfaWQgKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBjb21wYW55LnVzZXIuVm90ZXNDYXN0Lmxlbmd0aDsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdm90ZSA9IGNvbXBhbnkudXNlci5Wb3Rlc0Nhc3RbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnVXNlcicsICdGZWxsb3dzJywgJ0NvbXBhbmllcycgXTtcbiAgICBmdW5jdGlvbiBDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIFVzZXIsIEZlbGxvd3MsIENvbXBhbmllcykge1xuXG4gICAgICAgICRzY29wZS52ZXJpZnlfcGFzc3dvcmQgPSBcIlwiO1xuXG4gICAgICAgICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbiAodXNlcil7XG5cbiAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbXTtcblxuICAgICAgICAgICAgLy8gRm9ybSBpcyBiZWluZyB2YWxpZGF0ZWQgYnkgYW5ndWxhciwgYnV0IGxlYXZpbmcgdGhpcyBqdXN0IGluIGNhc2VcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdXNlciAgPT09IFwidW5kZWZpbmVkXCIpe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCBcIkFkZCBzb21lIGRhdGEgZmlyc3RcIiApO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgdXNlci5lbWFpbCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIFwiRW50ZXIgYW4gZW1haWxcIiApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgdXNlci5wYXNzd29yZCA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIFwiRW50ZXIgYSBwYXNzd29yZFwiICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyLnVzZXJUeXBlID09PSBcInVuZGVmaW5lZFwiICkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggXCJDaG9vc2UgYSB1c2VyIHR5cGVcIiApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCB1c2VyLnBhc3N3b3JkICE9PSAkc2NvcGUudmVyaWZ5X3Bhc3N3b3JkICl7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCBcIlBhc3N3b3JkcyBkbyBub3QgbWF0Y2hcIiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmVycm9ycy5sZW5ndGggPT09IDAgKXtcblxuICAgICAgICAgICAgICAgIC8vIHNlbmQgdXNlciB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgICAgICBVc2VyLmNyZWF0ZSh1c2VyKS50aGVuKCBmdW5jdGlvbihyZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB1c2VyIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHVzZXIgKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdXNlcl9pZCA9IHJlc3BvbnNlLmRhdGEuaWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiRmVsbG93XCIgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZlbGxvd19wb3N0ID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X25hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlcl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEZlbGxvd3MuY3JlYXRlKGZlbGxvd19wb3N0KS50aGVuKCBmdW5jdGlvbiggZmVsbG93ICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgZmVsbG93IHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggZmVsbG93ICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoIGZlbGxvdyApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiggcmVzcG9uc2UgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmZWxsb3cgZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzcG9uc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIHJlc3BvbnNlLmRhdGEuZXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wYW55X3Bvc3QgPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBDb21wYW5pZXMuY3JlYXRlKGNvbXBhbnlfcG9zdCkudGhlbiggZnVuY3Rpb24oIGNvbXBhbnkgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBjb21wYW55IHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSggY29tcGFueSApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiggcmVzcG9uc2UgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmZWxsb3cgZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzcG9uc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIHJlc3BvbnNlLmRhdGEuZXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiggcmVzcG9uc2UgKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdXNlciBlcnJvciBjYWxsYmFja1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXNwb25zZSApO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIHJlc3BvbnNlLmRhdGEuZXJyb3IgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdDb21wYW5pZXMnLCAnVXNlcicsICdUYWdzJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIENvbXBhbmllcywgVXNlciwgVGFncywgQWxlcnQpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAvLyRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50YWdUcmFuc2Zvcm0gPSBmdW5jdGlvbiAobmV3VGFnKSB7XG5cbiAgICAgICAgICAgIHZhciB0YWcgPSB7XG5cbiAgICAgICAgICAgICAgICBuYW1lOiBuZXdUYWdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIGN1cnJlbnQgdXNlciBpcyBhIENvbXBhbnlcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGFncyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBnZXRDb21wYW55KCkge1xuXG4gICAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAgIENvbXBhbmllcy5nZXRCeVVzZXJJZChjdXJyZW50VXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFueSkge1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAkc2NvcGUuY29tcGFueSApO1xuXG4gICAgICAgICAgICAgICAgJChcIltuYW1lPSdlbmFibGVkJ11cIikuYm9vdHN0cmFwU3dpdGNoKHtcblxuICAgICAgICAgICAgICAgICAgICBvblRleHQ6IFwiVmlzaWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBvZmZUZXh0OiBcIkhpZGRlblwiLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogY29tcGFueS5lbmFibGVkLFxuICAgICAgICAgICAgICAgICAgICBvblN3aXRjaENoYW5nZTogZnVuY3Rpb24gKGV2ZW50LCBzdGF0ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wYW55LmVuYWJsZWQgPSAoIHN0YXRlICkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgVGFncy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uICh0YWdzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRhZ3MgPSB0YWdzO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0Q29tcGFueSgpO1xuICAgICAgICAvLyRzY29wZS4kb24oICdsb2dpblN0YXR1c0NoYW5nZWQnLCAgZ2V0Q29tcGFueSk7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcbiAgICAgICAgICAgIC8vUHJvZmlsZS5hbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihjb21wYW55KSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGNvbXBhbnkudGFncyApO1xuXG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgICAgICBpZiggdHlwZW9mIGNvbXBhbnkuYmlvICE9ICd1bmRlZmluZWQnICYmIGNvbXBhbnkuYmlvICE9PSBudWxsIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGFueS5iaW8ubGVuZ3RoID4gMzUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIiNiaW9cIikuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiVGhlIGJpbyBmaWVsZCBjYW4gb25seSBiZSAzNTAgY2hhcmFjdGVycyBtYXhpbXVtXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCIjYmlvXCIpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGVycm9ycy5sZW5ndGggID09PSAwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBzZW5kIGNvbXBhbmllcyBpbmZvIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgICAgIENvbXBhbmllcy51cGRhdGUoY29tcGFueSkuc3VjY2VzcyhmdW5jdGlvbiAobmV3Q29tcGFueURhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAqKiBUcmlnZ2VyIFN1Y2Nlc3MgbWVzc2FnZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnkgPSBuZXdDb21wYW55RGF0YTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBoaWRlIHVwZGF0ZSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIEFsZXJ0LnNob3dBbGVydCgnWW91ciBwcm9maWxlIGhhcyBiZWVuIHVwZGF0ZWQnLCAnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFsZXJ0LnNob3dBbGVydCggZXJyb3JzLCAnZXJyb3InICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqIFMzIEZpbGUgdXBsb2FkaW5nICoqL1xuICAgICAgICAkc2NvcGUuZ2V0UzNLZXkgPSBmdW5jdGlvbigpe1xuXG5cbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZV9pbnB1dFwiKS5maWxlcztcbiAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbMF07XG5cbiAgICAgICAgICAgIGlmKGZpbGUgPT09IG51bGwpe1xuXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJObyBmaWxlIHNlbGVjdGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLVwiICsgJHNjb3BlLmNvbXBhbnkudXNlcl9pZCArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcIi9zaWduX3MzP2ZpbGVfbmFtZT1cIitmaWxlX25hbWUrXCImZmlsZV90eXBlPVwiK2ZpbGUudHlwZSk7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIGlmKHhoci5yZWFkeVN0YXRlID09PSA0KXtcblxuICAgICAgICAgICAgICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkX2ZpbGUoZmlsZSwgcmVzcG9uc2Uuc2lnbmVkX3JlcXVlc3QsIHJlc3BvbnNlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZ2V0IHNpZ25lZCBVUkwuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRfZmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKXtcblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4oXCJQVVRcIiwgc2lnbmVkX3JlcXVlc3QpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtYW16LWFjbCcsICdwdWJsaWMtcmVhZCcpO1xuXG4gICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWRpbmdcIikuc2hvdygpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gIFNldCBpbWFnZSBwcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJldmlld1wiKS5zcmMgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGNvbXBhbnkgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkuaW1hZ2VfdXJsID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFuZ3VsYXIgaXMgd2VpcmQgd2hlbiB1cGRhdGluZyBpbWFnZXMgdGhhdCBzdGFydGVkIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92aW5nIG5nLWhpZGUgdG8gZm9yY2UgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJldmlld1wiKS5yZW1vdmVDbGFzcygnbmctaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnVzZXItcGhvdG9cIikuZmluZChcIi5wbGFjZWhvbGRlclwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWRpbmdcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4qIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLCBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnRmVsbG93cycsICdUYWdzJywgJ1VzZXInLCAnUzMnLCAnQWxlcnQnIF07XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIEZlbGxvd3MsIFRhZ3MsIFVzZXIsIFMzLCBBbGVydCApIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiB0aGUgcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvZiBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnRhZ1RyYW5zZm9ybSA9IGZ1bmN0aW9uIChuZXdUYWcpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IHtcblxuICAgICAgICAgICAgICAgIG5hbWU6IG5ld1RhZ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgRmVsbG93XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGFncyA9IFtdO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldEZlbGxvdygpIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiR2V0IEZlbGxvd1wiICk7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgRmVsbG93cy5nZXRCeVVzZXJJZChjdXJyZW50VXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93KSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgICAgICAgICAgJChcIltuYW1lPSdlbmFibGVkJ11cIikuYm9vdHN0cmFwU3dpdGNoKHtcblxuICAgICAgICAgICAgICAgICAgICBvblRleHQ6IFwiVmlzaWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBvZmZUZXh0OiBcIkhpZGRlblwiLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZTogZmVsbG93LmVuYWJsZWQsXG4gICAgICAgICAgICAgICAgICAgIG9uU3dpdGNoQ2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQsIHN0YXRlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZlbGxvdy5lbmFibGVkID0gKCBzdGF0ZSApID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAodGFncykge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50YWdzID0gdGFncztcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0RmVsbG93KCk7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihmZWxsb3csIGZpbGUpIHtcblxuICAgICAgICAgICAgLy8gVE9ETyAtIHRoZXJlIGlzIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzIGVycm9yIGNoZWNraW5nXG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gW107XG4gICAgICAgICAgICBpZiggZmVsbG93LmJpby5sZW5ndGggPiAzNTAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCggXCIjYmlvXCIgKS5hZGRDbGFzcyggJ2Vycm9yJyApO1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKCBcIlRoZSBiaW8gZmllbGQgY2FuIG9ubHkgYmUgMzUwIGNoYXJhY3RlcnMgbWF4aW11bVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoIFwiI2Jpb1wiICkucmVtb3ZlQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGZlbGxvdy5pbnRlcmVzdHMubGVuZ3RoID4gMzUwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoIFwiI2ludGVyZXN0c1wiICkuYWRkQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCggXCJUaGUgaW50ZXJlc3RpbmcgdGhpbmdzIHlvdSBoYXZlIGNvZGVkIGZpZWxkIGNhbiBvbmx5IGJlIDM1MCBjaGFyYWN0ZXJzIG1heGltdW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCBcIiNpbnRlcmVzdHNcIiApLnJlbW92ZUNsYXNzKCAnZXJyb3InICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBmZWxsb3cuZGVzY3JpcHRpb24ubGVuZ3RoID4gMjUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCggXCIjZGVzY3JpcHRpb25cIiApLmFkZENsYXNzKCAnZXJyb3InICk7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goIFwiVGhlIHBocmFzZSBmaWVsZCBjYW4gb25seSBiZSAyNSBjaGFyYWN0ZXJzIG1heGltdW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCBcIiNkZXNjcmlwdGlvblwiICkucmVtb3ZlQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGZlbGxvdy5hbnN3ZXIubGVuZ3RoID4gMjUwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoIFwiI2Fuc3dlclwiICkuYWRkQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCggXCJUaGUgYW5zd2VyIGZpZWxkIGNhbiBvbmx5IGJlIDI1MCBjaGFyYWN0ZXJzIG1heGltdW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCBcIiNhbnN3ZXJcIiApLnJlbW92ZUNsYXNzKCAnZXJyb3InICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBlcnJvcnMubGVuZ3RoICA9PT0gMCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgLy8gc2VuZCBmZWxsb3dzIGluZm8gdG8gQVBJIHZpYSBTZXJ2aWNlXG4gICAgICAgICAgICAgICAgRmVsbG93cy51cGRhdGUoZmVsbG93KS5zdWNjZXNzKGZ1bmN0aW9uIChuZXdGZWxsb3dEYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gKiogVHJpZ2dlciBTdWNjZXNzIG1lc3NhZ2UgaGVyZVxuICAgICAgICAgICAgICAgICAgICBmZWxsb3cgPSBuZXdGZWxsb3dEYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZGUgdXBkYXRlIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgQWxlcnQuc2hvd0FsZXJ0KCdZb3VyIHByb2ZpbGUgaGFzIGJlZW4gdXBkYXRlZCcsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgQWxlcnQuc2hvd0FsZXJ0KCBlcnJvcnMsICdlcnJvcicgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiogUzMgRmlsZSB1cGxvYWRpbmcgKiovXG4gICAgICAgICRzY29wZS5nZXRTM0tleSA9IGZ1bmN0aW9uKCl7XG5cblxuICAgICAgICAgICAgdmFyIGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlX2lucHV0XCIpLmZpbGVzO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcblxuICAgICAgICAgICAgaWYoZmlsZSA9PT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIk5vIGZpbGUgc2VsZWN0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKXtcblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICAvLyBUcnlpbmcgdG8gcHJldmVudCBuYW1pbmcgY29sbGlzaW9ucyBieSBhcHBlbmRpbmcgdGhlIHVuaXF1ZSB1c2VyX2lkIHRvIGZpbGUgbmFtZVxuICAgICAgICAgICAgLy8gLS0gcmVtb3ZlIGFuZCBzYXZlIHRoZSBleHRlbnNpb24gLSBzaG91bGQgYmUgdGhlIGxhc3QgcGFydFxuICAgICAgICAgICAgLy8gLS0gd2FudCB0byBtYWtlIHN1cmUgd2UgYWxsb3cgLiBpbiB0aGUgZmlsZW5hbWUgb3V0c2lkZSBvZiBleHRlbnNpb25cbiAgICAgICAgICAgIHZhciBwaWVjZXMgPSBmaWxlLm5hbWUuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgdmFyIGV4dGVuc2lvbiA9IHBpZWNlcy5wb3AoKTtcbiAgICAgICAgICAgIHZhciBmaWxlX25hbWUgPSBwaWVjZXMuam9pbihcIi5cIikgKyBcIi1cIiArICRzY29wZS5mZWxsb3cudXNlcl9pZCArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcIi9zaWduX3MzP2ZpbGVfbmFtZT1cIitmaWxlX25hbWUrXCImZmlsZV90eXBlPVwiK2ZpbGUudHlwZSk7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIGlmKHhoci5yZWFkeVN0YXRlID09PSA0KXtcblxuICAgICAgICAgICAgICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkX2ZpbGUoZmlsZSwgcmVzcG9uc2Uuc2lnbmVkX3JlcXVlc3QsIHJlc3BvbnNlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZ2V0IHNpZ25lZCBVUkwuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRfZmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKXtcblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4oXCJQVVRcIiwgc2lnbmVkX3JlcXVlc3QpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtYW16LWFjbCcsICdwdWJsaWMtcmVhZCcpO1xuXG4gICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWRpbmdcIikuc2hvdygpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gIFNldCBpbWFnZSBwcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJldmlld1wiKS5zcmMgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGZlbGxvdyBtb2RlbFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93LmltYWdlX3VybCA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBbmd1bGFyIGlzIHdlaXJkIHdoZW4gdXBkYXRpbmcgaW1hZ2VzIHRoYXQgc3RhcnRlZCB3aXRoIGFuIGVtcHR5IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmluZyBuZy1oaWRlIHRvIGZvcmNlIHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAkKFwiI3ByZXZpZXdcIikucmVtb3ZlQ2xhc3MoJ25nLWhpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIi51c2VyLXBob3RvXCIpLmZpbmQoXCIucGxhY2Vob2xkZXJcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWQtc3RhdHVzXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkaW5nXCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgdXBsb2FkIGZpbGUuXCIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLnNlbmQoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4qIFByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gIC5jb250cm9sbGVyKCdQcm9maWxlQ29udHJvbGxlcicsIFByb2ZpbGVDb250cm9sbGVyKTtcblxuICBQcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInXTtcbiAgLyoqXG4gICogQG5hbWVzcGFjZSBQcm9maWxlQ29udHJvbGxlclxuICAqL1xuICBmdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlcikge1xuXG4gICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgLy8gcmVkaXJlY3QgdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgdHlwZVxuICAgICAgICAgIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0FkbWluJykge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTGlrZSBhIGJvc3NcIik7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGUvYWRtaW5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnRmVsbG93Jykge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTGlrZSBhIGZlbGxhXCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2ZlbGxvd1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdDb21wYW55Jykge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTGlrZSBhIGNvbXBhbnlcIik7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGUvY29tcGFueVwiKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNle1xuXG4gICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgIH1cblxuICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogUzNcbiAqIEBuYW1lc3BhY2UgYXBwLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gQFRPRE8gLS0gSW1wbGVtZW50IHRoZSBTMyBzZXJ2aWNlXG5cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnKVxuICAgICAgICAuc2VydmljZSgnUzMnLCBTMyk7XG5cbiAgICBTMy4kaW5qZWN0ID0gWyckaHR0cCcsICdDT05GSUcnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUzNcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTMygkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgZ2V0UzNLZXk6IGdldFMzS2V5LFxuICAgICAgICAgICAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gR2V0IHRoZSBpbWFnZSBmaWxlIGFuZCB0cmlnZ2VyIHJlcXVlc3QgdG8gUzNcbiAgICAgICAgZnVuY3Rpb24gZ2V0UzNLZXkoIGZpbGUsIHVzZXJfaWQgKXtcblxuICAgICAgICAgICAgaWYoZmlsZSAhPT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICAvLyBUcnlpbmcgdG8gcHJldmVudCBuYW1pbmcgY29sbGlzaW9ucyBieSBhcHBlbmRpbmcgdGhlIHVuaXF1ZSB1c2VyX2lkIHRvIGZpbGUgbmFtZVxuICAgICAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgIHZhciBwaWVjZXMgPSBmaWxlLm5hbWUuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHVzZXJfaWQgKyBcIi1cIiArIHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcblxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlXG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdHVhbGx5IHVwbG9hZCB0aGUgbmV3IGZpbGUgdG8gUzNcbiAgICAgICAgLy8gLS0gcHV0cyB0aGUgbmV3IHVybCBpbiBhIGhpZGRlbiBmb3JtIGVsZW1lbnRcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkRmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKXtcblxuICAgICAgICAgICAgLy8gKiogVEhJUyBET0VTIE5PVCBXT1JLICoqL1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgICAgICB1cmw6IHNpZ25lZF9yZXF1ZXN0LFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYW16LWFjbCc6ICdwdWJsaWMtcmVhZCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IGZpbGUsXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZpbGUudHlwZVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy92YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAvL3hoci5vcGVuKFwiUFVUXCIsIHNpZ25lZF9yZXF1ZXN0KTtcbiAgICAgICAgICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtYW16LWFjbCcsICdwdWJsaWMtcmVhZCcpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8veGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgICAgIC8vICAgIH1cbiAgICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL3hoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgYWxlcnQoXCJDb3VsZCBub3QgdXBsb2FkIGZpbGUuXCIpO1xuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8veGhyLnNlbmQoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiAqIFByb2ZpbGVcbiAqIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXG4gICAgLmZhY3RvcnkoJ1VzZXInLCBVc2VyKTtcblxuICBVc2VyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJGh0dHAnLCAnQ09ORklHJ107XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgVXNlclxuICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICovXG4gIGZ1bmN0aW9uIFVzZXIoJHJvb3RTY29wZSwgJGh0dHAsIENPTkZJRykge1xuXG4gICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgLy8gV2lsbCBob2xkIGluZm8gZm9yIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXJcbiAgICAgIHZhciBjdXJyZW50VXNlciA9IHt9O1xuXG4gICAgICBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpIHtcblxuICAgICAgICAgIHJldHVybiBjdXJyZW50VXNlcjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFVzZXIodXNlcikge1xuXG4gICAgICAgICAgY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRWb3RlcyggdXNlcl9pZCApe1xuXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdXNlcnMvJyArIHVzZXJfaWQgKyAnL3ZvdGVzJyApO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGxvZ2luXG4gICAgICAgKiBAZGVzYyBsb2dpbiBhIG5ldyB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBsb2dpbih1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2xvZ2luJywgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAvL2FsbDogYWxsLFxuICAgICAgICAgIC8vZ2V0OiBnZXQsXG4gICAgICAgICAgZ2V0Vm90ZXM6IGdldFZvdGVzLFxuICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICBkZXN0cm95OiBkZXN0cm95LFxuICAgICAgICAgIFNldENyZWRlbnRpYWxzOiBTZXRDcmVkZW50aWFscyxcbiAgICAgICAgICBDbGVhckNyZWRlbnRpYWxzOiBDbGVhckNyZWRlbnRpYWxzLFxuICAgICAgICAgIGdldEN1cnJlbnRVc2VyOiBnZXRDdXJyZW50VXNlcixcbiAgICAgICAgICBzZXRDdXJyZW50VXNlcjogc2V0Q3VycmVudFVzZXIsXG4gICAgICAgICAgaXNVc2VyTG9nZ2VkSW46IGlzVXNlckxvZ2dlZEluLFxuICAgICAgICAgIGlzVXNlckFkbWluOiBpc1VzZXJBZG1pbixcbiAgICAgICAgICBpc1VzZXJGZWxsb3c6IGlzVXNlckZlbGxvdyxcbiAgICAgICAgICBpc1VzZXJDb21wYW55OiBpc1VzZXJDb21wYW55XG4gICAgICB9O1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSB1c2Vyc1xuICAgICAgICovXG4gICAgICAvL2Z1bmN0aW9uIGFsbCgpIHtcbiAgICAgIC8vXG4gICAgICAvLyAgICByZXR1cm4gW107XG4gICAgICAvL1xuICAgICAgLy8gICAgLy9yZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBnZXRcbiAgICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSB1c2VyXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICAvLyAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIG5ldyB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGUodXNlcikge1xuXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2NyZWF0ZScsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICogQGRlc2MgdXBkYXRlYSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlci5pZCwgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICogQGRlc2MgZGVzdHJveSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyByb290VXJsICsgJy9hcGkvdjEvdXNlcnMvJyArIGlkKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyTG9nZ2VkSW4oKXtcblxuICAgICAgICAgIGlmKCBPYmplY3Qua2V5cyhjdXJyZW50VXNlcikubGVuZ3RoID4gMCApe1xuXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyQWRtaW4oKXtcblxuICAgICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0FkbWluJyApXG4gICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzVXNlckZlbGxvdygpe1xuXG4gICAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnRmVsbG93JyApXG4gICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzVXNlckNvbXBhbnkoKXtcblxuICAgICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gU2V0Q3JlZGVudGlhbHMoaWQsIHVzZXJuYW1lLCB1c2VyVHlwZSkge1xuXG4gICAgICAgICAgdmFyIGF1dGhkYXRhID0gQmFzZTY0LmVuY29kZShpZCArICc6JyArIHVzZXJuYW1lICsgJzonICsgdXNlclR5cGUpO1xuXG4gICAgICAgICAgY3VycmVudFVzZXIgPSB7XG4gICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICB1c2VyVHlwZTogdXNlclR5cGUsXG4gICAgICAgICAgICAgIGF1dGhkYXRhOiBhdXRoZGF0YVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBsb2dpblN0YXR1c0NoYW5nZWQoKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gQ2xlYXJDcmVkZW50aWFscygpIHtcblxuICAgICAgICAgICRodHRwLmdldCggcm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2xvZ291dCcgKS50aGVuKCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgIGN1cnJlbnRVc2VyID0ge307XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBsb2dpblN0YXR1c0NoYW5nZWQoKTtcbiAgICAgIH1cblxuXG4gICAgICBmdW5jdGlvbiBsb2dpblN0YXR1c0NoYW5nZWQoKSB7XG5cbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvZ2luU3RhdHVzQ2hhbmdlZCcpO1xuICAgICAgfVxuXG4gIH1cblxuICAvLyBCYXNlNjQgZW5jb2Rpbmcgc2VydmljZSB1c2VkIGJ5IEF1dGhlbnRpY2F0aW9uU2VydmljZVxuICB2YXIgQmFzZTY0ID0ge1xuXG4gICAga2V5U3RyOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nLFxuXG4gICAgZW5jb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgICAgdmFyIGNocjEsIGNocjIsIGNocjMgPSBcIlwiO1xuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGNocjEgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGNocjIgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGNocjMgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG5cbiAgICAgICAgZW5jMSA9IGNocjEgPj4gMjtcbiAgICAgICAgZW5jMiA9ICgoY2hyMSAmIDMpIDw8IDQpIHwgKGNocjIgPj4gNCk7XG4gICAgICAgIGVuYzMgPSAoKGNocjIgJiAxNSkgPDwgMikgfCAoY2hyMyA+PiA2KTtcbiAgICAgICAgZW5jNCA9IGNocjMgJiA2MztcblxuICAgICAgICBpZiAoaXNOYU4oY2hyMikpIHtcbiAgICAgICAgICBlbmMzID0gZW5jNCA9IDY0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKGNocjMpKSB7XG4gICAgICAgICAgZW5jNCA9IDY0O1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMSkgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMyKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzMpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jNCk7XG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xuICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSxcblxuICAgIGRlY29kZTogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcbiAgICAgIHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgLy8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XG4gICAgICB2YXIgYmFzZTY0dGVzdCA9IC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZztcbiAgICAgIGlmIChiYXNlNjR0ZXN0LmV4ZWMoaW5wdXQpKSB7XG4gICAgICAgIHdpbmRvdy5hbGVydChcIlRoZXJlIHdlcmUgaW52YWxpZCBiYXNlNjQgY2hhcmFjdGVycyBpbiB0aGUgaW5wdXQgdGV4dC5cXG5cIiArXG4gICAgICAgICAgICBcIlZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGFyZSBBLVosIGEteiwgMC05LCAnKycsICcvJyxhbmQgJz0nXFxuXCIgK1xuICAgICAgICAgICAgXCJFeHBlY3QgZXJyb3JzIGluIGRlY29kaW5nLlwiKTtcbiAgICAgIH1cbiAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9cXD1dL2csIFwiXCIpO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGVuYzEgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jMiA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMzID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzQgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcblxuICAgICAgICBjaHIxID0gKGVuYzEgPDwgMikgfCAoZW5jMiA+PiA0KTtcbiAgICAgICAgY2hyMiA9ICgoZW5jMiAmIDE1KSA8PCA0KSB8IChlbmMzID4+IDIpO1xuICAgICAgICBjaHIzID0gKChlbmMzICYgMykgPDwgNikgfCBlbmM0O1xuXG4gICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMSk7XG5cbiAgICAgICAgaWYgKGVuYzMgIT0gNjQpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmM0ICE9IDY0KSB7XG4gICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xuXG4gICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gIH07XG5cbn0pKCk7XG4iLCIvKipcbiAqIFZvdGVzXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5zZXJ2aWNlc1xuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdWb3RlcycsIFZvdGVzKTtcblxuICAgIFZvdGVzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gVm90ZXMoJGh0dHAsIENPTkZJRykge1xuXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldCB2b3Rlc1xuICAgICAgICAgKiBAZGVzYyBnZXQgdGhlIHZvdGVzIGZvciBhIHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldCggdm90ZXJfaWQgKXtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJyArIHZvdGVyX2lkICk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAgICogQGRlc2MgY2FzdCBhIHZvdGUgZm9yIGEgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKCB2b3Rlcl9pZCwgdm90ZWVfaWQgKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHZvdGVyX2lkICsgXCIgXCIgKyB2b3RlZV9pZCApO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJywge1xuXG4gICAgICAgICAgICAgICAgdm90ZXJfaWQ6IHZvdGVyX2lkLFxuICAgICAgICAgICAgICAgIHZvdGVlX2lkOiB2b3RlZV9pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdm90ZSByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJyArIGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59KSgpO1xuXG4iLCIvKipcbiAqIEFkbWluVm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ0FkbWluVm90ZXNDb250cm9sbGVyJywgQWRtaW5Wb3Rlc0NvbnRyb2xsZXIgKTtcblxuICAgIEFkbWluVm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEFkbWluVm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnQ29tcGFueVZvdGVzQ29udHJvbGxlcicsIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXIgKTtcblxuICAgIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQ29tcGFueVZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICBWb3Rlcy5nZXQoICRzY29wZS5jdXJyZW50VXNlci5pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzID0gdm90ZXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUucmVtb3ZlVm90ZSA9IGZ1bmN0aW9uKCB2b3RlICl7XG5cbiAgICAgICAgICAgIC8vIGJlIHN1cmUgaXQgd2Fzbid0IGFuIGFjY2lkZW50YWwgY2xpY2tcbiAgICAgICAgICAgIHZhciBjID0gY29uZmlybSggXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcmVtb3ZlIHlvdXIgdm90ZT9cIik7XG4gICAgICAgICAgICBpZiggIWMgKSByZXR1cm47XG5cbiAgICAgICAgICAgIFZvdGVzLmRlc3Ryb3koIHZvdGUuaWQgKS50aGVuKCBmdW5jdGlvbiggcmVzcG9uc2UgKXtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB2b3RlIGZyb20gJHNjb3RlLnZvdGVzXG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7ICRzY29wZS52b3Rlcy5sZW5ndGg7IGkrKyApe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJHNjb3BlLnZvdGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCBpdGVtLmlkID09PSB2b3RlLmlkICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS52b3Rlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93Vm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ0ZlbGxvd1ZvdGVzQ29udHJvbGxlcicsIEZlbGxvd1ZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgRmVsbG93Vm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd1ZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICBWb3Rlcy5nZXQoICRzY29wZS5jdXJyZW50VXNlci5pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzID0gdm90ZXM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5yZW1vdmVWb3RlID0gZnVuY3Rpb24oIHZvdGUgKXtcblxuICAgICAgICAgICAgLy8gYmUgc3VyZSBpdCB3YXNuJ3QgYW4gYWNjaWRlbnRhbCBjbGlja1xuICAgICAgICAgICAgdmFyIGMgPSBjb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgeW91ciB2b3RlP1wiKTtcbiAgICAgICAgICAgIGlmKCAhYyApIHJldHVybjtcblxuICAgICAgICAgICAgVm90ZXMuZGVzdHJveSggdm90ZS5pZCApLnRoZW4oIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHZvdGUgZnJvbSAkc2NvdGUudm90ZXNcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgJHNjb3BlLnZvdGVzLmxlbmd0aDsgaSsrICl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkc2NvcGUudm90ZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGl0ZW0uaWQgPT09IHZvdGUuaWQgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ1ZvdGVzQ29udHJvbGxlcicsIFZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgVm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgLy8gcmVkaXJlY3QgdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgdHlwZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdm90ZXMvYWRtaW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9mZWxsb3dcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdm90ZXMvY29tcGFueVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qISA3LjMuOSAqL1xuIXdpbmRvdy5YTUxIdHRwUmVxdWVzdHx8d2luZG93LkZpbGVBUEkmJkZpbGVBUEkuc2hvdWxkTG9hZHx8KHdpbmRvdy5YTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2V0UmVxdWVzdEhlYWRlcj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYixjKXtpZihcIl9fc2V0WEhSX1wiPT09Yil7dmFyIGQ9Yyh0aGlzKTtkIGluc3RhbmNlb2YgRnVuY3Rpb24mJmQodGhpcyl9ZWxzZSBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KHdpbmRvdy5YTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2V0UmVxdWVzdEhlYWRlcikpO3ZhciBuZ0ZpbGVVcGxvYWQ9YW5ndWxhci5tb2R1bGUoXCJuZ0ZpbGVVcGxvYWRcIixbXSk7bmdGaWxlVXBsb2FkLnZlcnNpb249XCI3LjMuOVwiLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkQmFzZVwiLFtcIiRodHRwXCIsXCIkcVwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChkKXtmdW5jdGlvbiBnKGEpe2oubm90aWZ5JiZqLm5vdGlmeShhKSxrLnByb2dyZXNzRnVuYyYmYyhmdW5jdGlvbigpe2sucHJvZ3Jlc3NGdW5jKGEpfSl9ZnVuY3Rpb24gaChhKXtyZXR1cm4gbnVsbCE9ZC5fc3RhcnQmJmY/e2xvYWRlZDphLmxvYWRlZCtkLl9zdGFydCx0b3RhbDpkLl9maWxlLnNpemUsdHlwZTphLnR5cGUsY29uZmlnOmQsbGVuZ3RoQ29tcHV0YWJsZTohMCx0YXJnZXQ6YS50YXJnZXR9OmF9ZnVuY3Rpb24gaSgpe2EoZCkudGhlbihmdW5jdGlvbihhKXtmJiZkLl9jaHVua1NpemUmJiFkLl9maW5pc2hlZD8oZyh7bG9hZGVkOmQuX2VuZCx0b3RhbDpkLl9maWxlLnNpemUsY29uZmlnOmQsdHlwZTpcInByb2dyZXNzXCJ9KSxlLnVwbG9hZChkKSk6KGQuX2ZpbmlzaGVkJiZkZWxldGUgZC5fZmluaXNoZWQsai5yZXNvbHZlKGEpKX0sZnVuY3Rpb24oYSl7ai5yZWplY3QoYSl9LGZ1bmN0aW9uKGEpe2oubm90aWZ5KGEpfSl9ZC5tZXRob2Q9ZC5tZXRob2R8fFwiUE9TVFwiLGQuaGVhZGVycz1kLmhlYWRlcnN8fHt9O3ZhciBqPWQuX2RlZmVycmVkPWQuX2RlZmVycmVkfHxiLmRlZmVyKCksaz1qLnByb21pc2U7cmV0dXJuIGQuaGVhZGVycy5fX3NldFhIUl89ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYSl7YSYmKGQuX19YSFI9YSxkLnhockZuJiZkLnhockZuKGEpLGEudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLGZ1bmN0aW9uKGEpe2EuY29uZmlnPWQsZyhoKGEpKX0sITEpLGEudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oYSl7YS5sZW5ndGhDb21wdXRhYmxlJiYoYS5jb25maWc9ZCxnKGgoYSkpKX0sITEpKX19LGY/ZC5fY2h1bmtTaXplJiZkLl9lbmQmJiFkLl9maW5pc2hlZD8oZC5fc3RhcnQ9ZC5fZW5kLGQuX2VuZCs9ZC5fY2h1bmtTaXplLGkoKSk6ZC5yZXN1bWVTaXplVXJsP2EuZ2V0KGQucmVzdW1lU2l6ZVVybCkudGhlbihmdW5jdGlvbihhKXtkLl9zdGFydD1kLnJlc3VtZVNpemVSZXNwb25zZVJlYWRlcj9kLnJlc3VtZVNpemVSZXNwb25zZVJlYWRlcihhLmRhdGEpOnBhcnNlSW50KChudWxsPT1hLmRhdGEuc2l6ZT9hLmRhdGE6YS5kYXRhLnNpemUpLnRvU3RyaW5nKCkpLGQuX2NodW5rU2l6ZSYmKGQuX2VuZD1kLl9zdGFydCtkLl9jaHVua1NpemUpLGkoKX0sZnVuY3Rpb24oYSl7dGhyb3cgYX0pOmQucmVzdW1lU2l6ZT9kLnJlc3VtZVNpemUoKS50aGVuKGZ1bmN0aW9uKGEpe2QuX3N0YXJ0PWEsaSgpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6aSgpOmkoKSxrLnN1Y2Nlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGsudGhlbihmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsZCl9KSxrfSxrLmVycm9yPWZ1bmN0aW9uKGEpe3JldHVybiBrLnRoZW4obnVsbCxmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsZCl9KSxrfSxrLnByb2dyZXNzPWZ1bmN0aW9uKGEpe3JldHVybiBrLnByb2dyZXNzRnVuYz1hLGsudGhlbihudWxsLG51bGwsZnVuY3Rpb24oYil7YShiKX0pLGt9LGsuYWJvcnQ9ay5wYXVzZT1mdW5jdGlvbigpe3JldHVybiBkLl9fWEhSJiZjKGZ1bmN0aW9uKCl7ZC5fX1hIUi5hYm9ydCgpfSksa30say54aHI9ZnVuY3Rpb24oYSl7cmV0dXJuIGQueGhyRm49ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKCl7YiYmYi5hcHBseShrLGFyZ3VtZW50cyksYS5hcHBseShrLGFyZ3VtZW50cyl9fShkLnhockZuKSxrfSxrfXZhciBlPXRoaXM7dGhpcy5pc1Jlc3VtZVN1cHBvcnRlZD1mdW5jdGlvbigpe3JldHVybiB3aW5kb3cuQmxvYiYmKG5ldyBCbG9iKS5zbGljZX07dmFyIGY9dGhpcy5pc1Jlc3VtZVN1cHBvcnRlZCgpO3RoaXMudXBsb2FkPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYyxkLGUpe2lmKHZvaWQgMCE9PWQpaWYoYW5ndWxhci5pc0RhdGUoZCkmJihkPWQudG9JU09TdHJpbmcoKSksYW5ndWxhci5pc1N0cmluZyhkKSljLmFwcGVuZChlLGQpO2Vsc2UgaWYoXCJmb3JtXCI9PT1hLnNlbmRGaWVsZHNBcylpZihhbmd1bGFyLmlzT2JqZWN0KGQpKWZvcih2YXIgZiBpbiBkKWQuaGFzT3duUHJvcGVydHkoZikmJmIoYyxkW2ZdLGUrXCJbXCIrZitcIl1cIik7ZWxzZSBjLmFwcGVuZChlLGQpO2Vsc2UgZD1hbmd1bGFyLmlzU3RyaW5nKGQpP2Q6YW5ndWxhci50b0pzb24oZCksXCJqc29uLWJsb2JcIj09PWEuc2VuZEZpZWxkc0FzP2MuYXBwZW5kKGUsbmV3IEJsb2IoW2RdLHt0eXBlOlwiYXBwbGljYXRpb24vanNvblwifSkpOmMuYXBwZW5kKGUsZCl9ZnVuY3Rpb24gYyhhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIEJsb2J8fGEuZmxhc2hJZCYmYS5uYW1lJiZhLnNpemV9ZnVuY3Rpb24gZyhiLGQsZSl7aWYoYyhkKSl7aWYoYS5fZmlsZT1hLl9maWxlfHxkLG51bGwhPWEuX3N0YXJ0JiZmKXthLl9lbmQmJmEuX2VuZD49ZC5zaXplJiYoYS5fZmluaXNoZWQ9ITAsYS5fZW5kPWQuc2l6ZSk7dmFyIGg9ZC5zbGljZShhLl9zdGFydCxhLl9lbmR8fGQuc2l6ZSk7aC5uYW1lPWQubmFtZSxkPWgsYS5fY2h1bmtTaXplJiYoYi5hcHBlbmQoXCJjaHVua1NpemVcIixhLl9lbmQtYS5fc3RhcnQpLGIuYXBwZW5kKFwiY2h1bmtOdW1iZXJcIixNYXRoLmZsb29yKGEuX3N0YXJ0L2EuX2NodW5rU2l6ZSkpLGIuYXBwZW5kKFwidG90YWxTaXplXCIsYS5fZmlsZS5zaXplKSl9Yi5hcHBlbmQoZSxkLGQuZmlsZU5hbWV8fGQubmFtZSl9ZWxzZXtpZighYW5ndWxhci5pc09iamVjdChkKSl0aHJvd1wiRXhwZWN0ZWQgZmlsZSBvYmplY3QgaW4gVXBsb2FkLnVwbG9hZCBmaWxlIG9wdGlvbjogXCIrZC50b1N0cmluZygpO2Zvcih2YXIgaSBpbiBkKWlmKGQuaGFzT3duUHJvcGVydHkoaSkpe3ZhciBqPWkuc3BsaXQoXCIsXCIpO2pbMV0mJihkW2ldLmZpbGVOYW1lPWpbMV0ucmVwbGFjZSgvXlxccyt8XFxzKyQvZyxcIlwiKSksZyhiLGRbaV0salswXSl9fX1yZXR1cm4gYS5fY2h1bmtTaXplPWUudHJhbnNsYXRlU2NhbGFycyhhLnJlc3VtZUNodW5rU2l6ZSksYS5fY2h1bmtTaXplPWEuX2NodW5rU2l6ZT9wYXJzZUludChhLl9jaHVua1NpemUudG9TdHJpbmcoKSk6bnVsbCxhLmhlYWRlcnM9YS5oZWFkZXJzfHx7fSxhLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl09dm9pZCAwLGEudHJhbnNmb3JtUmVxdWVzdD1hLnRyYW5zZm9ybVJlcXVlc3Q/YW5ndWxhci5pc0FycmF5KGEudHJhbnNmb3JtUmVxdWVzdCk/YS50cmFuc2Zvcm1SZXF1ZXN0OlthLnRyYW5zZm9ybVJlcXVlc3RdOltdLGEudHJhbnNmb3JtUmVxdWVzdC5wdXNoKGZ1bmN0aW9uKGMpe3ZhciBkLGU9bmV3IEZvcm1EYXRhLGY9e307Zm9yKGQgaW4gYS5maWVsZHMpYS5maWVsZHMuaGFzT3duUHJvcGVydHkoZCkmJihmW2RdPWEuZmllbGRzW2RdKTtjJiYoZi5kYXRhPWMpO2ZvcihkIGluIGYpaWYoZi5oYXNPd25Qcm9wZXJ0eShkKSl7dmFyIGg9ZltkXTthLmZvcm1EYXRhQXBwZW5kZXI/YS5mb3JtRGF0YUFwcGVuZGVyKGUsZCxoKTpiKGUsaCxkKX1pZihudWxsIT1hLmZpbGUpaWYoYW5ndWxhci5pc0FycmF5KGEuZmlsZSkpZm9yKHZhciBpPTA7aTxhLmZpbGUubGVuZ3RoO2krKylnKGUsYS5maWxlW2ldLFwiZmlsZVwiKTtlbHNlIGcoZSxhLmZpbGUsXCJmaWxlXCIpO3JldHVybiBlfSksZChhKX0sdGhpcy5odHRwPWZ1bmN0aW9uKGIpe3JldHVybiBiLnRyYW5zZm9ybVJlcXVlc3Q9Yi50cmFuc2Zvcm1SZXF1ZXN0fHxmdW5jdGlvbihiKXtyZXR1cm4gd2luZG93LkFycmF5QnVmZmVyJiZiIGluc3RhbmNlb2Ygd2luZG93LkFycmF5QnVmZmVyfHxiIGluc3RhbmNlb2YgQmxvYj9iOmEuZGVmYXVsdHMudHJhbnNmb3JtUmVxdWVzdFswXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGIuX2NodW5rU2l6ZT1lLnRyYW5zbGF0ZVNjYWxhcnMoYi5yZXN1bWVDaHVua1NpemUpLGIuX2NodW5rU2l6ZT1iLl9jaHVua1NpemU/cGFyc2VJbnQoYi5fY2h1bmtTaXplLnRvU3RyaW5nKCkpOm51bGwsZChiKX0sdGhpcy50cmFuc2xhdGVTY2FsYXJzPWZ1bmN0aW9uKGEpe2lmKGFuZ3VsYXIuaXNTdHJpbmcoYSkpe2lmKGEuc2VhcmNoKC9rYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWUzKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9tYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWU2KmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9nYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWU5KmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9iL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvcy9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL20vaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDYwKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9oL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdCgzNjAwKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpfXJldHVybiBhfSx0aGlzLnNldERlZmF1bHRzPWZ1bmN0aW9uKGEpe3RoaXMuZGVmYXVsdHM9YXx8e319LHRoaXMuZGVmYXVsdHM9e30sdGhpcy52ZXJzaW9uPW5nRmlsZVVwbG9hZC52ZXJzaW9ufV0pLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGNvbXBpbGVcIixcIlVwbG9hZFJlc2l6ZVwiLGZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWQ7cmV0dXJuIGUuZ2V0QXR0cldpdGhEZWZhdWx0cz1mdW5jdGlvbihhLGIpe3JldHVybiBudWxsIT1hW2JdP2FbYl06bnVsbD09ZS5kZWZhdWx0c1tiXT9lLmRlZmF1bHRzW2JdOmUuZGVmYXVsdHNbYl0udG9TdHJpbmcoKX0sZS5hdHRyR2V0dGVyPWZ1bmN0aW9uKGIsYyxkLGUpe2lmKCFkKXJldHVybiB0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKTt0cnl7cmV0dXJuIGU/YSh0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKSkoZCxlKTphKHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpKShkKX1jYXRjaChmKXtpZihiLnNlYXJjaCgvbWlufG1heHxwYXR0ZXJuL2kpKXJldHVybiB0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKTt0aHJvdyBmfX0sZS51cGRhdGVNb2RlbD1mdW5jdGlvbihjLGQsZixnLGgsaSxqKXtmdW5jdGlvbiBrKCl7dmFyIGo9aCYmaC5sZW5ndGg/aFswXTpudWxsO2lmKGMpe3ZhciBrPSFlLmF0dHJHZXR0ZXIoXCJuZ2ZNdWx0aXBsZVwiLGQsZikmJiFlLmF0dHJHZXR0ZXIoXCJtdWx0aXBsZVwiLGQpJiYhcDthKGUuYXR0ckdldHRlcihcIm5nTW9kZWxcIixkKSkuYXNzaWduKGYsaz9qOmgpfXZhciBsPWUuYXR0ckdldHRlcihcIm5nZk1vZGVsXCIsZCk7bCYmYShsKS5hc3NpZ24oZixoKSxnJiZhKGcpKGYseyRmaWxlczpoLCRmaWxlOmosJG5ld0ZpbGVzOm0sJGR1cGxpY2F0ZUZpbGVzOm4sJGV2ZW50Oml9KSxiKGZ1bmN0aW9uKCl7fSl9ZnVuY3Rpb24gbChhLGIpe3ZhciBjPWUuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGQsZik7aWYoIWN8fCFlLmlzUmVzaXplU3VwcG9ydGVkKCkpcmV0dXJuIGIoKTtmb3IodmFyIGc9YS5sZW5ndGgsaD1mdW5jdGlvbigpe2ctLSwwPT09ZyYmYigpfSxpPWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbihjKXthLnNwbGljZShiLDEsYyksaCgpfX0saj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7aCgpLGEuJGVycm9yPVwicmVzaXplXCIsYS4kZXJyb3JQYXJhbT0oYj8oYi5tZXNzYWdlP2IubWVzc2FnZTpiKStcIjogXCI6XCJcIikrKGEmJmEubmFtZSl9fSxrPTA7azxhLmxlbmd0aDtrKyspe3ZhciBsPWFba107bC4kZXJyb3J8fDAhPT1sLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP2goKTplLnJlc2l6ZShsLGMud2lkdGgsYy5oZWlnaHQsYy5xdWFsaXR5KS50aGVuKGkoayksaihsKSl9fXZhciBtPWgsbj1bXSxvPShjJiZjLiRtb2RlbFZhbHVlfHxkLiQkbmdmUHJldkZpbGVzfHxbXSkuc2xpY2UoMCkscD1lLmF0dHJHZXR0ZXIoXCJuZ2ZLZWVwXCIsZCxmKTtpZihwPT09ITApe2lmKCFofHwhaC5sZW5ndGgpcmV0dXJuO3ZhciBxPSExO2lmKGUuYXR0ckdldHRlcihcIm5nZktlZXBEaXN0aW5jdFwiLGQsZik9PT0hMCl7Zm9yKHZhciByPW8ubGVuZ3RoLHM9MDtzPGgubGVuZ3RoO3MrKyl7Zm9yKHZhciB0PTA7cj50O3QrKylpZihoW3NdLm5hbWU9PT1vW3RdLm5hbWUpe24ucHVzaChoW3NdKTticmVha310PT09ciYmKG8ucHVzaChoW3NdKSxxPSEwKX1pZighcSlyZXR1cm47aD1vfWVsc2UgaD1vLmNvbmNhdChoKX1kLiQkbmdmUHJldkZpbGVzPWgsaj9rKCk6ZS52YWxpZGF0ZShoLGMsZCxmLGUuYXR0ckdldHRlcihcIm5nZlZhbGlkYXRlTGF0ZXJcIixkKSxmdW5jdGlvbigpe2woaCxmdW5jdGlvbigpe2IoZnVuY3Rpb24oKXtrKCl9KX0pfSk7Zm9yKHZhciB1PW8ubGVuZ3RoO3UtLTspe3ZhciB2PW9bdV07d2luZG93LlVSTCYmdi5ibG9iVXJsJiYoVVJMLnJldm9rZU9iamVjdFVSTCh2LmJsb2JVcmwpLGRlbGV0ZSB2LmJsb2JVcmwpfX0sZX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmU2VsZWN0XCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGNvbXBpbGVcIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSl7dmFyIGI9YS5tYXRjaCgvQW5kcm9pZFteXFxkXSooXFxkKylcXC4oXFxkKykvKTtpZihiJiZiLmxlbmd0aD4yKXt2YXIgYz1kLmRlZmF1bHRzLmFuZHJvaWRGaXhNaW5vclZlcnNpb258fDQ7cmV0dXJuIHBhcnNlSW50KGJbMV0pPDR8fHBhcnNlSW50KGJbMV0pPT09YyYmcGFyc2VJbnQoYlsyXSk8Y31yZXR1cm4tMT09PWEuaW5kZXhPZihcIkNocm9tZVwiKSYmLy4qV2luZG93cy4qU2FmYXJpLiovLnRlc3QoYSl9ZnVuY3Rpb24gZihhLGIsYyxkLGYsaCxpLGope2Z1bmN0aW9uIGsoKXtyZXR1cm5cImlucHV0XCI9PT1iWzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSYmYy50eXBlJiZcImZpbGVcIj09PWMudHlwZS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIGwoKXtyZXR1cm4gdChcIm5nZkNoYW5nZVwiKXx8dChcIm5nZlNlbGVjdFwiKX1mdW5jdGlvbiBtKGIpe2Zvcih2YXIgZT1iLl9fZmlsZXNffHxiLnRhcmdldCYmYi50YXJnZXQuZmlsZXMsZj1bXSxnPTA7ZzxlLmxlbmd0aDtnKyspZi5wdXNoKGVbZ10pO2oudXBkYXRlTW9kZWwoZCxjLGEsbCgpLGYubGVuZ3RoP2Y6bnVsbCxiKX1mdW5jdGlvbiBuKGEpe2lmKGIhPT1hKWZvcih2YXIgYz0wO2M8YlswXS5hdHRyaWJ1dGVzLmxlbmd0aDtjKyspe3ZhciBkPWJbMF0uYXR0cmlidXRlc1tjXTtcInR5cGVcIiE9PWQubmFtZSYmXCJjbGFzc1wiIT09ZC5uYW1lJiZcImlkXCIhPT1kLm5hbWUmJlwic3R5bGVcIiE9PWQubmFtZSYmKChudWxsPT1kLnZhbHVlfHxcIlwiPT09ZC52YWx1ZSkmJihcInJlcXVpcmVkXCI9PT1kLm5hbWUmJihkLnZhbHVlPVwicmVxdWlyZWRcIiksXCJtdWx0aXBsZVwiPT09ZC5uYW1lJiYoZC52YWx1ZT1cIm11bHRpcGxlXCIpKSxhLmF0dHIoZC5uYW1lLGQudmFsdWUpKX19ZnVuY3Rpb24gbygpe2lmKGsoKSlyZXR1cm4gYjt2YXIgYT1hbmd1bGFyLmVsZW1lbnQoJzxpbnB1dCB0eXBlPVwiZmlsZVwiPicpO3JldHVybiBuKGEpLGEuY3NzKFwidmlzaWJpbGl0eVwiLFwiaGlkZGVuXCIpLmNzcyhcInBvc2l0aW9uXCIsXCJhYnNvbHV0ZVwiKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpLmNzcyhcIndpZHRoXCIsXCIwcHhcIikuY3NzKFwiaGVpZ2h0XCIsXCIwcHhcIikuY3NzKFwiYm9yZGVyXCIsXCJub25lXCIpLmNzcyhcIm1hcmdpblwiLFwiMHB4XCIpLmNzcyhcInBhZGRpbmdcIixcIjBweFwiKS5hdHRyKFwidGFiaW5kZXhcIixcIi0xXCIpLGcucHVzaCh7ZWw6YixyZWY6YX0pLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYVswXSksYX1mdW5jdGlvbiBwKGMpe2lmKGIuYXR0cihcImRpc2FibGVkXCIpfHx0KFwibmdmU2VsZWN0RGlzYWJsZWRcIixhKSlyZXR1cm4hMTt2YXIgZD1xKGMpO3JldHVybiBudWxsIT1kP2Q6KHIoYyksZShuYXZpZ2F0b3IudXNlckFnZW50KT9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d1swXS5jbGljaygpfSwwKTp3WzBdLmNsaWNrKCksITEpfWZ1bmN0aW9uIHEoYSl7dmFyIGI9YS5jaGFuZ2VkVG91Y2hlc3x8YS5vcmlnaW5hbEV2ZW50JiZhLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXM7aWYoXCJ0b3VjaHN0YXJ0XCI9PT1hLnR5cGUpcmV0dXJuIHY9Yj9iWzBdLmNsaWVudFk6MCwhMDtpZihhLnN0b3BQcm9wYWdhdGlvbigpLGEucHJldmVudERlZmF1bHQoKSxcInRvdWNoZW5kXCI9PT1hLnR5cGUpe3ZhciBjPWI/YlswXS5jbGllbnRZOjA7aWYoTWF0aC5hYnMoYy12KT4yMClyZXR1cm4hMX19ZnVuY3Rpb24gcihiKXt3LnZhbCgpJiYody52YWwobnVsbCksai51cGRhdGVNb2RlbChkLGMsYSxsKCksbnVsbCxiLCEwKSl9ZnVuY3Rpb24gcyhhKXtpZih3JiYhdy5hdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIpKXtpZighd1swXS5wYXJlbnROb2RlKXJldHVybiB2b2lkKHc9bnVsbCk7YS5wcmV2ZW50RGVmYXVsdCgpLGEuc3RvcFByb3BhZ2F0aW9uKCksdy51bmJpbmQoXCJjbGlja1wiKTt2YXIgYj13LmNsb25lKCk7cmV0dXJuIHcucmVwbGFjZVdpdGgoYiksdz1iLHcuYXR0cihcIl9fbmdmX2llMTBfRml4X1wiLFwidHJ1ZVwiKSx3LmJpbmQoXCJjaGFuZ2VcIixtKSx3LmJpbmQoXCJjbGlja1wiLHMpLHdbMF0uY2xpY2soKSwhMX13LnJlbW92ZUF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIil9dmFyIHQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gai5hdHRyR2V0dGVyKGEsYyxiKX0sdT1bXTt1LnB1c2goYS4kd2F0Y2godChcIm5nZk11bHRpcGxlXCIpLGZ1bmN0aW9uKCl7dy5hdHRyKFwibXVsdGlwbGVcIix0KFwibmdmTXVsdGlwbGVcIixhKSl9KSksdS5wdXNoKGEuJHdhdGNoKHQoXCJuZ2ZDYXB0dXJlXCIpLGZ1bmN0aW9uKCl7dy5hdHRyKFwiY2FwdHVyZVwiLHQoXCJuZ2ZDYXB0dXJlXCIsYSkpfSkpLGMuJG9ic2VydmUoXCJhY2NlcHRcIixmdW5jdGlvbigpe3cuYXR0cihcImFjY2VwdFwiLHQoXCJhY2NlcHRcIikpfSksdS5wdXNoKGZ1bmN0aW9uKCl7Yy4kJG9ic2VydmVycyYmZGVsZXRlIGMuJCRvYnNlcnZlcnMuYWNjZXB0fSk7dmFyIHY9MCx3PWI7aygpfHwodz1vKCkpLHcuYmluZChcImNoYW5nZVwiLG0pLGsoKT9iLmJpbmQoXCJjbGlja1wiLHIpOmIuYmluZChcImNsaWNrIHRvdWNoc3RhcnQgdG91Y2hlbmRcIixwKSxqLnJlZ2lzdGVyVmFsaWRhdG9ycyhkLHcsYyxhKSwtMSE9PW5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFIDEwXCIpJiZ3LmJpbmQoXCJjbGlja1wiLHMpLGEuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2soKXx8dy5yZW1vdmUoKSxhbmd1bGFyLmZvckVhY2godSxmdW5jdGlvbihhKXthKCl9KX0pLGgoZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPGcubGVuZ3RoO2ErKyl7dmFyIGI9Z1thXTtkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGIuZWxbMF0pfHwoZy5zcGxpY2UoYSwxKSxiLnJlZi5yZW1vdmUoKSl9fSksd2luZG93LkZpbGVBUEkmJndpbmRvdy5GaWxlQVBJLm5nZkZpeElFJiZ3aW5kb3cuRmlsZUFQSS5uZ2ZGaXhJRShiLHcsbSl9dmFyIGc9W107cmV0dXJue3Jlc3RyaWN0OlwiQUVDXCIscmVxdWlyZTpcIj9uZ01vZGVsXCIsbGluazpmdW5jdGlvbihlLGcsaCxpKXtmKGUsZyxoLGksYSxiLGMsZCl9fX1dKSxmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSl7cmV0dXJuXCJpbWdcIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1wiaW1hZ2VcIjpcImF1ZGlvXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cImF1ZGlvXCI6XCJ2aWRlb1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJ2aWRlb1wiOi8uL31mdW5jdGlvbiBiKGIsYyxkLGUsZixnLGgsaSl7ZnVuY3Rpb24gaihhKXt2YXIgZz1iLmF0dHJHZXR0ZXIoXCJuZ2ZOb09iamVjdFVybFwiLGYsZCk7Yi5kYXRhVXJsKGEsZylbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7YyhmdW5jdGlvbigpe3ZhciBiPShnP2EuZGF0YVVybDphLmJsb2JVcmwpfHxhLmRhdGFVcmw7aT9lLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIixcInVybCgnXCIrKGJ8fFwiXCIpK1wiJylcIik6ZS5hdHRyKFwic3JjXCIsYiksYj9lLnJlbW92ZUNsYXNzKFwibmdmLWhpZGVcIik6ZS5hZGRDbGFzcyhcIm5nZi1oaWRlXCIpfSl9KX1jKGZ1bmN0aW9uKCl7dmFyIGM9ZC4kd2F0Y2goZltnXSxmdW5jdGlvbihjKXt2YXIgZD1oO2lmKFwibmdmVGh1bWJuYWlsXCI9PT1nJiYoZHx8KGQ9e3dpZHRoOmVbMF0uY2xpZW50V2lkdGgsaGVpZ2h0OmVbMF0uY2xpZW50SGVpZ2h0fSksMD09PWQud2lkdGgmJndpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSl7dmFyIGY9Z2V0Q29tcHV0ZWRTdHlsZShlWzBdKTtkPXt3aWR0aDpwYXJzZUludChmLndpZHRoLnNsaWNlKDAsLTIpKSxoZWlnaHQ6cGFyc2VJbnQoZi5oZWlnaHQuc2xpY2UoMCwtMikpfX1yZXR1cm4gYW5ndWxhci5pc1N0cmluZyhjKT8oZS5yZW1vdmVDbGFzcyhcIm5nZi1oaWRlXCIpLGk/ZS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJ1cmwoJ1wiK2MrXCInKVwiKTplLmF0dHIoXCJzcmNcIixjKSk6dm9pZCghY3x8IWMudHlwZXx8MCE9PWMudHlwZS5zZWFyY2goYShlWzBdKSl8fGkmJjAhPT1jLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP2UuYWRkQ2xhc3MoXCJuZ2YtaGlkZVwiKTpkJiZiLmlzUmVzaXplU3VwcG9ydGVkKCk/Yi5yZXNpemUoYyxkLndpZHRoLGQuaGVpZ2h0LGQucXVhbGl0eSkudGhlbihmdW5jdGlvbihhKXtqKGEpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6aihjKSl9KTtkLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtjKCl9KX0pfW5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkRGF0YVVybFwiLFtcIlVwbG9hZEJhc2VcIixcIiR0aW1lb3V0XCIsXCIkcVwiLGZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hO3JldHVybiBkLmRhdGFVcmw9ZnVuY3Rpb24oYSxkKXtpZihkJiZudWxsIT1hLmRhdGFVcmx8fCFkJiZudWxsIT1hLmJsb2JVcmwpe3ZhciBlPWMuZGVmZXIoKTtyZXR1cm4gYihmdW5jdGlvbigpe2UucmVzb2x2ZShkP2EuZGF0YVVybDphLmJsb2JVcmwpfSksZS5wcm9taXNlfXZhciBmPWQ/YS4kbmdmRGF0YVVybFByb21pc2U6YS4kbmdmQmxvYlVybFByb21pc2U7aWYoZilyZXR1cm4gZjt2YXIgZz1jLmRlZmVyKCk7cmV0dXJuIGIoZnVuY3Rpb24oKXtpZih3aW5kb3cuRmlsZVJlYWRlciYmYSYmKCF3aW5kb3cuRmlsZUFQSXx8LTE9PT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDhcIil8fGEuc2l6ZTwyZTQpJiYoIXdpbmRvdy5GaWxlQVBJfHwtMT09PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOVwiKXx8YS5zaXplPDRlNikpe3ZhciBjPXdpbmRvdy5VUkx8fHdpbmRvdy53ZWJraXRVUkw7aWYoYyYmYy5jcmVhdGVPYmplY3RVUkwmJiFkKXt2YXIgZTt0cnl7ZT1jLmNyZWF0ZU9iamVjdFVSTChhKX1jYXRjaChmKXtyZXR1cm4gdm9pZCBiKGZ1bmN0aW9uKCl7YS5ibG9iVXJsPVwiXCIsZy5yZWplY3QoKX0pfWIoZnVuY3Rpb24oKXthLmJsb2JVcmw9ZSxlJiZnLnJlc29sdmUoZSl9KX1lbHNle3ZhciBoPW5ldyBGaWxlUmVhZGVyO2gub25sb2FkPWZ1bmN0aW9uKGMpe2IoZnVuY3Rpb24oKXthLmRhdGFVcmw9Yy50YXJnZXQucmVzdWx0LGcucmVzb2x2ZShjLnRhcmdldC5yZXN1bHQpfSl9LGgub25lcnJvcj1mdW5jdGlvbigpe2IoZnVuY3Rpb24oKXthLmRhdGFVcmw9XCJcIixnLnJlamVjdCgpfSl9LGgucmVhZEFzRGF0YVVSTChhKX19ZWxzZSBiKGZ1bmN0aW9uKCl7YVtkP1wiZGF0YVVybFwiOlwiYmxvYlVybFwiXT1cIlwiLGcucmVqZWN0KCl9KX0pLGY9ZD9hLiRuZ2ZEYXRhVXJsUHJvbWlzZT1nLnByb21pc2U6YS4kbmdmQmxvYlVybFByb21pc2U9Zy5wcm9taXNlLGZbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ZGVsZXRlIGFbZD9cIiRuZ2ZEYXRhVXJsUHJvbWlzZVwiOlwiJG5nZkJsb2JVcmxQcm9taXNlXCJdfSksZn0sZH1dKTt2YXIgYz1hbmd1bGFyLmVsZW1lbnQoXCI8c3R5bGU+Lm5nZi1oaWRle2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50fTwvc3R5bGU+XCIpO2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChjWzBdKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmU3JjXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXtiKGEsYyxkLGUsZixcIm5nZlNyY1wiLGEuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGYsZCksITEpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkJhY2tncm91bmRcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe2IoYSxjLGQsZSxmLFwibmdmQmFja2dyb3VuZFwiLGEuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGYsZCksITApfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlRodW1ibmFpbFwiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7dmFyIGc9YS5hdHRyR2V0dGVyKFwibmdmU2l6ZVwiLGYsZCk7YihhLGMsZCxlLGYsXCJuZ2ZUaHVtYm5haWxcIixnLGEuYXR0ckdldHRlcihcIm5nZkFzQmFja2dyb3VuZFwiLGYsZCkpfX19XSl9KCksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRWYWxpZGF0ZVwiLFtcIlVwbG9hZERhdGFVcmxcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGEpe3ZhciBiPVwiXCIsYz1bXTtpZihhLmxlbmd0aD4yJiZcIi9cIj09PWFbMF0mJlwiL1wiPT09YVthLmxlbmd0aC0xXSliPWEuc3Vic3RyaW5nKDEsYS5sZW5ndGgtMSk7ZWxzZXt2YXIgZT1hLnNwbGl0KFwiLFwiKTtpZihlLmxlbmd0aD4xKWZvcih2YXIgZj0wO2Y8ZS5sZW5ndGg7ZisrKXt2YXIgZz1kKGVbZl0pO2cucmVnZXhwPyhiKz1cIihcIitnLnJlZ2V4cCtcIilcIixmPGUubGVuZ3RoLTEmJihiKz1cInxcIikpOmM9Yy5jb25jYXQoZy5leGNsdWRlcyl9ZWxzZSAwPT09YS5pbmRleE9mKFwiIVwiKT9jLnB1c2goXCJeKCg/IVwiK2QoYS5zdWJzdHJpbmcoMSkpLnJlZ2V4cCtcIikuKSokXCIpOigwPT09YS5pbmRleE9mKFwiLlwiKSYmKGE9XCIqXCIrYSksYj1cIl5cIithLnJlcGxhY2UobmV3IFJlZ0V4cChcIlsuXFxcXFxcXFwrKj9cXFxcW1xcXFxeXFxcXF0kKCl7fT0hPD58OlxcXFwtXVwiLFwiZ1wiKSxcIlxcXFwkJlwiKStcIiRcIixiPWIucmVwbGFjZSgvXFxcXFxcKi9nLFwiLipcIikucmVwbGFjZSgvXFxcXFxcPy9nLFwiLlwiKSl9cmV0dXJue3JlZ2V4cDpiLGV4Y2x1ZGVzOmN9fXZhciBlPWE7cmV0dXJuIGUucmVnaXN0ZXJWYWxpZGF0b3JzPWZ1bmN0aW9uKGEsYixjLGQpe2Z1bmN0aW9uIGYoYSl7YW5ndWxhci5mb3JFYWNoKGEuJG5nZlZhbGlkYXRpb25zLGZ1bmN0aW9uKGIpe2EuJHNldFZhbGlkaXR5KGIubmFtZSxiLnZhbGlkKX0pfWEmJihhLiRuZ2ZWYWxpZGF0aW9ucz1bXSxhLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oZyl7cmV0dXJuIGUuYXR0ckdldHRlcihcIm5nZlZhbGlkYXRlTGF0ZXJcIixjLGQpfHwhYS4kJG5nZlZhbGlkYXRlZD8oZS52YWxpZGF0ZShnLGEsYyxkLCExLGZ1bmN0aW9uKCl7ZihhKSxhLiQkbmdmVmFsaWRhdGVkPSExfSksZyYmMD09PWcubGVuZ3RoJiYoZz1udWxsKSwhYnx8bnVsbCE9ZyYmMCE9PWcubGVuZ3RofHxiLnZhbCgpJiZiLnZhbChudWxsKSk6KGYoYSksYS4kJG5nZlZhbGlkYXRlZD0hMSksZ30pKX0sZS52YWxpZGF0ZVBhdHRlcm49ZnVuY3Rpb24oYSxiKXtpZighYilyZXR1cm4hMDt2YXIgYz1kKGIpLGU9ITA7aWYoYy5yZWdleHAmJmMucmVnZXhwLmxlbmd0aCl7dmFyIGY9bmV3IFJlZ0V4cChjLnJlZ2V4cCxcImlcIik7ZT1udWxsIT1hLnR5cGUmJmYudGVzdChhLnR5cGUpfHxudWxsIT1hLm5hbWUmJmYudGVzdChhLm5hbWUpfWZvcih2YXIgZz1jLmV4Y2x1ZGVzLmxlbmd0aDtnLS07KXt2YXIgaD1uZXcgUmVnRXhwKGMuZXhjbHVkZXNbZ10sXCJpXCIpO2U9ZSYmKG51bGw9PWEudHlwZXx8aC50ZXN0KGEudHlwZSkpJiYobnVsbD09YS5uYW1lfHxoLnRlc3QoYS5uYW1lKSl9cmV0dXJuIGV9LGUudmFsaWRhdGU9ZnVuY3Rpb24oYSxiLGMsZCxmLGcpe2Z1bmN0aW9uIGgoYyxkLGUpe2lmKGEpe2Zvcih2YXIgZj1cIm5nZlwiK2NbMF0udG9VcHBlckNhc2UoKStjLnN1YnN0cigxKSxnPWEubGVuZ3RoLGg9bnVsbDtnLS07KXt2YXIgaT1hW2ddLGs9aihmLHskZmlsZTppfSk7bnVsbD09ayYmKGs9ZChqKFwibmdmVmFsaWRhdGVcIil8fHt9KSxoPW51bGw9PWg/ITA6aCksbnVsbCE9ayYmKGUoaSxrKXx8KGkuJGVycm9yPWMsaS4kZXJyb3JQYXJhbT1rLGEuc3BsaWNlKGcsMSksaD0hMSkpfW51bGwhPT1oJiZiLiRuZ2ZWYWxpZGF0aW9ucy5wdXNoKHtuYW1lOmMsdmFsaWQ6aH0pfX1mdW5jdGlvbiBpKGMsZCxlLGYsaCl7aWYoYSl7dmFyIGk9MCxsPSExLG09XCJuZ2ZcIitjWzBdLnRvVXBwZXJDYXNlKCkrYy5zdWJzdHIoMSk7YT12b2lkIDA9PT1hLmxlbmd0aD9bYV06YSxhbmd1bGFyLmZvckVhY2goYSxmdW5jdGlvbihhKXtpZigwIT09YS50eXBlLnNlYXJjaChlKSlyZXR1cm4hMDt2YXIgbj1qKG0seyRmaWxlOmF9KXx8ZChqKFwibmdmVmFsaWRhdGVcIix7JGZpbGU6YX0pfHx7fSk7biYmKGsrKyxpKyssZihhLG4pLnRoZW4oZnVuY3Rpb24oYil7aChiLG4pfHwoYS4kZXJyb3I9YyxhLiRlcnJvclBhcmFtPW4sbD0hMCl9LGZ1bmN0aW9uKCl7aihcIm5nZlZhbGlkYXRlRm9yY2VcIix7JGZpbGU6YX0pJiYoYS4kZXJyb3I9YyxhLiRlcnJvclBhcmFtPW4sbD0hMCl9KVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtrLS0saS0tLGl8fGIuJG5nZlZhbGlkYXRpb25zLnB1c2goe25hbWU6Yyx2YWxpZDohbH0pLGt8fGcuY2FsbChiLGIuJG5nZlZhbGlkYXRpb25zKX0pKX0pfX1iPWJ8fHt9LGIuJG5nZlZhbGlkYXRpb25zPWIuJG5nZlZhbGlkYXRpb25zfHxbXSxhbmd1bGFyLmZvckVhY2goYi4kbmdmVmFsaWRhdGlvbnMsZnVuY3Rpb24oYSl7YS52YWxpZD0hMH0pO3ZhciBqPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGUuYXR0ckdldHRlcihhLGMsZCxiKX07aWYoZilyZXR1cm4gdm9pZCBnLmNhbGwoYik7aWYoYi4kJG5nZlZhbGlkYXRlZD0hMCxudWxsPT1hfHwwPT09YS5sZW5ndGgpcmV0dXJuIHZvaWQgZy5jYWxsKGIpO2lmKGE9dm9pZCAwPT09YS5sZW5ndGg/W2FdOmEuc2xpY2UoMCksaChcInBhdHRlcm5cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5wYXR0ZXJufSxlLnZhbGlkYXRlUGF0dGVybiksaChcIm1pblNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWlufSxmdW5jdGlvbihhLGIpe3JldHVybiBhLnNpemU+PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGgoXCJtYXhTaXplXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuc2l6ZSYmYS5zaXplLm1heH0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5zaXplPD1lLnRyYW5zbGF0ZVNjYWxhcnMoYil9KSxoKFwidmFsaWRhdGVGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGI9PT0hMHx8bnVsbD09PWJ8fFwiXCI9PT1ifSksIWEubGVuZ3RoKXJldHVybiB2b2lkIGcuY2FsbChiLGIuJG5nZlZhbGlkYXRpb25zKTt2YXIgaz0wO2koXCJtYXhIZWlnaHRcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5oZWlnaHQmJmEuaGVpZ2h0Lm1heH0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLmhlaWdodDw9Yn0pLGkoXCJtaW5IZWlnaHRcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5oZWlnaHQmJmEuaGVpZ2h0Lm1pbn0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLmhlaWdodD49Yn0pLGkoXCJtYXhXaWR0aFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLndpZHRoJiZhLndpZHRoLm1heH0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLndpZHRoPD1ifSksaShcIm1pbldpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg+PWJ9KSxpKFwicmF0aW9cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5yYXRpb30sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1iLnRvU3RyaW5nKCkuc3BsaXQoXCIsXCIpLGQ9ITEsZT0wO2U8Yy5sZW5ndGg7ZSsrKXt2YXIgZj1jW2VdLGc9Zi5zZWFyY2goL3gvaSk7Zj1nPi0xP3BhcnNlRmxvYXQoZi5zdWJzdHJpbmcoMCxnKSkvcGFyc2VGbG9hdChmLnN1YnN0cmluZyhnKzEpKTpwYXJzZUZsb2F0KGYpLE1hdGguYWJzKGEud2lkdGgvYS5oZWlnaHQtZik8MWUtNCYmKGQ9ITApfXJldHVybiBkfSksaShcIm1heER1cmF0aW9uXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuZHVyYXRpb24mJmEuZHVyYXRpb24ubWF4fSwvYXVkaW98dmlkZW8vLHRoaXMubWVkaWFEdXJhdGlvbixmdW5jdGlvbihhLGIpe3JldHVybiBhPD1lLnRyYW5zbGF0ZVNjYWxhcnMoYil9KSxpKFwibWluRHVyYXRpb25cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5kdXJhdGlvbiYmYS5kdXJhdGlvbi5taW59LC9hdWRpb3x2aWRlby8sdGhpcy5tZWRpYUR1cmF0aW9uLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE+PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGkoXCJ2YWxpZGF0ZUFzeW5jRm5cIixmdW5jdGlvbigpe3JldHVybiBudWxsfSwvLi8sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYn0sZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT0hMHx8bnVsbD09PWF8fFwiXCI9PT1hfSksa3x8Zy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpfSxlLmltYWdlRGltZW5zaW9ucz1mdW5jdGlvbihhKXtpZihhLndpZHRoJiZhLmhlaWdodCl7dmFyIGQ9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7ZC5yZXNvbHZlKHt3aWR0aDphLndpZHRoLGhlaWdodDphLmhlaWdodH0pfSksZC5wcm9taXNlfWlmKGEuJG5nZkRpbWVuc2lvblByb21pc2UpcmV0dXJuIGEuJG5nZkRpbWVuc2lvblByb21pc2U7dmFyIGY9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP3ZvaWQgZi5yZWplY3QoXCJub3QgaW1hZ2VcIik6dm9pZCBlLmRhdGFVcmwoYSkudGhlbihmdW5jdGlvbihiKXtmdW5jdGlvbiBkKCl7dmFyIGI9aFswXS5jbGllbnRXaWR0aCxjPWhbMF0uY2xpZW50SGVpZ2h0O2gucmVtb3ZlKCksYS53aWR0aD1iLGEuaGVpZ2h0PWMsZi5yZXNvbHZlKHt3aWR0aDpiLGhlaWdodDpjfSl9ZnVuY3Rpb24gZSgpe2gucmVtb3ZlKCksZi5yZWplY3QoXCJsb2FkIGVycm9yXCIpfWZ1bmN0aW9uIGcoKXtjKGZ1bmN0aW9uKCl7aFswXS5wYXJlbnROb2RlJiYoaFswXS5jbGllbnRXaWR0aD9kKCk6aT4xMD9lKCk6ZygpKX0sMWUzKX12YXIgaD1hbmd1bGFyLmVsZW1lbnQoXCI8aW1nPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwiaGlkZGVuXCIpLmNzcyhcInBvc2l0aW9uXCIsXCJmaXhlZFwiKTtoLm9uKFwibG9hZFwiLGQpLGgub24oXCJlcnJvclwiLGUpO3ZhciBpPTA7ZygpLGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0pLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtmLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2U9Zi5wcm9taXNlLGEuJG5nZkRpbWVuc2lvblByb21pc2VbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ZGVsZXRlIGEuJG5nZkRpbWVuc2lvblByb21pc2V9KSxhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlfSxlLm1lZGlhRHVyYXRpb249ZnVuY3Rpb24oYSl7aWYoYS5kdXJhdGlvbil7dmFyIGQ9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7ZC5yZXNvbHZlKGEuZHVyYXRpb24pfSksZC5wcm9taXNlfWlmKGEuJG5nZkR1cmF0aW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRHVyYXRpb25Qcm9taXNlO3ZhciBmPWIuZGVmZXIoKTtyZXR1cm4gYyhmdW5jdGlvbigpe3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJhdWRpb1wiKSYmMCE9PWEudHlwZS5pbmRleE9mKFwidmlkZW9cIik/dm9pZCBmLnJlamVjdChcIm5vdCBtZWRpYVwiKTp2b2lkIGUuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmR1cmF0aW9uO2EuZHVyYXRpb249YixoLnJlbW92ZSgpLGYucmVzb2x2ZShiKX1mdW5jdGlvbiBlKCl7aC5yZW1vdmUoKSxmLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2MoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmR1cmF0aW9uP2QoKTppPjEwP2UoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudCgwPT09YS50eXBlLmluZGV4T2YoXCJhdWRpb1wiKT9cIjxhdWRpbz5cIjpcIjx2aWRlbz5cIikuYXR0cihcInNyY1wiLGIpLmNzcyhcInZpc2liaWxpdHlcIixcIm5vbmVcIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkZWRtZXRhZGF0YVwiLGQpLGgub24oXCJlcnJvclwiLGUpO3ZhciBpPTA7ZygpLGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoaCl9LGZ1bmN0aW9uKCl7Zi5yZWplY3QoXCJsb2FkIGVycm9yXCIpfSl9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2U9Zi5wcm9taXNlLGEuJG5nZkR1cmF0aW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRHVyYXRpb25Qcm9taXNlfSksYS4kbmdmRHVyYXRpb25Qcm9taXNlfSxlfV0pLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkUmVzaXplXCIsW1wiVXBsb2FkVmFsaWRhdGVcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLGU9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9TWF0aC5taW4oYy9hLGQvYik7cmV0dXJue3dpZHRoOmEqZSxoZWlnaHQ6YiplfX0sZj1mdW5jdGlvbihhLGMsZCxmLGcpe3ZhciBoPWIuZGVmZXIoKSxpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO3JldHVybiAwPT09YyYmKGM9ai53aWR0aCxkPWouaGVpZ2h0KSxqLm9ubG9hZD1mdW5jdGlvbigpe3RyeXt2YXIgYT1lKGoud2lkdGgsai5oZWlnaHQsYyxkKTtpLndpZHRoPWEud2lkdGgsaS5oZWlnaHQ9YS5oZWlnaHQ7dmFyIGI9aS5nZXRDb250ZXh0KFwiMmRcIik7Yi5kcmF3SW1hZ2UoaiwwLDAsYS53aWR0aCxhLmhlaWdodCksaC5yZXNvbHZlKGkudG9EYXRhVVJMKGd8fFwiaW1hZ2UvV2ViUFwiLGZ8fDEpKX1jYXRjaChrKXtoLnJlamVjdChrKX19LGoub25lcnJvcj1mdW5jdGlvbigpe2gucmVqZWN0KCl9LGouc3JjPWEsaC5wcm9taXNlfSxnPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hLnNwbGl0KFwiLFwiKSxjPWJbMF0ubWF0Y2goLzooLio/KTsvKVsxXSxkPWF0b2IoYlsxXSksZT1kLmxlbmd0aCxmPW5ldyBVaW50OEFycmF5KGUpO2UtLTspZltlXT1kLmNoYXJDb2RlQXQoZSk7cmV0dXJuIG5ldyBCbG9iKFtmXSx7dHlwZTpjfSl9O3JldHVybiBkLmlzUmVzaXplU3VwcG9ydGVkPWZ1bmN0aW9uKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtyZXR1cm4gd2luZG93LmF0b2ImJmEuZ2V0Q29udGV4dCYmYS5nZXRDb250ZXh0KFwiMmRcIil9LGQucmVzaXplPWZ1bmN0aW9uKGEsZSxoLGkpe3ZhciBqPWIuZGVmZXIoKTtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/KGMoZnVuY3Rpb24oKXtqLnJlc29sdmUoXCJPbmx5IGltYWdlcyBhcmUgYWxsb3dlZCBmb3IgcmVzaXppbmchXCIpfSksai5wcm9taXNlKTooZC5kYXRhVXJsKGEsITApLnRoZW4oZnVuY3Rpb24oYil7ZihiLGUsaCxpLGEudHlwZSkudGhlbihmdW5jdGlvbihiKXt2YXIgYz1nKGIpO2MubmFtZT1hLm5hbWUsai5yZXNvbHZlKGMpfSxmdW5jdGlvbigpe2oucmVqZWN0KCl9KX0sZnVuY3Rpb24oKXtqLnJlamVjdCgpfSksai5wcm9taXNlKX0sZH1dKSxmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSxjLGQsZSxmLGcsaCxpKXtmdW5jdGlvbiBqKCl7cmV0dXJuIGMuYXR0cihcImRpc2FibGVkXCIpfHxuKFwibmdmRHJvcERpc2FibGVkXCIsYSl9ZnVuY3Rpb24gayhhLGIsYyxkKXt2YXIgZT1uKFwibmdmRHJhZ092ZXJDbGFzc1wiLGEseyRldmVudDpjfSksZj1uKFwibmdmRHJhZ092ZXJDbGFzc1wiKXx8XCJkcmFnb3ZlclwiO2lmKGFuZ3VsYXIuaXNTdHJpbmcoZSkpcmV0dXJuIHZvaWQgZChlKTtpZihlJiYoZS5kZWxheSYmKHI9ZS5kZWxheSksZS5hY2NlcHR8fGUucmVqZWN0KSl7dmFyIGc9Yy5kYXRhVHJhbnNmZXIuaXRlbXM7aWYobnVsbCE9Zylmb3IodmFyIGg9bihcIm5nZlBhdHRlcm5cIixhLHskZXZlbnQ6Y30pLGo9MDtqPGcubGVuZ3RoO2orKylpZihcImZpbGVcIj09PWdbal0ua2luZHx8XCJcIj09PWdbal0ua2luZCl7aWYoIWkudmFsaWRhdGVQYXR0ZXJuKGdbal0saCkpe2Y9ZS5yZWplY3Q7YnJlYWt9Zj1lLmFjY2VwdH19ZChmKX1mdW5jdGlvbiBsKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSxiLGMpe2lmKG51bGwhPWIpaWYoYi5pc0RpcmVjdG9yeSl7dmFyIGQ9KGN8fFwiXCIpK2IubmFtZTthLnB1c2goe25hbWU6Yi5uYW1lLHR5cGU6XCJkaXJlY3RvcnlcIixwYXRoOmR9KTt2YXIgZj1iLmNyZWF0ZVJlYWRlcigpLGc9W107aSsrO3ZhciBoPWZ1bmN0aW9uKCl7Zi5yZWFkRW50cmllcyhmdW5jdGlvbihkKXt0cnl7aWYoZC5sZW5ndGgpZz1nLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkfHxbXSwwKSksaCgpO2Vsc2V7Zm9yKHZhciBmPTA7ZjxnLmxlbmd0aDtmKyspZShhLGdbZl0sKGM/YzpcIlwiKStiLm5hbWUrXCIvXCIpO2ktLX19Y2F0Y2goail7aS0tLGNvbnNvbGUuZXJyb3Ioail9fSxmdW5jdGlvbigpe2ktLX0pfTtoKCl9ZWxzZSBpKyssYi5maWxlKGZ1bmN0aW9uKGIpe3RyeXtpLS0sYi5wYXRoPShjP2M6XCJcIikrYi5uYW1lLGEucHVzaChiKX1jYXRjaChkKXtpLS0sY29uc29sZS5lcnJvcihkKX19LGZ1bmN0aW9uKCl7aS0tfSl9dmFyIGY9W10saT0wLGo9YS5kYXRhVHJhbnNmZXIuaXRlbXM7aWYoaiYmai5sZW5ndGg+MCYmXCJmaWxlXCIhPT1oLnByb3RvY29sKCkpZm9yKHZhciBrPTA7azxqLmxlbmd0aDtrKyspe2lmKGpba10ud2Via2l0R2V0QXNFbnRyeSYmaltrXS53ZWJraXRHZXRBc0VudHJ5KCkmJmpba10ud2Via2l0R2V0QXNFbnRyeSgpLmlzRGlyZWN0b3J5KXt2YXIgbD1qW2tdLndlYmtpdEdldEFzRW50cnkoKTtpZihsLmlzRGlyZWN0b3J5JiYhYyljb250aW51ZTtudWxsIT1sJiZlKGYsbCl9ZWxzZXt2YXIgbT1qW2tdLmdldEFzRmlsZSgpO251bGwhPW0mJmYucHVzaChtKX1pZighZCYmZi5sZW5ndGg+MClicmVha31lbHNle3ZhciBuPWEuZGF0YVRyYW5zZmVyLmZpbGVzO2lmKG51bGwhPW4pZm9yKHZhciBvPTA7bzxuLmxlbmd0aCYmKGYucHVzaChuLml0ZW0obykpLGR8fCEoZi5sZW5ndGg+MCkpO28rKyk7fXZhciBwPTA7IWZ1bmN0aW9uIHEoYSl7ZyhmdW5jdGlvbigpe2lmKGkpMTAqcCsrPDJlNCYmcSgxMCk7ZWxzZXtpZighZCYmZi5sZW5ndGg+MSl7Zm9yKGs9MDtcImRpcmVjdG9yeVwiPT09ZltrXS50eXBlOylrKys7Zj1bZltrXV19YihmKX19LGF8fDApfSgpfXZhciBtPWIoKSxuPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gaS5hdHRyR2V0dGVyKGEsZCxiLGMpfTtpZihuKFwiZHJvcEF2YWlsYWJsZVwiKSYmZyhmdW5jdGlvbigpe2FbbihcImRyb3BBdmFpbGFibGVcIildP2FbbihcImRyb3BBdmFpbGFibGVcIildLnZhbHVlPW06YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV09bX0pLCFtKXJldHVybiB2b2lkKG4oXCJuZ2ZIaWRlT25Ecm9wTm90QXZhaWxhYmxlXCIsYSk9PT0hMCYmYy5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpKTtpLnJlZ2lzdGVyVmFsaWRhdG9ycyhlLG51bGwsZCxhKTt2YXIgbyxwPW51bGwscT1mKG4oXCJuZ2ZTdG9wUHJvcGFnYXRpb25cIikpLHI9MTtjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLGZ1bmN0aW9uKGIpe2lmKCFqKCkpe2lmKGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpLG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKT4tMSl7dmFyIGU9Yi5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZDtiLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0PVwibW92ZVwiPT09ZXx8XCJsaW5rTW92ZVwiPT09ZT9cIm1vdmVcIjpcImNvcHlcIn1nLmNhbmNlbChwKSxvfHwobz1cIkNcIixrKGEsZCxiLGZ1bmN0aW9uKGEpe289YSxjLmFkZENsYXNzKG8pfSkpfX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLGZ1bmN0aW9uKGIpe2ooKXx8KGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpKX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLGZ1bmN0aW9uKCl7aigpfHwocD1nKGZ1bmN0aW9uKCl7byYmYy5yZW1vdmVDbGFzcyhvKSxvPW51bGx9LHJ8fDEpKX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIixmdW5jdGlvbihiKXtqKCl8fChiLnByZXZlbnREZWZhdWx0KCkscShhKSYmYi5zdG9wUHJvcGFnYXRpb24oKSxvJiZjLnJlbW92ZUNsYXNzKG8pLG89bnVsbCxsKGIsZnVuY3Rpb24oYyl7aS51cGRhdGVNb2RlbChlLGQsYSxuKFwibmdmQ2hhbmdlXCIpfHxuKFwibmdmRHJvcFwiKSxjLGIpfSxuKFwibmdmQWxsb3dEaXJcIixhKSE9PSExLG4oXCJtdWx0aXBsZVwiKXx8bihcIm5nZk11bHRpcGxlXCIsYSkpKX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsZnVuY3Rpb24oYil7aWYoIWooKSl7dmFyIGM9W10sZj1iLmNsaXBib2FyZERhdGF8fGIub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhO2lmKGYmJmYuaXRlbXMpe2Zvcih2YXIgZz0wO2c8Zi5pdGVtcy5sZW5ndGg7ZysrKS0xIT09Zi5pdGVtc1tnXS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSYmYy5wdXNoKGYuaXRlbXNbZ10uZ2V0QXNGaWxlKCkpO2kudXBkYXRlTW9kZWwoZSxkLGEsbihcIm5nZkNoYW5nZVwiKXx8bihcIm5nZkRyb3BcIiksYyxiKX19fSwhMSl9ZnVuY3Rpb24gYigpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7cmV0dXJuXCJkcmFnZ2FibGVcImluIGEmJlwib25kcm9wXCJpbiBhJiYhL0VkZ2VcXC8xMi4vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpfW5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZEcm9wXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGxvY2F0aW9uXCIsXCJVcGxvYWRcIixmdW5jdGlvbihiLGMsZCxlKXtyZXR1cm57cmVzdHJpY3Q6XCJBRUNcIixyZXF1aXJlOlwiP25nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGYsZyxoLGkpe2EoZixnLGgsaSxiLGMsZCxlKX19fV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZOb0ZpbGVEcm9wXCIsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYSxjKXtiKCkmJmMuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKX19KSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmRHJvcEF2YWlsYWJsZVwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gZnVuY3Rpb24oZSxmLGcpe2lmKGIoKSl7dmFyIGg9YShkLmF0dHJHZXR0ZXIoXCJuZ2ZEcm9wQXZhaWxhYmxlXCIsZykpO2MoZnVuY3Rpb24oKXtoKGUpLGguYXNzaWduJiZoLmFzc2lnbihlLCEwKX0pfX19XSl9KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
