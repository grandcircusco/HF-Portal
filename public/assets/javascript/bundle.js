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
    }
};
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

                var data = [];
                tags.forEach(function(tag){

                    var item = {

                        id: tag.id,
                        text: tag.name
                    };
                    data.push(item);
                });

                $("select#tags").select2({
                    //tags: true,
                    data: data,
                    tokenSeparators: [',',' ']
                });

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

                    console.log( $scope.company );
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
                $timeout( function(){ $("#tags").multiSelect({

                    selectableHeader: 'Available Skills',
                    selectionHeader: 'Your Skills'

                }); },  500 );

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
          console.log("The current user is " + currentUser.userType);
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


/*! 7.3.4 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="7.3.4",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function g(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&f?{loaded:a.loaded+d._start,total:d._file.size,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){d._chunkSize&&!d._finished?(g({loaded:d._end,total:d._file.size,config:d,type:"progress"}),e.upload(d)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,g(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,g(h(a)))},!1))}},f?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):i():i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},k}var e=this,f=window.Blob&&(new Blob).slice;this.upload=function(a){function b(c,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))c.append(e,d);else if("form"===a.sendFieldsAs)if(angular.isObject(d))for(var f in d)d.hasOwnProperty(f)&&b(c,d[f],e+"["+f+"]");else c.append(e,d);else d=angular.isString(d)?d:angular.toJson(d),"json-blob"===a.sendFieldsAs?c.append(e,new Blob([d],{type:"application/json"})):c.append(e,d)}function c(a){return a instanceof Blob||a.flashId&&a.name&&a.size}function g(b,d,e){if(c(d)){if(a._file=a._file||d,null!=a._start&&f){a._end&&a._end>=d.size&&(a._finished=!0,a._end=d.size);var h=d.slice(a._start,a._end||d.size);h.name=d.name,d=h,a._chunkSize&&(b.append("chunkSize",a._end-a._start),b.append("chunkNumber",Math.floor(a._start/a._chunkSize)),b.append("totalSize",a._file.size))}b.append(e,d,d.fileName||d.name)}else{if(!angular.isObject(d))throw"Expected file object in Upload.upload file option: "+d.toString();for(var i in d)if(d.hasOwnProperty(i)){var j=i.split(",");j[1]&&(d[i].fileName=j[1].replace(/^\s+|\s+$/g,"")),g(b,d[i],j[0])}}}return a._chunkSize=e.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(c){var d,e=new FormData,f={};for(d in a.fields)a.fields.hasOwnProperty(d)&&(f[d]=a.fields[d]);c&&(f.data=c);for(d in f)if(f.hasOwnProperty(d)){var h=f[d];a.formDataAppender?a.formDataAppender(e,d,h):b(e,h,d)}if(null!=a.file)if(angular.isArray(a.file))for(var i=0;i<a.file.length;i++)g(e,a.file[i],"file");else g(e,a.file,"file");return e}),d(a)},this.http=function(b){return b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=e.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1e3*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1e6*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1e9*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","UploadResize",function(a,b,c,d){var e=d;return e.getAttrWithDefaults=function(a,b){return null!=a[b]?a[b]:null==e.defaults[b]?e.defaults[b]:e.defaults[b].toString()},e.attrGetter=function(b,c,d,e){if(!d)return this.getAttrWithDefaults(c,b);try{return e?a(this.getAttrWithDefaults(c,b))(d,e):a(this.getAttrWithDefaults(c,b))(d)}catch(f){if(b.search(/min|max|pattern/i))return this.getAttrWithDefaults(c,b);throw f}},e.updateModel=function(c,d,f,g,h,i,j){function k(){var j=h&&h.length?h[0]:null;if(c){var k=!e.attrGetter("ngfMultiple",d,f)&&!e.attrGetter("multiple",d)&&!o;a(e.attrGetter("ngModel",d)).assign(f,k?j:h)}var l=e.attrGetter("ngfModel",d);l&&a(l).assign(f,h),g&&a(g)(f,{$files:h,$file:j,$newFiles:m,$duplicateFiles:n,$event:i}),b(function(){})}function l(a,b){var c=e.attrGetter("ngfResize",d,f);if(!c||!e.isResizeSupported())return b();for(var g=a.length,h=function(){g--,0===g&&b()},i=function(b){return function(c){a.splice(b,1,c),h()}},j=function(a){return function(b){h(),a.$error="resize",a.$errorParam=(b?(b.message?b.message:b)+": ":"")+(a&&a.name)}},k=0;k<a.length;k++){var l=a[k];l.$error||0!==l.type.indexOf("image")?h():e.resize(l,c.width,c.height,c.quality).then(i(k),j(l))}}var m=h,n=[],o=e.attrGetter("ngfKeep",d,f);if(o===!0){if(!h||!h.length)return;var p=(c&&c.$modelValue||d.$$ngfPrevFiles||[]).slice(0),q=!1;if(e.attrGetter("ngfKeepDistinct",d,f)===!0){for(var r=p.length,s=0;s<h.length;s++){for(var t=0;r>t;t++)if(h[s].name===p[t].name){n.push(h[s]);break}t===r&&(p.push(h[s]),q=!0)}if(!q)return;h=p}else h=p.concat(h)}d.$$ngfPrevFiles=h,j?k():e.validate(h,c,d,f,e.attrGetter("ngfValidateLater",d),function(){l(h,function(){b(function(){k()})})})},e}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"id"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');return n(a),a.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:a}),document.body.appendChild(a[0]),a}function p(c){if(b.attr("disabled")||t("ngfSelectDisabled",a))return!1;var d=q(c);return null!=d?d:(r(c),e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1)}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)},u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),j.registerValidators(d,w,c,a),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),a.$on("$destroy",function(){k()||w.remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.dataUrl:a.blobUrl)||a.dataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ngf-hide"):e.addClass("ngf-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;return"ngfThumbnail"!==g||d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),angular.isString(c)?(e.removeClass("ngf-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ngf-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.dataUrl=function(a,d){if(d&&null!=a.dataUrl||!d&&null!=a.blobUrl){var e=c.defer();return b(function(){e.resolve(d?a.dataUrl:a.blobUrl)}),e.promise}var f=d?a.$ngfDataUrlPromise:a.$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!d){var e;try{e=c.createObjectURL(a)}catch(f){return void b(function(){a.blobUrl="",g.reject()})}b(function(){a.blobUrl=e,e&&g.resolve(e)})}else{var h=new FileReader;h.onload=function(c){b(function(){a.dataUrl=c.target.result,g.resolve(c.target.result)})},h.onerror=function(){b(function(){a.dataUrl="",g.reject()})},h.readAsDataURL(a)}}else b(function(){a[d?"dataUrl":"blobUrl"]="",g.reject()})}),f=d?a.$ngfDataUrlPromise=g.promise:a.$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[d?"$ngfDataUrlPromise":"$ngfBlobUrlPromise"]}),f},d}]);var c=angular.element("<style>.ngf-hide{display:none !important}</style>");document.getElementsByTagName("head")[0].appendChild(c[0]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])return a.substring(1,a.length-1);var b=a.split(","),c="";if(b.length>1)for(var e=0;e<b.length;e++)c+="("+d(b[e])+")",e<b.length-1&&(c+="|");else 0===a.indexOf(".")&&(a="*"+a),c="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",c=c.replace(/\\\*/g,".*").replace(/\\\?/g,".");return c}var e=a;return e.registerValidators=function(a,b,c,d){function f(a){angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})}a&&(a.$ngfValidations=[],a.$formatters.push(function(g){return e.attrGetter("ngfValidateLater",c,d)||!a.$$ngfValidated?(e.validate(g,a,c,d,!1,function(){f(a),a.$$ngfValidated=!1}),g&&0===g.length&&(g=null),!b||null!=g&&0!==g.length||b.val()&&b.val(null)):(f(a),a.$$ngfValidated=!1),g}))},e.validatePattern=function(a,b){if(!b)return!0;var c=new RegExp(d(b),"gi");return null!=a.type&&c.test(a.type.toLowerCase())||null!=a.name&&c.test(a.name.toLowerCase())},e.validate=function(a,b,c,d,f,g){function h(c,d,e){if(a){for(var f="ngf"+c[0].toUpperCase()+c.substr(1),g=a.length,h=null;g--;){var i=a[g],k=j(f,{$file:i});null==k&&(k=d(j("ngfValidate")||{}),h=null==h?!0:h),null!=k&&(e(i,k)||(i.$error=c,i.$errorParam=k,a.splice(g,1),h=!1))}null!==h&&b.$ngfValidations.push({name:c,valid:h})}}function i(c,d,e,f,h){if(a){var i=0,l=!1,m="ngf"+c[0].toUpperCase()+c.substr(1);a=void 0===a.length?[a]:a,angular.forEach(a,function(a){if(0!==a.type.search(e))return!0;var n=j(m,{$file:a})||d(j("ngfValidate",{$file:a})||{});n&&(k++,i++,f(a,n).then(function(b){h(b,n)||(a.$error=c,a.$errorParam=n,l=!0)},function(){j("ngfValidateForce",{$file:a})&&(a.$error=c,a.$errorParam=n,l=!0)})["finally"](function(){k--,i--,i||b.$ngfValidations.push({name:c,valid:!l}),k||g.call(b,b.$ngfValidations)}))})}}b=b||{},b.$ngfValidations=b.$ngfValidations||[],angular.forEach(b.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return e.attrGetter(a,c,d,b)};if(f)return void g.call(b);if(b.$$ngfValidated=!0,null==a||0===a.length)return void g.call(b);if(a=void 0===a.length?[a]:a.slice(0),h("pattern",function(a){return a.pattern},e.validatePattern),h("minSize",function(a){return a.size&&a.size.min},function(a,b){return a.size>=e.translateScalars(b)}),h("maxSize",function(a){return a.size&&a.size.max},function(a,b){return a.size<=e.translateScalars(b)}),h("validateFn",function(){return null},function(a,b){return b===!0||null===b||""===b}),!a.length)return void g.call(b,b.$ngfValidations);var k=0;i("maxHeight",function(a){return a.height&&a.height.max},/image/,this.imageDimensions,function(a,b){return a.height<=b}),i("minHeight",function(a){return a.height&&a.height.min},/image/,this.imageDimensions,function(a,b){return a.height>=b}),i("maxWidth",function(a){return a.width&&a.width.max},/image/,this.imageDimensions,function(a,b){return a.width<=b}),i("minWidth",function(a){return a.width&&a.width.min},/image/,this.imageDimensions,function(a,b){return a.width>=b}),i("ratio",function(a){return a.ratio},/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++){var f=c[e],g=f.search(/x/i);f=g>-1?parseFloat(f.substring(0,g))/parseFloat(f.substring(g+1)):parseFloat(f),Math.abs(a.width/a.height-f)<1e-4&&(d=!0)}return d}),i("maxDuration",function(a){return a.duration&&a.duration.max},/audio|video/,this.mediaDuration,function(a,b){return a<=e.translateScalars(b)}),i("minDuration",function(a){return a.duration&&a.duration.min},/audio|video/,this.mediaDuration,function(a,b){return a>=e.translateScalars(b)}),i("validateAsyncFn",function(){return null},/./,function(a,b){return b},function(a){return a===!0||null===a||""===a}),k||g.call(b,b.$ngfValidations)},e.imageDimensions=function(a){if(a.width&&a.height){var d=b.defer();return c(function(){d.resolve({width:a.width,height:a.height})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void f.reject("not image"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.width=b,a.height=c,f.resolve({width:b,height:c})}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?e():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",e);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){f.reject("load error")})}),a.$ngfDimensionPromise=f.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},e.mediaDuration=function(a){if(a.duration){var d=b.defer();return c(function(){d.resolve(a.duration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void f.reject("not media"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.duration=b,h.remove(),f.resolve(b)}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?e():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",e);var i=0;g(),angular.element(document.body).append(h)},function(){f.reject("load error")})}),a.$ngfDurationPromise=f.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},e}]),ngFileUpload.service("UploadResize",["UploadValidate","$q","$timeout",function(a,b,c){var d=a,e=function(a,b,c,d){var e=Math.min(c/a,d/b);return{width:a*e,height:b*e}},f=function(a,c,d,f,g){var h=b.defer(),i=document.createElement("canvas"),j=document.createElement("img");return j.onload=function(){try{var a=e(j.width,j.height,c,d);i.width=a.width,i.height=a.height;var b=i.getContext("2d");b.drawImage(j,0,0,a.width,a.height),h.resolve(i.toDataURL(g||"image/WebP",f||1))}catch(k){h.reject(k)}},j.onerror=function(){h.reject()},j.src=a,h.promise},g=function(a){for(var b=a.split(","),c=b[0].match(/:(.*?);/)[1],d=atob(b[1]),e=d.length,f=new Uint8Array(e);e--;)f[e]=d.charCodeAt(e);return new Blob([f],{type:c})};return d.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")},d.resize=function(a,e,h,i){var j=b.defer();return 0!==a.type.indexOf("image")?(c(function(){j.resolve("Only images are allowed for resizing!")}),j.promise):(d.dataUrl(a,!0).then(function(b){f(b,e,h,i,a.type).then(function(b){var c=g(b);c.name=a.name,j.resolve(c)},function(){j.reject()})},function(){j.reject()}),j.promise)},d}]),function(){function a(a,c,d,e,f,g,h,i){function j(){return c.attr("disabled")||n("ngfDropDisabled",a)}function k(a,b,c,d){var e=n("ngfDragOverClass",a,{$event:c}),f=n("ngfDragOverClass")||"dragover";if(angular.isString(e))return void d(e);if(e&&(e.delay&&(r=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g)for(var h=n("ngfPattern",a,{$event:c}),j=0;j<g.length;j++)if("file"===g[j].kind||""===g[j].kind){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}}d(f)}function l(a,b,c,d){function e(a,b,c){if(null!=b)if(b.isDirectory){var d=(c||"")+b.name;a.push({name:b.name,type:"directory",path:d});var f=b.createReader(),g=[];i++;var h=function(){f.readEntries(function(d){try{if(d.length)g=g.concat(Array.prototype.slice.call(d||[],0)),h();else{for(var f=0;f<g.length;f++)e(a,g[f],(c?c:"")+b.name+"/");i--}}catch(j){i--,console.error(j)}},function(){i--})};h()}else i++,b.file(function(b){try{i--,b.path=(c?c:"")+b.name,a.push(b)}catch(d){i--,console.error(d)}},function(){i--})}var f=[],i=0,j=a.dataTransfer.items;if(j&&j.length>0&&"file"!==h.protocol())for(var k=0;k<j.length;k++){if(j[k].webkitGetAsEntry&&j[k].webkitGetAsEntry()&&j[k].webkitGetAsEntry().isDirectory){var l=j[k].webkitGetAsEntry();if(l.isDirectory&&!c)continue;null!=l&&e(f,l)}else{var m=j[k].getAsFile();null!=m&&f.push(m)}if(!d&&f.length>0)break}else{var n=a.dataTransfer.files;if(null!=n)for(var o=0;o<n.length&&(f.push(n.item(o)),d||!(f.length>0));o++);}var p=0;!function q(a){g(function(){if(i)10*p++<2e4&&q(10);else{if(!d&&f.length>1){for(k=0;"directory"===f[k].type;)k++;f=[f[k]]}b(f)}},a||0)}()}var m=b(),n=function(a,b,c){return i.attrGetter(a,d,b,c)};if(n("dropAvailable")&&g(function(){a[n("dropAvailable")]?a[n("dropAvailable")].value=m:a[n("dropAvailable")]=m}),!m)return void(n("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));i.registerValidators(e,null,d,a);var o,p=null,q=f(n("ngfStopPropagation")),r=1;c[0].addEventListener("dragover",function(b){if(!j()){if(b.preventDefault(),q(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(p),o||(o="C",k(a,d,b,function(a){o=a,c.addClass(o)}))}},!1),c[0].addEventListener("dragenter",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(){j()||(p=g(function(){o&&c.removeClass(o),o=null},r||1))},!1),c[0].addEventListener("drop",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation(),o&&c.removeClass(o),o=null,l(b,function(c){i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)},n("ngfAllowDir",a)!==!1,n("multiple")||n("ngfMultiple",a)))},!1),c[0].addEventListener("paste",function(b){if(!j()){var c=[],f=b.clipboardData||b.originalEvent.clipboardData;if(f&&f.items){for(var g=0;g<f.items.length;g++)-1!==f.items[g].type.indexOf("image")&&c.push(f.items[g].getAsFile());i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)}}},!1)}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImFsZXJ0cy9hbGVydC5tb2R1bGUuanMiLCJjb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImZlbGxvd3MvZmVsbG93cy5tb2R1bGUuanMiLCJob21lL2hvbWUubW9kdWxlLmpzIiwicHJvZmlsZS9wcm9maWxlLm1vZHVsZS5qcyIsInZvdGVzL3ZvdGVzLm1vZHVsZS5qcyIsInRhZ3MvdGFncy5tb2R1bGUuanMiLCJhbGVydHMvY29udHJvbGxlci9hbGVydC5jb250cm9sbGVyLmpzIiwiYWxlcnRzL3NlcnZpY2VzL2FsZXJ0LnNlcnZpY2UuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFuaWVzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFueS5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiY29tcGFuaWVzL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3cuY29udHJvbGxlci5qcyIsImZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93cy5jb250cm9sbGVyLmpzIiwiZmVsbG93cy9kaXJlY3RpdmVzL2ZlbGxvd0NhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9zZXJ2aWNlcy9mZWxsb3dzLnNlcnZpY2UuanMiLCJob21lL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvYWRtaW5Qcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2NvbXBhbnlQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2ZlbGxvd3NQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL3Byb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvc2VydmljZXMvczMuc2VydmljZS5qcyIsInByb2ZpbGUvc2VydmljZXMvdXNlci5zZXJ2aWNlLmpzIiwidm90ZXMvY29udHJvbGxlcnMvYWRtaW5Wb3Rlcy5jb250cm9sbGVyLmpzIiwidm90ZXMvY29udHJvbGxlcnMvY29tcGFueVZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9jb250cm9sbGVycy9mZWxsb3dWb3Rlcy5jb250cm9sbGVyLmpzIiwidm90ZXMvY29udHJvbGxlcnMvdm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL3NlcnZpY2VzL3ZvdGVzLnNlcnZpY2UuanMiLCJ0YWdzL2NvbnRyb2xsZXJzL3RhZ3MuY29udHJvbGxlci5qcyIsInRhZ3Mvc2VydmljZXMvdGFncy5zZXJ2aWNlLmpzIiwibmctZmlsZS11cGxvYWQubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBhcHAucm91dGVzXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXG4gKi9cblxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nQ29va2llcycsICAnbmdGaWxlVXBsb2FkJywgJ3VpLmJvb3RzdHJhcCcsXG4gICAgJ2FwcC5jb25maWcnLCAnYXBwLmhvbWUnLCAnYXBwLmNvbXBhbmllcycsICdhcHAuZmVsbG93cycsICdhcHAudGFncycsICdhcHAucHJvZmlsZScsICdhcHAudm90ZXMnLCAnYXBwLmFsZXJ0JyBdKVxuICAgIC5ydW4ocnVuKTtcblxuLyoqXG4gKiAgICogQG5hbWUgY29uZmlnXG4gKiAgICAgKiBAZGVzYyBEZWZpbmUgdmFsaWQgYXBwbGljYXRpb24gcm91dGVzXG4gKiAgICAgICAqL1xuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcblxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgLndoZW4oJy8nLCB7XG4gICAgICAgIGNvbnRyb2xsZXIgIDogJ0hvbWVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmwgOiAnc291cmNlL2FwcC9ob21lL2hvbWUuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvZmVsbG93cycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvZmVsbG93cy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9mZWxsb3dzLzpmZWxsb3dfaWQvOmZlbGxvd19uYW1lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvdy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9jb21wYW5pZXMnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW5pZXMuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvY29tcGFuaWVzLzpjb21wYW55X2lkLzpjb21wYW55X25hbWUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFueS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3RhZ3MnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdUYWdzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC90YWdzL3RhZ3MuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlJywge1xuICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9hZG1pbicsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi1wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9mZWxsb3cnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9mZWxsb3ctcHJvZmlsZS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUvY29tcGFueScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2NvbXBhbnktcHJvZmlsZS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbiggJy92b3RlcycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ1ZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy92b3Rlcy5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbiggJy92b3Rlcy9mZWxsb3cnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvZmVsbG93LXZvdGVzLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCAnL3ZvdGVzL2NvbXBhbnknLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55Vm90ZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3ZvdGVzL3BhcnRpYWxzL2NvbXBhbnktdm90ZXMuaHRtbCdcbiAgICB9KVxuXG4gICAgLm90aGVyd2lzZSh7IHJlZGlyZWN0VG86ICcvJyB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdSb3V0aW5nQ29udHJvbGxlcicsIFJvdXRpbmdDb250cm9sbGVyKVxuLmNvbnRyb2xsZXIoJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuUm91dGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICckd2luZG93JywgJ1VzZXInLCAnJGxvY2F0aW9uJywgJyRhbmNob3JTY3JvbGwnXTtcbkxvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyR3aW5kb3cnLCAnJG1vZGFsSW5zdGFuY2UnLCAnVXNlciddO1xuXG5mdW5jdGlvbiBSb3V0aW5nQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgJHdpbmRvdywgVXNlciwgJGxvY2F0aW9uLCAkYW5jaG9yU2Nyb2xsKSB7XG5cbiAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBmYWxzZTtcbiAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xuXG4gICAgJHNjb3BlLnNjcm9sbFRvID0gZnVuY3Rpb24oaWQpe1xuXG4gICAgICAgICRsb2NhdGlvbi5oYXNoKGlkKTtcbiAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2dpblN0YXR1cygpe1xuXG4gICAgICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IFVzZXIuaXNVc2VyTG9nZ2VkSW4oKTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckFkbWluID0gVXNlci5pc1VzZXJBZG1pbigpO1xuICAgIH1cblxuICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9sb2dpbi1wYWdlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgc2l6ZTogJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUubG9nb3V0VXNlciA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgVXNlci5DbGVhckNyZWRlbnRpYWxzKCk7XG5cbiAgICAgICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5pc1VzZXJBZG1pbiA9IGZhbHNlO1xuXG4gICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkd2luZG93LCAkbW9kYWxJbnN0YW5jZSwgVXNlcikge1xuXG4gICAgLy8gc2F2ZSB0aGlzIHRocm91Z2ggYSByZWZlc2hcbiAgICAkc2NvcGUubG9naW5Gb3JtID0ge1xuXG4gICAgICAgIGVtYWlsOiBcIlwiLFxuICAgICAgICBwYXNzd29yZDogXCJcIixcbiAgICAgICAgZXJyb3JzOiBbXVxuICAgIH07XG5cbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbihsb2dpbkZvcm0pIHtcblxuICAgICAgICAkc2NvcGUubG9naW5Gb3JtLmVycm9ycyA9IFtdO1xuXG4gICAgICAgIFVzZXIubG9naW4obG9naW5Gb3JtKS5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgICAgICAvL1VzZXIuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICBVc2VyLlNldENyZWRlbnRpYWxzKHVzZXIuaWQsIHVzZXIuZW1haWwsIHVzZXIudXNlclR5cGUpO1xuXG4gICAgICAgICAgICAvLyR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cbiAgICAgICAgfSkuZXJyb3IoIGZ1bmN0aW9uKGVycm9yKXtcblxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMucHVzaChcIkludmFsaWQgdXNlciBjcmVkZW50aWFsc1wiKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICB9O1xufVxuXG5cbnJ1bi4kaW5qZWN0ID0gWyckY29va2llU3RvcmUnLCAnVXNlciddO1xuZnVuY3Rpb24gcnVuKCRjb29raWVTdG9yZSwgVXNlcil7XG5cbiAgICAvLyBrZWVwIHVzZXIgbG9nZ2VkIGluIGFmdGVyIHBhZ2UgcmVmcmVzaFxuICAgIHZhciBjdXJyZW50VXNlciA9ICRjb29raWVTdG9yZS5nZXQoJ2dsb2JhbHMnKSB8fCB7fTtcbiAgICBVc2VyLnNldEN1cnJlbnRVc2VyKGN1cnJlbnRVc2VyKTtcblxuICAgIC8vY29uc29sZS5sb2coY3VycmVudFVzZXIpO1xuICAgIC8vaWYgKCRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlcikge1xuICAgIC8vICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSAnQmFzaWMgJyArICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlci5hdXRoZGF0YTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgLy99XG5cbiAgICAvLyRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgIC8vICAgIC8vIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UgaWYgbm90IGxvZ2dlZCBpbiBhbmQgdHJ5aW5nIHRvIGFjY2VzcyBhIHJlc3RyaWN0ZWQgcGFnZVxuICAgIC8vICAgIHZhciByZXN0cmljdGVkUGFnZSA9ICQuaW5BcnJheSgkbG9jYXRpb24ucGF0aCgpLCBbJy9sb2dpbicsICcvcmVnaXN0ZXInXSkgPT09IC0xO1xuICAgIC8vICAgIHZhciBsb2dnZWRJbiA9ICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlcjtcbiAgICAvLyAgICBpZiAocmVzdHJpY3RlZFBhZ2UgJiYgIWxvZ2dlZEluKSB7XG4gICAgLy8gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAvLyAgICB9XG4gICAgLy99KTtcbn1cblxuXG4vKipcbiAqIEhlbHBlciBGdW5jdGlvbnNcbiAqKi9cblxudmFyIEhGSGVscGVycyA9IEhGSGVscGVycyB8fCB7fTtcblxuSEZIZWxwZXJzLmhlbHBlcnMgPSB7XG5cbiAgICBzbHVnaWZ5OiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzdHIudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCAnLScpICAgICAgICAgICAvLyBSZXBsYWNlIHNwYWNlcyB3aXRoIC1cbiAgICAgICAgICAgIC5yZXBsYWNlKC9bXlxcd1xcLV0rL2csICcnKSAgICAgICAvLyBSZW1vdmUgYWxsIG5vbi13b3JkIGNoYXJzXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwtXFwtKy9nLCAnLScpICAgICAgICAgLy8gUmVwbGFjZSBtdWx0aXBsZSAtIHdpdGggc2luZ2xlIC1cbiAgICAgICAgICAgIC5yZXBsYWNlKC9eLSsvLCAnJykgICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gc3RhcnQgb2YgdGV4dFxuICAgICAgICAgICAgLnJlcGxhY2UoLy0rJC8sICcnKTsgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBlbmQgb2YgdGV4dFxuICAgIH1cbn07IiwiLyoqXG4gKiBBIHBsYWNlIHRvIHB1dCBhcHAgd2lkZSBjb25maWcgc3R1ZmZcbiAqXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdhcHAuY29uZmlnJywgW10pXG4gICAgLmNvbnN0YW50KCdDT05GSUcnLCB7XG4gICAgICAgICdBUFBfTkFNRSc6ICdIYWNrZXIgRmVsbG93IFBvcnRhbCcsXG4gICAgICAgICdBUFBfVkVSU0lPTic6ICcxLjAnLFxuICAgICAgICAnU0VSVklDRV9VUkwnOiAnJ1xuICAgIH0pO1xuXG5cbi8vdmFyIHJvb3RVcmwgPSAnaHR0cHM6Ly9xdWlldC1jb3ZlLTY4MzAuaGVyb2t1YXBwLmNvbSc7XG4vLyB2YXIgcm9vdFVybCA9IFwiaHR0cHM6Ly9ib2lsaW5nLXNwcmluZ3MtNzUyMy5oZXJva3VhcHAuY29tXCI7IiwiLyoqXG4gKiBhbGVydCBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0JywgW1xuICAgICAgICAgICAgJ2FwcC5hbGVydC5jb250cm9sbGVycycsXG4gICAgICAgICAgICAnYXBwLmFsZXJ0LnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LnNlcnZpY2VzJywgW10pO1xuXG5cbn0pKCk7XG4iLCIvKipcbiAqIGNvbXBhbmllcyBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcblxuICAvLyBkZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJywgW10pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiBmZWxsb3dzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MnLCBbXG4gICAgICAgICdhcHAuZmVsbG93cy5jb250cm9sbGVycycsXG4gICAgICAgICdhcHAuZmVsbG93cy5zZXJ2aWNlcycsXG4gICAgICAgICdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnLCBbXSk7XG5cblxufSkoKTtcbiIsIi8qKlxuICogaG9tZSBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lJywgW1xuICAgICAgICAnYXBwLmhvbWUuY29udHJvbGxlcnMnLFxuICAgICAgICAvLydhcHAuaG9tZS5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmRpcmVjdGl2ZXMnLCBbXSk7XG4gICAgLy9ob3cgYWJvdXQgdGhpc1xufSkoKTtcbiIsIi8qKlxuICogcHJvZmlsZSBtb2R1bGVcbiAqL1xuXG4gKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBhbmd1bGFyXG4gICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXG4gICAgICAgICAgICAgICdhcHAucHJvZmlsZS5jb250cm9sbGVycycsXG4gICAgICAgICAgICAgICdhcHAucHJvZmlsZS5zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICdhcHAuZmVsbG93cy5zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJ1xuICAgICAgICAgICAgXSk7XG5cbiAgICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgIGFuZ3VsYXJcbiAgICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJywgW10pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiB2b3RlcyBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3RlcycsIFtcblxuICAgICAgICAgICAgJ2FwcC52b3Rlcy5jb250cm9sbGVycycsXG4gICAgICAgICAgICAnYXBwLnZvdGVzLnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMuc2VydmljZXMnLCBbXSk7XG5cblxuICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMuY29udHJvbGxlcnMnLCBbXSk7XG5cblxuXG59KSgpO1xuIiwiLyoqXG4gKiB0YWdzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudGFncycsIFtcblxuICAgICAgICAgICAgJ2FwcC50YWdzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAudGFncy5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhZ3Muc2VydmljZXMnLCBbXSk7XG5cblxuICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudGFncy5jb250cm9sbGVycycsIFtdKTtcblxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEFsZXJ0Q29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FsZXJ0Q29udHJvbGxlcicsIEFsZXJ0Q29udHJvbGxlcik7XG5cbiAgICBBbGVydENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQWxlcnRDb250cm9sbGVyKCAkc2NvcGUsIEFsZXJ0ICkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgZmVsbG93cyBjb250cm9sbGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmFsZXJ0ID0gQWxlcnQuYWxlcnQ7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxlcnQgd2luZG93XG4gICAgICAgICRzY29wZS5jbG9zZUFsZXJ0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgQWxlcnQuY2xvc2VBbGVydCgpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBBbGVydFxuICogQG5hbWVzcGFjZSBhcHAuYWxlcnQuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdBbGVydCcsIEFsZXJ0KTtcblxuICAgIEFsZXJ0LiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG5cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBBbGVydFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEFsZXJ0KCAkdGltZW91dCApIHtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGVydDoge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3dBbGVydDogZnVuY3Rpb24obmV3TWVzc2FnZSwgbmV3VHlwZSkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5tZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnR5cGUgPSBuZXdUeXBlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQuc2hvdyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHRoaW5rIHRoaXMgaXMgb2s/XG4gICAgICAgICAgICAgICAgLy8gRm9yIHNvbWUgcmVhc29uIEkgd2FudGVkIHRoZSBhbGVydCB0byBhdXRvIGNsZWFyIGFuZCBjb3VsZG4ndCBmaWd1cmUgYVxuICAgICAgICAgICAgICAgIC8vIGJldHRlciB3YXkgdG8gaGF2ZSBhIHRpbWVvdXQgYXV0b21hdGljYWxseSBjbG9zZSB0aGUgYWxlcnQuIEkgZmVlbCBsaWtlXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBzb21lIHNvcnQgb2Ygc2NvcGluZyB3ZWlyZG5lc3MgZ29pbmcgb24gaGVyZSwgYnV0IGl0IHdvcmtzIGFuZCBJXG4gICAgICAgICAgICAgICAgLy8gYW0gdGlyZWQsIHNvIGl0IGlzIGdldHRpbmcgY29tbWl0dGVkIDstcFxuICAgICAgICAgICAgICAgIHZhciBhbGVydCA9IHRoaXMuYWxlcnQ7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoIGZ1bmN0aW9uKCl7IGFsZXJ0LnNob3cgPSBmYWxzZTsgfSwgIDUwMDAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZUFsZXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQudHlwZSA9ICdpbmZvJztcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbmllc0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIENvbXBhbmllcykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBDb21wYW5pZXMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYW5pZXMgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG4gICAgICAgICdjb21wYW55JywgJ1ZvdGVzJywgJ1VzZXInXTtcblxuICAgIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgQ29tcGFueUNvbnRyb2xsZXIpO1xuXG4gICAgQ29tcGFueUNvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnQ29tcGFuaWVzJywgJ1VzZXInLCAnVm90ZXMnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlDb250cm9sbGVyKCAkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIENvbXBhbmllcywgVXNlciwgVm90ZXMsIEFsZXJ0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gW107XG4gICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSBbXTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgIENvbXBhbmllcy5nZXQoICRyb3V0ZVBhcmFtcy5jb21wYW55X2lkICkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFueSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIFVzZXIuZ2V0Vm90ZXMoIGNvbXBhbnkudXNlcl9pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gdm90ZXMudm90ZXNGb3I7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IHZvdGVzLnZvdGVzQ2FzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCAkc2NvcGUudm90ZXNGb3IubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHNjb3BlLnZvdGVzRm9yW2ldO1xuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50LmlkID09ICRzY29wZS5jdXJyZW50VXNlci5pZCApIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0ZlbGxvdyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAoICRzY29wZS5jdXJyZW50VXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGNvbXBhbnkpIHtcblxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmlzRmVsbG93KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVm90ZXMuY3JlYXRlKCRzY29wZS5jdXJyZW50VXNlci5pZCwgY29tcGFueS51c2VyX2lkKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodm90ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b3RlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoIGVyci5kYXRhLCBcImluZm9cIiApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgY29tcGFueUNhcmQpO1xuXG5cbiAgICBmdW5jdGlvbiBjb21wYW55Q2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4qIENvbXBhbmllc1xuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xuXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XG5cbiAgLyoqXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNcbiAgKi9cbiAgZnVuY3Rpb24gQ29tcGFuaWVzKCRodHRwLCBVcGxvYWQsIENPTkZJRykge1xuXG4gICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsOiBhbGwsXG4gICAgICBhbGxXaXRoVXNlcjogYWxsV2l0aFVzZXIsXG4gICAgICBnZXQ6IGdldCxcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGwoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWxsXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGxXaXRoVXNlcigpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VycycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFxuICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIHBhcnNlSW50KGlkKSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQG5hbWUgZ2V0QnlVc2VySWRcbiAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55IGJ5IHVzZXIgaWRcbiAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VyX2lkLycgKyBwYXJzZUludCh1c2VyX2lkKSApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY3JlYXRlXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb21wYW55KSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb21wYW55KSB7XG5cbiAgICAgIC8vcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgLy8gIHVybDogcm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCxcbiAgICAgIC8vICBmaWVsZHM6IGNvbXBhbnksXG4gICAgICAvLyAgZmlsZTogY29tcGFueS5maWxlLFxuICAgICAgLy8gIG1ldGhvZDogJ1BVVCdcbiAgICAgIC8vXG4gICAgICAvL30pO1xuXG4gICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGNvbXBhbnkuaWQsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgY29tcGFueSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkKTtcbiAgICB9XG4gIH1cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dDb250cm9sbGVyJywgRmVsbG93Q29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnRmVsbG93cycsICdVc2VyJywgJ1ZvdGVzJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93Q29udHJvbGxlcigkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIEZlbGxvd3MsIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSBbXTtcbiAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IFtdO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgRmVsbG93cy5nZXQoICRyb3V0ZVBhcmFtcy5mZWxsb3dfaWQgKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3cpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAgICAgVXNlci5nZXRWb3RlcyggZmVsbG93LnVzZXJfaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0ZvciA9IHZvdGVzLnZvdGVzRm9yO1xuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSB2b3Rlcy52b3Rlc0Nhc3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyVm90ZWQgPSBmdW5jdGlvbiBjdXJyZW50VXNlclZvdGVkKCl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgJHNjb3BlLnZvdGVzRm9yLmxlbmd0aDsgaSsrICl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICRzY29wZS52b3Rlc0ZvcltpXTtcbiAgICAgICAgICAgICAgICBpZiggZWxlbWVudC5pZCA9PSAkc2NvcGUuY3VycmVudFVzZXIuaWQgKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaXNDb21wYW55ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgcmV0dXJuICggJHNjb3BlLmN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSBcIkNvbXBhbnlcIiApO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS52b3RlID0gZnVuY3Rpb24gdm90ZShmZWxsb3cpIHtcblxuICAgICAgICAgICAgaWYgKCAkc2NvcGUuaXNDb21wYW55KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBWb3Rlcy5jcmVhdGUoJHNjb3BlLmN1cnJlbnRVc2VyLmlkLCBmZWxsb3cudXNlcl9pZClcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHZvdGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHZvdGUgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvdGU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiK2Vycik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dzQ29udHJvbGxlcicsIEZlbGxvd3NDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnRmVsbG93cyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBGZWxsb3dzKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIEZlbGxvd3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93cykge1xuXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoZmVsbG93KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvcGFydGlhbHMvZmVsbG93X2RldGFpbF92aWV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZlbGxvd3MgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdycsXG4gICAgICAgICdWb3RlcycsICdVc2VyJywgJyR0aW1lb3V0J107XG5cbiAgICBmdW5jdGlvbiBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93LCBWb3RlcywgVXNlcikge1xuXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhmZWxsb3cpO1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLmZlbGxvdyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2ZlbGxvd0NhcmQnLCBmZWxsb3dDYXJkKTtcblxuICAvL25nLWZlbGxvdy1jYXJkXG4gZnVuY3Rpb24gZmVsbG93Q2FyZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICBzY29wZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfY2FyZC5odG1sJy8qLFxuICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIH0pO1xuICAgICAgIH0gKi9cbiAgICB9O1xuICB9XG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dzXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdGZWxsb3dzJywgRmVsbG93cyk7XG5cbiAgICBGZWxsb3dzLiRpbmplY3QgPSBbJyRodHRwJywgJ1VwbG9hZCcsICdDT05GSUcnXTtcblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzXG4gICAgICogQHJldHVybnMge1NlcnZpY2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBhbGxXaXRoVXNlcjogYWxsV2l0aFVzZXIsXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGFsbFxuICAgICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbFdpdGhVc2VyKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzL3VzZXJzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0XG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldEJ5VXNlcklkXG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93IGJ5IHVzZXJfaWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VyX2lkLycgKyB1c2VyX2lkKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShmZWxsb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycsIGZlbGxvdyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZmVsbG93KSB7XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgLy8gICAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLFxuICAgICAgICAgICAgLy8gICAgZmllbGRzOiBmZWxsb3csXG4gICAgICAgICAgICAvLyAgICBmaWxlOiBmZWxsb3cuZmlsZSxcbiAgICAgICAgICAgIC8vICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL30pO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsIGZlbGxvdyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogSG9tZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmVsbG93cyddO1xuXG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcbiAgKi9cbiAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlLCBGZWxsb3dzKSB7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvd3Mpe1xuXG4gICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgfSk7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgaG9tZSBjb250cm9sbGVyIScpO1xuICAgICAgLy9Ib21lLmFsbCgpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuKiBBZG1pblByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVDb250cm9sbGVyKTtcblxuICAgIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICckbW9kYWwnLCAnVXNlcicsICdGZWxsb3dzJywgJ0NvbXBhbmllcyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBBZG1pblByb2ZpbGVDb250cm9sbGVyXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sICRtb2RhbCwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgLy8gVE9ETyAtIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiByb3V0ZXMgb3Igd2l0aCBtaWRkbGV3YXJlIG9yIHNvbWUga2luZFxuICAgICAgICBpZiggIVVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIGN1cnJlbnQgdXNlciBpcyBhbiBBZG1pblxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJBZG1pblwiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IFtdO1xuICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gW107XG4gICAgICAgICRzY29wZS51c2VyTGlzdExvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYoICRzY29wZS5mZWxsb3dzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIEZlbGxvd3MuYWxsV2l0aFVzZXIoKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3dzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGZlbGxvd3MgKTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoICRzY29wZS5jb21wYW5pZXMubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgQ29tcGFuaWVzLmFsbFdpdGhVc2VyKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGNvbXBhbmllcyApO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnVzZXJMaXN0TG9hZCgpO1xuXG5cbiAgICAgICAgJHNjb3BlLmZlbGxvd1ZvdGVzID0gZnVuY3Rpb24oIGZlbGxvdyApe1xuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2ZlbGxvdy12b3Rlcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgZmVsbG93OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlbGxvdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY29tcGFueVZvdGVzID0gZnVuY3Rpb24oIGNvbXBhbnkgKXtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9jb21wYW55LXZvdGVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wYW55O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5lZGl0RmVsbG93ID0gZnVuY3Rpb24oZmVsbG93KXtcblxuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2VkaXQtZmVsbG93LWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRGZWxsb3dNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdzogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5lZGl0Q29tcGFueT0gZnVuY3Rpb24oY29tcGFueSl7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgdXNlciBkYXRhIHRvIHNlcnZpY2VcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9lZGl0LWNvbXBhbnktZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdENvbXBhbnlNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFueTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBAVE9ETyAtIEltcGxlbWVudCBMYXRlclxuICAgICAgICAkc2NvcGUuYXJjaGl2ZUZlbGxvdyA9IGZ1bmN0aW9uKHVzZXIpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFyY2hpdmUgVXNlcjogXCIrdXNlci5pZCk7XG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKiBDcmVhdGUgVXNlciAqL1xuICAgICAgICAkc2NvcGUuY3JlYXRlVXNlciA9IGZ1bmN0aW9uICh1c2VyKSB7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL25ldy11c2VyLWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKCBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3SXRlbSA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBpZiggbmV3SXRlbS51c2VyLnVzZXJUeXBlID09PSAnRmVsbG93JyApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93cy51bnNoaWZ0KCBuZXdJdGVtICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoIG5ld0l0ZW0udXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMudW5zaGlmdCggbmV3SXRlbSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIE1vZGFsIEluc3RhbmNlIENvbnRyb2xsZXJzXG4gICAgICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICAgICAqL1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdFZGl0RmVsbG93TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBFZGl0RmVsbG93TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRWRpdENvbXBhbnlNb2RhbEluc3RhbmNlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cbiAgICBFZGl0RmVsbG93TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdycsICdVc2VyJywgJ0ZlbGxvd3MnIF07XG4gICAgZnVuY3Rpb24gRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmZWxsb3csIFVzZXIsIEZlbGxvd3MpIHtcblxuICAgICAgICAkc2NvcGUudXNlciA9IGZlbGxvdy51c2VyO1xuICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICBVc2VyLnVwZGF0ZSgkc2NvcGUudXNlcikudGhlbihmdW5jdGlvbihuZXdVc2VyKXtcblxuICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IG5ld1VzZXI7XG5cbiAgICAgICAgICAgICAgICAvLyB1c2VyIGlzIHVwZGF0ZWQsIHNvIG5vdyB1cGRhdGUgZmVsbG93XG4gICAgICAgICAgICAgICAgRmVsbG93cy51cGRhdGUoICRzY29wZS5mZWxsb3cgKS50aGVuKGZ1bmN0aW9uKG5ld0ZlbGxvdyl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gbmV3RmVsbG93O1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBmZWxsb3dcIiBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIGZlbGxvd1wiIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55JywgJ1VzZXInLCAnQ29tcGFuaWVzJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFVzZXIsIENvbXBhbmllcykge1xuXG4gICAgICAgICRzY29wZS51c2VyID0gY29tcGFueS51c2VyO1xuICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgIFVzZXIudXBkYXRlKCRzY29wZS51c2VyKS50aGVuKCBmdW5jdGlvbiggbmV3VXNlciApe1xuXG4gICAgICAgICAgICAgICAgLy8gc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gbmV3VXNlcjtcblxuICAgICAgICAgICAgICAgIENvbXBhbmllcy51cGRhdGUoJHNjb3BlLmNvbXBhbnkpLnRoZW4oIGZ1bmN0aW9uKCBuZXdDb21wYW55ICl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IG5ld0NvbXBhbnk7XG5cbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIGNvbXBhbnlcIiBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgLy8gZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gWyBcIlRoZXJlIHdhcyBhbiBlcnJvciB1cGRhdGluZyB0aGUgY29tcGFueVwiIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLnVzZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBGZWxsb3dWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdmZWxsb3cnIF07XG4gICAgZnVuY3Rpb24gRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlciggJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93ICl7XG5cbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAvLyBDaGVjayBmZWxsb3cgVm90ZXNGb3IgdG8gc2VlIGlmIGEgY29tcGFueSB2b3RlZCBmb3IgYSBmZWxsb3dcbiAgICAgICAgJHNjb3BlLmNvbXBhbnlWb3RlZEZvckZlbGxvdyA9IGZ1bmN0aW9uKCBjb21wYW55X3VzZXJfaWQgKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBmZWxsb3cudXNlci5Wb3Rlc0Zvci5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBmZWxsb3cudXNlci5Wb3Rlc0ZvcltpXTtcblxuICAgICAgICAgICAgICAgIGlmKCB2b3RlLmlkID09PSBjb21wYW55X3VzZXJfaWQgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2hlY2sgZmVsbG93IFZvdGVzQ2FzdCB0byBzZWUgaWYgdGhleSB2b3RlZCBmb3IgYSBjb21wYW55XG4gICAgICAgICRzY29wZS5mZWxsb3dWb3RlZEZvckNvbXBhbnkgPSBmdW5jdGlvbiggY29tcGFueV91c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgZmVsbG93LnVzZXIuVm90ZXNDYXN0Lmxlbmd0aDsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdm90ZSA9IGZlbGxvdy51c2VyLlZvdGVzQ2FzdFtpXTtcblxuICAgICAgICAgICAgICAgIGlmKCB2b3RlLmlkID09PSBjb21wYW55X3VzZXJfaWQgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2NvbXBhbnknIF07XG4gICAgZnVuY3Rpb24gQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoICRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnkgKXtcblxuICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgLy8gQ2hlY2sgZmVsbG93IFZvdGVzQ2FzdCB0byBzZWUgaWYgdGhleSB2b3RlZCBmb3IgYSBjb21wYW55XG4gICAgICAgICRzY29wZS5mZWxsb3dWb3RlZEZvckNvbXBhbnkgPSBmdW5jdGlvbiggY29tcGFueV91c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgY29tcGFueS51c2VyLlZvdGVzRm9yLmxlbmd0aDsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdm90ZSA9IGNvbXBhbnkudXNlci5Wb3Rlc0ZvcltpXTtcblxuICAgICAgICAgICAgICAgIGlmKCB2b3RlLmlkID09PSBjb21wYW55X3VzZXJfaWQgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQ2hlY2sgZmVsbG93IFZvdGVzRm9yIHRvIHNlZSBpZiBhIGNvbXBhbnkgdm90ZWQgZm9yIGEgZmVsbG93XG4gICAgICAgICRzY29wZS5jb21wYW55Vm90ZWRGb3JGZWxsb3cgPSBmdW5jdGlvbiggY29tcGFueV91c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgY29tcGFueS51c2VyLlZvdGVzQ2FzdC5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBjb21wYW55LnVzZXIuVm90ZXNDYXN0W2ldO1xuXG4gICAgICAgICAgICAgICAgaWYoIHZvdGUuaWQgPT09IGNvbXBhbnlfdXNlcl9pZCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ1VzZXInLCAnRmVsbG93cycsICdDb21wYW5pZXMnIF07XG4gICAgZnVuY3Rpb24gQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBVc2VyLCBGZWxsb3dzLCBDb21wYW5pZXMpIHtcblxuICAgICAgICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24gKHVzZXIpe1xuXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gW107XG5cbiAgICAgICAgICAgIC8vIEZvcm0gaXMgYmVpbmcgdmFsaWRhdGVkIGJ5IGFuZ3VsYXIsIGJ1dCBsZWF2aW5nIHRoaXMganVzdCBpbiBjYXNlXG4gICAgICAgICAgICBpZiggdHlwZW9mIHVzZXIgID09PSBcInVuZGVmaW5lZFwiKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggXCJBZGQgc29tZSBkYXRhIGZpcnN0XCIgKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHVzZXIuZW1haWwgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCBcIkVudGVyIGFuIGVtYWlsXCIgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHVzZXIucGFzc3dvcmQgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCBcIkVudGVyIGEgcGFzc3dvcmRcIiApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgdXNlci51c2VyVHlwZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIFwiQ2hvb3NlIGEgdXNlciB0eXBlXCIgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYoICRzY29wZS5lcnJvcnMubGVuZ3RoID09PSAwICl7XG5cbiAgICAgICAgICAgICAgICAvLyBzZW5kIHVzZXIgdG8gQVBJIHZpYSBTZXJ2aWNlXG4gICAgICAgICAgICAgICAgVXNlci5jcmVhdGUodXNlcikudGhlbiggZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdXNlciBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCB1c2VyICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJfaWQgPSByZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKCB1c2VyLnVzZXJUeXBlID09PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmZWxsb3dfcG9zdCA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9uYW1lOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBGZWxsb3dzLmNyZWF0ZShmZWxsb3dfcG9zdCkudGhlbiggZnVuY3Rpb24oIGZlbGxvdyApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZlbGxvdyBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGZlbGxvdyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCBmZWxsb3cgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgZmVsbG93IGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCByZXNwb25zZS5kYXRhLmVycm9yICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCB1c2VyLnVzZXJUeXBlID09PSBcIkNvbXBhbnlcIiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGFueV9wb3N0ID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGFuaWVzLmNyZWF0ZShjb21wYW55X3Bvc3QpLnRoZW4oIGZ1bmN0aW9uKCBjb21wYW55ICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgY29tcGFueSBzdWNjZXNzIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoIGNvbXBhbnkgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjcmVhdGUgZmVsbG93IGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCByZXNwb25zZS5kYXRhLmVycm9yICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHVzZXIgZXJyb3IgY2FsbGJhY2tcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggcmVzcG9uc2UgKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCByZXNwb25zZS5kYXRhLmVycm9yICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcblxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4qIENvbXBhbnlQcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdDb21wYW55UHJvZmlsZUNvbnRyb2xsZXInLCBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnQ29tcGFuaWVzJywgJ1VzZXInLCAnVGFncycsICdBbGVydCddO1xuXG4gICAgLyoqXG4gICAgKiBAbmFtZXNwYWNlIENvbXBhbnlQcm9maWxlQ29udHJvbGxlclxuICAgICovXG4gICAgZnVuY3Rpb24gQ29tcGFueVByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBDb21wYW5pZXMsIFVzZXIsIFRhZ3MsIEFsZXJ0KSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLy8gUHJvYmFibHkgY2FuIGhhbmRsZSB0aGlzIGluIHRoZSByb3V0ZXMgb3Igd2l0aCBtaWRkbGV3YXJlIG9mIHNvbWUga2luZFxuICAgICAgICBpZiggIVVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIGN1cnJlbnQgdXNlciBpcyBhIENvbXBhbnlcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBDb21wYW5pZXMuZ2V0QnlVc2VySWQoY3VycmVudFVzZXIuaWQpLnN1Y2Nlc3MoZnVuY3Rpb24oY29tcGFueSl7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgVGFncy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKHRhZ3Mpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB0YWdzLmZvckVhY2goZnVuY3Rpb24odGFnKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRhZy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRhZy5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQoXCJzZWxlY3QjdGFnc1wiKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgLy90YWdzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICB0b2tlblNlcGFyYXRvcnM6IFsnLCcsJyAnXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgcHJvZmlsZSBjb250cm9sbGVyIScpO1xuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcblxuICAgICAgICAgICAgLy8gZ2V0IHRoZSB0YWdzIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgIC8vY29tcGFueS50YWdzID0gJChcIiN0YWdzXCIpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHRhZ3MgPSBbXTtcbiAgICAgICAgICAgICQoJyN0YWdzIDpzZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24oaSwgc2VsZWN0ZWQpe1xuICAgICAgICAgICAgICAgIHRhZ3NbaV0gPSAkKHNlbGVjdGVkKS52YWwoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb21wYW55LnRhZ3MgPSB0YWdzO1xuXG4gICAgICAgICAgICAvLyBzZW5kIGNvbXBhbmllcyBpbmZvIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgQ29tcGFuaWVzLnVwZGF0ZShjb21wYW55KS5zdWNjZXNzKGZ1bmN0aW9uKG5ld0NvbXBhbnlEYXRhKXtcblxuICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcbiAgICAgICAgICAgICAgICBjb21wYW55ID0gbmV3Q29tcGFueURhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBoaWRlIHVwZGF0ZSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoICdZb3VyIHByb2ZpbGUgaGFzIGJlZW4gdXBkYXRlZCcsICdzdWNjZXNzJyApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqIFMzIEZpbGUgdXBsb2FkaW5nICoqL1xuICAgICAgICAkc2NvcGUuZ2V0UzNLZXkgPSBmdW5jdGlvbigpe1xuXG5cbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZV9pbnB1dFwiKS5maWxlcztcbiAgICAgICAgICAgIHZhciBmaWxlID0gZmlsZXNbMF07XG5cbiAgICAgICAgICAgIGlmKGZpbGUgPT09IG51bGwpe1xuXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJObyBmaWxlIHNlbGVjdGVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLVwiICsgJHNjb3BlLmNvbXBhbnkudXNlcl9pZCArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXG4gICAgICAgICAgICB4aHIub3BlbihcIkdFVFwiLCBcIi9zaWduX3MzP2ZpbGVfbmFtZT1cIitmaWxlX25hbWUrXCImZmlsZV90eXBlPVwiK2ZpbGUudHlwZSk7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIGlmKHhoci5yZWFkeVN0YXRlID09PSA0KXtcblxuICAgICAgICAgICAgICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkX2ZpbGUoZmlsZSwgcmVzcG9uc2Uuc2lnbmVkX3JlcXVlc3QsIHJlc3BvbnNlLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJDb3VsZCBub3QgZ2V0IHNpZ25lZCBVUkwuXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRfZmlsZShmaWxlLCBzaWduZWRfcmVxdWVzdCwgdXJsKXtcblxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4oXCJQVVRcIiwgc2lnbmVkX3JlcXVlc3QpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ3gtYW16LWFjbCcsICdwdWJsaWMtcmVhZCcpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gIFNldCBpbWFnZSBwcmV2aWV3XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJldmlld1wiKS5zcmMgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGNvbXBhbnkgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkuaW1hZ2VfdXJsID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAkc2NvcGUuY29tcGFueSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4qIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLCBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJHRpbWVvdXQnLCAnRmVsbG93cycsICdUYWdzJywgJ1VzZXInLCAnUzMnLCAnQWxlcnQnIF07XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sICR0aW1lb3V0LCBGZWxsb3dzLCBUYWdzLCBVc2VyLCBTMywgQWxlcnQgKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgRmVsbG93XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBGZWxsb3dzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvdyl7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgICRzY29wZS50YWdzID0gW107XG4gICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24odGFncyl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudGFncyA9IHRhZ3M7XG5cbiAgICAgICAgICAgICAgICAvLyBiaW5kIGpRdWVyeSBtdWx0aSBzZWxlY3RcbiAgICAgICAgICAgICAgICAvLyAtLSBhZGRlZCB0aW1lb3V0IHRvIG1ha2Ugc3VyZSB0aGUgI3RhZ3Mgc2VsZWN0IGVsZW1lbnQgZ2V0cyBwb3B1bGF0ZWRcbiAgICAgICAgICAgICAgICAvLyAtLSBAVE9ETyAtLSBGaW5kIGEgYmV0dGVyIHdheSB0byBhZGQgZnVuY3Rpb25hbGl0eSB0byBUYWdzXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoIGZ1bmN0aW9uKCl7ICQoXCIjdGFnc1wiKS5tdWx0aVNlbGVjdCh7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0YWJsZUhlYWRlcjogJ0F2YWlsYWJsZSBTa2lsbHMnLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25IZWFkZXI6ICdZb3VyIFNraWxscydcblxuICAgICAgICAgICAgICAgIH0pOyB9LCAgNTAwICk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgcHJvZmlsZSBjb250cm9sbGVyIScpO1xuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oZmVsbG93LCBmaWxlKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cgKCBmZWxsb3cudGFncyApO1xuXG4gICAgICAgICAgICAvLyBzZW5kIGZlbGxvd3MgaW5mbyB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgIEZlbGxvd3MudXBkYXRlKGZlbGxvdykuc3VjY2VzcyhmdW5jdGlvbihuZXdGZWxsb3dEYXRhKXtcblxuICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcbiAgICAgICAgICAgICAgICBmZWxsb3cgPSBuZXdGZWxsb3dEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gaGlkZSB1cGRhdGUgbWVzc2FnZVxuICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgQWxlcnQuc2hvd0FsZXJ0KCAnWW91ciBwcm9maWxlIGhhcyBiZWVuIHVwZGF0ZWQnLCAnc3VjY2VzcycgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKiBTMyBGaWxlIHVwbG9hZGluZyAqKi9cbiAgICAgICAgJHNjb3BlLmdldFMzS2V5ID0gZnVuY3Rpb24oKXtcblxuXG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVfaW5wdXRcIikuZmlsZXM7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVzWzBdO1xuXG4gICAgICAgICAgICBpZihmaWxlID09PSBudWxsKXtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiTm8gZmlsZSBzZWxlY3RlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLVwiICsgJHNjb3BlLmZlbGxvdy51c2VyX2lkICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGUgPT09IDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRfZmlsZShmaWxlLCByZXNwb25zZS5zaWduZWRfcmVxdWVzdCwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBnZXQgc2lnbmVkIFVSTC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZF9maWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgU2V0IGltYWdlIHByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgZmVsbG93IG1vZGVsXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3cuaW1hZ2VfdXJsID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIvKipcbiogUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlciddO1xuICAvKipcbiAgKiBAbmFtZXNwYWNlIFByb2ZpbGVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyKSB7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY3VycmVudCB1c2VyIGlzIFwiICsgY3VycmVudFVzZXIudXNlclR5cGUpO1xuICAgICAgICAgIC8vIHJlZGlyZWN0IHRoZSB1c2VyIGJhc2VkIG9uIHRoZWlyIHR5cGVcbiAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBib3NzXCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2FkbWluXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBmZWxsYVwiKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9mZWxsb3dcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBjb21wYW55XCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2NvbXBhbnlcIik7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcblxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICB9XG5cbiAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIFMzXG4gKiBAbmFtZXNwYWNlIGFwcC5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEBUT0RPIC0tIEltcGxlbWVudCB0aGUgUzMgc2VydmljZVxuXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1MzJywgUzMpO1xuXG4gICAgUzMuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFMzXG4gICAgICogQHJldHVybnMge1NlcnZpY2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gUzMoJGh0dHAsIENPTkZJRykge1xuXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgIGdldFMzS2V5OiBnZXRTM0tleSxcbiAgICAgICAgICAgIHVwbG9hZEZpbGU6IHVwbG9hZEZpbGVcbiAgICAgICAgfTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIEdldCB0aGUgaW1hZ2UgZmlsZSBhbmQgdHJpZ2dlciByZXF1ZXN0IHRvIFMzXG4gICAgICAgIGZ1bmN0aW9uIGdldFMzS2V5KCBmaWxlLCB1c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGlmKGZpbGUgIT09IG51bGwpe1xuXG4gICAgICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIHByZXZlbnQgbmFtaW5nIGNvbGxpc2lvbnMgYnkgYXBwZW5kaW5nIHRoZSB1bmlxdWUgdXNlcl9pZCB0byBmaWxlIG5hbWVcbiAgICAgICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAgICAgLy8gLS0gd2FudCB0byBtYWtlIHN1cmUgd2UgYWxsb3cgLiBpbiB0aGUgZmlsZW5hbWUgb3V0c2lkZSBvZiBleHRlbnNpb25cbiAgICAgICAgICAgICAgICB2YXIgcGllY2VzID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlX25hbWUgPSB1c2VyX2lkICsgXCItXCIgKyBwaWVjZXMuam9pbihcIi5cIikgKyBcIi5cIiArIGV4dGVuc2lvbjtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG5cbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9zaWduX3MzP2ZpbGVfbmFtZT1cIitmaWxlX25hbWUrXCImZmlsZV90eXBlPVwiK2ZpbGUudHlwZVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3R1YWxseSB1cGxvYWQgdGhlIG5ldyBmaWxlIHRvIFMzXG4gICAgICAgIC8vIC0tIHB1dHMgdGhlIG5ldyB1cmwgaW4gYSBoaWRkZW4gZm9ybSBlbGVtZW50XG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEZpbGUoZmlsZSwgc2lnbmVkX3JlcXVlc3QsIHVybCl7XG5cbiAgICAgICAgICAgIC8vICoqIFRISVMgRE9FUyBOT1QgV09SSyAqKi9cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcblxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBzaWduZWRfcmVxdWVzdCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICd4LWFtei1hY2wnOiAncHVibGljLXJlYWQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiBmaWxlLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmaWxlLnR5cGVcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgLy94aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICAvL3hoci5zZXRSZXF1ZXN0SGVhZGVyKCd4LWFtei1hY2wnLCAncHVibGljLXJlYWQnKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL3hoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgICAgICAvLyAgICB9XG4gICAgICAgICAgICAvL307XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy94aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcbiAgICAgICAgICAgIC8vfTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL3hoci5zZW5kKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBQcm9maWxlXG4gKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnKVxuICAgIC5mYWN0b3J5KCdVc2VyJywgVXNlcik7XG5cbiAgVXNlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRjb29raWVTdG9yZScsICckaHR0cCcsICdDT05GSUcnXTtcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBVc2VyXG4gICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgKi9cbiAgZnVuY3Rpb24gVXNlcigkcm9vdFNjb3BlLCAkY29va2llU3RvcmUsICRodHRwLCBDT05GSUcpIHtcblxuICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgIC8vIFdpbGwgaG9sZCBpbmZvIGZvciB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XG5cbiAgICAgICAgICByZXR1cm4gY3VycmVudFVzZXI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VyKHVzZXIpIHtcblxuICAgICAgICAgIGN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0Vm90ZXMoIHVzZXJfaWQgKXtcblxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyB1c2VyX2lkICsgJy92b3RlcycgKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBsb2dpblxuICAgICAgICogQGRlc2MgbG9naW4gYSBuZXcgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbG9naW4odXNlcikge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy9sb2dpbicsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgLy9hbGw6IGFsbCxcbiAgICAgICAgICAvL2dldDogZ2V0LFxuICAgICAgICAgIGdldFZvdGVzOiBnZXRWb3RlcyxcbiAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgLy9kZXN0cm95OiBkZXN0cm95XG4gICAgICAgICAgU2V0Q3JlZGVudGlhbHM6IFNldENyZWRlbnRpYWxzLFxuICAgICAgICAgIENsZWFyQ3JlZGVudGlhbHM6IENsZWFyQ3JlZGVudGlhbHMsXG4gICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxuICAgICAgICAgIHNldEN1cnJlbnRVc2VyOiBzZXRDdXJyZW50VXNlcixcbiAgICAgICAgICBpc1VzZXJMb2dnZWRJbjogaXNVc2VyTG9nZ2VkSW4sXG4gICAgICAgICAgaXNVc2VyQWRtaW46IGlzVXNlckFkbWluXG4gICAgICB9O1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSB1c2Vyc1xuICAgICAgICovXG4gICAgICAvL2Z1bmN0aW9uIGFsbCgpIHtcbiAgICAgIC8vXG4gICAgICAvLyAgICByZXR1cm4gW107XG4gICAgICAvL1xuICAgICAgLy8gICAgLy9yZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBnZXRcbiAgICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSB1c2VyXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICAvLyAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIG5ldyB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGUodXNlcikge1xuXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2NyZWF0ZScsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICogQGRlc2MgdXBkYXRlYSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlci5pZCwgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICogQGRlc2MgZGVzdHJveSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgLy8gICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgcm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBpZCk7XG4gICAgICAvL31cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyTG9nZ2VkSW4oKXtcblxuICAgICAgICAgIC8vY29uc29sZS5sb2coY3VycmVudFVzZXIpO1xuICAgICAgICAgIGlmKCBPYmplY3Qua2V5cyhjdXJyZW50VXNlcikubGVuZ3RoID4gMCApe1xuXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyQWRtaW4oKXtcblxuICAgICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0FkbWluJyApXG4gICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIFNldENyZWRlbnRpYWxzKGlkLCB1c2VybmFtZSwgdXNlclR5cGUpIHtcblxuICAgICAgICAgIHZhciBhdXRoZGF0YSA9IEJhc2U2NC5lbmNvZGUoaWQgKyAnOicgKyB1c2VybmFtZSArICc6JyArIHVzZXJUeXBlKTtcblxuICAgICAgICAgIGN1cnJlbnRVc2VyID0ge1xuICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgdXNlclR5cGU6IHVzZXJUeXBlLFxuICAgICAgICAgICAgICBhdXRoZGF0YTogYXV0aGRhdGFcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJGNvb2tpZVN0b3JlLnB1dCgnZ2xvYmFscycsIGN1cnJlbnRVc2VyKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gQ2xlYXJDcmVkZW50aWFscygpIHtcblxuICAgICAgICAgICRyb290U2NvcGUuZ2xvYmFscyA9IHt9O1xuICAgICAgICAgICRjb29raWVTdG9yZS5yZW1vdmUoJ2dsb2JhbHMnKTtcbiAgICAgIH1cblxuICB9XG5cbiAgLy8gQmFzZTY0IGVuY29kaW5nIHNlcnZpY2UgdXNlZCBieSBBdXRoZW50aWNhdGlvblNlcnZpY2VcbiAgdmFyIEJhc2U2NCA9IHtcblxuICAgIGtleVN0cjogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JyxcblxuICAgIGVuY29kZTogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcbiAgICAgIHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgZG8ge1xuICAgICAgICBjaHIxID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBjaHIyID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBjaHIzID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuXG4gICAgICAgIGVuYzEgPSBjaHIxID4+IDI7XG4gICAgICAgIGVuYzIgPSAoKGNocjEgJiAzKSA8PCA0KSB8IChjaHIyID4+IDQpO1xuICAgICAgICBlbmMzID0gKChjaHIyICYgMTUpIDw8IDIpIHwgKGNocjMgPj4gNik7XG4gICAgICAgIGVuYzQgPSBjaHIzICYgNjM7XG5cbiAgICAgICAgaWYgKGlzTmFOKGNocjIpKSB7XG4gICAgICAgICAgZW5jMyA9IGVuYzQgPSA2NDtcbiAgICAgICAgfSBlbHNlIGlmIChpc05hTihjaHIzKSkge1xuICAgICAgICAgIGVuYzQgPSA2NDtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dHB1dCA9IG91dHB1dCArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzEpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMikgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMzKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzQpO1xuICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSBcIlwiO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gXCJcIjtcbiAgICAgIH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG5cbiAgICBkZWNvZGU6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgICB2YXIgY2hyMSwgY2hyMiwgY2hyMyA9IFwiXCI7XG4gICAgICB2YXIgZW5jMSwgZW5jMiwgZW5jMywgZW5jNCA9IFwiXCI7XG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIC8vIHJlbW92ZSBhbGwgY2hhcmFjdGVycyB0aGF0IGFyZSBub3QgQS1aLCBhLXosIDAtOSwgKywgLywgb3IgPVxuICAgICAgdmFyIGJhc2U2NHRlc3QgPSAvW15BLVphLXowLTlcXCtcXC9cXD1dL2c7XG4gICAgICBpZiAoYmFzZTY0dGVzdC5leGVjKGlucHV0KSkge1xuICAgICAgICB3aW5kb3cuYWxlcnQoXCJUaGVyZSB3ZXJlIGludmFsaWQgYmFzZTY0IGNoYXJhY3RlcnMgaW4gdGhlIGlucHV0IHRleHQuXFxuXCIgK1xuICAgICAgICAgICAgXCJWYWxpZCBiYXNlNjQgY2hhcmFjdGVycyBhcmUgQS1aLCBhLXosIDAtOSwgJysnLCAnLycsYW5kICc9J1xcblwiICtcbiAgICAgICAgICAgIFwiRXhwZWN0IGVycm9ycyBpbiBkZWNvZGluZy5cIik7XG4gICAgICB9XG4gICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCBcIlwiKTtcblxuICAgICAgZG8ge1xuICAgICAgICBlbmMxID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzIgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jMyA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmM0ID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG5cbiAgICAgICAgY2hyMSA9IChlbmMxIDw8IDIpIHwgKGVuYzIgPj4gNCk7XG4gICAgICAgIGNocjIgPSAoKGVuYzIgJiAxNSkgPDwgNCkgfCAoZW5jMyA+PiAyKTtcbiAgICAgICAgY2hyMyA9ICgoZW5jMyAmIDMpIDw8IDYpIHwgZW5jNDtcblxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjEpO1xuXG4gICAgICAgIGlmIChlbmMzICE9IDY0KSB7XG4gICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5jNCAhPSA2NCkge1xuICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMyk7XG4gICAgICAgIH1cblxuICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSBcIlwiO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gXCJcIjtcblxuICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuICB9O1xuXG59KSgpO1xuIiwiLyoqXG4gKiBBZG1pblZvdGVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudm90ZXMuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdBZG1pblZvdGVzQ29udHJvbGxlcicsIEFkbWluVm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBBZG1pblZvdGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJywgJ1ZvdGVzJyBdO1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZUNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBZG1pblZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBDb21wYW55Vm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ0NvbXBhbnlWb3Rlc0NvbnRyb2xsZXInLCBDb21wYW55Vm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBDb21wYW55Vm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgVm90ZXMuZ2V0KCAkc2NvcGUuY3VycmVudFVzZXIuaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3RlcyA9IHZvdGVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd1ZvdGVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudm90ZXMuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdGZWxsb3dWb3Rlc0NvbnRyb2xsZXInLCBGZWxsb3dWb3Rlc0NvbnRyb2xsZXIgKTtcblxuICAgIEZlbGxvd1ZvdGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJywgJ1ZvdGVzJyBdO1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZUNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dWb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgVm90ZXMuZ2V0KCAkc2NvcGUuY3VycmVudFVzZXIuaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3RlcyA9IHZvdGVzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ1ZvdGVzQ29udHJvbGxlcicsIFZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgVm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgLy8gcmVkaXJlY3QgdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgdHlwZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdm90ZXMvYWRtaW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9mZWxsb3dcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdm90ZXMvY29tcGFueVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLnNlcnZpY2VzXG4gKi9cblxuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1ZvdGVzJywgVm90ZXMpO1xuXG4gICAgVm90ZXMuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWb3RlcygkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0IHZvdGVzXG4gICAgICAgICAqIEBkZXNjIGdldCB0aGUgdm90ZXMgZm9yIGEgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0KCB2b3Rlcl9pZCApe1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nICsgdm90ZXJfaWQgKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjYXN0IGEgdm90ZSBmb3IgYSB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGUoIHZvdGVyX2lkLCB2b3RlZV9pZCApIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdm90ZXJfaWQgKyBcIiBcIiArIHZvdGVlX2lkICk7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nLCB7XG5cbiAgICAgICAgICAgICAgICB2b3Rlcl9pZDogdm90ZXJfaWQsXG4gICAgICAgICAgICAgICAgdm90ZWVfaWQ6IHZvdGVlX2lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgICAqIEBkZXNjIGRlc3Ryb3kgYSB2b3RlIHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nICsgaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKCk7XG5cbiIsIi8qKlxuICogVGFnc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnRhZ3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudGFncy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ1RhZ3NDb250cm9sbGVyJywgVGFnc0NvbnRyb2xsZXIgKTtcblxuICAgIFRhZ3NDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyRtb2RhbCcsICdVc2VyJywgJ1RhZ3MnIF07XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFRhZ3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gVGFnc0NvbnRyb2xsZXIoICRzY29wZSwgJGxvY2F0aW9uLCAkbW9kYWwsIFVzZXIsIFRhZ3MgKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUubmV3VGFnID0gJyc7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyQWRtaW4oKSApIHtcblxuICAgICAgICAgICAgVGFncy5hbGwoKS5zdWNjZXNzKCBmdW5jdGlvbiggdGFncyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRhZ3MgPSB0YWdzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuYWRkVGFnID0gZnVuY3Rpb24oIG5ld1RhZyApe1xuXG4gICAgICAgICAgICBUYWdzLmNyZWF0ZSggbmV3VGFnICkudGhlbiggZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3VGFnID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgICRzY29wZS5uZXdUYWcgPSAnJztcbiAgICAgICAgICAgICAgICAkc2NvcGUudGFncy51bnNoaWZ0KCBuZXdUYWcgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5lZGl0VGFnID0gZnVuY3Rpb24oIHRhZyApe1xuXG4gICAgICAgICAgICAvLyBzaG93IG1vZGFsIHdpdGggdGFnXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC90YWdzL3BhcnRpYWxzL2VkaXQtdGFnLWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB0YWc6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRhZ3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEVkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAndGFnJywgJ1RhZ3MnIF07XG4gICAgZnVuY3Rpb24gRWRpdFRhZ3NNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgdGFnLCBUYWdzKSB7XG5cbiAgICAgICAgJHNjb3BlLnRhZyA9IHRhZztcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAgICAgVGFncy51cGRhdGUoICRzY29wZS50YWcgKS50aGVuKGZ1bmN0aW9uKG5ld1RhZyl7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSggbmV3VGFnICk7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgLy8gZXJyb3IgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gWyBcIlRoZXJlIHdhcyBhbiBlcnJvciB1cGRhdGluZyB0aGUgdGFnXCIgXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc1xuICogQG5hbWVzcGFjZSBhcHAudGFncy5zZXJ2aWNlc1xuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1RhZ3MnLCBUYWdzKTtcblxuICAgIFRhZ3MuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVGFnc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFRhZ3MoJGh0dHAsIENPTkZJRykge1xuXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgIGFsbDogYWxsLFxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXQgYWxsIHRhZ3NcbiAgICAgICAgICogQGRlc2MgZ2V0IGFsbCBwb3NzaWJsZSB0YWdzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGwoKXtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCggcm9vdFVybCArICcvYXBpL3YxL3RhZ3MnICk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0IGEgdGFnXG4gICAgICAgICAqIEBkZXNjIGdldCBhIHRhZyBieSB0YWdfaWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldCggdGFnX2lkICl7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJyArIHRhZ19pZCApO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXG4gICAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIHRhZyBieSBuYW1lXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGUoIG5hbWUgKSB7XG5cblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJywge1xuXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZSBhIHRhZ1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCB0YWcgKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJyArIHRhZy5pZCwgdGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgICAqIEBkZXNjIGRlc3Ryb3kgYSB2b3RlIHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyBpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcblxuIiwiLyohIDcuMy40ICovXG4hd2luZG93LlhNTEh0dHBSZXF1ZXN0fHx3aW5kb3cuRmlsZUFQSSYmRmlsZUFQSS5zaG91bGRMb2FkfHwod2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe2lmKFwiX19zZXRYSFJfXCI9PT1iKXt2YXIgZD1jKHRoaXMpO2QgaW5zdGFuY2VvZiBGdW5jdGlvbiYmZCh0aGlzKX1lbHNlIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0od2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyKSk7dmFyIG5nRmlsZVVwbG9hZD1hbmd1bGFyLm1vZHVsZShcIm5nRmlsZVVwbG9hZFwiLFtdKTtuZ0ZpbGVVcGxvYWQudmVyc2lvbj1cIjcuMy40XCIsbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRCYXNlXCIsW1wiJGh0dHBcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGQpe2Z1bmN0aW9uIGcoYSl7ai5ub3RpZnkmJmoubm90aWZ5KGEpLGsucHJvZ3Jlc3NGdW5jJiZjKGZ1bmN0aW9uKCl7ay5wcm9ncmVzc0Z1bmMoYSl9KX1mdW5jdGlvbiBoKGEpe3JldHVybiBudWxsIT1kLl9zdGFydCYmZj97bG9hZGVkOmEubG9hZGVkK2QuX3N0YXJ0LHRvdGFsOmQuX2ZpbGUuc2l6ZSx0eXBlOmEudHlwZSxjb25maWc6ZCxsZW5ndGhDb21wdXRhYmxlOiEwLHRhcmdldDphLnRhcmdldH06YX1mdW5jdGlvbiBpKCl7YShkKS50aGVuKGZ1bmN0aW9uKGEpe2QuX2NodW5rU2l6ZSYmIWQuX2ZpbmlzaGVkPyhnKHtsb2FkZWQ6ZC5fZW5kLHRvdGFsOmQuX2ZpbGUuc2l6ZSxjb25maWc6ZCx0eXBlOlwicHJvZ3Jlc3NcIn0pLGUudXBsb2FkKGQpKTooZC5fZmluaXNoZWQmJmRlbGV0ZSBkLl9maW5pc2hlZCxqLnJlc29sdmUoYSkpfSxmdW5jdGlvbihhKXtqLnJlamVjdChhKX0sZnVuY3Rpb24oYSl7ai5ub3RpZnkoYSl9KX1kLm1ldGhvZD1kLm1ldGhvZHx8XCJQT1NUXCIsZC5oZWFkZXJzPWQuaGVhZGVyc3x8e307dmFyIGo9ZC5fZGVmZXJyZWQ9ZC5fZGVmZXJyZWR8fGIuZGVmZXIoKSxrPWoucHJvbWlzZTtyZXR1cm4gZC5oZWFkZXJzLl9fc2V0WEhSXz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhKXthJiYoZC5fX1hIUj1hLGQueGhyRm4mJmQueGhyRm4oYSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsZnVuY3Rpb24oYSl7YS5jb25maWc9ZCxnKGgoYSkpfSwhMSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbihhKXthLmxlbmd0aENvbXB1dGFibGUmJihhLmNvbmZpZz1kLGcoaChhKSkpfSwhMSkpfX0sZj9kLl9jaHVua1NpemUmJmQuX2VuZCYmIWQuX2ZpbmlzaGVkPyhkLl9zdGFydD1kLl9lbmQsZC5fZW5kKz1kLl9jaHVua1NpemUsaSgpKTpkLnJlc3VtZVNpemVVcmw/YS5nZXQoZC5yZXN1bWVTaXplVXJsKS50aGVuKGZ1bmN0aW9uKGEpe2QuX3N0YXJ0PWQucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyP2QucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyKGEuZGF0YSk6cGFyc2VJbnQoKG51bGw9PWEuZGF0YS5zaXplP2EuZGF0YTphLmRhdGEuc2l6ZSkudG9TdHJpbmcoKSksZC5fY2h1bmtTaXplJiYoZC5fZW5kPWQuX3N0YXJ0K2QuX2NodW5rU2l6ZSksaSgpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6ZC5yZXN1bWVTaXplP2QucmVzdW1lU2l6ZSgpLnRoZW4oZnVuY3Rpb24oYSl7ZC5fc3RhcnQ9YSxpKCl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTppKCk6aSgpLGsuc3VjY2Vzcz1mdW5jdGlvbihhKXtyZXR1cm4gay50aGVuKGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsuZXJyb3I9ZnVuY3Rpb24oYSl7cmV0dXJuIGsudGhlbihudWxsLGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsucHJvZ3Jlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGsucHJvZ3Jlc3NGdW5jPWEsay50aGVuKG51bGwsbnVsbCxmdW5jdGlvbihiKXthKGIpfSksa30say5hYm9ydD1rLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGQuX19YSFImJmMoZnVuY3Rpb24oKXtkLl9fWEhSLmFib3J0KCl9KSxrfSxrLnhocj1mdW5jdGlvbihhKXtyZXR1cm4gZC54aHJGbj1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXtiJiZiLmFwcGx5KGssYXJndW1lbnRzKSxhLmFwcGx5KGssYXJndW1lbnRzKX19KGQueGhyRm4pLGt9LGt9dmFyIGU9dGhpcyxmPXdpbmRvdy5CbG9iJiYobmV3IEJsb2IpLnNsaWNlO3RoaXMudXBsb2FkPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYyxkLGUpe2lmKHZvaWQgMCE9PWQpaWYoYW5ndWxhci5pc0RhdGUoZCkmJihkPWQudG9JU09TdHJpbmcoKSksYW5ndWxhci5pc1N0cmluZyhkKSljLmFwcGVuZChlLGQpO2Vsc2UgaWYoXCJmb3JtXCI9PT1hLnNlbmRGaWVsZHNBcylpZihhbmd1bGFyLmlzT2JqZWN0KGQpKWZvcih2YXIgZiBpbiBkKWQuaGFzT3duUHJvcGVydHkoZikmJmIoYyxkW2ZdLGUrXCJbXCIrZitcIl1cIik7ZWxzZSBjLmFwcGVuZChlLGQpO2Vsc2UgZD1hbmd1bGFyLmlzU3RyaW5nKGQpP2Q6YW5ndWxhci50b0pzb24oZCksXCJqc29uLWJsb2JcIj09PWEuc2VuZEZpZWxkc0FzP2MuYXBwZW5kKGUsbmV3IEJsb2IoW2RdLHt0eXBlOlwiYXBwbGljYXRpb24vanNvblwifSkpOmMuYXBwZW5kKGUsZCl9ZnVuY3Rpb24gYyhhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIEJsb2J8fGEuZmxhc2hJZCYmYS5uYW1lJiZhLnNpemV9ZnVuY3Rpb24gZyhiLGQsZSl7aWYoYyhkKSl7aWYoYS5fZmlsZT1hLl9maWxlfHxkLG51bGwhPWEuX3N0YXJ0JiZmKXthLl9lbmQmJmEuX2VuZD49ZC5zaXplJiYoYS5fZmluaXNoZWQ9ITAsYS5fZW5kPWQuc2l6ZSk7dmFyIGg9ZC5zbGljZShhLl9zdGFydCxhLl9lbmR8fGQuc2l6ZSk7aC5uYW1lPWQubmFtZSxkPWgsYS5fY2h1bmtTaXplJiYoYi5hcHBlbmQoXCJjaHVua1NpemVcIixhLl9lbmQtYS5fc3RhcnQpLGIuYXBwZW5kKFwiY2h1bmtOdW1iZXJcIixNYXRoLmZsb29yKGEuX3N0YXJ0L2EuX2NodW5rU2l6ZSkpLGIuYXBwZW5kKFwidG90YWxTaXplXCIsYS5fZmlsZS5zaXplKSl9Yi5hcHBlbmQoZSxkLGQuZmlsZU5hbWV8fGQubmFtZSl9ZWxzZXtpZighYW5ndWxhci5pc09iamVjdChkKSl0aHJvd1wiRXhwZWN0ZWQgZmlsZSBvYmplY3QgaW4gVXBsb2FkLnVwbG9hZCBmaWxlIG9wdGlvbjogXCIrZC50b1N0cmluZygpO2Zvcih2YXIgaSBpbiBkKWlmKGQuaGFzT3duUHJvcGVydHkoaSkpe3ZhciBqPWkuc3BsaXQoXCIsXCIpO2pbMV0mJihkW2ldLmZpbGVOYW1lPWpbMV0ucmVwbGFjZSgvXlxccyt8XFxzKyQvZyxcIlwiKSksZyhiLGRbaV0salswXSl9fX1yZXR1cm4gYS5fY2h1bmtTaXplPWUudHJhbnNsYXRlU2NhbGFycyhhLnJlc3VtZUNodW5rU2l6ZSksYS5fY2h1bmtTaXplPWEuX2NodW5rU2l6ZT9wYXJzZUludChhLl9jaHVua1NpemUudG9TdHJpbmcoKSk6bnVsbCxhLmhlYWRlcnM9YS5oZWFkZXJzfHx7fSxhLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl09dm9pZCAwLGEudHJhbnNmb3JtUmVxdWVzdD1hLnRyYW5zZm9ybVJlcXVlc3Q/YW5ndWxhci5pc0FycmF5KGEudHJhbnNmb3JtUmVxdWVzdCk/YS50cmFuc2Zvcm1SZXF1ZXN0OlthLnRyYW5zZm9ybVJlcXVlc3RdOltdLGEudHJhbnNmb3JtUmVxdWVzdC5wdXNoKGZ1bmN0aW9uKGMpe3ZhciBkLGU9bmV3IEZvcm1EYXRhLGY9e307Zm9yKGQgaW4gYS5maWVsZHMpYS5maWVsZHMuaGFzT3duUHJvcGVydHkoZCkmJihmW2RdPWEuZmllbGRzW2RdKTtjJiYoZi5kYXRhPWMpO2ZvcihkIGluIGYpaWYoZi5oYXNPd25Qcm9wZXJ0eShkKSl7dmFyIGg9ZltkXTthLmZvcm1EYXRhQXBwZW5kZXI/YS5mb3JtRGF0YUFwcGVuZGVyKGUsZCxoKTpiKGUsaCxkKX1pZihudWxsIT1hLmZpbGUpaWYoYW5ndWxhci5pc0FycmF5KGEuZmlsZSkpZm9yKHZhciBpPTA7aTxhLmZpbGUubGVuZ3RoO2krKylnKGUsYS5maWxlW2ldLFwiZmlsZVwiKTtlbHNlIGcoZSxhLmZpbGUsXCJmaWxlXCIpO3JldHVybiBlfSksZChhKX0sdGhpcy5odHRwPWZ1bmN0aW9uKGIpe3JldHVybiBiLnRyYW5zZm9ybVJlcXVlc3Q9Yi50cmFuc2Zvcm1SZXF1ZXN0fHxmdW5jdGlvbihiKXtyZXR1cm4gd2luZG93LkFycmF5QnVmZmVyJiZiIGluc3RhbmNlb2Ygd2luZG93LkFycmF5QnVmZmVyfHxiIGluc3RhbmNlb2YgQmxvYj9iOmEuZGVmYXVsdHMudHJhbnNmb3JtUmVxdWVzdFswXS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9LGIuX2NodW5rU2l6ZT1lLnRyYW5zbGF0ZVNjYWxhcnMoYi5yZXN1bWVDaHVua1NpemUpLGIuX2NodW5rU2l6ZT1iLl9jaHVua1NpemU/cGFyc2VJbnQoYi5fY2h1bmtTaXplLnRvU3RyaW5nKCkpOm51bGwsZChiKX0sdGhpcy50cmFuc2xhdGVTY2FsYXJzPWZ1bmN0aW9uKGEpe2lmKGFuZ3VsYXIuaXNTdHJpbmcoYSkpe2lmKGEuc2VhcmNoKC9rYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWUzKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9tYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWU2KmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9nYi9pKT09PWEubGVuZ3RoLTIpcmV0dXJuIHBhcnNlRmxvYXQoMWU5KmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMikpO2lmKGEuc2VhcmNoKC9iL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvcy9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL20vaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDYwKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9oL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdCgzNjAwKmEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpfXJldHVybiBhfSx0aGlzLnNldERlZmF1bHRzPWZ1bmN0aW9uKGEpe3RoaXMuZGVmYXVsdHM9YXx8e319LHRoaXMuZGVmYXVsdHM9e30sdGhpcy52ZXJzaW9uPW5nRmlsZVVwbG9hZC52ZXJzaW9ufV0pLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGNvbXBpbGVcIixcIlVwbG9hZFJlc2l6ZVwiLGZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWQ7cmV0dXJuIGUuZ2V0QXR0cldpdGhEZWZhdWx0cz1mdW5jdGlvbihhLGIpe3JldHVybiBudWxsIT1hW2JdP2FbYl06bnVsbD09ZS5kZWZhdWx0c1tiXT9lLmRlZmF1bHRzW2JdOmUuZGVmYXVsdHNbYl0udG9TdHJpbmcoKX0sZS5hdHRyR2V0dGVyPWZ1bmN0aW9uKGIsYyxkLGUpe2lmKCFkKXJldHVybiB0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKTt0cnl7cmV0dXJuIGU/YSh0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKSkoZCxlKTphKHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpKShkKX1jYXRjaChmKXtpZihiLnNlYXJjaCgvbWlufG1heHxwYXR0ZXJuL2kpKXJldHVybiB0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKTt0aHJvdyBmfX0sZS51cGRhdGVNb2RlbD1mdW5jdGlvbihjLGQsZixnLGgsaSxqKXtmdW5jdGlvbiBrKCl7dmFyIGo9aCYmaC5sZW5ndGg/aFswXTpudWxsO2lmKGMpe3ZhciBrPSFlLmF0dHJHZXR0ZXIoXCJuZ2ZNdWx0aXBsZVwiLGQsZikmJiFlLmF0dHJHZXR0ZXIoXCJtdWx0aXBsZVwiLGQpJiYhbzthKGUuYXR0ckdldHRlcihcIm5nTW9kZWxcIixkKSkuYXNzaWduKGYsaz9qOmgpfXZhciBsPWUuYXR0ckdldHRlcihcIm5nZk1vZGVsXCIsZCk7bCYmYShsKS5hc3NpZ24oZixoKSxnJiZhKGcpKGYseyRmaWxlczpoLCRmaWxlOmosJG5ld0ZpbGVzOm0sJGR1cGxpY2F0ZUZpbGVzOm4sJGV2ZW50Oml9KSxiKGZ1bmN0aW9uKCl7fSl9ZnVuY3Rpb24gbChhLGIpe3ZhciBjPWUuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGQsZik7aWYoIWN8fCFlLmlzUmVzaXplU3VwcG9ydGVkKCkpcmV0dXJuIGIoKTtmb3IodmFyIGc9YS5sZW5ndGgsaD1mdW5jdGlvbigpe2ctLSwwPT09ZyYmYigpfSxpPWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbihjKXthLnNwbGljZShiLDEsYyksaCgpfX0saj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7aCgpLGEuJGVycm9yPVwicmVzaXplXCIsYS4kZXJyb3JQYXJhbT0oYj8oYi5tZXNzYWdlP2IubWVzc2FnZTpiKStcIjogXCI6XCJcIikrKGEmJmEubmFtZSl9fSxrPTA7azxhLmxlbmd0aDtrKyspe3ZhciBsPWFba107bC4kZXJyb3J8fDAhPT1sLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP2goKTplLnJlc2l6ZShsLGMud2lkdGgsYy5oZWlnaHQsYy5xdWFsaXR5KS50aGVuKGkoayksaihsKSl9fXZhciBtPWgsbj1bXSxvPWUuYXR0ckdldHRlcihcIm5nZktlZXBcIixkLGYpO2lmKG89PT0hMCl7aWYoIWh8fCFoLmxlbmd0aClyZXR1cm47dmFyIHA9KGMmJmMuJG1vZGVsVmFsdWV8fGQuJCRuZ2ZQcmV2RmlsZXN8fFtdKS5zbGljZSgwKSxxPSExO2lmKGUuYXR0ckdldHRlcihcIm5nZktlZXBEaXN0aW5jdFwiLGQsZik9PT0hMCl7Zm9yKHZhciByPXAubGVuZ3RoLHM9MDtzPGgubGVuZ3RoO3MrKyl7Zm9yKHZhciB0PTA7cj50O3QrKylpZihoW3NdLm5hbWU9PT1wW3RdLm5hbWUpe24ucHVzaChoW3NdKTticmVha310PT09ciYmKHAucHVzaChoW3NdKSxxPSEwKX1pZighcSlyZXR1cm47aD1wfWVsc2UgaD1wLmNvbmNhdChoKX1kLiQkbmdmUHJldkZpbGVzPWgsaj9rKCk6ZS52YWxpZGF0ZShoLGMsZCxmLGUuYXR0ckdldHRlcihcIm5nZlZhbGlkYXRlTGF0ZXJcIixkKSxmdW5jdGlvbigpe2woaCxmdW5jdGlvbigpe2IoZnVuY3Rpb24oKXtrKCl9KX0pfSl9LGV9XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlNlbGVjdFwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIiRjb21waWxlXCIsXCJVcGxvYWRcIixmdW5jdGlvbihhLGIsYyxkKXtmdW5jdGlvbiBlKGEpe3ZhciBiPWEubWF0Y2goL0FuZHJvaWRbXlxcZF0qKFxcZCspXFwuKFxcZCspLyk7aWYoYiYmYi5sZW5ndGg+Mil7dmFyIGM9ZC5kZWZhdWx0cy5hbmRyb2lkRml4TWlub3JWZXJzaW9ufHw0O3JldHVybiBwYXJzZUludChiWzFdKTw0fHxwYXJzZUludChiWzFdKT09PWMmJnBhcnNlSW50KGJbMl0pPGN9cmV0dXJuLTE9PT1hLmluZGV4T2YoXCJDaHJvbWVcIikmJi8uKldpbmRvd3MuKlNhZmFyaS4qLy50ZXN0KGEpfWZ1bmN0aW9uIGYoYSxiLGMsZCxmLGgsaSxqKXtmdW5jdGlvbiBrKCl7cmV0dXJuXCJpbnB1dFwiPT09YlswXS50YWdOYW1lLnRvTG93ZXJDYXNlKCkmJmMudHlwZSYmXCJmaWxlXCI9PT1jLnR5cGUudG9Mb3dlckNhc2UoKX1mdW5jdGlvbiBsKCl7cmV0dXJuIHQoXCJuZ2ZDaGFuZ2VcIil8fHQoXCJuZ2ZTZWxlY3RcIil9ZnVuY3Rpb24gbShiKXtmb3IodmFyIGU9Yi5fX2ZpbGVzX3x8Yi50YXJnZXQmJmIudGFyZ2V0LmZpbGVzLGY9W10sZz0wO2c8ZS5sZW5ndGg7ZysrKWYucHVzaChlW2ddKTtqLnVwZGF0ZU1vZGVsKGQsYyxhLGwoKSxmLmxlbmd0aD9mOm51bGwsYil9ZnVuY3Rpb24gbihhKXtpZihiIT09YSlmb3IodmFyIGM9MDtjPGJbMF0uYXR0cmlidXRlcy5sZW5ndGg7YysrKXt2YXIgZD1iWzBdLmF0dHJpYnV0ZXNbY107XCJ0eXBlXCIhPT1kLm5hbWUmJlwiY2xhc3NcIiE9PWQubmFtZSYmXCJpZFwiIT09ZC5uYW1lJiZcInN0eWxlXCIhPT1kLm5hbWUmJigobnVsbD09ZC52YWx1ZXx8XCJcIj09PWQudmFsdWUpJiYoXCJyZXF1aXJlZFwiPT09ZC5uYW1lJiYoZC52YWx1ZT1cInJlcXVpcmVkXCIpLFwibXVsdGlwbGVcIj09PWQubmFtZSYmKGQudmFsdWU9XCJtdWx0aXBsZVwiKSksYS5hdHRyKGQubmFtZSxkLnZhbHVlKSl9fWZ1bmN0aW9uIG8oKXtpZihrKCkpcmV0dXJuIGI7dmFyIGE9YW5ndWxhci5lbGVtZW50KCc8aW5wdXQgdHlwZT1cImZpbGVcIj4nKTtyZXR1cm4gbihhKSxhLmNzcyhcInZpc2liaWxpdHlcIixcImhpZGRlblwiKS5jc3MoXCJwb3NpdGlvblwiLFwiYWJzb2x1dGVcIikuY3NzKFwib3ZlcmZsb3dcIixcImhpZGRlblwiKS5jc3MoXCJ3aWR0aFwiLFwiMHB4XCIpLmNzcyhcImhlaWdodFwiLFwiMHB4XCIpLmNzcyhcImJvcmRlclwiLFwibm9uZVwiKS5jc3MoXCJtYXJnaW5cIixcIjBweFwiKS5jc3MoXCJwYWRkaW5nXCIsXCIwcHhcIikuYXR0cihcInRhYmluZGV4XCIsXCItMVwiKSxnLnB1c2goe2VsOmIscmVmOmF9KSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGFbMF0pLGF9ZnVuY3Rpb24gcChjKXtpZihiLmF0dHIoXCJkaXNhYmxlZFwiKXx8dChcIm5nZlNlbGVjdERpc2FibGVkXCIsYSkpcmV0dXJuITE7dmFyIGQ9cShjKTtyZXR1cm4gbnVsbCE9ZD9kOihyKGMpLGUobmF2aWdhdG9yLnVzZXJBZ2VudCk/c2V0VGltZW91dChmdW5jdGlvbigpe3dbMF0uY2xpY2soKX0sMCk6d1swXS5jbGljaygpLCExKX1mdW5jdGlvbiBxKGEpe3ZhciBiPWEuY2hhbmdlZFRvdWNoZXN8fGEub3JpZ2luYWxFdmVudCYmYS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzO2lmKFwidG91Y2hzdGFydFwiPT09YS50eXBlKXJldHVybiB2PWI/YlswXS5jbGllbnRZOjAsITA7aWYoYS5zdG9wUHJvcGFnYXRpb24oKSxhLnByZXZlbnREZWZhdWx0KCksXCJ0b3VjaGVuZFwiPT09YS50eXBlKXt2YXIgYz1iP2JbMF0uY2xpZW50WTowO2lmKE1hdGguYWJzKGMtdik+MjApcmV0dXJuITF9fWZ1bmN0aW9uIHIoYil7dy52YWwoKSYmKHcudmFsKG51bGwpLGoudXBkYXRlTW9kZWwoZCxjLGEsbCgpLG51bGwsYiwhMCkpfWZ1bmN0aW9uIHMoYSl7aWYodyYmIXcuYXR0cihcIl9fbmdmX2llMTBfRml4X1wiKSl7aWYoIXdbMF0ucGFyZW50Tm9kZSlyZXR1cm4gdm9pZCh3PW51bGwpO2EucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpLHcudW5iaW5kKFwiY2xpY2tcIik7dmFyIGI9dy5jbG9uZSgpO3JldHVybiB3LnJlcGxhY2VXaXRoKGIpLHc9Yix3LmF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIixcInRydWVcIiksdy5iaW5kKFwiY2hhbmdlXCIsbSksdy5iaW5kKFwiY2xpY2tcIixzKSx3WzBdLmNsaWNrKCksITF9dy5yZW1vdmVBdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIpfXZhciB0PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGouYXR0ckdldHRlcihhLGMsYil9LHU9W107dS5wdXNoKGEuJHdhdGNoKHQoXCJuZ2ZNdWx0aXBsZVwiKSxmdW5jdGlvbigpe3cuYXR0cihcIm11bHRpcGxlXCIsdChcIm5nZk11bHRpcGxlXCIsYSkpfSkpLHUucHVzaChhLiR3YXRjaCh0KFwibmdmQ2FwdHVyZVwiKSxmdW5jdGlvbigpe3cuYXR0cihcImNhcHR1cmVcIix0KFwibmdmQ2FwdHVyZVwiLGEpKX0pKSxjLiRvYnNlcnZlKFwiYWNjZXB0XCIsZnVuY3Rpb24oKXt3LmF0dHIoXCJhY2NlcHRcIix0KFwiYWNjZXB0XCIpKX0pLHUucHVzaChmdW5jdGlvbigpe2MuJCRvYnNlcnZlcnMmJmRlbGV0ZSBjLiQkb2JzZXJ2ZXJzLmFjY2VwdH0pO3ZhciB2PTAsdz1iO2soKXx8KHc9bygpKSx3LmJpbmQoXCJjaGFuZ2VcIixtKSxrKCk/Yi5iaW5kKFwiY2xpY2tcIixyKTpiLmJpbmQoXCJjbGljayB0b3VjaHN0YXJ0IHRvdWNoZW5kXCIscCksai5yZWdpc3RlclZhbGlkYXRvcnMoZCx3LGMsYSksLTEhPT1uYXZpZ2F0b3IuYXBwVmVyc2lvbi5pbmRleE9mKFwiTVNJRSAxMFwiKSYmdy5iaW5kKFwiY2xpY2tcIixzKSxhLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtrKCl8fHcucmVtb3ZlKCksYW5ndWxhci5mb3JFYWNoKHUsZnVuY3Rpb24oYSl7YSgpfSl9KSxoKGZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTxnLmxlbmd0aDthKyspe3ZhciBiPWdbYV07ZG9jdW1lbnQuYm9keS5jb250YWlucyhiLmVsWzBdKXx8KGcuc3BsaWNlKGEsMSksYi5yZWYucmVtb3ZlKCkpfX0pLHdpbmRvdy5GaWxlQVBJJiZ3aW5kb3cuRmlsZUFQSS5uZ2ZGaXhJRSYmd2luZG93LkZpbGVBUEkubmdmRml4SUUoYix3LG0pfXZhciBnPVtdO3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZSxnLGgsaSl7ZihlLGcsaCxpLGEsYixjLGQpfX19XSksZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVyblwiaW1nXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cImltYWdlXCI6XCJhdWRpb1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJhdWRpb1wiOlwidmlkZW9cIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1widmlkZW9cIjovLi99ZnVuY3Rpb24gYihiLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooYSl7dmFyIGc9Yi5hdHRyR2V0dGVyKFwibmdmTm9PYmplY3RVcmxcIixmLGQpO2IuZGF0YVVybChhLGcpW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2MoZnVuY3Rpb24oKXt2YXIgYj0oZz9hLmRhdGFVcmw6YS5ibG9iVXJsKXx8YS5kYXRhVXJsO2k/ZS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJ1cmwoJ1wiKyhifHxcIlwiKStcIicpXCIpOmUuYXR0cihcInNyY1wiLGIpLGI/ZS5yZW1vdmVDbGFzcyhcIm5nZi1oaWRlXCIpOmUuYWRkQ2xhc3MoXCJuZ2YtaGlkZVwiKX0pfSl9YyhmdW5jdGlvbigpe3ZhciBjPWQuJHdhdGNoKGZbZ10sZnVuY3Rpb24oYyl7dmFyIGQ9aDtyZXR1cm5cIm5nZlRodW1ibmFpbFwiIT09Z3x8ZHx8KGQ9e3dpZHRoOmVbMF0uY2xpZW50V2lkdGgsaGVpZ2h0OmVbMF0uY2xpZW50SGVpZ2h0fSksYW5ndWxhci5pc1N0cmluZyhjKT8oZS5yZW1vdmVDbGFzcyhcIm5nZi1oaWRlXCIpLGk/ZS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJ1cmwoJ1wiK2MrXCInKVwiKTplLmF0dHIoXCJzcmNcIixjKSk6dm9pZCghY3x8IWMudHlwZXx8MCE9PWMudHlwZS5zZWFyY2goYShlWzBdKSl8fGkmJjAhPT1jLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP2UuYWRkQ2xhc3MoXCJuZ2YtaGlkZVwiKTpkJiZiLmlzUmVzaXplU3VwcG9ydGVkKCk/Yi5yZXNpemUoYyxkLndpZHRoLGQuaGVpZ2h0LGQucXVhbGl0eSkudGhlbihmdW5jdGlvbihhKXtqKGEpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6aihjKSl9KTtkLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtjKCl9KX0pfW5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkRGF0YVVybFwiLFtcIlVwbG9hZEJhc2VcIixcIiR0aW1lb3V0XCIsXCIkcVwiLGZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hO3JldHVybiBkLmRhdGFVcmw9ZnVuY3Rpb24oYSxkKXtpZihkJiZudWxsIT1hLmRhdGFVcmx8fCFkJiZudWxsIT1hLmJsb2JVcmwpe3ZhciBlPWMuZGVmZXIoKTtyZXR1cm4gYihmdW5jdGlvbigpe2UucmVzb2x2ZShkP2EuZGF0YVVybDphLmJsb2JVcmwpfSksZS5wcm9taXNlfXZhciBmPWQ/YS4kbmdmRGF0YVVybFByb21pc2U6YS4kbmdmQmxvYlVybFByb21pc2U7aWYoZilyZXR1cm4gZjt2YXIgZz1jLmRlZmVyKCk7cmV0dXJuIGIoZnVuY3Rpb24oKXtpZih3aW5kb3cuRmlsZVJlYWRlciYmYSYmKCF3aW5kb3cuRmlsZUFQSXx8LTE9PT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDhcIil8fGEuc2l6ZTwyZTQpJiYoIXdpbmRvdy5GaWxlQVBJfHwtMT09PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOVwiKXx8YS5zaXplPDRlNikpe3ZhciBjPXdpbmRvdy5VUkx8fHdpbmRvdy53ZWJraXRVUkw7aWYoYyYmYy5jcmVhdGVPYmplY3RVUkwmJiFkKXt2YXIgZTt0cnl7ZT1jLmNyZWF0ZU9iamVjdFVSTChhKX1jYXRjaChmKXtyZXR1cm4gdm9pZCBiKGZ1bmN0aW9uKCl7YS5ibG9iVXJsPVwiXCIsZy5yZWplY3QoKX0pfWIoZnVuY3Rpb24oKXthLmJsb2JVcmw9ZSxlJiZnLnJlc29sdmUoZSl9KX1lbHNle3ZhciBoPW5ldyBGaWxlUmVhZGVyO2gub25sb2FkPWZ1bmN0aW9uKGMpe2IoZnVuY3Rpb24oKXthLmRhdGFVcmw9Yy50YXJnZXQucmVzdWx0LGcucmVzb2x2ZShjLnRhcmdldC5yZXN1bHQpfSl9LGgub25lcnJvcj1mdW5jdGlvbigpe2IoZnVuY3Rpb24oKXthLmRhdGFVcmw9XCJcIixnLnJlamVjdCgpfSl9LGgucmVhZEFzRGF0YVVSTChhKX19ZWxzZSBiKGZ1bmN0aW9uKCl7YVtkP1wiZGF0YVVybFwiOlwiYmxvYlVybFwiXT1cIlwiLGcucmVqZWN0KCl9KX0pLGY9ZD9hLiRuZ2ZEYXRhVXJsUHJvbWlzZT1nLnByb21pc2U6YS4kbmdmQmxvYlVybFByb21pc2U9Zy5wcm9taXNlLGZbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ZGVsZXRlIGFbZD9cIiRuZ2ZEYXRhVXJsUHJvbWlzZVwiOlwiJG5nZkJsb2JVcmxQcm9taXNlXCJdfSksZn0sZH1dKTt2YXIgYz1hbmd1bGFyLmVsZW1lbnQoXCI8c3R5bGU+Lm5nZi1oaWRle2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50fTwvc3R5bGU+XCIpO2RvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChjWzBdKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmU3JjXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXtiKGEsYyxkLGUsZixcIm5nZlNyY1wiLGEuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGYsZCksITEpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkJhY2tncm91bmRcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe2IoYSxjLGQsZSxmLFwibmdmQmFja2dyb3VuZFwiLGEuYXR0ckdldHRlcihcIm5nZlJlc2l6ZVwiLGYsZCksITApfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlRodW1ibmFpbFwiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7dmFyIGc9YS5hdHRyR2V0dGVyKFwibmdmU2l6ZVwiLGYsZCk7YihhLGMsZCxlLGYsXCJuZ2ZUaHVtYm5haWxcIixnLGEuYXR0ckdldHRlcihcIm5nZkFzQmFja2dyb3VuZFwiLGYsZCkpfX19XSl9KCksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRWYWxpZGF0ZVwiLFtcIlVwbG9hZERhdGFVcmxcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGEpe2lmKGEubGVuZ3RoPjImJlwiL1wiPT09YVswXSYmXCIvXCI9PT1hW2EubGVuZ3RoLTFdKXJldHVybiBhLnN1YnN0cmluZygxLGEubGVuZ3RoLTEpO3ZhciBiPWEuc3BsaXQoXCIsXCIpLGM9XCJcIjtpZihiLmxlbmd0aD4xKWZvcih2YXIgZT0wO2U8Yi5sZW5ndGg7ZSsrKWMrPVwiKFwiK2QoYltlXSkrXCIpXCIsZTxiLmxlbmd0aC0xJiYoYys9XCJ8XCIpO2Vsc2UgMD09PWEuaW5kZXhPZihcIi5cIikmJihhPVwiKlwiK2EpLGM9XCJeXCIrYS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJbLlxcXFxcXFxcKyo/XFxcXFtcXFxcXlxcXFxdJCgpe309ITw+fDpcXFxcLV1cIixcImdcIiksXCJcXFxcJCZcIikrXCIkXCIsYz1jLnJlcGxhY2UoL1xcXFxcXCovZyxcIi4qXCIpLnJlcGxhY2UoL1xcXFxcXD8vZyxcIi5cIik7cmV0dXJuIGN9dmFyIGU9YTtyZXR1cm4gZS5yZWdpc3RlclZhbGlkYXRvcnM9ZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZihhKXthbmd1bGFyLmZvckVhY2goYS4kbmdmVmFsaWRhdGlvbnMsZnVuY3Rpb24oYil7YS4kc2V0VmFsaWRpdHkoYi5uYW1lLGIudmFsaWQpfSl9YSYmKGEuJG5nZlZhbGlkYXRpb25zPVtdLGEuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihnKXtyZXR1cm4gZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGMsZCl8fCFhLiQkbmdmVmFsaWRhdGVkPyhlLnZhbGlkYXRlKGcsYSxjLGQsITEsZnVuY3Rpb24oKXtmKGEpLGEuJCRuZ2ZWYWxpZGF0ZWQ9ITF9KSxnJiYwPT09Zy5sZW5ndGgmJihnPW51bGwpLCFifHxudWxsIT1nJiYwIT09Zy5sZW5ndGh8fGIudmFsKCkmJmIudmFsKG51bGwpKTooZihhKSxhLiQkbmdmVmFsaWRhdGVkPSExKSxnfSkpfSxlLnZhbGlkYXRlUGF0dGVybj1mdW5jdGlvbihhLGIpe2lmKCFiKXJldHVybiEwO3ZhciBjPW5ldyBSZWdFeHAoZChiKSxcImdpXCIpO3JldHVybiBudWxsIT1hLnR5cGUmJmMudGVzdChhLnR5cGUudG9Mb3dlckNhc2UoKSl8fG51bGwhPWEubmFtZSYmYy50ZXN0KGEubmFtZS50b0xvd2VyQ2FzZSgpKX0sZS52YWxpZGF0ZT1mdW5jdGlvbihhLGIsYyxkLGYsZyl7ZnVuY3Rpb24gaChjLGQsZSl7aWYoYSl7Zm9yKHZhciBmPVwibmdmXCIrY1swXS50b1VwcGVyQ2FzZSgpK2Muc3Vic3RyKDEpLGc9YS5sZW5ndGgsaD1udWxsO2ctLTspe3ZhciBpPWFbZ10saz1qKGYseyRmaWxlOml9KTtudWxsPT1rJiYoaz1kKGooXCJuZ2ZWYWxpZGF0ZVwiKXx8e30pLGg9bnVsbD09aD8hMDpoKSxudWxsIT1rJiYoZShpLGspfHwoaS4kZXJyb3I9YyxpLiRlcnJvclBhcmFtPWssYS5zcGxpY2UoZywxKSxoPSExKSl9bnVsbCE9PWgmJmIuJG5nZlZhbGlkYXRpb25zLnB1c2goe25hbWU6Yyx2YWxpZDpofSl9fWZ1bmN0aW9uIGkoYyxkLGUsZixoKXtpZihhKXt2YXIgaT0wLGw9ITEsbT1cIm5nZlwiK2NbMF0udG9VcHBlckNhc2UoKStjLnN1YnN0cigxKTthPXZvaWQgMD09PWEubGVuZ3RoP1thXTphLGFuZ3VsYXIuZm9yRWFjaChhLGZ1bmN0aW9uKGEpe2lmKDAhPT1hLnR5cGUuc2VhcmNoKGUpKXJldHVybiEwO3ZhciBuPWoobSx7JGZpbGU6YX0pfHxkKGooXCJuZ2ZWYWxpZGF0ZVwiLHskZmlsZTphfSl8fHt9KTtuJiYoaysrLGkrKyxmKGEsbikudGhlbihmdW5jdGlvbihiKXtoKGIsbil8fChhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0sZnVuY3Rpb24oKXtqKFwibmdmVmFsaWRhdGVGb3JjZVwiLHskZmlsZTphfSkmJihhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0pW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2stLSxpLS0saXx8Yi4kbmdmVmFsaWRhdGlvbnMucHVzaCh7bmFtZTpjLHZhbGlkOiFsfSksa3x8Zy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpfSkpfSl9fWI9Ynx8e30sYi4kbmdmVmFsaWRhdGlvbnM9Yi4kbmdmVmFsaWRhdGlvbnN8fFtdLGFuZ3VsYXIuZm9yRWFjaChiLiRuZ2ZWYWxpZGF0aW9ucyxmdW5jdGlvbihhKXthLnZhbGlkPSEwfSk7dmFyIGo9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZS5hdHRyR2V0dGVyKGEsYyxkLGIpfTtpZihmKXJldHVybiB2b2lkIGcuY2FsbChiKTtpZihiLiQkbmdmVmFsaWRhdGVkPSEwLG51bGw9PWF8fDA9PT1hLmxlbmd0aClyZXR1cm4gdm9pZCBnLmNhbGwoYik7aWYoYT12b2lkIDA9PT1hLmxlbmd0aD9bYV06YS5zbGljZSgwKSxoKFwicGF0dGVyblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnBhdHRlcm59LGUudmFsaWRhdGVQYXR0ZXJuKSxoKFwibWluU2l6ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnNpemUmJmEuc2l6ZS5taW59LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2l6ZT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaChcIm1heFNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWF4fSxmdW5jdGlvbihhLGIpe3JldHVybiBhLnNpemU8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGgoXCJ2YWxpZGF0ZUZuXCIsZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj09PSEwfHxudWxsPT09Ynx8XCJcIj09PWJ9KSwhYS5sZW5ndGgpcmV0dXJuIHZvaWQgZy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpO3ZhciBrPTA7aShcIm1heEhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0PD1ifSksaShcIm1pbkhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0Pj1ifSksaShcIm1heFdpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg8PWJ9KSxpKFwibWluV2lkdGhcIixmdW5jdGlvbihhKXtyZXR1cm4gYS53aWR0aCYmYS53aWR0aC5taW59LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS53aWR0aD49Yn0pLGkoXCJyYXRpb1wiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnJhdGlvfSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWIudG9TdHJpbmcoKS5zcGxpdChcIixcIiksZD0hMSxlPTA7ZTxjLmxlbmd0aDtlKyspe3ZhciBmPWNbZV0sZz1mLnNlYXJjaCgveC9pKTtmPWc+LTE/cGFyc2VGbG9hdChmLnN1YnN0cmluZygwLGcpKS9wYXJzZUZsb2F0KGYuc3Vic3RyaW5nKGcrMSkpOnBhcnNlRmxvYXQoZiksTWF0aC5hYnMoYS53aWR0aC9hLmhlaWdodC1mKTwxZS00JiYoZD0hMCl9cmV0dXJuIGR9KSxpKFwibWF4RHVyYXRpb25cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5kdXJhdGlvbiYmYS5kdXJhdGlvbi5tYXh9LC9hdWRpb3x2aWRlby8sdGhpcy5tZWRpYUR1cmF0aW9uLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGkoXCJtaW5EdXJhdGlvblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmR1cmF0aW9uJiZhLmR1cmF0aW9uLm1pbn0sL2F1ZGlvfHZpZGVvLyx0aGlzLm1lZGlhRHVyYXRpb24sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaShcInZhbGlkYXRlQXN5bmNGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LC8uLyxmdW5jdGlvbihhLGIpe3JldHVybiBifSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PSEwfHxudWxsPT09YXx8XCJcIj09PWF9KSxrfHxnLmNhbGwoYixiLiRuZ2ZWYWxpZGF0aW9ucyl9LGUuaW1hZ2VEaW1lbnNpb25zPWZ1bmN0aW9uKGEpe2lmKGEud2lkdGgmJmEuaGVpZ2h0KXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoe3dpZHRoOmEud2lkdGgsaGVpZ2h0OmEuaGVpZ2h0fSl9KSxkLnByb21pc2V9aWYoYS4kbmdmRGltZW5zaW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRGltZW5zaW9uUHJvbWlzZTt2YXIgZj1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/dm9pZCBmLnJlamVjdChcIm5vdCBpbWFnZVwiKTp2b2lkIGUuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmNsaWVudFdpZHRoLGM9aFswXS5jbGllbnRIZWlnaHQ7aC5yZW1vdmUoKSxhLndpZHRoPWIsYS5oZWlnaHQ9YyxmLnJlc29sdmUoe3dpZHRoOmIsaGVpZ2h0OmN9KX1mdW5jdGlvbiBlKCl7aC5yZW1vdmUoKSxmLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2MoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmNsaWVudFdpZHRoP2QoKTppPjEwP2UoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudChcIjxpbWc+XCIpLmF0dHIoXCJzcmNcIixiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSkuYXBwZW5kKGgpfSxmdW5jdGlvbigpe2YucmVqZWN0KFwibG9hZCBlcnJvclwiKX0pfSksYS4kbmdmRGltZW5zaW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRGltZW5zaW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRGltZW5zaW9uUHJvbWlzZX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2V9LGUubWVkaWFEdXJhdGlvbj1mdW5jdGlvbihhKXtpZihhLmR1cmF0aW9uKXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoYS5kdXJhdGlvbil9KSxkLnByb21pc2V9aWYoYS4kbmdmRHVyYXRpb25Qcm9taXNlKXJldHVybiBhLiRuZ2ZEdXJhdGlvblByb21pc2U7dmFyIGY9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpJiYwIT09YS50eXBlLmluZGV4T2YoXCJ2aWRlb1wiKT92b2lkIGYucmVqZWN0KFwibm90IG1lZGlhXCIpOnZvaWQgZS5kYXRhVXJsKGEpLnRoZW4oZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe3ZhciBiPWhbMF0uZHVyYXRpb247YS5kdXJhdGlvbj1iLGgucmVtb3ZlKCksZi5yZXNvbHZlKGIpfWZ1bmN0aW9uIGUoKXtoLnJlbW92ZSgpLGYucmVqZWN0KFwibG9hZCBlcnJvclwiKX1mdW5jdGlvbiBnKCl7YyhmdW5jdGlvbigpe2hbMF0ucGFyZW50Tm9kZSYmKGhbMF0uZHVyYXRpb24/ZCgpOmk+MTA/ZSgpOmcoKSl9LDFlMyl9dmFyIGg9YW5ndWxhci5lbGVtZW50KDA9PT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpP1wiPGF1ZGlvPlwiOlwiPHZpZGVvPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwibm9uZVwiKS5jc3MoXCJwb3NpdGlvblwiLFwiZml4ZWRcIik7aC5vbihcImxvYWRlZG1ldGFkYXRhXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtmLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkR1cmF0aW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRHVyYXRpb25Qcm9taXNlW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhLiRuZ2ZEdXJhdGlvblByb21pc2V9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2V9LGV9XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRSZXNpemVcIixbXCJVcGxvYWRWYWxpZGF0ZVwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEsZT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1NYXRoLm1pbihjL2EsZC9iKTtyZXR1cm57d2lkdGg6YSplLGhlaWdodDpiKmV9fSxmPWZ1bmN0aW9uKGEsYyxkLGYsZyl7dmFyIGg9Yi5kZWZlcigpLGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7cmV0dXJuIGoub25sb2FkPWZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWUoai53aWR0aCxqLmhlaWdodCxjLGQpO2kud2lkdGg9YS53aWR0aCxpLmhlaWdodD1hLmhlaWdodDt2YXIgYj1pLmdldENvbnRleHQoXCIyZFwiKTtiLmRyYXdJbWFnZShqLDAsMCxhLndpZHRoLGEuaGVpZ2h0KSxoLnJlc29sdmUoaS50b0RhdGFVUkwoZ3x8XCJpbWFnZS9XZWJQXCIsZnx8MSkpfWNhdGNoKGspe2gucmVqZWN0KGspfX0sai5vbmVycm9yPWZ1bmN0aW9uKCl7aC5yZWplY3QoKX0sai5zcmM9YSxoLnByb21pc2V9LGc9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPWEuc3BsaXQoXCIsXCIpLGM9YlswXS5tYXRjaCgvOiguKj8pOy8pWzFdLGQ9YXRvYihiWzFdKSxlPWQubGVuZ3RoLGY9bmV3IFVpbnQ4QXJyYXkoZSk7ZS0tOylmW2VdPWQuY2hhckNvZGVBdChlKTtyZXR1cm4gbmV3IEJsb2IoW2ZdLHt0eXBlOmN9KX07cmV0dXJuIGQuaXNSZXNpemVTdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3JldHVybiB3aW5kb3cuYXRvYiYmYS5nZXRDb250ZXh0JiZhLmdldENvbnRleHQoXCIyZFwiKX0sZC5yZXNpemU9ZnVuY3Rpb24oYSxlLGgsaSl7dmFyIGo9Yi5kZWZlcigpO3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT8oYyhmdW5jdGlvbigpe2oucmVzb2x2ZShcIk9ubHkgaW1hZ2VzIGFyZSBhbGxvd2VkIGZvciByZXNpemluZyFcIil9KSxqLnByb21pc2UpOihkLmRhdGFVcmwoYSwhMCkudGhlbihmdW5jdGlvbihiKXtmKGIsZSxoLGksYS50eXBlKS50aGVuKGZ1bmN0aW9uKGIpe3ZhciBjPWcoYik7Yy5uYW1lPWEubmFtZSxqLnJlc29sdmUoYyl9LGZ1bmN0aW9uKCl7ai5yZWplY3QoKX0pfSxmdW5jdGlvbigpe2oucmVqZWN0KCl9KSxqLnByb21pc2UpfSxkfV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooKXtyZXR1cm4gYy5hdHRyKFwiZGlzYWJsZWRcIil8fG4oXCJuZ2ZEcm9wRGlzYWJsZWRcIixhKX1mdW5jdGlvbiBrKGEsYixjLGQpe3ZhciBlPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIsYSx7JGV2ZW50OmN9KSxmPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIpfHxcImRyYWdvdmVyXCI7aWYoYW5ndWxhci5pc1N0cmluZyhlKSlyZXR1cm4gdm9pZCBkKGUpO2lmKGUmJihlLmRlbGF5JiYocj1lLmRlbGF5KSxlLmFjY2VwdHx8ZS5yZWplY3QpKXt2YXIgZz1jLmRhdGFUcmFuc2Zlci5pdGVtcztpZihudWxsIT1nKWZvcih2YXIgaD1uKFwibmdmUGF0dGVyblwiLGEseyRldmVudDpjfSksaj0wO2o8Zy5sZW5ndGg7aisrKWlmKFwiZmlsZVwiPT09Z1tqXS5raW5kfHxcIlwiPT09Z1tqXS5raW5kKXtpZighaS52YWxpZGF0ZVBhdHRlcm4oZ1tqXSxoKSl7Zj1lLnJlamVjdDticmVha31mPWUuYWNjZXB0fX1kKGYpfWZ1bmN0aW9uIGwoYSxiLGMsZCl7ZnVuY3Rpb24gZShhLGIsYyl7aWYobnVsbCE9YilpZihiLmlzRGlyZWN0b3J5KXt2YXIgZD0oY3x8XCJcIikrYi5uYW1lO2EucHVzaCh7bmFtZTpiLm5hbWUsdHlwZTpcImRpcmVjdG9yeVwiLHBhdGg6ZH0pO3ZhciBmPWIuY3JlYXRlUmVhZGVyKCksZz1bXTtpKys7dmFyIGg9ZnVuY3Rpb24oKXtmLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGQpe3RyeXtpZihkLmxlbmd0aClnPWcuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGR8fFtdLDApKSxoKCk7ZWxzZXtmb3IodmFyIGY9MDtmPGcubGVuZ3RoO2YrKyllKGEsZ1tmXSwoYz9jOlwiXCIpK2IubmFtZStcIi9cIik7aS0tfX1jYXRjaChqKXtpLS0sY29uc29sZS5lcnJvcihqKX19LGZ1bmN0aW9uKCl7aS0tfSl9O2goKX1lbHNlIGkrKyxiLmZpbGUoZnVuY3Rpb24oYil7dHJ5e2ktLSxiLnBhdGg9KGM/YzpcIlwiKStiLm5hbWUsYS5wdXNoKGIpfWNhdGNoKGQpe2ktLSxjb25zb2xlLmVycm9yKGQpfX0sZnVuY3Rpb24oKXtpLS19KX12YXIgZj1bXSxpPTAsaj1hLmRhdGFUcmFuc2Zlci5pdGVtcztpZihqJiZqLmxlbmd0aD4wJiZcImZpbGVcIiE9PWgucHJvdG9jb2woKSlmb3IodmFyIGs9MDtrPGoubGVuZ3RoO2srKyl7aWYoaltrXS53ZWJraXRHZXRBc0VudHJ5JiZqW2tdLndlYmtpdEdldEFzRW50cnkoKSYmaltrXS53ZWJraXRHZXRBc0VudHJ5KCkuaXNEaXJlY3Rvcnkpe3ZhciBsPWpba10ud2Via2l0R2V0QXNFbnRyeSgpO2lmKGwuaXNEaXJlY3RvcnkmJiFjKWNvbnRpbnVlO251bGwhPWwmJmUoZixsKX1lbHNle3ZhciBtPWpba10uZ2V0QXNGaWxlKCk7bnVsbCE9bSYmZi5wdXNoKG0pfWlmKCFkJiZmLmxlbmd0aD4wKWJyZWFrfWVsc2V7dmFyIG49YS5kYXRhVHJhbnNmZXIuZmlsZXM7aWYobnVsbCE9bilmb3IodmFyIG89MDtvPG4ubGVuZ3RoJiYoZi5wdXNoKG4uaXRlbShvKSksZHx8IShmLmxlbmd0aD4wKSk7bysrKTt9dmFyIHA9MDshZnVuY3Rpb24gcShhKXtnKGZ1bmN0aW9uKCl7aWYoaSkxMCpwKys8MmU0JiZxKDEwKTtlbHNle2lmKCFkJiZmLmxlbmd0aD4xKXtmb3Ioaz0wO1wiZGlyZWN0b3J5XCI9PT1mW2tdLnR5cGU7KWsrKztmPVtmW2tdXX1iKGYpfX0sYXx8MCl9KCl9dmFyIG09YigpLG49ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBpLmF0dHJHZXR0ZXIoYSxkLGIsYyl9O2lmKG4oXCJkcm9wQXZhaWxhYmxlXCIpJiZnKGZ1bmN0aW9uKCl7YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0/YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0udmFsdWU9bTphW24oXCJkcm9wQXZhaWxhYmxlXCIpXT1tfSksIW0pcmV0dXJuIHZvaWQobihcIm5nZkhpZGVPbkRyb3BOb3RBdmFpbGFibGVcIixhKT09PSEwJiZjLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIikpO2kucmVnaXN0ZXJWYWxpZGF0b3JzKGUsbnVsbCxkLGEpO3ZhciBvLHA9bnVsbCxxPWYobihcIm5nZlN0b3BQcm9wYWdhdGlvblwiKSkscj0xO2NbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsZnVuY3Rpb24oYil7aWYoIWooKSl7aWYoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCksbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpPi0xKXt2YXIgZT1iLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkO2IuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q9XCJtb3ZlXCI9PT1lfHxcImxpbmtNb3ZlXCI9PT1lP1wibW92ZVwiOlwiY29weVwifWcuY2FuY2VsKHApLG98fChvPVwiQ1wiLGsoYSxkLGIsZnVuY3Rpb24oYSl7bz1hLGMuYWRkQ2xhc3Mobyl9KSl9fSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsZnVuY3Rpb24oYil7aigpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsZnVuY3Rpb24oKXtqKCl8fChwPWcoZnVuY3Rpb24oKXtvJiZjLnJlbW92ZUNsYXNzKG8pLG89bnVsbH0scnx8MSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLGZ1bmN0aW9uKGIpe2ooKXx8KGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpLG8mJmMucmVtb3ZlQ2xhc3Mobyksbz1udWxsLGwoYixmdW5jdGlvbihjKXtpLnVwZGF0ZU1vZGVsKGUsZCxhLG4oXCJuZ2ZDaGFuZ2VcIil8fG4oXCJuZ2ZEcm9wXCIpLGMsYil9LG4oXCJuZ2ZBbGxvd0RpclwiLGEpIT09ITEsbihcIm11bHRpcGxlXCIpfHxuKFwibmdmTXVsdGlwbGVcIixhKSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIixmdW5jdGlvbihiKXtpZighaigpKXt2YXIgYz1bXSxmPWIuY2xpcGJvYXJkRGF0YXx8Yi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGE7aWYoZiYmZi5pdGVtcyl7Zm9yKHZhciBnPTA7ZzxmLml0ZW1zLmxlbmd0aDtnKyspLTEhPT1mLml0ZW1zW2ddLnR5cGUuaW5kZXhPZihcImltYWdlXCIpJiZjLnB1c2goZi5pdGVtc1tnXS5nZXRBc0ZpbGUoKSk7aS51cGRhdGVNb2RlbChlLGQsYSxuKFwibmdmQ2hhbmdlXCIpfHxuKFwibmdmRHJvcFwiKSxjLGIpfX19LCExKX1mdW5jdGlvbiBiKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm5cImRyYWdnYWJsZVwiaW4gYSYmXCJvbmRyb3BcImluIGEmJiEvRWRnZVxcLzEyLi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9bmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkRyb3BcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkbG9jYXRpb25cIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGIsYyxkLGUpe3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZixnLGgsaSl7YShmLGcsaCxpLGIsYyxkLGUpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZk5vRmlsZURyb3BcIixmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhLGMpe2IoKSYmYy5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpfX0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZEcm9wQXZhaWxhYmxlXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxjLGQpe3JldHVybiBmdW5jdGlvbihlLGYsZyl7aWYoYigpKXt2YXIgaD1hKGQuYXR0ckdldHRlcihcIm5nZkRyb3BBdmFpbGFibGVcIixnKSk7YyhmdW5jdGlvbigpe2goZSksaC5hc3NpZ24mJmguYXNzaWduKGUsITApfSl9fX1dKX0oKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=