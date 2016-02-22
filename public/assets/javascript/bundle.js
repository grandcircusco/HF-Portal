/**
 * app.routes
 * @desc    contains the routes for the app
 */

 var app = angular.module('app', ['ngRoute', 'ngCookies',  'ngFileUpload', 'ui.bootstrap',
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
        templateUrl: 'source/app/fellows/fellows.html'
    })
    .when('/fellows/:fellow_id/:fellow_name', {
        controller: 'FellowController',
        templateUrl: 'source/app/fellows/fellow.html'
    })
    .when('/companies', {
        controller: 'CompaniesController',
        templateUrl: 'source/app/companies/companies.html'
    })
    .when('/companies/:company_id/:company_name', {
        controller: 'CompanyController',
        templateUrl: 'source/app/companies/company.html'
    })

    .when('/tags', {
        controller: 'TagsController',
        templateUrl: 'source/app/tags/tags.html'
    })

    .when('/profile', {
        controller: 'ProfileController',
        templateUrl: 'source/app/profile/profile.html'
    })

    .when('/profile/admin', {
        controller: 'AdminProfileController',
        templateUrl: 'source/app/profile/partials/admin-profile.html'
    })

    .when('/profile/fellow', {
        controller: 'FellowsProfileController',
        templateUrl: 'source/app/profile/partials/fellow-profile.html'
    })

    .when('/profile/company', {
        controller: 'CompanyProfileController',
        templateUrl: 'source/app/profile/partials/company-profile.html'
    })

    .when( '/votes', {
        controller: 'VotesController',
        templateUrl: 'source/app/votes/partials/votes.html'
    })

    .when( '/votes/fellow', {
        controller: 'FellowVotesController',
        templateUrl: 'source/app/votes/partials/fellow-votes.html'
    })

    .when( '/votes/company', {
        controller: 'CompanyVotesController',
        templateUrl: 'source/app/votes/partials/company-votes.html'
    })

    .otherwise({ redirectTo: '/' });

});

app.controller('RoutingController', RoutingController)
.controller('LoginModalInstanceController', LoginModalInstanceController);

RoutingController.$inject = ['$scope', '$modal', '$window', 'User', '$location', '$anchorScroll'];
LoginModalInstanceController.$inject = ['$scope', '$window', '$modalInstance', 'User'];

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


    $scope.logoutUser = function(){

        User.ClearCredentials();

        $scope.isUserLoggedIn = false;
        $scope.isUserAdmin = false;

        $window.location.reload();
    };
}

function LoginModalInstanceController ($scope, $window, $modalInstance, User) {

    // save this through a refesh
    $scope.loginForm = {

        email: "",
        password: "",
        errors: []
    };

    $scope.login = function(loginForm) {

        $scope.loginForm.errors = [];

        User.login(loginForm).success(function(user){

            console.log(user);
            $modalInstance.close();
            //User.currentUser = user
            User.SetCredentials(user.id, user.email, user.userType);

            //$window.location.reload();

        }).error( function(error){

            $scope.loginForm.errors.push("Invalid user credentials");

        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}


run.$inject = ['$cookieStore', 'User'];
function run($cookieStore, User){

    // keep user logged in after page refresh
    var currentUser = $cookieStore.get('globals') || {};
    User.setCurrentUser(currentUser);

    //console.log(currentUser);
    //if ($rootScope.globals.currentUser) {
    //    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    //}

    //$rootScope.$on('$locationChangeStart', function (event, next, current) {
    //    // redirect to login page if not logged in and trying to access a restricted page
    //    var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
    //    var loggedIn = $rootScope.globals.currentUser;
    //    if (restrictedPage && !loggedIn) {
    //        $location.path('/login');
    //    }
    //});
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

                this.alert.message = newMessage;
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
* AdminProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('AdminProfileController', AdminProfileController);

    AdminProfileController.$inject = ['$scope', '$location', '$modal', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $location, $modal, User, Fellows, Companies) {

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

                    console.log( fellows );

                    $scope.fellows = fellows;

                });
            }

            if( $scope.companies.length === 0 ) {

                Companies.allWithUser().success(function (companies) {

                    console.log( companies );

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

            $location.path("/");
            return;
        }

        // Make sure current user is a Company
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Company" ){

            $location.path("/profile");
            return;
        }

        Companies.getByUserId(currentUser.id).success(function(company){

            $scope.company = company;

            Tags.all().success(function(tags){

                $scope.tags = tags;

                //var data = [];
                //tags.forEach(function(tag){
                //
                //    var item = {
                //
                //        id: tag.id,
                //        text: tag.name
                //    };
                //    data.push(item);
                //});
                //
                //$("select#tags").select2({
                //    //tags: true,
                //    data: data,
                //    tokenSeparators: [',',' ']
                //});

            });

        });

        activate();

        function activate() {

            //console.log('activated profile controller!');
            //Profile.all();
        }

        $scope.update = function(company) {

            // get the tags from the form
            //company.tags = $("#tags").val();
            var tags = [];
            $('#tags :selected').each(function(i, selected){
                tags[i] = $(selected).val();
            });

            company.tags = tags;

            // send companies info to API via Service
            Companies.update(company).success(function(newCompanyData){

                // ** Trigger Success message here
                company = newCompanyData;

                // hide update message
                $("#profile-photo").find(".upload-status").hide();

                Alert.showAlert( 'Your profile has been updated', 'success' );
            });
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

    FellowsProfileController.$inject = ['$scope', '$location', '$timeout', 'Fellows', 'Tags', 'User', 'S3', 'Alert' ];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, $timeout, Fellows, Tags, User, S3, Alert ) {

        var vm = this;

        // Probably can handle this in the routes or with middleware of some kind
        if( !User.isUserLoggedIn() ) {

            $location.path("/");
            return;
        }

        // Make sure current user is a Fellow
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Fellow" ){

            $location.path("/profile");
            return;
        }

        Fellows.getByUserId(currentUser.id).success(function(fellow){

            $scope.fellow = fellow;

            $scope.tags = [];
            Tags.all().success(function(tags){

                $scope.tags = tags;

                // bind jQuery multi select
                // -- added timeout to make sure the #tags select element gets populated
                // -- @TODO -- Find a better way to add functionality to Tags
                //$timeout( function(){ $("#tags").multiSelect({
                //
                //    selectableHeader: 'Available Skills',
                //    selectionHeader: 'Your Skills'
                //
                //}); },  500 );

            });

        });

        activate();

        function activate() {
            //console.log('activated profile controller!');
            //Profile.all();
        }


        $scope.update = function(fellow, file) {

            //console.log ( fellow.tags );

            // send fellows info to API via Service
            Fellows.update(fellow).success(function(newFellowData){

                // ** Trigger Success message here
                fellow = newFellowData;

                // hide update message
                $("#profile-photo").find(".upload-status").hide();

                Alert.showAlert( 'Your profile has been updated', 'success' );
            });
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

    Fellows.all().success(function(fellows){

      $scope.fellows = fellows;
    });

    activate();

    function activate() {
      //console.log('activated home controller!');
      //Home.all();
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

  User.$inject = ['$rootScope', '$cookieStore', '$http', 'CONFIG'];

  /**
   * @namespace User
   * @returns {Service}
   */
  function User($rootScope, $cookieStore, $http, CONFIG) {

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
          //destroy: destroy
          SetCredentials: SetCredentials,
          ClearCredentials: ClearCredentials,
          getCurrentUser: getCurrentUser,
          setCurrentUser: setCurrentUser,
          isUserLoggedIn: isUserLoggedIn,
          isUserAdmin: isUserAdmin
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
      //function destroy(id) {
      //    return $http.delete(rootUrl + rootUrl + '/api/v1/users/' + id);
      //}

      function isUserLoggedIn(){

          //console.log(currentUser);
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

      function SetCredentials(id, username, userType) {

          var authdata = Base64.encode(id + ':' + username + ':' + userType);

          currentUser = {
              id: id,
              username: username,
              userType: userType,
              authdata: authdata
          };

          $cookieStore.put('globals', currentUser);
      }

      function ClearCredentials() {

          $rootScope.globals = {};
          $cookieStore.remove('globals');
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


/*! 7.3.4 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="7.3.4",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function g(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&f?{loaded:a.loaded+d._start,total:d._file.size,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){d._chunkSize&&!d._finished?(g({loaded:d._end,total:d._file.size,config:d,type:"progress"}),e.upload(d)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,g(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,g(h(a)))},!1))}},f?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):i():i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},k}var e=this,f=window.Blob&&(new Blob).slice;this.upload=function(a){function b(c,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))c.append(e,d);else if("form"===a.sendFieldsAs)if(angular.isObject(d))for(var f in d)d.hasOwnProperty(f)&&b(c,d[f],e+"["+f+"]");else c.append(e,d);else d=angular.isString(d)?d:angular.toJson(d),"json-blob"===a.sendFieldsAs?c.append(e,new Blob([d],{type:"application/json"})):c.append(e,d)}function c(a){return a instanceof Blob||a.flashId&&a.name&&a.size}function g(b,d,e){if(c(d)){if(a._file=a._file||d,null!=a._start&&f){a._end&&a._end>=d.size&&(a._finished=!0,a._end=d.size);var h=d.slice(a._start,a._end||d.size);h.name=d.name,d=h,a._chunkSize&&(b.append("chunkSize",a._end-a._start),b.append("chunkNumber",Math.floor(a._start/a._chunkSize)),b.append("totalSize",a._file.size))}b.append(e,d,d.fileName||d.name)}else{if(!angular.isObject(d))throw"Expected file object in Upload.upload file option: "+d.toString();for(var i in d)if(d.hasOwnProperty(i)){var j=i.split(",");j[1]&&(d[i].fileName=j[1].replace(/^\s+|\s+$/g,"")),g(b,d[i],j[0])}}}return a._chunkSize=e.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(c){var d,e=new FormData,f={};for(d in a.fields)a.fields.hasOwnProperty(d)&&(f[d]=a.fields[d]);c&&(f.data=c);for(d in f)if(f.hasOwnProperty(d)){var h=f[d];a.formDataAppender?a.formDataAppender(e,d,h):b(e,h,d)}if(null!=a.file)if(angular.isArray(a.file))for(var i=0;i<a.file.length;i++)g(e,a.file[i],"file");else g(e,a.file,"file");return e}),d(a)},this.http=function(b){return b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=e.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1e3*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1e6*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1e9*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","UploadResize",function(a,b,c,d){var e=d;return e.getAttrWithDefaults=function(a,b){return null!=a[b]?a[b]:null==e.defaults[b]?e.defaults[b]:e.defaults[b].toString()},e.attrGetter=function(b,c,d,e){if(!d)return this.getAttrWithDefaults(c,b);try{return e?a(this.getAttrWithDefaults(c,b))(d,e):a(this.getAttrWithDefaults(c,b))(d)}catch(f){if(b.search(/min|max|pattern/i))return this.getAttrWithDefaults(c,b);throw f}},e.updateModel=function(c,d,f,g,h,i,j){function k(){var j=h&&h.length?h[0]:null;if(c){var k=!e.attrGetter("ngfMultiple",d,f)&&!e.attrGetter("multiple",d)&&!o;a(e.attrGetter("ngModel",d)).assign(f,k?j:h)}var l=e.attrGetter("ngfModel",d);l&&a(l).assign(f,h),g&&a(g)(f,{$files:h,$file:j,$newFiles:m,$duplicateFiles:n,$event:i}),b(function(){})}function l(a,b){var c=e.attrGetter("ngfResize",d,f);if(!c||!e.isResizeSupported())return b();for(var g=a.length,h=function(){g--,0===g&&b()},i=function(b){return function(c){a.splice(b,1,c),h()}},j=function(a){return function(b){h(),a.$error="resize",a.$errorParam=(b?(b.message?b.message:b)+": ":"")+(a&&a.name)}},k=0;k<a.length;k++){var l=a[k];l.$error||0!==l.type.indexOf("image")?h():e.resize(l,c.width,c.height,c.quality).then(i(k),j(l))}}var m=h,n=[],o=e.attrGetter("ngfKeep",d,f);if(o===!0){if(!h||!h.length)return;var p=(c&&c.$modelValue||d.$$ngfPrevFiles||[]).slice(0),q=!1;if(e.attrGetter("ngfKeepDistinct",d,f)===!0){for(var r=p.length,s=0;s<h.length;s++){for(var t=0;r>t;t++)if(h[s].name===p[t].name){n.push(h[s]);break}t===r&&(p.push(h[s]),q=!0)}if(!q)return;h=p}else h=p.concat(h)}d.$$ngfPrevFiles=h,j?k():e.validate(h,c,d,f,e.attrGetter("ngfValidateLater",d),function(){l(h,function(){b(function(){k()})})})},e}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"id"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');return n(a),a.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:a}),document.body.appendChild(a[0]),a}function p(c){if(b.attr("disabled")||t("ngfSelectDisabled",a))return!1;var d=q(c);return null!=d?d:(r(c),e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1)}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)},u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),j.registerValidators(d,w,c,a),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),a.$on("$destroy",function(){k()||w.remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.dataUrl:a.blobUrl)||a.dataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ngf-hide"):e.addClass("ngf-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;return"ngfThumbnail"!==g||d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),angular.isString(c)?(e.removeClass("ngf-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ngf-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.dataUrl=function(a,d){if(d&&null!=a.dataUrl||!d&&null!=a.blobUrl){var e=c.defer();return b(function(){e.resolve(d?a.dataUrl:a.blobUrl)}),e.promise}var f=d?a.$ngfDataUrlPromise:a.$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!d){var e;try{e=c.createObjectURL(a)}catch(f){return void b(function(){a.blobUrl="",g.reject()})}b(function(){a.blobUrl=e,e&&g.resolve(e)})}else{var h=new FileReader;h.onload=function(c){b(function(){a.dataUrl=c.target.result,g.resolve(c.target.result)})},h.onerror=function(){b(function(){a.dataUrl="",g.reject()})},h.readAsDataURL(a)}}else b(function(){a[d?"dataUrl":"blobUrl"]="",g.reject()})}),f=d?a.$ngfDataUrlPromise=g.promise:a.$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[d?"$ngfDataUrlPromise":"$ngfBlobUrlPromise"]}),f},d}]);var c=angular.element("<style>.ngf-hide{display:none !important}</style>");document.getElementsByTagName("head")[0].appendChild(c[0]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])return a.substring(1,a.length-1);var b=a.split(","),c="";if(b.length>1)for(var e=0;e<b.length;e++)c+="("+d(b[e])+")",e<b.length-1&&(c+="|");else 0===a.indexOf(".")&&(a="*"+a),c="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",c=c.replace(/\\\*/g,".*").replace(/\\\?/g,".");return c}var e=a;return e.registerValidators=function(a,b,c,d){function f(a){angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})}a&&(a.$ngfValidations=[],a.$formatters.push(function(g){return e.attrGetter("ngfValidateLater",c,d)||!a.$$ngfValidated?(e.validate(g,a,c,d,!1,function(){f(a),a.$$ngfValidated=!1}),g&&0===g.length&&(g=null),!b||null!=g&&0!==g.length||b.val()&&b.val(null)):(f(a),a.$$ngfValidated=!1),g}))},e.validatePattern=function(a,b){if(!b)return!0;var c=new RegExp(d(b),"gi");return null!=a.type&&c.test(a.type.toLowerCase())||null!=a.name&&c.test(a.name.toLowerCase())},e.validate=function(a,b,c,d,f,g){function h(c,d,e){if(a){for(var f="ngf"+c[0].toUpperCase()+c.substr(1),g=a.length,h=null;g--;){var i=a[g],k=j(f,{$file:i});null==k&&(k=d(j("ngfValidate")||{}),h=null==h?!0:h),null!=k&&(e(i,k)||(i.$error=c,i.$errorParam=k,a.splice(g,1),h=!1))}null!==h&&b.$ngfValidations.push({name:c,valid:h})}}function i(c,d,e,f,h){if(a){var i=0,l=!1,m="ngf"+c[0].toUpperCase()+c.substr(1);a=void 0===a.length?[a]:a,angular.forEach(a,function(a){if(0!==a.type.search(e))return!0;var n=j(m,{$file:a})||d(j("ngfValidate",{$file:a})||{});n&&(k++,i++,f(a,n).then(function(b){h(b,n)||(a.$error=c,a.$errorParam=n,l=!0)},function(){j("ngfValidateForce",{$file:a})&&(a.$error=c,a.$errorParam=n,l=!0)})["finally"](function(){k--,i--,i||b.$ngfValidations.push({name:c,valid:!l}),k||g.call(b,b.$ngfValidations)}))})}}b=b||{},b.$ngfValidations=b.$ngfValidations||[],angular.forEach(b.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return e.attrGetter(a,c,d,b)};if(f)return void g.call(b);if(b.$$ngfValidated=!0,null==a||0===a.length)return void g.call(b);if(a=void 0===a.length?[a]:a.slice(0),h("pattern",function(a){return a.pattern},e.validatePattern),h("minSize",function(a){return a.size&&a.size.min},function(a,b){return a.size>=e.translateScalars(b)}),h("maxSize",function(a){return a.size&&a.size.max},function(a,b){return a.size<=e.translateScalars(b)}),h("validateFn",function(){return null},function(a,b){return b===!0||null===b||""===b}),!a.length)return void g.call(b,b.$ngfValidations);var k=0;i("maxHeight",function(a){return a.height&&a.height.max},/image/,this.imageDimensions,function(a,b){return a.height<=b}),i("minHeight",function(a){return a.height&&a.height.min},/image/,this.imageDimensions,function(a,b){return a.height>=b}),i("maxWidth",function(a){return a.width&&a.width.max},/image/,this.imageDimensions,function(a,b){return a.width<=b}),i("minWidth",function(a){return a.width&&a.width.min},/image/,this.imageDimensions,function(a,b){return a.width>=b}),i("ratio",function(a){return a.ratio},/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++){var f=c[e],g=f.search(/x/i);f=g>-1?parseFloat(f.substring(0,g))/parseFloat(f.substring(g+1)):parseFloat(f),Math.abs(a.width/a.height-f)<1e-4&&(d=!0)}return d}),i("maxDuration",function(a){return a.duration&&a.duration.max},/audio|video/,this.mediaDuration,function(a,b){return a<=e.translateScalars(b)}),i("minDuration",function(a){return a.duration&&a.duration.min},/audio|video/,this.mediaDuration,function(a,b){return a>=e.translateScalars(b)}),i("validateAsyncFn",function(){return null},/./,function(a,b){return b},function(a){return a===!0||null===a||""===a}),k||g.call(b,b.$ngfValidations)},e.imageDimensions=function(a){if(a.width&&a.height){var d=b.defer();return c(function(){d.resolve({width:a.width,height:a.height})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void f.reject("not image"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.width=b,a.height=c,f.resolve({width:b,height:c})}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?e():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",e);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){f.reject("load error")})}),a.$ngfDimensionPromise=f.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},e.mediaDuration=function(a){if(a.duration){var d=b.defer();return c(function(){d.resolve(a.duration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void f.reject("not media"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.duration=b,h.remove(),f.resolve(b)}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?e():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",e);var i=0;g(),angular.element(document.body).append(h)},function(){f.reject("load error")})}),a.$ngfDurationPromise=f.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},e}]),ngFileUpload.service("UploadResize",["UploadValidate","$q","$timeout",function(a,b,c){var d=a,e=function(a,b,c,d){var e=Math.min(c/a,d/b);return{width:a*e,height:b*e}},f=function(a,c,d,f,g){var h=b.defer(),i=document.createElement("canvas"),j=document.createElement("img");return j.onload=function(){try{var a=e(j.width,j.height,c,d);i.width=a.width,i.height=a.height;var b=i.getContext("2d");b.drawImage(j,0,0,a.width,a.height),h.resolve(i.toDataURL(g||"image/WebP",f||1))}catch(k){h.reject(k)}},j.onerror=function(){h.reject()},j.src=a,h.promise},g=function(a){for(var b=a.split(","),c=b[0].match(/:(.*?);/)[1],d=atob(b[1]),e=d.length,f=new Uint8Array(e);e--;)f[e]=d.charCodeAt(e);return new Blob([f],{type:c})};return d.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")},d.resize=function(a,e,h,i){var j=b.defer();return 0!==a.type.indexOf("image")?(c(function(){j.resolve("Only images are allowed for resizing!")}),j.promise):(d.dataUrl(a,!0).then(function(b){f(b,e,h,i,a.type).then(function(b){var c=g(b);c.name=a.name,j.resolve(c)},function(){j.reject()})},function(){j.reject()}),j.promise)},d}]),function(){function a(a,c,d,e,f,g,h,i){function j(){return c.attr("disabled")||n("ngfDropDisabled",a)}function k(a,b,c,d){var e=n("ngfDragOverClass",a,{$event:c}),f=n("ngfDragOverClass")||"dragover";if(angular.isString(e))return void d(e);if(e&&(e.delay&&(r=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g)for(var h=n("ngfPattern",a,{$event:c}),j=0;j<g.length;j++)if("file"===g[j].kind||""===g[j].kind){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}}d(f)}function l(a,b,c,d){function e(a,b,c){if(null!=b)if(b.isDirectory){var d=(c||"")+b.name;a.push({name:b.name,type:"directory",path:d});var f=b.createReader(),g=[];i++;var h=function(){f.readEntries(function(d){try{if(d.length)g=g.concat(Array.prototype.slice.call(d||[],0)),h();else{for(var f=0;f<g.length;f++)e(a,g[f],(c?c:"")+b.name+"/");i--}}catch(j){i--,console.error(j)}},function(){i--})};h()}else i++,b.file(function(b){try{i--,b.path=(c?c:"")+b.name,a.push(b)}catch(d){i--,console.error(d)}},function(){i--})}var f=[],i=0,j=a.dataTransfer.items;if(j&&j.length>0&&"file"!==h.protocol())for(var k=0;k<j.length;k++){if(j[k].webkitGetAsEntry&&j[k].webkitGetAsEntry()&&j[k].webkitGetAsEntry().isDirectory){var l=j[k].webkitGetAsEntry();if(l.isDirectory&&!c)continue;null!=l&&e(f,l)}else{var m=j[k].getAsFile();null!=m&&f.push(m)}if(!d&&f.length>0)break}else{var n=a.dataTransfer.files;if(null!=n)for(var o=0;o<n.length&&(f.push(n.item(o)),d||!(f.length>0));o++);}var p=0;!function q(a){g(function(){if(i)10*p++<2e4&&q(10);else{if(!d&&f.length>1){for(k=0;"directory"===f[k].type;)k++;f=[f[k]]}b(f)}},a||0)}()}var m=b(),n=function(a,b,c){return i.attrGetter(a,d,b,c)};if(n("dropAvailable")&&g(function(){a[n("dropAvailable")]?a[n("dropAvailable")].value=m:a[n("dropAvailable")]=m}),!m)return void(n("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));i.registerValidators(e,null,d,a);var o,p=null,q=f(n("ngfStopPropagation")),r=1;c[0].addEventListener("dragover",function(b){if(!j()){if(b.preventDefault(),q(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(p),o||(o="C",k(a,d,b,function(a){o=a,c.addClass(o)}))}},!1),c[0].addEventListener("dragenter",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(){j()||(p=g(function(){o&&c.removeClass(o),o=null},r||1))},!1),c[0].addEventListener("drop",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation(),o&&c.removeClass(o),o=null,l(b,function(c){i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)},n("ngfAllowDir",a)!==!1,n("multiple")||n("ngfMultiple",a)))},!1),c[0].addEventListener("paste",function(b){if(!j()){var c=[],f=b.clipboardData||b.originalEvent.clipboardData;if(f&&f.items){for(var g=0;g<f.items.length;g++)-1!==f.items[g].type.indexOf("image")&&c.push(f.items[g].getAsFile());i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)}}},!1)}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImNvbXBhbmllcy9jb21wYW5pZXMubW9kdWxlLmpzIiwiYWxlcnRzL2FsZXJ0Lm1vZHVsZS5qcyIsImZlbGxvd3MvZmVsbG93cy5tb2R1bGUuanMiLCJwcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwiaG9tZS9ob21lLm1vZHVsZS5qcyIsInRhZ3MvdGFncy5tb2R1bGUuanMiLCJ2b3Rlcy92b3Rlcy5tb2R1bGUuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFuaWVzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFueS5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiY29tcGFuaWVzL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwiYWxlcnRzL2NvbnRyb2xsZXIvYWxlcnQuY29udHJvbGxlci5qcyIsImFsZXJ0cy9zZXJ2aWNlcy9hbGVydC5zZXJ2aWNlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3cuY29udHJvbGxlci5qcyIsImZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93cy5jb250cm9sbGVyLmpzIiwiZmVsbG93cy9kaXJlY3RpdmVzL2ZlbGxvd0NhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9zZXJ2aWNlcy9mZWxsb3dzLnNlcnZpY2UuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2FkbWluUHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9jb21wYW55UHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9mZWxsb3dzUHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9wcm9maWxlLmNvbnRyb2xsZXIuanMiLCJob21lL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvc2VydmljZXMvczMuc2VydmljZS5qcyIsInByb2ZpbGUvc2VydmljZXMvdXNlci5zZXJ2aWNlLmpzIiwidGFncy9jb250cm9sbGVycy90YWdzLmNvbnRyb2xsZXIuanMiLCJ0YWdzL3NlcnZpY2VzL3RhZ3Muc2VydmljZS5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2FkbWluVm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2NvbXBhbnlWb3Rlcy5jb250cm9sbGVyLmpzIiwidm90ZXMvY29udHJvbGxlcnMvZmVsbG93Vm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL3ZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9zZXJ2aWNlcy92b3Rlcy5zZXJ2aWNlLmpzIiwibmctZmlsZS11cGxvYWQubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMWRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogYXBwLnJvdXRlc1xuICogQGRlc2MgICAgY29udGFpbnMgdGhlIHJvdXRlcyBmb3IgdGhlIGFwcFxuICovXG5cbiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICduZ0Nvb2tpZXMnLCAgJ25nRmlsZVVwbG9hZCcsICd1aS5ib290c3RyYXAnLFxuICAgICdhcHAuY29uZmlnJywgJ2FwcC5ob21lJywgJ2FwcC5jb21wYW5pZXMnLCAnYXBwLmZlbGxvd3MnLCAnYXBwLnRhZ3MnLCAnYXBwLnByb2ZpbGUnLCAnYXBwLnZvdGVzJywgJ2FwcC5hbGVydCcgXSlcbiAgICAucnVuKHJ1bik7XG5cbi8qKlxuICogICAqIEBuYW1lIGNvbmZpZ1xuICogICAgICogQGRlc2MgRGVmaW5lIHZhbGlkIGFwcGxpY2F0aW9uIHJvdXRlc1xuICogICAgICAgKi9cbiBhcHAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XG5cbiAgICAkcm91dGVQcm92aWRlclxuICAgIC53aGVuKCcvJywge1xuICAgICAgICBjb250cm9sbGVyICA6ICdIb21lQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsIDogJ3NvdXJjZS9hcHAvaG9tZS9ob21lLmh0bWwnXG4gICAgfSlcbiAgICAud2hlbignL2ZlbGxvd3MnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvd3MuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvZmVsbG93cy86ZmVsbG93X2lkLzpmZWxsb3dfbmFtZScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9mZWxsb3cuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvY29tcGFuaWVzJywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFuaWVzLmh0bWwnXG4gICAgfSlcbiAgICAud2hlbignL2NvbXBhbmllcy86Y29tcGFueV9pZC86Y29tcGFueV9uYW1lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL2NvbXBhbnkuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy90YWdzJywge1xuICAgICAgICBjb250cm9sbGVyOiAnVGFnc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdGFncy90YWdzLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ1Byb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcHJvZmlsZS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUvYWRtaW4nLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblByb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4tcHJvZmlsZS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUvZmVsbG93Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvZmVsbG93LXByb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2NvbXBhbnknLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55UHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9jb21wYW55LXByb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oICcvdm90ZXMnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvdm90ZXMuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oICcvdm90ZXMvZmVsbG93Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Vm90ZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3ZvdGVzL3BhcnRpYWxzL2ZlbGxvdy12b3Rlcy5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbiggJy92b3Rlcy9jb21wYW55Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy9jb21wYW55LXZvdGVzLmh0bWwnXG4gICAgfSlcblxuICAgIC5vdGhlcndpc2UoeyByZWRpcmVjdFRvOiAnLycgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignUm91dGluZ0NvbnRyb2xsZXInLCBSb3V0aW5nQ29udHJvbGxlcilcbi5jb250cm9sbGVyKCdMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cblJvdXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnJHdpbmRvdycsICdVc2VyJywgJyRsb2NhdGlvbicsICckYW5jaG9yU2Nyb2xsJ107XG5Mb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckd2luZG93JywgJyRtb2RhbEluc3RhbmNlJywgJ1VzZXInXTtcblxuZnVuY3Rpb24gUm91dGluZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsICR3aW5kb3csIFVzZXIsICRsb2NhdGlvbiwgJGFuY2hvclNjcm9sbCkge1xuXG4gICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gZmFsc2U7XG4gICAgdXBkYXRlTG9naW5TdGF0dXMoKTtcblxuICAgICRzY29wZS5zY3JvbGxUbyA9IGZ1bmN0aW9uKGlkKXtcblxuICAgICAgICAkbG9jYXRpb24uaGFzaChpZCk7XG4gICAgICAgICRhbmNob3JTY3JvbGwoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9naW5TdGF0dXMoKXtcblxuICAgICAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBVc2VyLmlzVXNlckxvZ2dlZEluKCk7XG4gICAgICAgICRzY29wZS5pc1VzZXJBZG1pbiA9IFVzZXIuaXNVc2VyQWRtaW4oKTtcbiAgICB9XG5cbiAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvbG9naW4tcGFnZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgIHNpemU6ICcnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdXBkYXRlTG9naW5TdGF0dXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgJHNjb3BlLmxvZ291dFVzZXIgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIFVzZXIuQ2xlYXJDcmVkZW50aWFscygpO1xuXG4gICAgICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaXNVc2VyQWRtaW4gPSBmYWxzZTtcblxuICAgICAgICAkd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJHdpbmRvdywgJG1vZGFsSW5zdGFuY2UsIFVzZXIpIHtcblxuICAgIC8vIHNhdmUgdGhpcyB0aHJvdWdoIGEgcmVmZXNoXG4gICAgJHNjb3BlLmxvZ2luRm9ybSA9IHtcblxuICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgICAgIGVycm9yczogW11cbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24obG9naW5Gb3JtKSB7XG5cbiAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMgPSBbXTtcblxuICAgICAgICBVc2VyLmxvZ2luKGxvZ2luRm9ybSkuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICAgICAgLy9Vc2VyLmN1cnJlbnRVc2VyID0gdXNlclxuICAgICAgICAgICAgVXNlci5TZXRDcmVkZW50aWFscyh1c2VyLmlkLCB1c2VyLmVtYWlsLCB1c2VyLnVzZXJUeXBlKTtcblxuICAgICAgICAgICAgLy8kd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgICAgIH0pLmVycm9yKCBmdW5jdGlvbihlcnJvcil7XG5cbiAgICAgICAgICAgICRzY29wZS5sb2dpbkZvcm0uZXJyb3JzLnB1c2goXCJJbnZhbGlkIHVzZXIgY3JlZGVudGlhbHNcIik7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgfTtcbn1cblxuXG5ydW4uJGluamVjdCA9IFsnJGNvb2tpZVN0b3JlJywgJ1VzZXInXTtcbmZ1bmN0aW9uIHJ1bigkY29va2llU3RvcmUsIFVzZXIpe1xuXG4gICAgLy8ga2VlcCB1c2VyIGxvZ2dlZCBpbiBhZnRlciBwYWdlIHJlZnJlc2hcbiAgICB2YXIgY3VycmVudFVzZXIgPSAkY29va2llU3RvcmUuZ2V0KCdnbG9iYWxzJykgfHwge307XG4gICAgVXNlci5zZXRDdXJyZW50VXNlcihjdXJyZW50VXNlcik7XG5cbiAgICAvL2NvbnNvbGUubG9nKGN1cnJlbnRVc2VyKTtcbiAgICAvL2lmICgkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIpIHtcbiAgICAvLyAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gJ0Jhc2ljICcgKyAkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIuYXV0aGRhdGE7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgIC8vfVxuXG4gICAgLy8kcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIG5leHQsIGN1cnJlbnQpIHtcbiAgICAvLyAgICAvLyByZWRpcmVjdCB0byBsb2dpbiBwYWdlIGlmIG5vdCBsb2dnZWQgaW4gYW5kIHRyeWluZyB0byBhY2Nlc3MgYSByZXN0cmljdGVkIHBhZ2VcbiAgICAvLyAgICB2YXIgcmVzdHJpY3RlZFBhZ2UgPSAkLmluQXJyYXkoJGxvY2F0aW9uLnBhdGgoKSwgWycvbG9naW4nLCAnL3JlZ2lzdGVyJ10pID09PSAtMTtcbiAgICAvLyAgICB2YXIgbG9nZ2VkSW4gPSAkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXI7XG4gICAgLy8gICAgaWYgKHJlc3RyaWN0ZWRQYWdlICYmICFsb2dnZWRJbikge1xuICAgIC8vICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XG4gICAgLy8gICAgfVxuICAgIC8vfSk7XG59XG5cblxuLyoqXG4gKiBIZWxwZXIgRnVuY3Rpb25zXG4gKiovXG5cbnZhciBIRkhlbHBlcnMgPSBIRkhlbHBlcnMgfHwge307XG5cbkhGSGVscGVycy5oZWxwZXJzID0ge1xuXG4gICAgc2x1Z2lmeTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgJy0nKSAgICAgICAgICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCAtXG4gICAgICAgICAgICAucmVwbGFjZSgvW15cXHdcXC1dKy9nLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLVxcLSsvZywgJy0nKSAgICAgICAgIC8vIFJlcGxhY2UgbXVsdGlwbGUgLSB3aXRoIHNpbmdsZSAtXG4gICAgICAgICAgICAucmVwbGFjZSgvXi0rLywgJycpICAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIHN0YXJ0IG9mIHRleHRcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbiAgICB9LFxuXG4gICAgcGFyYWdyYXBoaXplOiBmdW5jdGlvbiggc3RyICkge1xuXG4gICAgICAgIGlmKCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyApIHJldHVybiAnJztcblxuICAgICAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoIFwiXFxuXCIgKTtcbiAgICAgICAgcmV0dXJuICggcGFydHMubGVuZ3RoID4gMCA/ICc8cD4nICsgcGFydHMuam9pbignPC9wPjxwPicpICsgJzwvcD4nIDogJycgKTtcbiAgICB9XG59O1xuXG5hcHAuZmlsdGVyKFwic2FuaXRpemVcIiwgWyckc2NlJywgZnVuY3Rpb24oJHNjZSkge1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGh0bWxDb2RlKXtcblxuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sQ29kZSk7XG4gICAgfTtcbn1dKTsiLCIvKipcbiAqIEEgcGxhY2UgdG8gcHV0IGFwcCB3aWRlIGNvbmZpZyBzdHVmZlxuICpcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSlcbiAgICAuY29uc3RhbnQoJ0NPTkZJRycsIHtcbiAgICAgICAgJ0FQUF9OQU1FJzogJ0hhY2tlciBGZWxsb3cgUG9ydGFsJyxcbiAgICAgICAgJ0FQUF9WRVJTSU9OJzogJzEuMCcsXG4gICAgICAgICdTRVJWSUNFX1VSTCc6ICcnXG4gICAgfSk7XG5cblxuLy92YXIgcm9vdFVybCA9ICdodHRwczovL3F1aWV0LWNvdmUtNjgzMC5oZXJva3VhcHAuY29tJztcbi8vIHZhciByb290VXJsID0gXCJodHRwczovL2JvaWxpbmctc3ByaW5ncy03NTIzLmhlcm9rdWFwcC5jb21cIjsiLCIvKipcbiAqIGNvbXBhbmllcyBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcblxuICAvLyBkZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJywgW10pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiBhbGVydCBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0JywgW1xuICAgICAgICAgICAgJ2FwcC5hbGVydC5jb250cm9sbGVycycsXG4gICAgICAgICAgICAnYXBwLmFsZXJ0LnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LnNlcnZpY2VzJywgW10pO1xuXG5cbn0pKCk7XG4iLCIvKipcbiAqIGZlbGxvd3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cycsIFtcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcblxuXG59KSgpO1xuIiwiLyoqXG4gKiBwcm9maWxlIG1vZHVsZVxuICovXG5cbiAoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnXG4gICAgICAgICAgICBdKTtcblxuICAgICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICAgYW5ndWxhclxuICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIGhvbWUgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZScsIFtcbiAgICAgICAgJ2FwcC5ob21lLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgLy8nYXBwLmhvbWUuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5kaXJlY3RpdmVzJywgW10pO1xuICAgIC8vaG93IGFib3V0IHRoaXNcbn0pKCk7XG4iLCIvKipcbiAqIHRhZ3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzJywgW1xuXG4gICAgICAgICAgICAnYXBwLnRhZ3MuY29udHJvbGxlcnMnLFxuICAgICAgICAgICAgJ2FwcC50YWdzLnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudGFncy5zZXJ2aWNlcycsIFtdKTtcblxuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLmNvbnRyb2xsZXJzJywgW10pO1xuXG5cblxufSkoKTtcbiIsIi8qKlxuICogdm90ZXMgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMnLCBbXG5cbiAgICAgICAgICAgICdhcHAudm90ZXMuY29udHJvbGxlcnMnLFxuICAgICAgICAgICAgJ2FwcC52b3Rlcy5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzLnNlcnZpY2VzJywgW10pO1xuXG5cbiAgICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJywgW10pO1xuXG5cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbmllc0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIENvbXBhbmllcykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBDb21wYW5pZXMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYW5pZXMgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG4gICAgICAgICdjb21wYW55JywgJ1ZvdGVzJywgJ1VzZXInXTtcblxuICAgIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgQ29tcGFueUNvbnRyb2xsZXIpO1xuXG4gICAgQ29tcGFueUNvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnQ29tcGFuaWVzJywgJ1VzZXInLCAnVm90ZXMnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlDb250cm9sbGVyKCAkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIENvbXBhbmllcywgVXNlciwgVm90ZXMsIEFsZXJ0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSBbXTtcbiAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IFtdO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgQ29tcGFuaWVzLmdldCggJHJvdXRlUGFyYW1zLmNvbXBhbnlfaWQgKS5zdWNjZXNzKGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgVXNlci5nZXRWb3RlcyggY29tcGFueS51c2VyX2lkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSB2b3Rlcy52b3Rlc0ZvcjtcbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNDYXN0ID0gdm90ZXMudm90ZXNDYXN0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlclZvdGVkID0gZnVuY3Rpb24gY3VycmVudFVzZXJWb3RlZCgpe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8ICRzY29wZS52b3Rlc0Zvci5sZW5ndGg7IGkrKyApe1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkc2NvcGUudm90ZXNGb3JbaV07XG4gICAgICAgICAgICAgICAgaWYoIGVsZW1lbnQuaWQgPT0gJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmlzRmVsbG93ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgcmV0dXJuICggJHNjb3BlLmN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSBcIkZlbGxvd1wiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUudm90ZSA9IGZ1bmN0aW9uIHZvdGUoY29tcGFueSkge1xuXG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuaXNGZWxsb3coKSApIHtcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBWb3Rlcy5jcmVhdGUoJHNjb3BlLmN1cnJlbnRVc2VyLmlkLCBjb21wYW55LnVzZXJfaWQpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICh2b3RlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvdGU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0LnNob3dBbGVydCggZXJyLmRhdGEsIFwiaW5mb1wiICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBjb21wYW55Q2FyZCk7XG5cblxuICAgIGZ1bmN0aW9uIGNvbXBhbnlDYXJkKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2NhcmQuaHRtbCcvKixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgICAgICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIvKipcbiogQ29tcGFuaWVzXG4qIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5zZXJ2aWNlc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycpXG4gICAgLnNlcnZpY2UoJ0NvbXBhbmllcycsIENvbXBhbmllcyk7XG5cbiAgQ29tcGFuaWVzLiRpbmplY3QgPSBbJyRodHRwJywgJ1VwbG9hZCcsICdDT05GSUcnXTtcblxuICAvKipcbiAgKiBAbmFtZXNwYWNlIENvbXBhbmllc1xuICAqL1xuICBmdW5jdGlvbiBDb21wYW5pZXMoJGh0dHAsIFVwbG9hZCwgQ09ORklHKSB7XG5cbiAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgIHJldHVybiB7XG4gICAgICBhbGw6IGFsbCxcbiAgICAgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcbiAgICAgIGdldDogZ2V0LFxuICAgICAgZ2V0QnlVc2VySWQ6IGdldEJ5VXNlcklkLFxuICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFsbFxuICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGNvbXBhbmllc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsbCgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXMgd2l0aCB0aGVpciB1c2VyIGFjY291bnQgaW5mb1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsbFdpdGhVc2VyKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJzJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0XG4gICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnlcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAbmFtZSBnZXRCeVVzZXJJZFxuICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnkgYnkgdXNlciBpZFxuICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QnlVc2VySWQodXNlcl9pZCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJfaWQvJyArIHBhcnNlSW50KHVzZXJfaWQpICk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKGNvbXBhbnkpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJywgY29tcGFueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdXBkYXRlXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbXBhbnkpIHtcblxuICAgICAgLy9yZXR1cm4gVXBsb2FkLnVwbG9hZCh7XG4gICAgICAvLyAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBjb21wYW55LmlkLFxuICAgICAgLy8gIGZpZWxkczogY29tcGFueSxcbiAgICAgIC8vICBmaWxlOiBjb21wYW55LmZpbGUsXG4gICAgICAvLyAgbWV0aG9kOiAnUFVUJ1xuICAgICAgLy9cbiAgICAgIC8vfSk7XG5cbiAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCwgY29tcGFueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGVzdHJveVxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgaWQpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuICogQWxlcnRDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignQWxlcnRDb250cm9sbGVyJywgQWxlcnRDb250cm9sbGVyKTtcblxuICAgIEFsZXJ0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBbGVydENvbnRyb2xsZXIoICRzY29wZSwgQWxlcnQgKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuYWxlcnQgPSBBbGVydC5hbGVydDtcblxuICAgICAgICAvLyBDbG9zZSBhbGVydCB3aW5kb3dcbiAgICAgICAgJHNjb3BlLmNsb3NlQWxlcnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICBBbGVydC5jbG9zZUFsZXJ0KCk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEFsZXJ0XG4gKiBAbmFtZXNwYWNlIGFwcC5hbGVydC5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ0FsZXJ0JywgQWxlcnQpO1xuXG4gICAgQWxlcnQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcblxuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEFsZXJ0XG4gICAgICovXG4gICAgZnVuY3Rpb24gQWxlcnQoICR0aW1lb3V0ICkge1xuXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFsZXJ0OiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvd0FsZXJ0OiBmdW5jdGlvbihuZXdNZXNzYWdlLCBuZXdUeXBlKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0Lm1lc3NhZ2UgPSBuZXdNZXNzYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQudHlwZSA9IG5ld1R5cGU7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5zaG93ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIEkgdGhpbmsgdGhpcyBpcyBvaz9cbiAgICAgICAgICAgICAgICAvLyBGb3Igc29tZSByZWFzb24gSSB3YW50ZWQgdGhlIGFsZXJ0IHRvIGF1dG8gY2xlYXIgYW5kIGNvdWxkbid0IGZpZ3VyZSBhXG4gICAgICAgICAgICAgICAgLy8gYmV0dGVyIHdheSB0byBoYXZlIGEgdGltZW91dCBhdXRvbWF0aWNhbGx5IGNsb3NlIHRoZSBhbGVydC4gSSBmZWVsIGxpa2VcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHNvbWUgc29ydCBvZiBzY29waW5nIHdlaXJkbmVzcyBnb2luZyBvbiBoZXJlLCBidXQgaXQgd29ya3MgYW5kIElcbiAgICAgICAgICAgICAgICAvLyBhbSB0aXJlZCwgc28gaXQgaXMgZ2V0dGluZyBjb21taXR0ZWQgOy1wXG4gICAgICAgICAgICAgICAgdmFyIGFsZXJ0ID0gdGhpcy5hbGVydDtcbiAgICAgICAgICAgICAgICAkdGltZW91dCggZnVuY3Rpb24oKXsgYWxlcnQuc2hvdyA9IGZhbHNlOyB9LCAgNTAwMCApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlQWxlcnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC50eXBlID0gJ2luZm8nO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRmVsbG93Q29udHJvbGxlcicsIEZlbGxvd0NvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93Q29udHJvbGxlci4kaW5qZWN0ID0gWyckcm91dGVQYXJhbXMnLCAnJHNjb3BlJywgJyR0aW1lb3V0JywgJ0ZlbGxvd3MnLCAnVXNlcicsICdWb3RlcyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd0NvbnRyb2xsZXIoJHJvdXRlUGFyYW1zLCAkc2NvcGUsICR0aW1lb3V0LCBGZWxsb3dzLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgZmVsbG93cyBjb250cm9sbGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSBbXTtcbiAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IFtdO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgRmVsbG93cy5nZXQoICRyb3V0ZVBhcmFtcy5mZWxsb3dfaWQgKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3cpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAgICAgVXNlci5nZXRWb3RlcyggZmVsbG93LnVzZXJfaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0ZvciA9IHZvdGVzLnZvdGVzRm9yO1xuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSB2b3Rlcy52b3Rlc0Nhc3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyVm90ZWQgPSBmdW5jdGlvbiBjdXJyZW50VXNlclZvdGVkKCl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgJHNjb3BlLnZvdGVzRm9yLmxlbmd0aDsgaSsrICl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICRzY29wZS52b3Rlc0ZvcltpXTtcbiAgICAgICAgICAgICAgICBpZiggZWxlbWVudC5pZCA9PSAkc2NvcGUuY3VycmVudFVzZXIuaWQgKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaXNDb21wYW55ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgcmV0dXJuICggJHNjb3BlLmN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSBcIkNvbXBhbnlcIiApO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS52b3RlID0gZnVuY3Rpb24gdm90ZShmZWxsb3cpIHtcblxuICAgICAgICAgICAgaWYgKCAkc2NvcGUuaXNDb21wYW55KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBWb3Rlcy5jcmVhdGUoJHNjb3BlLmN1cnJlbnRVc2VyLmlkLCBmZWxsb3cudXNlcl9pZClcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHZvdGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHZvdGUgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvdGU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiK2Vycik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dzQ29udHJvbGxlcicsIEZlbGxvd3NDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnRmVsbG93cyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBGZWxsb3dzKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIEZlbGxvd3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93cykge1xuXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoZmVsbG93KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvcGFydGlhbHMvZmVsbG93X2RldGFpbF92aWV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZlbGxvd3MgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdycsXG4gICAgICAgICdWb3RlcycsICdVc2VyJywgJyR0aW1lb3V0J107XG5cbiAgICBmdW5jdGlvbiBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93LCBWb3RlcywgVXNlcikge1xuXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhmZWxsb3cpO1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLmZlbGxvdyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2ZlbGxvd0NhcmQnLCBmZWxsb3dDYXJkKTtcblxuICAvL25nLWZlbGxvdy1jYXJkXG4gZnVuY3Rpb24gZmVsbG93Q2FyZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICBzY29wZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfY2FyZC5odG1sJy8qLFxuICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIH0pO1xuICAgICAgIH0gKi9cbiAgICB9O1xuICB9XG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dzXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdGZWxsb3dzJywgRmVsbG93cyk7XG5cbiAgICBGZWxsb3dzLiRpbmplY3QgPSBbJyRodHRwJywgJ1VwbG9hZCcsICdDT05GSUcnXTtcblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzXG4gICAgICogQHJldHVybnMge1NlcnZpY2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBhbGxXaXRoVXNlcjogYWxsV2l0aFVzZXIsXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGFsbFxuICAgICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbFdpdGhVc2VyKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzL3VzZXJzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0XG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldEJ5VXNlcklkXG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93IGJ5IHVzZXJfaWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VyX2lkLycgKyB1c2VyX2lkKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShmZWxsb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycsIGZlbGxvdyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZmVsbG93KSB7XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgLy8gICAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLFxuICAgICAgICAgICAgLy8gICAgZmllbGRzOiBmZWxsb3csXG4gICAgICAgICAgICAvLyAgICBmaWxlOiBmZWxsb3cuZmlsZSxcbiAgICAgICAgICAgIC8vICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL30pO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsIGZlbGxvdyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBBZG1pblByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJG1vZGFsJywgJ1VzZXInLCAnRmVsbG93cycsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuICAgICAqL1xuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCAkbW9kYWwsIFVzZXIsIEZlbGxvd3MsIENvbXBhbmllcykge1xuXG4gICAgICAgIC8vIFRPRE8gLSBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvciBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYW4gQWRtaW5cbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiQWRtaW5cIiApe1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBbXTtcbiAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IFtdO1xuICAgICAgICAkc2NvcGUudXNlckxpc3RMb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuZmVsbG93cy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBGZWxsb3dzLmFsbFdpdGhVc2VyKCkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93cykge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBmZWxsb3dzICk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIENvbXBhbmllcy5hbGxXaXRoVXNlcigpLnN1Y2Nlc3MoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBjb21wYW5pZXMgKTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS51c2VyTGlzdExvYWQoKTtcblxuXG4gICAgICAgICRzY29wZS5mZWxsb3dWb3RlcyA9IGZ1bmN0aW9uKCBmZWxsb3cgKXtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9mZWxsb3ctdm90ZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdzogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnlWb3RlcyA9IGZ1bmN0aW9uKCBjb21wYW55ICl7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vY29tcGFueS12b3Rlcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFueTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZWRpdEZlbGxvdyA9IGZ1bmN0aW9uKGZlbGxvdyl7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgdXNlciBkYXRhIHRvIHNlcnZpY2VcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9lZGl0LWZlbGxvdy1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0RmVsbG93TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmVsbG93O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZWRpdENvbXBhbnk9IGZ1bmN0aW9uKGNvbXBhbnkpe1xuXG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZWRpdC1jb21wYW55LWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBjb21wYW55OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gQFRPRE8gLSBJbXBsZW1lbnQgTGF0ZXJcbiAgICAgICAgJHNjb3BlLmFyY2hpdmVGZWxsb3cgPSBmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBcmNoaXZlIFVzZXI6IFwiK3VzZXIuaWQpO1xuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyogQ3JlYXRlIFVzZXIgKi9cbiAgICAgICAgJHNjb3BlLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbiAodXNlcikge1xuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9uZXctdXNlci1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbiggZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYoIG5ld0l0ZW0udXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MudW5zaGlmdCggbmV3SXRlbSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKCBuZXdJdGVtLnVzZXIudXNlclR5cGUgPT09ICdDb21wYW55JyApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzLnVuc2hpZnQoIG5ld0l0ZW0gKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyc1xuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdENvbXBhbnlNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEVkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdmZWxsb3cnLCAnVXNlcicsICdGZWxsb3dzJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRGZWxsb3dNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93LCBVc2VyLCBGZWxsb3dzKSB7XG5cbiAgICAgICAgJHNjb3BlLnVzZXIgPSBmZWxsb3cudXNlcjtcbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgVXNlci51cGRhdGUoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24obmV3VXNlcil7XG5cbiAgICAgICAgICAgICAgICAvLyBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSBuZXdVc2VyO1xuXG4gICAgICAgICAgICAgICAgLy8gdXNlciBpcyB1cGRhdGVkLCBzbyBub3cgdXBkYXRlIGZlbGxvd1xuICAgICAgICAgICAgICAgIEZlbGxvd3MudXBkYXRlKCAkc2NvcGUuZmVsbG93ICkudGhlbihmdW5jdGlvbihuZXdGZWxsb3cpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IG5ld0ZlbGxvdztcblxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gWyBcIlRoZXJlIHdhcyBhbiBlcnJvciB1cGRhdGluZyB0aGUgZmVsbG93XCIgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAvLyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBmZWxsb3dcIiBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgRWRpdENvbXBhbnlNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnY29tcGFueScsICdVc2VyJywgJ0NvbXBhbmllcycgXTtcbiAgICBmdW5jdGlvbiBFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55LCBVc2VyLCBDb21wYW5pZXMpIHtcblxuICAgICAgICAkc2NvcGUudXNlciA9IGNvbXBhbnkudXNlcjtcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICBVc2VyLnVwZGF0ZSgkc2NvcGUudXNlcikudGhlbiggZnVuY3Rpb24oIG5ld1VzZXIgKXtcblxuICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IG5ld1VzZXI7XG5cbiAgICAgICAgICAgICAgICBDb21wYW5pZXMudXBkYXRlKCRzY29wZS5jb21wYW55KS50aGVuKCBmdW5jdGlvbiggbmV3Q29tcGFueSApe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBuZXdDb21wYW55O1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBjb21wYW55XCIgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIGNvbXBhbnlcIiBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS51c2VyKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JyBdO1xuICAgIGZ1bmN0aW9uIEZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoICRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdyApe1xuXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgLy8gQ2hlY2sgZmVsbG93IFZvdGVzRm9yIHRvIHNlZSBpZiBhIGNvbXBhbnkgdm90ZWQgZm9yIGEgZmVsbG93XG4gICAgICAgICRzY29wZS5jb21wYW55Vm90ZWRGb3JGZWxsb3cgPSBmdW5jdGlvbiggY29tcGFueV91c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgZmVsbG93LnVzZXIuVm90ZXNGb3IubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gZmVsbG93LnVzZXIuVm90ZXNGb3JbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0Nhc3QgdG8gc2VlIGlmIHRoZXkgdm90ZWQgZm9yIGEgY29tcGFueVxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZWRGb3JDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGZlbGxvdy51c2VyLlZvdGVzQ2FzdC5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBmZWxsb3cudXNlci5Wb3Rlc0Nhc3RbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55JyBdO1xuICAgIGZ1bmN0aW9uIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCAkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55ICl7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0Nhc3QgdG8gc2VlIGlmIHRoZXkgdm90ZWQgZm9yIGEgY29tcGFueVxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZWRGb3JDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbXBhbnkudXNlci5Wb3Rlc0Zvci5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBjb21wYW55LnVzZXIuVm90ZXNGb3JbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0ZvciB0byBzZWUgaWYgYSBjb21wYW55IHZvdGVkIGZvciBhIGZlbGxvd1xuICAgICAgICAkc2NvcGUuY29tcGFueVZvdGVkRm9yRmVsbG93ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbXBhbnkudXNlci5Wb3Rlc0Nhc3QubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gY29tcGFueS51c2VyLlZvdGVzQ2FzdFtpXTtcblxuICAgICAgICAgICAgICAgIGlmKCB2b3RlLmlkID09PSBjb21wYW55X3VzZXJfaWQgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJywgJ0ZlbGxvd3MnLCAnQ29tcGFuaWVzJyBdO1xuICAgIGZ1bmN0aW9uIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uICh1c2VyKXtcblxuICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFtdO1xuXG4gICAgICAgICAgICAvLyBGb3JtIGlzIGJlaW5nIHZhbGlkYXRlZCBieSBhbmd1bGFyLCBidXQgbGVhdmluZyB0aGlzIGp1c3QgaW4gY2FzZVxuICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyICA9PT0gXCJ1bmRlZmluZWRcIil7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIFwiQWRkIHNvbWUgZGF0YSBmaXJzdFwiICk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyLmVtYWlsID09PSBcInVuZGVmaW5lZFwiICkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggXCJFbnRlciBhbiBlbWFpbFwiICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyLnBhc3N3b3JkID09PSBcInVuZGVmaW5lZFwiICkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggXCJFbnRlciBhIHBhc3N3b3JkXCIgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHVzZXIudXNlclR5cGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCBcIkNob29zZSBhIHVzZXIgdHlwZVwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuZXJyb3JzLmxlbmd0aCA9PT0gMCApe1xuXG4gICAgICAgICAgICAgICAgLy8gc2VuZCB1c2VyIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgICAgIFVzZXIuY3JlYXRlKHVzZXIpLnRoZW4oIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHVzZXIgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdXNlciApO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyX2lkID0gcmVzcG9uc2UuZGF0YS5pZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVsbG93X3Bvc3QgPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgRmVsbG93cy5jcmVhdGUoZmVsbG93X3Bvc3QpLnRoZW4oIGZ1bmN0aW9uKCBmZWxsb3cgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmZWxsb3cgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBmZWxsb3cgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSggZmVsbG93ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZlbGxvdyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXNwb25zZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggcmVzcG9uc2UuZGF0YS5lcnJvciApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJDb21wYW55XCIgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhbnlfcG9zdCA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlcl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbXBhbmllcy5jcmVhdGUoY29tcGFueV9wb3N0KS50aGVuKCBmdW5jdGlvbiggY29tcGFueSApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGNvbXBhbnkgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCBjb21wYW55ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZlbGxvdyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXNwb25zZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggcmVzcG9uc2UuZGF0YS5lcnJvciApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB1c2VyIGVycm9yIGNhbGxiYWNrXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggcmVzcG9uc2UuZGF0YS5lcnJvciApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuKiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJywgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyKTtcblxuICAgIENvbXBhbnlQcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ0NvbXBhbmllcycsICdVc2VyJywgJ1RhZ3MnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICogQG5hbWVzcGFjZSBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgQ29tcGFuaWVzLCBVc2VyLCBUYWdzLCBBbGVydCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiB0aGUgcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvZiBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYSBDb21wYW55XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkNvbXBhbnlcIiApe1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQ29tcGFuaWVzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uKGNvbXBhbnkpe1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbih0YWdzKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS50YWdzID0gdGFncztcblxuICAgICAgICAgICAgICAgIC8vdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAvL3RhZ3MuZm9yRWFjaChmdW5jdGlvbih0YWcpe1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgaWQ6IHRhZy5pZCxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGV4dDogdGFnLm5hbWVcbiAgICAgICAgICAgICAgICAvLyAgICB9O1xuICAgICAgICAgICAgICAgIC8vICAgIGRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAvL30pO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8kKFwic2VsZWN0I3RhZ3NcIikuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgLy8gICAgLy90YWdzOiB0cnVlLFxuICAgICAgICAgICAgICAgIC8vICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgLy8gICAgdG9rZW5TZXBhcmF0b3JzOiBbJywnLCcgJ11cbiAgICAgICAgICAgICAgICAvL30pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgcHJvZmlsZSBjb250cm9sbGVyIScpO1xuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcblxuICAgICAgICAgICAgLy8gZ2V0IHRoZSB0YWdzIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgIC8vY29tcGFueS50YWdzID0gJChcIiN0YWdzXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHRhZ3MgPSBbXTtcbiAgICAgICAgICAgICQoJyN0YWdzIDpzZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24oaSwgc2VsZWN0ZWQpe1xuICAgICAgICAgICAgICAgIHRhZ3NbaV0gPSAkKHNlbGVjdGVkKS52YWwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb21wYW55LnRhZ3MgPSB0YWdzO1xuXG4gICAgICAgICAgICAvLyBzZW5kIGNvbXBhbmllcyBpbmZvIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgQ29tcGFuaWVzLnVwZGF0ZShjb21wYW55KS5zdWNjZXNzKGZ1bmN0aW9uKG5ld0NvbXBhbnlEYXRhKXtcblxuICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcbiAgICAgICAgICAgICAgICBjb21wYW55ID0gbmV3Q29tcGFueURhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBoaWRlIHVwZGF0ZSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoICdZb3VyIHByb2ZpbGUgaGFzIGJlZW4gdXBkYXRlZCcsICdzdWNjZXNzJyApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqIFMzIEZpbGUgdXBsb2FkaW5nICoqL1xuICAgICAgICAkc2NvcGUuZ2V0UzNLZXkgPSBmdW5jdGlvbigpe1xuXG5cbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZV9pbnB1dFwiKS5maWxlcztcbiAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbMF07XG5cbiAgICAgICAgICAgIGlmKGZpbGUgPT09IG51bGwpe1xuXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJObyBmaWxlIHNlbGVjdGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLVwiICsgJHNjb3BlLmNvbXBhbnkudXNlcl9pZCArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcIi9zaWduX3MzP2ZpbGVfbmFtZT1cIitmaWxlX25hbWUrXCImZmlsZV90eXBlPVwiK2ZpbGUudHlwZSk7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIGlmKHhoci5yZWFkeVN0YXRlID09PSA0KXtcblxuICAgICAgICAgICAgICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkX2ZpbGUoZmlsZSwgcmVzcG9uc2Uuc2lnbmVkX3JlcXVlc3QsIHJlc3BvbnNlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZ2V0IHNpZ25lZCBVUkwuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRfZmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKXtcblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4oXCJQVVRcIiwgc2lnbmVkX3JlcXVlc3QpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtYW16LWFjbCcsICdwdWJsaWMtcmVhZCcpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gIFNldCBpbWFnZSBwcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJldmlld1wiKS5zcmMgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGNvbXBhbnkgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkuaW1hZ2VfdXJsID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFuZ3VsYXIgaXMgd2VpcmQgd2hlbiB1cGRhdGluZyBpbWFnZXMgdGhhdCBzdGFydGVkIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92aW5nIG5nLWhpZGUgdG8gZm9yY2UgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJldmlld1wiKS5yZW1vdmVDbGFzcygnbmctaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnVzZXItcGhvdG9cIikuZmluZChcIi5wbGFjZWhvbGRlclwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4qIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLCBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJHRpbWVvdXQnLCAnRmVsbG93cycsICdUYWdzJywgJ1VzZXInLCAnUzMnLCAnQWxlcnQnIF07XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sICR0aW1lb3V0LCBGZWxsb3dzLCBUYWdzLCBVc2VyLCBTMywgQWxlcnQgKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgRmVsbG93XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBGZWxsb3dzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvdyl7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgICRzY29wZS50YWdzID0gW107XG4gICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24odGFncyl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudGFncyA9IHRhZ3M7XG5cbiAgICAgICAgICAgICAgICAvLyBiaW5kIGpRdWVyeSBtdWx0aSBzZWxlY3RcbiAgICAgICAgICAgICAgICAvLyAtLSBhZGRlZCB0aW1lb3V0IHRvIG1ha2Ugc3VyZSB0aGUgI3RhZ3Mgc2VsZWN0IGVsZW1lbnQgZ2V0cyBwb3B1bGF0ZWRcbiAgICAgICAgICAgICAgICAvLyAtLSBAVE9ETyAtLSBGaW5kIGEgYmV0dGVyIHdheSB0byBhZGQgZnVuY3Rpb25hbGl0eSB0byBUYWdzXG4gICAgICAgICAgICAgICAgLy8kdGltZW91dCggZnVuY3Rpb24oKXsgJChcIiN0YWdzXCIpLm11bHRpU2VsZWN0KHtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICAgIHNlbGVjdGFibGVIZWFkZXI6ICdBdmFpbGFibGUgU2tpbGxzJyxcbiAgICAgICAgICAgICAgICAvLyAgICBzZWxlY3Rpb25IZWFkZXI6ICdZb3VyIFNraWxscydcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vfSk7IH0sICA1MDAgKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihmZWxsb3csIGZpbGUpIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyAoIGZlbGxvdy50YWdzICk7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgZmVsbG93cyBpbmZvIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgRmVsbG93cy51cGRhdGUoZmVsbG93KS5zdWNjZXNzKGZ1bmN0aW9uKG5ld0ZlbGxvd0RhdGEpe1xuXG4gICAgICAgICAgICAgICAgLy8gKiogVHJpZ2dlciBTdWNjZXNzIG1lc3NhZ2UgaGVyZVxuICAgICAgICAgICAgICAgIGZlbGxvdyA9IG5ld0ZlbGxvd0RhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBoaWRlIHVwZGF0ZSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoICdZb3VyIHByb2ZpbGUgaGFzIGJlZW4gdXBkYXRlZCcsICdzdWNjZXNzJyApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqIFMzIEZpbGUgdXBsb2FkaW5nICoqL1xuICAgICAgICAkc2NvcGUuZ2V0UzNLZXkgPSBmdW5jdGlvbigpe1xuXG5cbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZV9pbnB1dFwiKS5maWxlcztcbiAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbMF07XG5cbiAgICAgICAgICAgIGlmKGZpbGUgPT09IG51bGwpe1xuXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJObyBmaWxlIHNlbGVjdGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuICAgICAgICBmdW5jdGlvbiBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIHByZXZlbnQgbmFtaW5nIGNvbGxpc2lvbnMgYnkgYXBwZW5kaW5nIHRoZSB1bmlxdWUgdXNlcl9pZCB0byBmaWxlIG5hbWVcbiAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICB2YXIgcGllY2VzID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gcGllY2VzLmpvaW4oXCIuXCIpICsgXCItXCIgKyAkc2NvcGUuZmVsbG93LnVzZXJfaWQgKyBcIi5cIiArIGV4dGVuc2lvbjtcblxuICAgICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgXCIvc2lnbl9zMz9maWxlX25hbWU9XCIrZmlsZV9uYW1lK1wiJmZpbGVfdHlwZT1cIitmaWxlLnR5cGUpO1xuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBpZih4aHIucmVhZHlTdGF0ZSA9PT0gNCl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZF9maWxlKGZpbGUsIHJlc3BvbnNlLnNpZ25lZF9yZXF1ZXN0LCByZXNwb25zZS51cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGdldCBzaWduZWQgVVJMLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkX2ZpbGUoZmlsZSwgc2lnbmVkX3JlcXVlc3QsIHVybCl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vcGVuKFwiUFVUXCIsIHNpZ25lZF9yZXF1ZXN0KTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCd4LWFtei1hY2wnLCAncHVibGljLXJlYWQnKTtcblxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICBTZXQgaW1hZ2UgcHJldmlld1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZpZXdcIikuc3JjID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBmZWxsb3cgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvdy5pbWFnZV91cmwgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQW5ndWxhciBpcyB3ZWlyZCB3aGVuIHVwZGF0aW5nIGltYWdlcyB0aGF0IHN0YXJ0ZWQgd2l0aCBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZpbmcgbmctaGlkZSB0byBmb3JjZSB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcmV2aWV3XCIpLnJlbW92ZUNsYXNzKCduZy1oaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIudXNlci1waG90b1wiKS5maW5kKFwiLnBsYWNlaG9sZGVyXCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpOyIsIi8qKlxuKiBQcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJ107XG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgUHJvZmlsZUNvbnRyb2xsZXJcbiAgKi9cbiAgZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIpIHtcblxuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgIC8vIHJlZGlyZWN0IHRoZSB1c2VyIGJhc2VkIG9uIHRoZWlyIHR5cGVcbiAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBib3NzXCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2FkbWluXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBmZWxsYVwiKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9mZWxsb3dcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBjb21wYW55XCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2NvbXBhbnlcIik7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcblxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICB9XG5cbiAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiogSG9tZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmVsbG93cyddO1xuXG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcbiAgKi9cbiAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlLCBGZWxsb3dzKSB7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvd3Mpe1xuXG4gICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgfSk7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgaG9tZSBjb250cm9sbGVyIScpO1xuICAgICAgLy9Ib21lLmFsbCgpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuICogUzNcbiAqIEBuYW1lc3BhY2UgYXBwLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gQFRPRE8gLS0gSW1wbGVtZW50IHRoZSBTMyBzZXJ2aWNlXG5cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnKVxuICAgICAgICAuc2VydmljZSgnUzMnLCBTMyk7XG5cbiAgICBTMy4kaW5qZWN0ID0gWyckaHR0cCcsICdDT05GSUcnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgUzNcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTMygkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgZ2V0UzNLZXk6IGdldFMzS2V5LFxuICAgICAgICAgICAgdXBsb2FkRmlsZTogdXBsb2FkRmlsZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gR2V0IHRoZSBpbWFnZSBmaWxlIGFuZCB0cmlnZ2VyIHJlcXVlc3QgdG8gUzNcbiAgICAgICAgZnVuY3Rpb24gZ2V0UzNLZXkoIGZpbGUsIHVzZXJfaWQgKXtcblxuICAgICAgICAgICAgaWYoZmlsZSAhPT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICAvLyBUcnlpbmcgdG8gcHJldmVudCBuYW1pbmcgY29sbGlzaW9ucyBieSBhcHBlbmRpbmcgdGhlIHVuaXF1ZSB1c2VyX2lkIHRvIGZpbGUgbmFtZVxuICAgICAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgICAgIHZhciBwaWVjZXMgPSBmaWxlLm5hbWUuc3BsaXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHVzZXJfaWQgKyBcIi1cIiArIHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcblxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlXG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdHVhbGx5IHVwbG9hZCB0aGUgbmV3IGZpbGUgdG8gUzNcbiAgICAgICAgLy8gLS0gcHV0cyB0aGUgbmV3IHVybCBpbiBhIGhpZGRlbiBmb3JtIGVsZW1lbnRcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkRmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKXtcblxuICAgICAgICAgICAgLy8gKiogVEhJUyBET0VTIE5PVCBXT1JLICoqL1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgICAgICB1cmw6IHNpZ25lZF9yZXF1ZXN0LFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYW16LWFjbCc6ICdwdWJsaWMtcmVhZCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGE6IGZpbGUsXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZpbGUudHlwZVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy92YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAvL3hoci5vcGVuKFwiUFVUXCIsIHNpZ25lZF9yZXF1ZXN0KTtcbiAgICAgICAgICAgIC8veGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtYW16LWFjbCcsICdwdWJsaWMtcmVhZCcpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8veGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgICAgIC8vICAgIH1cbiAgICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL3hoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgYWxlcnQoXCJDb3VsZCBub3QgdXBsb2FkIGZpbGUuXCIpO1xuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8veGhyLnNlbmQoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiAqIFByb2ZpbGVcbiAqIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXG4gICAgLmZhY3RvcnkoJ1VzZXInLCBVc2VyKTtcblxuICBVc2VyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJGNvb2tpZVN0b3JlJywgJyRodHRwJywgJ0NPTkZJRyddO1xuXG4gIC8qKlxuICAgKiBAbmFtZXNwYWNlIFVzZXJcbiAgICogQHJldHVybnMge1NlcnZpY2V9XG4gICAqL1xuICBmdW5jdGlvbiBVc2VyKCRyb290U2NvcGUsICRjb29raWVTdG9yZSwgJGh0dHAsIENPTkZJRykge1xuXG4gICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgLy8gV2lsbCBob2xkIGluZm8gZm9yIHRoZSBjdXJyZW50bHkgbG9nZ2VkIGluIHVzZXJcbiAgICAgIHZhciBjdXJyZW50VXNlciA9IHt9O1xuXG4gICAgICBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpIHtcblxuICAgICAgICAgIHJldHVybiBjdXJyZW50VXNlcjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFVzZXIodXNlcikge1xuXG4gICAgICAgICAgY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRWb3RlcyggdXNlcl9pZCApe1xuXG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdXNlcnMvJyArIHVzZXJfaWQgKyAnL3ZvdGVzJyApO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGxvZ2luXG4gICAgICAgKiBAZGVzYyBsb2dpbiBhIG5ldyB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBsb2dpbih1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2xvZ2luJywgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAvL2FsbDogYWxsLFxuICAgICAgICAgIC8vZ2V0OiBnZXQsXG4gICAgICAgICAgZ2V0Vm90ZXM6IGdldFZvdGVzLFxuICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICAvL2Rlc3Ryb3k6IGRlc3Ryb3lcbiAgICAgICAgICBTZXRDcmVkZW50aWFsczogU2V0Q3JlZGVudGlhbHMsXG4gICAgICAgICAgQ2xlYXJDcmVkZW50aWFsczogQ2xlYXJDcmVkZW50aWFscyxcbiAgICAgICAgICBnZXRDdXJyZW50VXNlcjogZ2V0Q3VycmVudFVzZXIsXG4gICAgICAgICAgc2V0Q3VycmVudFVzZXI6IHNldEN1cnJlbnRVc2VyLFxuICAgICAgICAgIGlzVXNlckxvZ2dlZEluOiBpc1VzZXJMb2dnZWRJbixcbiAgICAgICAgICBpc1VzZXJBZG1pbjogaXNVc2VyQWRtaW5cbiAgICAgIH07XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIHVzZXJzXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gYWxsKCkge1xuICAgICAgLy9cbiAgICAgIC8vICAgIHJldHVybiBbXTtcbiAgICAgIC8vXG4gICAgICAvLyAgICAvL3JldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcbiAgICAgIC8vfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIHVzZXJcbiAgICAgICAqL1xuICAgICAgLy9mdW5jdGlvbiBnZXQoaWQpIHtcbiAgICAgIC8vICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBwYXJzZUludChpZCkgKTtcbiAgICAgIC8vfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICogQGRlc2MgY3JlYXRlIGEgbmV3IHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh1c2VyKSB7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdXNlcnMvY3JlYXRlJywgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgKiBAZGVzYyB1cGRhdGVhIGEgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gdXBkYXRlKHVzZXIpIHtcblxuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyB1c2VyLmlkLCB1c2VyKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgLy9mdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICAvLyAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyByb290VXJsICsgJy9hcGkvdjEvdXNlcnMvJyArIGlkKTtcbiAgICAgIC8vfVxuXG4gICAgICBmdW5jdGlvbiBpc1VzZXJMb2dnZWRJbigpe1xuXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XG4gICAgICAgICAgaWYoIE9iamVjdC5rZXlzKGN1cnJlbnRVc2VyKS5sZW5ndGggPiAwICl7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc1VzZXJBZG1pbigpe1xuXG4gICAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gU2V0Q3JlZGVudGlhbHMoaWQsIHVzZXJuYW1lLCB1c2VyVHlwZSkge1xuXG4gICAgICAgICAgdmFyIGF1dGhkYXRhID0gQmFzZTY0LmVuY29kZShpZCArICc6JyArIHVzZXJuYW1lICsgJzonICsgdXNlclR5cGUpO1xuXG4gICAgICAgICAgY3VycmVudFVzZXIgPSB7XG4gICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICB1c2VyVHlwZTogdXNlclR5cGUsXG4gICAgICAgICAgICAgIGF1dGhkYXRhOiBhdXRoZGF0YVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkY29va2llU3RvcmUucHV0KCdnbG9iYWxzJywgY3VycmVudFVzZXIpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBDbGVhckNyZWRlbnRpYWxzKCkge1xuXG4gICAgICAgICAgJHJvb3RTY29wZS5nbG9iYWxzID0ge307XG4gICAgICAgICAgJGNvb2tpZVN0b3JlLnJlbW92ZSgnZ2xvYmFscycpO1xuICAgICAgfVxuXG4gIH1cblxuICAvLyBCYXNlNjQgZW5jb2Rpbmcgc2VydmljZSB1c2VkIGJ5IEF1dGhlbnRpY2F0aW9uU2VydmljZVxuICB2YXIgQmFzZTY0ID0ge1xuXG4gICAga2V5U3RyOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nLFxuXG4gICAgZW5jb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgICAgdmFyIGNocjEsIGNocjIsIGNocjMgPSBcIlwiO1xuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGNocjEgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGNocjIgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGNocjMgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG5cbiAgICAgICAgZW5jMSA9IGNocjEgPj4gMjtcbiAgICAgICAgZW5jMiA9ICgoY2hyMSAmIDMpIDw8IDQpIHwgKGNocjIgPj4gNCk7XG4gICAgICAgIGVuYzMgPSAoKGNocjIgJiAxNSkgPDwgMikgfCAoY2hyMyA+PiA2KTtcbiAgICAgICAgZW5jNCA9IGNocjMgJiA2MztcblxuICAgICAgICBpZiAoaXNOYU4oY2hyMikpIHtcbiAgICAgICAgICBlbmMzID0gZW5jNCA9IDY0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKGNocjMpKSB7XG4gICAgICAgICAgZW5jNCA9IDY0O1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMSkgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMyKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzMpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jNCk7XG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xuICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSxcblxuICAgIGRlY29kZTogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcbiAgICAgIHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgLy8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XG4gICAgICB2YXIgYmFzZTY0dGVzdCA9IC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZztcbiAgICAgIGlmIChiYXNlNjR0ZXN0LmV4ZWMoaW5wdXQpKSB7XG4gICAgICAgIHdpbmRvdy5hbGVydChcIlRoZXJlIHdlcmUgaW52YWxpZCBiYXNlNjQgY2hhcmFjdGVycyBpbiB0aGUgaW5wdXQgdGV4dC5cXG5cIiArXG4gICAgICAgICAgICBcIlZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGFyZSBBLVosIGEteiwgMC05LCAnKycsICcvJyxhbmQgJz0nXFxuXCIgK1xuICAgICAgICAgICAgXCJFeHBlY3QgZXJyb3JzIGluIGRlY29kaW5nLlwiKTtcbiAgICAgIH1cbiAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9cXD1dL2csIFwiXCIpO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGVuYzEgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jMiA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMzID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzQgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcblxuICAgICAgICBjaHIxID0gKGVuYzEgPDwgMikgfCAoZW5jMiA+PiA0KTtcbiAgICAgICAgY2hyMiA9ICgoZW5jMiAmIDE1KSA8PCA0KSB8IChlbmMzID4+IDIpO1xuICAgICAgICBjaHIzID0gKChlbmMzICYgMykgPDwgNikgfCBlbmM0O1xuXG4gICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMSk7XG5cbiAgICAgICAgaWYgKGVuYzMgIT0gNjQpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmM0ICE9IDY0KSB7XG4gICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xuXG4gICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gIH07XG5cbn0pKCk7XG4iLCIvKipcbiAqIFRhZ3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC50YWdzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnRhZ3MuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdUYWdzQ29udHJvbGxlcicsIFRhZ3NDb250cm9sbGVyICk7XG5cbiAgICBUYWdzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICckbW9kYWwnLCAnVXNlcicsICdUYWdzJyBdO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBUYWdzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFRhZ3NDb250cm9sbGVyKCAkc2NvcGUsICRsb2NhdGlvbiwgJG1vZGFsLCBVc2VyLCBUYWdzICkge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLm5ld1RhZyA9ICcnO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckFkbWluKCkgKSB7XG5cbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyggZnVuY3Rpb24oIHRhZ3MgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS50YWdzID0gdGFncztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmFkZFRhZyA9IGZ1bmN0aW9uKCBuZXdUYWcgKXtcblxuICAgICAgICAgICAgVGFncy5jcmVhdGUoIG5ld1RhZyApLnRoZW4oIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgdmFyIG5ld1RhZyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubmV3VGFnID0gJyc7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnRhZ3MudW5zaGlmdCggbmV3VGFnICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZWRpdFRhZyA9IGZ1bmN0aW9uKCB0YWcgKXtcblxuICAgICAgICAgICAgLy8gc2hvdyBtb2RhbCB3aXRoIHRhZ1xuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdGFncy9wYXJ0aWFscy9lZGl0LXRhZy1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0VGFnc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgdGFnOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBFZGl0VGFnc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEVkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ3RhZycsICdUYWdzJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIHRhZywgVGFncykge1xuXG4gICAgICAgICRzY29wZS50YWcgPSB0YWc7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgIFRhZ3MudXBkYXRlKCAkc2NvcGUudGFnICkudGhlbihmdW5jdGlvbihuZXdUYWcpe1xuXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoIG5ld1RhZyApO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIHRhZ1wiIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNcbiAqIEBuYW1lc3BhY2UgYXBwLnRhZ3Muc2VydmljZXNcbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudGFncy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdUYWdzJywgVGFncyk7XG5cbiAgICBUYWdzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFRhZ3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBUYWdzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0IGFsbCB0YWdzXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgcG9zc2libGUgdGFnc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWxsKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHJvb3RVcmwgKyAnL2FwaS92MS90YWdzJyApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldCBhIHRhZ1xuICAgICAgICAgKiBAZGVzYyBnZXQgYSB0YWcgYnkgdGFnX2lkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoIHRhZ19pZCApe1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyB0YWdfaWQgKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVhdGUgYSB0YWcgYnkgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKCBuYW1lICkge1xuXG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycsIHtcblxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICAgKiBAZGVzYyB1cGRhdGUgYSB0YWdcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSggdGFnICkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyB0YWcuaWQsIHRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdm90ZSByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvdGFncy8nICsgaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKCk7XG5cbiIsIi8qKlxuICogQWRtaW5Wb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnQWRtaW5Wb3Rlc0NvbnRyb2xsZXInLCBBZG1pblZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgQWRtaW5Wb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQWRtaW5Wb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFueVZvdGVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudm90ZXMuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdDb21wYW55Vm90ZXNDb250cm9sbGVyJywgQ29tcGFueVZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgQ29tcGFueVZvdGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJywgJ1ZvdGVzJyBdO1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZUNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55Vm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAgIFZvdGVzLmdldCggJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXMgPSB2b3RlcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5yZW1vdmVWb3RlID0gZnVuY3Rpb24oIHZvdGUgKXtcblxuICAgICAgICAgICAgLy8gYmUgc3VyZSBpdCB3YXNuJ3QgYW4gYWNjaWRlbnRhbCBjbGlja1xuICAgICAgICAgICAgdmFyIGMgPSBjb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgeW91ciB2b3RlP1wiKTtcbiAgICAgICAgICAgIGlmKCAhYyApIHJldHVybjtcblxuICAgICAgICAgICAgVm90ZXMuZGVzdHJveSggdm90ZS5pZCApLnRoZW4oIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHZvdGUgZnJvbSAkc2NvdGUudm90ZXNcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgJHNjb3BlLnZvdGVzLmxlbmd0aDsgaSsrICl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkc2NvcGUudm90ZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGl0ZW0uaWQgPT09IHZvdGUuaWQgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnRmVsbG93Vm90ZXNDb250cm9sbGVyJywgRmVsbG93Vm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBGZWxsb3dWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93Vm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAgIFZvdGVzLmdldCggJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXMgPSB2b3RlcztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnJlbW92ZVZvdGUgPSBmdW5jdGlvbiggdm90ZSApe1xuXG4gICAgICAgICAgICAvLyBiZSBzdXJlIGl0IHdhc24ndCBhbiBhY2NpZGVudGFsIGNsaWNrXG4gICAgICAgICAgICB2YXIgYyA9IGNvbmZpcm0oIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB5b3VyIHZvdGU/XCIpO1xuICAgICAgICAgICAgaWYoICFjICkgcmV0dXJuO1xuXG4gICAgICAgICAgICBWb3Rlcy5kZXN0cm95KCB2b3RlLmlkICkudGhlbiggZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdm90ZSBmcm9tICRzY290ZS52b3Rlc1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyAkc2NvcGUudm90ZXMubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICRzY29wZS52b3Rlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiggaXRlbS5pZCA9PT0gdm90ZS5pZCApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnVm90ZXNDb250cm9sbGVyJywgVm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gVm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICAvLyByZWRpcmVjdCB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciB0eXBlXG4gICAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9hZG1pblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnRmVsbG93Jykge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3ZvdGVzL2ZlbGxvd1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9jb21wYW55XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc1xuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuc2VydmljZXNcbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMuc2VydmljZXMnKVxuICAgICAgICAuc2VydmljZSgnVm90ZXMnLCBWb3Rlcyk7XG5cbiAgICBWb3Rlcy4kaW5qZWN0ID0gWyckaHR0cCcsICdDT05GSUcnXTtcblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3Rlc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZvdGVzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXQgdm90ZXNcbiAgICAgICAgICogQGRlc2MgZ2V0IHRoZSB2b3RlcyBmb3IgYSB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoIHZvdGVyX2lkICl7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzLycgKyB2b3Rlcl9pZCApO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXG4gICAgICAgICAqIEBkZXNjIGNhc3QgYSB2b3RlIGZvciBhIHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSggdm90ZXJfaWQsIHZvdGVlX2lkICkge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB2b3Rlcl9pZCArIFwiIFwiICsgdm90ZWVfaWQgKTtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzLycsIHtcblxuICAgICAgICAgICAgICAgIHZvdGVyX2lkOiB2b3Rlcl9pZCxcbiAgICAgICAgICAgICAgICB2b3RlZV9pZDogdm90ZWVfaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAgICogQGRlc2MgZGVzdHJveSBhIHZvdGUgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzLycgKyBpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcblxuIiwiLyohIDcuMy40ICovXG4hd2luZG93LlhNTEh0dHBSZXF1ZXN0fHx3aW5kb3cuRmlsZUFQSSYmRmlsZUFQSS5zaG91bGRMb2FkfHwod2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe2lmKFwiX19zZXRYSFJfXCI9PT1iKXt2YXIgZD1jKHRoaXMpO2QgaW5zdGFuY2VvZiBGdW5jdGlvbiYmZCh0aGlzKX1lbHNlIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0od2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyKSk7dmFyIG5nRmlsZVVwbG9hZD1hbmd1bGFyLm1vZHVsZShcIm5nRmlsZVVwbG9hZFwiLFtdKTtuZ0ZpbGVVcGxvYWQudmVyc2lvbj1cIjcuMy40XCIsbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRCYXNlXCIsW1wiJGh0dHBcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGQpe2Z1bmN0aW9uIGcoYSl7ai5ub3RpZnkmJmoubm90aWZ5KGEpLGsucHJvZ3Jlc3NGdW5jJiZjKGZ1bmN0aW9uKCl7ay5wcm9ncmVzc0Z1bmMoYSl9KX1mdW5jdGlvbiBoKGEpe3JldHVybiBudWxsIT1kLl9zdGFydCYmZj97bG9hZGVkOmEubG9hZGVkK2QuX3N0YXJ0LHRvdGFsOmQuX2ZpbGUuc2l6ZSx0eXBlOmEudHlwZSxjb25maWc6ZCxsZW5ndGhDb21wdXRhYmxlOiEwLHRhcmdldDphLnRhcmdldH06YX1mdW5jdGlvbiBpKCl7YShkKS50aGVuKGZ1bmN0aW9uKGEpe2QuX2NodW5rU2l6ZSYmIWQuX2ZpbmlzaGVkPyhnKHtsb2FkZWQ6ZC5fZW5kLHRvdGFsOmQuX2ZpbGUuc2l6ZSxjb25maWc6ZCx0eXBlOlwicHJvZ3Jlc3NcIn0pLGUudXBsb2FkKGQpKTooZC5fZmluaXNoZWQmJmRlbGV0ZSBkLl9maW5pc2hlZCxqLnJlc29sdmUoYSkpfSxmdW5jdGlvbihhKXtqLnJlamVjdChhKX0sZnVuY3Rpb24oYSl7ai5ub3RpZnkoYSl9KX1kLm1ldGhvZD1kLm1ldGhvZHx8XCJQT1NUXCIsZC5oZWFkZXJzPWQuaGVhZGVyc3x8e307dmFyIGo9ZC5fZGVmZXJyZWQ9ZC5fZGVmZXJyZWR8fGIuZGVmZXIoKSxrPWoucHJvbWlzZTtyZXR1cm4gZC5oZWFkZXJzLl9fc2V0WEhSXz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhKXthJiYoZC5fX1hIUj1hLGQueGhyRm4mJmQueGhyRm4oYSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsZnVuY3Rpb24oYSl7YS5jb25maWc9ZCxnKGgoYSkpfSwhMSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbihhKXthLmxlbmd0aENvbXB1dGFibGUmJihhLmNvbmZpZz1kLGcoaChhKSkpfSwhMSkpfX0sZj9kLl9jaHVua1NpemUmJmQuX2VuZCYmIWQuX2ZpbmlzaGVkPyhkLl9zdGFydD1kLl9lbmQsZC5fZW5kKz1kLl9jaHVua1NpemUsaSgpKTpkLnJlc3VtZVNpemVVcmw/YS5nZXQoZC5yZXN1bWVTaXplVXJsKS50aGVuKGZ1bmN0aW9uKGEpe2QuX3N0YXJ0PWQucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyP2QucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyKGEuZGF0YSk6cGFyc2VJbnQoKG51bGw9PWEuZGF0YS5zaXplP2EuZGF0YTphLmRhdGEuc2l6ZSkudG9TdHJpbmcoKSksZC5fY2h1bmtTaXplJiYoZC5fZW5kPWQuX3N0YXJ0K2QuX2NodW5rU2l6ZSksaSgpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6ZC5yZXN1bWVTaXplP2QucmVzdW1lU2l6ZSgpLnRoZW4oZnVuY3Rpb24oYSl7ZC5fc3RhcnQ9YSxpKCl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTppKCk6aSgpLGsuc3VjY2Vzcz1mdW5jdGlvbihhKXtyZXR1cm4gay50aGVuKGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsuZXJyb3I9ZnVuY3Rpb24oYSl7cmV0dXJuIGsudGhlbihudWxsLGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsucHJvZ3Jlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGsucHJvZ3Jlc3NGdW5jPWEsay50aGVuKG51bGwsbnVsbCxmdW5jdGlvbihiKXthKGIpfSksa30say5hYm9ydD1rLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGQuX19YSFImJmMoZnVuY3Rpb24oKXtkLl9fWEhSLmFib3J0KCl9KSxrfSxrLnhocj1mdW5jdGlvbihhKXtyZXR1cm4gZC54aHJGbj1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXtiJiZiLmFwcGx5KGssYXJndW1lbnRzKSxhLmFwcGx5KGssYXJndW1lbnRzKX19KGQueGhyRm4pLGt9LGt9dmFyIGU9dGhpcyxmPXdpbmRvdy5CbG9iJiYobmV3IEJsb2IpLnNsaWNlO3RoaXMudXBsb2FkPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYyxkLGUpe2lmKHZvaWQgMCE9PWQpaWYoYW5ndWxhci5pc0RhdGUoZCkmJihkPWQudG9JU09TdHJpbmcoKSksYW5ndWxhci5pc1N0cmluZyhkKSljLmFwcGVuZChlLGQpO2Vsc2UgaWYoXCJmb3JtXCI9PT1hLnNlbmRGaWVsZHNBcylpZihhbmd1bGFyLmlzT2JqZWN0KGQpKWZvcih2YXIgZiBpbiBkKWQuaGFzT3duUHJvcGVydHkoZikmJmIoYyxkW2ZdLGUrXCJbXCIrZitcIl1cIik7ZWxzZSBjLmFwcGVuZChlLGQpO2Vsc2UgZD1hbmd1bGFyLmlzU3RyaW5nKGQpP2Q6YW5ndWxhci50b0pzb24oZCksXCJqc29uLWJsb2JcIj09PWEuc2VuZEZpZWxkc0FzP2MuYXBwZW5kKGUsbmV3IEJsb2IoW2RdLHt0eXBlOlwiYXBwbGljYXRpb24vanNvblwifSkpOmMuYXBwZW5kKGUsZCl9ZnVuY3Rpb24gYyhhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIEJsb2J8fGEuZmxhc2hJZCYmYS5uYW1lJiZhLnNpemV9ZnVuY3Rpb24gZyhiLGQsZSl7aWYoYyhkKSl7aWYoYS5fZmlsZT1hLl9maWxlfHxkLG51bGwhPWEuX3N0YXJ0JiZmKXthLl9lbmQmJmEuX2VuZD49ZC5zaXplJiYoYS5fZmluaXNoZWQ9ITAsYS5fZW5kPWQuc2l6ZSk7dmFyIGg9ZC5zbGljZShhLl9zdGFydCxhLl9lbmR8fGQuc2l6ZSk7aC5uYW1lPWQubmFtZSxkPWgsYS5fY2h1bmtTaXplJiYoYi5hcHBlbmQoXCJjaHVua1NpemVcIixhLl9lbmQtYS5fc3RhcnQpLGIuYXBwZW5kKFwiY2h1bmtOdW1iZXJcIixNYXRoLmZsb29yKGEuX3N0YXJ0L2EuX2NodW5rU2l6ZSkpLGIuYXBwZW5kKFwidG90YWxTaXplXCIsYS5fZmlsZS5zaXplKSl9Yi5hcHBlbmQoZSxkLGQuZmlsZU5hbWV8fGQubmFtZSl9ZWxzZXtpZighYW5ndWxhci5pc09iamVjdChkKSl0aHJvd1wiRXhwZWN0ZWQgZmlsZSBvYmplY3QgaW4gVXBsb2FkLnVwbG9hZCBmaWxlIG9wdGlvbjogXCIrZC50b1N0cmluZygpO2Zvcih2YXIgaSBpbiBkKWlmKGQuaGFzT3duUHJvcGVydHkoaSkpe3ZhciBqPWkuc3BsaXQoXCIsXCIpO2pbMV0mJihkW2ldLmZpbGVOYW1lPWpbMV0ucmVwbGFjZSgvXlxccyt8XFxzKyQvZyxcIlwiKSksZyhiLGRbaV0salswXSl9fX1yZXR1cm4gYS5fY2h1bmtTaXplPWUudHJhbnNsYXRlU2NhbGFycyhhLnJlc3VtZUNodW5rU2l6ZSksYS5fY2h1bmtTaXplPWEuX2NodW5rU2l6ZT9wYXJzZUludChhLl9jaHVua1NpemUudG9TdHJpbmcoKSk6bnVsbCxhLmhlYWRlcnM9YS5oZWFkZXJzfHx7fSxhLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl09dm9pZCAwLGEudHJhbnNmb3JtUmVxdWVzdD1hLnRyYW5zZm9ybVJlcXVlc3Q/YW5ndWxhci5pc0FycmF5KGEudHJhbnNmb3JtUmVxdWVzdCk/YS50cmFuc2Zvcm1SZXF1ZXN0OlthLnRyYW5zZm9ybVJlcXVlc3RdOltdLGEudHJhbnNmb3JtUmVxdWVzdC5wdXNoKGZ1bmN0aW9uKGMpe3ZhciBkLGU9bmV3IEZvcm1EYXRhLGY9e307Zm9yKGQgaW4gYS5maWVsZHMpYS5maWVsZHMuaGFzT3duUHJvcGVydHkoZCkmJihmW2RdPWEuZmllbGRzW2RdKTtjJiYoZi5kYXRhPWMpO2ZvcihkIGluIGYpaWYoZi5oYXNPd25Qcm9wZXJ0eShkKSl7dmFyIGg9ZltkXTthLmZvcm1EYXRhQXBwZW5kZXI/YS5mb3JtRGF0YUFwcGVuZGVyKGUsZCxoKTpiKGUsaCxkKX1pZihudWxsIT1hLmZpbGUpaWYoYW5ndWxhci5pc0FycmF5KGEuZmlsZSkpZm9yKHZhciBpPTA7aTxhLmZpbGUubGVuZ3RoO2krKylnKGUsYS5maWxlW2ldLFwiZmlsZVwiKTtlbHNlIGcoZSxhLmZpbGUsXCJmaWxlXCIpO3JldHVybiBlfSksZChhKX0sdGhpcy5odHRwPWZ1bmN0aW9uKGIpe3JldHVybiBiLnRyYW5zZm9ybVJlcXVlc3Q9Yi50cmFuc2Zvcm1SZXF1ZXN0fHxmdW5jdGlvbihiKXtyZXR1cm4gd2luZG93LkFycmF5QnVmZmVyJiZiIGluc3RhbmNlb2Ygd2luZG93LkFycmF5QnVmZmVyfHxiIGluc3RhbmNlb2YgQmxvYj9iOmEuZGVmYXVsdHMudHJhbnNmb3JtUmVxdWVzdFswXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGIuX2NodW5rU2l6ZT1lLnRyYW5zbGF0ZVNjYWxhcnMoYi5yZXN1bWVDaHVua1NpemUpLGIuX2NodW5rU2l6ZT1iLl9jaHVua1NpemU/cGFyc2VJbnQoYi5fY2h1bmtTaXplLnRvU3RyaW5nKCkpOm51bGwsZChiKX0sdGhpcy50cmFuc2xhdGVTY2FsYXJzPWZ1bmN0aW9uKGEpe2lmKGFuZ3VsYXIuaXNTdHJpbmcoYSkpe2lmKGEuc2VhcmNoKC9rYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWUzKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9tYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWU2KmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9nYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWU5KmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9iL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvcy9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL20vaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDYwKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9oL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdCgzNjAwKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpfXJldHVybiBhfSx0aGlzLnNldERlZmF1bHRzPWZ1bmN0aW9uKGEpe3RoaXMuZGVmYXVsdHM9YXx8e319LHRoaXMuZGVmYXVsdHM9e30sdGhpcy52ZXJzaW9uPW5nRmlsZVVwbG9hZC52ZXJzaW9ufV0pLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGNvbXBpbGVcIixcIlVwbG9hZFJlc2l6ZVwiLGZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWQ7cmV0dXJuIGUuZ2V0QXR0cldpdGhEZWZhdWx0cz1mdW5jdGlvbihhLGIpe3JldHVybiBudWxsIT1hW2JdP2FbYl06bnVsbD09ZS5kZWZhdWx0c1tiXT9lLmRlZmF1bHRzW2JdOmUuZGVmYXVsdHNbYl0udG9TdHJpbmcoKX0sZS5hdHRyR2V0dGVyPWZ1bmN0aW9uKGIsYyxkLGUpe2lmKCFkKXJldHVybiB0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKTt0cnl7cmV0dXJuIGU/YSh0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKSkoZCxlKTphKHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpKShkKX1jYXRjaChmKXtpZihiLnNlYXJjaCgvbWlufG1heHxwYXR0ZXJuL2kpKXJldHVybiB0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKTt0aHJvdyBmfX0sZS51cGRhdGVNb2RlbD1mdW5jdGlvbihjLGQsZixnLGgsaSxqKXtmdW5jdGlvbiBrKCl7dmFyIGo9aCYmaC5sZW5ndGg/aFswXTpudWxsO2lmKGMpe3ZhciBrPSFlLmF0dHJHZXR0ZXIoXCJuZ2ZNdWx0aXBsZVwiLGQsZikmJiFlLmF0dHJHZXR0ZXIoXCJtdWx0aXBsZVwiLGQpJiYhbzthKGUuYXR0ckdldHRlcihcIm5nTW9kZWxcIixkKSkuYXNzaWduKGYsaz9qOmgpfXZhciBsPWUuYXR0ckdldHRlcihcIm5nZk1vZGVsXCIsZCk7bCYmYShsKS5hc3NpZ24oZixoKSxnJiZhKGcpKGYseyRmaWxlczpoLCRmaWxlOmosJG5ld0ZpbGVzOm0sJGR1cGxpY2F0ZUZpbGVzOm4sJGV2ZW50Oml9KSxiKGZ1bmN0aW9uKCl7fSl9ZnVuY3Rpb24gbChhLGIpe3ZhciBjPWUuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGQsZik7aWYoIWN8fCFlLmlzUmVzaXplU3VwcG9ydGVkKCkpcmV0dXJuIGIoKTtmb3IodmFyIGc9YS5sZW5ndGgsaD1mdW5jdGlvbigpe2ctLSwwPT09ZyYmYigpfSxpPWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbihjKXthLnNwbGljZShiLDEsYyksaCgpfX0saj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7aCgpLGEuJGVycm9yPVwicmVzaXplXCIsYS4kZXJyb3JQYXJhbT0oYj8oYi5tZXNzYWdlP2IubWVzc2FnZTpiKStcIjogXCI6XCJcIikrKGEmJmEubmFtZSl9fSxrPTA7azxhLmxlbmd0aDtrKyspe3ZhciBsPWFba107bC4kZXJyb3J8fDAhPT1sLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP2goKTplLnJlc2l6ZShsLGMud2lkdGgsYy5oZWlnaHQsYy5xdWFsaXR5KS50aGVuKGkoayksaihsKSl9fXZhciBtPWgsbj1bXSxvPWUuYXR0ckdldHRlcihcIm5nZktlZXBcIixkLGYpO2lmKG89PT0hMCl7aWYoIWh8fCFoLmxlbmd0aClyZXR1cm47dmFyIHA9KGMmJmMuJG1vZGVsVmFsdWV8fGQuJCRuZ2ZQcmV2RmlsZXN8fFtdKS5zbGljZSgwKSxxPSExO2lmKGUuYXR0ckdldHRlcihcIm5nZktlZXBEaXN0aW5jdFwiLGQsZik9PT0hMCl7Zm9yKHZhciByPXAubGVuZ3RoLHM9MDtzPGgubGVuZ3RoO3MrKyl7Zm9yKHZhciB0PTA7cj50O3QrKylpZihoW3NdLm5hbWU9PT1wW3RdLm5hbWUpe24ucHVzaChoW3NdKTticmVha310PT09ciYmKHAucHVzaChoW3NdKSxxPSEwKX1pZighcSlyZXR1cm47aD1wfWVsc2UgaD1wLmNvbmNhdChoKX1kLiQkbmdmUHJldkZpbGVzPWgsaj9rKCk6ZS52YWxpZGF0ZShoLGMsZCxmLGUuYXR0ckdldHRlcihcIm5nZlZhbGlkYXRlTGF0ZXJcIixkKSxmdW5jdGlvbigpe2woaCxmdW5jdGlvbigpe2IoZnVuY3Rpb24oKXtrKCl9KX0pfSl9LGV9XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlNlbGVjdFwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIiRjb21waWxlXCIsXCJVcGxvYWRcIixmdW5jdGlvbihhLGIsYyxkKXtmdW5jdGlvbiBlKGEpe3ZhciBiPWEubWF0Y2goL0FuZHJvaWRbXlxcZF0qKFxcZCspXFwuKFxcZCspLyk7aWYoYiYmYi5sZW5ndGg+Mil7dmFyIGM9ZC5kZWZhdWx0cy5hbmRyb2lkRml4TWlub3JWZXJzaW9ufHw0O3JldHVybiBwYXJzZUludChiWzFdKTw0fHxwYXJzZUludChiWzFdKT09PWMmJnBhcnNlSW50KGJbMl0pPGN9cmV0dXJuLTE9PT1hLmluZGV4T2YoXCJDaHJvbWVcIikmJi8uKldpbmRvd3MuKlNhZmFyaS4qLy50ZXN0KGEpfWZ1bmN0aW9uIGYoYSxiLGMsZCxmLGgsaSxqKXtmdW5jdGlvbiBrKCl7cmV0dXJuXCJpbnB1dFwiPT09YlswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCkmJmMudHlwZSYmXCJmaWxlXCI9PT1jLnR5cGUudG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBsKCl7cmV0dXJuIHQoXCJuZ2ZDaGFuZ2VcIil8fHQoXCJuZ2ZTZWxlY3RcIil9ZnVuY3Rpb24gbShiKXtmb3IodmFyIGU9Yi5fX2ZpbGVzX3x8Yi50YXJnZXQmJmIudGFyZ2V0LmZpbGVzLGY9W10sZz0wO2c8ZS5sZW5ndGg7ZysrKWYucHVzaChlW2ddKTtqLnVwZGF0ZU1vZGVsKGQsYyxhLGwoKSxmLmxlbmd0aD9mOm51bGwsYil9ZnVuY3Rpb24gbihhKXtpZihiIT09YSlmb3IodmFyIGM9MDtjPGJbMF0uYXR0cmlidXRlcy5sZW5ndGg7YysrKXt2YXIgZD1iWzBdLmF0dHJpYnV0ZXNbY107XCJ0eXBlXCIhPT1kLm5hbWUmJlwiY2xhc3NcIiE9PWQubmFtZSYmXCJpZFwiIT09ZC5uYW1lJiZcInN0eWxlXCIhPT1kLm5hbWUmJigobnVsbD09ZC52YWx1ZXx8XCJcIj09PWQudmFsdWUpJiYoXCJyZXF1aXJlZFwiPT09ZC5uYW1lJiYoZC52YWx1ZT1cInJlcXVpcmVkXCIpLFwibXVsdGlwbGVcIj09PWQubmFtZSYmKGQudmFsdWU9XCJtdWx0aXBsZVwiKSksYS5hdHRyKGQubmFtZSxkLnZhbHVlKSl9fWZ1bmN0aW9uIG8oKXtpZihrKCkpcmV0dXJuIGI7dmFyIGE9YW5ndWxhci5lbGVtZW50KCc8aW5wdXQgdHlwZT1cImZpbGVcIj4nKTtyZXR1cm4gbihhKSxhLmNzcyhcInZpc2liaWxpdHlcIixcImhpZGRlblwiKS5jc3MoXCJwb3NpdGlvblwiLFwiYWJzb2x1dGVcIikuY3NzKFwib3ZlcmZsb3dcIixcImhpZGRlblwiKS5jc3MoXCJ3aWR0aFwiLFwiMHB4XCIpLmNzcyhcImhlaWdodFwiLFwiMHB4XCIpLmNzcyhcImJvcmRlclwiLFwibm9uZVwiKS5jc3MoXCJtYXJnaW5cIixcIjBweFwiKS5jc3MoXCJwYWRkaW5nXCIsXCIwcHhcIikuYXR0cihcInRhYmluZGV4XCIsXCItMVwiKSxnLnB1c2goe2VsOmIscmVmOmF9KSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFbMF0pLGF9ZnVuY3Rpb24gcChjKXtpZihiLmF0dHIoXCJkaXNhYmxlZFwiKXx8dChcIm5nZlNlbGVjdERpc2FibGVkXCIsYSkpcmV0dXJuITE7dmFyIGQ9cShjKTtyZXR1cm4gbnVsbCE9ZD9kOihyKGMpLGUobmF2aWdhdG9yLnVzZXJBZ2VudCk/c2V0VGltZW91dChmdW5jdGlvbigpe3dbMF0uY2xpY2soKX0sMCk6d1swXS5jbGljaygpLCExKX1mdW5jdGlvbiBxKGEpe3ZhciBiPWEuY2hhbmdlZFRvdWNoZXN8fGEub3JpZ2luYWxFdmVudCYmYS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzO2lmKFwidG91Y2hzdGFydFwiPT09YS50eXBlKXJldHVybiB2PWI/YlswXS5jbGllbnRZOjAsITA7aWYoYS5zdG9wUHJvcGFnYXRpb24oKSxhLnByZXZlbnREZWZhdWx0KCksXCJ0b3VjaGVuZFwiPT09YS50eXBlKXt2YXIgYz1iP2JbMF0uY2xpZW50WTowO2lmKE1hdGguYWJzKGMtdik+MjApcmV0dXJuITF9fWZ1bmN0aW9uIHIoYil7dy52YWwoKSYmKHcudmFsKG51bGwpLGoudXBkYXRlTW9kZWwoZCxjLGEsbCgpLG51bGwsYiwhMCkpfWZ1bmN0aW9uIHMoYSl7aWYodyYmIXcuYXR0cihcIl9fbmdmX2llMTBfRml4X1wiKSl7aWYoIXdbMF0ucGFyZW50Tm9kZSlyZXR1cm4gdm9pZCh3PW51bGwpO2EucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpLHcudW5iaW5kKFwiY2xpY2tcIik7dmFyIGI9dy5jbG9uZSgpO3JldHVybiB3LnJlcGxhY2VXaXRoKGIpLHc9Yix3LmF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIixcInRydWVcIiksdy5iaW5kKFwiY2hhbmdlXCIsbSksdy5iaW5kKFwiY2xpY2tcIixzKSx3WzBdLmNsaWNrKCksITF9dy5yZW1vdmVBdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIpfXZhciB0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGouYXR0ckdldHRlcihhLGMsYil9LHU9W107dS5wdXNoKGEuJHdhdGNoKHQoXCJuZ2ZNdWx0aXBsZVwiKSxmdW5jdGlvbigpe3cuYXR0cihcIm11bHRpcGxlXCIsdChcIm5nZk11bHRpcGxlXCIsYSkpfSkpLHUucHVzaChhLiR3YXRjaCh0KFwibmdmQ2FwdHVyZVwiKSxmdW5jdGlvbigpe3cuYXR0cihcImNhcHR1cmVcIix0KFwibmdmQ2FwdHVyZVwiLGEpKX0pKSxjLiRvYnNlcnZlKFwiYWNjZXB0XCIsZnVuY3Rpb24oKXt3LmF0dHIoXCJhY2NlcHRcIix0KFwiYWNjZXB0XCIpKX0pLHUucHVzaChmdW5jdGlvbigpe2MuJCRvYnNlcnZlcnMmJmRlbGV0ZSBjLiQkb2JzZXJ2ZXJzLmFjY2VwdH0pO3ZhciB2PTAsdz1iO2soKXx8KHc9bygpKSx3LmJpbmQoXCJjaGFuZ2VcIixtKSxrKCk/Yi5iaW5kKFwiY2xpY2tcIixyKTpiLmJpbmQoXCJjbGljayB0b3VjaHN0YXJ0IHRvdWNoZW5kXCIscCksai5yZWdpc3RlclZhbGlkYXRvcnMoZCx3LGMsYSksLTEhPT1uYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSAxMFwiKSYmdy5iaW5kKFwiY2xpY2tcIixzKSxhLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtrKCl8fHcucmVtb3ZlKCksYW5ndWxhci5mb3JFYWNoKHUsZnVuY3Rpb24oYSl7YSgpfSl9KSxoKGZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTxnLmxlbmd0aDthKyspe3ZhciBiPWdbYV07ZG9jdW1lbnQuYm9keS5jb250YWlucyhiLmVsWzBdKXx8KGcuc3BsaWNlKGEsMSksYi5yZWYucmVtb3ZlKCkpfX0pLHdpbmRvdy5GaWxlQVBJJiZ3aW5kb3cuRmlsZUFQSS5uZ2ZGaXhJRSYmd2luZG93LkZpbGVBUEkubmdmRml4SUUoYix3LG0pfXZhciBnPVtdO3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZSxnLGgsaSl7ZihlLGcsaCxpLGEsYixjLGQpfX19XSksZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVyblwiaW1nXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cImltYWdlXCI6XCJhdWRpb1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJhdWRpb1wiOlwidmlkZW9cIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1widmlkZW9cIjovLi99ZnVuY3Rpb24gYihiLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooYSl7dmFyIGc9Yi5hdHRyR2V0dGVyKFwibmdmTm9PYmplY3RVcmxcIixmLGQpO2IuZGF0YVVybChhLGcpW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2MoZnVuY3Rpb24oKXt2YXIgYj0oZz9hLmRhdGFVcmw6YS5ibG9iVXJsKXx8YS5kYXRhVXJsO2k/ZS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJ1cmwoJ1wiKyhifHxcIlwiKStcIicpXCIpOmUuYXR0cihcInNyY1wiLGIpLGI/ZS5yZW1vdmVDbGFzcyhcIm5nZi1oaWRlXCIpOmUuYWRkQ2xhc3MoXCJuZ2YtaGlkZVwiKX0pfSl9YyhmdW5jdGlvbigpe3ZhciBjPWQuJHdhdGNoKGZbZ10sZnVuY3Rpb24oYyl7dmFyIGQ9aDtyZXR1cm5cIm5nZlRodW1ibmFpbFwiIT09Z3x8ZHx8KGQ9e3dpZHRoOmVbMF0uY2xpZW50V2lkdGgsaGVpZ2h0OmVbMF0uY2xpZW50SGVpZ2h0fSksYW5ndWxhci5pc1N0cmluZyhjKT8oZS5yZW1vdmVDbGFzcyhcIm5nZi1oaWRlXCIpLGk/ZS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJ1cmwoJ1wiK2MrXCInKVwiKTplLmF0dHIoXCJzcmNcIixjKSk6dm9pZCghY3x8IWMudHlwZXx8MCE9PWMudHlwZS5zZWFyY2goYShlWzBdKSl8fGkmJjAhPT1jLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP2UuYWRkQ2xhc3MoXCJuZ2YtaGlkZVwiKTpkJiZiLmlzUmVzaXplU3VwcG9ydGVkKCk/Yi5yZXNpemUoYyxkLndpZHRoLGQuaGVpZ2h0LGQucXVhbGl0eSkudGhlbihmdW5jdGlvbihhKXtqKGEpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6aihjKSl9KTtkLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtjKCl9KX0pfW5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkRGF0YVVybFwiLFtcIlVwbG9hZEJhc2VcIixcIiR0aW1lb3V0XCIsXCIkcVwiLGZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hO3JldHVybiBkLmRhdGFVcmw9ZnVuY3Rpb24oYSxkKXtpZihkJiZudWxsIT1hLmRhdGFVcmx8fCFkJiZudWxsIT1hLmJsb2JVcmwpe3ZhciBlPWMuZGVmZXIoKTtyZXR1cm4gYihmdW5jdGlvbigpe2UucmVzb2x2ZShkP2EuZGF0YVVybDphLmJsb2JVcmwpfSksZS5wcm9taXNlfXZhciBmPWQ/YS4kbmdmRGF0YVVybFByb21pc2U6YS4kbmdmQmxvYlVybFByb21pc2U7aWYoZilyZXR1cm4gZjt2YXIgZz1jLmRlZmVyKCk7cmV0dXJuIGIoZnVuY3Rpb24oKXtpZih3aW5kb3cuRmlsZVJlYWRlciYmYSYmKCF3aW5kb3cuRmlsZUFQSXx8LTE9PT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDhcIil8fGEuc2l6ZTwyZTQpJiYoIXdpbmRvdy5GaWxlQVBJfHwtMT09PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOVwiKXx8YS5zaXplPDRlNikpe3ZhciBjPXdpbmRvdy5VUkx8fHdpbmRvdy53ZWJraXRVUkw7aWYoYyYmYy5jcmVhdGVPYmplY3RVUkwmJiFkKXt2YXIgZTt0cnl7ZT1jLmNyZWF0ZU9iamVjdFVSTChhKX1jYXRjaChmKXtyZXR1cm4gdm9pZCBiKGZ1bmN0aW9uKCl7YS5ibG9iVXJsPVwiXCIsZy5yZWplY3QoKX0pfWIoZnVuY3Rpb24oKXthLmJsb2JVcmw9ZSxlJiZnLnJlc29sdmUoZSl9KX1lbHNle3ZhciBoPW5ldyBGaWxlUmVhZGVyO2gub25sb2FkPWZ1bmN0aW9uKGMpe2IoZnVuY3Rpb24oKXthLmRhdGFVcmw9Yy50YXJnZXQucmVzdWx0LGcucmVzb2x2ZShjLnRhcmdldC5yZXN1bHQpfSl9LGgub25lcnJvcj1mdW5jdGlvbigpe2IoZnVuY3Rpb24oKXthLmRhdGFVcmw9XCJcIixnLnJlamVjdCgpfSl9LGgucmVhZEFzRGF0YVVSTChhKX19ZWxzZSBiKGZ1bmN0aW9uKCl7YVtkP1wiZGF0YVVybFwiOlwiYmxvYlVybFwiXT1cIlwiLGcucmVqZWN0KCl9KX0pLGY9ZD9hLiRuZ2ZEYXRhVXJsUHJvbWlzZT1nLnByb21pc2U6YS4kbmdmQmxvYlVybFByb21pc2U9Zy5wcm9taXNlLGZbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ZGVsZXRlIGFbZD9cIiRuZ2ZEYXRhVXJsUHJvbWlzZVwiOlwiJG5nZkJsb2JVcmxQcm9taXNlXCJdfSksZn0sZH1dKTt2YXIgYz1hbmd1bGFyLmVsZW1lbnQoXCI8c3R5bGU+Lm5nZi1oaWRle2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50fTwvc3R5bGU+XCIpO2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChjWzBdKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmU3JjXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXtiKGEsYyxkLGUsZixcIm5nZlNyY1wiLGEuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGYsZCksITEpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkJhY2tncm91bmRcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe2IoYSxjLGQsZSxmLFwibmdmQmFja2dyb3VuZFwiLGEuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGYsZCksITApfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlRodW1ibmFpbFwiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7dmFyIGc9YS5hdHRyR2V0dGVyKFwibmdmU2l6ZVwiLGYsZCk7YihhLGMsZCxlLGYsXCJuZ2ZUaHVtYm5haWxcIixnLGEuYXR0ckdldHRlcihcIm5nZkFzQmFja2dyb3VuZFwiLGYsZCkpfX19XSl9KCksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRWYWxpZGF0ZVwiLFtcIlVwbG9hZERhdGFVcmxcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGEpe2lmKGEubGVuZ3RoPjImJlwiL1wiPT09YVswXSYmXCIvXCI9PT1hW2EubGVuZ3RoLTFdKXJldHVybiBhLnN1YnN0cmluZygxLGEubGVuZ3RoLTEpO3ZhciBiPWEuc3BsaXQoXCIsXCIpLGM9XCJcIjtpZihiLmxlbmd0aD4xKWZvcih2YXIgZT0wO2U8Yi5sZW5ndGg7ZSsrKWMrPVwiKFwiK2QoYltlXSkrXCIpXCIsZTxiLmxlbmd0aC0xJiYoYys9XCJ8XCIpO2Vsc2UgMD09PWEuaW5kZXhPZihcIi5cIikmJihhPVwiKlwiK2EpLGM9XCJeXCIrYS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbLlxcXFxcXFxcKyo/XFxcXFtcXFxcXlxcXFxdJCgpe309ITw+fDpcXFxcLV1cIixcImdcIiksXCJcXFxcJCZcIikrXCIkXCIsYz1jLnJlcGxhY2UoL1xcXFxcXCovZyxcIi4qXCIpLnJlcGxhY2UoL1xcXFxcXD8vZyxcIi5cIik7cmV0dXJuIGN9dmFyIGU9YTtyZXR1cm4gZS5yZWdpc3RlclZhbGlkYXRvcnM9ZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZihhKXthbmd1bGFyLmZvckVhY2goYS4kbmdmVmFsaWRhdGlvbnMsZnVuY3Rpb24oYil7YS4kc2V0VmFsaWRpdHkoYi5uYW1lLGIudmFsaWQpfSl9YSYmKGEuJG5nZlZhbGlkYXRpb25zPVtdLGEuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihnKXtyZXR1cm4gZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGMsZCl8fCFhLiQkbmdmVmFsaWRhdGVkPyhlLnZhbGlkYXRlKGcsYSxjLGQsITEsZnVuY3Rpb24oKXtmKGEpLGEuJCRuZ2ZWYWxpZGF0ZWQ9ITF9KSxnJiYwPT09Zy5sZW5ndGgmJihnPW51bGwpLCFifHxudWxsIT1nJiYwIT09Zy5sZW5ndGh8fGIudmFsKCkmJmIudmFsKG51bGwpKTooZihhKSxhLiQkbmdmVmFsaWRhdGVkPSExKSxnfSkpfSxlLnZhbGlkYXRlUGF0dGVybj1mdW5jdGlvbihhLGIpe2lmKCFiKXJldHVybiEwO3ZhciBjPW5ldyBSZWdFeHAoZChiKSxcImdpXCIpO3JldHVybiBudWxsIT1hLnR5cGUmJmMudGVzdChhLnR5cGUudG9Mb3dlckNhc2UoKSl8fG51bGwhPWEubmFtZSYmYy50ZXN0KGEubmFtZS50b0xvd2VyQ2FzZSgpKX0sZS52YWxpZGF0ZT1mdW5jdGlvbihhLGIsYyxkLGYsZyl7ZnVuY3Rpb24gaChjLGQsZSl7aWYoYSl7Zm9yKHZhciBmPVwibmdmXCIrY1swXS50b1VwcGVyQ2FzZSgpK2Muc3Vic3RyKDEpLGc9YS5sZW5ndGgsaD1udWxsO2ctLTspe3ZhciBpPWFbZ10saz1qKGYseyRmaWxlOml9KTtudWxsPT1rJiYoaz1kKGooXCJuZ2ZWYWxpZGF0ZVwiKXx8e30pLGg9bnVsbD09aD8hMDpoKSxudWxsIT1rJiYoZShpLGspfHwoaS4kZXJyb3I9YyxpLiRlcnJvclBhcmFtPWssYS5zcGxpY2UoZywxKSxoPSExKSl9bnVsbCE9PWgmJmIuJG5nZlZhbGlkYXRpb25zLnB1c2goe25hbWU6Yyx2YWxpZDpofSl9fWZ1bmN0aW9uIGkoYyxkLGUsZixoKXtpZihhKXt2YXIgaT0wLGw9ITEsbT1cIm5nZlwiK2NbMF0udG9VcHBlckNhc2UoKStjLnN1YnN0cigxKTthPXZvaWQgMD09PWEubGVuZ3RoP1thXTphLGFuZ3VsYXIuZm9yRWFjaChhLGZ1bmN0aW9uKGEpe2lmKDAhPT1hLnR5cGUuc2VhcmNoKGUpKXJldHVybiEwO3ZhciBuPWoobSx7JGZpbGU6YX0pfHxkKGooXCJuZ2ZWYWxpZGF0ZVwiLHskZmlsZTphfSl8fHt9KTtuJiYoaysrLGkrKyxmKGEsbikudGhlbihmdW5jdGlvbihiKXtoKGIsbil8fChhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0sZnVuY3Rpb24oKXtqKFwibmdmVmFsaWRhdGVGb3JjZVwiLHskZmlsZTphfSkmJihhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0pW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2stLSxpLS0saXx8Yi4kbmdmVmFsaWRhdGlvbnMucHVzaCh7bmFtZTpjLHZhbGlkOiFsfSksa3x8Zy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpfSkpfSl9fWI9Ynx8e30sYi4kbmdmVmFsaWRhdGlvbnM9Yi4kbmdmVmFsaWRhdGlvbnN8fFtdLGFuZ3VsYXIuZm9yRWFjaChiLiRuZ2ZWYWxpZGF0aW9ucyxmdW5jdGlvbihhKXthLnZhbGlkPSEwfSk7dmFyIGo9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZS5hdHRyR2V0dGVyKGEsYyxkLGIpfTtpZihmKXJldHVybiB2b2lkIGcuY2FsbChiKTtpZihiLiQkbmdmVmFsaWRhdGVkPSEwLG51bGw9PWF8fDA9PT1hLmxlbmd0aClyZXR1cm4gdm9pZCBnLmNhbGwoYik7aWYoYT12b2lkIDA9PT1hLmxlbmd0aD9bYV06YS5zbGljZSgwKSxoKFwicGF0dGVyblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnBhdHRlcm59LGUudmFsaWRhdGVQYXR0ZXJuKSxoKFwibWluU2l6ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnNpemUmJmEuc2l6ZS5taW59LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2l6ZT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaChcIm1heFNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWF4fSxmdW5jdGlvbihhLGIpe3JldHVybiBhLnNpemU8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGgoXCJ2YWxpZGF0ZUZuXCIsZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj09PSEwfHxudWxsPT09Ynx8XCJcIj09PWJ9KSwhYS5sZW5ndGgpcmV0dXJuIHZvaWQgZy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpO3ZhciBrPTA7aShcIm1heEhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0PD1ifSksaShcIm1pbkhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0Pj1ifSksaShcIm1heFdpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg8PWJ9KSxpKFwibWluV2lkdGhcIixmdW5jdGlvbihhKXtyZXR1cm4gYS53aWR0aCYmYS53aWR0aC5taW59LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS53aWR0aD49Yn0pLGkoXCJyYXRpb1wiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnJhdGlvfSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWIudG9TdHJpbmcoKS5zcGxpdChcIixcIiksZD0hMSxlPTA7ZTxjLmxlbmd0aDtlKyspe3ZhciBmPWNbZV0sZz1mLnNlYXJjaCgveC9pKTtmPWc+LTE/cGFyc2VGbG9hdChmLnN1YnN0cmluZygwLGcpKS9wYXJzZUZsb2F0KGYuc3Vic3RyaW5nKGcrMSkpOnBhcnNlRmxvYXQoZiksTWF0aC5hYnMoYS53aWR0aC9hLmhlaWdodC1mKTwxZS00JiYoZD0hMCl9cmV0dXJuIGR9KSxpKFwibWF4RHVyYXRpb25cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5kdXJhdGlvbiYmYS5kdXJhdGlvbi5tYXh9LC9hdWRpb3x2aWRlby8sdGhpcy5tZWRpYUR1cmF0aW9uLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGkoXCJtaW5EdXJhdGlvblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmR1cmF0aW9uJiZhLmR1cmF0aW9uLm1pbn0sL2F1ZGlvfHZpZGVvLyx0aGlzLm1lZGlhRHVyYXRpb24sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaShcInZhbGlkYXRlQXN5bmNGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LC8uLyxmdW5jdGlvbihhLGIpe3JldHVybiBifSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PSEwfHxudWxsPT09YXx8XCJcIj09PWF9KSxrfHxnLmNhbGwoYixiLiRuZ2ZWYWxpZGF0aW9ucyl9LGUuaW1hZ2VEaW1lbnNpb25zPWZ1bmN0aW9uKGEpe2lmKGEud2lkdGgmJmEuaGVpZ2h0KXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoe3dpZHRoOmEud2lkdGgsaGVpZ2h0OmEuaGVpZ2h0fSl9KSxkLnByb21pc2V9aWYoYS4kbmdmRGltZW5zaW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRGltZW5zaW9uUHJvbWlzZTt2YXIgZj1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/dm9pZCBmLnJlamVjdChcIm5vdCBpbWFnZVwiKTp2b2lkIGUuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmNsaWVudFdpZHRoLGM9aFswXS5jbGllbnRIZWlnaHQ7aC5yZW1vdmUoKSxhLndpZHRoPWIsYS5oZWlnaHQ9YyxmLnJlc29sdmUoe3dpZHRoOmIsaGVpZ2h0OmN9KX1mdW5jdGlvbiBlKCl7aC5yZW1vdmUoKSxmLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2MoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmNsaWVudFdpZHRoP2QoKTppPjEwP2UoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudChcIjxpbWc+XCIpLmF0dHIoXCJzcmNcIixiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSkuYXBwZW5kKGgpfSxmdW5jdGlvbigpe2YucmVqZWN0KFwibG9hZCBlcnJvclwiKX0pfSksYS4kbmdmRGltZW5zaW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRGltZW5zaW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRGltZW5zaW9uUHJvbWlzZX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2V9LGUubWVkaWFEdXJhdGlvbj1mdW5jdGlvbihhKXtpZihhLmR1cmF0aW9uKXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoYS5kdXJhdGlvbil9KSxkLnByb21pc2V9aWYoYS4kbmdmRHVyYXRpb25Qcm9taXNlKXJldHVybiBhLiRuZ2ZEdXJhdGlvblByb21pc2U7dmFyIGY9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpJiYwIT09YS50eXBlLmluZGV4T2YoXCJ2aWRlb1wiKT92b2lkIGYucmVqZWN0KFwibm90IG1lZGlhXCIpOnZvaWQgZS5kYXRhVXJsKGEpLnRoZW4oZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe3ZhciBiPWhbMF0uZHVyYXRpb247YS5kdXJhdGlvbj1iLGgucmVtb3ZlKCksZi5yZXNvbHZlKGIpfWZ1bmN0aW9uIGUoKXtoLnJlbW92ZSgpLGYucmVqZWN0KFwibG9hZCBlcnJvclwiKX1mdW5jdGlvbiBnKCl7YyhmdW5jdGlvbigpe2hbMF0ucGFyZW50Tm9kZSYmKGhbMF0uZHVyYXRpb24/ZCgpOmk+MTA/ZSgpOmcoKSl9LDFlMyl9dmFyIGg9YW5ndWxhci5lbGVtZW50KDA9PT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpP1wiPGF1ZGlvPlwiOlwiPHZpZGVvPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwibm9uZVwiKS5jc3MoXCJwb3NpdGlvblwiLFwiZml4ZWRcIik7aC5vbihcImxvYWRlZG1ldGFkYXRhXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtmLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkR1cmF0aW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRHVyYXRpb25Qcm9taXNlW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhLiRuZ2ZEdXJhdGlvblByb21pc2V9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2V9LGV9XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRSZXNpemVcIixbXCJVcGxvYWRWYWxpZGF0ZVwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEsZT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1NYXRoLm1pbihjL2EsZC9iKTtyZXR1cm57d2lkdGg6YSplLGhlaWdodDpiKmV9fSxmPWZ1bmN0aW9uKGEsYyxkLGYsZyl7dmFyIGg9Yi5kZWZlcigpLGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7cmV0dXJuIGoub25sb2FkPWZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWUoai53aWR0aCxqLmhlaWdodCxjLGQpO2kud2lkdGg9YS53aWR0aCxpLmhlaWdodD1hLmhlaWdodDt2YXIgYj1pLmdldENvbnRleHQoXCIyZFwiKTtiLmRyYXdJbWFnZShqLDAsMCxhLndpZHRoLGEuaGVpZ2h0KSxoLnJlc29sdmUoaS50b0RhdGFVUkwoZ3x8XCJpbWFnZS9XZWJQXCIsZnx8MSkpfWNhdGNoKGspe2gucmVqZWN0KGspfX0sai5vbmVycm9yPWZ1bmN0aW9uKCl7aC5yZWplY3QoKX0sai5zcmM9YSxoLnByb21pc2V9LGc9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPWEuc3BsaXQoXCIsXCIpLGM9YlswXS5tYXRjaCgvOiguKj8pOy8pWzFdLGQ9YXRvYihiWzFdKSxlPWQubGVuZ3RoLGY9bmV3IFVpbnQ4QXJyYXkoZSk7ZS0tOylmW2VdPWQuY2hhckNvZGVBdChlKTtyZXR1cm4gbmV3IEJsb2IoW2ZdLHt0eXBlOmN9KX07cmV0dXJuIGQuaXNSZXNpemVTdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3JldHVybiB3aW5kb3cuYXRvYiYmYS5nZXRDb250ZXh0JiZhLmdldENvbnRleHQoXCIyZFwiKX0sZC5yZXNpemU9ZnVuY3Rpb24oYSxlLGgsaSl7dmFyIGo9Yi5kZWZlcigpO3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT8oYyhmdW5jdGlvbigpe2oucmVzb2x2ZShcIk9ubHkgaW1hZ2VzIGFyZSBhbGxvd2VkIGZvciByZXNpemluZyFcIil9KSxqLnByb21pc2UpOihkLmRhdGFVcmwoYSwhMCkudGhlbihmdW5jdGlvbihiKXtmKGIsZSxoLGksYS50eXBlKS50aGVuKGZ1bmN0aW9uKGIpe3ZhciBjPWcoYik7Yy5uYW1lPWEubmFtZSxqLnJlc29sdmUoYyl9LGZ1bmN0aW9uKCl7ai5yZWplY3QoKX0pfSxmdW5jdGlvbigpe2oucmVqZWN0KCl9KSxqLnByb21pc2UpfSxkfV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooKXtyZXR1cm4gYy5hdHRyKFwiZGlzYWJsZWRcIil8fG4oXCJuZ2ZEcm9wRGlzYWJsZWRcIixhKX1mdW5jdGlvbiBrKGEsYixjLGQpe3ZhciBlPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIsYSx7JGV2ZW50OmN9KSxmPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIpfHxcImRyYWdvdmVyXCI7aWYoYW5ndWxhci5pc1N0cmluZyhlKSlyZXR1cm4gdm9pZCBkKGUpO2lmKGUmJihlLmRlbGF5JiYocj1lLmRlbGF5KSxlLmFjY2VwdHx8ZS5yZWplY3QpKXt2YXIgZz1jLmRhdGFUcmFuc2Zlci5pdGVtcztpZihudWxsIT1nKWZvcih2YXIgaD1uKFwibmdmUGF0dGVyblwiLGEseyRldmVudDpjfSksaj0wO2o8Zy5sZW5ndGg7aisrKWlmKFwiZmlsZVwiPT09Z1tqXS5raW5kfHxcIlwiPT09Z1tqXS5raW5kKXtpZighaS52YWxpZGF0ZVBhdHRlcm4oZ1tqXSxoKSl7Zj1lLnJlamVjdDticmVha31mPWUuYWNjZXB0fX1kKGYpfWZ1bmN0aW9uIGwoYSxiLGMsZCl7ZnVuY3Rpb24gZShhLGIsYyl7aWYobnVsbCE9YilpZihiLmlzRGlyZWN0b3J5KXt2YXIgZD0oY3x8XCJcIikrYi5uYW1lO2EucHVzaCh7bmFtZTpiLm5hbWUsdHlwZTpcImRpcmVjdG9yeVwiLHBhdGg6ZH0pO3ZhciBmPWIuY3JlYXRlUmVhZGVyKCksZz1bXTtpKys7dmFyIGg9ZnVuY3Rpb24oKXtmLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGQpe3RyeXtpZihkLmxlbmd0aClnPWcuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGR8fFtdLDApKSxoKCk7ZWxzZXtmb3IodmFyIGY9MDtmPGcubGVuZ3RoO2YrKyllKGEsZ1tmXSwoYz9jOlwiXCIpK2IubmFtZStcIi9cIik7aS0tfX1jYXRjaChqKXtpLS0sY29uc29sZS5lcnJvcihqKX19LGZ1bmN0aW9uKCl7aS0tfSl9O2goKX1lbHNlIGkrKyxiLmZpbGUoZnVuY3Rpb24oYil7dHJ5e2ktLSxiLnBhdGg9KGM/YzpcIlwiKStiLm5hbWUsYS5wdXNoKGIpfWNhdGNoKGQpe2ktLSxjb25zb2xlLmVycm9yKGQpfX0sZnVuY3Rpb24oKXtpLS19KX12YXIgZj1bXSxpPTAsaj1hLmRhdGFUcmFuc2Zlci5pdGVtcztpZihqJiZqLmxlbmd0aD4wJiZcImZpbGVcIiE9PWgucHJvdG9jb2woKSlmb3IodmFyIGs9MDtrPGoubGVuZ3RoO2srKyl7aWYoaltrXS53ZWJraXRHZXRBc0VudHJ5JiZqW2tdLndlYmtpdEdldEFzRW50cnkoKSYmaltrXS53ZWJraXRHZXRBc0VudHJ5KCkuaXNEaXJlY3Rvcnkpe3ZhciBsPWpba10ud2Via2l0R2V0QXNFbnRyeSgpO2lmKGwuaXNEaXJlY3RvcnkmJiFjKWNvbnRpbnVlO251bGwhPWwmJmUoZixsKX1lbHNle3ZhciBtPWpba10uZ2V0QXNGaWxlKCk7bnVsbCE9bSYmZi5wdXNoKG0pfWlmKCFkJiZmLmxlbmd0aD4wKWJyZWFrfWVsc2V7dmFyIG49YS5kYXRhVHJhbnNmZXIuZmlsZXM7aWYobnVsbCE9bilmb3IodmFyIG89MDtvPG4ubGVuZ3RoJiYoZi5wdXNoKG4uaXRlbShvKSksZHx8IShmLmxlbmd0aD4wKSk7bysrKTt9dmFyIHA9MDshZnVuY3Rpb24gcShhKXtnKGZ1bmN0aW9uKCl7aWYoaSkxMCpwKys8MmU0JiZxKDEwKTtlbHNle2lmKCFkJiZmLmxlbmd0aD4xKXtmb3Ioaz0wO1wiZGlyZWN0b3J5XCI9PT1mW2tdLnR5cGU7KWsrKztmPVtmW2tdXX1iKGYpfX0sYXx8MCl9KCl9dmFyIG09YigpLG49ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBpLmF0dHJHZXR0ZXIoYSxkLGIsYyl9O2lmKG4oXCJkcm9wQXZhaWxhYmxlXCIpJiZnKGZ1bmN0aW9uKCl7YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0/YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0udmFsdWU9bTphW24oXCJkcm9wQXZhaWxhYmxlXCIpXT1tfSksIW0pcmV0dXJuIHZvaWQobihcIm5nZkhpZGVPbkRyb3BOb3RBdmFpbGFibGVcIixhKT09PSEwJiZjLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIikpO2kucmVnaXN0ZXJWYWxpZGF0b3JzKGUsbnVsbCxkLGEpO3ZhciBvLHA9bnVsbCxxPWYobihcIm5nZlN0b3BQcm9wYWdhdGlvblwiKSkscj0xO2NbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsZnVuY3Rpb24oYil7aWYoIWooKSl7aWYoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCksbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpPi0xKXt2YXIgZT1iLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkO2IuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q9XCJtb3ZlXCI9PT1lfHxcImxpbmtNb3ZlXCI9PT1lP1wibW92ZVwiOlwiY29weVwifWcuY2FuY2VsKHApLG98fChvPVwiQ1wiLGsoYSxkLGIsZnVuY3Rpb24oYSl7bz1hLGMuYWRkQ2xhc3Mobyl9KSl9fSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsZnVuY3Rpb24oYil7aigpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsZnVuY3Rpb24oKXtqKCl8fChwPWcoZnVuY3Rpb24oKXtvJiZjLnJlbW92ZUNsYXNzKG8pLG89bnVsbH0scnx8MSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLGZ1bmN0aW9uKGIpe2ooKXx8KGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpLG8mJmMucmVtb3ZlQ2xhc3Mobyksbz1udWxsLGwoYixmdW5jdGlvbihjKXtpLnVwZGF0ZU1vZGVsKGUsZCxhLG4oXCJuZ2ZDaGFuZ2VcIil8fG4oXCJuZ2ZEcm9wXCIpLGMsYil9LG4oXCJuZ2ZBbGxvd0RpclwiLGEpIT09ITEsbihcIm11bHRpcGxlXCIpfHxuKFwibmdmTXVsdGlwbGVcIixhKSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIixmdW5jdGlvbihiKXtpZighaigpKXt2YXIgYz1bXSxmPWIuY2xpcGJvYXJkRGF0YXx8Yi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGE7aWYoZiYmZi5pdGVtcyl7Zm9yKHZhciBnPTA7ZzxmLml0ZW1zLmxlbmd0aDtnKyspLTEhPT1mLml0ZW1zW2ddLnR5cGUuaW5kZXhPZihcImltYWdlXCIpJiZjLnB1c2goZi5pdGVtc1tnXS5nZXRBc0ZpbGUoKSk7aS51cGRhdGVNb2RlbChlLGQsYSxuKFwibmdmQ2hhbmdlXCIpfHxuKFwibmdmRHJvcFwiKSxjLGIpfX19LCExKX1mdW5jdGlvbiBiKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm5cImRyYWdnYWJsZVwiaW4gYSYmXCJvbmRyb3BcImluIGEmJiEvRWRnZVxcLzEyLi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9bmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkRyb3BcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkbG9jYXRpb25cIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGIsYyxkLGUpe3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZixnLGgsaSl7YShmLGcsaCxpLGIsYyxkLGUpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZk5vRmlsZURyb3BcIixmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhLGMpe2IoKSYmYy5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpfX0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZEcm9wQXZhaWxhYmxlXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxjLGQpe3JldHVybiBmdW5jdGlvbihlLGYsZyl7aWYoYigpKXt2YXIgaD1hKGQuYXR0ckdldHRlcihcIm5nZkRyb3BBdmFpbGFibGVcIixnKSk7YyhmdW5jdGlvbigpe2goZSksaC5hc3NpZ24mJmguYXNzaWduKGUsITApfSl9fX1dKX0oKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=