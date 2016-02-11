/**
 * app.routes
 * @desc    contains the routes for the app
 */

 var app = angular.module('app', ['ngRoute', 'ngCookies',  'ngFileUpload', 'ui.bootstrap',
    'app.config', 'app.home', 'app.companies', 'app.fellows', 'app.profile', 'app.votes' ])
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
        templateUrl: 'source/app/votes/partials/fellow-votes.html'
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

    CompanyController.$inject = [ '$routeParams', '$scope', '$timeout', 'Companies', 'User', 'Votes'];

    /**
     * @namespace CompaniesController
     */
    function CompanyController( $routeParams, $scope, $timeout, Companies, User, Votes) {

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

                        console.log("success: "+vote);
                        return vote;
                    })
                    .catch(function (err) {

                        console.log("Error: "+err);
                    })
                    .finally(function () {

                        $timeout(function () {

                            console.log( 'done' );
                            $scope.loading = false;
                            $scope.done = true;

                        }, 1500);
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

      return Upload.upload({
        url: rootUrl + '/api/v1/companies/' + company.id,
        fields: company,
        file: company.file,
        method: 'PUT'

      });

      //return $http.put(rootUrl + '/api/v1/companies/' + id, company);
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

        return Upload.upload({
            url: rootUrl + '/api/v1/fellows/' + fellow.id,
            fields: fellow,
            file: fellow.file,
            method: 'PUT'

        });

		//return $http.put(rootUrl + '/api/v1/fellows/' + fellow.id, fellow);
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

    CompanyProfileController.$inject = ['$scope', '$location', 'Companies', 'User', 'Tags'];

    /**
    * @namespace CompanyProfileController
    */
    function CompanyProfileController($scope, $location, Companies, User, Tags) {
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

        $scope.update= function(company) {

            // get the tags from the form
            //company.tags = $("#tags").val();

            var tags = [];
            $('#tags :selected').each(function(i, selected){
                tags[i] = $(selected).val();
            });

            console.log( tags );

            company.tags = tags;

            // send companies info to API via Service
            Companies.update(company).success(function(newCompanyData){

                // ** Trigger Success message here
                company = newCompanyData;

                // hide update message
                $("#profile-photo").find(".upload-status").hide();
            });
        };

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

    FellowsProfileController.$inject = ['$scope', '$location', 'Fellows', 'Tags', 'User' ];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, Fellows, Tags, User ) {
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

                // https://github.com/angular-ui/ui-select2/blob/master/demo/app.js

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

            fellow.tags = $("#tags").val();

            // send fellows info to API via Service
            Fellows.update(fellow).success(function(newFellowData){

                // ** Trigger Success message here
                fellow = newFellowData;

                // hide update message
                $("#profile-photo").find(".upload-status").hide();
            });
        };

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

      return Upload.upload({
        url: rootUrl + '/api/v1/companies/' + company.id,
        fields: company,
        file: company.file,
        method: 'PUT'

      });

      //return $http.put(rootUrl + '/api/v1/companies/' + id, company);
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

        return Upload.upload({
            url: rootUrl + '/api/v1/fellows/' + fellow.id,
            fields: fellow,
            file: fellow.file,
            method: 'PUT'

        });

		//return $http.put(rootUrl + '/api/v1/fellows/' + fellow.id, fellow);
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
 * VotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'VotesController', VotesController );

    VotesController.$inject = [ '$scope', '$location', 'User' ];
    /**
     * @namespace VoteController
     */
    function VotesController($scope, $location, User) {

        var vm = this;

        if( User.isUserLoggedIn() ) {

            $scope.votesFor = [];
            $scope.votesCast = [];

            $scope.currentUser = User.getCurrentUser();

            User.getVotes( $scope.currentUser.id ).success( function( votes ){

                $scope.votesFor = votes.votesFor;
                $scope.votesCast = votes.votesCast;


                console.log( $scope.votesCast );
            });


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
     * @namespace CompanyVotes
     */
    function Votes($http, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {

            getVotes: getVotes,
            create: create,
            destroy: destroy
        };

        /**
         * @name get votes
         * @desc get the votes for a user
         */
        function getVotes( user_id ){

            return $http.get(rootUrl + '/api/v1/users/' + user_id + '/votes' );
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


/*! 7.3.9 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="7.3.9",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function g(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&f?{loaded:a.loaded+d._start,total:d._file.size,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){f&&d._chunkSize&&!d._finished?(g({loaded:d._end,total:d._file.size,config:d,type:"progress"}),e.upload(d)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,g(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,g(h(a)))},!1))}},f?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):i():i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},k}var e=this;this.isResumeSupported=function(){return window.Blob&&(new Blob).slice};var f=this.isResumeSupported();this.upload=function(a){function b(c,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))c.append(e,d);else if("form"===a.sendFieldsAs)if(angular.isObject(d))for(var f in d)d.hasOwnProperty(f)&&b(c,d[f],e+"["+f+"]");else c.append(e,d);else d=angular.isString(d)?d:angular.toJson(d),"json-blob"===a.sendFieldsAs?c.append(e,new Blob([d],{type:"application/json"})):c.append(e,d)}function c(a){return a instanceof Blob||a.flashId&&a.name&&a.size}function g(b,d,e){if(c(d)){if(a._file=a._file||d,null!=a._start&&f){a._end&&a._end>=d.size&&(a._finished=!0,a._end=d.size);var h=d.slice(a._start,a._end||d.size);h.name=d.name,d=h,a._chunkSize&&(b.append("chunkSize",a._end-a._start),b.append("chunkNumber",Math.floor(a._start/a._chunkSize)),b.append("totalSize",a._file.size))}b.append(e,d,d.fileName||d.name)}else{if(!angular.isObject(d))throw"Expected file object in Upload.upload file option: "+d.toString();for(var i in d)if(d.hasOwnProperty(i)){var j=i.split(",");j[1]&&(d[i].fileName=j[1].replace(/^\s+|\s+$/g,"")),g(b,d[i],j[0])}}}return a._chunkSize=e.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(c){var d,e=new FormData,f={};for(d in a.fields)a.fields.hasOwnProperty(d)&&(f[d]=a.fields[d]);c&&(f.data=c);for(d in f)if(f.hasOwnProperty(d)){var h=f[d];a.formDataAppender?a.formDataAppender(e,d,h):b(e,h,d)}if(null!=a.file)if(angular.isArray(a.file))for(var i=0;i<a.file.length;i++)g(e,a.file[i],"file");else g(e,a.file,"file");return e}),d(a)},this.http=function(b){return b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=e.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1e3*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1e6*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1e9*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","UploadResize",function(a,b,c,d){var e=d;return e.getAttrWithDefaults=function(a,b){return null!=a[b]?a[b]:null==e.defaults[b]?e.defaults[b]:e.defaults[b].toString()},e.attrGetter=function(b,c,d,e){if(!d)return this.getAttrWithDefaults(c,b);try{return e?a(this.getAttrWithDefaults(c,b))(d,e):a(this.getAttrWithDefaults(c,b))(d)}catch(f){if(b.search(/min|max|pattern/i))return this.getAttrWithDefaults(c,b);throw f}},e.updateModel=function(c,d,f,g,h,i,j){function k(){var j=h&&h.length?h[0]:null;if(c){var k=!e.attrGetter("ngfMultiple",d,f)&&!e.attrGetter("multiple",d)&&!p;a(e.attrGetter("ngModel",d)).assign(f,k?j:h)}var l=e.attrGetter("ngfModel",d);l&&a(l).assign(f,h),g&&a(g)(f,{$files:h,$file:j,$newFiles:m,$duplicateFiles:n,$event:i}),b(function(){})}function l(a,b){var c=e.attrGetter("ngfResize",d,f);if(!c||!e.isResizeSupported())return b();for(var g=a.length,h=function(){g--,0===g&&b()},i=function(b){return function(c){a.splice(b,1,c),h()}},j=function(a){return function(b){h(),a.$error="resize",a.$errorParam=(b?(b.message?b.message:b)+": ":"")+(a&&a.name)}},k=0;k<a.length;k++){var l=a[k];l.$error||0!==l.type.indexOf("image")?h():e.resize(l,c.width,c.height,c.quality).then(i(k),j(l))}}var m=h,n=[],o=(c&&c.$modelValue||d.$$ngfPrevFiles||[]).slice(0),p=e.attrGetter("ngfKeep",d,f);if(p===!0){if(!h||!h.length)return;var q=!1;if(e.attrGetter("ngfKeepDistinct",d,f)===!0){for(var r=o.length,s=0;s<h.length;s++){for(var t=0;r>t;t++)if(h[s].name===o[t].name){n.push(h[s]);break}t===r&&(o.push(h[s]),q=!0)}if(!q)return;h=o}else h=o.concat(h)}d.$$ngfPrevFiles=h,j?k():e.validate(h,c,d,f,e.attrGetter("ngfValidateLater",d),function(){l(h,function(){b(function(){k()})})});for(var u=o.length;u--;){var v=o[u];window.URL&&v.blobUrl&&(URL.revokeObjectURL(v.blobUrl),delete v.blobUrl)}},e}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"id"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');return n(a),a.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:a}),document.body.appendChild(a[0]),a}function p(c){if(b.attr("disabled")||t("ngfSelectDisabled",a))return!1;var d=q(c);return null!=d?d:(r(c),e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1)}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)},u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),j.registerValidators(d,w,c,a),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),a.$on("$destroy",function(){k()||w.remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.dataUrl:a.blobUrl)||a.dataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ngf-hide"):e.addClass("ngf-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;if("ngfThumbnail"===g&&(d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),0===d.width&&window.getComputedStyle)){var f=getComputedStyle(e[0]);d={width:parseInt(f.width.slice(0,-2)),height:parseInt(f.height.slice(0,-2))}}return angular.isString(c)?(e.removeClass("ngf-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ngf-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.dataUrl=function(a,d){if(d&&null!=a.dataUrl||!d&&null!=a.blobUrl){var e=c.defer();return b(function(){e.resolve(d?a.dataUrl:a.blobUrl)}),e.promise}var f=d?a.$ngfDataUrlPromise:a.$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!d){var e;try{e=c.createObjectURL(a)}catch(f){return void b(function(){a.blobUrl="",g.reject()})}b(function(){a.blobUrl=e,e&&g.resolve(e)})}else{var h=new FileReader;h.onload=function(c){b(function(){a.dataUrl=c.target.result,g.resolve(c.target.result)})},h.onerror=function(){b(function(){a.dataUrl="",g.reject()})},h.readAsDataURL(a)}}else b(function(){a[d?"dataUrl":"blobUrl"]="",g.reject()})}),f=d?a.$ngfDataUrlPromise=g.promise:a.$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[d?"$ngfDataUrlPromise":"$ngfBlobUrlPromise"]}),f},d}]);var c=angular.element("<style>.ngf-hide{display:none !important}</style>");document.getElementsByTagName("head")[0].appendChild(c[0]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){var b="",c=[];if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])b=a.substring(1,a.length-1);else{var e=a.split(",");if(e.length>1)for(var f=0;f<e.length;f++){var g=d(e[f]);g.regexp?(b+="("+g.regexp+")",f<e.length-1&&(b+="|")):c=c.concat(g.excludes)}else 0===a.indexOf("!")?c.push("^((?!"+d(a.substring(1)).regexp+").)*$"):(0===a.indexOf(".")&&(a="*"+a),b="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",b=b.replace(/\\\*/g,".*").replace(/\\\?/g,"."))}return{regexp:b,excludes:c}}var e=a;return e.registerValidators=function(a,b,c,d){function f(a){angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})}a&&(a.$ngfValidations=[],a.$formatters.push(function(g){return e.attrGetter("ngfValidateLater",c,d)||!a.$$ngfValidated?(e.validate(g,a,c,d,!1,function(){f(a),a.$$ngfValidated=!1}),g&&0===g.length&&(g=null),!b||null!=g&&0!==g.length||b.val()&&b.val(null)):(f(a),a.$$ngfValidated=!1),g}))},e.validatePattern=function(a,b){if(!b)return!0;var c=d(b),e=!0;if(c.regexp&&c.regexp.length){var f=new RegExp(c.regexp,"i");e=null!=a.type&&f.test(a.type)||null!=a.name&&f.test(a.name)}for(var g=c.excludes.length;g--;){var h=new RegExp(c.excludes[g],"i");e=e&&(null==a.type||h.test(a.type))&&(null==a.name||h.test(a.name))}return e},e.validate=function(a,b,c,d,f,g){function h(c,d,e){if(a){for(var f="ngf"+c[0].toUpperCase()+c.substr(1),g=a.length,h=null;g--;){var i=a[g],k=j(f,{$file:i});null==k&&(k=d(j("ngfValidate")||{}),h=null==h?!0:h),null!=k&&(e(i,k)||(i.$error=c,i.$errorParam=k,a.splice(g,1),h=!1))}null!==h&&b.$ngfValidations.push({name:c,valid:h})}}function i(c,d,e,f,h){if(a){var i=0,l=!1,m="ngf"+c[0].toUpperCase()+c.substr(1);a=void 0===a.length?[a]:a,angular.forEach(a,function(a){if(0!==a.type.search(e))return!0;var n=j(m,{$file:a})||d(j("ngfValidate",{$file:a})||{});n&&(k++,i++,f(a,n).then(function(b){h(b,n)||(a.$error=c,a.$errorParam=n,l=!0)},function(){j("ngfValidateForce",{$file:a})&&(a.$error=c,a.$errorParam=n,l=!0)})["finally"](function(){k--,i--,i||b.$ngfValidations.push({name:c,valid:!l}),k||g.call(b,b.$ngfValidations)}))})}}b=b||{},b.$ngfValidations=b.$ngfValidations||[],angular.forEach(b.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return e.attrGetter(a,c,d,b)};if(f)return void g.call(b);if(b.$$ngfValidated=!0,null==a||0===a.length)return void g.call(b);if(a=void 0===a.length?[a]:a.slice(0),h("pattern",function(a){return a.pattern},e.validatePattern),h("minSize",function(a){return a.size&&a.size.min},function(a,b){return a.size>=e.translateScalars(b)}),h("maxSize",function(a){return a.size&&a.size.max},function(a,b){return a.size<=e.translateScalars(b)}),h("validateFn",function(){return null},function(a,b){return b===!0||null===b||""===b}),!a.length)return void g.call(b,b.$ngfValidations);var k=0;i("maxHeight",function(a){return a.height&&a.height.max},/image/,this.imageDimensions,function(a,b){return a.height<=b}),i("minHeight",function(a){return a.height&&a.height.min},/image/,this.imageDimensions,function(a,b){return a.height>=b}),i("maxWidth",function(a){return a.width&&a.width.max},/image/,this.imageDimensions,function(a,b){return a.width<=b}),i("minWidth",function(a){return a.width&&a.width.min},/image/,this.imageDimensions,function(a,b){return a.width>=b}),i("ratio",function(a){return a.ratio},/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++){var f=c[e],g=f.search(/x/i);f=g>-1?parseFloat(f.substring(0,g))/parseFloat(f.substring(g+1)):parseFloat(f),Math.abs(a.width/a.height-f)<1e-4&&(d=!0)}return d}),i("maxDuration",function(a){return a.duration&&a.duration.max},/audio|video/,this.mediaDuration,function(a,b){return a<=e.translateScalars(b)}),i("minDuration",function(a){return a.duration&&a.duration.min},/audio|video/,this.mediaDuration,function(a,b){return a>=e.translateScalars(b)}),i("validateAsyncFn",function(){return null},/./,function(a,b){return b},function(a){return a===!0||null===a||""===a}),k||g.call(b,b.$ngfValidations)},e.imageDimensions=function(a){if(a.width&&a.height){var d=b.defer();return c(function(){d.resolve({width:a.width,height:a.height})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void f.reject("not image"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.width=b,a.height=c,f.resolve({width:b,height:c})}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?e():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",e);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){f.reject("load error")})}),a.$ngfDimensionPromise=f.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},e.mediaDuration=function(a){if(a.duration){var d=b.defer();return c(function(){d.resolve(a.duration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void f.reject("not media"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.duration=b,h.remove(),f.resolve(b)}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?e():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",e);var i=0;g(),angular.element(document.body).append(h)},function(){f.reject("load error")})}),a.$ngfDurationPromise=f.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},e}]),ngFileUpload.service("UploadResize",["UploadValidate","$q","$timeout",function(a,b,c){var d=a,e=function(a,b,c,d){var e=Math.min(c/a,d/b);return{width:a*e,height:b*e}},f=function(a,c,d,f,g){var h=b.defer(),i=document.createElement("canvas"),j=document.createElement("img");return 0===c&&(c=j.width,d=j.height),j.onload=function(){try{var a=e(j.width,j.height,c,d);i.width=a.width,i.height=a.height;var b=i.getContext("2d");b.drawImage(j,0,0,a.width,a.height),h.resolve(i.toDataURL(g||"image/WebP",f||1))}catch(k){h.reject(k)}},j.onerror=function(){h.reject()},j.src=a,h.promise},g=function(a){for(var b=a.split(","),c=b[0].match(/:(.*?);/)[1],d=atob(b[1]),e=d.length,f=new Uint8Array(e);e--;)f[e]=d.charCodeAt(e);return new Blob([f],{type:c})};return d.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")},d.resize=function(a,e,h,i){var j=b.defer();return 0!==a.type.indexOf("image")?(c(function(){j.resolve("Only images are allowed for resizing!")}),j.promise):(d.dataUrl(a,!0).then(function(b){f(b,e,h,i,a.type).then(function(b){var c=g(b);c.name=a.name,j.resolve(c)},function(){j.reject()})},function(){j.reject()}),j.promise)},d}]),function(){function a(a,c,d,e,f,g,h,i){function j(){return c.attr("disabled")||n("ngfDropDisabled",a)}function k(a,b,c,d){var e=n("ngfDragOverClass",a,{$event:c}),f=n("ngfDragOverClass")||"dragover";if(angular.isString(e))return void d(e);if(e&&(e.delay&&(r=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g)for(var h=n("ngfPattern",a,{$event:c}),j=0;j<g.length;j++)if("file"===g[j].kind||""===g[j].kind){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}}d(f)}function l(a,b,c,d){function e(a,b,c){if(null!=b)if(b.isDirectory){var d=(c||"")+b.name;a.push({name:b.name,type:"directory",path:d});var f=b.createReader(),g=[];i++;var h=function(){f.readEntries(function(d){try{if(d.length)g=g.concat(Array.prototype.slice.call(d||[],0)),h();else{for(var f=0;f<g.length;f++)e(a,g[f],(c?c:"")+b.name+"/");i--}}catch(j){i--,console.error(j)}},function(){i--})};h()}else i++,b.file(function(b){try{i--,b.path=(c?c:"")+b.name,a.push(b)}catch(d){i--,console.error(d)}},function(){i--})}var f=[],i=0,j=a.dataTransfer.items;if(j&&j.length>0&&"file"!==h.protocol())for(var k=0;k<j.length;k++){if(j[k].webkitGetAsEntry&&j[k].webkitGetAsEntry()&&j[k].webkitGetAsEntry().isDirectory){var l=j[k].webkitGetAsEntry();if(l.isDirectory&&!c)continue;null!=l&&e(f,l)}else{var m=j[k].getAsFile();null!=m&&f.push(m)}if(!d&&f.length>0)break}else{var n=a.dataTransfer.files;if(null!=n)for(var o=0;o<n.length&&(f.push(n.item(o)),d||!(f.length>0));o++);}var p=0;!function q(a){g(function(){if(i)10*p++<2e4&&q(10);else{if(!d&&f.length>1){for(k=0;"directory"===f[k].type;)k++;f=[f[k]]}b(f)}},a||0)}()}var m=b(),n=function(a,b,c){return i.attrGetter(a,d,b,c)};if(n("dropAvailable")&&g(function(){a[n("dropAvailable")]?a[n("dropAvailable")].value=m:a[n("dropAvailable")]=m}),!m)return void(n("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));i.registerValidators(e,null,d,a);var o,p=null,q=f(n("ngfStopPropagation")),r=1;c[0].addEventListener("dragover",function(b){if(!j()){if(b.preventDefault(),q(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(p),o||(o="C",k(a,d,b,function(a){o=a,c.addClass(o)}))}},!1),c[0].addEventListener("dragenter",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(){j()||(p=g(function(){o&&c.removeClass(o),o=null},r||1))},!1),c[0].addEventListener("drop",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation(),o&&c.removeClass(o),o=null,l(b,function(c){i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)},n("ngfAllowDir",a)!==!1,n("multiple")||n("ngfMultiple",a)))},!1),c[0].addEventListener("paste",function(b){if(!j()){var c=[],f=b.clipboardData||b.originalEvent.clipboardData;if(f&&f.items){for(var g=0;g<f.items.length;g++)-1!==f.items[g].type.indexOf("image")&&c.push(f.items[g].getAsFile());i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)}}},!1)}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImNvbXBhbmllcy9jb21wYW5pZXMubW9kdWxlLmpzIiwiZmVsbG93cy9mZWxsb3dzLm1vZHVsZS5qcyIsImhvbWUvaG9tZS5tb2R1bGUuanMiLCJwcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwidm90ZXMvdm90ZXMubW9kdWxlLmpzIiwiY29tcGFuaWVzL2NvbnRyb2xsZXJzL2NvbXBhbmllcy5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2NvbnRyb2xsZXJzL2NvbXBhbnkuY29udHJvbGxlci5qcyIsImNvbXBhbmllcy9kaXJlY3RpdmVzL2NvbXBhbnlDYXJkLmRpcmVjdGl2ZS5qcyIsImZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93LmNvbnRyb2xsZXIuanMiLCJmZWxsb3dzL2NvbnRyb2xsZXJzL2ZlbGxvd3MuY29udHJvbGxlci5qcyIsImNvbXBhbmllcy9zZXJ2aWNlcy9jb21wYW5pZXMuc2VydmljZS5qcyIsImZlbGxvd3MvZGlyZWN0aXZlcy9mZWxsb3dDYXJkLmRpcmVjdGl2ZS5qcyIsImZlbGxvd3Mvc2VydmljZXMvZmVsbG93cy5zZXJ2aWNlLmpzIiwiaG9tZS9jb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2FkbWluUHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9jb21wYW55UHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9mZWxsb3dzUHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9wcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwicHJvZmlsZS9zZXJ2aWNlcy9mZWxsb3dzLnNlcnZpY2UuanMiLCJwcm9maWxlL3NlcnZpY2VzL3RhZ3Muc2VydmljZS5qcyIsInByb2ZpbGUvc2VydmljZXMvdXNlci5zZXJ2aWNlLmpzIiwidm90ZXMvY29udHJvbGxlcnMvdm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL3NlcnZpY2VzL3ZvdGVzLnNlcnZpY2UuanMiLCJuZy1maWxlLXVwbG9hZC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogYXBwLnJvdXRlc1xyXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXHJcbiAqL1xyXG5cclxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nQ29va2llcycsICAnbmdGaWxlVXBsb2FkJywgJ3VpLmJvb3RzdHJhcCcsXHJcbiAgICAnYXBwLmNvbmZpZycsICdhcHAuaG9tZScsICdhcHAuY29tcGFuaWVzJywgJ2FwcC5mZWxsb3dzJywgJ2FwcC5wcm9maWxlJywgJ2FwcC52b3RlcycgXSlcclxuICAgIC5ydW4ocnVuKTtcclxuXHJcbi8qKlxyXG4gKiAgICogQG5hbWUgY29uZmlnXHJcbiAqICAgICAqIEBkZXNjIERlZmluZSB2YWxpZCBhcHBsaWNhdGlvbiByb3V0ZXNcclxuICogICAgICAgKi9cclxuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcclxuXHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgY29udHJvbGxlciAgOiAnSG9tZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsIDogJ3NvdXJjZS9hcHAvaG9tZS9ob21lLmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLndoZW4oJy9mZWxsb3dzJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvZmVsbG93cy5odG1sJ1xyXG4gICAgfSlcclxuICAgIC53aGVuKCcvZmVsbG93cy86ZmVsbG93X2lkLzpmZWxsb3dfbmFtZScsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93Q29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvZmVsbG93Lmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLndoZW4oJy9jb21wYW5pZXMnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFuaWVzLmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLndoZW4oJy9jb21wYW5pZXMvOmNvbXBhbnlfaWQvOmNvbXBhbnlfbmFtZScsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFueS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ1Byb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wcm9maWxlLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC53aGVuKCcvcHJvZmlsZS9hZG1pbicsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4tcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUvZmVsbG93Jywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2ZlbGxvdy1wcm9maWxlLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC53aGVuKCcvcHJvZmlsZS9jb21wYW55Jywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55UHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2NvbXBhbnktcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbiggJy92b3RlcycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnVm90ZXNDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvdm90ZXMvcGFydGlhbHMvZmVsbG93LXZvdGVzLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC5vdGhlcndpc2UoeyByZWRpcmVjdFRvOiAnLycgfSk7XHJcblxyXG59KTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdSb3V0aW5nQ29udHJvbGxlcicsIFJvdXRpbmdDb250cm9sbGVyKVxyXG4uY29udHJvbGxlcignTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuUm91dGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICckd2luZG93JywgJ1VzZXInLCAnJGxvY2F0aW9uJywgJyRhbmNob3JTY3JvbGwnXTtcclxuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHdpbmRvdycsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJ107XHJcblxyXG5mdW5jdGlvbiBSb3V0aW5nQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgJHdpbmRvdywgVXNlciwgJGxvY2F0aW9uLCAkYW5jaG9yU2Nyb2xsKSB7XHJcblxyXG4gICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xyXG5cclxuICAgICRzY29wZS5zY3JvbGxUbyA9IGZ1bmN0aW9uKGlkKXtcclxuXHJcbiAgICAgICAgJGxvY2F0aW9uLmhhc2goaWQpO1xyXG4gICAgICAgICRhbmNob3JTY3JvbGwoKTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlTG9naW5TdGF0dXMoKXtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gVXNlci5pc1VzZXJMb2dnZWRJbigpO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvbG9naW4tcGFnZS5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBzaXplOiAnJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nIGluIGNvbXBsZXRlXCIpO1xyXG4gICAgICAgICAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgJHNjb3BlLmxvZ291dFVzZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXNlciBMb2dvdXRcIik7XHJcbiAgICAgICAgVXNlci5DbGVhckNyZWRlbnRpYWxzKCk7XHJcbiAgICAgICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gZmFsc2U7XHJcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJHdpbmRvdywgJG1vZGFsSW5zdGFuY2UsIFVzZXIpIHtcclxuXHJcbiAgICAvLyBzYXZlIHRoaXMgdGhyb3VnaCBhIHJlZmVzaFxyXG4gICAgJHNjb3BlLmxvZ2luRm9ybSA9IHtcclxuXHJcbiAgICAgICAgZW1haWw6IFwiXCIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXHJcbiAgICAgICAgZXJyb3JzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbihsb2dpbkZvcm0pIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMgPSBbXTtcclxuXHJcbiAgICAgICAgVXNlci5sb2dpbihsb2dpbkZvcm0pLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcclxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICAgICAgLy9Vc2VyLmN1cnJlbnRVc2VyID0gdXNlclxyXG4gICAgICAgICAgICBVc2VyLlNldENyZWRlbnRpYWxzKHVzZXIuaWQsIHVzZXIuZW1haWwsIHVzZXIudXNlclR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8kd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cclxuICAgICAgICB9KS5lcnJvciggZnVuY3Rpb24oZXJyb3Ipe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMucHVzaChcIkludmFsaWQgdXNlciBjcmVkZW50aWFsc1wiKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgfTtcclxufVxyXG5cclxuXHJcbnJ1bi4kaW5qZWN0ID0gWyckY29va2llU3RvcmUnLCAnVXNlciddO1xyXG5mdW5jdGlvbiBydW4oJGNvb2tpZVN0b3JlLCBVc2VyKXtcclxuXHJcbiAgICAvLyBrZWVwIHVzZXIgbG9nZ2VkIGluIGFmdGVyIHBhZ2UgcmVmcmVzaFxyXG4gICAgdmFyIGN1cnJlbnRVc2VyID0gJGNvb2tpZVN0b3JlLmdldCgnZ2xvYmFscycpIHx8IHt9O1xyXG4gICAgVXNlci5zZXRDdXJyZW50VXNlcihjdXJyZW50VXNlcik7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyhjdXJyZW50VXNlcik7XHJcbiAgICAvL2lmICgkcm9vdFNjb3BlLmdsb2JhbHMuY3VycmVudFVzZXIpIHtcclxuICAgIC8vICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSAnQmFzaWMgJyArICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlci5hdXRoZGF0YTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAvL31cclxuXHJcbiAgICAvLyRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xyXG4gICAgLy8gICAgLy8gcmVkaXJlY3QgdG8gbG9naW4gcGFnZSBpZiBub3QgbG9nZ2VkIGluIGFuZCB0cnlpbmcgdG8gYWNjZXNzIGEgcmVzdHJpY3RlZCBwYWdlXHJcbiAgICAvLyAgICB2YXIgcmVzdHJpY3RlZFBhZ2UgPSAkLmluQXJyYXkoJGxvY2F0aW9uLnBhdGgoKSwgWycvbG9naW4nLCAnL3JlZ2lzdGVyJ10pID09PSAtMTtcclxuICAgIC8vICAgIHZhciBsb2dnZWRJbiA9ICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlcjtcclxuICAgIC8vICAgIGlmIChyZXN0cmljdGVkUGFnZSAmJiAhbG9nZ2VkSW4pIHtcclxuICAgIC8vICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2xvZ2luJyk7XHJcbiAgICAvLyAgICB9XHJcbiAgICAvL30pO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBGdW5jdGlvbnNcclxuICoqL1xyXG5cclxudmFyIEhGSGVscGVycyA9IEhGSGVscGVycyB8fCB7fTtcclxuXHJcbkhGSGVscGVycy5oZWxwZXJzID0ge1xyXG5cclxuICAgIHNsdWdpZnk6IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdHIudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICctJykgICAgICAgICAgIC8vIFJlcGxhY2Ugc3BhY2VzIHdpdGggLVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvW15cXHdcXC1dKy9nLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwtXFwtKy9nLCAnLScpICAgICAgICAgLy8gUmVwbGFjZSBtdWx0aXBsZSAtIHdpdGggc2luZ2xlIC1cclxuICAgICAgICAgICAgLnJlcGxhY2UoL14tKy8sICcnKSAgICAgICAgICAgICAvLyBUcmltIC0gZnJvbSBzdGFydCBvZiB0ZXh0XHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcclxuICAgIH1cclxufTsiLCIvKipcclxuICogQSBwbGFjZSB0byBwdXQgYXBwIHdpZGUgY29uZmlnIHN0dWZmXHJcbiAqXHJcbiAqL1xyXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKVxyXG4gICAgLmNvbnN0YW50KCdDT05GSUcnLCB7XHJcbiAgICAgICAgJ0FQUF9OQU1FJzogJ0hhY2tlciBGZWxsb3cgUG9ydGFsJyxcclxuICAgICAgICAnQVBQX1ZFUlNJT04nOiAnMS4wJyxcclxuICAgICAgICAnU0VSVklDRV9VUkwnOiAnJ1xyXG4gICAgfSk7XHJcblxyXG5cclxuLy92YXIgcm9vdFVybCA9ICdodHRwczovL3F1aWV0LWNvdmUtNjgzMC5oZXJva3VhcHAuY29tJztcclxuLy8gdmFyIHJvb3RVcmwgPSBcImh0dHBzOi8vYm9pbGluZy1zcHJpbmdzLTc1MjMuaGVyb2t1YXBwLmNvbVwiOyIsIi8qKlxyXG4gKiBjb21wYW5pZXMgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXHJcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJyxcclxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcclxuXHJcbiAgLy8gZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogZmVsbG93cyBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MnLCBbXHJcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAnYXBwLmZlbGxvd3Muc2VydmljZXMnLFxyXG4gICAgICAgICdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogaG9tZSBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUnLCBbXHJcbiAgICAgICAgJ2FwcC5ob21lLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAvLydhcHAuaG9tZS5zZXJ2aWNlcydcclxuICAgICAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmRpcmVjdGl2ZXMnLCBbXSk7XHJcbiAgICAvL2hvdyBhYm91dCB0aGlzXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBwcm9maWxlIG1vZHVsZVxyXG4gKi9cclxuXHJcbiAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgIGFuZ3VsYXJcclxuICAgICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW1xyXG4gICAgICAgICAgICAgICdhcHAucHJvZmlsZS5jb250cm9sbGVycycsXHJcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLnNlcnZpY2VzJyxcclxuICAgICAgICAgICAgICAnYXBwLmZlbGxvd3Muc2VydmljZXMnLFxyXG4gICAgICAgICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJ1xyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXHJcbiAgICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbiAgICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcclxuICAgICBhbmd1bGFyXHJcbiAgICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJywgW10pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIHZvdGVzIG1vZHVsZVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMnLCBbXHJcblxyXG4gICAgICAgICAgICAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAgICAgJ2FwcC52b3Rlcy5zZXJ2aWNlcydcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycsIFtdKTtcclxuXHJcblxyXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBDb21wYW5pZXNDb250cm9sbGVyXHJcbiAqIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5jb250cm9sbGVyc1xyXG4gKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcclxuXHJcbiAgICBDb21wYW5pZXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnQ29tcGFuaWVzJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZXNwYWNlIENvbXBhbmllc0NvbnRyb2xsZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gQ29tcGFuaWVzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgQ29tcGFuaWVzKSB7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBDb21wYW5pZXMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xyXG5cclxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKGNvbXBhbnkpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29tcGFuaWVzIE1vZGFsIEluc3RhbmNlIENvbnRyb2xsZXJcclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcclxuICAgICAqL1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcclxuICAgICAgICAuY29udHJvbGxlcignQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gICAgQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJyxcclxuICAgICAgICAnY29tcGFueScsICdWb3RlcycsICdVc2VyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgY29tcGFueSwgVm90ZXMsIFVzZXIpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQ29tcGFuaWVzQ29udHJvbGxlclxyXG4gKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuY29udHJvbGxlcnNcclxuICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW55Q29udHJvbGxlcicsIENvbXBhbnlDb250cm9sbGVyKTtcclxuXHJcbiAgICBDb21wYW55Q29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHJvdXRlUGFyYW1zJywgJyRzY29wZScsICckdGltZW91dCcsICdDb21wYW5pZXMnLCAnVXNlcicsICdWb3RlcyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBDb21wYW5pZXNDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIENvbXBhbnlDb250cm9sbGVyKCAkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIENvbXBhbmllcywgVXNlciwgVm90ZXMpIHtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gW107XHJcbiAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IFtdO1xyXG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcclxuXHJcbiAgICAgICAgQ29tcGFuaWVzLmdldCggJHJvdXRlUGFyYW1zLmNvbXBhbnlfaWQgKS5zdWNjZXNzKGZ1bmN0aW9uIChjb21wYW55KSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XHJcblxyXG4gICAgICAgICAgICBVc2VyLmdldFZvdGVzKCBjb21wYW55LnVzZXJfaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSB2b3Rlcy52b3Rlc0ZvcjtcclxuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSB2b3Rlcy52b3Rlc0Nhc3Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcclxuXHJcbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgJHNjb3BlLnZvdGVzRm9yLmxlbmd0aDsgaSsrICl7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkc2NvcGUudm90ZXNGb3JbaV07XHJcbiAgICAgICAgICAgICAgICBpZiggZWxlbWVudC5pZCA9PSAkc2NvcGUuY3VycmVudFVzZXIuaWQgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzRmVsbG93ID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoICRzY29wZS5jdXJyZW50VXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGNvbXBhbnkpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiggJHNjb3BlLmlzRmVsbG93KCkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBWb3Rlcy5jcmVhdGUoJHNjb3BlLmN1cnJlbnRVc2VyLmlkLCBjb21wYW55LnVzZXJfaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHZvdGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2VzczogXCIrdm90ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b3RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiK2Vycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdkb25lJyApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kb25lID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBjb21wYW55Q2FyZCk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhbnlDYXJkKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBGZWxsb3dzQ29udHJvbGxlclxyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXHJcbiAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd0NvbnRyb2xsZXInLCBGZWxsb3dDb250cm9sbGVyKTtcclxuXHJcbiAgICBGZWxsb3dDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnRmVsbG93cycsICdVc2VyJywgJ1ZvdGVzJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEZlbGxvd0NvbnRyb2xsZXIoJHJvdXRlUGFyYW1zLCAkc2NvcGUsICR0aW1lb3V0LCBGZWxsb3dzLCBVc2VyLCBWb3Rlcykge1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS52b3Rlc0ZvciA9IFtdO1xyXG4gICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSBbXTtcclxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XHJcblxyXG4gICAgICAgIEZlbGxvd3MuZ2V0KCAkcm91dGVQYXJhbXMuZmVsbG93X2lkICkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93KSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xyXG5cclxuICAgICAgICAgICAgVXNlci5nZXRWb3RlcyggZmVsbG93LnVzZXJfaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSB2b3Rlcy52b3Rlc0ZvcjtcclxuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSB2b3Rlcy52b3Rlc0Nhc3Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXJWb3RlZCA9IGZ1bmN0aW9uIGN1cnJlbnRVc2VyVm90ZWQoKXtcclxuXHJcbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgJHNjb3BlLnZvdGVzRm9yLmxlbmd0aDsgaSsrICl7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkc2NvcGUudm90ZXNGb3JbaV07XHJcbiAgICAgICAgICAgICAgICBpZiggZWxlbWVudC5pZCA9PSAkc2NvcGUuY3VycmVudFVzZXIuaWQgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmlzQ29tcGFueSA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKCAkc2NvcGUuY3VycmVudFVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGZlbGxvdykge1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkc2NvcGUuaXNDb21wYW55KCkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIFZvdGVzLmNyZWF0ZSgkc2NvcGUuY3VycmVudFVzZXIuaWQsIGZlbGxvdy51c2VyX2lkKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICh2b3RlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdm90ZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdm90ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIitlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZG9uZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogRmVsbG93c0NvbnRyb2xsZXJcclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xyXG4gKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dzQ29udHJvbGxlcicsIEZlbGxvd3NDb250cm9sbGVyKTtcclxuXHJcbiAgICBGZWxsb3dzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJ0ZlbGxvd3MnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmVsbG93c0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIEZlbGxvd3MpIHtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xyXG5cclxuICAgICAgICBGZWxsb3dzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24gKGZlbGxvd3MpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfZGV0YWlsX3ZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmVsbG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZlbGxvd3MgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxyXG4gICAgICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xyXG4gICAgICovXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JyxcclxuICAgICAgICAnVm90ZXMnLCAnVXNlcicsICckdGltZW91dCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmZWxsb3csIFZvdGVzLCBVc2VyKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZmVsbG93KTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5mZWxsb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQ29tcGFuaWVzXHJcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLnNlcnZpY2VzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xyXG5cclxuICBDb21wYW5pZXMuJGluamVjdCA9IFsnJGh0dHAnLCAnVXBsb2FkJywgJ0NPTkZJRyddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzXHJcbiAgKi9cclxuICBmdW5jdGlvbiBDb21wYW5pZXMoJGh0dHAsIFVwbG9hZCwgQ09ORklHKSB7XHJcblxyXG4gICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWxsOiBhbGwsXHJcbiAgICAgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcclxuICAgICAgZ2V0OiBnZXQsXHJcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcclxuICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICBkZXN0cm95OiBkZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBhbGxcclxuICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGNvbXBhbmllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhbGwoKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYWxsV2l0aFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VycycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZ2V0XHJcbiAgICAgKiBAZGVzYyBnZXQganVzdCBvbmUgY29tcGFueVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBwYXJzZUludChpZCkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQG5hbWUgZ2V0QnlVc2VySWRcclxuICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnkgYnkgdXNlciBpZFxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJfaWQvJyArIHBhcnNlSW50KHVzZXJfaWQpICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgY3JlYXRlXHJcbiAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGNvbXBhbnkgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb21wYW55KSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJywgY29tcGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1cGRhdGVcclxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBjb21wYW55IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoY29tcGFueSkge1xyXG5cclxuICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgIHVybDogcm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCxcclxuICAgICAgICBmaWVsZHM6IGNvbXBhbnksXHJcbiAgICAgICAgZmlsZTogY29tcGFueS5maWxlLFxyXG4gICAgICAgIG1ldGhvZDogJ1BVVCdcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9yZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkLCBjb21wYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBjb21wYW55IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycpXHJcbiAgICAuZGlyZWN0aXZlKCdmZWxsb3dDYXJkJywgZmVsbG93Q2FyZCk7XHJcblxyXG4gIC8vbmctZmVsbG93LWNhcmRcclxuIGZ1bmN0aW9uIGZlbGxvd0NhcmQoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19jYXJkLmh0bWwnLyosXHJcbiAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcclxuICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICB9ICovXHJcbiAgICB9O1xyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogRmVsbG93c1xyXG4qIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3Muc2VydmljZXNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXHJcblx0LnNlcnZpY2UoJ0ZlbGxvd3MnLCBGZWxsb3dzKTtcclxuXHJcbiAgRmVsbG93cy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XHJcblxyXG5cclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIEZlbGxvd3NcclxuICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxyXG4gICovXHJcbiAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcclxuXHJcblxyXG5cdCAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XHJcblxyXG5cdHJldHVybiB7XHJcblx0ICBhbGw6IGFsbCxcclxuXHQgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcclxuXHQgIGdldDogZ2V0LFxyXG4gICAgICBnZXRCeVVzZXJJZDogZ2V0QnlVc2VySWQsXHJcblx0ICBjcmVhdGU6IGNyZWF0ZSxcclxuXHQgIHVwZGF0ZTogdXBkYXRlLFxyXG5cdCAgZGVzdHJveTogZGVzdHJveVxyXG5cdH07XHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBuYW1lIGFsbFxyXG5cdCAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBhbGwoKSB7XHJcblxyXG5cdFx0cmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cycpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBhbGxcclxuXHQqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3Mgd2l0aCB0aGVpciB1c2VyIGFjY291bnQgaW5mb1xyXG5cdCovXHJcblx0ZnVuY3Rpb24gYWxsV2l0aFVzZXIoKSB7XHJcblxyXG5cdCAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VycycpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQG5hbWUgZ2V0XHJcblx0ICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBnZXQoaWQpIHtcclxuXHJcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldEJ5VXNlcklkXHJcblx0KiBAZGVzYyBnZXQgb25lIGZlbGxvdyBieSB1c2VyX2lkXHJcblx0Ki9cclxuXHRmdW5jdGlvbiBnZXRCeVVzZXJJZCh1c2VyX2lkKSB7XHJcblxyXG5cdCAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VyX2lkLycgKyB1c2VyX2lkKTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAbmFtZSBjcmVhdGVcclxuXHQgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBjcmVhdGUoZmVsbG93KSB7XHJcblx0XHRyZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nLCBmZWxsb3cpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQG5hbWUgdXBkYXRlXHJcblx0ICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiB1cGRhdGUoZmVsbG93KSB7XHJcblxyXG4gICAgICAgIHJldHVybiBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLFxyXG4gICAgICAgICAgICBmaWVsZHM6IGZlbGxvdyxcclxuICAgICAgICAgICAgZmlsZTogZmVsbG93LmZpbGUsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cdFx0Ly9yZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsIGZlbGxvdyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAbmFtZSBkZXN0cm95XHJcblx0ICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcblx0ICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XHJcblx0fVxyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIEhvbWVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnRmVsbG93cyddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcclxuICAqL1xyXG4gIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSwgRmVsbG93cykge1xyXG5cclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvd3Mpe1xyXG5cclxuICAgICAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGhvbWUgY29udHJvbGxlciEnKTtcclxuICAgICAgLy9Ib21lLmFsbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQWRtaW5Qcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVDb250cm9sbGVyKTtcclxuICAgIC8vLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICckbW9kYWwnLCAnVXNlcicsICdGZWxsb3dzJywgJ0NvbXBhbmllcyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBBZG1pblByb2ZpbGVDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCAkbW9kYWwsIFVzZXIsIEZlbGxvd3MsIENvbXBhbmllcykge1xyXG5cclxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb3Igc29tZSBraW5kXHJcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XHJcblxyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYW4gQWRtaW5cclxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkFkbWluXCIgKXtcclxuXHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBbXTtcclxuICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gW107XHJcbiAgICAgICAgJHNjb3BlLnVzZXJMaXN0TG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKCAkc2NvcGUuZmVsbG93cy5sZW5ndGggPT09IDAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgRmVsbG93cy5hbGxXaXRoVXNlcigpLnN1Y2Nlc3MoZnVuY3Rpb24gKGZlbGxvd3MpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiggJHNjb3BlLmNvbXBhbmllcy5sZW5ndGggPT09IDAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgQ29tcGFuaWVzLmFsbFdpdGhVc2VyKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS51c2VyTGlzdExvYWQoKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmVkaXRGZWxsb3cgPSBmdW5jdGlvbihmZWxsb3cpe1xyXG5cclxuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxyXG5cclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZWRpdC11c2VyLWZvcm0uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdFVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBzaXplOiAnbWQnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3cudXNlcjtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3cuZmlyc3RfbmFtZStcIiBcIitmZWxsb3cubGFzdF9uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmFyY2hpdmVGZWxsb3cgPSBmdW5jdGlvbih1c2VyKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXJjaGl2ZSBVc2VyOiBcIit1c2VyLmlkKTtcclxuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxyXG5cclxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmVkaXRDb21wYW55PSBmdW5jdGlvbihjb21wYW55KXtcclxuXHJcbiAgICAgICAgICAgIC8vIHNlbmQgdXNlciBkYXRhIHRvIHNlcnZpY2VcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL2VkaXQtdXNlci1mb3JtLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ21kJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFueS51c2VyO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnkubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5hcmNoaXZlQ29tcGFueSA9IGZ1bmN0aW9uKHVzZXIpe1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBcmNoaXZlIFVzZXI6IFwiK3VzZXIuaWQpO1xyXG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXHJcblxyXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWRtaW4gcHJvZmlsZSB0YWJzXHJcbiAgICAgICAgLy8kc2NvcGUudGFicyA9IFtcclxuICAgICAgICAvLyAgICB7XHJcbiAgICAgICAgLy8gICAgICAgIHRpdGxlOidVc2VyIExpc3QnLFxyXG4gICAgICAgIC8vICAgICAgICB0ZW1wbGF0ZTonc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL3VzZXItbGlzdC5odG1sJyxcclxuICAgICAgICAvLyAgICAgICAgYWN0aW9uOiAkc2NvcGUudXNlckxpc3RMb2FkXHJcbiAgICAgICAgLy8gICAgfSxcclxuICAgICAgICAvLyAgICB7XHJcbiAgICAgICAgLy8gICAgICAgIHRpdGxlOidOZXcgVXNlcicsXHJcbiAgICAgICAgLy8gICAgICAgIHRlbXBsYXRlOidzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vbmV3LXVzZXItZm9ybS5odG1sJyxcclxuICAgICAgICAvLyAgICAgICAgYWN0aW9uOiAkc2NvcGUudXNlckxpc3RMb2FkXHJcbiAgICAgICAgLy8gICAgfSxcclxuICAgICAgICAvLyAgICB7XHJcbiAgICAgICAgLy8gICAgICAgIHRpdGxlOidWb3RlcycsXHJcbiAgICAgICAgLy8gICAgICAgIHRlbXBsYXRlOidzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vYWRtaW4tdm90ZXMuaHRtbCcsXHJcbiAgICAgICAgLy8gICAgICAgIGFjdGlvbjogJHNjb3BlLnVzZXJMaXN0TG9hZFxyXG4gICAgICAgIC8vICAgIH1cclxuICAgICAgICAvL107XHJcblxyXG4gICAgICAgIC8qIENyZWF0ZSBVc2VyICovXHJcbiAgICAgICAgJHNjb3BlLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluL25ldy11c2VyLWZvcm0uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBwcmV2aW91cyBoaWdobGlnaHRzIGluIGNhc2UgZGF0YSBpcyBub3cgY29ycmVjdFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5zd2l0Y2hUeXBlID0gZnVuY3Rpb24odXNlcil7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCB1c2VyLnVzZXJUeXBlID09PSBcIkNvbXBhbnlcIiApe1xyXG5cclxuICAgICAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkNvbXBhbnlcIikuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25GZWxsb3dcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmVsbG93IHNlbGVjdGlvblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25Db21wYW55XCIpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgalF1ZXJ5KFwib3B0aW9uRmVsbG93XCIpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZnVuY3Rpb24gdW5IaWdobGlnaHRGaWVsZCgpe1xyXG5cclxuICAgICAgICAgICAgalF1ZXJ5KFwiaW5wdXRcIikucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgalF1ZXJ5KFwiI3VzZXJUeXBlXCIpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCl7XHJcblxyXG4gICAgICAgICAgICBqUXVlcnkoXCIjcGFzc3dvcmRcIikuYWRkQ2xhc3MoJ2Vycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGhpZ2hsaWdodEVtYWlsRmllbGQoKXtcclxuXHJcbiAgICAgICAgICAgIGpRdWVyeShcImVtYWlsXCIpLmFkZENsYXNzKCdlcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRVc2VyVHlwZUZpZWxkKCl7XHJcblxyXG4gICAgICAgICAgICBqUXVlcnkoXCJ1c2VyVHlwZVwiKS5hZGRDbGFzcygnZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmVsbG93cyBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyXHJcbiAgICAgKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXHJcbiAgICAgKi9cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdFZGl0VXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRWRpdFVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcignQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcclxuXHJcbiAgICBFZGl0VXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICd1c2VyJywgJ25hbWUnLCAnVXNlcicsICckdGltZW91dCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEVkaXRVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIHVzZXIsIG5hbWUsIFVzZXIpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgICRzY29wZS5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhmZWxsb3cpO1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcclxuXHJcbiAgICAgICAgICAgIFVzZXIudXBkYXRlKCRzY29wZS51c2VyKTtcclxuXHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS51c2VyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcbi8vVE9ETyB1c2VyIHNob3VsZCBiZSB1c2VyIHNlcnZpY2VcclxuICAgIGZ1bmN0aW9uIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY29uc29sZS5sb2coZmVsbG93KTtcclxuXHJcbiAgICAgICAgLy8gJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XHJcblxyXG4gICAgICAgIC8vICAgICBVc2VyLnVwZGF0ZSgkc2NvcGUudXNlcik7XHJcblxyXG4gICAgICAgIC8vICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUudXNlcik7XHJcbiAgICAgICAgLy8gfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uICh1c2VyKXtcclxuICAgICAgICAgICAgICAgIC8vIHVuSGlnaGxpZ2h0RmllbGQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiBldmVyeXRoaW5nIGlzIGdvb2QgbG9nIGRhdGEgYW5kIGNsb3NlLCBlbHNlIGhpZ2hsaWdodCBlcnJvclxyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9ycyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbiBjcmVhdGUuXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIpID09IFwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gaW5mb1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHRFbWFpbEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0UGFzc3dvcmRGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodFVzZXJUeXBlRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaGVja2luZyBpbmZvLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YodXNlci5lbWFpbCkgPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFkIGVtYWlsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBlbWFpbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHRFbWFpbEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YodXNlci5wYXNzd29yZCkgPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFkIHBhc3N3b3JkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBwYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhlIHVzZXIgdHlwZSBpc1wiICsgdXNlci51c2VyVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIudXNlclR5cGUpID09IFwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhZCB0eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidSB0cnluYSBjcmVhdGUgYnJhaD9cIik7XHJcbiAgICAgICAgICAgICAgICBpZiggIWVycm9ycyApe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIHVzZXIgdG8gQVBJIHZpYSBTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAgICAgVXNlci5jcmVhdGUodXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJfaWQgPSByZXNwb25zZS5kYXRhLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiRmVsbG93XCIgKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVsbG93X3Bvc3QgPSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJfaWQ6IHVzZXJfaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGZWxsb3dzLmNyZWF0ZShmZWxsb3dfcG9zdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJDb21wYW55XCIgKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29tcGFueV9wb3N0ID0ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGFuaWVzLmNyZWF0ZShjb21wYW55X3Bvc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIENvbXBhbnlQcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJywgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdDb21wYW5pZXMnLCAnVXNlcicsICdUYWdzJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEBuYW1lc3BhY2UgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gQ29tcGFueVByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBDb21wYW5pZXMsIFVzZXIsIFRhZ3MpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXHJcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XHJcblxyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYSBDb21wYW55XHJcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJDb21wYW55XCIgKXtcclxuXHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIENvbXBhbmllcy5nZXRCeVVzZXJJZChjdXJyZW50VXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbihjb21wYW55KXtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcclxuXHJcbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbih0YWdzKXtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRhZy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCJzZWxlY3QjdGFnc1wiKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgICAgICAgICAvL3RhZ3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICB0b2tlblNlcGFyYXRvcnM6IFsnLCcsJyAnXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcclxuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZT0gZnVuY3Rpb24oY29tcGFueSkge1xyXG5cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSB0YWdzIGZyb20gdGhlIGZvcm1cclxuICAgICAgICAgICAgLy9jb21wYW55LnRhZ3MgPSAkKFwiI3RhZ3NcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGFncyA9IFtdO1xyXG4gICAgICAgICAgICAkKCcjdGFncyA6c2VsZWN0ZWQnKS5lYWNoKGZ1bmN0aW9uKGksIHNlbGVjdGVkKXtcclxuICAgICAgICAgICAgICAgIHRhZ3NbaV0gPSAkKHNlbGVjdGVkKS52YWwoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggdGFncyApO1xyXG5cclxuICAgICAgICAgICAgY29tcGFueS50YWdzID0gdGFncztcclxuXHJcbiAgICAgICAgICAgIC8vIHNlbmQgY29tcGFuaWVzIGluZm8gdG8gQVBJIHZpYSBTZXJ2aWNlXHJcbiAgICAgICAgICAgIENvbXBhbmllcy51cGRhdGUoY29tcGFueSkuc3VjY2VzcyhmdW5jdGlvbihuZXdDb21wYW55RGF0YSl7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gKiogVHJpZ2dlciBTdWNjZXNzIG1lc3NhZ2UgaGVyZVxyXG4gICAgICAgICAgICAgICAgY29tcGFueSA9IG5ld0NvbXBhbnlEYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGhpZGUgdXBkYXRlIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyJywgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdGZWxsb3dzJywgJ1RhZ3MnLCAnVXNlcicgXTtcclxuXHJcbiAgICAvKipcclxuICAgICogQG5hbWVzcGFjZSBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcclxuICAgICovXHJcbiAgICBmdW5jdGlvbiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIEZlbGxvd3MsIFRhZ3MsIFVzZXIgKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgLy8gUHJvYmFibHkgY2FuIGhhbmRsZSB0aGlzIGluIHRoZSByb3V0ZXMgb3Igd2l0aCBtaWRkbGV3YXJlIG9mIHNvbWUga2luZFxyXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xyXG5cclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgRmVsbG93XHJcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJGZWxsb3dcIiApe1xyXG5cclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgRmVsbG93cy5nZXRCeVVzZXJJZChjdXJyZW50VXNlci5pZCkuc3VjY2VzcyhmdW5jdGlvbihmZWxsb3cpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcclxuXHJcbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbih0YWdzKXtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZyl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRhZy5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXNlbGVjdDIvYmxvYi9tYXN0ZXIvZGVtby9hcHAuanNcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwic2VsZWN0I3RhZ3NcIikuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90YWdzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5TZXBhcmF0b3JzOiBbJywnLCcgJ11cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcclxuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGZlbGxvdywgZmlsZSkge1xyXG5cclxuICAgICAgICAgICAgZmVsbG93LnRhZ3MgPSAkKFwiI3RhZ3NcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZW5kIGZlbGxvd3MgaW5mbyB0byBBUEkgdmlhIFNlcnZpY2VcclxuICAgICAgICAgICAgRmVsbG93cy51cGRhdGUoZmVsbG93KS5zdWNjZXNzKGZ1bmN0aW9uKG5ld0ZlbGxvd0RhdGEpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcclxuICAgICAgICAgICAgICAgIGZlbGxvdyA9IG5ld0ZlbGxvd0RhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaGlkZSB1cGRhdGUgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogUHJvZmlsZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gIC5jb250cm9sbGVyKCdQcm9maWxlQ29udHJvbGxlcicsIFByb2ZpbGVDb250cm9sbGVyKTtcclxuXHJcbiAgUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJ107XHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIFByb2ZpbGVDb250cm9sbGVyXHJcbiAgKi9cclxuICBmdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgVXNlcikge1xyXG5cclxuICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XHJcblxyXG4gICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJUaGUgY3VycmVudCB1c2VyIGlzIFwiICsgY3VycmVudFVzZXIudXNlclR5cGUpO1xyXG4gICAgICAgICAgLy8gcmVkaXJlY3QgdGhlIHVzZXIgYmFzZWQgb24gdGhlaXIgdHlwZVxyXG4gICAgICAgICAgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMaWtlIGEgYm9zc1wiKTtcclxuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2FkbWluXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdGZWxsb3cnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMaWtlIGEgZmVsbGFcIik7XHJcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9mZWxsb3dcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMaWtlIGEgY29tcGFueVwiKTtcclxuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2NvbXBhbnlcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBDb21wYW5pZXNcclxuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxyXG4gICAgLnNlcnZpY2UoJ0NvbXBhbmllcycsIENvbXBhbmllcyk7XHJcblxyXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XHJcblxyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNcclxuICAqL1xyXG4gIGZ1bmN0aW9uIENvbXBhbmllcygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcclxuXHJcbiAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcclxuIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWxsOiBhbGwsXHJcbiAgICAgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcclxuICAgICAgZ2V0OiBnZXQsXHJcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcclxuICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICBkZXN0cm95OiBkZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBhbGxcclxuICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGNvbXBhbmllc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhbGwoKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzIHdpdGggdGhlaXIgdXNlciBhY2NvdW50IGluZm9cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYWxsV2l0aFVzZXIoKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy91c2VycycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZ2V0XHJcbiAgICAgKiBAZGVzYyBnZXQganVzdCBvbmUgY29tcGFueVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBwYXJzZUludChpZCkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQG5hbWUgZ2V0QnlVc2VySWRcclxuICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnkgYnkgdXNlciBpZFxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJfaWQvJyArIHBhcnNlSW50KHVzZXJfaWQpICk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgY3JlYXRlXHJcbiAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGNvbXBhbnkgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb21wYW55KSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJywgY29tcGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1cGRhdGVcclxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBjb21wYW55IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoY29tcGFueSkge1xyXG5cclxuICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgIHVybDogcm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCxcclxuICAgICAgICBmaWVsZHM6IGNvbXBhbnksXHJcbiAgICAgICAgZmlsZTogY29tcGFueS5maWxlLFxyXG4gICAgICAgIG1ldGhvZDogJ1BVVCdcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9yZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkLCBjb21wYW55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBjb21wYW55IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogRmVsbG93c1xyXG4qIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3Muc2VydmljZXNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXHJcblx0LnNlcnZpY2UoJ0ZlbGxvd3MnLCBGZWxsb3dzKTtcclxuXHJcbiAgRmVsbG93cy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XHJcblxyXG4gICBcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIEZlbGxvd3NcclxuICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxyXG4gICovXHJcbiAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcclxuXHJcblxyXG5cdCAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XHJcblxyXG5cdHJldHVybiB7XHJcblx0ICBhbGw6IGFsbCxcclxuXHQgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcclxuXHQgIGdldDogZ2V0LFxyXG4gICAgICBnZXRCeVVzZXJJZDogZ2V0QnlVc2VySWQsXHJcblx0ICBjcmVhdGU6IGNyZWF0ZSxcclxuXHQgIHVwZGF0ZTogdXBkYXRlLFxyXG5cdCAgZGVzdHJveTogZGVzdHJveVxyXG5cdH07XHJcblxyXG5cdC8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cdC8qKlxyXG5cdCAqIEBuYW1lIGFsbFxyXG5cdCAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBhbGwoKSB7XHJcblxyXG5cdFx0cmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cycpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBhbGxcclxuXHQqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3Mgd2l0aCB0aGVpciB1c2VyIGFjY291bnQgaW5mb1xyXG5cdCovXHJcblx0ZnVuY3Rpb24gYWxsV2l0aFVzZXIoKSB7XHJcblxyXG5cdCAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VycycpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQG5hbWUgZ2V0XHJcblx0ICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBnZXQoaWQpIHtcclxuXHJcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldEJ5VXNlcklkXHJcblx0KiBAZGVzYyBnZXQgb25lIGZlbGxvdyBieSB1c2VyX2lkXHJcblx0Ki9cclxuXHRmdW5jdGlvbiBnZXRCeVVzZXJJZCh1c2VyX2lkKSB7XHJcblxyXG5cdCAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VyX2lkLycgKyB1c2VyX2lkKTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAbmFtZSBjcmVhdGVcclxuXHQgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBjcmVhdGUoZmVsbG93KSB7XHJcblx0XHRyZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nLCBmZWxsb3cpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQG5hbWUgdXBkYXRlXHJcblx0ICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiB1cGRhdGUoZmVsbG93KSB7XHJcblxyXG4gICAgICAgIHJldHVybiBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLFxyXG4gICAgICAgICAgICBmaWVsZHM6IGZlbGxvdyxcclxuICAgICAgICAgICAgZmlsZTogZmVsbG93LmZpbGUsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cdFx0Ly9yZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsIGZlbGxvdyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAbmFtZSBkZXN0cm95XHJcblx0ICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcblx0ICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBpZCk7XHJcblx0fVxyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBGZWxsb3dzXHJcbiAqIEBuYW1lc3BhY2UgYXBwLnNlcnZpY2VzXHJcbiAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXHJcbiAgICAgICAgLnNlcnZpY2UoJ1RhZ3MnLCBUYWdzKTtcclxuXHJcbiAgICBUYWdzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBUYWdzXHJcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVGFncygkaHR0cCwgQ09ORklHKSB7XHJcblxyXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhbGw6IGFsbCxcclxuICAgICAgICAgICAgZ2V0OiBnZXQsXHJcbiAgICAgICAgICAgIC8vY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgICAgICAgIC8vdXBkYXRlOiB1cGRhdGUsXHJcbiAgICAgICAgICAgIC8vZGVzdHJveTogZGVzdHJveVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhbGwoKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAbmFtZSBnZXRcclxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xyXG4gICAgICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0KGlkKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyBpZCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXHJcbiAgICAgICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy9mdW5jdGlvbiBjcmVhdGUoZmVsbG93KSB7XHJcbiAgICAgICAgLy8gICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJywgZmVsbG93KTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXHJcbiAgICAgICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuICAgICAgICAgKi9cclxuICAgICAgICAvL2Z1bmN0aW9uIHVwZGF0ZShmZWxsb3csIGlkKSB7XHJcbiAgICAgICAgLy8gICAgcmV0dXJuICRodHRwLnB1dChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQsIGZlbGxvdyk7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vZnVuY3Rpb24gZGVzdHJveShpZCkge1xyXG4gICAgICAgIC8vICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcclxuICAgICAgICAvL31cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBQcm9maWxlXHJcbiAqIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuc2VydmljZXNcclxuICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXHJcbiAgICAuZmFjdG9yeSgnVXNlcicsIFVzZXIpO1xyXG5cclxuICBVc2VyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJGNvb2tpZVN0b3JlJywgJyRodHRwJywgJ0NPTkZJRyddO1xyXG5cclxuICAvKipcclxuICAgKiBAbmFtZXNwYWNlIFVzZXJcclxuICAgKiBAcmV0dXJucyB7U2VydmljZX1cclxuICAgKi9cclxuICBmdW5jdGlvbiBVc2VyKCRyb290U2NvcGUsICRjb29raWVTdG9yZSwgJGh0dHAsIENPTkZJRykge1xyXG5cclxuICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XHJcblxyXG4gICAgICAvLyBXaWxsIGhvbGQgaW5mbyBmb3IgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlclxyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSB7fTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xyXG5cclxuICAgICAgICAgIHJldHVybiBjdXJyZW50VXNlcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFVzZXIodXNlcikge1xyXG5cclxuICAgICAgICAgIGN1cnJlbnRVc2VyID0gdXNlcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0Vm90ZXMoIHVzZXJfaWQgKXtcclxuXHJcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlcl9pZCArICcvdm90ZXMnICk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQG5hbWUgbG9naW5cclxuICAgICAgICogQGRlc2MgbG9naW4gYSBuZXcgdXNlciByZWNvcmRcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGxvZ2luKHVzZXIpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy9sb2dpbicsIHVzZXIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgIC8vYWxsOiBhbGwsXHJcbiAgICAgICAgICAvL2dldDogZ2V0LFxyXG4gICAgICAgICAgZ2V0Vm90ZXM6IGdldFZvdGVzLFxyXG4gICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgICB1cGRhdGU6IHVwZGF0ZSxcclxuICAgICAgICAgIC8vZGVzdHJveTogZGVzdHJveVxyXG4gICAgICAgICAgU2V0Q3JlZGVudGlhbHM6IFNldENyZWRlbnRpYWxzLFxyXG4gICAgICAgICAgQ2xlYXJDcmVkZW50aWFsczogQ2xlYXJDcmVkZW50aWFscyxcclxuICAgICAgICAgIGdldEN1cnJlbnRVc2VyOiBnZXRDdXJyZW50VXNlcixcclxuICAgICAgICAgIHNldEN1cnJlbnRVc2VyOiBzZXRDdXJyZW50VXNlcixcclxuICAgICAgICAgIGlzVXNlckxvZ2dlZEluOiBpc1VzZXJMb2dnZWRJblxyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAbmFtZSBhbGxcclxuICAgICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgdXNlcnNcclxuICAgICAgICovXHJcbiAgICAgIC8vZnVuY3Rpb24gYWxsKCkge1xyXG4gICAgICAvL1xyXG4gICAgICAvLyAgICByZXR1cm4gW107XHJcbiAgICAgIC8vXHJcbiAgICAgIC8vICAgIC8vcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycpO1xyXG4gICAgICAvL31cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAbmFtZSBnZXRcclxuICAgICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIHVzZXJcclxuICAgICAgICovXHJcbiAgICAgIC8vZnVuY3Rpb24gZ2V0KGlkKSB7XHJcbiAgICAgIC8vICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBwYXJzZUludChpZCkgKTtcclxuICAgICAgLy99XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQG5hbWUgY3JlYXRlXHJcbiAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIG5ldyB1c2VyIHJlY29yZFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gY3JlYXRlKHVzZXIpIHtcclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy9jcmVhdGUnLCB1c2VyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBuYW1lIHVwZGF0ZVxyXG4gICAgICAgKiBAZGVzYyB1cGRhdGVhIGEgdXNlciByZWNvcmRcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZSh1c2VyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXIpO1xyXG5cclxuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyB1c2VyLmlkLCB1c2VyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAgICogQGRlc2MgZGVzdHJveSBhIHVzZXIgcmVjb3JkXHJcbiAgICAgICAqL1xyXG4gICAgICAvL2Z1bmN0aW9uIGRlc3Ryb3koaWQpIHtcclxuICAgICAgLy8gICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgcm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBpZCk7XHJcbiAgICAgIC8vfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaXNVc2VyTG9nZ2VkSW4oKXtcclxuXHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGN1cnJlbnRVc2VyKTtcclxuICAgICAgICAgIGlmKCBPYmplY3Qua2V5cyhjdXJyZW50VXNlcikubGVuZ3RoID4gMCApe1xyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gU2V0Q3JlZGVudGlhbHMoaWQsIHVzZXJuYW1lLCB1c2VyVHlwZSkge1xyXG5cclxuICAgICAgICAgIHZhciBhdXRoZGF0YSA9IEJhc2U2NC5lbmNvZGUoaWQgKyAnOicgKyB1c2VybmFtZSArICc6JyArIHVzZXJUeXBlKTtcclxuXHJcbiAgICAgICAgICBjdXJyZW50VXNlciA9IHtcclxuICAgICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICAgICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcclxuICAgICAgICAgICAgICBhdXRoZGF0YTogYXV0aGRhdGFcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgJGNvb2tpZVN0b3JlLnB1dCgnZ2xvYmFscycsIGN1cnJlbnRVc2VyKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gQ2xlYXJDcmVkZW50aWFscygpIHtcclxuXHJcbiAgICAgICAgICAkcm9vdFNjb3BlLmdsb2JhbHMgPSB7fTtcclxuICAgICAgICAgICRjb29raWVTdG9yZS5yZW1vdmUoJ2dsb2JhbHMnKTtcclxuICAgICAgfVxyXG5cclxuICB9XHJcblxyXG4gIC8vIEJhc2U2NCBlbmNvZGluZyBzZXJ2aWNlIHVzZWQgYnkgQXV0aGVudGljYXRpb25TZXJ2aWNlXHJcbiAgdmFyIEJhc2U2NCA9IHtcclxuXHJcbiAgICBrZXlTdHI6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPScsXHJcblxyXG4gICAgZW5jb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XHJcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcclxuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xyXG4gICAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgICBkbyB7XHJcbiAgICAgICAgY2hyMSA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcclxuICAgICAgICBjaHIyID0gaW5wdXQuY2hhckNvZGVBdChpKyspO1xyXG4gICAgICAgIGNocjMgPSBpbnB1dC5jaGFyQ29kZUF0KGkrKyk7XHJcblxyXG4gICAgICAgIGVuYzEgPSBjaHIxID4+IDI7XHJcbiAgICAgICAgZW5jMiA9ICgoY2hyMSAmIDMpIDw8IDQpIHwgKGNocjIgPj4gNCk7XHJcbiAgICAgICAgZW5jMyA9ICgoY2hyMiAmIDE1KSA8PCAyKSB8IChjaHIzID4+IDYpO1xyXG4gICAgICAgIGVuYzQgPSBjaHIzICYgNjM7XHJcblxyXG4gICAgICAgIGlmIChpc05hTihjaHIyKSkge1xyXG4gICAgICAgICAgZW5jMyA9IGVuYzQgPSA2NDtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKGNocjMpKSB7XHJcbiAgICAgICAgICBlbmM0ID0gNjQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgK1xyXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzEpICtcclxuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMyKSArXHJcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMykgK1xyXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzQpO1xyXG4gICAgICAgIGNocjEgPSBjaHIyID0gY2hyMyA9IFwiXCI7XHJcbiAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9IFwiXCI7XHJcbiAgICAgIH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xyXG5cclxuICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH0sXHJcblxyXG4gICAgZGVjb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcclxuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XHJcbiAgICAgIHZhciBjaHIxLCBjaHIyLCBjaHIzID0gXCJcIjtcclxuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xyXG4gICAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgICAvLyByZW1vdmUgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IEEtWiwgYS16LCAwLTksICssIC8sIG9yID1cclxuICAgICAgdmFyIGJhc2U2NHRlc3QgPSAvW15BLVphLXowLTlcXCtcXC9cXD1dL2c7XHJcbiAgICAgIGlmIChiYXNlNjR0ZXN0LmV4ZWMoaW5wdXQpKSB7XHJcbiAgICAgICAgd2luZG93LmFsZXJ0KFwiVGhlcmUgd2VyZSBpbnZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGluIHRoZSBpbnB1dCB0ZXh0LlxcblwiICtcclxuICAgICAgICAgICAgXCJWYWxpZCBiYXNlNjQgY2hhcmFjdGVycyBhcmUgQS1aLCBhLXosIDAtOSwgJysnLCAnLycsYW5kICc9J1xcblwiICtcclxuICAgICAgICAgICAgXCJFeHBlY3QgZXJyb3JzIGluIGRlY29kaW5nLlwiKTtcclxuICAgICAgfVxyXG4gICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoL1teQS1aYS16MC05XFwrXFwvXFw9XS9nLCBcIlwiKTtcclxuXHJcbiAgICAgIGRvIHtcclxuICAgICAgICBlbmMxID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcbiAgICAgICAgZW5jMiA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xyXG4gICAgICAgIGVuYzMgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcclxuICAgICAgICBlbmM0ID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XHJcblxyXG4gICAgICAgIGNocjEgPSAoZW5jMSA8PCAyKSB8IChlbmMyID4+IDQpO1xyXG4gICAgICAgIGNocjIgPSAoKGVuYzIgJiAxNSkgPDwgNCkgfCAoZW5jMyA+PiAyKTtcclxuICAgICAgICBjaHIzID0gKChlbmMzICYgMykgPDwgNikgfCBlbmM0O1xyXG5cclxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjEpO1xyXG5cclxuICAgICAgICBpZiAoZW5jMyAhPSA2NCkge1xyXG4gICAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVuYzQgIT0gNjQpIHtcclxuICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaHIxID0gY2hyMiA9IGNocjMgPSBcIlwiO1xyXG4gICAgICAgIGVuYzEgPSBlbmMyID0gZW5jMyA9IGVuYzQgPSBcIlwiO1xyXG5cclxuICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XHJcblxyXG4gICAgICByZXR1cm4gb3V0cHV0O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogVm90ZXNDb250cm9sbGVyXHJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXHJcbiAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoICdWb3Rlc0NvbnRyb2xsZXInLCBWb3Rlc0NvbnRyb2xsZXIgKTtcclxuXHJcbiAgICBWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicgXTtcclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBWb3RlQ29udHJvbGxlclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIpIHtcclxuXHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS52b3Rlc0ZvciA9IFtdO1xyXG4gICAgICAgICAgICAkc2NvcGUudm90ZXNDYXN0ID0gW107XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XHJcblxyXG4gICAgICAgICAgICBVc2VyLmdldFZvdGVzKCAkc2NvcGUuY3VycmVudFVzZXIuaWQgKS5zdWNjZXNzKCBmdW5jdGlvbiggdm90ZXMgKXtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSB2b3Rlcy52b3Rlc0ZvcjtcclxuICAgICAgICAgICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSB2b3Rlcy52b3Rlc0Nhc3Q7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAkc2NvcGUudm90ZXNDYXN0ICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBWb3Rlc1xyXG4gKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5zZXJ2aWNlc1xyXG4gKi9cclxuXHJcbi8vIEBUT0RPIC0tIElzIHRoaXMgYmVpbmcgdXNlZCBzb21ld2hlcmU/XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMuc2VydmljZXMnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdWb3RlcycsIFZvdGVzKTtcclxuXHJcbiAgICBWb3Rlcy4kaW5qZWN0ID0gWyckaHR0cCcsICdDT05GSUcnXTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZXNwYWNlIENvbXBhbnlWb3Rlc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWb3RlcygkaHR0cCwgQ09ORklHKSB7XHJcblxyXG4gICAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG5cclxuICAgICAgICAgICAgZ2V0Vm90ZXM6IGdldFZvdGVzLFxyXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcclxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIGdldCB2b3Rlc1xyXG4gICAgICAgICAqIEBkZXNjIGdldCB0aGUgdm90ZXMgZm9yIGEgdXNlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFZvdGVzKCB1c2VyX2lkICl7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlcl9pZCArICcvdm90ZXMnICk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXHJcbiAgICAgICAgICogQGRlc2MgY2FzdCBhIHZvdGUgZm9yIGEgdXNlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSggdm90ZXJfaWQsIHZvdGVlX2lkICkge1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdm90ZXJfaWQgKyBcIiBcIiArIHZvdGVlX2lkICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvJywge1xyXG5cclxuICAgICAgICAgICAgICAgIHZvdGVyX2lkOiB2b3Rlcl9pZCxcclxuICAgICAgICAgICAgICAgIHZvdGVlX2lkOiB2b3RlZV9pZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdm90ZSByZWNvcmRcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy8nICsgaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG5cclxuIiwiLyohIDcuMy45ICovXG4hd2luZG93LlhNTEh0dHBSZXF1ZXN0fHx3aW5kb3cuRmlsZUFQSSYmRmlsZUFQSS5zaG91bGRMb2FkfHwod2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe2lmKFwiX19zZXRYSFJfXCI9PT1iKXt2YXIgZD1jKHRoaXMpO2QgaW5zdGFuY2VvZiBGdW5jdGlvbiYmZCh0aGlzKX1lbHNlIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0od2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyKSk7dmFyIG5nRmlsZVVwbG9hZD1hbmd1bGFyLm1vZHVsZShcIm5nRmlsZVVwbG9hZFwiLFtdKTtuZ0ZpbGVVcGxvYWQudmVyc2lvbj1cIjcuMy45XCIsbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRCYXNlXCIsW1wiJGh0dHBcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGQpe2Z1bmN0aW9uIGcoYSl7ai5ub3RpZnkmJmoubm90aWZ5KGEpLGsucHJvZ3Jlc3NGdW5jJiZjKGZ1bmN0aW9uKCl7ay5wcm9ncmVzc0Z1bmMoYSl9KX1mdW5jdGlvbiBoKGEpe3JldHVybiBudWxsIT1kLl9zdGFydCYmZj97bG9hZGVkOmEubG9hZGVkK2QuX3N0YXJ0LHRvdGFsOmQuX2ZpbGUuc2l6ZSx0eXBlOmEudHlwZSxjb25maWc6ZCxsZW5ndGhDb21wdXRhYmxlOiEwLHRhcmdldDphLnRhcmdldH06YX1mdW5jdGlvbiBpKCl7YShkKS50aGVuKGZ1bmN0aW9uKGEpe2YmJmQuX2NodW5rU2l6ZSYmIWQuX2ZpbmlzaGVkPyhnKHtsb2FkZWQ6ZC5fZW5kLHRvdGFsOmQuX2ZpbGUuc2l6ZSxjb25maWc6ZCx0eXBlOlwicHJvZ3Jlc3NcIn0pLGUudXBsb2FkKGQpKTooZC5fZmluaXNoZWQmJmRlbGV0ZSBkLl9maW5pc2hlZCxqLnJlc29sdmUoYSkpfSxmdW5jdGlvbihhKXtqLnJlamVjdChhKX0sZnVuY3Rpb24oYSl7ai5ub3RpZnkoYSl9KX1kLm1ldGhvZD1kLm1ldGhvZHx8XCJQT1NUXCIsZC5oZWFkZXJzPWQuaGVhZGVyc3x8e307dmFyIGo9ZC5fZGVmZXJyZWQ9ZC5fZGVmZXJyZWR8fGIuZGVmZXIoKSxrPWoucHJvbWlzZTtyZXR1cm4gZC5oZWFkZXJzLl9fc2V0WEhSXz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhKXthJiYoZC5fX1hIUj1hLGQueGhyRm4mJmQueGhyRm4oYSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsZnVuY3Rpb24oYSl7YS5jb25maWc9ZCxnKGgoYSkpfSwhMSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbihhKXthLmxlbmd0aENvbXB1dGFibGUmJihhLmNvbmZpZz1kLGcoaChhKSkpfSwhMSkpfX0sZj9kLl9jaHVua1NpemUmJmQuX2VuZCYmIWQuX2ZpbmlzaGVkPyhkLl9zdGFydD1kLl9lbmQsZC5fZW5kKz1kLl9jaHVua1NpemUsaSgpKTpkLnJlc3VtZVNpemVVcmw/YS5nZXQoZC5yZXN1bWVTaXplVXJsKS50aGVuKGZ1bmN0aW9uKGEpe2QuX3N0YXJ0PWQucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyP2QucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyKGEuZGF0YSk6cGFyc2VJbnQoKG51bGw9PWEuZGF0YS5zaXplP2EuZGF0YTphLmRhdGEuc2l6ZSkudG9TdHJpbmcoKSksZC5fY2h1bmtTaXplJiYoZC5fZW5kPWQuX3N0YXJ0K2QuX2NodW5rU2l6ZSksaSgpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6ZC5yZXN1bWVTaXplP2QucmVzdW1lU2l6ZSgpLnRoZW4oZnVuY3Rpb24oYSl7ZC5fc3RhcnQ9YSxpKCl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTppKCk6aSgpLGsuc3VjY2Vzcz1mdW5jdGlvbihhKXtyZXR1cm4gay50aGVuKGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsuZXJyb3I9ZnVuY3Rpb24oYSl7cmV0dXJuIGsudGhlbihudWxsLGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsucHJvZ3Jlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGsucHJvZ3Jlc3NGdW5jPWEsay50aGVuKG51bGwsbnVsbCxmdW5jdGlvbihiKXthKGIpfSksa30say5hYm9ydD1rLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGQuX19YSFImJmMoZnVuY3Rpb24oKXtkLl9fWEhSLmFib3J0KCl9KSxrfSxrLnhocj1mdW5jdGlvbihhKXtyZXR1cm4gZC54aHJGbj1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXtiJiZiLmFwcGx5KGssYXJndW1lbnRzKSxhLmFwcGx5KGssYXJndW1lbnRzKX19KGQueGhyRm4pLGt9LGt9dmFyIGU9dGhpczt0aGlzLmlzUmVzdW1lU3VwcG9ydGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHdpbmRvdy5CbG9iJiYobmV3IEJsb2IpLnNsaWNlfTt2YXIgZj10aGlzLmlzUmVzdW1lU3VwcG9ydGVkKCk7dGhpcy51cGxvYWQ9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihjLGQsZSl7aWYodm9pZCAwIT09ZClpZihhbmd1bGFyLmlzRGF0ZShkKSYmKGQ9ZC50b0lTT1N0cmluZygpKSxhbmd1bGFyLmlzU3RyaW5nKGQpKWMuYXBwZW5kKGUsZCk7ZWxzZSBpZihcImZvcm1cIj09PWEuc2VuZEZpZWxkc0FzKWlmKGFuZ3VsYXIuaXNPYmplY3QoZCkpZm9yKHZhciBmIGluIGQpZC5oYXNPd25Qcm9wZXJ0eShmKSYmYihjLGRbZl0sZStcIltcIitmK1wiXVwiKTtlbHNlIGMuYXBwZW5kKGUsZCk7ZWxzZSBkPWFuZ3VsYXIuaXNTdHJpbmcoZCk/ZDphbmd1bGFyLnRvSnNvbihkKSxcImpzb24tYmxvYlwiPT09YS5zZW5kRmllbGRzQXM/Yy5hcHBlbmQoZSxuZXcgQmxvYihbZF0se3R5cGU6XCJhcHBsaWNhdGlvbi9qc29uXCJ9KSk6Yy5hcHBlbmQoZSxkKX1mdW5jdGlvbiBjKGEpe3JldHVybiBhIGluc3RhbmNlb2YgQmxvYnx8YS5mbGFzaElkJiZhLm5hbWUmJmEuc2l6ZX1mdW5jdGlvbiBnKGIsZCxlKXtpZihjKGQpKXtpZihhLl9maWxlPWEuX2ZpbGV8fGQsbnVsbCE9YS5fc3RhcnQmJmYpe2EuX2VuZCYmYS5fZW5kPj1kLnNpemUmJihhLl9maW5pc2hlZD0hMCxhLl9lbmQ9ZC5zaXplKTt2YXIgaD1kLnNsaWNlKGEuX3N0YXJ0LGEuX2VuZHx8ZC5zaXplKTtoLm5hbWU9ZC5uYW1lLGQ9aCxhLl9jaHVua1NpemUmJihiLmFwcGVuZChcImNodW5rU2l6ZVwiLGEuX2VuZC1hLl9zdGFydCksYi5hcHBlbmQoXCJjaHVua051bWJlclwiLE1hdGguZmxvb3IoYS5fc3RhcnQvYS5fY2h1bmtTaXplKSksYi5hcHBlbmQoXCJ0b3RhbFNpemVcIixhLl9maWxlLnNpemUpKX1iLmFwcGVuZChlLGQsZC5maWxlTmFtZXx8ZC5uYW1lKX1lbHNle2lmKCFhbmd1bGFyLmlzT2JqZWN0KGQpKXRocm93XCJFeHBlY3RlZCBmaWxlIG9iamVjdCBpbiBVcGxvYWQudXBsb2FkIGZpbGUgb3B0aW9uOiBcIitkLnRvU3RyaW5nKCk7Zm9yKHZhciBpIGluIGQpaWYoZC5oYXNPd25Qcm9wZXJ0eShpKSl7dmFyIGo9aS5zcGxpdChcIixcIik7alsxXSYmKGRbaV0uZmlsZU5hbWU9alsxXS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpKSxnKGIsZFtpXSxqWzBdKX19fXJldHVybiBhLl9jaHVua1NpemU9ZS50cmFuc2xhdGVTY2FsYXJzKGEucmVzdW1lQ2h1bmtTaXplKSxhLl9jaHVua1NpemU9YS5fY2h1bmtTaXplP3BhcnNlSW50KGEuX2NodW5rU2l6ZS50b1N0cmluZygpKTpudWxsLGEuaGVhZGVycz1hLmhlYWRlcnN8fHt9LGEuaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXT12b2lkIDAsYS50cmFuc2Zvcm1SZXF1ZXN0PWEudHJhbnNmb3JtUmVxdWVzdD9hbmd1bGFyLmlzQXJyYXkoYS50cmFuc2Zvcm1SZXF1ZXN0KT9hLnRyYW5zZm9ybVJlcXVlc3Q6W2EudHJhbnNmb3JtUmVxdWVzdF06W10sYS50cmFuc2Zvcm1SZXF1ZXN0LnB1c2goZnVuY3Rpb24oYyl7dmFyIGQsZT1uZXcgRm9ybURhdGEsZj17fTtmb3IoZCBpbiBhLmZpZWxkcylhLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShkKSYmKGZbZF09YS5maWVsZHNbZF0pO2MmJihmLmRhdGE9Yyk7Zm9yKGQgaW4gZilpZihmLmhhc093blByb3BlcnR5KGQpKXt2YXIgaD1mW2RdO2EuZm9ybURhdGFBcHBlbmRlcj9hLmZvcm1EYXRhQXBwZW5kZXIoZSxkLGgpOmIoZSxoLGQpfWlmKG51bGwhPWEuZmlsZSlpZihhbmd1bGFyLmlzQXJyYXkoYS5maWxlKSlmb3IodmFyIGk9MDtpPGEuZmlsZS5sZW5ndGg7aSsrKWcoZSxhLmZpbGVbaV0sXCJmaWxlXCIpO2Vsc2UgZyhlLGEuZmlsZSxcImZpbGVcIik7cmV0dXJuIGV9KSxkKGEpfSx0aGlzLmh0dHA9ZnVuY3Rpb24oYil7cmV0dXJuIGIudHJhbnNmb3JtUmVxdWVzdD1iLnRyYW5zZm9ybVJlcXVlc3R8fGZ1bmN0aW9uKGIpe3JldHVybiB3aW5kb3cuQXJyYXlCdWZmZXImJmIgaW5zdGFuY2VvZiB3aW5kb3cuQXJyYXlCdWZmZXJ8fGIgaW5zdGFuY2VvZiBCbG9iP2I6YS5kZWZhdWx0cy50cmFuc2Zvcm1SZXF1ZXN0WzBdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sYi5fY2h1bmtTaXplPWUudHJhbnNsYXRlU2NhbGFycyhiLnJlc3VtZUNodW5rU2l6ZSksYi5fY2h1bmtTaXplPWIuX2NodW5rU2l6ZT9wYXJzZUludChiLl9jaHVua1NpemUudG9TdHJpbmcoKSk6bnVsbCxkKGIpfSx0aGlzLnRyYW5zbGF0ZVNjYWxhcnM9ZnVuY3Rpb24oYSl7aWYoYW5ndWxhci5pc1N0cmluZyhhKSl7aWYoYS5zZWFyY2goL2tiL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTMqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL21iL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTYqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2diL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTkqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2IvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KGEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9zL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvbS9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoNjAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL2gvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDM2MDAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSl9cmV0dXJuIGF9LHRoaXMuc2V0RGVmYXVsdHM9ZnVuY3Rpb24oYSl7dGhpcy5kZWZhdWx0cz1hfHx7fX0sdGhpcy5kZWZhdWx0cz17fSx0aGlzLnZlcnNpb249bmdGaWxlVXBsb2FkLnZlcnNpb259XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkUmVzaXplXCIsZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9ZDtyZXR1cm4gZS5nZXRBdHRyV2l0aERlZmF1bHRzPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPWFbYl0/YVtiXTpudWxsPT1lLmRlZmF1bHRzW2JdP2UuZGVmYXVsdHNbYl06ZS5kZWZhdWx0c1tiXS50b1N0cmluZygpfSxlLmF0dHJHZXR0ZXI9ZnVuY3Rpb24oYixjLGQsZSl7aWYoIWQpcmV0dXJuIHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpO3RyeXtyZXR1cm4gZT9hKHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpKShkLGUpOmEodGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYikpKGQpfWNhdGNoKGYpe2lmKGIuc2VhcmNoKC9taW58bWF4fHBhdHRlcm4vaSkpcmV0dXJuIHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpO3Rocm93IGZ9fSxlLnVwZGF0ZU1vZGVsPWZ1bmN0aW9uKGMsZCxmLGcsaCxpLGope2Z1bmN0aW9uIGsoKXt2YXIgaj1oJiZoLmxlbmd0aD9oWzBdOm51bGw7aWYoYyl7dmFyIGs9IWUuYXR0ckdldHRlcihcIm5nZk11bHRpcGxlXCIsZCxmKSYmIWUuYXR0ckdldHRlcihcIm11bHRpcGxlXCIsZCkmJiFwO2EoZS5hdHRyR2V0dGVyKFwibmdNb2RlbFwiLGQpKS5hc3NpZ24oZixrP2o6aCl9dmFyIGw9ZS5hdHRyR2V0dGVyKFwibmdmTW9kZWxcIixkKTtsJiZhKGwpLmFzc2lnbihmLGgpLGcmJmEoZykoZix7JGZpbGVzOmgsJGZpbGU6aiwkbmV3RmlsZXM6bSwkZHVwbGljYXRlRmlsZXM6biwkZXZlbnQ6aX0pLGIoZnVuY3Rpb24oKXt9KX1mdW5jdGlvbiBsKGEsYil7dmFyIGM9ZS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZCxmKTtpZighY3x8IWUuaXNSZXNpemVTdXBwb3J0ZWQoKSlyZXR1cm4gYigpO2Zvcih2YXIgZz1hLmxlbmd0aCxoPWZ1bmN0aW9uKCl7Zy0tLDA9PT1nJiZiKCl9LGk9ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2Euc3BsaWNlKGIsMSxjKSxoKCl9fSxqPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXtoKCksYS4kZXJyb3I9XCJyZXNpemVcIixhLiRlcnJvclBhcmFtPShiPyhiLm1lc3NhZ2U/Yi5tZXNzYWdlOmIpK1wiOiBcIjpcIlwiKSsoYSYmYS5uYW1lKX19LGs9MDtrPGEubGVuZ3RoO2srKyl7dmFyIGw9YVtrXTtsLiRlcnJvcnx8MCE9PWwudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/aCgpOmUucmVzaXplKGwsYy53aWR0aCxjLmhlaWdodCxjLnF1YWxpdHkpLnRoZW4oaShrKSxqKGwpKX19dmFyIG09aCxuPVtdLG89KGMmJmMuJG1vZGVsVmFsdWV8fGQuJCRuZ2ZQcmV2RmlsZXN8fFtdKS5zbGljZSgwKSxwPWUuYXR0ckdldHRlcihcIm5nZktlZXBcIixkLGYpO2lmKHA9PT0hMCl7aWYoIWh8fCFoLmxlbmd0aClyZXR1cm47dmFyIHE9ITE7aWYoZS5hdHRyR2V0dGVyKFwibmdmS2VlcERpc3RpbmN0XCIsZCxmKT09PSEwKXtmb3IodmFyIHI9by5sZW5ndGgscz0wO3M8aC5sZW5ndGg7cysrKXtmb3IodmFyIHQ9MDtyPnQ7dCsrKWlmKGhbc10ubmFtZT09PW9bdF0ubmFtZSl7bi5wdXNoKGhbc10pO2JyZWFrfXQ9PT1yJiYoby5wdXNoKGhbc10pLHE9ITApfWlmKCFxKXJldHVybjtoPW99ZWxzZSBoPW8uY29uY2F0KGgpfWQuJCRuZ2ZQcmV2RmlsZXM9aCxqP2soKTplLnZhbGlkYXRlKGgsYyxkLGYsZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGQpLGZ1bmN0aW9uKCl7bChoLGZ1bmN0aW9uKCl7YihmdW5jdGlvbigpe2soKX0pfSl9KTtmb3IodmFyIHU9by5sZW5ndGg7dS0tOyl7dmFyIHY9b1t1XTt3aW5kb3cuVVJMJiZ2LmJsb2JVcmwmJihVUkwucmV2b2tlT2JqZWN0VVJMKHYuYmxvYlVybCksZGVsZXRlIHYuYmxvYlVybCl9fSxlfV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZTZWxlY3RcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZShhKXt2YXIgYj1hLm1hdGNoKC9BbmRyb2lkW15cXGRdKihcXGQrKVxcLihcXGQrKS8pO2lmKGImJmIubGVuZ3RoPjIpe3ZhciBjPWQuZGVmYXVsdHMuYW5kcm9pZEZpeE1pbm9yVmVyc2lvbnx8NDtyZXR1cm4gcGFyc2VJbnQoYlsxXSk8NHx8cGFyc2VJbnQoYlsxXSk9PT1jJiZwYXJzZUludChiWzJdKTxjfXJldHVybi0xPT09YS5pbmRleE9mKFwiQ2hyb21lXCIpJiYvLipXaW5kb3dzLipTYWZhcmkuKi8udGVzdChhKX1mdW5jdGlvbiBmKGEsYixjLGQsZixoLGksail7ZnVuY3Rpb24gaygpe3JldHVyblwiaW5wdXRcIj09PWJbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpJiZjLnR5cGUmJlwiZmlsZVwiPT09Yy50eXBlLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbCgpe3JldHVybiB0KFwibmdmQ2hhbmdlXCIpfHx0KFwibmdmU2VsZWN0XCIpfWZ1bmN0aW9uIG0oYil7Zm9yKHZhciBlPWIuX19maWxlc198fGIudGFyZ2V0JiZiLnRhcmdldC5maWxlcyxmPVtdLGc9MDtnPGUubGVuZ3RoO2crKylmLnB1c2goZVtnXSk7ai51cGRhdGVNb2RlbChkLGMsYSxsKCksZi5sZW5ndGg/ZjpudWxsLGIpfWZ1bmN0aW9uIG4oYSl7aWYoYiE9PWEpZm9yKHZhciBjPTA7YzxiWzBdLmF0dHJpYnV0ZXMubGVuZ3RoO2MrKyl7dmFyIGQ9YlswXS5hdHRyaWJ1dGVzW2NdO1widHlwZVwiIT09ZC5uYW1lJiZcImNsYXNzXCIhPT1kLm5hbWUmJlwiaWRcIiE9PWQubmFtZSYmXCJzdHlsZVwiIT09ZC5uYW1lJiYoKG51bGw9PWQudmFsdWV8fFwiXCI9PT1kLnZhbHVlKSYmKFwicmVxdWlyZWRcIj09PWQubmFtZSYmKGQudmFsdWU9XCJyZXF1aXJlZFwiKSxcIm11bHRpcGxlXCI9PT1kLm5hbWUmJihkLnZhbHVlPVwibXVsdGlwbGVcIikpLGEuYXR0cihkLm5hbWUsZC52YWx1ZSkpfX1mdW5jdGlvbiBvKCl7aWYoaygpKXJldHVybiBiO3ZhciBhPWFuZ3VsYXIuZWxlbWVudCgnPGlucHV0IHR5cGU9XCJmaWxlXCI+Jyk7cmV0dXJuIG4oYSksYS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImFic29sdXRlXCIpLmNzcyhcIm92ZXJmbG93XCIsXCJoaWRkZW5cIikuY3NzKFwid2lkdGhcIixcIjBweFwiKS5jc3MoXCJoZWlnaHRcIixcIjBweFwiKS5jc3MoXCJib3JkZXJcIixcIm5vbmVcIikuY3NzKFwibWFyZ2luXCIsXCIwcHhcIikuY3NzKFwicGFkZGluZ1wiLFwiMHB4XCIpLmF0dHIoXCJ0YWJpbmRleFwiLFwiLTFcIiksZy5wdXNoKHtlbDpiLHJlZjphfSksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhWzBdKSxhfWZ1bmN0aW9uIHAoYyl7aWYoYi5hdHRyKFwiZGlzYWJsZWRcIil8fHQoXCJuZ2ZTZWxlY3REaXNhYmxlZFwiLGEpKXJldHVybiExO3ZhciBkPXEoYyk7cmV0dXJuIG51bGwhPWQ/ZDoocihjKSxlKG5hdmlnYXRvci51c2VyQWdlbnQpP3NldFRpbWVvdXQoZnVuY3Rpb24oKXt3WzBdLmNsaWNrKCl9LDApOndbMF0uY2xpY2soKSwhMSl9ZnVuY3Rpb24gcShhKXt2YXIgYj1hLmNoYW5nZWRUb3VjaGVzfHxhLm9yaWdpbmFsRXZlbnQmJmEub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcztpZihcInRvdWNoc3RhcnRcIj09PWEudHlwZSlyZXR1cm4gdj1iP2JbMF0uY2xpZW50WTowLCEwO2lmKGEuc3RvcFByb3BhZ2F0aW9uKCksYS5wcmV2ZW50RGVmYXVsdCgpLFwidG91Y2hlbmRcIj09PWEudHlwZSl7dmFyIGM9Yj9iWzBdLmNsaWVudFk6MDtpZihNYXRoLmFicyhjLXYpPjIwKXJldHVybiExfX1mdW5jdGlvbiByKGIpe3cudmFsKCkmJih3LnZhbChudWxsKSxqLnVwZGF0ZU1vZGVsKGQsYyxhLGwoKSxudWxsLGIsITApKX1mdW5jdGlvbiBzKGEpe2lmKHcmJiF3LmF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIikpe2lmKCF3WzBdLnBhcmVudE5vZGUpcmV0dXJuIHZvaWQodz1udWxsKTthLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSx3LnVuYmluZChcImNsaWNrXCIpO3ZhciBiPXcuY2xvbmUoKTtyZXR1cm4gdy5yZXBsYWNlV2l0aChiKSx3PWIsdy5hdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIsXCJ0cnVlXCIpLHcuYmluZChcImNoYW5nZVwiLG0pLHcuYmluZChcImNsaWNrXCIscyksd1swXS5jbGljaygpLCExfXcucmVtb3ZlQXR0cihcIl9fbmdmX2llMTBfRml4X1wiKX12YXIgdD1mdW5jdGlvbihhLGIpe3JldHVybiBqLmF0dHJHZXR0ZXIoYSxjLGIpfSx1PVtdO3UucHVzaChhLiR3YXRjaCh0KFwibmdmTXVsdGlwbGVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJtdWx0aXBsZVwiLHQoXCJuZ2ZNdWx0aXBsZVwiLGEpKX0pKSx1LnB1c2goYS4kd2F0Y2godChcIm5nZkNhcHR1cmVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJjYXB0dXJlXCIsdChcIm5nZkNhcHR1cmVcIixhKSl9KSksYy4kb2JzZXJ2ZShcImFjY2VwdFwiLGZ1bmN0aW9uKCl7dy5hdHRyKFwiYWNjZXB0XCIsdChcImFjY2VwdFwiKSl9KSx1LnB1c2goZnVuY3Rpb24oKXtjLiQkb2JzZXJ2ZXJzJiZkZWxldGUgYy4kJG9ic2VydmVycy5hY2NlcHR9KTt2YXIgdj0wLHc9YjtrKCl8fCh3PW8oKSksdy5iaW5kKFwiY2hhbmdlXCIsbSksaygpP2IuYmluZChcImNsaWNrXCIscik6Yi5iaW5kKFwiY2xpY2sgdG91Y2hzdGFydCB0b3VjaGVuZFwiLHApLGoucmVnaXN0ZXJWYWxpZGF0b3JzKGQsdyxjLGEpLC0xIT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIikmJncuYmluZChcImNsaWNrXCIscyksYS4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7aygpfHx3LnJlbW92ZSgpLGFuZ3VsYXIuZm9yRWFjaCh1LGZ1bmN0aW9uKGEpe2EoKX0pfSksaChmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8Zy5sZW5ndGg7YSsrKXt2YXIgYj1nW2FdO2RvY3VtZW50LmJvZHkuY29udGFpbnMoYi5lbFswXSl8fChnLnNwbGljZShhLDEpLGIucmVmLnJlbW92ZSgpKX19KSx3aW5kb3cuRmlsZUFQSSYmd2luZG93LkZpbGVBUEkubmdmRml4SUUmJndpbmRvdy5GaWxlQVBJLm5nZkZpeElFKGIsdyxtKX12YXIgZz1bXTtyZXR1cm57cmVzdHJpY3Q6XCJBRUNcIixyZXF1aXJlOlwiP25nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGUsZyxoLGkpe2YoZSxnLGgsaSxhLGIsYyxkKX19fV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhKXtyZXR1cm5cImltZ1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJpbWFnZVwiOlwiYXVkaW9cIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1wiYXVkaW9cIjpcInZpZGVvXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cInZpZGVvXCI6Ly4vfWZ1bmN0aW9uIGIoYixjLGQsZSxmLGcsaCxpKXtmdW5jdGlvbiBqKGEpe3ZhciBnPWIuYXR0ckdldHRlcihcIm5nZk5vT2JqZWN0VXJsXCIsZixkKTtiLmRhdGFVcmwoYSxnKVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtjKGZ1bmN0aW9uKCl7dmFyIGI9KGc/YS5kYXRhVXJsOmEuYmxvYlVybCl8fGEuZGF0YVVybDtpP2UuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLFwidXJsKCdcIisoYnx8XCJcIikrXCInKVwiKTplLmF0dHIoXCJzcmNcIixiKSxiP2UucmVtb3ZlQ2xhc3MoXCJuZ2YtaGlkZVwiKTplLmFkZENsYXNzKFwibmdmLWhpZGVcIil9KX0pfWMoZnVuY3Rpb24oKXt2YXIgYz1kLiR3YXRjaChmW2ddLGZ1bmN0aW9uKGMpe3ZhciBkPWg7aWYoXCJuZ2ZUaHVtYm5haWxcIj09PWcmJihkfHwoZD17d2lkdGg6ZVswXS5jbGllbnRXaWR0aCxoZWlnaHQ6ZVswXS5jbGllbnRIZWlnaHR9KSwwPT09ZC53aWR0aCYmd2luZG93LmdldENvbXB1dGVkU3R5bGUpKXt2YXIgZj1nZXRDb21wdXRlZFN0eWxlKGVbMF0pO2Q9e3dpZHRoOnBhcnNlSW50KGYud2lkdGguc2xpY2UoMCwtMikpLGhlaWdodDpwYXJzZUludChmLmhlaWdodC5zbGljZSgwLC0yKSl9fXJldHVybiBhbmd1bGFyLmlzU3RyaW5nKGMpPyhlLnJlbW92ZUNsYXNzKFwibmdmLWhpZGVcIiksaT9lLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIixcInVybCgnXCIrYytcIicpXCIpOmUuYXR0cihcInNyY1wiLGMpKTp2b2lkKCFjfHwhYy50eXBlfHwwIT09Yy50eXBlLnNlYXJjaChhKGVbMF0pKXx8aSYmMCE9PWMudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/ZS5hZGRDbGFzcyhcIm5nZi1oaWRlXCIpOmQmJmIuaXNSZXNpemVTdXBwb3J0ZWQoKT9iLnJlc2l6ZShjLGQud2lkdGgsZC5oZWlnaHQsZC5xdWFsaXR5KS50aGVuKGZ1bmN0aW9uKGEpe2ooYSl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTpqKGMpKX0pO2QuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2MoKX0pfSl9bmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWREYXRhVXJsXCIsW1wiVXBsb2FkQmFzZVwiLFwiJHRpbWVvdXRcIixcIiRxXCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWE7cmV0dXJuIGQuZGF0YVVybD1mdW5jdGlvbihhLGQpe2lmKGQmJm51bGwhPWEuZGF0YVVybHx8IWQmJm51bGwhPWEuYmxvYlVybCl7dmFyIGU9Yy5kZWZlcigpO3JldHVybiBiKGZ1bmN0aW9uKCl7ZS5yZXNvbHZlKGQ/YS5kYXRhVXJsOmEuYmxvYlVybCl9KSxlLnByb21pc2V9dmFyIGY9ZD9hLiRuZ2ZEYXRhVXJsUHJvbWlzZTphLiRuZ2ZCbG9iVXJsUHJvbWlzZTtpZihmKXJldHVybiBmO3ZhciBnPWMuZGVmZXIoKTtyZXR1cm4gYihmdW5jdGlvbigpe2lmKHdpbmRvdy5GaWxlUmVhZGVyJiZhJiYoIXdpbmRvdy5GaWxlQVBJfHwtMT09PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOFwiKXx8YS5zaXplPDJlNCkmJighd2luZG93LkZpbGVBUEl8fC0xPT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5XCIpfHxhLnNpemU8NGU2KSl7dmFyIGM9d2luZG93LlVSTHx8d2luZG93LndlYmtpdFVSTDtpZihjJiZjLmNyZWF0ZU9iamVjdFVSTCYmIWQpe3ZhciBlO3RyeXtlPWMuY3JlYXRlT2JqZWN0VVJMKGEpfWNhdGNoKGYpe3JldHVybiB2b2lkIGIoZnVuY3Rpb24oKXthLmJsb2JVcmw9XCJcIixnLnJlamVjdCgpfSl9YihmdW5jdGlvbigpe2EuYmxvYlVybD1lLGUmJmcucmVzb2x2ZShlKX0pfWVsc2V7dmFyIGg9bmV3IEZpbGVSZWFkZXI7aC5vbmxvYWQ9ZnVuY3Rpb24oYyl7YihmdW5jdGlvbigpe2EuZGF0YVVybD1jLnRhcmdldC5yZXN1bHQsZy5yZXNvbHZlKGMudGFyZ2V0LnJlc3VsdCl9KX0saC5vbmVycm9yPWZ1bmN0aW9uKCl7YihmdW5jdGlvbigpe2EuZGF0YVVybD1cIlwiLGcucmVqZWN0KCl9KX0saC5yZWFkQXNEYXRhVVJMKGEpfX1lbHNlIGIoZnVuY3Rpb24oKXthW2Q/XCJkYXRhVXJsXCI6XCJibG9iVXJsXCJdPVwiXCIsZy5yZWplY3QoKX0pfSksZj1kP2EuJG5nZkRhdGFVcmxQcm9taXNlPWcucHJvbWlzZTphLiRuZ2ZCbG9iVXJsUHJvbWlzZT1nLnByb21pc2UsZltcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYVtkP1wiJG5nZkRhdGFVcmxQcm9taXNlXCI6XCIkbmdmQmxvYlVybFByb21pc2VcIl19KSxmfSxkfV0pO3ZhciBjPWFuZ3VsYXIuZWxlbWVudChcIjxzdHlsZT4ubmdmLWhpZGV7ZGlzcGxheTpub25lICFpbXBvcnRhbnR9PC9zdHlsZT5cIik7ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGNbMF0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZTcmNcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe2IoYSxjLGQsZSxmLFwibmdmU3JjXCIsYS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZixkKSwhMSl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmQmFja2dyb3VuZFwiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7YihhLGMsZCxlLGYsXCJuZ2ZCYWNrZ3JvdW5kXCIsYS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZixkKSwhMCl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmVGh1bWJuYWlsXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXt2YXIgZz1hLmF0dHJHZXR0ZXIoXCJuZ2ZTaXplXCIsZixkKTtiKGEsYyxkLGUsZixcIm5nZlRodW1ibmFpbFwiLGcsYS5hdHRyR2V0dGVyKFwibmdmQXNCYWNrZ3JvdW5kXCIsZixkKSl9fX1dKX0oKSxuZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZFZhbGlkYXRlXCIsW1wiVXBsb2FkRGF0YVVybFwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7dmFyIGI9XCJcIixjPVtdO2lmKGEubGVuZ3RoPjImJlwiL1wiPT09YVswXSYmXCIvXCI9PT1hW2EubGVuZ3RoLTFdKWI9YS5zdWJzdHJpbmcoMSxhLmxlbmd0aC0xKTtlbHNle3ZhciBlPWEuc3BsaXQoXCIsXCIpO2lmKGUubGVuZ3RoPjEpZm9yKHZhciBmPTA7ZjxlLmxlbmd0aDtmKyspe3ZhciBnPWQoZVtmXSk7Zy5yZWdleHA/KGIrPVwiKFwiK2cucmVnZXhwK1wiKVwiLGY8ZS5sZW5ndGgtMSYmKGIrPVwifFwiKSk6Yz1jLmNvbmNhdChnLmV4Y2x1ZGVzKX1lbHNlIDA9PT1hLmluZGV4T2YoXCIhXCIpP2MucHVzaChcIl4oKD8hXCIrZChhLnN1YnN0cmluZygxKSkucmVnZXhwK1wiKS4pKiRcIik6KDA9PT1hLmluZGV4T2YoXCIuXCIpJiYoYT1cIipcIithKSxiPVwiXlwiK2EucmVwbGFjZShuZXcgUmVnRXhwKFwiWy5cXFxcXFxcXCsqP1xcXFxbXFxcXF5cXFxcXSQoKXt9PSE8Pnw6XFxcXC1dXCIsXCJnXCIpLFwiXFxcXCQmXCIpK1wiJFwiLGI9Yi5yZXBsYWNlKC9cXFxcXFwqL2csXCIuKlwiKS5yZXBsYWNlKC9cXFxcXFw/L2csXCIuXCIpKX1yZXR1cm57cmVnZXhwOmIsZXhjbHVkZXM6Y319dmFyIGU9YTtyZXR1cm4gZS5yZWdpc3RlclZhbGlkYXRvcnM9ZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZihhKXthbmd1bGFyLmZvckVhY2goYS4kbmdmVmFsaWRhdGlvbnMsZnVuY3Rpb24oYil7YS4kc2V0VmFsaWRpdHkoYi5uYW1lLGIudmFsaWQpfSl9YSYmKGEuJG5nZlZhbGlkYXRpb25zPVtdLGEuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihnKXtyZXR1cm4gZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGMsZCl8fCFhLiQkbmdmVmFsaWRhdGVkPyhlLnZhbGlkYXRlKGcsYSxjLGQsITEsZnVuY3Rpb24oKXtmKGEpLGEuJCRuZ2ZWYWxpZGF0ZWQ9ITF9KSxnJiYwPT09Zy5sZW5ndGgmJihnPW51bGwpLCFifHxudWxsIT1nJiYwIT09Zy5sZW5ndGh8fGIudmFsKCkmJmIudmFsKG51bGwpKTooZihhKSxhLiQkbmdmVmFsaWRhdGVkPSExKSxnfSkpfSxlLnZhbGlkYXRlUGF0dGVybj1mdW5jdGlvbihhLGIpe2lmKCFiKXJldHVybiEwO3ZhciBjPWQoYiksZT0hMDtpZihjLnJlZ2V4cCYmYy5yZWdleHAubGVuZ3RoKXt2YXIgZj1uZXcgUmVnRXhwKGMucmVnZXhwLFwiaVwiKTtlPW51bGwhPWEudHlwZSYmZi50ZXN0KGEudHlwZSl8fG51bGwhPWEubmFtZSYmZi50ZXN0KGEubmFtZSl9Zm9yKHZhciBnPWMuZXhjbHVkZXMubGVuZ3RoO2ctLTspe3ZhciBoPW5ldyBSZWdFeHAoYy5leGNsdWRlc1tnXSxcImlcIik7ZT1lJiYobnVsbD09YS50eXBlfHxoLnRlc3QoYS50eXBlKSkmJihudWxsPT1hLm5hbWV8fGgudGVzdChhLm5hbWUpKX1yZXR1cm4gZX0sZS52YWxpZGF0ZT1mdW5jdGlvbihhLGIsYyxkLGYsZyl7ZnVuY3Rpb24gaChjLGQsZSl7aWYoYSl7Zm9yKHZhciBmPVwibmdmXCIrY1swXS50b1VwcGVyQ2FzZSgpK2Muc3Vic3RyKDEpLGc9YS5sZW5ndGgsaD1udWxsO2ctLTspe3ZhciBpPWFbZ10saz1qKGYseyRmaWxlOml9KTtudWxsPT1rJiYoaz1kKGooXCJuZ2ZWYWxpZGF0ZVwiKXx8e30pLGg9bnVsbD09aD8hMDpoKSxudWxsIT1rJiYoZShpLGspfHwoaS4kZXJyb3I9YyxpLiRlcnJvclBhcmFtPWssYS5zcGxpY2UoZywxKSxoPSExKSl9bnVsbCE9PWgmJmIuJG5nZlZhbGlkYXRpb25zLnB1c2goe25hbWU6Yyx2YWxpZDpofSl9fWZ1bmN0aW9uIGkoYyxkLGUsZixoKXtpZihhKXt2YXIgaT0wLGw9ITEsbT1cIm5nZlwiK2NbMF0udG9VcHBlckNhc2UoKStjLnN1YnN0cigxKTthPXZvaWQgMD09PWEubGVuZ3RoP1thXTphLGFuZ3VsYXIuZm9yRWFjaChhLGZ1bmN0aW9uKGEpe2lmKDAhPT1hLnR5cGUuc2VhcmNoKGUpKXJldHVybiEwO3ZhciBuPWoobSx7JGZpbGU6YX0pfHxkKGooXCJuZ2ZWYWxpZGF0ZVwiLHskZmlsZTphfSl8fHt9KTtuJiYoaysrLGkrKyxmKGEsbikudGhlbihmdW5jdGlvbihiKXtoKGIsbil8fChhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0sZnVuY3Rpb24oKXtqKFwibmdmVmFsaWRhdGVGb3JjZVwiLHskZmlsZTphfSkmJihhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0pW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2stLSxpLS0saXx8Yi4kbmdmVmFsaWRhdGlvbnMucHVzaCh7bmFtZTpjLHZhbGlkOiFsfSksa3x8Zy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpfSkpfSl9fWI9Ynx8e30sYi4kbmdmVmFsaWRhdGlvbnM9Yi4kbmdmVmFsaWRhdGlvbnN8fFtdLGFuZ3VsYXIuZm9yRWFjaChiLiRuZ2ZWYWxpZGF0aW9ucyxmdW5jdGlvbihhKXthLnZhbGlkPSEwfSk7dmFyIGo9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZS5hdHRyR2V0dGVyKGEsYyxkLGIpfTtpZihmKXJldHVybiB2b2lkIGcuY2FsbChiKTtpZihiLiQkbmdmVmFsaWRhdGVkPSEwLG51bGw9PWF8fDA9PT1hLmxlbmd0aClyZXR1cm4gdm9pZCBnLmNhbGwoYik7aWYoYT12b2lkIDA9PT1hLmxlbmd0aD9bYV06YS5zbGljZSgwKSxoKFwicGF0dGVyblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnBhdHRlcm59LGUudmFsaWRhdGVQYXR0ZXJuKSxoKFwibWluU2l6ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnNpemUmJmEuc2l6ZS5taW59LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2l6ZT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaChcIm1heFNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWF4fSxmdW5jdGlvbihhLGIpe3JldHVybiBhLnNpemU8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGgoXCJ2YWxpZGF0ZUZuXCIsZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj09PSEwfHxudWxsPT09Ynx8XCJcIj09PWJ9KSwhYS5sZW5ndGgpcmV0dXJuIHZvaWQgZy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpO3ZhciBrPTA7aShcIm1heEhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0PD1ifSksaShcIm1pbkhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0Pj1ifSksaShcIm1heFdpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg8PWJ9KSxpKFwibWluV2lkdGhcIixmdW5jdGlvbihhKXtyZXR1cm4gYS53aWR0aCYmYS53aWR0aC5taW59LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS53aWR0aD49Yn0pLGkoXCJyYXRpb1wiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnJhdGlvfSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWIudG9TdHJpbmcoKS5zcGxpdChcIixcIiksZD0hMSxlPTA7ZTxjLmxlbmd0aDtlKyspe3ZhciBmPWNbZV0sZz1mLnNlYXJjaCgveC9pKTtmPWc+LTE/cGFyc2VGbG9hdChmLnN1YnN0cmluZygwLGcpKS9wYXJzZUZsb2F0KGYuc3Vic3RyaW5nKGcrMSkpOnBhcnNlRmxvYXQoZiksTWF0aC5hYnMoYS53aWR0aC9hLmhlaWdodC1mKTwxZS00JiYoZD0hMCl9cmV0dXJuIGR9KSxpKFwibWF4RHVyYXRpb25cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5kdXJhdGlvbiYmYS5kdXJhdGlvbi5tYXh9LC9hdWRpb3x2aWRlby8sdGhpcy5tZWRpYUR1cmF0aW9uLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGkoXCJtaW5EdXJhdGlvblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmR1cmF0aW9uJiZhLmR1cmF0aW9uLm1pbn0sL2F1ZGlvfHZpZGVvLyx0aGlzLm1lZGlhRHVyYXRpb24sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaShcInZhbGlkYXRlQXN5bmNGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LC8uLyxmdW5jdGlvbihhLGIpe3JldHVybiBifSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PSEwfHxudWxsPT09YXx8XCJcIj09PWF9KSxrfHxnLmNhbGwoYixiLiRuZ2ZWYWxpZGF0aW9ucyl9LGUuaW1hZ2VEaW1lbnNpb25zPWZ1bmN0aW9uKGEpe2lmKGEud2lkdGgmJmEuaGVpZ2h0KXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoe3dpZHRoOmEud2lkdGgsaGVpZ2h0OmEuaGVpZ2h0fSl9KSxkLnByb21pc2V9aWYoYS4kbmdmRGltZW5zaW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRGltZW5zaW9uUHJvbWlzZTt2YXIgZj1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/dm9pZCBmLnJlamVjdChcIm5vdCBpbWFnZVwiKTp2b2lkIGUuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmNsaWVudFdpZHRoLGM9aFswXS5jbGllbnRIZWlnaHQ7aC5yZW1vdmUoKSxhLndpZHRoPWIsYS5oZWlnaHQ9YyxmLnJlc29sdmUoe3dpZHRoOmIsaGVpZ2h0OmN9KX1mdW5jdGlvbiBlKCl7aC5yZW1vdmUoKSxmLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2MoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmNsaWVudFdpZHRoP2QoKTppPjEwP2UoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudChcIjxpbWc+XCIpLmF0dHIoXCJzcmNcIixiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSkuYXBwZW5kKGgpfSxmdW5jdGlvbigpe2YucmVqZWN0KFwibG9hZCBlcnJvclwiKX0pfSksYS4kbmdmRGltZW5zaW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRGltZW5zaW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRGltZW5zaW9uUHJvbWlzZX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2V9LGUubWVkaWFEdXJhdGlvbj1mdW5jdGlvbihhKXtpZihhLmR1cmF0aW9uKXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoYS5kdXJhdGlvbil9KSxkLnByb21pc2V9aWYoYS4kbmdmRHVyYXRpb25Qcm9taXNlKXJldHVybiBhLiRuZ2ZEdXJhdGlvblByb21pc2U7dmFyIGY9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpJiYwIT09YS50eXBlLmluZGV4T2YoXCJ2aWRlb1wiKT92b2lkIGYucmVqZWN0KFwibm90IG1lZGlhXCIpOnZvaWQgZS5kYXRhVXJsKGEpLnRoZW4oZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe3ZhciBiPWhbMF0uZHVyYXRpb247YS5kdXJhdGlvbj1iLGgucmVtb3ZlKCksZi5yZXNvbHZlKGIpfWZ1bmN0aW9uIGUoKXtoLnJlbW92ZSgpLGYucmVqZWN0KFwibG9hZCBlcnJvclwiKX1mdW5jdGlvbiBnKCl7YyhmdW5jdGlvbigpe2hbMF0ucGFyZW50Tm9kZSYmKGhbMF0uZHVyYXRpb24/ZCgpOmk+MTA/ZSgpOmcoKSl9LDFlMyl9dmFyIGg9YW5ndWxhci5lbGVtZW50KDA9PT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpP1wiPGF1ZGlvPlwiOlwiPHZpZGVvPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwibm9uZVwiKS5jc3MoXCJwb3NpdGlvblwiLFwiZml4ZWRcIik7aC5vbihcImxvYWRlZG1ldGFkYXRhXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtmLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkR1cmF0aW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRHVyYXRpb25Qcm9taXNlW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhLiRuZ2ZEdXJhdGlvblByb21pc2V9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2V9LGV9XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRSZXNpemVcIixbXCJVcGxvYWRWYWxpZGF0ZVwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEsZT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1NYXRoLm1pbihjL2EsZC9iKTtyZXR1cm57d2lkdGg6YSplLGhlaWdodDpiKmV9fSxmPWZ1bmN0aW9uKGEsYyxkLGYsZyl7dmFyIGg9Yi5kZWZlcigpLGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7cmV0dXJuIDA9PT1jJiYoYz1qLndpZHRoLGQ9ai5oZWlnaHQpLGoub25sb2FkPWZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWUoai53aWR0aCxqLmhlaWdodCxjLGQpO2kud2lkdGg9YS53aWR0aCxpLmhlaWdodD1hLmhlaWdodDt2YXIgYj1pLmdldENvbnRleHQoXCIyZFwiKTtiLmRyYXdJbWFnZShqLDAsMCxhLndpZHRoLGEuaGVpZ2h0KSxoLnJlc29sdmUoaS50b0RhdGFVUkwoZ3x8XCJpbWFnZS9XZWJQXCIsZnx8MSkpfWNhdGNoKGspe2gucmVqZWN0KGspfX0sai5vbmVycm9yPWZ1bmN0aW9uKCl7aC5yZWplY3QoKX0sai5zcmM9YSxoLnByb21pc2V9LGc9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPWEuc3BsaXQoXCIsXCIpLGM9YlswXS5tYXRjaCgvOiguKj8pOy8pWzFdLGQ9YXRvYihiWzFdKSxlPWQubGVuZ3RoLGY9bmV3IFVpbnQ4QXJyYXkoZSk7ZS0tOylmW2VdPWQuY2hhckNvZGVBdChlKTtyZXR1cm4gbmV3IEJsb2IoW2ZdLHt0eXBlOmN9KX07cmV0dXJuIGQuaXNSZXNpemVTdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3JldHVybiB3aW5kb3cuYXRvYiYmYS5nZXRDb250ZXh0JiZhLmdldENvbnRleHQoXCIyZFwiKX0sZC5yZXNpemU9ZnVuY3Rpb24oYSxlLGgsaSl7dmFyIGo9Yi5kZWZlcigpO3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT8oYyhmdW5jdGlvbigpe2oucmVzb2x2ZShcIk9ubHkgaW1hZ2VzIGFyZSBhbGxvd2VkIGZvciByZXNpemluZyFcIil9KSxqLnByb21pc2UpOihkLmRhdGFVcmwoYSwhMCkudGhlbihmdW5jdGlvbihiKXtmKGIsZSxoLGksYS50eXBlKS50aGVuKGZ1bmN0aW9uKGIpe3ZhciBjPWcoYik7Yy5uYW1lPWEubmFtZSxqLnJlc29sdmUoYyl9LGZ1bmN0aW9uKCl7ai5yZWplY3QoKX0pfSxmdW5jdGlvbigpe2oucmVqZWN0KCl9KSxqLnByb21pc2UpfSxkfV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooKXtyZXR1cm4gYy5hdHRyKFwiZGlzYWJsZWRcIil8fG4oXCJuZ2ZEcm9wRGlzYWJsZWRcIixhKX1mdW5jdGlvbiBrKGEsYixjLGQpe3ZhciBlPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIsYSx7JGV2ZW50OmN9KSxmPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIpfHxcImRyYWdvdmVyXCI7aWYoYW5ndWxhci5pc1N0cmluZyhlKSlyZXR1cm4gdm9pZCBkKGUpO2lmKGUmJihlLmRlbGF5JiYocj1lLmRlbGF5KSxlLmFjY2VwdHx8ZS5yZWplY3QpKXt2YXIgZz1jLmRhdGFUcmFuc2Zlci5pdGVtcztpZihudWxsIT1nKWZvcih2YXIgaD1uKFwibmdmUGF0dGVyblwiLGEseyRldmVudDpjfSksaj0wO2o8Zy5sZW5ndGg7aisrKWlmKFwiZmlsZVwiPT09Z1tqXS5raW5kfHxcIlwiPT09Z1tqXS5raW5kKXtpZighaS52YWxpZGF0ZVBhdHRlcm4oZ1tqXSxoKSl7Zj1lLnJlamVjdDticmVha31mPWUuYWNjZXB0fX1kKGYpfWZ1bmN0aW9uIGwoYSxiLGMsZCl7ZnVuY3Rpb24gZShhLGIsYyl7aWYobnVsbCE9YilpZihiLmlzRGlyZWN0b3J5KXt2YXIgZD0oY3x8XCJcIikrYi5uYW1lO2EucHVzaCh7bmFtZTpiLm5hbWUsdHlwZTpcImRpcmVjdG9yeVwiLHBhdGg6ZH0pO3ZhciBmPWIuY3JlYXRlUmVhZGVyKCksZz1bXTtpKys7dmFyIGg9ZnVuY3Rpb24oKXtmLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGQpe3RyeXtpZihkLmxlbmd0aClnPWcuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGR8fFtdLDApKSxoKCk7ZWxzZXtmb3IodmFyIGY9MDtmPGcubGVuZ3RoO2YrKyllKGEsZ1tmXSwoYz9jOlwiXCIpK2IubmFtZStcIi9cIik7aS0tfX1jYXRjaChqKXtpLS0sY29uc29sZS5lcnJvcihqKX19LGZ1bmN0aW9uKCl7aS0tfSl9O2goKX1lbHNlIGkrKyxiLmZpbGUoZnVuY3Rpb24oYil7dHJ5e2ktLSxiLnBhdGg9KGM/YzpcIlwiKStiLm5hbWUsYS5wdXNoKGIpfWNhdGNoKGQpe2ktLSxjb25zb2xlLmVycm9yKGQpfX0sZnVuY3Rpb24oKXtpLS19KX12YXIgZj1bXSxpPTAsaj1hLmRhdGFUcmFuc2Zlci5pdGVtcztpZihqJiZqLmxlbmd0aD4wJiZcImZpbGVcIiE9PWgucHJvdG9jb2woKSlmb3IodmFyIGs9MDtrPGoubGVuZ3RoO2srKyl7aWYoaltrXS53ZWJraXRHZXRBc0VudHJ5JiZqW2tdLndlYmtpdEdldEFzRW50cnkoKSYmaltrXS53ZWJraXRHZXRBc0VudHJ5KCkuaXNEaXJlY3Rvcnkpe3ZhciBsPWpba10ud2Via2l0R2V0QXNFbnRyeSgpO2lmKGwuaXNEaXJlY3RvcnkmJiFjKWNvbnRpbnVlO251bGwhPWwmJmUoZixsKX1lbHNle3ZhciBtPWpba10uZ2V0QXNGaWxlKCk7bnVsbCE9bSYmZi5wdXNoKG0pfWlmKCFkJiZmLmxlbmd0aD4wKWJyZWFrfWVsc2V7dmFyIG49YS5kYXRhVHJhbnNmZXIuZmlsZXM7aWYobnVsbCE9bilmb3IodmFyIG89MDtvPG4ubGVuZ3RoJiYoZi5wdXNoKG4uaXRlbShvKSksZHx8IShmLmxlbmd0aD4wKSk7bysrKTt9dmFyIHA9MDshZnVuY3Rpb24gcShhKXtnKGZ1bmN0aW9uKCl7aWYoaSkxMCpwKys8MmU0JiZxKDEwKTtlbHNle2lmKCFkJiZmLmxlbmd0aD4xKXtmb3Ioaz0wO1wiZGlyZWN0b3J5XCI9PT1mW2tdLnR5cGU7KWsrKztmPVtmW2tdXX1iKGYpfX0sYXx8MCl9KCl9dmFyIG09YigpLG49ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBpLmF0dHJHZXR0ZXIoYSxkLGIsYyl9O2lmKG4oXCJkcm9wQXZhaWxhYmxlXCIpJiZnKGZ1bmN0aW9uKCl7YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0/YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0udmFsdWU9bTphW24oXCJkcm9wQXZhaWxhYmxlXCIpXT1tfSksIW0pcmV0dXJuIHZvaWQobihcIm5nZkhpZGVPbkRyb3BOb3RBdmFpbGFibGVcIixhKT09PSEwJiZjLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIikpO2kucmVnaXN0ZXJWYWxpZGF0b3JzKGUsbnVsbCxkLGEpO3ZhciBvLHA9bnVsbCxxPWYobihcIm5nZlN0b3BQcm9wYWdhdGlvblwiKSkscj0xO2NbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsZnVuY3Rpb24oYil7aWYoIWooKSl7aWYoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCksbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpPi0xKXt2YXIgZT1iLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkO2IuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q9XCJtb3ZlXCI9PT1lfHxcImxpbmtNb3ZlXCI9PT1lP1wibW92ZVwiOlwiY29weVwifWcuY2FuY2VsKHApLG98fChvPVwiQ1wiLGsoYSxkLGIsZnVuY3Rpb24oYSl7bz1hLGMuYWRkQ2xhc3Mobyl9KSl9fSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsZnVuY3Rpb24oYil7aigpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsZnVuY3Rpb24oKXtqKCl8fChwPWcoZnVuY3Rpb24oKXtvJiZjLnJlbW92ZUNsYXNzKG8pLG89bnVsbH0scnx8MSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLGZ1bmN0aW9uKGIpe2ooKXx8KGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpLG8mJmMucmVtb3ZlQ2xhc3Mobyksbz1udWxsLGwoYixmdW5jdGlvbihjKXtpLnVwZGF0ZU1vZGVsKGUsZCxhLG4oXCJuZ2ZDaGFuZ2VcIil8fG4oXCJuZ2ZEcm9wXCIpLGMsYil9LG4oXCJuZ2ZBbGxvd0RpclwiLGEpIT09ITEsbihcIm11bHRpcGxlXCIpfHxuKFwibmdmTXVsdGlwbGVcIixhKSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIixmdW5jdGlvbihiKXtpZighaigpKXt2YXIgYz1bXSxmPWIuY2xpcGJvYXJkRGF0YXx8Yi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGE7aWYoZiYmZi5pdGVtcyl7Zm9yKHZhciBnPTA7ZzxmLml0ZW1zLmxlbmd0aDtnKyspLTEhPT1mLml0ZW1zW2ddLnR5cGUuaW5kZXhPZihcImltYWdlXCIpJiZjLnB1c2goZi5pdGVtc1tnXS5nZXRBc0ZpbGUoKSk7aS51cGRhdGVNb2RlbChlLGQsYSxuKFwibmdmQ2hhbmdlXCIpfHxuKFwibmdmRHJvcFwiKSxjLGIpfX19LCExKX1mdW5jdGlvbiBiKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm5cImRyYWdnYWJsZVwiaW4gYSYmXCJvbmRyb3BcImluIGEmJiEvRWRnZVxcLzEyLi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9bmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkRyb3BcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkbG9jYXRpb25cIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGIsYyxkLGUpe3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZixnLGgsaSl7YShmLGcsaCxpLGIsYyxkLGUpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZk5vRmlsZURyb3BcIixmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhLGMpe2IoKSYmYy5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpfX0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZEcm9wQXZhaWxhYmxlXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxjLGQpe3JldHVybiBmdW5jdGlvbihlLGYsZyl7aWYoYigpKXt2YXIgaD1hKGQuYXR0ckdldHRlcihcIm5nZkRyb3BBdmFpbGFibGVcIixnKSk7YyhmdW5jdGlvbigpe2goZSksaC5hc3NpZ24mJmguYXNzaWduKGUsITApfSl9fX1dKX0oKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
