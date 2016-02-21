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

        // @TODO - Implement Later
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
        .controller('CreateUserModalInstanceController', CreateUserModalInstanceController)
        .controller('CompanyVotesModalInstanceController', CompanyVotesModalInstanceController)
        .controller('FellowVotesModalInstanceController', FellowVotesModalInstanceController);

    EditUserModalInstanceController.$inject = ['$scope', '$modalInstance', 'user', 'name', 'User' ];
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

            console.log ( fellow.tags );

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImFsZXJ0cy9hbGVydC5tb2R1bGUuanMiLCJjb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImhvbWUvaG9tZS5tb2R1bGUuanMiLCJmZWxsb3dzL2ZlbGxvd3MubW9kdWxlLmpzIiwicHJvZmlsZS9wcm9maWxlLm1vZHVsZS5qcyIsInZvdGVzL3ZvdGVzLm1vZHVsZS5qcyIsImFsZXJ0cy9zZXJ2aWNlcy9hbGVydC5zZXJ2aWNlLmpzIiwiYWxlcnRzL2NvbnRyb2xsZXIvYWxlcnQuY29udHJvbGxlci5qcyIsImNvbXBhbmllcy9jb250cm9sbGVycy9jb21wYW5pZXMuY29udHJvbGxlci5qcyIsImNvbXBhbmllcy9jb250cm9sbGVycy9jb21wYW55LmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvc2VydmljZXMvY29tcGFuaWVzLnNlcnZpY2UuanMiLCJjb21wYW5pZXMvZGlyZWN0aXZlcy9jb21wYW55Q2FyZC5kaXJlY3RpdmUuanMiLCJob21lL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsImZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93LmNvbnRyb2xsZXIuanMiLCJmZWxsb3dzL2NvbnRyb2xsZXJzL2ZlbGxvd3MuY29udHJvbGxlci5qcyIsImZlbGxvd3MvZGlyZWN0aXZlcy9mZWxsb3dDYXJkLmRpcmVjdGl2ZS5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvYWRtaW5Qcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2NvbXBhbnlQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2ZlbGxvd3NQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL3Byb2ZpbGUuY29udHJvbGxlci5qcyIsImZlbGxvd3Mvc2VydmljZXMvZmVsbG93cy5zZXJ2aWNlLmpzIiwicHJvZmlsZS9zZXJ2aWNlcy9zMy5zZXJ2aWNlLmpzIiwicHJvZmlsZS9zZXJ2aWNlcy90YWdzLnNlcnZpY2UuanMiLCJwcm9maWxlL3NlcnZpY2VzL3VzZXIuc2VydmljZS5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2FkbWluVm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2NvbXBhbnlWb3Rlcy5jb250cm9sbGVyLmpzIiwidm90ZXMvY29udHJvbGxlcnMvZmVsbG93Vm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL3ZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9zZXJ2aWNlcy92b3Rlcy5zZXJ2aWNlLmpzIiwibmctZmlsZS11cGxvYWQubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckVBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBhcHAucm91dGVzXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXG4gKi9cblxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nQ29va2llcycsICAnbmdGaWxlVXBsb2FkJywgJ3VpLmJvb3RzdHJhcCcsXG4gICAgJ2FwcC5jb25maWcnLCAnYXBwLmhvbWUnLCAnYXBwLmNvbXBhbmllcycsICdhcHAuZmVsbG93cycsICdhcHAucHJvZmlsZScsICdhcHAudm90ZXMnLCAnYXBwLmFsZXJ0JyBdKVxuICAgIC5ydW4ocnVuKTtcblxuLyoqXG4gKiAgICogQG5hbWUgY29uZmlnXG4gKiAgICAgKiBAZGVzYyBEZWZpbmUgdmFsaWQgYXBwbGljYXRpb24gcm91dGVzXG4gKiAgICAgICAqL1xuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcblxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgLndoZW4oJy8nLCB7XG4gICAgICAgIGNvbnRyb2xsZXIgIDogJ0hvbWVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmwgOiAnc291cmNlL2FwcC9ob21lL2hvbWUuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvZmVsbG93cycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvZmVsbG93cy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9mZWxsb3dzLzpmZWxsb3dfaWQvOmZlbGxvd19uYW1lJywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvdy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9jb21wYW5pZXMnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW5pZXMuaHRtbCdcbiAgICB9KVxuICAgIC53aGVuKCcvY29tcGFuaWVzLzpjb21wYW55X2lkLzpjb21wYW55X25hbWUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55Q29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFueS5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3Byb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2FkbWluJywge1xuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLXByb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2ZlbGxvdy1wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9jb21wYW55Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvY29tcGFueS1wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCAnL3ZvdGVzJywge1xuICAgICAgICBjb250cm9sbGVyOiAnVm90ZXNDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3ZvdGVzL3BhcnRpYWxzL3ZvdGVzLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCAnL3ZvdGVzL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd1ZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy9mZWxsb3ctdm90ZXMuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oICcvdm90ZXMvY29tcGFueScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlWb3Rlc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvY29tcGFueS12b3Rlcy5odG1sJ1xuICAgIH0pXG5cbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1JvdXRpbmdDb250cm9sbGVyJywgUm91dGluZ0NvbnRyb2xsZXIpXG4uY29udHJvbGxlcignTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG5Sb3V0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJyR3aW5kb3cnLCAnVXNlcicsICckbG9jYXRpb24nLCAnJGFuY2hvclNjcm9sbCddO1xuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHdpbmRvdycsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJ107XG5cbmZ1bmN0aW9uIFJvdXRpbmdDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCAkd2luZG93LCBVc2VyLCAkbG9jYXRpb24sICRhbmNob3JTY3JvbGwpIHtcblxuICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IGZhbHNlO1xuICAgIHVwZGF0ZUxvZ2luU3RhdHVzKCk7XG5cbiAgICAkc2NvcGUuc2Nyb2xsVG8gPSBmdW5jdGlvbihpZCl7XG5cbiAgICAgICAgJGxvY2F0aW9uLmhhc2goaWQpO1xuICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxvZ2luU3RhdHVzKCl7XG5cbiAgICAgICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gVXNlci5pc1VzZXJMb2dnZWRJbigpO1xuICAgICAgICAkc2NvcGUuaXNVc2VyQWRtaW4gPSBVc2VyLmlzVXNlckFkbWluKCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2xvZ2luLXBhZ2UuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICBzaXplOiAnJ1xuICAgICAgICB9KTtcblxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHVwZGF0ZUxvZ2luU3RhdHVzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgICRzY29wZS5sb2dvdXRVc2VyID0gZnVuY3Rpb24oKXtcblxuICAgICAgICBVc2VyLkNsZWFyQ3JlZGVudGlhbHMoKTtcblxuICAgICAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckFkbWluID0gZmFsc2U7XG5cbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICR3aW5kb3csICRtb2RhbEluc3RhbmNlLCBVc2VyKSB7XG5cbiAgICAvLyBzYXZlIHRoaXMgdGhyb3VnaCBhIHJlZmVzaFxuICAgICRzY29wZS5sb2dpbkZvcm0gPSB7XG5cbiAgICAgICAgZW1haWw6IFwiXCIsXG4gICAgICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgICAgICBlcnJvcnM6IFtdXG4gICAgfTtcblxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKGxvZ2luRm9ybSkge1xuXG4gICAgICAgICRzY29wZS5sb2dpbkZvcm0uZXJyb3JzID0gW107XG5cbiAgICAgICAgVXNlci5sb2dpbihsb2dpbkZvcm0pLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAgICAgICAgIC8vVXNlci5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgICAgIFVzZXIuU2V0Q3JlZGVudGlhbHModXNlci5pZCwgdXNlci5lbWFpbCwgdXNlci51c2VyVHlwZSk7XG5cbiAgICAgICAgICAgIC8vJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcblxuICAgICAgICB9KS5lcnJvciggZnVuY3Rpb24oZXJyb3Ipe1xuXG4gICAgICAgICAgICAkc2NvcGUubG9naW5Gb3JtLmVycm9ycy5wdXNoKFwiSW52YWxpZCB1c2VyIGNyZWRlbnRpYWxzXCIpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIH07XG59XG5cblxucnVuLiRpbmplY3QgPSBbJyRjb29raWVTdG9yZScsICdVc2VyJ107XG5mdW5jdGlvbiBydW4oJGNvb2tpZVN0b3JlLCBVc2VyKXtcblxuICAgIC8vIGtlZXAgdXNlciBsb2dnZWQgaW4gYWZ0ZXIgcGFnZSByZWZyZXNoXG4gICAgdmFyIGN1cnJlbnRVc2VyID0gJGNvb2tpZVN0b3JlLmdldCgnZ2xvYmFscycpIHx8IHt9O1xuICAgIFVzZXIuc2V0Q3VycmVudFVzZXIoY3VycmVudFVzZXIpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XG4gICAgLy9pZiAoJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyKSB7XG4gICAgLy8gICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9ICdCYXNpYyAnICsgJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyLmF1dGhkYXRhOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAvL31cblxuICAgIC8vJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCBuZXh0LCBjdXJyZW50KSB7XG4gICAgLy8gICAgLy8gcmVkaXJlY3QgdG8gbG9naW4gcGFnZSBpZiBub3QgbG9nZ2VkIGluIGFuZCB0cnlpbmcgdG8gYWNjZXNzIGEgcmVzdHJpY3RlZCBwYWdlXG4gICAgLy8gICAgdmFyIHJlc3RyaWN0ZWRQYWdlID0gJC5pbkFycmF5KCRsb2NhdGlvbi5wYXRoKCksIFsnL2xvZ2luJywgJy9yZWdpc3RlciddKSA9PT0gLTE7XG4gICAgLy8gICAgdmFyIGxvZ2dlZEluID0gJHJvb3RTY29wZS5nbG9iYWxzLmN1cnJlbnRVc2VyO1xuICAgIC8vICAgIGlmIChyZXN0cmljdGVkUGFnZSAmJiAhbG9nZ2VkSW4pIHtcbiAgICAvLyAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgIC8vICAgIH1cbiAgICAvL30pO1xufVxuXG5cbi8qKlxuICogSGVscGVyIEZ1bmN0aW9uc1xuICoqL1xuXG52YXIgSEZIZWxwZXJzID0gSEZIZWxwZXJzIHx8IHt9O1xuXG5IRkhlbHBlcnMuaGVscGVycyA9IHtcblxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHN0ci50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJykgICAgICAgICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggLVxuICAgICAgICAgICAgLnJlcGxhY2UoL1teXFx3XFwtXSsvZywgJycpICAgICAgIC8vIFJlbW92ZSBhbGwgbm9uLXdvcmQgY2hhcnNcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC1cXC0rL2csICctJykgICAgICAgICAvLyBSZXBsYWNlIG11bHRpcGxlIC0gd2l0aCBzaW5nbGUgLVxuICAgICAgICAgICAgLnJlcGxhY2UoL14tKy8sICcnKSAgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XG4gICAgICAgICAgICAucmVwbGFjZSgvLSskLywgJycpOyAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIGVuZCBvZiB0ZXh0XG4gICAgfVxufTsiLCIvKipcbiAqIEEgcGxhY2UgdG8gcHV0IGFwcCB3aWRlIGNvbmZpZyBzdHVmZlxuICpcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSlcbiAgICAuY29uc3RhbnQoJ0NPTkZJRycsIHtcbiAgICAgICAgJ0FQUF9OQU1FJzogJ0hhY2tlciBGZWxsb3cgUG9ydGFsJyxcbiAgICAgICAgJ0FQUF9WRVJTSU9OJzogJzEuMCcsXG4gICAgICAgICdTRVJWSUNFX1VSTCc6ICcnXG4gICAgfSk7XG5cblxuLy92YXIgcm9vdFVybCA9ICdodHRwczovL3F1aWV0LWNvdmUtNjgzMC5oZXJva3VhcHAuY29tJztcbi8vIHZhciByb290VXJsID0gXCJodHRwczovL2JvaWxpbmctc3ByaW5ncy03NTIzLmhlcm9rdWFwcC5jb21cIjsiLCIvKipcbiAqIGFsZXJ0IG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQnLCBbXG4gICAgICAgICAgICAnYXBwLmFsZXJ0LmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAuYWxlcnQuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5jb250cm9sbGVycycsIFtdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuc2VydmljZXMnLCBbXSk7XG5cblxufSkoKTtcbiIsIi8qKlxuICogY29tcGFuaWVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcycsIFtcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJywgW10pO1xuXG4gIC8vIGRlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIGhvbWUgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZScsIFtcbiAgICAgICAgJ2FwcC5ob21lLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgLy8nYXBwLmhvbWUuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5kaXJlY3RpdmVzJywgW10pO1xuICAgIC8vaG93IGFib3V0IHRoaXNcbn0pKCk7XG4iLCIvKipcbiAqIGZlbGxvd3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cycsIFtcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcblxuXG59KSgpO1xuIiwiLyoqXG4gKiBwcm9maWxlIG1vZHVsZVxuICovXG5cbiAoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnXG4gICAgICAgICAgICBdKTtcblxuICAgICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICAgYW5ndWxhclxuICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIHZvdGVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzJywgW1xuXG4gICAgICAgICAgICAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAudm90ZXMuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycsIFtdKTtcblxuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5jb250cm9sbGVycycsIFtdKTtcblxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEFsZXJ0XG4gKiBAbmFtZXNwYWNlIGFwcC5hbGVydC5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ0FsZXJ0JywgQWxlcnQpO1xuXG4gICAgQWxlcnQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcblxuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEFsZXJ0XG4gICAgICovXG4gICAgZnVuY3Rpb24gQWxlcnQoICR0aW1lb3V0ICkge1xuXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFsZXJ0OiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvd0FsZXJ0OiBmdW5jdGlvbihuZXdNZXNzYWdlLCBuZXdUeXBlKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0Lm1lc3NhZ2UgPSBuZXdNZXNzYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQudHlwZSA9IG5ld1R5cGU7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5zaG93ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIEkgdGhpbmsgdGhpcyBpcyBvaz9cbiAgICAgICAgICAgICAgICAvLyBGb3Igc29tZSByZWFzb24gSSB3YW50ZWQgdGhlIGFsZXJ0IHRvIGF1dG8gY2xlYXIgYW5kIGNvdWxkbid0IGZpZ3VyZSBhXG4gICAgICAgICAgICAgICAgLy8gYmV0dGVyIHdheSB0byBoYXZlIGEgdGltZW91dCBhdXRvbWF0aWNhbGx5IGNsb3NlIHRoZSBhbGVydC4gSSBmZWVsIGxpa2VcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHNvbWUgc29ydCBvZiBzY29waW5nIHdlaXJkbmVzcyBnb2luZyBvbiBoZXJlLCBidXQgaXQgd29ya3MgYW5kIElcbiAgICAgICAgICAgICAgICAvLyBhbSB0aXJlZCwgc28gaXQgaXMgZ2V0dGluZyBjb21taXR0ZWQgOy1wXG4gICAgICAgICAgICAgICAgdmFyIGFsZXJ0ID0gdGhpcy5hbGVydDtcbiAgICAgICAgICAgICAgICAkdGltZW91dCggZnVuY3Rpb24oKXsgYWxlcnQuc2hvdyA9IGZhbHNlOyB9LCAgNTAwMCApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlQWxlcnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGVydC50eXBlID0gJ2luZm8nO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQuc2hvdyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBBbGVydENvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdBbGVydENvbnRyb2xsZXInLCBBbGVydENvbnRyb2xsZXIpO1xuXG4gICAgQWxlcnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdBbGVydCddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEFsZXJ0Q29udHJvbGxlciggJHNjb3BlLCBBbGVydCApIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5hbGVydCA9IEFsZXJ0LmFsZXJ0O1xuXG4gICAgICAgIC8vIENsb3NlIGFsZXJ0IHdpbmRvd1xuICAgICAgICAkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIEFsZXJ0LmNsb3NlQWxlcnQoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbmllc0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIENvbXBhbmllcykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBDb21wYW5pZXMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYW5pZXMgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG4gICAgICAgICdjb21wYW55JywgJ1ZvdGVzJywgJ1VzZXInXTtcblxuICAgIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgQ29tcGFueUNvbnRyb2xsZXIpO1xuXG4gICAgQ29tcGFueUNvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnQ29tcGFuaWVzJywgJ1VzZXInLCAnVm90ZXMnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlDb250cm9sbGVyKCAkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIENvbXBhbmllcywgVXNlciwgVm90ZXMsIEFsZXJ0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gW107XG4gICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSBbXTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgIENvbXBhbmllcy5nZXQoICRyb3V0ZVBhcmFtcy5jb21wYW55X2lkICkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFueSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIFVzZXIuZ2V0Vm90ZXMoIGNvbXBhbnkudXNlcl9pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gdm90ZXMudm90ZXNGb3I7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IHZvdGVzLnZvdGVzQ2FzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCAkc2NvcGUudm90ZXNGb3IubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHNjb3BlLnZvdGVzRm9yW2ldO1xuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50LmlkID09ICRzY29wZS5jdXJyZW50VXNlci5pZCApIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0ZlbGxvdyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAoICRzY29wZS5jdXJyZW50VXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGNvbXBhbnkpIHtcblxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmlzRmVsbG93KCkgKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gVm90ZXMuY3JlYXRlKCRzY29wZS5jdXJyZW50VXNlci5pZCwgY29tcGFueS51c2VyX2lkKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodm90ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b3RlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoIGVyci5kYXRhLCBcImluZm9cIiApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuKiBDb21wYW5pZXNcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLnNlcnZpY2VzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJylcbiAgICAuc2VydmljZSgnQ29tcGFuaWVzJywgQ29tcGFuaWVzKTtcblxuICBDb21wYW5pZXMuJGluamVjdCA9IFsnJGh0dHAnLCAnVXBsb2FkJywgJ0NPTkZJRyddO1xuXG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzXG4gICovXG4gIGZ1bmN0aW9uIENvbXBhbmllcygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcblxuICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFsbDogYWxsLFxuICAgICAgYWxsV2l0aFVzZXI6IGFsbFdpdGhVc2VyLFxuICAgICAgZ2V0OiBnZXQsXG4gICAgICBnZXRCeVVzZXJJZDogZ2V0QnlVc2VySWQsXG4gICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgIH07XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLyoqXG4gICAgICogQG5hbWUgYWxsXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWxsKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFsbFxuICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGNvbXBhbmllcyB3aXRoIHRoZWlyIHVzZXIgYWNjb3VudCBpbmZvXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWxsV2l0aFVzZXIoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvdXNlcnMnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXRcbiAgICAgKiBAZGVzYyBnZXQganVzdCBvbmUgY29tcGFueVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldChpZCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBwYXJzZUludChpZCkgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIEBuYW1lIGdldEJ5VXNlcklkXG4gICAgKiBAZGVzYyBnZXQganVzdCBvbmUgY29tcGFueSBieSB1c2VyIGlkXG4gICAgKi9cbiAgICBmdW5jdGlvbiBnZXRCeVVzZXJJZCh1c2VyX2lkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvdXNlcl9pZC8nICsgcGFyc2VJbnQodXNlcl9pZCkgKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgY29tcGFueSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUoY29tcGFueSkge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nLCBjb21wYW55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSB1cGRhdGVcbiAgICAgKiBAZGVzYyB1cGRhdGVzIGEgY29tcGFueSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cGRhdGUoY29tcGFueSkge1xuXG4gICAgICAvL3JldHVybiBVcGxvYWQudXBsb2FkKHtcbiAgICAgIC8vICB1cmw6IHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGNvbXBhbnkuaWQsXG4gICAgICAvLyAgZmllbGRzOiBjb21wYW55LFxuICAgICAgLy8gIGZpbGU6IGNvbXBhbnkuZmlsZSxcbiAgICAgIC8vICBtZXRob2Q6ICdQVVQnXG4gICAgICAvL1xuICAgICAgLy99KTtcblxuICAgICAgcmV0dXJuICRodHRwLnB1dChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBjb21wYW55LmlkLCBjb21wYW55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICogQGRlc2MgZGVzdHJveSBhIGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBpZCk7XG4gICAgfVxuICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBjb21wYW55Q2FyZCk7XG5cblxuICAgIGZ1bmN0aW9uIGNvbXBhbnlDYXJkKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2NhcmQuaHRtbCcvKixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgICAgICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIvKipcbiogSG9tZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmVsbG93cyddO1xuXG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcbiAgKi9cbiAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlLCBGZWxsb3dzKSB7XG5cbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvd3Mpe1xuXG4gICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgfSk7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgaG9tZSBjb250cm9sbGVyIScpO1xuICAgICAgLy9Ib21lLmFsbCgpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd0NvbnRyb2xsZXInLCBGZWxsb3dDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvdXRlUGFyYW1zJywgJyRzY29wZScsICckdGltZW91dCcsICdGZWxsb3dzJywgJ1VzZXInLCAnVm90ZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dDb250cm9sbGVyKCRyb3V0ZVBhcmFtcywgJHNjb3BlLCAkdGltZW91dCwgRmVsbG93cywgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS52b3Rlc0ZvciA9IFtdO1xuICAgICAgICAkc2NvcGUudm90ZXNDYXN0ID0gW107XG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICBGZWxsb3dzLmdldCggJHJvdXRlUGFyYW1zLmZlbGxvd19pZCApLnN1Y2Nlc3MoZnVuY3Rpb24gKGZlbGxvdykge1xuXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgICAgICBVc2VyLmdldFZvdGVzKCBmZWxsb3cudXNlcl9pZCApLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB2b3RlcyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gdm90ZXMudm90ZXNGb3I7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IHZvdGVzLnZvdGVzQ2FzdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCAkc2NvcGUudm90ZXNGb3IubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJHNjb3BlLnZvdGVzRm9yW2ldO1xuICAgICAgICAgICAgICAgIGlmKCBlbGVtZW50LmlkID09ICRzY29wZS5jdXJyZW50VXNlci5pZCApIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5pc0NvbXBhbnkgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gKCAkc2NvcGUuY3VycmVudFVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGZlbGxvdykge1xuXG4gICAgICAgICAgICBpZiAoICRzY29wZS5pc0NvbXBhbnkoKSApIHtcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIFZvdGVzLmNyZWF0ZSgkc2NvcGUuY3VycmVudFVzZXIuaWQsIGZlbGxvdy51c2VyX2lkKVxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodm90ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdm90ZSApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm90ZTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIrZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NDb250cm9sbGVyJywgRmVsbG93c0NvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdGZWxsb3dzJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93c0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIEZlbGxvd3MpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3dzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChmZWxsb3cpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlbGxvdztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmVsbG93cyBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyXG4gICAgICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICAgICAqL1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JyxcbiAgICAgICAgJ1ZvdGVzJywgJ1VzZXInLCAnJHRpbWVvdXQnXTtcblxuICAgIGZ1bmN0aW9uIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmZWxsb3csIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGZlbGxvdyk7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuZmVsbG93KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycpXG4gICAgLmRpcmVjdGl2ZSgnZmVsbG93Q2FyZCcsIGZlbGxvd0NhcmQpO1xuXG4gIC8vbmctZmVsbG93LWNhcmRcbiBmdW5jdGlvbiBmZWxsb3dDYXJkKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19jYXJkLmh0bWwnLyosXG4gICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgfSk7XG4gICAgICAgfSAqL1xuICAgIH07XG4gIH1cbn0pKCk7XG4iLCIvKipcbiogQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVDb250cm9sbGVyKTtcbiAgICAvLy5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICckbW9kYWwnLCAnVXNlcicsICdGZWxsb3dzJywgJ0NvbXBhbmllcyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBBZG1pblByb2ZpbGVDb250cm9sbGVyXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sICRtb2RhbCwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgLy8gUHJvYmFibHkgY2FuIGhhbmRsZSB0aGlzIGluIHRoZSByb3V0ZXMgb3Igd2l0aCBtaWRkbGV3YXJlIG9yIHNvbWUga2luZFxuICAgICAgICBpZiggIVVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIGN1cnJlbnQgdXNlciBpcyBhbiBBZG1pblxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJBZG1pblwiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IFtdO1xuICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gW107XG4gICAgICAgICRzY29wZS51c2VyTGlzdExvYWQgPSBmdW5jdGlvbigpIHtcblxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmZlbGxvd3MubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgRmVsbG93cy5hbGxXaXRoVXNlcigpLnN1Y2Nlc3MoZnVuY3Rpb24gKGZlbGxvd3MpIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggZmVsbG93cyApO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggJHNjb3BlLmNvbXBhbmllcy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgICAgICBDb21wYW5pZXMuYWxsV2l0aFVzZXIoKS5zdWNjZXNzKGZ1bmN0aW9uIChjb21wYW5pZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggY29tcGFuaWVzICk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IGNvbXBhbmllcztcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAkc2NvcGUudXNlckxpc3RMb2FkKCk7XG5cbiAgICAgICAgJHNjb3BlLmVkaXRGZWxsb3cgPSBmdW5jdGlvbihmZWxsb3cpe1xuXG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZWRpdC11c2VyLWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB1c2VyOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlbGxvdy51c2VyO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZlbGxvdy5maXJzdF9uYW1lK1wiIFwiK2ZlbGxvdy5sYXN0X25hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5mZWxsb3dWb3RlcyA9IGZ1bmN0aW9uKCBmZWxsb3cgKXtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9mZWxsb3ctdm90ZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdzogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnlWb3RlcyA9IGZ1bmN0aW9uKCBjb21wYW55ICl7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vY29tcGFueS12b3Rlcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFueTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBAVE9ETyAtIEltcGxlbWVudCBMYXRlclxuICAgICAgICAkc2NvcGUuYXJjaGl2ZUZlbGxvdyA9IGZ1bmN0aW9uKHVzZXIpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFyY2hpdmUgVXNlcjogXCIrdXNlci5pZCk7XG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmVkaXRDb21wYW55PSBmdW5jdGlvbihjb21wYW55KXtcblxuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2VkaXQtdXNlci1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0VXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21wYW55LnVzZXI7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFueS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLmFyY2hpdmVDb21wYW55ID0gZnVuY3Rpb24odXNlcil7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXJjaGl2ZSBVc2VyOiBcIit1c2VyLmlkKTtcbiAgICAgICAgICAgIC8vIHNlbmQgdXNlciBkYXRhIHRvIHNlcnZpY2VcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBZG1pbiBwcm9maWxlIHRhYnNcbiAgICAgICAgLy8kc2NvcGUudGFicyA9IFtcbiAgICAgICAgLy8gICAge1xuICAgICAgICAvLyAgICAgICAgdGl0bGU6J1VzZXIgTGlzdCcsXG4gICAgICAgIC8vICAgICAgICB0ZW1wbGF0ZTonc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL3VzZXItbGlzdC5odG1sJyxcbiAgICAgICAgLy8gICAgICAgIGFjdGlvbjogJHNjb3BlLnVzZXJMaXN0TG9hZFxuICAgICAgICAvLyAgICB9LFxuICAgICAgICAvLyAgICB7XG4gICAgICAgIC8vICAgICAgICB0aXRsZTonTmV3IFVzZXInLFxuICAgICAgICAvLyAgICAgICAgdGVtcGxhdGU6J3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9uZXctdXNlci1mb3JtLmh0bWwnLFxuICAgICAgICAvLyAgICAgICAgYWN0aW9uOiAkc2NvcGUudXNlckxpc3RMb2FkXG4gICAgICAgIC8vICAgIH0sXG4gICAgICAgIC8vICAgIHtcbiAgICAgICAgLy8gICAgICAgIHRpdGxlOidWb3RlcycsXG4gICAgICAgIC8vICAgICAgICB0ZW1wbGF0ZTonc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2FkbWluLXZvdGVzLmh0bWwnLFxuICAgICAgICAvLyAgICAgICAgYWN0aW9uOiAkc2NvcGUudXNlckxpc3RMb2FkXG4gICAgICAgIC8vICAgIH1cbiAgICAgICAgLy9dO1xuXG4gICAgICAgIC8qIENyZWF0ZSBVc2VyICovXG4gICAgICAgICRzY29wZS5jcmVhdGVVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL25ldy11c2VyLWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgcHJldmlvdXMgaGlnaGxpZ2h0cyBpbiBjYXNlIGRhdGEgaXMgbm93IGNvcnJlY3RcbiAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgfTtcbiAgICAgICAgJHNjb3BlLnN3aXRjaFR5cGUgPSBmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XG5cbiAgICAgICAgICAgIGlmKCB1c2VyLnVzZXJUeXBlID09PSBcIkNvbXBhbnlcIiApe1xuXG4gICAgICAgICAgICAgICAgalF1ZXJ5KFwib3B0aW9uQ29tcGFueVwiKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25GZWxsb3dcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCB1c2VyLnVzZXJUeXBlID09PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZlbGxvdyBzZWxlY3Rpb25cIik7XG5cbiAgICAgICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25Db21wYW55XCIpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkZlbGxvd1wiKS5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiB1bkhpZ2hsaWdodEZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcImlucHV0XCIpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBqUXVlcnkoXCIjdXNlclR5cGVcIikucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGlnaGxpZ2h0UGFzc3dvcmRGaWVsZCgpe1xuXG4gICAgICAgICAgICBqUXVlcnkoXCIjcGFzc3dvcmRcIikuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaGlnaGxpZ2h0RW1haWxGaWVsZCgpe1xuXG4gICAgICAgICAgICBqUXVlcnkoXCJlbWFpbFwiKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRVc2VyVHlwZUZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcInVzZXJUeXBlXCIpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBGZWxsb3dzIE1vZGFsIEluc3RhbmNlIENvbnRyb2xsZXJcbiAgICAgKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gICAgICovXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBFZGl0VXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcilcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEVkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ3VzZXInLCAnbmFtZScsICdVc2VyJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIHVzZXIsIG5hbWUsIFVzZXIpIHtcblxuICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICRzY29wZS5uYW1lID0gbmFtZTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGZlbGxvdyk7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgIFVzZXIudXBkYXRlKCRzY29wZS51c2VyKTtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLnVzZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcblxuXG4gICAgfVxuXG4gICAgRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JyBdO1xuICAgIGZ1bmN0aW9uIEZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoICRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdyApe1xuXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgLy8gQ2hlY2sgZmVsbG93IFZvdGVzRm9yIHRvIHNlZSBpZiBhIGNvbXBhbnkgdm90ZWQgZm9yIGEgZmVsbG93XG4gICAgICAgICRzY29wZS5jb21wYW55Vm90ZWRGb3JGZWxsb3cgPSBmdW5jdGlvbiggY29tcGFueV91c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgZmVsbG93LnVzZXIuVm90ZXNGb3IubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gZmVsbG93LnVzZXIuVm90ZXNGb3JbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0Nhc3QgdG8gc2VlIGlmIHRoZXkgdm90ZWQgZm9yIGEgY29tcGFueVxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZWRGb3JDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGZlbGxvdy51c2VyLlZvdGVzQ2FzdC5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBmZWxsb3cudXNlci5Wb3Rlc0Nhc3RbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55JyBdO1xuICAgIGZ1bmN0aW9uIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCAkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55ICl7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0Nhc3QgdG8gc2VlIGlmIHRoZXkgdm90ZWQgZm9yIGEgY29tcGFueVxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZWRGb3JDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbXBhbnkudXNlci5Wb3Rlc0Zvci5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBjb21wYW55LnVzZXIuVm90ZXNGb3JbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0ZvciB0byBzZWUgaWYgYSBjb21wYW55IHZvdGVkIGZvciBhIGZlbGxvd1xuICAgICAgICAkc2NvcGUuY29tcGFueVZvdGVkRm9yRmVsbG93ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbXBhbnkudXNlci5Wb3Rlc0Nhc3QubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gY29tcGFueS51c2VyLlZvdGVzQ2FzdFtpXTtcblxuICAgICAgICAgICAgICAgIGlmKCB2b3RlLmlkID09PSBjb21wYW55X3VzZXJfaWQgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJywgJ0ZlbGxvd3MnLCAnQ29tcGFuaWVzJyBdO1xuICAgIGZ1bmN0aW9uIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgXG4gICAgICAgIC8vY29uc29sZS5sb2coZmVsbG93KTtcblxuICAgICAgICAvLyAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcblxuICAgICAgICAvLyAgICAgVXNlci51cGRhdGUoJHNjb3BlLnVzZXIpO1xuXG4gICAgICAgIC8vICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUudXNlcik7XG4gICAgICAgIC8vIH07XG5cbiAgICAgICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uICh1c2VyKXtcbiAgICAgICAgICAgICAgICAvLyB1bkhpZ2hsaWdodEZpZWxkKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBldmVyeXRoaW5nIGlzIGdvb2QgbG9nIGRhdGEgYW5kIGNsb3NlLCBlbHNlIGhpZ2hsaWdodCBlcnJvclxuICAgICAgICAgICAgICAgIHZhciBlcnJvcnMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluIGNyZWF0ZS5cIik7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGluZm9cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vaGlnaGxpZ2h0IGFsbFxuICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHRFbWFpbEZpZWxkKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodFBhc3N3b3JkRmllbGQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVja2luZyBpbmZvLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIuZW1haWwpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYWQgZW1haWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBlbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0RW1haWxGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZih1c2VyLnBhc3N3b3JkKSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFkIHBhc3N3b3JkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9oaWdobGlnaHQgcGFzc3dvcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodFBhc3N3b3JkRmllbGQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGUgdXNlciB0eXBlIGlzXCIgKyB1c2VyLnVzZXJUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIudXNlclR5cGUpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYWQgdHlwZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaGlnaGxpZ2h0IGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInUgdHJ5bmEgY3JlYXRlIGJyYWg/XCIpO1xuICAgICAgICAgICAgICAgIGlmKCAhZXJyb3JzICl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCB1c2VyIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgICAgICAgICBVc2VyLmNyZWF0ZSh1c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJfaWQgPSByZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZlbGxvd19wb3N0ID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZlbGxvd3MuY3JlYXRlKGZlbGxvd19wb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGFueV9wb3N0ID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbXBhbmllcy5jcmVhdGUoY29tcGFueV9wb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICBcblxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuXG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdDb21wYW5pZXMnLCAnVXNlcicsICdUYWdzJywgJ0FsZXJ0J107XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIENvbXBhbmllcywgVXNlciwgVGFncywgQWxlcnQpIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgQ29tcGFueVxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJDb21wYW55XCIgKXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIENvbXBhbmllcy5nZXRCeVVzZXJJZChjdXJyZW50VXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbihjb21wYW55KXtcblxuICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24odGFncyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICAgICAgICAgIHRhZ3MuZm9yRWFjaChmdW5jdGlvbih0YWcpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogdGFnLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJChcInNlbGVjdCN0YWdzXCIpLnNlbGVjdDIoe1xuICAgICAgICAgICAgICAgICAgICAvL3RhZ3M6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuU2VwYXJhdG9yczogWycsJywnICddXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oY29tcGFueSkge1xuXG4gICAgICAgICAgICAvLyBnZXQgdGhlIHRhZ3MgZnJvbSB0aGUgZm9ybVxuICAgICAgICAgICAgLy9jb21wYW55LnRhZ3MgPSAkKFwiI3RhZ3NcIikudmFsKCk7XG4gICAgICAgICAgICB2YXIgdGFncyA9IFtdO1xuICAgICAgICAgICAgJCgnI3RhZ3MgOnNlbGVjdGVkJykuZWFjaChmdW5jdGlvbihpLCBzZWxlY3RlZCl7XG4gICAgICAgICAgICAgICAgdGFnc1tpXSA9ICQoc2VsZWN0ZWQpLnZhbCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbXBhbnkudGFncyA9IHRhZ3M7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgY29tcGFuaWVzIGluZm8gdG8gQVBJIHZpYSBTZXJ2aWNlXG4gICAgICAgICAgICBDb21wYW5pZXMudXBkYXRlKGNvbXBhbnkpLnN1Y2Nlc3MoZnVuY3Rpb24obmV3Q29tcGFueURhdGEpe1xuXG4gICAgICAgICAgICAgICAgLy8gKiogVHJpZ2dlciBTdWNjZXNzIG1lc3NhZ2UgaGVyZVxuICAgICAgICAgICAgICAgIGNvbXBhbnkgPSBuZXdDb21wYW55RGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIGhpZGUgdXBkYXRlIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWQtc3RhdHVzXCIpLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgIEFsZXJ0LnNob3dBbGVydCggJ1lvdXIgcHJvZmlsZSBoYXMgYmVlbiB1cGRhdGVkJywgJ3N1Y2Nlc3MnICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiogUzMgRmlsZSB1cGxvYWRpbmcgKiovXG4gICAgICAgICRzY29wZS5nZXRTM0tleSA9IGZ1bmN0aW9uKCl7XG5cblxuICAgICAgICAgICAgdmFyIGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlX2lucHV0XCIpLmZpbGVzO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcblxuICAgICAgICAgICAgaWYoZmlsZSA9PT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIk5vIGZpbGUgc2VsZWN0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIHByZXZlbnQgbmFtaW5nIGNvbGxpc2lvbnMgYnkgYXBwZW5kaW5nIHRoZSB1bmlxdWUgdXNlcl9pZCB0byBmaWxlIG5hbWVcbiAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICB2YXIgcGllY2VzID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gcGllY2VzLmpvaW4oXCIuXCIpICsgXCItXCIgKyAkc2NvcGUuY29tcGFueS51c2VyX2lkICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGUgPT09IDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRfZmlsZShmaWxlLCByZXNwb25zZS5zaWduZWRfcmVxdWVzdCwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBnZXQgc2lnbmVkIFVSTC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZF9maWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgU2V0IGltYWdlIHByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgY29tcGFueSBtb2RlbFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFueS5pbWFnZV91cmwgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICRzY29wZS5jb21wYW55ICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICckdGltZW91dCcsICdGZWxsb3dzJywgJ1RhZ3MnLCAnVXNlcicsICdTMycsICdBbGVydCcgXTtcblxuICAgIC8qKlxuICAgICogQG5hbWVzcGFjZSBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgJHRpbWVvdXQsIEZlbGxvd3MsIFRhZ3MsIFVzZXIsIFMzLCBBbGVydCApIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiB0aGUgcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvZiBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYSBGZWxsb3dcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiRmVsbG93XCIgKXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIEZlbGxvd3MuZ2V0QnlVc2VySWQoY3VycmVudFVzZXIuaWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZmVsbG93KXtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAgICAgJHNjb3BlLnRhZ3MgPSBbXTtcbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbih0YWdzKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS50YWdzID0gdGFncztcblxuICAgICAgICAgICAgICAgIC8vIGJpbmQgalF1ZXJ5IG11bHRpIHNlbGVjdFxuICAgICAgICAgICAgICAgIC8vIC0tIGFkZGVkIHRpbWVvdXQgdG8gbWFrZSBzdXJlIHRoZSAjdGFncyBzZWxlY3QgZWxlbWVudCBnZXRzIHBvcHVsYXRlZFxuICAgICAgICAgICAgICAgIC8vIC0tIEBUT0RPIC0tIEZpbmQgYSBiZXR0ZXIgd2F5IHRvIGFkZCBmdW5jdGlvbmFsaXR5IHRvIFRhZ3NcbiAgICAgICAgICAgICAgICAkdGltZW91dCggZnVuY3Rpb24oKXsgJChcIiN0YWdzXCIpLm11bHRpU2VsZWN0KHtcblxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RhYmxlSGVhZGVyOiAnQXZhaWxhYmxlIFNraWxscycsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkhlYWRlcjogJ1lvdXIgU2tpbGxzJ1xuXG4gICAgICAgICAgICAgICAgfSk7IH0sICA1MDAgKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbihmZWxsb3csIGZpbGUpIHtcblxuICAgICAgICAgICAgY29uc29sZS5sb2cgKCBmZWxsb3cudGFncyApO1xuXG4gICAgICAgICAgICAvLyBzZW5kIGZlbGxvd3MgaW5mbyB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgIEZlbGxvd3MudXBkYXRlKGZlbGxvdykuc3VjY2VzcyhmdW5jdGlvbihuZXdGZWxsb3dEYXRhKXtcblxuICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcbiAgICAgICAgICAgICAgICBmZWxsb3cgPSBuZXdGZWxsb3dEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gaGlkZSB1cGRhdGUgbWVzc2FnZVxuICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgQWxlcnQuc2hvd0FsZXJ0KCAnWW91ciBwcm9maWxlIGhhcyBiZWVuIHVwZGF0ZWQnLCAnc3VjY2VzcycgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKiBTMyBGaWxlIHVwbG9hZGluZyAqKi9cbiAgICAgICAgJHNjb3BlLmdldFMzS2V5ID0gZnVuY3Rpb24oKXtcblxuXG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVfaW5wdXRcIikuZmlsZXM7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVzWzBdO1xuXG4gICAgICAgICAgICBpZihmaWxlID09PSBudWxsKXtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiTm8gZmlsZSBzZWxlY3RlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLVwiICsgJHNjb3BlLmZlbGxvdy51c2VyX2lkICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGUgPT09IDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRfZmlsZShmaWxlLCByZXNwb25zZS5zaWduZWRfcmVxdWVzdCwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBnZXQgc2lnbmVkIFVSTC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZF9maWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgU2V0IGltYWdlIHByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgZmVsbG93IG1vZGVsXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3cuaW1hZ2VfdXJsID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIvKipcbiogUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlciddO1xuICAvKipcbiAgKiBAbmFtZXNwYWNlIFByb2ZpbGVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyKSB7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY3VycmVudCB1c2VyIGlzIFwiICsgY3VycmVudFVzZXIudXNlclR5cGUpO1xuICAgICAgICAgIC8vIHJlZGlyZWN0IHRoZSB1c2VyIGJhc2VkIG9uIHRoZWlyIHR5cGVcbiAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBib3NzXCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2FkbWluXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBmZWxsYVwiKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9mZWxsb3dcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScpIHtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkxpa2UgYSBjb21wYW55XCIpO1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2NvbXBhbnlcIik7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcblxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICB9XG5cbiAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd3NcbiAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3Muc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ0ZlbGxvd3MnLCBGZWxsb3dzKTtcblxuICAgIEZlbGxvd3MuJGluamVjdCA9IFsnJGh0dHAnLCAnVXBsb2FkJywgJ0NPTkZJRyddO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dzKCRodHRwLCBVcGxvYWQsIENPTkZJRykge1xuXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgZ2V0QnlVc2VySWQ6IGdldEJ5VXNlcklkLFxuICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICAgICAgfTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgZmVsbG93c1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWxsKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3Mgd2l0aCB0aGVpciB1c2VyIGFjY291bnQgaW5mb1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWxsV2l0aFVzZXIoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvdXNlcnMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXRcbiAgICAgICAgICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldChpZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0QnlVc2VySWRcbiAgICAgICAgICogQGRlc2MgZ2V0IG9uZSBmZWxsb3cgYnkgdXNlcl9pZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0QnlVc2VySWQodXNlcl9pZCkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzL3VzZXJfaWQvJyArIHVzZXJfaWQpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXG4gICAgICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKGZlbGxvdykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJywgZmVsbG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSB1cGRhdGVcbiAgICAgICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShmZWxsb3cpIHtcblxuICAgICAgICAgICAgLy9yZXR1cm4gVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICAvLyAgICB1cmw6IHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsXG4gICAgICAgICAgICAvLyAgICBmaWVsZHM6IGZlbGxvdyxcbiAgICAgICAgICAgIC8vICAgIGZpbGU6IGZlbGxvdy5maWxlLFxuICAgICAgICAgICAgLy8gICAgbWV0aG9kOiAnUFVUJ1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vfSk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBmZWxsb3cgKTtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLCBmZWxsb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAgICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBTM1xuICogQG5hbWVzcGFjZSBhcHAuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBAVE9ETyAtLSBJbXBsZW1lbnQgdGhlIFMzIHNlcnZpY2VcblxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdTMycsIFMzKTtcblxuICAgIFMzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBTM1xuICAgICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFMzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBnZXRTM0tleTogZ2V0UzNLZXksXG4gICAgICAgICAgICB1cGxvYWRGaWxlOiB1cGxvYWRGaWxlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBHZXQgdGhlIGltYWdlIGZpbGUgYW5kIHRyaWdnZXIgcmVxdWVzdCB0byBTM1xuICAgICAgICBmdW5jdGlvbiBnZXRTM0tleSggZmlsZSwgdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBpZihmaWxlICE9PSBudWxsKXtcblxuICAgICAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAgICAgLy8gLS0gcmVtb3ZlIGFuZCBzYXZlIHRoZSBleHRlbnNpb24gLSBzaG91bGQgYmUgdGhlIGxhc3QgcGFydFxuICAgICAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgdmFyIGV4dGVuc2lvbiA9IHBpZWNlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gdXNlcl9pZCArIFwiLVwiICsgcGllY2VzLmpvaW4oXCIuXCIpICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvc2lnbl9zMz9maWxlX25hbWU9XCIrZmlsZV9uYW1lK1wiJmZpbGVfdHlwZT1cIitmaWxlLnR5cGVcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0dWFsbHkgdXBsb2FkIHRoZSBuZXcgZmlsZSB0byBTM1xuICAgICAgICAvLyAtLSBwdXRzIHRoZSBuZXcgdXJsIGluIGEgaGlkZGVuIGZvcm0gZWxlbWVudFxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRGaWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICAvLyAqKiBUSElTIERPRVMgTk9UIFdPUksgKiovXG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG5cbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgICAgIHVybDogc2lnbmVkX3JlcXVlc3QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hbXotYWNsJzogJ3B1YmxpYy1yZWFkJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YTogZmlsZSxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmlsZS50eXBlXG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3ZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIC8veGhyLm9wZW4oXCJQVVRcIiwgc2lnbmVkX3JlcXVlc3QpO1xuICAgICAgICAgICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy94aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgLy8gICAgfVxuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8veGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICAvL307XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy94aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c1xuICogQG5hbWVzcGFjZSBhcHAuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1RhZ3MnLCBUYWdzKTtcblxuICAgIFRhZ3MuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFRhZ3NcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBUYWdzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIC8vY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgICAvL3VwZGF0ZTogdXBkYXRlLFxuICAgICAgICAgICAgLy9kZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdGFncycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJyArIGlkKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIC8vZnVuY3Rpb24gY3JlYXRlKGZlbGxvdykge1xuICAgICAgICAvLyAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nLCBmZWxsb3cpO1xuICAgICAgICAvL31cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICAvL2Z1bmN0aW9uIHVwZGF0ZShmZWxsb3csIGlkKSB7XG4gICAgICAgIC8vICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkLCBmZWxsb3cpO1xuICAgICAgICAvL31cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgLy9mdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICAgIC8vICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBQcm9maWxlXG4gKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnKVxuICAgIC5mYWN0b3J5KCdVc2VyJywgVXNlcik7XG5cbiAgVXNlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRjb29raWVTdG9yZScsICckaHR0cCcsICdDT05GSUcnXTtcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBVc2VyXG4gICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgKi9cbiAgZnVuY3Rpb24gVXNlcigkcm9vdFNjb3BlLCAkY29va2llU3RvcmUsICRodHRwLCBDT05GSUcpIHtcblxuICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgIC8vIFdpbGwgaG9sZCBpbmZvIGZvciB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XG5cbiAgICAgICAgICByZXR1cm4gY3VycmVudFVzZXI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VyKHVzZXIpIHtcblxuICAgICAgICAgIGN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0Vm90ZXMoIHVzZXJfaWQgKXtcblxuICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyB1c2VyX2lkICsgJy92b3RlcycgKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBsb2dpblxuICAgICAgICogQGRlc2MgbG9naW4gYSBuZXcgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gbG9naW4odXNlcikge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy9sb2dpbicsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgLy9hbGw6IGFsbCxcbiAgICAgICAgICAvL2dldDogZ2V0LFxuICAgICAgICAgIGdldFZvdGVzOiBnZXRWb3RlcyxcbiAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgLy9kZXN0cm95OiBkZXN0cm95XG4gICAgICAgICAgU2V0Q3JlZGVudGlhbHM6IFNldENyZWRlbnRpYWxzLFxuICAgICAgICAgIENsZWFyQ3JlZGVudGlhbHM6IENsZWFyQ3JlZGVudGlhbHMsXG4gICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxuICAgICAgICAgIHNldEN1cnJlbnRVc2VyOiBzZXRDdXJyZW50VXNlcixcbiAgICAgICAgICBpc1VzZXJMb2dnZWRJbjogaXNVc2VyTG9nZ2VkSW4sXG4gICAgICAgICAgaXNVc2VyQWRtaW46IGlzVXNlckFkbWluXG4gICAgICB9O1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSB1c2Vyc1xuICAgICAgICovXG4gICAgICAvL2Z1bmN0aW9uIGFsbCgpIHtcbiAgICAgIC8vXG4gICAgICAvLyAgICByZXR1cm4gW107XG4gICAgICAvL1xuICAgICAgLy8gICAgLy9yZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBnZXRcbiAgICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSB1c2VyXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICAvLyAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIG5ldyB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGUodXNlcikge1xuXG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2NyZWF0ZScsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICogQGRlc2MgdXBkYXRlYSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlci5pZCwgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICogQGRlc2MgZGVzdHJveSBhIHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgLy8gICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgcm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBpZCk7XG4gICAgICAvL31cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyTG9nZ2VkSW4oKXtcblxuICAgICAgICAgIC8vY29uc29sZS5sb2coY3VycmVudFVzZXIpO1xuICAgICAgICAgIGlmKCBPYmplY3Qua2V5cyhjdXJyZW50VXNlcikubGVuZ3RoID4gMCApe1xuXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyQWRtaW4oKXtcblxuICAgICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0FkbWluJyApXG4gICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIFNldENyZWRlbnRpYWxzKGlkLCB1c2VybmFtZSwgdXNlclR5cGUpIHtcblxuICAgICAgICAgIHZhciBhdXRoZGF0YSA9IEJhc2U2NC5lbmNvZGUoaWQgKyAnOicgKyB1c2VybmFtZSArICc6JyArIHVzZXJUeXBlKTtcblxuICAgICAgICAgIGN1cnJlbnRVc2VyID0ge1xuICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgdXNlclR5cGU6IHVzZXJUeXBlLFxuICAgICAgICAgICAgICBhdXRoZGF0YTogYXV0aGRhdGFcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgJGNvb2tpZVN0b3JlLnB1dCgnZ2xvYmFscycsIGN1cnJlbnRVc2VyKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gQ2xlYXJDcmVkZW50aWFscygpIHtcblxuICAgICAgICAgICRyb290U2NvcGUuZ2xvYmFscyA9IHt9O1xuICAgICAgICAgICRjb29raWVTdG9yZS5yZW1vdmUoJ2dsb2JhbHMnKTtcbiAgICAgIH1cblxuICB9XG5cbiAgLy8gQmFzZTY0IGVuY29kaW5nIHNlcnZpY2UgdXNlZCBieSBBdXRoZW50aWNhdGlvblNlcnZpY2VcbiAgdmFyIEJhc2U2NCA9IHtcblxuICAgIGtleVN0cjogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JyxcblxuICAgIGVuY29kZTogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcbiAgICAgIHZhciBlbmMxLCBlbmMyLCBlbmMzLCBlbmM0ID0gXCJcIjtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgZG8ge1xuICAgICAgICBjaHIxID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBjaHIyID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuICAgICAgICBjaHIzID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xuXG4gICAgICAgIGVuYzEgPSBjaHIxID4+IDI7XG4gICAgICAgIGVuYzIgPSAoKGNocjEgJiAzKSA8PCA0KSB8IChjaHIyID4+IDQpO1xuICAgICAgICBlbmMzID0gKChjaHIyICYgMTUpIDw8IDIpIHwgKGNocjMgPj4gNik7XG4gICAgICAgIGVuYzQgPSBjaHIzICYgNjM7XG5cbiAgICAgICAgaWYgKGlzTmFOKGNocjIpKSB7XG4gICAgICAgICAgZW5jMyA9IGVuYzQgPSA2NDtcbiAgICAgICAgfSBlbHNlIGlmIChpc05hTihjaHIzKSkge1xuICAgICAgICAgIGVuYzQgPSA2NDtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dHB1dCA9IG91dHB1dCArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzEpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMikgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMzKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzQpO1xuICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSBcIlwiO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gXCJcIjtcbiAgICAgIH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG5cbiAgICBkZWNvZGU6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgICB2YXIgY2hyMSwgY2hyMiwgY2hyMyA9IFwiXCI7XG4gICAgICB2YXIgZW5jMSwgZW5jMiwgZW5jMywgZW5jNCA9IFwiXCI7XG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIC8vIHJlbW92ZSBhbGwgY2hhcmFjdGVycyB0aGF0IGFyZSBub3QgQS1aLCBhLXosIDAtOSwgKywgLywgb3IgPVxuICAgICAgdmFyIGJhc2U2NHRlc3QgPSAvW15BLVphLXowLTlcXCtcXC9cXD1dL2c7XG4gICAgICBpZiAoYmFzZTY0dGVzdC5leGVjKGlucHV0KSkge1xuICAgICAgICB3aW5kb3cuYWxlcnQoXCJUaGVyZSB3ZXJlIGludmFsaWQgYmFzZTY0IGNoYXJhY3RlcnMgaW4gdGhlIGlucHV0IHRleHQuXFxuXCIgK1xuICAgICAgICAgICAgXCJWYWxpZCBiYXNlNjQgY2hhcmFjdGVycyBhcmUgQS1aLCBhLXosIDAtOSwgJysnLCAnLycsYW5kICc9J1xcblwiICtcbiAgICAgICAgICAgIFwiRXhwZWN0IGVycm9ycyBpbiBkZWNvZGluZy5cIik7XG4gICAgICB9XG4gICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCBcIlwiKTtcblxuICAgICAgZG8ge1xuICAgICAgICBlbmMxID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzIgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jMyA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmM0ID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG5cbiAgICAgICAgY2hyMSA9IChlbmMxIDw8IDIpIHwgKGVuYzIgPj4gNCk7XG4gICAgICAgIGNocjIgPSAoKGVuYzIgJiAxNSkgPDwgNCkgfCAoZW5jMyA+PiAyKTtcbiAgICAgICAgY2hyMyA9ICgoZW5jMyAmIDMpIDw8IDYpIHwgZW5jNDtcblxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjEpO1xuXG4gICAgICAgIGlmIChlbmMzICE9IDY0KSB7XG4gICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5jNCAhPSA2NCkge1xuICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMyk7XG4gICAgICAgIH1cblxuICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSBcIlwiO1xuICAgICAgICBlbmMxID0gZW5jMiA9IGVuYzMgPSBlbmM0ID0gXCJcIjtcblxuICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XG5cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuICB9O1xuXG59KSgpO1xuIiwiLyoqXG4gKiBBZG1pblZvdGVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudm90ZXMuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdBZG1pblZvdGVzQ29udHJvbGxlcicsIEFkbWluVm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBBZG1pblZvdGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJywgJ1ZvdGVzJyBdO1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZUNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBZG1pblZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBDb21wYW55Vm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ0NvbXBhbnlWb3Rlc0NvbnRyb2xsZXInLCBDb21wYW55Vm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBDb21wYW55Vm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlWb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgVm90ZXMuZ2V0KCAkc2NvcGUuY3VycmVudFVzZXIuaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3RlcyA9IHZvdGVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEZlbGxvd1ZvdGVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudm90ZXMuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdGZWxsb3dWb3Rlc0NvbnRyb2xsZXInLCBGZWxsb3dWb3Rlc0NvbnRyb2xsZXIgKTtcblxuICAgIEZlbGxvd1ZvdGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJywgJ1ZvdGVzJyBdO1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZUNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dWb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgVm90ZXMuZ2V0KCAkc2NvcGUuY3VycmVudFVzZXIuaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcblxuICAgICAgICAgICAgICAgICRzY29wZS52b3RlcyA9IHZvdGVzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSggJ2FwcC52b3Rlcy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ1ZvdGVzQ29udHJvbGxlcicsIFZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgVm90ZXNDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnVm90ZXMnIF07XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZvdGVzQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgLy8gcmVkaXJlY3QgdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgdHlwZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdm90ZXMvYWRtaW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9mZWxsb3dcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvdm90ZXMvY29tcGFueVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLnNlcnZpY2VzXG4gKi9cblxuLy8gQFRPRE8gLS0gSXMgdGhpcyBiZWluZyB1c2VkIHNvbWV3aGVyZT9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdWb3RlcycsIFZvdGVzKTtcblxuICAgIFZvdGVzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gVm90ZXMoJGh0dHAsIENPTkZJRykge1xuXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldCB2b3Rlc1xuICAgICAgICAgKiBAZGVzYyBnZXQgdGhlIHZvdGVzIGZvciBhIHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldCggdm90ZXJfaWQgKXtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJyArIHZvdGVyX2lkICk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAgICogQGRlc2MgY2FzdCBhIHZvdGUgZm9yIGEgdXNlclxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKCB2b3Rlcl9pZCwgdm90ZWVfaWQgKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHZvdGVyX2lkICsgXCIgXCIgKyB2b3RlZV9pZCApO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJywge1xuXG4gICAgICAgICAgICAgICAgdm90ZXJfaWQ6IHZvdGVyX2lkLFxuICAgICAgICAgICAgICAgIHZvdGVlX2lkOiB2b3RlZV9pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdm90ZSByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJyArIGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59KSgpO1xuXG4iLCIvKiEgNy4zLjQgKi9cbiF3aW5kb3cuWE1MSHR0cFJlcXVlc3R8fHdpbmRvdy5GaWxlQVBJJiZGaWxlQVBJLnNob3VsZExvYWR8fCh3aW5kb3cuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNldFJlcXVlc3RIZWFkZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7aWYoXCJfX3NldFhIUl9cIj09PWIpe3ZhciBkPWModGhpcyk7ZCBpbnN0YW5jZW9mIEZ1bmN0aW9uJiZkKHRoaXMpfWVsc2UgYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSh3aW5kb3cuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNldFJlcXVlc3RIZWFkZXIpKTt2YXIgbmdGaWxlVXBsb2FkPWFuZ3VsYXIubW9kdWxlKFwibmdGaWxlVXBsb2FkXCIsW10pO25nRmlsZVVwbG9hZC52ZXJzaW9uPVwiNy4zLjRcIixuZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZEJhc2VcIixbXCIkaHR0cFwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoZCl7ZnVuY3Rpb24gZyhhKXtqLm5vdGlmeSYmai5ub3RpZnkoYSksay5wcm9ncmVzc0Z1bmMmJmMoZnVuY3Rpb24oKXtrLnByb2dyZXNzRnVuYyhhKX0pfWZ1bmN0aW9uIGgoYSl7cmV0dXJuIG51bGwhPWQuX3N0YXJ0JiZmP3tsb2FkZWQ6YS5sb2FkZWQrZC5fc3RhcnQsdG90YWw6ZC5fZmlsZS5zaXplLHR5cGU6YS50eXBlLGNvbmZpZzpkLGxlbmd0aENvbXB1dGFibGU6ITAsdGFyZ2V0OmEudGFyZ2V0fTphfWZ1bmN0aW9uIGkoKXthKGQpLnRoZW4oZnVuY3Rpb24oYSl7ZC5fY2h1bmtTaXplJiYhZC5fZmluaXNoZWQ/KGcoe2xvYWRlZDpkLl9lbmQsdG90YWw6ZC5fZmlsZS5zaXplLGNvbmZpZzpkLHR5cGU6XCJwcm9ncmVzc1wifSksZS51cGxvYWQoZCkpOihkLl9maW5pc2hlZCYmZGVsZXRlIGQuX2ZpbmlzaGVkLGoucmVzb2x2ZShhKSl9LGZ1bmN0aW9uKGEpe2oucmVqZWN0KGEpfSxmdW5jdGlvbihhKXtqLm5vdGlmeShhKX0pfWQubWV0aG9kPWQubWV0aG9kfHxcIlBPU1RcIixkLmhlYWRlcnM9ZC5oZWFkZXJzfHx7fTt2YXIgaj1kLl9kZWZlcnJlZD1kLl9kZWZlcnJlZHx8Yi5kZWZlcigpLGs9ai5wcm9taXNlO3JldHVybiBkLmhlYWRlcnMuX19zZXRYSFJfPWZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGEpe2EmJihkLl9fWEhSPWEsZC54aHJGbiYmZC54aHJGbihhKSxhLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwicHJvZ3Jlc3NcIixmdW5jdGlvbihhKXthLmNvbmZpZz1kLGcoaChhKSl9LCExKSxhLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGZ1bmN0aW9uKGEpe2EubGVuZ3RoQ29tcHV0YWJsZSYmKGEuY29uZmlnPWQsZyhoKGEpKSl9LCExKSl9fSxmP2QuX2NodW5rU2l6ZSYmZC5fZW5kJiYhZC5fZmluaXNoZWQ/KGQuX3N0YXJ0PWQuX2VuZCxkLl9lbmQrPWQuX2NodW5rU2l6ZSxpKCkpOmQucmVzdW1lU2l6ZVVybD9hLmdldChkLnJlc3VtZVNpemVVcmwpLnRoZW4oZnVuY3Rpb24oYSl7ZC5fc3RhcnQ9ZC5yZXN1bWVTaXplUmVzcG9uc2VSZWFkZXI/ZC5yZXN1bWVTaXplUmVzcG9uc2VSZWFkZXIoYS5kYXRhKTpwYXJzZUludCgobnVsbD09YS5kYXRhLnNpemU/YS5kYXRhOmEuZGF0YS5zaXplKS50b1N0cmluZygpKSxkLl9jaHVua1NpemUmJihkLl9lbmQ9ZC5fc3RhcnQrZC5fY2h1bmtTaXplKSxpKCl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTpkLnJlc3VtZVNpemU/ZC5yZXN1bWVTaXplKCkudGhlbihmdW5jdGlvbihhKXtkLl9zdGFydD1hLGkoKX0sZnVuY3Rpb24oYSl7dGhyb3cgYX0pOmkoKTppKCksay5zdWNjZXNzPWZ1bmN0aW9uKGEpe3JldHVybiBrLnRoZW4oZnVuY3Rpb24oYil7YShiLmRhdGEsYi5zdGF0dXMsYi5oZWFkZXJzLGQpfSksa30say5lcnJvcj1mdW5jdGlvbihhKXtyZXR1cm4gay50aGVuKG51bGwsZnVuY3Rpb24oYil7YShiLmRhdGEsYi5zdGF0dXMsYi5oZWFkZXJzLGQpfSksa30say5wcm9ncmVzcz1mdW5jdGlvbihhKXtyZXR1cm4gay5wcm9ncmVzc0Z1bmM9YSxrLnRoZW4obnVsbCxudWxsLGZ1bmN0aW9uKGIpe2EoYil9KSxrfSxrLmFib3J0PWsucGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4gZC5fX1hIUiYmYyhmdW5jdGlvbigpe2QuX19YSFIuYWJvcnQoKX0pLGt9LGsueGhyPWZ1bmN0aW9uKGEpe3JldHVybiBkLnhockZuPWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbigpe2ImJmIuYXBwbHkoayxhcmd1bWVudHMpLGEuYXBwbHkoayxhcmd1bWVudHMpfX0oZC54aHJGbiksa30sa312YXIgZT10aGlzLGY9d2luZG93LkJsb2ImJihuZXcgQmxvYikuc2xpY2U7dGhpcy51cGxvYWQ9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihjLGQsZSl7aWYodm9pZCAwIT09ZClpZihhbmd1bGFyLmlzRGF0ZShkKSYmKGQ9ZC50b0lTT1N0cmluZygpKSxhbmd1bGFyLmlzU3RyaW5nKGQpKWMuYXBwZW5kKGUsZCk7ZWxzZSBpZihcImZvcm1cIj09PWEuc2VuZEZpZWxkc0FzKWlmKGFuZ3VsYXIuaXNPYmplY3QoZCkpZm9yKHZhciBmIGluIGQpZC5oYXNPd25Qcm9wZXJ0eShmKSYmYihjLGRbZl0sZStcIltcIitmK1wiXVwiKTtlbHNlIGMuYXBwZW5kKGUsZCk7ZWxzZSBkPWFuZ3VsYXIuaXNTdHJpbmcoZCk/ZDphbmd1bGFyLnRvSnNvbihkKSxcImpzb24tYmxvYlwiPT09YS5zZW5kRmllbGRzQXM/Yy5hcHBlbmQoZSxuZXcgQmxvYihbZF0se3R5cGU6XCJhcHBsaWNhdGlvbi9qc29uXCJ9KSk6Yy5hcHBlbmQoZSxkKX1mdW5jdGlvbiBjKGEpe3JldHVybiBhIGluc3RhbmNlb2YgQmxvYnx8YS5mbGFzaElkJiZhLm5hbWUmJmEuc2l6ZX1mdW5jdGlvbiBnKGIsZCxlKXtpZihjKGQpKXtpZihhLl9maWxlPWEuX2ZpbGV8fGQsbnVsbCE9YS5fc3RhcnQmJmYpe2EuX2VuZCYmYS5fZW5kPj1kLnNpemUmJihhLl9maW5pc2hlZD0hMCxhLl9lbmQ9ZC5zaXplKTt2YXIgaD1kLnNsaWNlKGEuX3N0YXJ0LGEuX2VuZHx8ZC5zaXplKTtoLm5hbWU9ZC5uYW1lLGQ9aCxhLl9jaHVua1NpemUmJihiLmFwcGVuZChcImNodW5rU2l6ZVwiLGEuX2VuZC1hLl9zdGFydCksYi5hcHBlbmQoXCJjaHVua051bWJlclwiLE1hdGguZmxvb3IoYS5fc3RhcnQvYS5fY2h1bmtTaXplKSksYi5hcHBlbmQoXCJ0b3RhbFNpemVcIixhLl9maWxlLnNpemUpKX1iLmFwcGVuZChlLGQsZC5maWxlTmFtZXx8ZC5uYW1lKX1lbHNle2lmKCFhbmd1bGFyLmlzT2JqZWN0KGQpKXRocm93XCJFeHBlY3RlZCBmaWxlIG9iamVjdCBpbiBVcGxvYWQudXBsb2FkIGZpbGUgb3B0aW9uOiBcIitkLnRvU3RyaW5nKCk7Zm9yKHZhciBpIGluIGQpaWYoZC5oYXNPd25Qcm9wZXJ0eShpKSl7dmFyIGo9aS5zcGxpdChcIixcIik7alsxXSYmKGRbaV0uZmlsZU5hbWU9alsxXS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpKSxnKGIsZFtpXSxqWzBdKX19fXJldHVybiBhLl9jaHVua1NpemU9ZS50cmFuc2xhdGVTY2FsYXJzKGEucmVzdW1lQ2h1bmtTaXplKSxhLl9jaHVua1NpemU9YS5fY2h1bmtTaXplP3BhcnNlSW50KGEuX2NodW5rU2l6ZS50b1N0cmluZygpKTpudWxsLGEuaGVhZGVycz1hLmhlYWRlcnN8fHt9LGEuaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXT12b2lkIDAsYS50cmFuc2Zvcm1SZXF1ZXN0PWEudHJhbnNmb3JtUmVxdWVzdD9hbmd1bGFyLmlzQXJyYXkoYS50cmFuc2Zvcm1SZXF1ZXN0KT9hLnRyYW5zZm9ybVJlcXVlc3Q6W2EudHJhbnNmb3JtUmVxdWVzdF06W10sYS50cmFuc2Zvcm1SZXF1ZXN0LnB1c2goZnVuY3Rpb24oYyl7dmFyIGQsZT1uZXcgRm9ybURhdGEsZj17fTtmb3IoZCBpbiBhLmZpZWxkcylhLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShkKSYmKGZbZF09YS5maWVsZHNbZF0pO2MmJihmLmRhdGE9Yyk7Zm9yKGQgaW4gZilpZihmLmhhc093blByb3BlcnR5KGQpKXt2YXIgaD1mW2RdO2EuZm9ybURhdGFBcHBlbmRlcj9hLmZvcm1EYXRhQXBwZW5kZXIoZSxkLGgpOmIoZSxoLGQpfWlmKG51bGwhPWEuZmlsZSlpZihhbmd1bGFyLmlzQXJyYXkoYS5maWxlKSlmb3IodmFyIGk9MDtpPGEuZmlsZS5sZW5ndGg7aSsrKWcoZSxhLmZpbGVbaV0sXCJmaWxlXCIpO2Vsc2UgZyhlLGEuZmlsZSxcImZpbGVcIik7cmV0dXJuIGV9KSxkKGEpfSx0aGlzLmh0dHA9ZnVuY3Rpb24oYil7cmV0dXJuIGIudHJhbnNmb3JtUmVxdWVzdD1iLnRyYW5zZm9ybVJlcXVlc3R8fGZ1bmN0aW9uKGIpe3JldHVybiB3aW5kb3cuQXJyYXlCdWZmZXImJmIgaW5zdGFuY2VvZiB3aW5kb3cuQXJyYXlCdWZmZXJ8fGIgaW5zdGFuY2VvZiBCbG9iP2I6YS5kZWZhdWx0cy50cmFuc2Zvcm1SZXF1ZXN0WzBdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sYi5fY2h1bmtTaXplPWUudHJhbnNsYXRlU2NhbGFycyhiLnJlc3VtZUNodW5rU2l6ZSksYi5fY2h1bmtTaXplPWIuX2NodW5rU2l6ZT9wYXJzZUludChiLl9jaHVua1NpemUudG9TdHJpbmcoKSk6bnVsbCxkKGIpfSx0aGlzLnRyYW5zbGF0ZVNjYWxhcnM9ZnVuY3Rpb24oYSl7aWYoYW5ndWxhci5pc1N0cmluZyhhKSl7aWYoYS5zZWFyY2goL2tiL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTMqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL21iL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTYqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2diL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTkqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2IvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KGEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9zL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvbS9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoNjAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL2gvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDM2MDAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSl9cmV0dXJuIGF9LHRoaXMuc2V0RGVmYXVsdHM9ZnVuY3Rpb24oYSl7dGhpcy5kZWZhdWx0cz1hfHx7fX0sdGhpcy5kZWZhdWx0cz17fSx0aGlzLnZlcnNpb249bmdGaWxlVXBsb2FkLnZlcnNpb259XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkUmVzaXplXCIsZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9ZDtyZXR1cm4gZS5nZXRBdHRyV2l0aERlZmF1bHRzPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPWFbYl0/YVtiXTpudWxsPT1lLmRlZmF1bHRzW2JdP2UuZGVmYXVsdHNbYl06ZS5kZWZhdWx0c1tiXS50b1N0cmluZygpfSxlLmF0dHJHZXR0ZXI9ZnVuY3Rpb24oYixjLGQsZSl7aWYoIWQpcmV0dXJuIHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpO3RyeXtyZXR1cm4gZT9hKHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpKShkLGUpOmEodGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYikpKGQpfWNhdGNoKGYpe2lmKGIuc2VhcmNoKC9taW58bWF4fHBhdHRlcm4vaSkpcmV0dXJuIHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpO3Rocm93IGZ9fSxlLnVwZGF0ZU1vZGVsPWZ1bmN0aW9uKGMsZCxmLGcsaCxpLGope2Z1bmN0aW9uIGsoKXt2YXIgaj1oJiZoLmxlbmd0aD9oWzBdOm51bGw7aWYoYyl7dmFyIGs9IWUuYXR0ckdldHRlcihcIm5nZk11bHRpcGxlXCIsZCxmKSYmIWUuYXR0ckdldHRlcihcIm11bHRpcGxlXCIsZCkmJiFvO2EoZS5hdHRyR2V0dGVyKFwibmdNb2RlbFwiLGQpKS5hc3NpZ24oZixrP2o6aCl9dmFyIGw9ZS5hdHRyR2V0dGVyKFwibmdmTW9kZWxcIixkKTtsJiZhKGwpLmFzc2lnbihmLGgpLGcmJmEoZykoZix7JGZpbGVzOmgsJGZpbGU6aiwkbmV3RmlsZXM6bSwkZHVwbGljYXRlRmlsZXM6biwkZXZlbnQ6aX0pLGIoZnVuY3Rpb24oKXt9KX1mdW5jdGlvbiBsKGEsYil7dmFyIGM9ZS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZCxmKTtpZighY3x8IWUuaXNSZXNpemVTdXBwb3J0ZWQoKSlyZXR1cm4gYigpO2Zvcih2YXIgZz1hLmxlbmd0aCxoPWZ1bmN0aW9uKCl7Zy0tLDA9PT1nJiZiKCl9LGk9ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2Euc3BsaWNlKGIsMSxjKSxoKCl9fSxqPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXtoKCksYS4kZXJyb3I9XCJyZXNpemVcIixhLiRlcnJvclBhcmFtPShiPyhiLm1lc3NhZ2U/Yi5tZXNzYWdlOmIpK1wiOiBcIjpcIlwiKSsoYSYmYS5uYW1lKX19LGs9MDtrPGEubGVuZ3RoO2srKyl7dmFyIGw9YVtrXTtsLiRlcnJvcnx8MCE9PWwudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/aCgpOmUucmVzaXplKGwsYy53aWR0aCxjLmhlaWdodCxjLnF1YWxpdHkpLnRoZW4oaShrKSxqKGwpKX19dmFyIG09aCxuPVtdLG89ZS5hdHRyR2V0dGVyKFwibmdmS2VlcFwiLGQsZik7aWYobz09PSEwKXtpZighaHx8IWgubGVuZ3RoKXJldHVybjt2YXIgcD0oYyYmYy4kbW9kZWxWYWx1ZXx8ZC4kJG5nZlByZXZGaWxlc3x8W10pLnNsaWNlKDApLHE9ITE7aWYoZS5hdHRyR2V0dGVyKFwibmdmS2VlcERpc3RpbmN0XCIsZCxmKT09PSEwKXtmb3IodmFyIHI9cC5sZW5ndGgscz0wO3M8aC5sZW5ndGg7cysrKXtmb3IodmFyIHQ9MDtyPnQ7dCsrKWlmKGhbc10ubmFtZT09PXBbdF0ubmFtZSl7bi5wdXNoKGhbc10pO2JyZWFrfXQ9PT1yJiYocC5wdXNoKGhbc10pLHE9ITApfWlmKCFxKXJldHVybjtoPXB9ZWxzZSBoPXAuY29uY2F0KGgpfWQuJCRuZ2ZQcmV2RmlsZXM9aCxqP2soKTplLnZhbGlkYXRlKGgsYyxkLGYsZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGQpLGZ1bmN0aW9uKCl7bChoLGZ1bmN0aW9uKCl7YihmdW5jdGlvbigpe2soKX0pfSl9KX0sZX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmU2VsZWN0XCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGNvbXBpbGVcIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGEsYixjLGQpe2Z1bmN0aW9uIGUoYSl7dmFyIGI9YS5tYXRjaCgvQW5kcm9pZFteXFxkXSooXFxkKylcXC4oXFxkKykvKTtpZihiJiZiLmxlbmd0aD4yKXt2YXIgYz1kLmRlZmF1bHRzLmFuZHJvaWRGaXhNaW5vclZlcnNpb258fDQ7cmV0dXJuIHBhcnNlSW50KGJbMV0pPDR8fHBhcnNlSW50KGJbMV0pPT09YyYmcGFyc2VJbnQoYlsyXSk8Y31yZXR1cm4tMT09PWEuaW5kZXhPZihcIkNocm9tZVwiKSYmLy4qV2luZG93cy4qU2FmYXJpLiovLnRlc3QoYSl9ZnVuY3Rpb24gZihhLGIsYyxkLGYsaCxpLGope2Z1bmN0aW9uIGsoKXtyZXR1cm5cImlucHV0XCI9PT1iWzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSYmYy50eXBlJiZcImZpbGVcIj09PWMudHlwZS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIGwoKXtyZXR1cm4gdChcIm5nZkNoYW5nZVwiKXx8dChcIm5nZlNlbGVjdFwiKX1mdW5jdGlvbiBtKGIpe2Zvcih2YXIgZT1iLl9fZmlsZXNffHxiLnRhcmdldCYmYi50YXJnZXQuZmlsZXMsZj1bXSxnPTA7ZzxlLmxlbmd0aDtnKyspZi5wdXNoKGVbZ10pO2oudXBkYXRlTW9kZWwoZCxjLGEsbCgpLGYubGVuZ3RoP2Y6bnVsbCxiKX1mdW5jdGlvbiBuKGEpe2lmKGIhPT1hKWZvcih2YXIgYz0wO2M8YlswXS5hdHRyaWJ1dGVzLmxlbmd0aDtjKyspe3ZhciBkPWJbMF0uYXR0cmlidXRlc1tjXTtcInR5cGVcIiE9PWQubmFtZSYmXCJjbGFzc1wiIT09ZC5uYW1lJiZcImlkXCIhPT1kLm5hbWUmJlwic3R5bGVcIiE9PWQubmFtZSYmKChudWxsPT1kLnZhbHVlfHxcIlwiPT09ZC52YWx1ZSkmJihcInJlcXVpcmVkXCI9PT1kLm5hbWUmJihkLnZhbHVlPVwicmVxdWlyZWRcIiksXCJtdWx0aXBsZVwiPT09ZC5uYW1lJiYoZC52YWx1ZT1cIm11bHRpcGxlXCIpKSxhLmF0dHIoZC5uYW1lLGQudmFsdWUpKX19ZnVuY3Rpb24gbygpe2lmKGsoKSlyZXR1cm4gYjt2YXIgYT1hbmd1bGFyLmVsZW1lbnQoJzxpbnB1dCB0eXBlPVwiZmlsZVwiPicpO3JldHVybiBuKGEpLGEuY3NzKFwidmlzaWJpbGl0eVwiLFwiaGlkZGVuXCIpLmNzcyhcInBvc2l0aW9uXCIsXCJhYnNvbHV0ZVwiKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpLmNzcyhcIndpZHRoXCIsXCIwcHhcIikuY3NzKFwiaGVpZ2h0XCIsXCIwcHhcIikuY3NzKFwiYm9yZGVyXCIsXCJub25lXCIpLmNzcyhcIm1hcmdpblwiLFwiMHB4XCIpLmNzcyhcInBhZGRpbmdcIixcIjBweFwiKS5hdHRyKFwidGFiaW5kZXhcIixcIi0xXCIpLGcucHVzaCh7ZWw6YixyZWY6YX0pLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYVswXSksYX1mdW5jdGlvbiBwKGMpe2lmKGIuYXR0cihcImRpc2FibGVkXCIpfHx0KFwibmdmU2VsZWN0RGlzYWJsZWRcIixhKSlyZXR1cm4hMTt2YXIgZD1xKGMpO3JldHVybiBudWxsIT1kP2Q6KHIoYyksZShuYXZpZ2F0b3IudXNlckFnZW50KT9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d1swXS5jbGljaygpfSwwKTp3WzBdLmNsaWNrKCksITEpfWZ1bmN0aW9uIHEoYSl7dmFyIGI9YS5jaGFuZ2VkVG91Y2hlc3x8YS5vcmlnaW5hbEV2ZW50JiZhLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXM7aWYoXCJ0b3VjaHN0YXJ0XCI9PT1hLnR5cGUpcmV0dXJuIHY9Yj9iWzBdLmNsaWVudFk6MCwhMDtpZihhLnN0b3BQcm9wYWdhdGlvbigpLGEucHJldmVudERlZmF1bHQoKSxcInRvdWNoZW5kXCI9PT1hLnR5cGUpe3ZhciBjPWI/YlswXS5jbGllbnRZOjA7aWYoTWF0aC5hYnMoYy12KT4yMClyZXR1cm4hMX19ZnVuY3Rpb24gcihiKXt3LnZhbCgpJiYody52YWwobnVsbCksai51cGRhdGVNb2RlbChkLGMsYSxsKCksbnVsbCxiLCEwKSl9ZnVuY3Rpb24gcyhhKXtpZih3JiYhdy5hdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIpKXtpZighd1swXS5wYXJlbnROb2RlKXJldHVybiB2b2lkKHc9bnVsbCk7YS5wcmV2ZW50RGVmYXVsdCgpLGEuc3RvcFByb3BhZ2F0aW9uKCksdy51bmJpbmQoXCJjbGlja1wiKTt2YXIgYj13LmNsb25lKCk7cmV0dXJuIHcucmVwbGFjZVdpdGgoYiksdz1iLHcuYXR0cihcIl9fbmdmX2llMTBfRml4X1wiLFwidHJ1ZVwiKSx3LmJpbmQoXCJjaGFuZ2VcIixtKSx3LmJpbmQoXCJjbGlja1wiLHMpLHdbMF0uY2xpY2soKSwhMX13LnJlbW92ZUF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIil9dmFyIHQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gai5hdHRyR2V0dGVyKGEsYyxiKX0sdT1bXTt1LnB1c2goYS4kd2F0Y2godChcIm5nZk11bHRpcGxlXCIpLGZ1bmN0aW9uKCl7dy5hdHRyKFwibXVsdGlwbGVcIix0KFwibmdmTXVsdGlwbGVcIixhKSl9KSksdS5wdXNoKGEuJHdhdGNoKHQoXCJuZ2ZDYXB0dXJlXCIpLGZ1bmN0aW9uKCl7dy5hdHRyKFwiY2FwdHVyZVwiLHQoXCJuZ2ZDYXB0dXJlXCIsYSkpfSkpLGMuJG9ic2VydmUoXCJhY2NlcHRcIixmdW5jdGlvbigpe3cuYXR0cihcImFjY2VwdFwiLHQoXCJhY2NlcHRcIikpfSksdS5wdXNoKGZ1bmN0aW9uKCl7Yy4kJG9ic2VydmVycyYmZGVsZXRlIGMuJCRvYnNlcnZlcnMuYWNjZXB0fSk7dmFyIHY9MCx3PWI7aygpfHwodz1vKCkpLHcuYmluZChcImNoYW5nZVwiLG0pLGsoKT9iLmJpbmQoXCJjbGlja1wiLHIpOmIuYmluZChcImNsaWNrIHRvdWNoc3RhcnQgdG91Y2hlbmRcIixwKSxqLnJlZ2lzdGVyVmFsaWRhdG9ycyhkLHcsYyxhKSwtMSE9PW5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFIDEwXCIpJiZ3LmJpbmQoXCJjbGlja1wiLHMpLGEuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2soKXx8dy5yZW1vdmUoKSxhbmd1bGFyLmZvckVhY2godSxmdW5jdGlvbihhKXthKCl9KX0pLGgoZnVuY3Rpb24oKXtmb3IodmFyIGE9MDthPGcubGVuZ3RoO2ErKyl7dmFyIGI9Z1thXTtkb2N1bWVudC5ib2R5LmNvbnRhaW5zKGIuZWxbMF0pfHwoZy5zcGxpY2UoYSwxKSxiLnJlZi5yZW1vdmUoKSl9fSksd2luZG93LkZpbGVBUEkmJndpbmRvdy5GaWxlQVBJLm5nZkZpeElFJiZ3aW5kb3cuRmlsZUFQSS5uZ2ZGaXhJRShiLHcsbSl9dmFyIGc9W107cmV0dXJue3Jlc3RyaWN0OlwiQUVDXCIscmVxdWlyZTpcIj9uZ01vZGVsXCIsbGluazpmdW5jdGlvbihlLGcsaCxpKXtmKGUsZyxoLGksYSxiLGMsZCl9fX1dKSxmdW5jdGlvbigpe2Z1bmN0aW9uIGEoYSl7cmV0dXJuXCJpbWdcIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1wiaW1hZ2VcIjpcImF1ZGlvXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cImF1ZGlvXCI6XCJ2aWRlb1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJ2aWRlb1wiOi8uL31mdW5jdGlvbiBiKGIsYyxkLGUsZixnLGgsaSl7ZnVuY3Rpb24gaihhKXt2YXIgZz1iLmF0dHJHZXR0ZXIoXCJuZ2ZOb09iamVjdFVybFwiLGYsZCk7Yi5kYXRhVXJsKGEsZylbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7YyhmdW5jdGlvbigpe3ZhciBiPShnP2EuZGF0YVVybDphLmJsb2JVcmwpfHxhLmRhdGFVcmw7aT9lLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIixcInVybCgnXCIrKGJ8fFwiXCIpK1wiJylcIik6ZS5hdHRyKFwic3JjXCIsYiksYj9lLnJlbW92ZUNsYXNzKFwibmdmLWhpZGVcIik6ZS5hZGRDbGFzcyhcIm5nZi1oaWRlXCIpfSl9KX1jKGZ1bmN0aW9uKCl7dmFyIGM9ZC4kd2F0Y2goZltnXSxmdW5jdGlvbihjKXt2YXIgZD1oO3JldHVyblwibmdmVGh1bWJuYWlsXCIhPT1nfHxkfHwoZD17d2lkdGg6ZVswXS5jbGllbnRXaWR0aCxoZWlnaHQ6ZVswXS5jbGllbnRIZWlnaHR9KSxhbmd1bGFyLmlzU3RyaW5nKGMpPyhlLnJlbW92ZUNsYXNzKFwibmdmLWhpZGVcIiksaT9lLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIixcInVybCgnXCIrYytcIicpXCIpOmUuYXR0cihcInNyY1wiLGMpKTp2b2lkKCFjfHwhYy50eXBlfHwwIT09Yy50eXBlLnNlYXJjaChhKGVbMF0pKXx8aSYmMCE9PWMudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/ZS5hZGRDbGFzcyhcIm5nZi1oaWRlXCIpOmQmJmIuaXNSZXNpemVTdXBwb3J0ZWQoKT9iLnJlc2l6ZShjLGQud2lkdGgsZC5oZWlnaHQsZC5xdWFsaXR5KS50aGVuKGZ1bmN0aW9uKGEpe2ooYSl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTpqKGMpKX0pO2QuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2MoKX0pfSl9bmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWREYXRhVXJsXCIsW1wiVXBsb2FkQmFzZVwiLFwiJHRpbWVvdXRcIixcIiRxXCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWE7cmV0dXJuIGQuZGF0YVVybD1mdW5jdGlvbihhLGQpe2lmKGQmJm51bGwhPWEuZGF0YVVybHx8IWQmJm51bGwhPWEuYmxvYlVybCl7dmFyIGU9Yy5kZWZlcigpO3JldHVybiBiKGZ1bmN0aW9uKCl7ZS5yZXNvbHZlKGQ/YS5kYXRhVXJsOmEuYmxvYlVybCl9KSxlLnByb21pc2V9dmFyIGY9ZD9hLiRuZ2ZEYXRhVXJsUHJvbWlzZTphLiRuZ2ZCbG9iVXJsUHJvbWlzZTtpZihmKXJldHVybiBmO3ZhciBnPWMuZGVmZXIoKTtyZXR1cm4gYihmdW5jdGlvbigpe2lmKHdpbmRvdy5GaWxlUmVhZGVyJiZhJiYoIXdpbmRvdy5GaWxlQVBJfHwtMT09PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOFwiKXx8YS5zaXplPDJlNCkmJighd2luZG93LkZpbGVBUEl8fC0xPT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5XCIpfHxhLnNpemU8NGU2KSl7dmFyIGM9d2luZG93LlVSTHx8d2luZG93LndlYmtpdFVSTDtpZihjJiZjLmNyZWF0ZU9iamVjdFVSTCYmIWQpe3ZhciBlO3RyeXtlPWMuY3JlYXRlT2JqZWN0VVJMKGEpfWNhdGNoKGYpe3JldHVybiB2b2lkIGIoZnVuY3Rpb24oKXthLmJsb2JVcmw9XCJcIixnLnJlamVjdCgpfSl9YihmdW5jdGlvbigpe2EuYmxvYlVybD1lLGUmJmcucmVzb2x2ZShlKX0pfWVsc2V7dmFyIGg9bmV3IEZpbGVSZWFkZXI7aC5vbmxvYWQ9ZnVuY3Rpb24oYyl7YihmdW5jdGlvbigpe2EuZGF0YVVybD1jLnRhcmdldC5yZXN1bHQsZy5yZXNvbHZlKGMudGFyZ2V0LnJlc3VsdCl9KX0saC5vbmVycm9yPWZ1bmN0aW9uKCl7YihmdW5jdGlvbigpe2EuZGF0YVVybD1cIlwiLGcucmVqZWN0KCl9KX0saC5yZWFkQXNEYXRhVVJMKGEpfX1lbHNlIGIoZnVuY3Rpb24oKXthW2Q/XCJkYXRhVXJsXCI6XCJibG9iVXJsXCJdPVwiXCIsZy5yZWplY3QoKX0pfSksZj1kP2EuJG5nZkRhdGFVcmxQcm9taXNlPWcucHJvbWlzZTphLiRuZ2ZCbG9iVXJsUHJvbWlzZT1nLnByb21pc2UsZltcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYVtkP1wiJG5nZkRhdGFVcmxQcm9taXNlXCI6XCIkbmdmQmxvYlVybFByb21pc2VcIl19KSxmfSxkfV0pO3ZhciBjPWFuZ3VsYXIuZWxlbWVudChcIjxzdHlsZT4ubmdmLWhpZGV7ZGlzcGxheTpub25lICFpbXBvcnRhbnR9PC9zdHlsZT5cIik7ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGNbMF0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZTcmNcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe2IoYSxjLGQsZSxmLFwibmdmU3JjXCIsYS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZixkKSwhMSl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmQmFja2dyb3VuZFwiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7YihhLGMsZCxlLGYsXCJuZ2ZCYWNrZ3JvdW5kXCIsYS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZixkKSwhMCl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmVGh1bWJuYWlsXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXt2YXIgZz1hLmF0dHJHZXR0ZXIoXCJuZ2ZTaXplXCIsZixkKTtiKGEsYyxkLGUsZixcIm5nZlRodW1ibmFpbFwiLGcsYS5hdHRyR2V0dGVyKFwibmdmQXNCYWNrZ3JvdW5kXCIsZixkKSl9fX1dKX0oKSxuZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZFZhbGlkYXRlXCIsW1wiVXBsb2FkRGF0YVVybFwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7aWYoYS5sZW5ndGg+MiYmXCIvXCI9PT1hWzBdJiZcIi9cIj09PWFbYS5sZW5ndGgtMV0pcmV0dXJuIGEuc3Vic3RyaW5nKDEsYS5sZW5ndGgtMSk7dmFyIGI9YS5zcGxpdChcIixcIiksYz1cIlwiO2lmKGIubGVuZ3RoPjEpZm9yKHZhciBlPTA7ZTxiLmxlbmd0aDtlKyspYys9XCIoXCIrZChiW2VdKStcIilcIixlPGIubGVuZ3RoLTEmJihjKz1cInxcIik7ZWxzZSAwPT09YS5pbmRleE9mKFwiLlwiKSYmKGE9XCIqXCIrYSksYz1cIl5cIithLnJlcGxhY2UobmV3IFJlZ0V4cChcIlsuXFxcXFxcXFwrKj9cXFxcW1xcXFxeXFxcXF0kKCl7fT0hPD58OlxcXFwtXVwiLFwiZ1wiKSxcIlxcXFwkJlwiKStcIiRcIixjPWMucmVwbGFjZSgvXFxcXFxcKi9nLFwiLipcIikucmVwbGFjZSgvXFxcXFxcPy9nLFwiLlwiKTtyZXR1cm4gY312YXIgZT1hO3JldHVybiBlLnJlZ2lzdGVyVmFsaWRhdG9ycz1mdW5jdGlvbihhLGIsYyxkKXtmdW5jdGlvbiBmKGEpe2FuZ3VsYXIuZm9yRWFjaChhLiRuZ2ZWYWxpZGF0aW9ucyxmdW5jdGlvbihiKXthLiRzZXRWYWxpZGl0eShiLm5hbWUsYi52YWxpZCl9KX1hJiYoYS4kbmdmVmFsaWRhdGlvbnM9W10sYS4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGcpe3JldHVybiBlLmF0dHJHZXR0ZXIoXCJuZ2ZWYWxpZGF0ZUxhdGVyXCIsYyxkKXx8IWEuJCRuZ2ZWYWxpZGF0ZWQ/KGUudmFsaWRhdGUoZyxhLGMsZCwhMSxmdW5jdGlvbigpe2YoYSksYS4kJG5nZlZhbGlkYXRlZD0hMX0pLGcmJjA9PT1nLmxlbmd0aCYmKGc9bnVsbCksIWJ8fG51bGwhPWcmJjAhPT1nLmxlbmd0aHx8Yi52YWwoKSYmYi52YWwobnVsbCkpOihmKGEpLGEuJCRuZ2ZWYWxpZGF0ZWQ9ITEpLGd9KSl9LGUudmFsaWRhdGVQYXR0ZXJuPWZ1bmN0aW9uKGEsYil7aWYoIWIpcmV0dXJuITA7dmFyIGM9bmV3IFJlZ0V4cChkKGIpLFwiZ2lcIik7cmV0dXJuIG51bGwhPWEudHlwZSYmYy50ZXN0KGEudHlwZS50b0xvd2VyQ2FzZSgpKXx8bnVsbCE9YS5uYW1lJiZjLnRlc3QoYS5uYW1lLnRvTG93ZXJDYXNlKCkpfSxlLnZhbGlkYXRlPWZ1bmN0aW9uKGEsYixjLGQsZixnKXtmdW5jdGlvbiBoKGMsZCxlKXtpZihhKXtmb3IodmFyIGY9XCJuZ2ZcIitjWzBdLnRvVXBwZXJDYXNlKCkrYy5zdWJzdHIoMSksZz1hLmxlbmd0aCxoPW51bGw7Zy0tOyl7dmFyIGk9YVtnXSxrPWooZix7JGZpbGU6aX0pO251bGw9PWsmJihrPWQoaihcIm5nZlZhbGlkYXRlXCIpfHx7fSksaD1udWxsPT1oPyEwOmgpLG51bGwhPWsmJihlKGksayl8fChpLiRlcnJvcj1jLGkuJGVycm9yUGFyYW09ayxhLnNwbGljZShnLDEpLGg9ITEpKX1udWxsIT09aCYmYi4kbmdmVmFsaWRhdGlvbnMucHVzaCh7bmFtZTpjLHZhbGlkOmh9KX19ZnVuY3Rpb24gaShjLGQsZSxmLGgpe2lmKGEpe3ZhciBpPTAsbD0hMSxtPVwibmdmXCIrY1swXS50b1VwcGVyQ2FzZSgpK2Muc3Vic3RyKDEpO2E9dm9pZCAwPT09YS5sZW5ndGg/W2FdOmEsYW5ndWxhci5mb3JFYWNoKGEsZnVuY3Rpb24oYSl7aWYoMCE9PWEudHlwZS5zZWFyY2goZSkpcmV0dXJuITA7dmFyIG49aihtLHskZmlsZTphfSl8fGQoaihcIm5nZlZhbGlkYXRlXCIseyRmaWxlOmF9KXx8e30pO24mJihrKyssaSsrLGYoYSxuKS50aGVuKGZ1bmN0aW9uKGIpe2goYixuKXx8KGEuJGVycm9yPWMsYS4kZXJyb3JQYXJhbT1uLGw9ITApfSxmdW5jdGlvbigpe2ooXCJuZ2ZWYWxpZGF0ZUZvcmNlXCIseyRmaWxlOmF9KSYmKGEuJGVycm9yPWMsYS4kZXJyb3JQYXJhbT1uLGw9ITApfSlbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ay0tLGktLSxpfHxiLiRuZ2ZWYWxpZGF0aW9ucy5wdXNoKHtuYW1lOmMsdmFsaWQ6IWx9KSxrfHxnLmNhbGwoYixiLiRuZ2ZWYWxpZGF0aW9ucyl9KSl9KX19Yj1ifHx7fSxiLiRuZ2ZWYWxpZGF0aW9ucz1iLiRuZ2ZWYWxpZGF0aW9uc3x8W10sYW5ndWxhci5mb3JFYWNoKGIuJG5nZlZhbGlkYXRpb25zLGZ1bmN0aW9uKGEpe2EudmFsaWQ9ITB9KTt2YXIgaj1mdW5jdGlvbihhLGIpe3JldHVybiBlLmF0dHJHZXR0ZXIoYSxjLGQsYil9O2lmKGYpcmV0dXJuIHZvaWQgZy5jYWxsKGIpO2lmKGIuJCRuZ2ZWYWxpZGF0ZWQ9ITAsbnVsbD09YXx8MD09PWEubGVuZ3RoKXJldHVybiB2b2lkIGcuY2FsbChiKTtpZihhPXZvaWQgMD09PWEubGVuZ3RoP1thXTphLnNsaWNlKDApLGgoXCJwYXR0ZXJuXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEucGF0dGVybn0sZS52YWxpZGF0ZVBhdHRlcm4pLGgoXCJtaW5TaXplXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuc2l6ZSYmYS5zaXplLm1pbn0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5zaXplPj1lLnRyYW5zbGF0ZVNjYWxhcnMoYil9KSxoKFwibWF4U2l6ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnNpemUmJmEuc2l6ZS5tYXh9LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2l6ZTw9ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaChcInZhbGlkYXRlRm5cIixmdW5jdGlvbigpe3JldHVybiBudWxsfSxmdW5jdGlvbihhLGIpe3JldHVybiBiPT09ITB8fG51bGw9PT1ifHxcIlwiPT09Yn0pLCFhLmxlbmd0aClyZXR1cm4gdm9pZCBnLmNhbGwoYixiLiRuZ2ZWYWxpZGF0aW9ucyk7dmFyIGs9MDtpKFwibWF4SGVpZ2h0XCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuaGVpZ2h0JiZhLmhlaWdodC5tYXh9LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5oZWlnaHQ8PWJ9KSxpKFwibWluSGVpZ2h0XCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuaGVpZ2h0JiZhLmhlaWdodC5taW59LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5oZWlnaHQ+PWJ9KSxpKFwibWF4V2lkdGhcIixmdW5jdGlvbihhKXtyZXR1cm4gYS53aWR0aCYmYS53aWR0aC5tYXh9LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS53aWR0aDw9Yn0pLGkoXCJtaW5XaWR0aFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLndpZHRoJiZhLndpZHRoLm1pbn0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLndpZHRoPj1ifSksaShcInJhdGlvXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEucmF0aW99LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9Yi50b1N0cmluZygpLnNwbGl0KFwiLFwiKSxkPSExLGU9MDtlPGMubGVuZ3RoO2UrKyl7dmFyIGY9Y1tlXSxnPWYuc2VhcmNoKC94L2kpO2Y9Zz4tMT9wYXJzZUZsb2F0KGYuc3Vic3RyaW5nKDAsZykpL3BhcnNlRmxvYXQoZi5zdWJzdHJpbmcoZysxKSk6cGFyc2VGbG9hdChmKSxNYXRoLmFicyhhLndpZHRoL2EuaGVpZ2h0LWYpPDFlLTQmJihkPSEwKX1yZXR1cm4gZH0pLGkoXCJtYXhEdXJhdGlvblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmR1cmF0aW9uJiZhLmR1cmF0aW9uLm1heH0sL2F1ZGlvfHZpZGVvLyx0aGlzLm1lZGlhRHVyYXRpb24sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYTw9ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaShcIm1pbkR1cmF0aW9uXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuZHVyYXRpb24mJmEuZHVyYXRpb24ubWlufSwvYXVkaW98dmlkZW8vLHRoaXMubWVkaWFEdXJhdGlvbixmdW5jdGlvbihhLGIpe3JldHVybiBhPj1lLnRyYW5zbGF0ZVNjYWxhcnMoYil9KSxpKFwidmFsaWRhdGVBc3luY0ZuXCIsZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sLy4vLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJ9LGZ1bmN0aW9uKGEpe3JldHVybiBhPT09ITB8fG51bGw9PT1hfHxcIlwiPT09YX0pLGt8fGcuY2FsbChiLGIuJG5nZlZhbGlkYXRpb25zKX0sZS5pbWFnZURpbWVuc2lvbnM9ZnVuY3Rpb24oYSl7aWYoYS53aWR0aCYmYS5oZWlnaHQpe3ZhciBkPWIuZGVmZXIoKTtyZXR1cm4gYyhmdW5jdGlvbigpe2QucmVzb2x2ZSh7d2lkdGg6YS53aWR0aCxoZWlnaHQ6YS5oZWlnaHR9KX0pLGQucHJvbWlzZX1pZihhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlKXJldHVybiBhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlO3ZhciBmPWIuZGVmZXIoKTtyZXR1cm4gYyhmdW5jdGlvbigpe3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT92b2lkIGYucmVqZWN0KFwibm90IGltYWdlXCIpOnZvaWQgZS5kYXRhVXJsKGEpLnRoZW4oZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe3ZhciBiPWhbMF0uY2xpZW50V2lkdGgsYz1oWzBdLmNsaWVudEhlaWdodDtoLnJlbW92ZSgpLGEud2lkdGg9YixhLmhlaWdodD1jLGYucmVzb2x2ZSh7d2lkdGg6YixoZWlnaHQ6Y30pfWZ1bmN0aW9uIGUoKXtoLnJlbW92ZSgpLGYucmVqZWN0KFwibG9hZCBlcnJvclwiKX1mdW5jdGlvbiBnKCl7YyhmdW5jdGlvbigpe2hbMF0ucGFyZW50Tm9kZSYmKGhbMF0uY2xpZW50V2lkdGg/ZCgpOmk+MTA/ZSgpOmcoKSl9LDFlMyl9dmFyIGg9YW5ndWxhci5lbGVtZW50KFwiPGltZz5cIikuYXR0cihcInNyY1wiLGIpLmNzcyhcInZpc2liaWxpdHlcIixcImhpZGRlblwiKS5jc3MoXCJwb3NpdGlvblwiLFwiZml4ZWRcIik7aC5vbihcImxvYWRcIixkKSxoLm9uKFwiZXJyb3JcIixlKTt2YXIgaT0wO2coKSxhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdKS5hcHBlbmQoaCl9LGZ1bmN0aW9uKCl7Zi5yZWplY3QoXCJsb2FkIGVycm9yXCIpfSl9KSxhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlPWYucHJvbWlzZSxhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhLiRuZ2ZEaW1lbnNpb25Qcm9taXNlfSksYS4kbmdmRGltZW5zaW9uUHJvbWlzZX0sZS5tZWRpYUR1cmF0aW9uPWZ1bmN0aW9uKGEpe2lmKGEuZHVyYXRpb24pe3ZhciBkPWIuZGVmZXIoKTtyZXR1cm4gYyhmdW5jdGlvbigpe2QucmVzb2x2ZShhLmR1cmF0aW9uKX0pLGQucHJvbWlzZX1pZihhLiRuZ2ZEdXJhdGlvblByb21pc2UpcmV0dXJuIGEuJG5nZkR1cmF0aW9uUHJvbWlzZTt2YXIgZj1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiYXVkaW9cIikmJjAhPT1hLnR5cGUuaW5kZXhPZihcInZpZGVvXCIpP3ZvaWQgZi5yZWplY3QoXCJub3QgbWVkaWFcIik6dm9pZCBlLmRhdGFVcmwoYSkudGhlbihmdW5jdGlvbihiKXtmdW5jdGlvbiBkKCl7dmFyIGI9aFswXS5kdXJhdGlvbjthLmR1cmF0aW9uPWIsaC5yZW1vdmUoKSxmLnJlc29sdmUoYil9ZnVuY3Rpb24gZSgpe2gucmVtb3ZlKCksZi5yZWplY3QoXCJsb2FkIGVycm9yXCIpfWZ1bmN0aW9uIGcoKXtjKGZ1bmN0aW9uKCl7aFswXS5wYXJlbnROb2RlJiYoaFswXS5kdXJhdGlvbj9kKCk6aT4xMD9lKCk6ZygpKX0sMWUzKX12YXIgaD1hbmd1bGFyLmVsZW1lbnQoMD09PWEudHlwZS5pbmRleE9mKFwiYXVkaW9cIik/XCI8YXVkaW8+XCI6XCI8dmlkZW8+XCIpLmF0dHIoXCJzcmNcIixiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJub25lXCIpLmNzcyhcInBvc2l0aW9uXCIsXCJmaXhlZFwiKTtoLm9uKFwibG9hZGVkbWV0YWRhdGFcIixkKSxoLm9uKFwiZXJyb3JcIixlKTt2YXIgaT0wO2coKSxhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKGgpfSxmdW5jdGlvbigpe2YucmVqZWN0KFwibG9hZCBlcnJvclwiKX0pfSksYS4kbmdmRHVyYXRpb25Qcm9taXNlPWYucHJvbWlzZSxhLiRuZ2ZEdXJhdGlvblByb21pc2VbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7ZGVsZXRlIGEuJG5nZkR1cmF0aW9uUHJvbWlzZX0pLGEuJG5nZkR1cmF0aW9uUHJvbWlzZX0sZX1dKSxuZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZFJlc2l6ZVwiLFtcIlVwbG9hZFZhbGlkYXRlXCIsXCIkcVwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGIsYyl7dmFyIGQ9YSxlPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPU1hdGgubWluKGMvYSxkL2IpO3JldHVybnt3aWR0aDphKmUsaGVpZ2h0OmIqZX19LGY9ZnVuY3Rpb24oYSxjLGQsZixnKXt2YXIgaD1iLmRlZmVyKCksaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtyZXR1cm4gai5vbmxvYWQ9ZnVuY3Rpb24oKXt0cnl7dmFyIGE9ZShqLndpZHRoLGouaGVpZ2h0LGMsZCk7aS53aWR0aD1hLndpZHRoLGkuaGVpZ2h0PWEuaGVpZ2h0O3ZhciBiPWkuZ2V0Q29udGV4dChcIjJkXCIpO2IuZHJhd0ltYWdlKGosMCwwLGEud2lkdGgsYS5oZWlnaHQpLGgucmVzb2x2ZShpLnRvRGF0YVVSTChnfHxcImltYWdlL1dlYlBcIixmfHwxKSl9Y2F0Y2goayl7aC5yZWplY3Qoayl9fSxqLm9uZXJyb3I9ZnVuY3Rpb24oKXtoLnJlamVjdCgpfSxqLnNyYz1hLGgucHJvbWlzZX0sZz1mdW5jdGlvbihhKXtmb3IodmFyIGI9YS5zcGxpdChcIixcIiksYz1iWzBdLm1hdGNoKC86KC4qPyk7LylbMV0sZD1hdG9iKGJbMV0pLGU9ZC5sZW5ndGgsZj1uZXcgVWludDhBcnJheShlKTtlLS07KWZbZV09ZC5jaGFyQ29kZUF0KGUpO3JldHVybiBuZXcgQmxvYihbZl0se3R5cGU6Y30pfTtyZXR1cm4gZC5pc1Jlc2l6ZVN1cHBvcnRlZD1mdW5jdGlvbigpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cmV0dXJuIHdpbmRvdy5hdG9iJiZhLmdldENvbnRleHQmJmEuZ2V0Q29udGV4dChcIjJkXCIpfSxkLnJlc2l6ZT1mdW5jdGlvbihhLGUsaCxpKXt2YXIgaj1iLmRlZmVyKCk7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImltYWdlXCIpPyhjKGZ1bmN0aW9uKCl7ai5yZXNvbHZlKFwiT25seSBpbWFnZXMgYXJlIGFsbG93ZWQgZm9yIHJlc2l6aW5nIVwiKX0pLGoucHJvbWlzZSk6KGQuZGF0YVVybChhLCEwKS50aGVuKGZ1bmN0aW9uKGIpe2YoYixlLGgsaSxhLnR5cGUpLnRoZW4oZnVuY3Rpb24oYil7dmFyIGM9ZyhiKTtjLm5hbWU9YS5uYW1lLGoucmVzb2x2ZShjKX0sZnVuY3Rpb24oKXtqLnJlamVjdCgpfSl9LGZ1bmN0aW9uKCl7ai5yZWplY3QoKX0pLGoucHJvbWlzZSl9LGR9XSksZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEsYyxkLGUsZixnLGgsaSl7ZnVuY3Rpb24gaigpe3JldHVybiBjLmF0dHIoXCJkaXNhYmxlZFwiKXx8bihcIm5nZkRyb3BEaXNhYmxlZFwiLGEpfWZ1bmN0aW9uIGsoYSxiLGMsZCl7dmFyIGU9bihcIm5nZkRyYWdPdmVyQ2xhc3NcIixhLHskZXZlbnQ6Y30pLGY9bihcIm5nZkRyYWdPdmVyQ2xhc3NcIil8fFwiZHJhZ292ZXJcIjtpZihhbmd1bGFyLmlzU3RyaW5nKGUpKXJldHVybiB2b2lkIGQoZSk7aWYoZSYmKGUuZGVsYXkmJihyPWUuZGVsYXkpLGUuYWNjZXB0fHxlLnJlamVjdCkpe3ZhciBnPWMuZGF0YVRyYW5zZmVyLml0ZW1zO2lmKG51bGwhPWcpZm9yKHZhciBoPW4oXCJuZ2ZQYXR0ZXJuXCIsYSx7JGV2ZW50OmN9KSxqPTA7ajxnLmxlbmd0aDtqKyspaWYoXCJmaWxlXCI9PT1nW2pdLmtpbmR8fFwiXCI9PT1nW2pdLmtpbmQpe2lmKCFpLnZhbGlkYXRlUGF0dGVybihnW2pdLGgpKXtmPWUucmVqZWN0O2JyZWFrfWY9ZS5hY2NlcHR9fWQoZil9ZnVuY3Rpb24gbChhLGIsYyxkKXtmdW5jdGlvbiBlKGEsYixjKXtpZihudWxsIT1iKWlmKGIuaXNEaXJlY3Rvcnkpe3ZhciBkPShjfHxcIlwiKStiLm5hbWU7YS5wdXNoKHtuYW1lOmIubmFtZSx0eXBlOlwiZGlyZWN0b3J5XCIscGF0aDpkfSk7dmFyIGY9Yi5jcmVhdGVSZWFkZXIoKSxnPVtdO2krKzt2YXIgaD1mdW5jdGlvbigpe2YucmVhZEVudHJpZXMoZnVuY3Rpb24oZCl7dHJ5e2lmKGQubGVuZ3RoKWc9Zy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZHx8W10sMCkpLGgoKTtlbHNle2Zvcih2YXIgZj0wO2Y8Zy5sZW5ndGg7ZisrKWUoYSxnW2ZdLChjP2M6XCJcIikrYi5uYW1lK1wiL1wiKTtpLS19fWNhdGNoKGope2ktLSxjb25zb2xlLmVycm9yKGopfX0sZnVuY3Rpb24oKXtpLS19KX07aCgpfWVsc2UgaSsrLGIuZmlsZShmdW5jdGlvbihiKXt0cnl7aS0tLGIucGF0aD0oYz9jOlwiXCIpK2IubmFtZSxhLnB1c2goYil9Y2F0Y2goZCl7aS0tLGNvbnNvbGUuZXJyb3IoZCl9fSxmdW5jdGlvbigpe2ktLX0pfXZhciBmPVtdLGk9MCxqPWEuZGF0YVRyYW5zZmVyLml0ZW1zO2lmKGomJmoubGVuZ3RoPjAmJlwiZmlsZVwiIT09aC5wcm90b2NvbCgpKWZvcih2YXIgaz0wO2s8ai5sZW5ndGg7aysrKXtpZihqW2tdLndlYmtpdEdldEFzRW50cnkmJmpba10ud2Via2l0R2V0QXNFbnRyeSgpJiZqW2tdLndlYmtpdEdldEFzRW50cnkoKS5pc0RpcmVjdG9yeSl7dmFyIGw9altrXS53ZWJraXRHZXRBc0VudHJ5KCk7aWYobC5pc0RpcmVjdG9yeSYmIWMpY29udGludWU7bnVsbCE9bCYmZShmLGwpfWVsc2V7dmFyIG09altrXS5nZXRBc0ZpbGUoKTtudWxsIT1tJiZmLnB1c2gobSl9aWYoIWQmJmYubGVuZ3RoPjApYnJlYWt9ZWxzZXt2YXIgbj1hLmRhdGFUcmFuc2Zlci5maWxlcztpZihudWxsIT1uKWZvcih2YXIgbz0wO288bi5sZW5ndGgmJihmLnB1c2gobi5pdGVtKG8pKSxkfHwhKGYubGVuZ3RoPjApKTtvKyspO312YXIgcD0wOyFmdW5jdGlvbiBxKGEpe2coZnVuY3Rpb24oKXtpZihpKTEwKnArKzwyZTQmJnEoMTApO2Vsc2V7aWYoIWQmJmYubGVuZ3RoPjEpe2ZvcihrPTA7XCJkaXJlY3RvcnlcIj09PWZba10udHlwZTspaysrO2Y9W2Zba11dfWIoZil9fSxhfHwwKX0oKX12YXIgbT1iKCksbj1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGkuYXR0ckdldHRlcihhLGQsYixjKX07aWYobihcImRyb3BBdmFpbGFibGVcIikmJmcoZnVuY3Rpb24oKXthW24oXCJkcm9wQXZhaWxhYmxlXCIpXT9hW24oXCJkcm9wQXZhaWxhYmxlXCIpXS52YWx1ZT1tOmFbbihcImRyb3BBdmFpbGFibGVcIildPW19KSwhbSlyZXR1cm4gdm9pZChuKFwibmdmSGlkZU9uRHJvcE5vdEF2YWlsYWJsZVwiLGEpPT09ITAmJmMuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKSk7aS5yZWdpc3RlclZhbGlkYXRvcnMoZSxudWxsLGQsYSk7dmFyIG8scD1udWxsLHE9ZihuKFwibmdmU3RvcFByb3BhZ2F0aW9uXCIpKSxyPTE7Y1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIixmdW5jdGlvbihiKXtpZighaigpKXtpZihiLnByZXZlbnREZWZhdWx0KCkscShhKSYmYi5zdG9wUHJvcGFnYXRpb24oKSxuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIik+LTEpe3ZhciBlPWIuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQ7Yi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdD1cIm1vdmVcIj09PWV8fFwibGlua01vdmVcIj09PWU/XCJtb3ZlXCI6XCJjb3B5XCJ9Zy5jYW5jZWwocCksb3x8KG89XCJDXCIsayhhLGQsYixmdW5jdGlvbihhKXtvPWEsYy5hZGRDbGFzcyhvKX0pKX19LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIixmdW5jdGlvbihiKXtqKCl8fChiLnByZXZlbnREZWZhdWx0KCkscShhKSYmYi5zdG9wUHJvcGFnYXRpb24oKSl9LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIixmdW5jdGlvbigpe2ooKXx8KHA9ZyhmdW5jdGlvbigpe28mJmMucmVtb3ZlQ2xhc3Mobyksbz1udWxsfSxyfHwxKSl9LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsZnVuY3Rpb24oYil7aigpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCksbyYmYy5yZW1vdmVDbGFzcyhvKSxvPW51bGwsbChiLGZ1bmN0aW9uKGMpe2kudXBkYXRlTW9kZWwoZSxkLGEsbihcIm5nZkNoYW5nZVwiKXx8bihcIm5nZkRyb3BcIiksYyxiKX0sbihcIm5nZkFsbG93RGlyXCIsYSkhPT0hMSxuKFwibXVsdGlwbGVcIil8fG4oXCJuZ2ZNdWx0aXBsZVwiLGEpKSl9LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLGZ1bmN0aW9uKGIpe2lmKCFqKCkpe3ZhciBjPVtdLGY9Yi5jbGlwYm9hcmREYXRhfHxiLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YTtpZihmJiZmLml0ZW1zKXtmb3IodmFyIGc9MDtnPGYuaXRlbXMubGVuZ3RoO2crKyktMSE9PWYuaXRlbXNbZ10udHlwZS5pbmRleE9mKFwiaW1hZ2VcIikmJmMucHVzaChmLml0ZW1zW2ddLmdldEFzRmlsZSgpKTtpLnVwZGF0ZU1vZGVsKGUsZCxhLG4oXCJuZ2ZDaGFuZ2VcIil8fG4oXCJuZ2ZEcm9wXCIpLGMsYil9fX0sITEpfWZ1bmN0aW9uIGIoKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVyblwiZHJhZ2dhYmxlXCJpbiBhJiZcIm9uZHJvcFwiaW4gYSYmIS9FZGdlXFwvMTIuL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KX1uZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmRHJvcFwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIiRsb2NhdGlvblwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYixjLGQsZSl7cmV0dXJue3Jlc3RyaWN0OlwiQUVDXCIscmVxdWlyZTpcIj9uZ01vZGVsXCIsbGluazpmdW5jdGlvbihmLGcsaCxpKXthKGYsZyxoLGksYixjLGQsZSl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmTm9GaWxlRHJvcFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGEsYyl7YigpJiZjLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIil9fSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkRyb3BBdmFpbGFibGVcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCJVcGxvYWRcIixmdW5jdGlvbihhLGMsZCl7cmV0dXJuIGZ1bmN0aW9uKGUsZixnKXtpZihiKCkpe3ZhciBoPWEoZC5hdHRyR2V0dGVyKFwibmdmRHJvcEF2YWlsYWJsZVwiLGcpKTtjKGZ1bmN0aW9uKCl7aChlKSxoLmFzc2lnbiYmaC5hc3NpZ24oZSwhMCl9KX19fV0pfSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==