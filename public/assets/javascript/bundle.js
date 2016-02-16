/**
 * app.routes
 * @desc    contains the routes for the app
 */

 var app = angular.module('app', ['ngRoute', 'ngCookies',  'ngFileUpload', 'ui.bootstrap',
    'app.config', 'app.home', 'app.companies', 'app.fellows', 'app.profile', 'app.votes', 'app.alert' ])
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
    }

    $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'source/app/profile/partials/login-page.html',
            controller: 'LoginModalInstanceController',
            size: ''
        });

        modalInstance.result.then(function(){
            console.log("Log in complete");
            updateLoginStatus();
        });
    };


    $scope.logoutUser = function(){
        console.log("User Logout");
        User.ClearCredentials();
        $scope.isUserLoggedIn = false;
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

            console.log( fellow );

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
    //.controller('AdminProfileModalInstanceController', AdminProfileModalInstanceController);

    AdminProfileController.$inject = ['$scope', '$location', '$modal', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $location, $modal, User, Fellows, Companies) {

        // Probably can handle this in the routes or with middleware or some kind
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

        $scope.editFellow = function(fellow){

            // send user data to service

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/edit-user-form.html',
                controller: 'EditUserModalInstanceController',
                size: 'md',
                resolve: {
                    user: function(){
                        return fellow.user;
                    },
                    name: function(){
                        return fellow.first_name+" "+fellow.last_name;
                    }
                }

            });

            // show success/failure
            return false;
        };
        $scope.archiveFellow = function(user){

            console.log("Archive User: "+user.id);
            // send user data to service

            // show success/failure
            return false;
        };
        $scope.editCompany= function(company){

            // send user data to service

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/edit-user-form.html',
                controller: 'EditUserModalInstanceController',
                size: 'md',
                resolve: {
                    user: function(){
                        return company.user;
                    },
                    name: function(){
                        return company.name;
                    }
                }

            });

            // show success/failure
            return false;
        };
        $scope.archiveCompany = function(user){

            console.log("Archive User: "+user.id);
            // send user data to service

            // show success/failure
            return false;
        };

        // Admin profile tabs
        //$scope.tabs = [
        //    {
        //        title:'User List',
        //        template:'source/app/profile/partials/admin/user-list.html',
        //        action: $scope.userListLoad
        //    },
        //    {
        //        title:'New User',
        //        template:'source/app/profile/partials/admin/new-user-form.html',
        //        action: $scope.userListLoad
        //    },
        //    {
        //        title:'Votes',
        //        template:'source/app/profile/partials/admin/admin-votes.html',
        //        action: $scope.userListLoad
        //    }
        //];

        /* Create User */
        $scope.createUser = function (user) {
            var modalInstance = $modal.open({
                templateUrl: 'source/app/profile/partials/admin/new-user-form.html',
                controller: 'CreateUserModalInstanceController',
                size: 'md',
                resolve: {
                    
                }
            });
                    // remove previous highlights in case data is now correct
                    

        };
        $scope.switchType = function(user){

            console.log(user);

            if( user.userType === "Company" ){

                jQuery("optionCompany").addClass('selected');
                jQuery("optionFellow").removeClass('selected');
            }
            else if( user.userType === "Fellow" ){

                console.log("Fellow selection");

                jQuery("optionCompany").removeClass('selected');
                jQuery("optionFellow").addClass('selected');
            }

        };
        function unHighlightField(){

            jQuery("input").removeClass("error");
            jQuery("#userType").removeClass('error');
        }
        function highlightPasswordField(){

            jQuery("#password").addClass('error');
        }
        function highlightEmailField(){

            jQuery("email").addClass('error');
        }
        function highlightUserTypeField(){

            jQuery("userType").addClass('error');
        }
    }


    /**
     * Fellows Modal Instance Controller
     * @namespace app.fellows.controllers
     */

    angular
        .module('app.fellows.controllers')
        .controller('EditUserModalInstanceController', EditUserModalInstanceController)
        .controller('CreateUserModalInstanceController', CreateUserModalInstanceController);

    EditUserModalInstanceController.$inject = ['$scope', '$modalInstance', 'user', 'name', 'User', '$timeout'];

    function EditUserModalInstanceController ($scope, $modalInstance, user, name, User) {

        $scope.user = user;
        $scope.name = name;

        //console.log(fellow);

        $scope.ok = function ok() {

            User.update($scope.user);

            $modalInstance.close($scope.user);
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };


    }
//TODO user should be user service
    function CreateUserModalInstanceController ($scope, $modalInstance, User, Fellows, Companies) {

        
        //console.log(fellow);

        // $scope.ok = function ok() {

        //     User.update($scope.user);

        //     $modalInstance.close($scope.user);
        // };

        $scope.create = function (user){
                // unHighlightField();

                // if everything is good log data and close, else highlight error
                var errors = false;
                console.log("In create.");
                if(typeof(user) == "undefined"){
                    console.log("No info");
                    //highlight all
                    // highlightEmailField();
                    // highlightPasswordField();
                    // highlightUserTypeField();
                    errors = true;
                }
                else {
                    console.log("checking info.");
                    if(typeof(user.email) == "undefined"){
                        console.log("Bad email");
                        //highlight email
                        // highlightEmailField();
                        errors = true;
                    }

                    if(typeof(user.password) == "undefined"){
                        console.log("Bad password");
                        //highlight password
                        // highlightPasswordField();
                        errors = true;
                    }
                    console.log("the user type is" + user.userType);
                    if(typeof(user.userType) == "undefined"){
                        console.log("Bad type");
                        //highlight button
                        // highlightUserTypeField();
                        errors = true;
                    }
                }
                console.log("u tryna create brah?");
                if( !errors ){

                    // send user to API via Service
                    User.create(user).then(function(response) {

                        console.log(response);

                        var user_id = response.data.id;

                        if( user.userType === "Fellow" ){

                            var fellow_post = {

                                user_id: user_id
                            };
                            Fellows.create(fellow_post);
                        }
                        else if( user.userType === "Company" ){

                            var company_post = {

                                user_id: user_id
                            };
                            Companies.create(company_post);
                        }


                    });
                }
            

            $modalInstance.close();
        

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

    FellowsProfileController.$inject = ['$scope', '$location', 'Fellows', 'Tags', 'User', 'Alert' ];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, Fellows, Tags, User, Alert ) {

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

        $scope.update = function(fellow, file) {

            var tags = [];
            $('#tags :selected').each(function(i, selected){

                tags[i] = $(selected).val();
            });
            fellow.tags = tags;

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
              console.log("Like a boss");
              $location.path("/profile/admin");
          }
          else if (currentUser.userType === 'Fellow') {
              console.log("Like a fella");
              $location.path("/profile/fellow");
          }
          else if (currentUser.userType === 'Company') {
              console.log("Like a company");
              $location.path("/profile/company");
          }
      }
      else{

           $location.path("/");
      }

  }


})();

/**
 * Fellows
 * @namespace app.services
 */
(function () {
    'use strict';

    angular
        .module('app.profile.services')
        .service('Tags', Tags);

    Tags.$inject = ['$http', 'CONFIG'];

    /**
     * @namespace Tags
     * @returns {Service}
     */
    function Tags($http, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {
            all: all,
            get: get,
            //create: create,
            //update: update,
            //destroy: destroy
        };

        ////////////////////

        /**
         * @name all
         * @desc get all the fellows
         */
        function all() {

            return $http.get(rootUrl + '/api/v1/tags');
        }

        /**
         * @name get
         * @desc get one fellow
         * @desc get one fellow
         */
        function get(id) {

            return $http.get(rootUrl + '/api/v1/tags/' + id);

        }

        /**
         * @name create
         * @desc creeate a new fellow record
         */
        //function create(fellow) {
        //    return $http.post(rootUrl + '/api/v1/fellows/', fellow);
        //}

        /**
         * @name update
         * @desc updates a fellow record
         */
        //function update(fellow, id) {
        //    return $http.put(rootUrl + '/api/v1/fellows/' + id, fellow);
        //}

        /**
         * @name destroy
         * @desc destroy a fellow record
         */
        //function destroy(id) {
        //    return $http.delete(rootUrl + '/api/v1/fellows/' + id);
        //}
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
          isUserLoggedIn: isUserLoggedIn
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
            console.log(user);

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
          else{

              return false;
          }
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

// @TODO -- Is this being used somewhere?

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImFsZXJ0cy9hbGVydC5tb2R1bGUuanMiLCJjb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImZlbGxvd3MvZmVsbG93cy5tb2R1bGUuanMiLCJob21lL2hvbWUubW9kdWxlLmpzIiwicHJvZmlsZS9wcm9maWxlLm1vZHVsZS5qcyIsInZvdGVzL3ZvdGVzLm1vZHVsZS5qcyIsImFsZXJ0cy9jb250cm9sbGVyL2FsZXJ0LmNvbnRyb2xsZXIuanMiLCJhbGVydHMvc2VydmljZXMvYWxlcnQuc2VydmljZS5qcyIsImNvbXBhbmllcy9jb250cm9sbGVycy9jb21wYW5pZXMuY29udHJvbGxlci5qcyIsImNvbXBhbmllcy9jb250cm9sbGVycy9jb21wYW55LmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvZGlyZWN0aXZlcy9jb21wYW55Q2FyZC5kaXJlY3RpdmUuanMiLCJjb21wYW5pZXMvc2VydmljZXMvY29tcGFuaWVzLnNlcnZpY2UuanMiLCJmZWxsb3dzL2NvbnRyb2xsZXJzL2ZlbGxvdy5jb250cm9sbGVyLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3dzLmNvbnRyb2xsZXIuanMiLCJmZWxsb3dzL2RpcmVjdGl2ZXMvZmVsbG93Q2FyZC5kaXJlY3RpdmUuanMiLCJmZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsImhvbWUvY29udHJvbGxlcnMvaG9tZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9hZG1pblByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvY29tcGFueVByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvZmVsbG93c1Byb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvcHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9zZXJ2aWNlcy90YWdzLnNlcnZpY2UuanMiLCJwcm9maWxlL3NlcnZpY2VzL3VzZXIuc2VydmljZS5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2FkbWluVm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2NvbXBhbnlWb3Rlcy5jb250cm9sbGVyLmpzIiwidm90ZXMvY29udHJvbGxlcnMvZmVsbG93Vm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL3ZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9zZXJ2aWNlcy92b3Rlcy5zZXJ2aWNlLmpzIiwibmctZmlsZS11cGxvYWQubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBhcHAucm91dGVzXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXG4gKi9cblxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nQ29va2llcycsICAnbmdGaWxlVXBsb2FkJywgJ3VpLmJvb3RzdHJhcCcsXG4gICAgJ2FwcC5jb25maWcnLCAnYXBwLmhvbWUnLCAnYXBwLmNvbXBhbmllcycsICdhcHAuZmVsbG93cycsICdhcHAucHJvZmlsZScsICdhcHAudm90ZXMnLCAnYXBwLmFsZXJ0JyBdKVxuICAgIC5ydW4ocnVuKTtcblxuLyoqXG4gKiAgICogQG5hbWUgY29uZmlnXG4gKiAgICAgKiBAZGVzYyBEZWZpbmUgdmFsaWQgYXBwbGljYXRpb24gcm91dGVzXG4gKiAgICAgICAqL1xuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcblxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgLndoZW4oJy8nLCB7XG4gICAgICAgIGNvbnRyb2xsZXIgIDogJ0hvbWVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmwgOiAnc291cmNlL2FwcC9ob21lL2hvbWUuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvZmVsbG93cycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvZmVsbG93cy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9mZWxsb3dzLzpmZWxsb3dfaWQvOmZlbGxvd19uYW1lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvdy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9jb21wYW5pZXMnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW5pZXMuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvY29tcGFuaWVzLzpjb21wYW55X2lkLzpjb21wYW55X25hbWUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFueS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3Byb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2FkbWluJywge1xuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLXByb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2ZlbGxvdy1wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9jb21wYW55Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvY29tcGFueS1wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCAnL3ZvdGVzJywge1xuICAgICAgICBjb250cm9sbGVyOiAnVm90ZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3ZvdGVzL3BhcnRpYWxzL3ZvdGVzLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCAnL3ZvdGVzL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd1ZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy9mZWxsb3ctdm90ZXMuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oICcvdm90ZXMvY29tcGFueScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvY29tcGFueS12b3Rlcy5odG1sJ1xuICAgIH0pXG5cbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1JvdXRpbmdDb250cm9sbGVyJywgUm91dGluZ0NvbnRyb2xsZXIpXG4uY29udHJvbGxlcignTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG5Sb3V0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJyR3aW5kb3cnLCAnVXNlcicsICckbG9jYXRpb24nLCAnJGFuY2hvclNjcm9sbCddO1xuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHdpbmRvdycsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJ107XG5cbmZ1bmN0aW9uIFJvdXRpbmdDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCAkd2luZG93LCBVc2VyLCAkbG9jYXRpb24sICRhbmNob3JTY3JvbGwpIHtcblxuICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IGZhbHNlO1xuICAgIHVwZGF0ZUxvZ2luU3RhdHVzKCk7XG5cbiAgICAkc2NvcGUuc2Nyb2xsVG8gPSBmdW5jdGlvbihpZCl7XG5cbiAgICAgICAgJGxvY2F0aW9uLmhhc2goaWQpO1xuICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxvZ2luU3RhdHVzKCl7XG5cbiAgICAgICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gVXNlci5pc1VzZXJMb2dnZWRJbigpO1xuICAgIH1cblxuICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9sb2dpbi1wYWdlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgc2l6ZTogJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2cgaW4gY29tcGxldGVcIik7XG4gICAgICAgICAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUubG9nb3V0VXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBMb2dvdXRcIik7XG4gICAgICAgIFVzZXIuQ2xlYXJDcmVkZW50aWFscygpO1xuICAgICAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICR3aW5kb3csICRtb2RhbEluc3RhbmNlLCBVc2VyKSB7XG5cbiAgICAvLyBzYXZlIHRoaXMgdGhyb3VnaCBhIHJlZmVzaFxuICAgICRzY29wZS5sb2dpbkZvcm0gPSB7XG5cbiAgICAgICAgZW1haWw6IFwiXCIsXG4gICAgICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgICAgICBlcnJvcnM6IFtdXG4gICAgfTtcblxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKGxvZ2luRm9ybSkge1xuXG4gICAgICAgICRzY29wZS5sb2dpbkZvcm0uZXJyb3JzID0gW107XG5cbiAgICAgICAgVXNlci5sb2dpbihsb2dpbkZvcm0pLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAgICAgICAgIC8vVXNlci5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgICAgIFVzZXIuU2V0Q3JlZGVudGlhbHModXNlci5pZCwgdXNlci5lbWFpbCwgdXNlci51c2VyVHlwZSk7XG5cbiAgICAgICAgICAgIC8vJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgICAgICB9KS5lcnJvciggZnVuY3Rpb24oZXJyb3Ipe1xuXG4gICAgICAgICAgICAkc2NvcGUubG9naW5Gb3JtLmVycm9ycy5wdXNoKFwiSW52YWxpZCB1c2VyIGNyZWRlbnRpYWxzXCIpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIH07XG59XG5cblxucnVuLiRpbmplY3QgPSBbJyRjb29raWVTdG9yZScsICdVc2VyJ107XG5mdW5jdGlvbiBydW4oJGNvb2tpZVN0b3JlLCBVc2VyKXtcblxuICAgIC8vIGtlZXAgdXNlciBsb2dnZWQgaW4gYWZ0ZXIgcGFnZSByZWZyZXNoXG4gICAgdmFyIGN1cnJlbnRVc2VyID0gJGNvb2tpZVN0b3JlLmdldCgnZ2xvYmFscycpIHx8IHt9O1xuICAgIFVzZXIuc2V0Q3VycmVudFVzZXIoY3VycmVudFVzZXIpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XG4gICAgLy9pZiAoJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyKSB7XG4gICAgLy8gICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9ICdCYXNpYyAnICsgJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyLmF1dGhkYXRhOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAvL31cblxuICAgIC8vJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XG4gICAgLy8gICAgLy8gcmVkaXJlY3QgdG8gbG9naW4gcGFnZSBpZiBub3QgbG9nZ2VkIGluIGFuZCB0cnlpbmcgdG8gYWNjZXNzIGEgcmVzdHJpY3RlZCBwYWdlXG4gICAgLy8gICAgdmFyIHJlc3RyaWN0ZWRQYWdlID0gJC5pbkFycmF5KCRsb2NhdGlvbi5wYXRoKCksIFsnL2xvZ2luJywgJy9yZWdpc3RlciddKSA9PT0gLTE7XG4gICAgLy8gICAgdmFyIGxvZ2dlZEluID0gJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyO1xuICAgIC8vICAgIGlmIChyZXN0cmljdGVkUGFnZSAmJiAhbG9nZ2VkSW4pIHtcbiAgICAvLyAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgIC8vICAgIH1cbiAgICAvL30pO1xufVxuXG5cbi8qKlxuICogSGVscGVyIEZ1bmN0aW9uc1xuICoqL1xuXG52YXIgSEZIZWxwZXJzID0gSEZIZWxwZXJzIHx8IHt9O1xuXG5IRkhlbHBlcnMuaGVscGVycyA9IHtcblxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJykgICAgICAgICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggLVxuICAgICAgICAgICAgLnJlcGxhY2UoL1teXFx3XFwtXSsvZywgJycpICAgICAgIC8vIFJlbW92ZSBhbGwgbm9uLXdvcmQgY2hhcnNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC1cXC0rL2csICctJykgICAgICAgICAvLyBSZXBsYWNlIG11bHRpcGxlIC0gd2l0aCBzaW5nbGUgLVxuICAgICAgICAgICAgLnJlcGxhY2UoL14tKy8sICcnKSAgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XG4gICAgICAgICAgICAucmVwbGFjZSgvLSskLywgJycpOyAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIGVuZCBvZiB0ZXh0XG4gICAgfVxufTsiLCIvKipcbiAqIEEgcGxhY2UgdG8gcHV0IGFwcCB3aWRlIGNvbmZpZyBzdHVmZlxuICpcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSlcbiAgICAuY29uc3RhbnQoJ0NPTkZJRycsIHtcbiAgICAgICAgJ0FQUF9OQU1FJzogJ0hhY2tlciBGZWxsb3cgUG9ydGFsJyxcbiAgICAgICAgJ0FQUF9WRVJTSU9OJzogJzEuMCcsXG4gICAgICAgICdTRVJWSUNFX1VSTCc6ICcnXG4gICAgfSk7XG5cblxuLy92YXIgcm9vdFVybCA9ICdodHRwczovL3F1aWV0LWNvdmUtNjgzMC5oZXJva3VhcHAuY29tJztcbi8vIHZhciByb290VXJsID0gXCJodHRwczovL2JvaWxpbmctc3ByaW5ncy03NTIzLmhlcm9rdWFwcC5jb21cIjsiLCIvKipcbiAqIGFsZXJ0IG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQnLCBbXG4gICAgICAgICAgICAnYXBwLmFsZXJ0LmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAuYWxlcnQuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5jb250cm9sbGVycycsIFtdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuc2VydmljZXMnLCBbXSk7XG5cblxufSkoKTtcbiIsIi8qKlxuICogY29tcGFuaWVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcycsIFtcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJywgW10pO1xuXG4gIC8vIGRlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIGZlbGxvd3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cycsIFtcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcblxuXG59KSgpO1xuIiwiLyoqXG4gKiBob21lIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUnLCBbXG4gICAgICAgICdhcHAuaG9tZS5jb250cm9sbGVycycsXG4gICAgICAgIC8vJ2FwcC5ob21lLnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuZGlyZWN0aXZlcycsIFtdKTtcbiAgICAvL2hvdyBhYm91dCB0aGlzXG59KSgpO1xuIiwiLyoqXG4gKiBwcm9maWxlIG1vZHVsZVxuICovXG5cbiAoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnXG4gICAgICAgICAgICBdKTtcblxuICAgICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICAgYW5ndWxhclxuICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIHZvdGVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzJywgW1xuXG4gICAgICAgICAgICAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAudm90ZXMuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycsIFtdKTtcblxuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5jb250cm9sbGVycycsIFtdKTtcblxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEFsZXJ0Q29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FsZXJ0Q29udHJvbGxlcicsIEFsZXJ0Q29udHJvbGxlcik7XG5cbiAgICBBbGVydENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQWxlcnRDb250cm9sbGVyKCAkc2NvcGUsIEFsZXJ0ICkge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgZmVsbG93cyBjb250cm9sbGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmFsZXJ0ID0gQWxlcnQuYWxlcnQ7XG5cbiAgICAgICAgLy8gQ2xvc2UgYWxlcnQgd2luZG93XG4gICAgICAgICRzY29wZS5jbG9zZUFsZXJ0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgQWxlcnQuY2xvc2VBbGVydCgpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBBbGVydFxuICogQG5hbWVzcGFjZSBhcHAuYWxlcnQuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdBbGVydCcsIEFsZXJ0KTtcblxuICAgIEFsZXJ0LiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG5cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBBbGVydFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEFsZXJ0KCAkdGltZW91dCApIHtcblxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGVydDoge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcbiAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3dBbGVydDogZnVuY3Rpb24obmV3TWVzc2FnZSwgbmV3VHlwZSkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5tZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnR5cGUgPSBuZXdUeXBlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQuc2hvdyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHRoaW5rIHRoaXMgaXMgb2s/XG4gICAgICAgICAgICAgICAgLy8gRm9yIHNvbWUgcmVhc29uIEkgd2FudGVkIHRoZSBhbGVydCB0byBhdXRvIGNsZWFyIGFuZCBjb3VsZG4ndCBmaWd1cmUgYVxuICAgICAgICAgICAgICAgIC8vIGJldHRlciB3YXkgdG8gaGF2ZSBhIHRpbWVvdXQgYXV0b21hdGljYWxseSBjbG9zZSB0aGUgYWxlcnQuIEkgZmVlbCBsaWtlXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBzb21lIHNvcnQgb2Ygc2NvcGluZyB3ZWlyZG5lc3MgZ29pbmcgb24gaGVyZSwgYnV0IGl0IHdvcmtzIGFuZCBJXG4gICAgICAgICAgICAgICAgLy8gYW0gdGlyZWQsIHNvIGl0IGlzIGdldHRpbmcgY29tbWl0dGVkIDstcFxuICAgICAgICAgICAgICAgIHZhciBhbGVydCA9IHRoaXMuYWxlcnQ7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoIGZ1bmN0aW9uKCl7IGFsZXJ0LnNob3cgPSBmYWxzZTsgfSwgIDUwMDAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZUFsZXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQudHlwZSA9ICdpbmZvJztcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbmllc0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIENvbXBhbmllcykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBDb21wYW5pZXMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYW5pZXMgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG4gICAgICAgICdjb21wYW55JywgJ1ZvdGVzJywgJ1VzZXInXTtcblxuICAgIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgQ29tcGFueUNvbnRyb2xsZXIpO1xuXG4gICAgQ29tcGFueUNvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnQ29tcGFuaWVzJywgJ1VzZXInLCAnVm90ZXMnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlDb250cm9sbGVyKCAkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIENvbXBhbmllcywgVXNlciwgVm90ZXMsIEFsZXJ0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gW107XG4gICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSBbXTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgIENvbXBhbmllcy5nZXQoICRyb3V0ZVBhcmFtcy5jb21wYW55X2lkICkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFueSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIFVzZXIuZ2V0Vm90ZXMoIGNvbXBhbnkudXNlcl9pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gdm90ZXMudm90ZXNGb3I7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IHZvdGVzLnZvdGVzQ2FzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCAkc2NvcGUudm90ZXNGb3IubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHNjb3BlLnZvdGVzRm9yW2ldO1xuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50LmlkID09ICRzY29wZS5jdXJyZW50VXNlci5pZCApIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0ZlbGxvdyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAoICRzY29wZS5jdXJyZW50VXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGNvbXBhbnkpIHtcblxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmlzRmVsbG93KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVm90ZXMuY3JlYXRlKCRzY29wZS5jdXJyZW50VXNlci5pZCwgY29tcGFueS51c2VyX2lkKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodm90ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b3RlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoIGVyci5kYXRhLCBcImluZm9cIiApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgY29tcGFueUNhcmQpO1xuXG5cbiAgICBmdW5jdGlvbiBjb21wYW55Q2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4qIENvbXBhbmllc1xuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xuXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XG5cbiAgLyoqXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNcbiAgKi9cbiAgZnVuY3Rpb24gQ29tcGFuaWVzKCRodHRwLCBVcGxvYWQsIENPTkZJRykge1xuXG4gICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsOiBhbGwsXG4gICAgICBhbGxXaXRoVXNlcjogYWxsV2l0aFVzZXIsXG4gICAgICBnZXQ6IGdldCxcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGwoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWxsXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGxXaXRoVXNlcigpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VycycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGdldFxuICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIHBhcnNlSW50KGlkKSApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogQG5hbWUgZ2V0QnlVc2VySWRcbiAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55IGJ5IHVzZXIgaWRcbiAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VyX2lkLycgKyBwYXJzZUludCh1c2VyX2lkKSApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY3JlYXRlXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb21wYW55KSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb21wYW55KSB7XG5cbiAgICAgIC8vcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgLy8gIHVybDogcm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCxcbiAgICAgIC8vICBmaWVsZHM6IGNvbXBhbnksXG4gICAgICAvLyAgZmlsZTogY29tcGFueS5maWxlLFxuICAgICAgLy8gIG1ldGhvZDogJ1BVVCdcbiAgICAgIC8vXG4gICAgICAvL30pO1xuXG4gICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGNvbXBhbnkuaWQsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgY29tcGFueSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkKTtcbiAgICB9XG4gIH1cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dDb250cm9sbGVyJywgRmVsbG93Q29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnRmVsbG93cycsICdVc2VyJywgJ1ZvdGVzJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93Q29udHJvbGxlcigkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIEZlbGxvd3MsIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSBbXTtcbiAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IFtdO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgRmVsbG93cy5nZXQoICRyb3V0ZVBhcmFtcy5mZWxsb3dfaWQgKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3cpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAgICAgVXNlci5nZXRWb3RlcyggZmVsbG93LnVzZXJfaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0ZvciA9IHZvdGVzLnZvdGVzRm9yO1xuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSB2b3Rlcy52b3Rlc0Nhc3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyVm90ZWQgPSBmdW5jdGlvbiBjdXJyZW50VXNlclZvdGVkKCl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgJHNjb3BlLnZvdGVzRm9yLmxlbmd0aDsgaSsrICl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICRzY29wZS52b3Rlc0ZvcltpXTtcbiAgICAgICAgICAgICAgICBpZiggZWxlbWVudC5pZCA9PSAkc2NvcGUuY3VycmVudFVzZXIuaWQgKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuaXNDb21wYW55ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgcmV0dXJuICggJHNjb3BlLmN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSBcIkNvbXBhbnlcIiApO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS52b3RlID0gZnVuY3Rpb24gdm90ZShmZWxsb3cpIHtcblxuICAgICAgICAgICAgaWYgKCAkc2NvcGUuaXNDb21wYW55KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBWb3Rlcy5jcmVhdGUoJHNjb3BlLmN1cnJlbnRVc2VyLmlkLCBmZWxsb3cudXNlcl9pZClcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHZvdGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHZvdGUgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvdGU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiK2Vycik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dzQ29udHJvbGxlcicsIEZlbGxvd3NDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnRmVsbG93cyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBGZWxsb3dzKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIEZlbGxvd3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93cykge1xuXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoZmVsbG93KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvcGFydGlhbHMvZmVsbG93X2RldGFpbF92aWV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZlbGxvd3MgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdycsXG4gICAgICAgICdWb3RlcycsICdVc2VyJywgJyR0aW1lb3V0J107XG5cbiAgICBmdW5jdGlvbiBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93LCBWb3RlcywgVXNlcikge1xuXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhmZWxsb3cpO1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLmZlbGxvdyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2ZlbGxvd0NhcmQnLCBmZWxsb3dDYXJkKTtcblxuICAvL25nLWZlbGxvdy1jYXJkXG4gZnVuY3Rpb24gZmVsbG93Q2FyZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICBzY29wZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfY2FyZC5odG1sJy8qLFxuICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIH0pO1xuICAgICAgIH0gKi9cbiAgICB9O1xuICB9XG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dzXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdGZWxsb3dzJywgRmVsbG93cyk7XG5cbiAgICBGZWxsb3dzLiRpbmplY3QgPSBbJyRodHRwJywgJ1VwbG9hZCcsICdDT05GSUcnXTtcblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzXG4gICAgICogQHJldHVybnMge1NlcnZpY2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBhbGxXaXRoVXNlcjogYWxsV2l0aFVzZXIsXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGFsbFxuICAgICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbFdpdGhVc2VyKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzL3VzZXJzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0XG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldEJ5VXNlcklkXG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93IGJ5IHVzZXJfaWRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VyX2lkLycgKyB1c2VyX2lkKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShmZWxsb3cpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycsIGZlbGxvdyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZmVsbG93KSB7XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICAgICAgLy8gICAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLFxuICAgICAgICAgICAgLy8gICAgZmllbGRzOiBmZWxsb3csXG4gICAgICAgICAgICAvLyAgICBmaWxlOiBmZWxsb3cuZmlsZSxcbiAgICAgICAgICAgIC8vICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL30pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggZmVsbG93ICk7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGZlbGxvdy5pZCwgZmVsbG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuKiBIb21lQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5ob21lLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xuXG4gIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdGZWxsb3dzJ107XG5cbiAgLyoqXG4gICogQG5hbWVzcGFjZSBIb21lQ29udHJvbGxlclxuICAqL1xuICBmdW5jdGlvbiBIb21lQ29udHJvbGxlcigkc2NvcGUsIEZlbGxvd3MpIHtcblxuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICBGZWxsb3dzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24oZmVsbG93cyl7XG5cbiAgICAgICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcbiAgICB9KTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBob21lIGNvbnRyb2xsZXIhJyk7XG4gICAgICAvL0hvbWUuYWxsKCk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwiLyoqXG4qIEFkbWluUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlQ29udHJvbGxlcik7XG4gICAgLy8uY29udHJvbGxlcignQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cbiAgICBBZG1pblByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJG1vZGFsJywgJ1VzZXInLCAnRmVsbG93cycsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuICAgICAqL1xuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCAkbW9kYWwsIFVzZXIsIEZlbGxvd3MsIENvbXBhbmllcykge1xuXG4gICAgICAgIC8vIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiB0aGUgcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvciBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYW4gQWRtaW5cbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiQWRtaW5cIiApe1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBbXTtcbiAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IFtdO1xuICAgICAgICAkc2NvcGUudXNlckxpc3RMb2FkID0gZnVuY3Rpb24oKSB7XG5cblxuICAgICAgICAgICAgaWYoICRzY29wZS5mZWxsb3dzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIEZlbGxvd3MuYWxsV2l0aFVzZXIoKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3dzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIENvbXBhbmllcy5hbGxXaXRoVXNlcigpLnN1Y2Nlc3MoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnVzZXJMaXN0TG9hZCgpO1xuXG4gICAgICAgICRzY29wZS5lZGl0RmVsbG93ID0gZnVuY3Rpb24oZmVsbG93KXtcblxuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2VkaXQtdXNlci1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0VXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3cudXNlcjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3cuZmlyc3RfbmFtZStcIiBcIitmZWxsb3cubGFzdF9uYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmFyY2hpdmVGZWxsb3cgPSBmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBcmNoaXZlIFVzZXI6IFwiK3VzZXIuaWQpO1xuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuZWRpdENvbXBhbnk9IGZ1bmN0aW9uKGNvbXBhbnkpe1xuXG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZWRpdC11c2VyLWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB1c2VyOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnkudXNlcjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wYW55Lm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuYXJjaGl2ZUNvbXBhbnkgPSBmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBcmNoaXZlIFVzZXI6IFwiK3VzZXIuaWQpO1xuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFkbWluIHByb2ZpbGUgdGFic1xuICAgICAgICAvLyRzY29wZS50YWJzID0gW1xuICAgICAgICAvLyAgICB7XG4gICAgICAgIC8vICAgICAgICB0aXRsZTonVXNlciBMaXN0JyxcbiAgICAgICAgLy8gICAgICAgIHRlbXBsYXRlOidzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vdXNlci1saXN0Lmh0bWwnLFxuICAgICAgICAvLyAgICAgICAgYWN0aW9uOiAkc2NvcGUudXNlckxpc3RMb2FkXG4gICAgICAgIC8vICAgIH0sXG4gICAgICAgIC8vICAgIHtcbiAgICAgICAgLy8gICAgICAgIHRpdGxlOidOZXcgVXNlcicsXG4gICAgICAgIC8vICAgICAgICB0ZW1wbGF0ZTonc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL25ldy11c2VyLWZvcm0uaHRtbCcsXG4gICAgICAgIC8vICAgICAgICBhY3Rpb246ICRzY29wZS51c2VyTGlzdExvYWRcbiAgICAgICAgLy8gICAgfSxcbiAgICAgICAgLy8gICAge1xuICAgICAgICAvLyAgICAgICAgdGl0bGU6J1ZvdGVzJyxcbiAgICAgICAgLy8gICAgICAgIHRlbXBsYXRlOidzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vYWRtaW4tdm90ZXMuaHRtbCcsXG4gICAgICAgIC8vICAgICAgICBhY3Rpb246ICRzY29wZS51c2VyTGlzdExvYWRcbiAgICAgICAgLy8gICAgfVxuICAgICAgICAvL107XG5cbiAgICAgICAgLyogQ3JlYXRlIFVzZXIgKi9cbiAgICAgICAgJHNjb3BlLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vbmV3LXVzZXItZm9ybS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBwcmV2aW91cyBoaWdobGlnaHRzIGluIGNhc2UgZGF0YSBpcyBub3cgY29ycmVjdFxuICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUuc3dpdGNoVHlwZSA9IGZ1bmN0aW9uKHVzZXIpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcblxuICAgICAgICAgICAgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25Db21wYW55XCIpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkZlbGxvd1wiKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiRmVsbG93XCIgKXtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmVsbG93IHNlbGVjdGlvblwiKTtcblxuICAgICAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkNvbXBhbnlcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KFwib3B0aW9uRmVsbG93XCIpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIHVuSGlnaGxpZ2h0RmllbGQoKXtcblxuICAgICAgICAgICAgalF1ZXJ5KFwiaW5wdXRcIikucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIGpRdWVyeShcIiN1c2VyVHlwZVwiKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcIiNwYXNzd29yZFwiKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRFbWFpbEZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcImVtYWlsXCIpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGhpZ2hsaWdodFVzZXJUeXBlRmllbGQoKXtcblxuICAgICAgICAgICAgalF1ZXJ5KFwidXNlclR5cGVcIikuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEZlbGxvd3MgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdFVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEVkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgRWRpdFVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAndXNlcicsICduYW1lJywgJ1VzZXInLCAnJHRpbWVvdXQnXTtcblxuICAgIGZ1bmN0aW9uIEVkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIHVzZXIsIG5hbWUsIFVzZXIpIHtcblxuICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICRzY29wZS5uYW1lID0gbmFtZTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGZlbGxvdyk7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgIFVzZXIudXBkYXRlKCRzY29wZS51c2VyKTtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLnVzZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcblxuXG4gICAgfVxuLy9UT0RPIHVzZXIgc2hvdWxkIGJlIHVzZXIgc2VydmljZVxuICAgIGZ1bmN0aW9uIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgXG4gICAgICAgIC8vY29uc29sZS5sb2coZmVsbG93KTtcblxuICAgICAgICAvLyAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAvLyAgICAgVXNlci51cGRhdGUoJHNjb3BlLnVzZXIpO1xuXG4gICAgICAgIC8vICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUudXNlcik7XG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uICh1c2VyKXtcbiAgICAgICAgICAgICAgICAvLyB1bkhpZ2hsaWdodEZpZWxkKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBldmVyeXRoaW5nIGlzIGdvb2QgbG9nIGRhdGEgYW5kIGNsb3NlLCBlbHNlIGhpZ2hsaWdodCBlcnJvclxuICAgICAgICAgICAgICAgIHZhciBlcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluIGNyZWF0ZS5cIik7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGluZm9cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vaGlnaGxpZ2h0IGFsbFxuICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHRFbWFpbEZpZWxkKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodFBhc3N3b3JkRmllbGQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVja2luZyBpbmZvLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIuZW1haWwpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYWQgZW1haWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBlbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0RW1haWxGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZih1c2VyLnBhc3N3b3JkKSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFkIHBhc3N3b3JkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9oaWdobGlnaHQgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodFBhc3N3b3JkRmllbGQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGUgdXNlciB0eXBlIGlzXCIgKyB1c2VyLnVzZXJUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIudXNlclR5cGUpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYWQgdHlwZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaGlnaGxpZ2h0IGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInUgdHJ5bmEgY3JlYXRlIGJyYWg/XCIpO1xuICAgICAgICAgICAgICAgIGlmKCAhZXJyb3JzICl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCB1c2VyIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgICAgICAgICBVc2VyLmNyZWF0ZSh1c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJfaWQgPSByZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZlbGxvd19wb3N0ID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZlbGxvd3MuY3JlYXRlKGZlbGxvd19wb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGFueV9wb3N0ID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBhbmllcy5jcmVhdGUoY29tcGFueV9wb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICBcblxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdDb21wYW5pZXMnLCAnVXNlcicsICdUYWdzJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIENvbXBhbmllcywgVXNlciwgVGFncywgQWxlcnQpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgQ29tcGFueVxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJDb21wYW55XCIgKXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIENvbXBhbmllcy5nZXRCeVVzZXJJZChjdXJyZW50VXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbihjb21wYW55KXtcblxuICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24odGFncyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIHRhZ3MuZm9yRWFjaChmdW5jdGlvbih0YWcpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGFnLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJChcInNlbGVjdCN0YWdzXCIpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAvL3RhZ3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuU2VwYXJhdG9yczogWycsJywnICddXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oY29tcGFueSkge1xuXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHRhZ3MgZnJvbSB0aGUgZm9ybVxuICAgICAgICAgICAgLy9jb21wYW55LnRhZ3MgPSAkKFwiI3RhZ3NcIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgdGFncyA9IFtdO1xuICAgICAgICAgICAgJCgnI3RhZ3MgOnNlbGVjdGVkJykuZWFjaChmdW5jdGlvbihpLCBzZWxlY3RlZCl7XG4gICAgICAgICAgICAgICAgdGFnc1tpXSA9ICQoc2VsZWN0ZWQpLnZhbCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbXBhbnkudGFncyA9IHRhZ3M7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgY29tcGFuaWVzIGluZm8gdG8gQVBJIHZpYSBTZXJ2aWNlXG4gICAgICAgICAgICBDb21wYW5pZXMudXBkYXRlKGNvbXBhbnkpLnN1Y2Nlc3MoZnVuY3Rpb24obmV3Q29tcGFueURhdGEpe1xuXG4gICAgICAgICAgICAgICAgLy8gKiogVHJpZ2dlciBTdWNjZXNzIG1lc3NhZ2UgaGVyZVxuICAgICAgICAgICAgICAgIGNvbXBhbnkgPSBuZXdDb21wYW55RGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIGhpZGUgdXBkYXRlIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWQtc3RhdHVzXCIpLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgIEFsZXJ0LnNob3dBbGVydCggJ1lvdXIgcHJvZmlsZSBoYXMgYmVlbiB1cGRhdGVkJywgJ3N1Y2Nlc3MnICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiogUzMgRmlsZSB1cGxvYWRpbmcgKiovXG4gICAgICAgICRzY29wZS5nZXRTM0tleSA9IGZ1bmN0aW9uKCl7XG5cblxuICAgICAgICAgICAgdmFyIGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlX2lucHV0XCIpLmZpbGVzO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcblxuICAgICAgICAgICAgaWYoZmlsZSA9PT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIk5vIGZpbGUgc2VsZWN0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIHByZXZlbnQgbmFtaW5nIGNvbGxpc2lvbnMgYnkgYXBwZW5kaW5nIHRoZSB1bmlxdWUgdXNlcl9pZCB0byBmaWxlIG5hbWVcbiAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICB2YXIgcGllY2VzID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gcGllY2VzLmpvaW4oXCIuXCIpICsgXCItXCIgKyAkc2NvcGUuY29tcGFueS51c2VyX2lkICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGUgPT09IDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRfZmlsZShmaWxlLCByZXNwb25zZS5zaWduZWRfcmVxdWVzdCwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBnZXQgc2lnbmVkIFVSTC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZF9maWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgU2V0IGltYWdlIHByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgY29tcGFueSBtb2RlbFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFueS5pbWFnZV91cmwgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICRzY29wZS5jb21wYW55ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdGZWxsb3dzJywgJ1RhZ3MnLCAnVXNlcicsICdBbGVydCcgXTtcblxuICAgIC8qKlxuICAgICogQG5hbWVzcGFjZSBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgRmVsbG93cywgVGFncywgVXNlciwgQWxlcnQgKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgRmVsbG93XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBGZWxsb3dzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvdyl7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cblxuICAgICAgICAgICAgVGFncy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKHRhZ3Mpe1xuXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICB0YWdzLmZvckVhY2goZnVuY3Rpb24odGFnKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRhZy5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRhZy5uYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICQoXCJzZWxlY3QjdGFnc1wiKS5zZWxlY3QyKHtcbiAgICAgICAgICAgICAgICAgICAgLy90YWdzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICB0b2tlblNlcGFyYXRvcnM6IFsnLCcsJyAnXVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcbiAgICAgICAgICAgIC8vUHJvZmlsZS5hbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihmZWxsb3csIGZpbGUpIHtcblxuICAgICAgICAgICAgdmFyIHRhZ3MgPSBbXTtcbiAgICAgICAgICAgICQoJyN0YWdzIDpzZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24oaSwgc2VsZWN0ZWQpe1xuXG4gICAgICAgICAgICAgICAgdGFnc1tpXSA9ICQoc2VsZWN0ZWQpLnZhbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmZWxsb3cudGFncyA9IHRhZ3M7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgZmVsbG93cyBpbmZvIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgRmVsbG93cy51cGRhdGUoZmVsbG93KS5zdWNjZXNzKGZ1bmN0aW9uKG5ld0ZlbGxvd0RhdGEpe1xuXG4gICAgICAgICAgICAgICAgLy8gKiogVHJpZ2dlciBTdWNjZXNzIG1lc3NhZ2UgaGVyZVxuICAgICAgICAgICAgICAgIGZlbGxvdyA9IG5ld0ZlbGxvd0RhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBoaWRlIHVwZGF0ZSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoICdZb3VyIHByb2ZpbGUgaGFzIGJlZW4gdXBkYXRlZCcsICdzdWNjZXNzJyApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKiogUzMgRmlsZSB1cGxvYWRpbmcgKiovXG4gICAgICAgICRzY29wZS5nZXRTM0tleSA9IGZ1bmN0aW9uKCl7XG5cblxuICAgICAgICAgICAgdmFyIGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlX2lucHV0XCIpLmZpbGVzO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcblxuICAgICAgICAgICAgaWYoZmlsZSA9PT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIk5vIGZpbGUgc2VsZWN0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIHByZXZlbnQgbmFtaW5nIGNvbGxpc2lvbnMgYnkgYXBwZW5kaW5nIHRoZSB1bmlxdWUgdXNlcl9pZCB0byBmaWxlIG5hbWVcbiAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICB2YXIgcGllY2VzID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gcGllY2VzLmpvaW4oXCIuXCIpICsgXCItXCIgKyAkc2NvcGUuZmVsbG93LnVzZXJfaWQgKyBcIi5cIiArIGV4dGVuc2lvbjtcblxuICAgICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgXCIvc2lnbl9zMz9maWxlX25hbWU9XCIrZmlsZV9uYW1lK1wiJmZpbGVfdHlwZT1cIitmaWxlLnR5cGUpO1xuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBpZih4aHIucmVhZHlTdGF0ZSA9PT0gNCl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZF9maWxlKGZpbGUsIHJlc3BvbnNlLnNpZ25lZF9yZXF1ZXN0LCByZXNwb25zZS51cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IGdldCBzaWduZWQgVVJMLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkX2ZpbGUoZmlsZSwgc2lnbmVkX3JlcXVlc3QsIHVybCl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vcGVuKFwiUFVUXCIsIHNpZ25lZF9yZXF1ZXN0KTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCd4LWFtei1hY2wnLCAncHVibGljLXJlYWQnKTtcblxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICBTZXQgaW1hZ2UgcHJldmlld1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZpZXdcIikuc3JjID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBmZWxsb3cgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvdy5pbWFnZV91cmwgPSB1cmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlciddO1xuICAvKipcbiAgKiBAbmFtZXNwYWNlIFByb2ZpbGVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyKSB7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY3VycmVudCB1c2VyIGlzIFwiICsgY3VycmVudFVzZXIudXNlclR5cGUpO1xuICAgICAgICAgIC8vIHJlZGlyZWN0IHRoZSB1c2VyIGJhc2VkIG9uIHRoZWlyIHR5cGVcbiAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMaWtlIGEgYm9zc1wiKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9hZG1pblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdGZWxsb3cnKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTGlrZSBhIGZlbGxhXCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2ZlbGxvd1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdDb21wYW55Jykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxpa2UgYSBjb21wYW55XCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2NvbXBhbnlcIik7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcblxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICB9XG5cbiAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NcbiAqIEBuYW1lc3BhY2UgYXBwLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdUYWdzJywgVGFncyk7XG5cbiAgICBUYWdzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBUYWdzXG4gICAgICogQHJldHVybnMge1NlcnZpY2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gVGFncygkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFsbDogYWxsLFxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICAvL2NyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgLy91cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICAgIC8vZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGFsbFxuICAgICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGwoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXRcbiAgICAgICAgICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcbiAgICAgICAgICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldChpZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyBpZCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICAvL2Z1bmN0aW9uIGNyZWF0ZShmZWxsb3cpIHtcbiAgICAgICAgLy8gICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJywgZmVsbG93KTtcbiAgICAgICAgLy99XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICAgKiBAZGVzYyB1cGRhdGVzIGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgLy9mdW5jdGlvbiB1cGRhdGUoZmVsbG93LCBpZCkge1xuICAgICAgICAvLyAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCwgZmVsbG93KTtcbiAgICAgICAgLy99XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAgICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIC8vZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgICAvLyAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XG4gICAgICAgIC8vfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogUHJvZmlsZVxuICogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJylcbiAgICAuZmFjdG9yeSgnVXNlcicsIFVzZXIpO1xuXG4gIFVzZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckY29va2llU3RvcmUnLCAnJGh0dHAnLCAnQ09ORklHJ107XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgVXNlclxuICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICovXG4gIGZ1bmN0aW9uIFVzZXIoJHJvb3RTY29wZSwgJGNvb2tpZVN0b3JlLCAkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAvLyBXaWxsIGhvbGQgaW5mbyBmb3IgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlclxuICAgICAgdmFyIGN1cnJlbnRVc2VyID0ge307XG5cbiAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xuXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcih1c2VyKSB7XG5cbiAgICAgICAgICBjdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFZvdGVzKCB1c2VyX2lkICl7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlcl9pZCArICcvdm90ZXMnICk7XG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBsb2dpblxuICAgICAgICogQGRlc2MgbG9naW4gYSBuZXcgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbG9naW4odXNlcikge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy9sb2dpbicsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgLy9hbGw6IGFsbCxcbiAgICAgICAgICAvL2dldDogZ2V0LFxuICAgICAgICAgIGdldFZvdGVzOiBnZXRWb3RlcyxcbiAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgLy9kZXN0cm95OiBkZXN0cm95XG4gICAgICAgICAgU2V0Q3JlZGVudGlhbHM6IFNldENyZWRlbnRpYWxzLFxuICAgICAgICAgIENsZWFyQ3JlZGVudGlhbHM6IENsZWFyQ3JlZGVudGlhbHMsXG4gICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxuICAgICAgICAgIHNldEN1cnJlbnRVc2VyOiBzZXRDdXJyZW50VXNlcixcbiAgICAgICAgICBpc1VzZXJMb2dnZWRJbjogaXNVc2VyTG9nZ2VkSW5cbiAgICAgIH07XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIHVzZXJzXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gYWxsKCkge1xuICAgICAgLy9cbiAgICAgIC8vICAgIHJldHVybiBbXTtcbiAgICAgIC8vXG4gICAgICAvLyAgICAvL3JldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcbiAgICAgIC8vfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIHVzZXJcbiAgICAgICAqL1xuICAgICAgLy9mdW5jdGlvbiBnZXQoaWQpIHtcbiAgICAgIC8vICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBwYXJzZUludChpZCkgKTtcbiAgICAgIC8vfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICogQGRlc2MgY3JlYXRlIGEgbmV3IHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2NyZWF0ZScsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICogQGRlc2MgdXBkYXRlYSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcblxuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyB1c2VyLmlkLCB1c2VyKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgLy9mdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICAvLyAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyByb290VXJsICsgJy9hcGkvdjEvdXNlcnMvJyArIGlkKTtcbiAgICAgIC8vfVxuXG4gICAgICBmdW5jdGlvbiBpc1VzZXJMb2dnZWRJbigpe1xuXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XG4gICAgICAgICAgaWYoIE9iamVjdC5rZXlzKGN1cnJlbnRVc2VyKS5sZW5ndGggPiAwICl7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gU2V0Q3JlZGVudGlhbHMoaWQsIHVzZXJuYW1lLCB1c2VyVHlwZSkge1xuXG4gICAgICAgICAgdmFyIGF1dGhkYXRhID0gQmFzZTY0LmVuY29kZShpZCArICc6JyArIHVzZXJuYW1lICsgJzonICsgdXNlclR5cGUpO1xuXG4gICAgICAgICAgY3VycmVudFVzZXIgPSB7XG4gICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICB1c2VyVHlwZTogdXNlclR5cGUsXG4gICAgICAgICAgICAgIGF1dGhkYXRhOiBhdXRoZGF0YVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAkY29va2llU3RvcmUucHV0KCdnbG9iYWxzJywgY3VycmVudFVzZXIpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBDbGVhckNyZWRlbnRpYWxzKCkge1xuXG4gICAgICAgICAgJHJvb3RTY29wZS5nbG9iYWxzID0ge307XG4gICAgICAgICAgJGNvb2tpZVN0b3JlLnJlbW92ZSgnZ2xvYmFscycpO1xuICAgICAgfVxuXG4gIH1cblxuICAvLyBCYXNlNjQgZW5jb2Rpbmcgc2VydmljZSB1c2VkIGJ5IEF1dGhlbnRpY2F0aW9uU2VydmljZVxuICB2YXIgQmFzZTY0ID0ge1xuXG4gICAga2V5U3RyOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nLFxuXG4gICAgZW5jb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgICAgdmFyIGNocjEsIGNocjIsIGNocjMgPSBcIlwiO1xuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGNocjEgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGNocjIgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG4gICAgICAgIGNocjMgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XG5cbiAgICAgICAgZW5jMSA9IGNocjEgPj4gMjtcbiAgICAgICAgZW5jMiA9ICgoY2hyMSAmIDMpIDw8IDQpIHwgKGNocjIgPj4gNCk7XG4gICAgICAgIGVuYzMgPSAoKGNocjIgJiAxNSkgPDwgMikgfCAoY2hyMyA+PiA2KTtcbiAgICAgICAgZW5jNCA9IGNocjMgJiA2MztcblxuICAgICAgICBpZiAoaXNOYU4oY2hyMikpIHtcbiAgICAgICAgICBlbmMzID0gZW5jNCA9IDY0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKGNocjMpKSB7XG4gICAgICAgICAgZW5jNCA9IDY0O1xuICAgICAgICB9XG5cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMSkgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMyKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzMpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jNCk7XG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xuICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSxcblxuICAgIGRlY29kZTogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcbiAgICAgIHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgLy8gcmVtb3ZlIGFsbCBjaGFyYWN0ZXJzIHRoYXQgYXJlIG5vdCBBLVosIGEteiwgMC05LCArLCAvLCBvciA9XG4gICAgICB2YXIgYmFzZTY0dGVzdCA9IC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZztcbiAgICAgIGlmIChiYXNlNjR0ZXN0LmV4ZWMoaW5wdXQpKSB7XG4gICAgICAgIHdpbmRvdy5hbGVydChcIlRoZXJlIHdlcmUgaW52YWxpZCBiYXNlNjQgY2hhcmFjdGVycyBpbiB0aGUgaW5wdXQgdGV4dC5cXG5cIiArXG4gICAgICAgICAgICBcIlZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGFyZSBBLVosIGEteiwgMC05LCAnKycsICcvJyxhbmQgJz0nXFxuXCIgK1xuICAgICAgICAgICAgXCJFeHBlY3QgZXJyb3JzIGluIGRlY29kaW5nLlwiKTtcbiAgICAgIH1cbiAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9cXD1dL2csIFwiXCIpO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGVuYzEgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jMiA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMzID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzQgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcblxuICAgICAgICBjaHIxID0gKGVuYzEgPDwgMikgfCAoZW5jMiA+PiA0KTtcbiAgICAgICAgY2hyMiA9ICgoZW5jMiAmIDE1KSA8PCA0KSB8IChlbmMzID4+IDIpO1xuICAgICAgICBjaHIzID0gKChlbmMzICYgMykgPDwgNikgfCBlbmM0O1xuXG4gICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMSk7XG5cbiAgICAgICAgaWYgKGVuYzMgIT0gNjQpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmM0ICE9IDY0KSB7XG4gICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xuXG4gICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG4gIH07XG5cbn0pKCk7XG4iLCIvKipcbiAqIEFkbWluVm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ0FkbWluVm90ZXNDb250cm9sbGVyJywgQWRtaW5Wb3Rlc0NvbnRyb2xsZXIgKTtcblxuICAgIEFkbWluVm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEFkbWluVm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnQ29tcGFueVZvdGVzQ29udHJvbGxlcicsIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXIgKTtcblxuICAgIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQ29tcGFueVZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICBWb3Rlcy5nZXQoICRzY29wZS5jdXJyZW50VXNlci5pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzID0gdm90ZXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93Vm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ0ZlbGxvd1ZvdGVzQ29udHJvbGxlcicsIEZlbGxvd1ZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgRmVsbG93Vm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd1ZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICBWb3Rlcy5nZXQoICRzY29wZS5jdXJyZW50VXNlci5pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzID0gdm90ZXM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnVm90ZXNDb250cm9sbGVyJywgVm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gVm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICAvLyByZWRpcmVjdCB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciB0eXBlXG4gICAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9hZG1pblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnRmVsbG93Jykge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3ZvdGVzL2ZlbGxvd1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9jb21wYW55XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc1xuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuc2VydmljZXNcbiAqL1xuXG4vLyBAVE9ETyAtLSBJcyB0aGlzIGJlaW5nIHVzZWQgc29tZXdoZXJlP1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1ZvdGVzJywgVm90ZXMpO1xuXG4gICAgVm90ZXMuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBWb3RlcygkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0IHZvdGVzXG4gICAgICAgICAqIEBkZXNjIGdldCB0aGUgdm90ZXMgZm9yIGEgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0KCB2b3Rlcl9pZCApe1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nICsgdm90ZXJfaWQgKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjYXN0IGEgdm90ZSBmb3IgYSB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGUoIHZvdGVyX2lkLCB2b3RlZV9pZCApIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdm90ZXJfaWQgKyBcIiBcIiArIHZvdGVlX2lkICk7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nLCB7XG5cbiAgICAgICAgICAgICAgICB2b3Rlcl9pZDogdm90ZXJfaWQsXG4gICAgICAgICAgICAgICAgdm90ZWVfaWQ6IHZvdGVlX2lkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgICAqIEBkZXNjIGRlc3Ryb3kgYSB2b3RlIHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nICsgaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKCk7XG5cbiIsIi8qISA3LjMuNCAqL1xuIXdpbmRvdy5YTUxIdHRwUmVxdWVzdHx8d2luZG93LkZpbGVBUEkmJkZpbGVBUEkuc2hvdWxkTG9hZHx8KHdpbmRvdy5YTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2V0UmVxdWVzdEhlYWRlcj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYixjKXtpZihcIl9fc2V0WEhSX1wiPT09Yil7dmFyIGQ9Yyh0aGlzKTtkIGluc3RhbmNlb2YgRnVuY3Rpb24mJmQodGhpcyl9ZWxzZSBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KHdpbmRvdy5YTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2V0UmVxdWVzdEhlYWRlcikpO3ZhciBuZ0ZpbGVVcGxvYWQ9YW5ndWxhci5tb2R1bGUoXCJuZ0ZpbGVVcGxvYWRcIixbXSk7bmdGaWxlVXBsb2FkLnZlcnNpb249XCI3LjMuNFwiLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkQmFzZVwiLFtcIiRodHRwXCIsXCIkcVwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChkKXtmdW5jdGlvbiBnKGEpe2oubm90aWZ5JiZqLm5vdGlmeShhKSxrLnByb2dyZXNzRnVuYyYmYyhmdW5jdGlvbigpe2sucHJvZ3Jlc3NGdW5jKGEpfSl9ZnVuY3Rpb24gaChhKXtyZXR1cm4gbnVsbCE9ZC5fc3RhcnQmJmY/e2xvYWRlZDphLmxvYWRlZCtkLl9zdGFydCx0b3RhbDpkLl9maWxlLnNpemUsdHlwZTphLnR5cGUsY29uZmlnOmQsbGVuZ3RoQ29tcHV0YWJsZTohMCx0YXJnZXQ6YS50YXJnZXR9OmF9ZnVuY3Rpb24gaSgpe2EoZCkudGhlbihmdW5jdGlvbihhKXtkLl9jaHVua1NpemUmJiFkLl9maW5pc2hlZD8oZyh7bG9hZGVkOmQuX2VuZCx0b3RhbDpkLl9maWxlLnNpemUsY29uZmlnOmQsdHlwZTpcInByb2dyZXNzXCJ9KSxlLnVwbG9hZChkKSk6KGQuX2ZpbmlzaGVkJiZkZWxldGUgZC5fZmluaXNoZWQsai5yZXNvbHZlKGEpKX0sZnVuY3Rpb24oYSl7ai5yZWplY3QoYSl9LGZ1bmN0aW9uKGEpe2oubm90aWZ5KGEpfSl9ZC5tZXRob2Q9ZC5tZXRob2R8fFwiUE9TVFwiLGQuaGVhZGVycz1kLmhlYWRlcnN8fHt9O3ZhciBqPWQuX2RlZmVycmVkPWQuX2RlZmVycmVkfHxiLmRlZmVyKCksaz1qLnByb21pc2U7cmV0dXJuIGQuaGVhZGVycy5fX3NldFhIUl89ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYSl7YSYmKGQuX19YSFI9YSxkLnhockZuJiZkLnhockZuKGEpLGEudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLGZ1bmN0aW9uKGEpe2EuY29uZmlnPWQsZyhoKGEpKX0sITEpLGEudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZnVuY3Rpb24oYSl7YS5sZW5ndGhDb21wdXRhYmxlJiYoYS5jb25maWc9ZCxnKGgoYSkpKX0sITEpKX19LGY/ZC5fY2h1bmtTaXplJiZkLl9lbmQmJiFkLl9maW5pc2hlZD8oZC5fc3RhcnQ9ZC5fZW5kLGQuX2VuZCs9ZC5fY2h1bmtTaXplLGkoKSk6ZC5yZXN1bWVTaXplVXJsP2EuZ2V0KGQucmVzdW1lU2l6ZVVybCkudGhlbihmdW5jdGlvbihhKXtkLl9zdGFydD1kLnJlc3VtZVNpemVSZXNwb25zZVJlYWRlcj9kLnJlc3VtZVNpemVSZXNwb25zZVJlYWRlcihhLmRhdGEpOnBhcnNlSW50KChudWxsPT1hLmRhdGEuc2l6ZT9hLmRhdGE6YS5kYXRhLnNpemUpLnRvU3RyaW5nKCkpLGQuX2NodW5rU2l6ZSYmKGQuX2VuZD1kLl9zdGFydCtkLl9jaHVua1NpemUpLGkoKX0sZnVuY3Rpb24oYSl7dGhyb3cgYX0pOmQucmVzdW1lU2l6ZT9kLnJlc3VtZVNpemUoKS50aGVuKGZ1bmN0aW9uKGEpe2QuX3N0YXJ0PWEsaSgpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6aSgpOmkoKSxrLnN1Y2Nlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGsudGhlbihmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsZCl9KSxrfSxrLmVycm9yPWZ1bmN0aW9uKGEpe3JldHVybiBrLnRoZW4obnVsbCxmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsZCl9KSxrfSxrLnByb2dyZXNzPWZ1bmN0aW9uKGEpe3JldHVybiBrLnByb2dyZXNzRnVuYz1hLGsudGhlbihudWxsLG51bGwsZnVuY3Rpb24oYil7YShiKX0pLGt9LGsuYWJvcnQ9ay5wYXVzZT1mdW5jdGlvbigpe3JldHVybiBkLl9fWEhSJiZjKGZ1bmN0aW9uKCl7ZC5fX1hIUi5hYm9ydCgpfSksa30say54aHI9ZnVuY3Rpb24oYSl7cmV0dXJuIGQueGhyRm49ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKCl7YiYmYi5hcHBseShrLGFyZ3VtZW50cyksYS5hcHBseShrLGFyZ3VtZW50cyl9fShkLnhockZuKSxrfSxrfXZhciBlPXRoaXMsZj13aW5kb3cuQmxvYiYmKG5ldyBCbG9iKS5zbGljZTt0aGlzLnVwbG9hZD1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKGMsZCxlKXtpZih2b2lkIDAhPT1kKWlmKGFuZ3VsYXIuaXNEYXRlKGQpJiYoZD1kLnRvSVNPU3RyaW5nKCkpLGFuZ3VsYXIuaXNTdHJpbmcoZCkpYy5hcHBlbmQoZSxkKTtlbHNlIGlmKFwiZm9ybVwiPT09YS5zZW5kRmllbGRzQXMpaWYoYW5ndWxhci5pc09iamVjdChkKSlmb3IodmFyIGYgaW4gZClkLmhhc093blByb3BlcnR5KGYpJiZiKGMsZFtmXSxlK1wiW1wiK2YrXCJdXCIpO2Vsc2UgYy5hcHBlbmQoZSxkKTtlbHNlIGQ9YW5ndWxhci5pc1N0cmluZyhkKT9kOmFuZ3VsYXIudG9Kc29uKGQpLFwianNvbi1ibG9iXCI9PT1hLnNlbmRGaWVsZHNBcz9jLmFwcGVuZChlLG5ldyBCbG9iKFtkXSx7dHlwZTpcImFwcGxpY2F0aW9uL2pzb25cIn0pKTpjLmFwcGVuZChlLGQpfWZ1bmN0aW9uIGMoYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBCbG9ifHxhLmZsYXNoSWQmJmEubmFtZSYmYS5zaXplfWZ1bmN0aW9uIGcoYixkLGUpe2lmKGMoZCkpe2lmKGEuX2ZpbGU9YS5fZmlsZXx8ZCxudWxsIT1hLl9zdGFydCYmZil7YS5fZW5kJiZhLl9lbmQ+PWQuc2l6ZSYmKGEuX2ZpbmlzaGVkPSEwLGEuX2VuZD1kLnNpemUpO3ZhciBoPWQuc2xpY2UoYS5fc3RhcnQsYS5fZW5kfHxkLnNpemUpO2gubmFtZT1kLm5hbWUsZD1oLGEuX2NodW5rU2l6ZSYmKGIuYXBwZW5kKFwiY2h1bmtTaXplXCIsYS5fZW5kLWEuX3N0YXJ0KSxiLmFwcGVuZChcImNodW5rTnVtYmVyXCIsTWF0aC5mbG9vcihhLl9zdGFydC9hLl9jaHVua1NpemUpKSxiLmFwcGVuZChcInRvdGFsU2l6ZVwiLGEuX2ZpbGUuc2l6ZSkpfWIuYXBwZW5kKGUsZCxkLmZpbGVOYW1lfHxkLm5hbWUpfWVsc2V7aWYoIWFuZ3VsYXIuaXNPYmplY3QoZCkpdGhyb3dcIkV4cGVjdGVkIGZpbGUgb2JqZWN0IGluIFVwbG9hZC51cGxvYWQgZmlsZSBvcHRpb246IFwiK2QudG9TdHJpbmcoKTtmb3IodmFyIGkgaW4gZClpZihkLmhhc093blByb3BlcnR5KGkpKXt2YXIgaj1pLnNwbGl0KFwiLFwiKTtqWzFdJiYoZFtpXS5maWxlTmFtZT1qWzFdLnJlcGxhY2UoL15cXHMrfFxccyskL2csXCJcIikpLGcoYixkW2ldLGpbMF0pfX19cmV0dXJuIGEuX2NodW5rU2l6ZT1lLnRyYW5zbGF0ZVNjYWxhcnMoYS5yZXN1bWVDaHVua1NpemUpLGEuX2NodW5rU2l6ZT1hLl9jaHVua1NpemU/cGFyc2VJbnQoYS5fY2h1bmtTaXplLnRvU3RyaW5nKCkpOm51bGwsYS5oZWFkZXJzPWEuaGVhZGVyc3x8e30sYS5oZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdPXZvaWQgMCxhLnRyYW5zZm9ybVJlcXVlc3Q9YS50cmFuc2Zvcm1SZXF1ZXN0P2FuZ3VsYXIuaXNBcnJheShhLnRyYW5zZm9ybVJlcXVlc3QpP2EudHJhbnNmb3JtUmVxdWVzdDpbYS50cmFuc2Zvcm1SZXF1ZXN0XTpbXSxhLnRyYW5zZm9ybVJlcXVlc3QucHVzaChmdW5jdGlvbihjKXt2YXIgZCxlPW5ldyBGb3JtRGF0YSxmPXt9O2ZvcihkIGluIGEuZmllbGRzKWEuZmllbGRzLmhhc093blByb3BlcnR5KGQpJiYoZltkXT1hLmZpZWxkc1tkXSk7YyYmKGYuZGF0YT1jKTtmb3IoZCBpbiBmKWlmKGYuaGFzT3duUHJvcGVydHkoZCkpe3ZhciBoPWZbZF07YS5mb3JtRGF0YUFwcGVuZGVyP2EuZm9ybURhdGFBcHBlbmRlcihlLGQsaCk6YihlLGgsZCl9aWYobnVsbCE9YS5maWxlKWlmKGFuZ3VsYXIuaXNBcnJheShhLmZpbGUpKWZvcih2YXIgaT0wO2k8YS5maWxlLmxlbmd0aDtpKyspZyhlLGEuZmlsZVtpXSxcImZpbGVcIik7ZWxzZSBnKGUsYS5maWxlLFwiZmlsZVwiKTtyZXR1cm4gZX0pLGQoYSl9LHRoaXMuaHR0cD1mdW5jdGlvbihiKXtyZXR1cm4gYi50cmFuc2Zvcm1SZXF1ZXN0PWIudHJhbnNmb3JtUmVxdWVzdHx8ZnVuY3Rpb24oYil7cmV0dXJuIHdpbmRvdy5BcnJheUJ1ZmZlciYmYiBpbnN0YW5jZW9mIHdpbmRvdy5BcnJheUJ1ZmZlcnx8YiBpbnN0YW5jZW9mIEJsb2I/YjphLmRlZmF1bHRzLnRyYW5zZm9ybVJlcXVlc3RbMF0uYXBwbHkodGhpcyxhcmd1bWVudHMpfSxiLl9jaHVua1NpemU9ZS50cmFuc2xhdGVTY2FsYXJzKGIucmVzdW1lQ2h1bmtTaXplKSxiLl9jaHVua1NpemU9Yi5fY2h1bmtTaXplP3BhcnNlSW50KGIuX2NodW5rU2l6ZS50b1N0cmluZygpKTpudWxsLGQoYil9LHRoaXMudHJhbnNsYXRlU2NhbGFycz1mdW5jdGlvbihhKXtpZihhbmd1bGFyLmlzU3RyaW5nKGEpKXtpZihhLnNlYXJjaCgva2IvaSk9PT1hLmxlbmd0aC0yKXJldHVybiBwYXJzZUZsb2F0KDFlMyphLnN1YnN0cmluZygwLGEubGVuZ3RoLTIpKTtpZihhLnNlYXJjaCgvbWIvaSk9PT1hLmxlbmd0aC0yKXJldHVybiBwYXJzZUZsb2F0KDFlNiphLnN1YnN0cmluZygwLGEubGVuZ3RoLTIpKTtpZihhLnNlYXJjaCgvZ2IvaSk9PT1hLmxlbmd0aC0yKXJldHVybiBwYXJzZUZsb2F0KDFlOSphLnN1YnN0cmluZygwLGEubGVuZ3RoLTIpKTtpZihhLnNlYXJjaCgvYi9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL3MvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KGEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9tL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdCg2MCphLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvaC9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoMzYwMCphLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKX1yZXR1cm4gYX0sdGhpcy5zZXREZWZhdWx0cz1mdW5jdGlvbihhKXt0aGlzLmRlZmF1bHRzPWF8fHt9fSx0aGlzLmRlZmF1bHRzPXt9LHRoaXMudmVyc2lvbj1uZ0ZpbGVVcGxvYWQudmVyc2lvbn1dKSxuZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZFwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIiRjb21waWxlXCIsXCJVcGxvYWRSZXNpemVcIixmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1kO3JldHVybiBlLmdldEF0dHJXaXRoRGVmYXVsdHM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbnVsbCE9YVtiXT9hW2JdOm51bGw9PWUuZGVmYXVsdHNbYl0/ZS5kZWZhdWx0c1tiXTplLmRlZmF1bHRzW2JdLnRvU3RyaW5nKCl9LGUuYXR0ckdldHRlcj1mdW5jdGlvbihiLGMsZCxlKXtpZighZClyZXR1cm4gdGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYik7dHJ5e3JldHVybiBlP2EodGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYikpKGQsZSk6YSh0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKSkoZCl9Y2F0Y2goZil7aWYoYi5zZWFyY2goL21pbnxtYXh8cGF0dGVybi9pKSlyZXR1cm4gdGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYik7dGhyb3cgZn19LGUudXBkYXRlTW9kZWw9ZnVuY3Rpb24oYyxkLGYsZyxoLGksail7ZnVuY3Rpb24gaygpe3ZhciBqPWgmJmgubGVuZ3RoP2hbMF06bnVsbDtpZihjKXt2YXIgaz0hZS5hdHRyR2V0dGVyKFwibmdmTXVsdGlwbGVcIixkLGYpJiYhZS5hdHRyR2V0dGVyKFwibXVsdGlwbGVcIixkKSYmIW87YShlLmF0dHJHZXR0ZXIoXCJuZ01vZGVsXCIsZCkpLmFzc2lnbihmLGs/ajpoKX12YXIgbD1lLmF0dHJHZXR0ZXIoXCJuZ2ZNb2RlbFwiLGQpO2wmJmEobCkuYXNzaWduKGYsaCksZyYmYShnKShmLHskZmlsZXM6aCwkZmlsZTpqLCRuZXdGaWxlczptLCRkdXBsaWNhdGVGaWxlczpuLCRldmVudDppfSksYihmdW5jdGlvbigpe30pfWZ1bmN0aW9uIGwoYSxiKXt2YXIgYz1lLmF0dHJHZXR0ZXIoXCJuZ2ZSZXNpemVcIixkLGYpO2lmKCFjfHwhZS5pc1Jlc2l6ZVN1cHBvcnRlZCgpKXJldHVybiBiKCk7Zm9yKHZhciBnPWEubGVuZ3RoLGg9ZnVuY3Rpb24oKXtnLS0sMD09PWcmJmIoKX0saT1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oYyl7YS5zcGxpY2UoYiwxLGMpLGgoKX19LGo9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe2goKSxhLiRlcnJvcj1cInJlc2l6ZVwiLGEuJGVycm9yUGFyYW09KGI/KGIubWVzc2FnZT9iLm1lc3NhZ2U6YikrXCI6IFwiOlwiXCIpKyhhJiZhLm5hbWUpfX0saz0wO2s8YS5sZW5ndGg7aysrKXt2YXIgbD1hW2tdO2wuJGVycm9yfHwwIT09bC50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT9oKCk6ZS5yZXNpemUobCxjLndpZHRoLGMuaGVpZ2h0LGMucXVhbGl0eSkudGhlbihpKGspLGoobCkpfX12YXIgbT1oLG49W10sbz1lLmF0dHJHZXR0ZXIoXCJuZ2ZLZWVwXCIsZCxmKTtpZihvPT09ITApe2lmKCFofHwhaC5sZW5ndGgpcmV0dXJuO3ZhciBwPShjJiZjLiRtb2RlbFZhbHVlfHxkLiQkbmdmUHJldkZpbGVzfHxbXSkuc2xpY2UoMCkscT0hMTtpZihlLmF0dHJHZXR0ZXIoXCJuZ2ZLZWVwRGlzdGluY3RcIixkLGYpPT09ITApe2Zvcih2YXIgcj1wLmxlbmd0aCxzPTA7czxoLmxlbmd0aDtzKyspe2Zvcih2YXIgdD0wO3I+dDt0KyspaWYoaFtzXS5uYW1lPT09cFt0XS5uYW1lKXtuLnB1c2goaFtzXSk7YnJlYWt9dD09PXImJihwLnB1c2goaFtzXSkscT0hMCl9aWYoIXEpcmV0dXJuO2g9cH1lbHNlIGg9cC5jb25jYXQoaCl9ZC4kJG5nZlByZXZGaWxlcz1oLGo/aygpOmUudmFsaWRhdGUoaCxjLGQsZixlLmF0dHJHZXR0ZXIoXCJuZ2ZWYWxpZGF0ZUxhdGVyXCIsZCksZnVuY3Rpb24oKXtsKGgsZnVuY3Rpb24oKXtiKGZ1bmN0aW9uKCl7aygpfSl9KX0pfSxlfV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZTZWxlY3RcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZShhKXt2YXIgYj1hLm1hdGNoKC9BbmRyb2lkW15cXGRdKihcXGQrKVxcLihcXGQrKS8pO2lmKGImJmIubGVuZ3RoPjIpe3ZhciBjPWQuZGVmYXVsdHMuYW5kcm9pZEZpeE1pbm9yVmVyc2lvbnx8NDtyZXR1cm4gcGFyc2VJbnQoYlsxXSk8NHx8cGFyc2VJbnQoYlsxXSk9PT1jJiZwYXJzZUludChiWzJdKTxjfXJldHVybi0xPT09YS5pbmRleE9mKFwiQ2hyb21lXCIpJiYvLipXaW5kb3dzLipTYWZhcmkuKi8udGVzdChhKX1mdW5jdGlvbiBmKGEsYixjLGQsZixoLGksail7ZnVuY3Rpb24gaygpe3JldHVyblwiaW5wdXRcIj09PWJbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpJiZjLnR5cGUmJlwiZmlsZVwiPT09Yy50eXBlLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbCgpe3JldHVybiB0KFwibmdmQ2hhbmdlXCIpfHx0KFwibmdmU2VsZWN0XCIpfWZ1bmN0aW9uIG0oYil7Zm9yKHZhciBlPWIuX19maWxlc198fGIudGFyZ2V0JiZiLnRhcmdldC5maWxlcyxmPVtdLGc9MDtnPGUubGVuZ3RoO2crKylmLnB1c2goZVtnXSk7ai51cGRhdGVNb2RlbChkLGMsYSxsKCksZi5sZW5ndGg/ZjpudWxsLGIpfWZ1bmN0aW9uIG4oYSl7aWYoYiE9PWEpZm9yKHZhciBjPTA7YzxiWzBdLmF0dHJpYnV0ZXMubGVuZ3RoO2MrKyl7dmFyIGQ9YlswXS5hdHRyaWJ1dGVzW2NdO1widHlwZVwiIT09ZC5uYW1lJiZcImNsYXNzXCIhPT1kLm5hbWUmJlwiaWRcIiE9PWQubmFtZSYmXCJzdHlsZVwiIT09ZC5uYW1lJiYoKG51bGw9PWQudmFsdWV8fFwiXCI9PT1kLnZhbHVlKSYmKFwicmVxdWlyZWRcIj09PWQubmFtZSYmKGQudmFsdWU9XCJyZXF1aXJlZFwiKSxcIm11bHRpcGxlXCI9PT1kLm5hbWUmJihkLnZhbHVlPVwibXVsdGlwbGVcIikpLGEuYXR0cihkLm5hbWUsZC52YWx1ZSkpfX1mdW5jdGlvbiBvKCl7aWYoaygpKXJldHVybiBiO3ZhciBhPWFuZ3VsYXIuZWxlbWVudCgnPGlucHV0IHR5cGU9XCJmaWxlXCI+Jyk7cmV0dXJuIG4oYSksYS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImFic29sdXRlXCIpLmNzcyhcIm92ZXJmbG93XCIsXCJoaWRkZW5cIikuY3NzKFwid2lkdGhcIixcIjBweFwiKS5jc3MoXCJoZWlnaHRcIixcIjBweFwiKS5jc3MoXCJib3JkZXJcIixcIm5vbmVcIikuY3NzKFwibWFyZ2luXCIsXCIwcHhcIikuY3NzKFwicGFkZGluZ1wiLFwiMHB4XCIpLmF0dHIoXCJ0YWJpbmRleFwiLFwiLTFcIiksZy5wdXNoKHtlbDpiLHJlZjphfSksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhWzBdKSxhfWZ1bmN0aW9uIHAoYyl7aWYoYi5hdHRyKFwiZGlzYWJsZWRcIil8fHQoXCJuZ2ZTZWxlY3REaXNhYmxlZFwiLGEpKXJldHVybiExO3ZhciBkPXEoYyk7cmV0dXJuIG51bGwhPWQ/ZDoocihjKSxlKG5hdmlnYXRvci51c2VyQWdlbnQpP3NldFRpbWVvdXQoZnVuY3Rpb24oKXt3WzBdLmNsaWNrKCl9LDApOndbMF0uY2xpY2soKSwhMSl9ZnVuY3Rpb24gcShhKXt2YXIgYj1hLmNoYW5nZWRUb3VjaGVzfHxhLm9yaWdpbmFsRXZlbnQmJmEub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcztpZihcInRvdWNoc3RhcnRcIj09PWEudHlwZSlyZXR1cm4gdj1iP2JbMF0uY2xpZW50WTowLCEwO2lmKGEuc3RvcFByb3BhZ2F0aW9uKCksYS5wcmV2ZW50RGVmYXVsdCgpLFwidG91Y2hlbmRcIj09PWEudHlwZSl7dmFyIGM9Yj9iWzBdLmNsaWVudFk6MDtpZihNYXRoLmFicyhjLXYpPjIwKXJldHVybiExfX1mdW5jdGlvbiByKGIpe3cudmFsKCkmJih3LnZhbChudWxsKSxqLnVwZGF0ZU1vZGVsKGQsYyxhLGwoKSxudWxsLGIsITApKX1mdW5jdGlvbiBzKGEpe2lmKHcmJiF3LmF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIikpe2lmKCF3WzBdLnBhcmVudE5vZGUpcmV0dXJuIHZvaWQodz1udWxsKTthLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSx3LnVuYmluZChcImNsaWNrXCIpO3ZhciBiPXcuY2xvbmUoKTtyZXR1cm4gdy5yZXBsYWNlV2l0aChiKSx3PWIsdy5hdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIsXCJ0cnVlXCIpLHcuYmluZChcImNoYW5nZVwiLG0pLHcuYmluZChcImNsaWNrXCIscyksd1swXS5jbGljaygpLCExfXcucmVtb3ZlQXR0cihcIl9fbmdmX2llMTBfRml4X1wiKX12YXIgdD1mdW5jdGlvbihhLGIpe3JldHVybiBqLmF0dHJHZXR0ZXIoYSxjLGIpfSx1PVtdO3UucHVzaChhLiR3YXRjaCh0KFwibmdmTXVsdGlwbGVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJtdWx0aXBsZVwiLHQoXCJuZ2ZNdWx0aXBsZVwiLGEpKX0pKSx1LnB1c2goYS4kd2F0Y2godChcIm5nZkNhcHR1cmVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJjYXB0dXJlXCIsdChcIm5nZkNhcHR1cmVcIixhKSl9KSksYy4kb2JzZXJ2ZShcImFjY2VwdFwiLGZ1bmN0aW9uKCl7dy5hdHRyKFwiYWNjZXB0XCIsdChcImFjY2VwdFwiKSl9KSx1LnB1c2goZnVuY3Rpb24oKXtjLiQkb2JzZXJ2ZXJzJiZkZWxldGUgYy4kJG9ic2VydmVycy5hY2NlcHR9KTt2YXIgdj0wLHc9YjtrKCl8fCh3PW8oKSksdy5iaW5kKFwiY2hhbmdlXCIsbSksaygpP2IuYmluZChcImNsaWNrXCIscik6Yi5iaW5kKFwiY2xpY2sgdG91Y2hzdGFydCB0b3VjaGVuZFwiLHApLGoucmVnaXN0ZXJWYWxpZGF0b3JzKGQsdyxjLGEpLC0xIT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIikmJncuYmluZChcImNsaWNrXCIscyksYS4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7aygpfHx3LnJlbW92ZSgpLGFuZ3VsYXIuZm9yRWFjaCh1LGZ1bmN0aW9uKGEpe2EoKX0pfSksaChmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8Zy5sZW5ndGg7YSsrKXt2YXIgYj1nW2FdO2RvY3VtZW50LmJvZHkuY29udGFpbnMoYi5lbFswXSl8fChnLnNwbGljZShhLDEpLGIucmVmLnJlbW92ZSgpKX19KSx3aW5kb3cuRmlsZUFQSSYmd2luZG93LkZpbGVBUEkubmdmRml4SUUmJndpbmRvdy5GaWxlQVBJLm5nZkZpeElFKGIsdyxtKX12YXIgZz1bXTtyZXR1cm57cmVzdHJpY3Q6XCJBRUNcIixyZXF1aXJlOlwiP25nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGUsZyxoLGkpe2YoZSxnLGgsaSxhLGIsYyxkKX19fV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhKXtyZXR1cm5cImltZ1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJpbWFnZVwiOlwiYXVkaW9cIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1wiYXVkaW9cIjpcInZpZGVvXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cInZpZGVvXCI6Ly4vfWZ1bmN0aW9uIGIoYixjLGQsZSxmLGcsaCxpKXtmdW5jdGlvbiBqKGEpe3ZhciBnPWIuYXR0ckdldHRlcihcIm5nZk5vT2JqZWN0VXJsXCIsZixkKTtiLmRhdGFVcmwoYSxnKVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtjKGZ1bmN0aW9uKCl7dmFyIGI9KGc/YS5kYXRhVXJsOmEuYmxvYlVybCl8fGEuZGF0YVVybDtpP2UuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLFwidXJsKCdcIisoYnx8XCJcIikrXCInKVwiKTplLmF0dHIoXCJzcmNcIixiKSxiP2UucmVtb3ZlQ2xhc3MoXCJuZ2YtaGlkZVwiKTplLmFkZENsYXNzKFwibmdmLWhpZGVcIil9KX0pfWMoZnVuY3Rpb24oKXt2YXIgYz1kLiR3YXRjaChmW2ddLGZ1bmN0aW9uKGMpe3ZhciBkPWg7cmV0dXJuXCJuZ2ZUaHVtYm5haWxcIiE9PWd8fGR8fChkPXt3aWR0aDplWzBdLmNsaWVudFdpZHRoLGhlaWdodDplWzBdLmNsaWVudEhlaWdodH0pLGFuZ3VsYXIuaXNTdHJpbmcoYyk/KGUucmVtb3ZlQ2xhc3MoXCJuZ2YtaGlkZVwiKSxpP2UuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLFwidXJsKCdcIitjK1wiJylcIik6ZS5hdHRyKFwic3JjXCIsYykpOnZvaWQoIWN8fCFjLnR5cGV8fDAhPT1jLnR5cGUuc2VhcmNoKGEoZVswXSkpfHxpJiYwIT09Yy50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT9lLmFkZENsYXNzKFwibmdmLWhpZGVcIik6ZCYmYi5pc1Jlc2l6ZVN1cHBvcnRlZCgpP2IucmVzaXplKGMsZC53aWR0aCxkLmhlaWdodCxkLnF1YWxpdHkpLnRoZW4oZnVuY3Rpb24oYSl7aihhKX0sZnVuY3Rpb24oYSl7dGhyb3cgYX0pOmooYykpfSk7ZC4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7YygpfSl9KX1uZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZERhdGFVcmxcIixbXCJVcGxvYWRCYXNlXCIsXCIkdGltZW91dFwiLFwiJHFcIixmdW5jdGlvbihhLGIsYyl7dmFyIGQ9YTtyZXR1cm4gZC5kYXRhVXJsPWZ1bmN0aW9uKGEsZCl7aWYoZCYmbnVsbCE9YS5kYXRhVXJsfHwhZCYmbnVsbCE9YS5ibG9iVXJsKXt2YXIgZT1jLmRlZmVyKCk7cmV0dXJuIGIoZnVuY3Rpb24oKXtlLnJlc29sdmUoZD9hLmRhdGFVcmw6YS5ibG9iVXJsKX0pLGUucHJvbWlzZX12YXIgZj1kP2EuJG5nZkRhdGFVcmxQcm9taXNlOmEuJG5nZkJsb2JVcmxQcm9taXNlO2lmKGYpcmV0dXJuIGY7dmFyIGc9Yy5kZWZlcigpO3JldHVybiBiKGZ1bmN0aW9uKCl7aWYod2luZG93LkZpbGVSZWFkZXImJmEmJighd2luZG93LkZpbGVBUEl8fC0xPT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4XCIpfHxhLnNpemU8MmU0KSYmKCF3aW5kb3cuRmlsZUFQSXx8LTE9PT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDlcIil8fGEuc2l6ZTw0ZTYpKXt2YXIgYz13aW5kb3cuVVJMfHx3aW5kb3cud2Via2l0VVJMO2lmKGMmJmMuY3JlYXRlT2JqZWN0VVJMJiYhZCl7dmFyIGU7dHJ5e2U9Yy5jcmVhdGVPYmplY3RVUkwoYSl9Y2F0Y2goZil7cmV0dXJuIHZvaWQgYihmdW5jdGlvbigpe2EuYmxvYlVybD1cIlwiLGcucmVqZWN0KCl9KX1iKGZ1bmN0aW9uKCl7YS5ibG9iVXJsPWUsZSYmZy5yZXNvbHZlKGUpfSl9ZWxzZXt2YXIgaD1uZXcgRmlsZVJlYWRlcjtoLm9ubG9hZD1mdW5jdGlvbihjKXtiKGZ1bmN0aW9uKCl7YS5kYXRhVXJsPWMudGFyZ2V0LnJlc3VsdCxnLnJlc29sdmUoYy50YXJnZXQucmVzdWx0KX0pfSxoLm9uZXJyb3I9ZnVuY3Rpb24oKXtiKGZ1bmN0aW9uKCl7YS5kYXRhVXJsPVwiXCIsZy5yZWplY3QoKX0pfSxoLnJlYWRBc0RhdGFVUkwoYSl9fWVsc2UgYihmdW5jdGlvbigpe2FbZD9cImRhdGFVcmxcIjpcImJsb2JVcmxcIl09XCJcIixnLnJlamVjdCgpfSl9KSxmPWQ/YS4kbmdmRGF0YVVybFByb21pc2U9Zy5wcm9taXNlOmEuJG5nZkJsb2JVcmxQcm9taXNlPWcucHJvbWlzZSxmW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhW2Q/XCIkbmdmRGF0YVVybFByb21pc2VcIjpcIiRuZ2ZCbG9iVXJsUHJvbWlzZVwiXX0pLGZ9LGR9XSk7dmFyIGM9YW5ndWxhci5lbGVtZW50KFwiPHN0eWxlPi5uZ2YtaGlkZXtkaXNwbGF5Om5vbmUgIWltcG9ydGFudH08L3N0eWxlPlwiKTtkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoY1swXSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlNyY1wiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7YihhLGMsZCxlLGYsXCJuZ2ZTcmNcIixhLmF0dHJHZXR0ZXIoXCJuZ2ZSZXNpemVcIixmLGQpLCExKX19fV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZCYWNrZ3JvdW5kXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXtiKGEsYyxkLGUsZixcIm5nZkJhY2tncm91bmRcIixhLmF0dHJHZXR0ZXIoXCJuZ2ZSZXNpemVcIixmLGQpLCEwKX19fV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZUaHVtYm5haWxcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe3ZhciBnPWEuYXR0ckdldHRlcihcIm5nZlNpemVcIixmLGQpO2IoYSxjLGQsZSxmLFwibmdmVGh1bWJuYWlsXCIsZyxhLmF0dHJHZXR0ZXIoXCJuZ2ZBc0JhY2tncm91bmRcIixmLGQpKX19fV0pfSgpLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkVmFsaWRhdGVcIixbXCJVcGxvYWREYXRhVXJsXCIsXCIkcVwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChhKXtpZihhLmxlbmd0aD4yJiZcIi9cIj09PWFbMF0mJlwiL1wiPT09YVthLmxlbmd0aC0xXSlyZXR1cm4gYS5zdWJzdHJpbmcoMSxhLmxlbmd0aC0xKTt2YXIgYj1hLnNwbGl0KFwiLFwiKSxjPVwiXCI7aWYoYi5sZW5ndGg+MSlmb3IodmFyIGU9MDtlPGIubGVuZ3RoO2UrKyljKz1cIihcIitkKGJbZV0pK1wiKVwiLGU8Yi5sZW5ndGgtMSYmKGMrPVwifFwiKTtlbHNlIDA9PT1hLmluZGV4T2YoXCIuXCIpJiYoYT1cIipcIithKSxjPVwiXlwiK2EucmVwbGFjZShuZXcgUmVnRXhwKFwiWy5cXFxcXFxcXCsqP1xcXFxbXFxcXF5cXFxcXSQoKXt9PSE8Pnw6XFxcXC1dXCIsXCJnXCIpLFwiXFxcXCQmXCIpK1wiJFwiLGM9Yy5yZXBsYWNlKC9cXFxcXFwqL2csXCIuKlwiKS5yZXBsYWNlKC9cXFxcXFw/L2csXCIuXCIpO3JldHVybiBjfXZhciBlPWE7cmV0dXJuIGUucmVnaXN0ZXJWYWxpZGF0b3JzPWZ1bmN0aW9uKGEsYixjLGQpe2Z1bmN0aW9uIGYoYSl7YW5ndWxhci5mb3JFYWNoKGEuJG5nZlZhbGlkYXRpb25zLGZ1bmN0aW9uKGIpe2EuJHNldFZhbGlkaXR5KGIubmFtZSxiLnZhbGlkKX0pfWEmJihhLiRuZ2ZWYWxpZGF0aW9ucz1bXSxhLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oZyl7cmV0dXJuIGUuYXR0ckdldHRlcihcIm5nZlZhbGlkYXRlTGF0ZXJcIixjLGQpfHwhYS4kJG5nZlZhbGlkYXRlZD8oZS52YWxpZGF0ZShnLGEsYyxkLCExLGZ1bmN0aW9uKCl7ZihhKSxhLiQkbmdmVmFsaWRhdGVkPSExfSksZyYmMD09PWcubGVuZ3RoJiYoZz1udWxsKSwhYnx8bnVsbCE9ZyYmMCE9PWcubGVuZ3RofHxiLnZhbCgpJiZiLnZhbChudWxsKSk6KGYoYSksYS4kJG5nZlZhbGlkYXRlZD0hMSksZ30pKX0sZS52YWxpZGF0ZVBhdHRlcm49ZnVuY3Rpb24oYSxiKXtpZighYilyZXR1cm4hMDt2YXIgYz1uZXcgUmVnRXhwKGQoYiksXCJnaVwiKTtyZXR1cm4gbnVsbCE9YS50eXBlJiZjLnRlc3QoYS50eXBlLnRvTG93ZXJDYXNlKCkpfHxudWxsIT1hLm5hbWUmJmMudGVzdChhLm5hbWUudG9Mb3dlckNhc2UoKSl9LGUudmFsaWRhdGU9ZnVuY3Rpb24oYSxiLGMsZCxmLGcpe2Z1bmN0aW9uIGgoYyxkLGUpe2lmKGEpe2Zvcih2YXIgZj1cIm5nZlwiK2NbMF0udG9VcHBlckNhc2UoKStjLnN1YnN0cigxKSxnPWEubGVuZ3RoLGg9bnVsbDtnLS07KXt2YXIgaT1hW2ddLGs9aihmLHskZmlsZTppfSk7bnVsbD09ayYmKGs9ZChqKFwibmdmVmFsaWRhdGVcIil8fHt9KSxoPW51bGw9PWg/ITA6aCksbnVsbCE9ayYmKGUoaSxrKXx8KGkuJGVycm9yPWMsaS4kZXJyb3JQYXJhbT1rLGEuc3BsaWNlKGcsMSksaD0hMSkpfW51bGwhPT1oJiZiLiRuZ2ZWYWxpZGF0aW9ucy5wdXNoKHtuYW1lOmMsdmFsaWQ6aH0pfX1mdW5jdGlvbiBpKGMsZCxlLGYsaCl7aWYoYSl7dmFyIGk9MCxsPSExLG09XCJuZ2ZcIitjWzBdLnRvVXBwZXJDYXNlKCkrYy5zdWJzdHIoMSk7YT12b2lkIDA9PT1hLmxlbmd0aD9bYV06YSxhbmd1bGFyLmZvckVhY2goYSxmdW5jdGlvbihhKXtpZigwIT09YS50eXBlLnNlYXJjaChlKSlyZXR1cm4hMDt2YXIgbj1qKG0seyRmaWxlOmF9KXx8ZChqKFwibmdmVmFsaWRhdGVcIix7JGZpbGU6YX0pfHx7fSk7biYmKGsrKyxpKyssZihhLG4pLnRoZW4oZnVuY3Rpb24oYil7aChiLG4pfHwoYS4kZXJyb3I9YyxhLiRlcnJvclBhcmFtPW4sbD0hMCl9LGZ1bmN0aW9uKCl7aihcIm5nZlZhbGlkYXRlRm9yY2VcIix7JGZpbGU6YX0pJiYoYS4kZXJyb3I9YyxhLiRlcnJvclBhcmFtPW4sbD0hMCl9KVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtrLS0saS0tLGl8fGIuJG5nZlZhbGlkYXRpb25zLnB1c2goe25hbWU6Yyx2YWxpZDohbH0pLGt8fGcuY2FsbChiLGIuJG5nZlZhbGlkYXRpb25zKX0pKX0pfX1iPWJ8fHt9LGIuJG5nZlZhbGlkYXRpb25zPWIuJG5nZlZhbGlkYXRpb25zfHxbXSxhbmd1bGFyLmZvckVhY2goYi4kbmdmVmFsaWRhdGlvbnMsZnVuY3Rpb24oYSl7YS52YWxpZD0hMH0pO3ZhciBqPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGUuYXR0ckdldHRlcihhLGMsZCxiKX07aWYoZilyZXR1cm4gdm9pZCBnLmNhbGwoYik7aWYoYi4kJG5nZlZhbGlkYXRlZD0hMCxudWxsPT1hfHwwPT09YS5sZW5ndGgpcmV0dXJuIHZvaWQgZy5jYWxsKGIpO2lmKGE9dm9pZCAwPT09YS5sZW5ndGg/W2FdOmEuc2xpY2UoMCksaChcInBhdHRlcm5cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5wYXR0ZXJufSxlLnZhbGlkYXRlUGF0dGVybiksaChcIm1pblNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWlufSxmdW5jdGlvbihhLGIpe3JldHVybiBhLnNpemU+PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGgoXCJtYXhTaXplXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuc2l6ZSYmYS5zaXplLm1heH0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5zaXplPD1lLnRyYW5zbGF0ZVNjYWxhcnMoYil9KSxoKFwidmFsaWRhdGVGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGI9PT0hMHx8bnVsbD09PWJ8fFwiXCI9PT1ifSksIWEubGVuZ3RoKXJldHVybiB2b2lkIGcuY2FsbChiLGIuJG5nZlZhbGlkYXRpb25zKTt2YXIgaz0wO2koXCJtYXhIZWlnaHRcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5oZWlnaHQmJmEuaGVpZ2h0Lm1heH0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLmhlaWdodDw9Yn0pLGkoXCJtaW5IZWlnaHRcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5oZWlnaHQmJmEuaGVpZ2h0Lm1pbn0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLmhlaWdodD49Yn0pLGkoXCJtYXhXaWR0aFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLndpZHRoJiZhLndpZHRoLm1heH0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLndpZHRoPD1ifSksaShcIm1pbldpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg+PWJ9KSxpKFwicmF0aW9cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5yYXRpb30sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1iLnRvU3RyaW5nKCkuc3BsaXQoXCIsXCIpLGQ9ITEsZT0wO2U8Yy5sZW5ndGg7ZSsrKXt2YXIgZj1jW2VdLGc9Zi5zZWFyY2goL3gvaSk7Zj1nPi0xP3BhcnNlRmxvYXQoZi5zdWJzdHJpbmcoMCxnKSkvcGFyc2VGbG9hdChmLnN1YnN0cmluZyhnKzEpKTpwYXJzZUZsb2F0KGYpLE1hdGguYWJzKGEud2lkdGgvYS5oZWlnaHQtZik8MWUtNCYmKGQ9ITApfXJldHVybiBkfSksaShcIm1heER1cmF0aW9uXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuZHVyYXRpb24mJmEuZHVyYXRpb24ubWF4fSwvYXVkaW98dmlkZW8vLHRoaXMubWVkaWFEdXJhdGlvbixmdW5jdGlvbihhLGIpe3JldHVybiBhPD1lLnRyYW5zbGF0ZVNjYWxhcnMoYil9KSxpKFwibWluRHVyYXRpb25cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5kdXJhdGlvbiYmYS5kdXJhdGlvbi5taW59LC9hdWRpb3x2aWRlby8sdGhpcy5tZWRpYUR1cmF0aW9uLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE+PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGkoXCJ2YWxpZGF0ZUFzeW5jRm5cIixmdW5jdGlvbigpe3JldHVybiBudWxsfSwvLi8sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYn0sZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT0hMHx8bnVsbD09PWF8fFwiXCI9PT1hfSksa3x8Zy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpfSxlLmltYWdlRGltZW5zaW9ucz1mdW5jdGlvbihhKXtpZihhLndpZHRoJiZhLmhlaWdodCl7dmFyIGQ9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7ZC5yZXNvbHZlKHt3aWR0aDphLndpZHRoLGhlaWdodDphLmhlaWdodH0pfSksZC5wcm9taXNlfWlmKGEuJG5nZkRpbWVuc2lvblByb21pc2UpcmV0dXJuIGEuJG5nZkRpbWVuc2lvblByb21pc2U7dmFyIGY9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImltYWdlXCIpP3ZvaWQgZi5yZWplY3QoXCJub3QgaW1hZ2VcIik6dm9pZCBlLmRhdGFVcmwoYSkudGhlbihmdW5jdGlvbihiKXtmdW5jdGlvbiBkKCl7dmFyIGI9aFswXS5jbGllbnRXaWR0aCxjPWhbMF0uY2xpZW50SGVpZ2h0O2gucmVtb3ZlKCksYS53aWR0aD1iLGEuaGVpZ2h0PWMsZi5yZXNvbHZlKHt3aWR0aDpiLGhlaWdodDpjfSl9ZnVuY3Rpb24gZSgpe2gucmVtb3ZlKCksZi5yZWplY3QoXCJsb2FkIGVycm9yXCIpfWZ1bmN0aW9uIGcoKXtjKGZ1bmN0aW9uKCl7aFswXS5wYXJlbnROb2RlJiYoaFswXS5jbGllbnRXaWR0aD9kKCk6aT4xMD9lKCk6ZygpKX0sMWUzKX12YXIgaD1hbmd1bGFyLmVsZW1lbnQoXCI8aW1nPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwiaGlkZGVuXCIpLmNzcyhcInBvc2l0aW9uXCIsXCJmaXhlZFwiKTtoLm9uKFwibG9hZFwiLGQpLGgub24oXCJlcnJvclwiLGUpO3ZhciBpPTA7ZygpLGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0pLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtmLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2U9Zi5wcm9taXNlLGEuJG5nZkRpbWVuc2lvblByb21pc2VbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ZGVsZXRlIGEuJG5nZkRpbWVuc2lvblByb21pc2V9KSxhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlfSxlLm1lZGlhRHVyYXRpb249ZnVuY3Rpb24oYSl7aWYoYS5kdXJhdGlvbil7dmFyIGQ9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7ZC5yZXNvbHZlKGEuZHVyYXRpb24pfSksZC5wcm9taXNlfWlmKGEuJG5nZkR1cmF0aW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRHVyYXRpb25Qcm9taXNlO3ZhciBmPWIuZGVmZXIoKTtyZXR1cm4gYyhmdW5jdGlvbigpe3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJhdWRpb1wiKSYmMCE9PWEudHlwZS5pbmRleE9mKFwidmlkZW9cIik/dm9pZCBmLnJlamVjdChcIm5vdCBtZWRpYVwiKTp2b2lkIGUuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmR1cmF0aW9uO2EuZHVyYXRpb249YixoLnJlbW92ZSgpLGYucmVzb2x2ZShiKX1mdW5jdGlvbiBlKCl7aC5yZW1vdmUoKSxmLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2MoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmR1cmF0aW9uP2QoKTppPjEwP2UoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudCgwPT09YS50eXBlLmluZGV4T2YoXCJhdWRpb1wiKT9cIjxhdWRpbz5cIjpcIjx2aWRlbz5cIikuYXR0cihcInNyY1wiLGIpLmNzcyhcInZpc2liaWxpdHlcIixcIm5vbmVcIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkZWRtZXRhZGF0YVwiLGQpLGgub24oXCJlcnJvclwiLGUpO3ZhciBpPTA7ZygpLGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5hcHBlbmQoaCl9LGZ1bmN0aW9uKCl7Zi5yZWplY3QoXCJsb2FkIGVycm9yXCIpfSl9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2U9Zi5wcm9taXNlLGEuJG5nZkR1cmF0aW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRHVyYXRpb25Qcm9taXNlfSksYS4kbmdmRHVyYXRpb25Qcm9taXNlfSxlfV0pLG5nRmlsZVVwbG9hZC5zZXJ2aWNlKFwiVXBsb2FkUmVzaXplXCIsW1wiVXBsb2FkVmFsaWRhdGVcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLGU9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9TWF0aC5taW4oYy9hLGQvYik7cmV0dXJue3dpZHRoOmEqZSxoZWlnaHQ6YiplfX0sZj1mdW5jdGlvbihhLGMsZCxmLGcpe3ZhciBoPWIuZGVmZXIoKSxpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO3JldHVybiBqLm9ubG9hZD1mdW5jdGlvbigpe3RyeXt2YXIgYT1lKGoud2lkdGgsai5oZWlnaHQsYyxkKTtpLndpZHRoPWEud2lkdGgsaS5oZWlnaHQ9YS5oZWlnaHQ7dmFyIGI9aS5nZXRDb250ZXh0KFwiMmRcIik7Yi5kcmF3SW1hZ2UoaiwwLDAsYS53aWR0aCxhLmhlaWdodCksaC5yZXNvbHZlKGkudG9EYXRhVVJMKGd8fFwiaW1hZ2UvV2ViUFwiLGZ8fDEpKX1jYXRjaChrKXtoLnJlamVjdChrKX19LGoub25lcnJvcj1mdW5jdGlvbigpe2gucmVqZWN0KCl9LGouc3JjPWEsaC5wcm9taXNlfSxnPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1hLnNwbGl0KFwiLFwiKSxjPWJbMF0ubWF0Y2goLzooLio/KTsvKVsxXSxkPWF0b2IoYlsxXSksZT1kLmxlbmd0aCxmPW5ldyBVaW50OEFycmF5KGUpO2UtLTspZltlXT1kLmNoYXJDb2RlQXQoZSk7cmV0dXJuIG5ldyBCbG9iKFtmXSx7dHlwZTpjfSl9O3JldHVybiBkLmlzUmVzaXplU3VwcG9ydGVkPWZ1bmN0aW9uKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtyZXR1cm4gd2luZG93LmF0b2ImJmEuZ2V0Q29udGV4dCYmYS5nZXRDb250ZXh0KFwiMmRcIil9LGQucmVzaXplPWZ1bmN0aW9uKGEsZSxoLGkpe3ZhciBqPWIuZGVmZXIoKTtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/KGMoZnVuY3Rpb24oKXtqLnJlc29sdmUoXCJPbmx5IGltYWdlcyBhcmUgYWxsb3dlZCBmb3IgcmVzaXppbmchXCIpfSksai5wcm9taXNlKTooZC5kYXRhVXJsKGEsITApLnRoZW4oZnVuY3Rpb24oYil7ZihiLGUsaCxpLGEudHlwZSkudGhlbihmdW5jdGlvbihiKXt2YXIgYz1nKGIpO2MubmFtZT1hLm5hbWUsai5yZXNvbHZlKGMpfSxmdW5jdGlvbigpe2oucmVqZWN0KCl9KX0sZnVuY3Rpb24oKXtqLnJlamVjdCgpfSksai5wcm9taXNlKX0sZH1dKSxmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSxjLGQsZSxmLGcsaCxpKXtmdW5jdGlvbiBqKCl7cmV0dXJuIGMuYXR0cihcImRpc2FibGVkXCIpfHxuKFwibmdmRHJvcERpc2FibGVkXCIsYSl9ZnVuY3Rpb24gayhhLGIsYyxkKXt2YXIgZT1uKFwibmdmRHJhZ092ZXJDbGFzc1wiLGEseyRldmVudDpjfSksZj1uKFwibmdmRHJhZ092ZXJDbGFzc1wiKXx8XCJkcmFnb3ZlclwiO2lmKGFuZ3VsYXIuaXNTdHJpbmcoZSkpcmV0dXJuIHZvaWQgZChlKTtpZihlJiYoZS5kZWxheSYmKHI9ZS5kZWxheSksZS5hY2NlcHR8fGUucmVqZWN0KSl7dmFyIGc9Yy5kYXRhVHJhbnNmZXIuaXRlbXM7aWYobnVsbCE9Zylmb3IodmFyIGg9bihcIm5nZlBhdHRlcm5cIixhLHskZXZlbnQ6Y30pLGo9MDtqPGcubGVuZ3RoO2orKylpZihcImZpbGVcIj09PWdbal0ua2luZHx8XCJcIj09PWdbal0ua2luZCl7aWYoIWkudmFsaWRhdGVQYXR0ZXJuKGdbal0saCkpe2Y9ZS5yZWplY3Q7YnJlYWt9Zj1lLmFjY2VwdH19ZChmKX1mdW5jdGlvbiBsKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSxiLGMpe2lmKG51bGwhPWIpaWYoYi5pc0RpcmVjdG9yeSl7dmFyIGQ9KGN8fFwiXCIpK2IubmFtZTthLnB1c2goe25hbWU6Yi5uYW1lLHR5cGU6XCJkaXJlY3RvcnlcIixwYXRoOmR9KTt2YXIgZj1iLmNyZWF0ZVJlYWRlcigpLGc9W107aSsrO3ZhciBoPWZ1bmN0aW9uKCl7Zi5yZWFkRW50cmllcyhmdW5jdGlvbihkKXt0cnl7aWYoZC5sZW5ndGgpZz1nLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkfHxbXSwwKSksaCgpO2Vsc2V7Zm9yKHZhciBmPTA7ZjxnLmxlbmd0aDtmKyspZShhLGdbZl0sKGM/YzpcIlwiKStiLm5hbWUrXCIvXCIpO2ktLX19Y2F0Y2goail7aS0tLGNvbnNvbGUuZXJyb3Ioail9fSxmdW5jdGlvbigpe2ktLX0pfTtoKCl9ZWxzZSBpKyssYi5maWxlKGZ1bmN0aW9uKGIpe3RyeXtpLS0sYi5wYXRoPShjP2M6XCJcIikrYi5uYW1lLGEucHVzaChiKX1jYXRjaChkKXtpLS0sY29uc29sZS5lcnJvcihkKX19LGZ1bmN0aW9uKCl7aS0tfSl9dmFyIGY9W10saT0wLGo9YS5kYXRhVHJhbnNmZXIuaXRlbXM7aWYoaiYmai5sZW5ndGg+MCYmXCJmaWxlXCIhPT1oLnByb3RvY29sKCkpZm9yKHZhciBrPTA7azxqLmxlbmd0aDtrKyspe2lmKGpba10ud2Via2l0R2V0QXNFbnRyeSYmaltrXS53ZWJraXRHZXRBc0VudHJ5KCkmJmpba10ud2Via2l0R2V0QXNFbnRyeSgpLmlzRGlyZWN0b3J5KXt2YXIgbD1qW2tdLndlYmtpdEdldEFzRW50cnkoKTtpZihsLmlzRGlyZWN0b3J5JiYhYyljb250aW51ZTtudWxsIT1sJiZlKGYsbCl9ZWxzZXt2YXIgbT1qW2tdLmdldEFzRmlsZSgpO251bGwhPW0mJmYucHVzaChtKX1pZighZCYmZi5sZW5ndGg+MClicmVha31lbHNle3ZhciBuPWEuZGF0YVRyYW5zZmVyLmZpbGVzO2lmKG51bGwhPW4pZm9yKHZhciBvPTA7bzxuLmxlbmd0aCYmKGYucHVzaChuLml0ZW0obykpLGR8fCEoZi5sZW5ndGg+MCkpO28rKyk7fXZhciBwPTA7IWZ1bmN0aW9uIHEoYSl7ZyhmdW5jdGlvbigpe2lmKGkpMTAqcCsrPDJlNCYmcSgxMCk7ZWxzZXtpZighZCYmZi5sZW5ndGg+MSl7Zm9yKGs9MDtcImRpcmVjdG9yeVwiPT09ZltrXS50eXBlOylrKys7Zj1bZltrXV19YihmKX19LGF8fDApfSgpfXZhciBtPWIoKSxuPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gaS5hdHRyR2V0dGVyKGEsZCxiLGMpfTtpZihuKFwiZHJvcEF2YWlsYWJsZVwiKSYmZyhmdW5jdGlvbigpe2FbbihcImRyb3BBdmFpbGFibGVcIildP2FbbihcImRyb3BBdmFpbGFibGVcIildLnZhbHVlPW06YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV09bX0pLCFtKXJldHVybiB2b2lkKG4oXCJuZ2ZIaWRlT25Ecm9wTm90QXZhaWxhYmxlXCIsYSk9PT0hMCYmYy5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpKTtpLnJlZ2lzdGVyVmFsaWRhdG9ycyhlLG51bGwsZCxhKTt2YXIgbyxwPW51bGwscT1mKG4oXCJuZ2ZTdG9wUHJvcGFnYXRpb25cIikpLHI9MTtjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLGZ1bmN0aW9uKGIpe2lmKCFqKCkpe2lmKGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpLG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKT4tMSl7dmFyIGU9Yi5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZDtiLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0PVwibW92ZVwiPT09ZXx8XCJsaW5rTW92ZVwiPT09ZT9cIm1vdmVcIjpcImNvcHlcIn1nLmNhbmNlbChwKSxvfHwobz1cIkNcIixrKGEsZCxiLGZ1bmN0aW9uKGEpe289YSxjLmFkZENsYXNzKG8pfSkpfX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLGZ1bmN0aW9uKGIpe2ooKXx8KGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpKX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLGZ1bmN0aW9uKCl7aigpfHwocD1nKGZ1bmN0aW9uKCl7byYmYy5yZW1vdmVDbGFzcyhvKSxvPW51bGx9LHJ8fDEpKX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIixmdW5jdGlvbihiKXtqKCl8fChiLnByZXZlbnREZWZhdWx0KCkscShhKSYmYi5zdG9wUHJvcGFnYXRpb24oKSxvJiZjLnJlbW92ZUNsYXNzKG8pLG89bnVsbCxsKGIsZnVuY3Rpb24oYyl7aS51cGRhdGVNb2RlbChlLGQsYSxuKFwibmdmQ2hhbmdlXCIpfHxuKFwibmdmRHJvcFwiKSxjLGIpfSxuKFwibmdmQWxsb3dEaXJcIixhKSE9PSExLG4oXCJtdWx0aXBsZVwiKXx8bihcIm5nZk11bHRpcGxlXCIsYSkpKX0sITEpLGNbMF0uYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsZnVuY3Rpb24oYil7aWYoIWooKSl7dmFyIGM9W10sZj1iLmNsaXBib2FyZERhdGF8fGIub3JpZ2luYWxFdmVudC5jbGlwYm9hcmREYXRhO2lmKGYmJmYuaXRlbXMpe2Zvcih2YXIgZz0wO2c8Zi5pdGVtcy5sZW5ndGg7ZysrKS0xIT09Zi5pdGVtc1tnXS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSYmYy5wdXNoKGYuaXRlbXNbZ10uZ2V0QXNGaWxlKCkpO2kudXBkYXRlTW9kZWwoZSxkLGEsbihcIm5nZkNoYW5nZVwiKXx8bihcIm5nZkRyb3BcIiksYyxiKX19fSwhMSl9ZnVuY3Rpb24gYigpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7cmV0dXJuXCJkcmFnZ2FibGVcImluIGEmJlwib25kcm9wXCJpbiBhJiYhL0VkZ2VcXC8xMi4vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpfW5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZEcm9wXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGxvY2F0aW9uXCIsXCJVcGxvYWRcIixmdW5jdGlvbihiLGMsZCxlKXtyZXR1cm57cmVzdHJpY3Q6XCJBRUNcIixyZXF1aXJlOlwiP25nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGYsZyxoLGkpe2EoZixnLGgsaSxiLGMsZCxlKX19fV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZOb0ZpbGVEcm9wXCIsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYSxjKXtiKCkmJmMuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKX19KSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmRHJvcEF2YWlsYWJsZVwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gZnVuY3Rpb24oZSxmLGcpe2lmKGIoKSl7dmFyIGg9YShkLmF0dHJHZXR0ZXIoXCJuZ2ZEcm9wQXZhaWxhYmxlXCIsZykpO2MoZnVuY3Rpb24oKXtoKGUpLGguYXNzaWduJiZoLmFzc2lnbihlLCEwKX0pfX19XSl9KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9