/**
 * app.routes
 * @desc    contains the routes for the app
 */

 var app = angular.module('app', ['ngRoute', 'ngCookies',  'ngFileUpload', 'ui.bootstrap',
    'app.config', 'app.companies', 'app.fellows', 'app.profile', 'app.votes'])
    .run(run);

/**
 *   * @name config
 *     * @desc Define valid application routes
 *       */
 app.config(function($routeProvider){

    $routeProvider
    .when('/', {
        controller  : 'RoutingController',
        templateUrl : 'source/app/home/home.html'
    })
    .when('/fellows', {
        controller: 'RoutingController',
        templateUrl: 'source/app/fellows/fellows.html'
    })
    .when('/companies', {
        controller: 'CompaniesController',
        templateUrl: 'source/app/companies/companies.html'
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
    .otherwise({ redirectTo: '/' });

});

app.controller('RoutingController', RoutingController)
.controller('LoginModalInstanceController', LoginModalInstanceController);

RoutingController.$inject = ['$scope', '$modal', '$window', 'User'];
LoginModalInstanceController.$inject = ['$scope', '$window', '$modalInstance', 'User'];

function RoutingController($scope, $modal, $window, User) {

    $scope.isUserLoggedIn = false;
    updateLoginStatus();

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

        console.log(loginForm);
        User.login(loginForm).success(function(user){

            console.log(user);
            //User.currentUser = user
            User.SetCredentials(user.id, user.email, user.userType);
            $window.location.reload();
            $modalInstance.close();

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
        'app.home.services'
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
        'app.votes.services'
        ]);

  //declare the services module
  angular
    .module('app.votes.services', []);

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

    Companies.all().success( function(companies){

          $scope.companies = companies;
    });

    $scope.openModal = function (company) {

      $scope.company = company;

      var modalInstance = $modal.open({

        templateUrl: 'source/app/companies/partials/company_detail_view.html',
        controller: 'CompaniesModalInstanceController',
        size: 'lg',
        resolve: {
          company: function(){
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
    'company', 'CompanyVotes', 'User'];

  function CompaniesModalInstanceController($scope, $modalInstance, company, CompanyVotes, User) {

    $scope.company = company;

    $scope.ok = function () {
      $modalInstance.close($scope.company);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.vote = function vote(company) {
			console.log(company.id);
      var current = User.getCurrentUser();
			console.log(current);
      if(current.userType === "Fellow") {
				$scope.loading = true;
				console.log(company.id);
        return CompanyVotes.create(current.id, company.id)
				.success( function(vote) {
						console.log("success!");
						return vote;
					})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					console.log("finally");
					$scope.loading = false;
					$scope.done = true;
					$timeout(function() {
						$scope.done = false;
					},3000);
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

    Fellows.all().success(function(fellows){

        $scope.fellows = fellows;
    });

    $scope.openModal = function(fellow) {

      $scope.fellow = fellow;

      var modalInstance = $modal.open({

        templateUrl: 'source/app/fellows/partials/fellow_detail_view.html',
        controller: 'FellowsModalInstanceController',
        size: 'lg',
        resolve: {
          fellow: function(){
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

  FellowsModalInstanceController.$inject = ['$scope', '$modalInstance',  'fellow',
	'FellowVotes', 'User', '$timeout'];

  function FellowsModalInstanceController ($scope, $modalInstance, fellow, FellowVotes, User) {

    $scope.fellow = fellow;

    //console.log(fellow);

    $scope.ok = function ok() {
      $modalInstance.close($scope.fellow);
    };

    $scope.cancel = function cancel() {
      $modalInstance.dismiss('cancel');
    };

    $scope.vote = function vote(fellow) {
			console.log("vote");
      var current = User.getCurrentUser();
      if(current.userType === "Company") {
				$scope.loading = true;
        FellowVotes.create(fellow.id, current.id)
					.success( function(vote) {
						console.log("success!");
						//return vote;
					})
				.catch(function (err) {
					console.log(err);
				})
				.finally(function () {
					console.log("finally");
						$scope.loading = false;
						$scope.done = true;
					$timeout(function() {
						$scope.done = false;
					}, 3000);
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

  HomeController.$inject = ['$scope'];

  /**
  * @namespace HomeController
  */
  function HomeController($scope) {
    var vm = this;

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

    AdminProfileController.$inject = ['$scope', '$location', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $location, User, Fellows, Companies) {

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

        //$scope.openModal = function() {
        //
        //    var modalInstance = $modal.open({
        //
        //        templateUrl: 'source/app/profile/partials/admin-create-user.html',
        //        controller: 'AdminProfileModalInstanceController',
        //        size: 'lg'
        //        //resolve: {
        //        //    function(){
        //        //
        //        //    }
        //        //}
        //
        //    });
        //};

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

        // Admin profile tabs
        $scope.tabs = [
            {
                title:'User List',
                template:'source/app/profile/partials/admin/user-list.html'
            },
            {
                title:'New User',
                template:'source/app/profile/partials/admin/new-user-form.html'
            },
            {
                title:'Votes',
                template:'source/app/profile/partials/admin/admin-votes.html'
            }
        ];


        $scope.ok = function (user) {

            // remove previous highlights in case data is now correct
            unHighlightField();

            // if everything is good log data and close, else highlight error
            var errors = false;
            if(typeof(user) == "undefined"){
                console.log("No info");
                //heighlight all
                highlightEmailField();
                highlightPasswordField();
                highlightUserTypeField();
                errors = true;
            }
            else {

                if(typeof(user.email) == "undefined"){
                    console.log("Bad email");
                    //heighlight email
                    highlightEmailField();
                    errors = true;
                }

                if(typeof(user.password) == "undefined"){
                    console.log("Bad password");
                    //heighlight password
                    highlightPasswordField();
                    errors = true;
                }

                if(typeof(user.userType) == "undefined"){
                    console.log("Bad type");
                    //highlight button
                    highlightUserTypeField();
                    errors = true;
                }
            }

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

                //$modalInstance.close();
            }

        };

        //$scope.cancel = function () {
        //    $modalInstance.dismiss('cancel');
        //};

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
    }


    //function AdminProfileModalInstanceController ($scope, $modalInstance, User, Fellows, Companies) {
    //
    //    function unHighlightField(){
    //
    //        jQuery("input").removeClass("error");
    //        jQuery("#userType").removeClass('error');
    //    }
    //
    //    function highlightPasswordField(){
    //
    //        jQuery("#password").addClass('error');
    //    }
    //
    //    function highlightEmailField(){
    //
    //        jQuery("email").addClass('error');
    //    }
    //
    //    function highlightUserTypeField(){
    //
    //        jQuery("userType").addClass('error');
    //    }
    //
    //    $scope.user = {
    //        email: "",
    //        password: "",
    //        userType: ""
    //    };
    //
    //    $scope.ok = function (user) {
    //
    //        /**********DEBUG START*********/
    //        user.userType = "Fellow"
    //        /**********DEBUG END*********/
    //        // remove previous highlights in case data is now correct
    //        unHighlightField();
    //
    //        console.log("User Output");
    //        console.log(user);
    //
    //        // if everything is good log data and close, else highlight error
    //        var errors = false;
    //        if(typeof(user) == "undefined"){
    //            console.log("No info");
    //            //heighlight all
    //            highlightEmailField();
    //            highlightPasswordField();
    //            highlightUserTypeField();
    //            errors = true;
    //        }
    //        else {
    //
    //            if(typeof(user.email) == "undefined"){
    //                console.log("Bad email");
    //                //heighlight email
    //                highlightEmailField();
    //                errors = true;
    //            }
    //
    //            if(typeof(user.password) == "undefined"){
    //                console.log("Bad password");
    //                //heighlight password
    //                highlightPasswordField();
    //                errors = true;
    //            }
    //
    //            if(typeof(user.userType) == "undefined"){
    //                console.log("Bad type");
    //                //highlight button
    //                highlightUserTypeField();
    //                errors = true;
    //            }
    //        }
    //
    //        if( !errors ){
    //
    //            // send user to API via Service
    //            User.create(user).then(function(response) {
    //
    //                console.log(response);
    //
    //                var user_id = response.data.id;
    //
    //                if( user.userType === "Fellow" ){
    //
    //                    var fellow_post = {
    //
    //                        user_id: user_id
    //                    };
    //                    Fellows.create(fellow_post);
    //                }
    //                else if( user.userType === "Company" ){
    //
    //                    var company_post = {
    //
    //                        user_id: user_id
    //                    };
    //                    Companies.create(company_post);
    //                }
    //                //console.log(user);
    //            });
    //
    //            $modalInstance.close();
    //        }
    //
    //    };
    //
    //    $scope.cancel = function () {
    //        $modalInstance.dismiss('cancel');
    //    };
    //
    //    $scope.switchType = function(user, $event){
    //
    //        console.log(user);
    //
    //        if( user.userType === "Company" ){
    //
    //            jQuery("optionCompany").addClass('selected');
    //            jQuery("optionFellow").removeClass('selected');
    //        }
    //        else if( user.userType === "Fellow" ){
    //
    //            console.log("Fellow selection");
    //
    //            jQuery("optionCompany").removeClass('selected');
    //            jQuery("optionFellow").addClass('selected');
    //        }
    //
    //    };
    //}

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
            company.tags = $("#tags").val();

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

          // redirect the user based on their type
          if (currentUser.userType === 'Admin') {
              $location.path("/profile/admin");
          }
          else if (currentUser.userType === 'Fellow') {
              $location.path("/profile/fellow");
          }
          else if (currentUser.userType === 'Company') {
              $location.path("/profile/company");
          }
      }
      else{

           $location.path("/");
      }

  }


})();

/**
* CompanyVotes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('CompanyVotes', CompanyVotes);

  CompanyVotes.$inject = ['$http', 'CONFIG'];


  /**
  * @namespace CompanyVotes
  */
  function CompanyVotes($http, CONFIG) {

    var rootUrl = CONFIG.SERVICE_URL;

    return {
      get: get,
      create: create,
      destroy: destroy
    };

    /**
     * @name get by company
     * @desc get the companies one company voted on)
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/votes/company/' + id);
    }

    /**
     * @name create
     * @desc company votes on a company
     */
     function create(fellow_id, company_id) {
      console.log(fellow_id + ' ' + company_id);
      return $http.post(rootUrl + '/api/v1/votes/company/', {
        fellow_id: fellow_id,
        company_id: company_id
      });
    }

    /**
     * @name destroy
     * @desc destroy a vote record
     */
    function destroy(id) {
      return $http.delete(rootUrl + '/api/v1/votes/company' + id);
    }
  }


})();


/**
* FellowVotes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('FellowVotes', FellowVotes);

  FellowVotes.$inject = ['$http', 'CONFIG'];


  /**
  * @namespace FellowVotes
  */
  function FellowVotes($http, CONFIG) {

    var rootUrl = CONFIG.SERVICE_URL;

    return {
      get: get,
      create: create,
      destroy: destroy
    };


    ////////////////////


    /**
     * @name get by company
     * @desc get the companies one fellow voted on)
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/votes/fellow/' + id);
    }

    /**
     * @name create
     * @desc fellow votes on a company
     */
    function create(fellow_id, company_id) {
      console.log("fellowVoteCreate" + fellow_id + ' ' + company_id);
      return $http.post(rootUrl + '/api/v1/votes/fellow/', {
        fellow_id: fellow_id,
        company_id: company_id
      });
    }

    /**
     * @name destroy
     * @desc destroy a vote record
     */
    function destroy(id) {
      return $http.delete(rootUrl + '/api/v1/votes/fellow' + id);
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
          create: create,
          login: login,
          //update: update,
          //destroy: destroy
          SetCredentials: SetCredentials,
          ClearCredentials: ClearCredentials,
          getCurrentUser: getCurrentUser,
          setCurrentUser: setCurrentUser,
          isUserLoggedIn: isUserLoggedIn
      };


      /**
       * @name all
       * @desc get all the companies
       */
      //function all() {
      //
      //    return [];
      //
      //    //return $http.get(rootUrl + '/api/v1/companies/');
      //}

      /**
       * @name get
       * @desc get just one company
       */
      //function get(id) {
      //    return $http.get(rootUrl + '/api/v1/users/' + parseInt(id) );
      //}

      /**
       * @name create
       * @desc create a new fellow record
       */
      function create(user) {
          return $http.post(rootUrl + '/api/v1/users/create', user);
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

/*! 7.0.17 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="7.0.17",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){d.method=d.method||"POST",d.headers=d.headers||{};var e=b.defer(),f=e.promise;return d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,e.notify?e.notify(a):f.progressFunc&&c(function(){f.progressFunc(a)})},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,e.notify?e.notify(a):f.progressFunc&&c(function(){f.progressFunc(a)}))},!1))}},a(d).then(function(a){e.resolve(a)},function(a){e.reject(a)},function(a){e.notify(a)}),f.success=function(a){return f.then(function(b){a(b.data,b.status,b.headers,d)}),f},f.error=function(a){return f.then(null,function(b){a(b.data,b.status,b.headers,d)}),f},f.progress=function(a){return f.progressFunc=a,f.then(null,null,function(b){a(b)}),f},f.abort=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),f},f.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(f,arguments),a.apply(f,arguments)}}(d.xhrFn),f},f}this.upload=function(a){function b(c,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))c.append(e,d);else if("form"===a.sendFieldsAs)if(angular.isObject(d))for(var f in d)d.hasOwnProperty(f)&&b(c,d[f],e+"["+f+"]");else c.append(e,d);else d=angular.isString(d)?d:angular.toJson(d),"json-blob"===a.sendFieldsAs?c.append(e,new Blob([d],{type:"application/json"})):c.append(e,d)}return a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(c){var d,e=new FormData,f={};for(d in a.fields)a.fields.hasOwnProperty(d)&&(f[d]=a.fields[d]);c&&(f.data=c);for(d in f)if(f.hasOwnProperty(d)){var g=f[d];a.formDataAppender?a.formDataAppender(e,d,g):b(e,g,d)}if(null!=a.file){var h=a.fileFormDataName||"file";if(angular.isArray(a.file))for(var i=angular.isString(h),j=0;j<a.file.length;j++)e.append(i?h:h[j],a.file[j],a.fileName&&a.fileName[j]||a.file[j].name);else e.append(h,a.file,a.fileName||a.file.name)}return e}),d(a)},this.http=function(b){return b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},d(b)},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),function(){ngFileUpload.service("Upload",["$parse","$timeout","$compile","UploadValidate",function(a,b,c,d){var e=d;return e.getAttrWithDefaults=function(a,b){return null!=a[b]?a[b]:null==e.defaults[b]?e.defaults[b]:e.defaults[b].toString()},e.attrGetter=function(b,c,d,e){if(!d)return this.getAttrWithDefaults(c,b);try{return e?a(this.getAttrWithDefaults(c,b))(d,e):a(this.getAttrWithDefaults(c,b))(d)}catch(f){if(b.search(/min|max|pattern/i))return this.getAttrWithDefaults(c,b);throw f}},e.updateModel=function(c,d,f,g,h,i,j){function k(){var j=h&&h.length?h[0]:null;if(c){var k=!e.attrGetter("ngfMultiple",d,f)&&!e.attrGetter("multiple",d)&&!l;a(e.attrGetter("ngModel",d)).assign(f,k?j:h)}var m=e.attrGetter("ngfModel",d);m&&a(m).assign(f,h),g&&a(g)(f,{$files:h,$file:j,$event:i}),b(function(){})}var l=e.attrGetter("ngfKeep",d,f);if(l===!0){if(!h||!h.length)return;var m=(c&&c.$modelValue||d.$$ngfPrevFiles||[]).slice(0),n=!1;if(e.attrGetter("ngfKeepDistinct",d,f)===!0){for(var o=m.length,p=0;p<h.length;p++){for(var q=0;o>q&&h[p].name!==m[q].name;q++);q===o&&(m.push(h[p]),n=!0)}if(!n)return;h=m}else h=m.concat(h)}d.$$ngfPrevFiles=h,j?k():e.validate(h,c,d,f,e.attrGetter("ngfValidateLater",d),function(){b(function(){k()})})},e}])}(),function(){function a(a,c,d,e,f,g,h,i){function j(){return"input"===c[0].tagName.toLowerCase()&&d.type&&"file"===d.type.toLowerCase()}function k(){return t("ngfChange")||t("ngfSelect")}function l(b){for(var c=b.__files_||b.target&&b.target.files,f=[],g=0;g<c.length;g++)f.push(c[g]);i.updateModel(e,d,a,k(),f.length?f:null,b)}function m(a){if(c!==a)for(var b=0;b<c[0].attributes.length;b++){var d=c[0].attributes[b];"type"!==d.name&&"class"!==d.name&&"id"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,d.value))}}function n(){if(j())return c;var a=angular.element('<input type="file">');return m(a),a.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),b.push({el:c,ref:a}),document.body.appendChild(a[0]),a}function o(b){if(c.attr("disabled")||t("ngfSelectDisabled",a))return!1;var d=p(b);return null!=d?d:(r(b),q(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1)}function p(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function q(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=i.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function r(b){w.val()&&(w.val(null),i.updateModel(e,d,a,k(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",l),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return i.attrGetter(a,d,b)},u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),d.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){d.$$observers&&delete d.$$observers.accept});var v=0,w=c;j()||(w=n()),w.bind("change",l),j()?c.bind("click",r):c.bind("click touchstart touchend",o),i.registerValidators(e,w,d,a),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),a.$on("$destroy",function(){j()||w.remove(),angular.forEach(u,function(a){a()})}),g(function(){for(var a=0;a<b.length;a++){var c=b[a];document.body.contains(c.el[0])||(b.splice(a,1),c.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(c,w,l)}var b=[];ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}])}(),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/\./}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.dataUrl=function(a,d){if(d&&null!=a.dataUrl||!d&&null!=a.blobUrl){var e=c.defer();return b(function(){e.resolve(d?a.dataUrl:a.blobUrl)}),e.promise}var f=d?a.$ngfDataUrlPromise:a.$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!d){var e;try{e=c.createObjectURL(a)}catch(f){return void b(function(){a.blobUrl="",g.reject()})}b(function(){a.blobUrl=e,e&&g.resolve(e)})}else{var h=new FileReader;h.onload=function(c){b(function(){a.dataUrl=c.target.result,g.resolve(c.target.result)})},h.onerror=function(){b(function(){a.dataUrl="",g.reject()})},h.readAsDataURL(a)}}else b(function(){a[d?"dataUrl":"blobUrl"]="",g.reject()})}),f=d?a.$ngfDataUrlPromise=g.promise:a.$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[d?"$ngfDataUrlPromise":"$ngfBlobUrlPromise"]}),f},d}]);var b=angular.element("<style>.ngf-hide{display:none !important}</style>");document.getElementsByTagName("head")[0].appendChild(b[0]),ngFileUpload.directive("ngfSrc",["$compile","$timeout","Upload",function(b,c,d){return{restrict:"AE",link:function(b,e,f){c(function(){var g=b.$watch(f.ngfSrc,function(g){if(angular.isString(g))return e.removeClass("ngf-hide"),e.attr("src",g);if(g&&g.type&&0===g.type.indexOf(a(e[0]))){var h=d.attrGetter("ngfNoObjectUrl",f,b);d.dataUrl(g,h)["finally"](function(){c(function(){h&&g.dataUrl||!h&&g.blobUrl?(e.removeClass("ngf-hide"),e.attr("src",h?g.dataUrl:g.blobUrl)):e.addClass("ngf-hide")})})}else e.addClass("ngf-hide")});b.$on("$destroy",function(){g()})})}}}]),ngFileUpload.directive("ngfBackground",["Upload","$compile","$timeout",function(a,b,c){return{restrict:"AE",link:function(b,d,e){c(function(){var f=b.$watch(e.ngfBackground,function(f){if(angular.isString(f))return d.css("background-image","url('"+f+"')");if(f&&f.type&&0===f.type.indexOf("image")){var g=a.attrGetter("ngfNoObjectUrl",e,b);a.dataUrl(f,g)["finally"](function(){c(function(){g&&f.dataUrl||!g&&f.blobUrl?d.css("background-image","url('"+(g?f.dataUrl:f.blobUrl)+"')"):d.css("background-image","")})})}else d.css("background-image","")});b.$on("$destroy",function(){f()})})}}}]),ngFileUpload.config(["$compileProvider",function(a){a.imgSrcSanitizationWhitelist&&a.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|local|file|data|blob):/),a.aHrefSanitizationWhitelist&&a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|local|file|data|blob):/)}]),ngFileUpload.filter("ngfDataUrl",["UploadDataUrl","$sce",function(a,b){return function(c,d){return angular.isString(c)?b.trustAsResourceUrl(c):c&&!c.dataUrl?(void 0===c.dataUrl&&angular.isObject(c)&&(c.dataUrl=null,a.dataUrl(c,d)),""):(c&&c.dataUrl?b.trustAsResourceUrl(c.dataUrl):c)||""}}])}(),function(){function a(b){if(b.length>2&&"/"===b[0]&&"/"===b[b.length-1])return b.substring(1,b.length-1);var c=b.split(","),d="";if(c.length>1)for(var e=0;e<c.length;e++)d+="("+a(c[e])+")",e<c.length-1&&(d+="|");else 0===b.indexOf(".")&&(b="*"+b),d="^"+b.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",d=d.replace(/\\\*/g,".*").replace(/\\\?/g,".");return d}function b(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1e3*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1e6*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1e9*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a}ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(c,d,e){var f=c;return f.registerValidators=function(a,b,c,d){function e(a){angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})}a&&(a.$ngfValidations=[],a.$formatters.push(function(g){return f.attrGetter("ngfValidateLater",c,d)||!a.$$ngfValidated?(f.validate(g,a,c,d,!1,function(){e(a),a.$$ngfValidated=!1}),g&&0===g.length&&(g=null),!b||null!=g&&0!==g.length||b.val()&&b.val(null)):(e(a),a.$$ngfValidated=!1),g}))},f.validatePattern=function(b,c){if(!c)return!0;var d=new RegExp(a(c),"gi");return null!=b.type&&d.test(b.type.toLowerCase())||null!=b.name&&d.test(b.name.toLowerCase())},f.validate=function(a,c,d,e,g,h){function i(b,d,e){if(a){for(var f="ngf"+b[0].toUpperCase()+b.substr(1),g=a.length,h=null;g--;){var i=a[g],j=k(f,{$file:i});null==j&&(j=d(k("ngfValidate")||{}),h=null==h?!0:h),null!=j&&(e(i,j)||(i.$error=b,i.$errorParam=j,a.splice(g,1),h=!1))}null!==h&&c.$ngfValidations.push({name:b,valid:h})}}function j(b,d,e,f,g){if(a){var i=0,j=!1,m="ngf"+b[0].toUpperCase()+b.substr(1);a=void 0===a.length?[a]:a,angular.forEach(a,function(a){if(0!==a.type.search(e))return!0;var n=k(m,{$file:a})||d(k("ngfValidate",{$file:a})||{});n&&(l++,i++,f(a,n).then(function(c){g(c,n)||(a.$error=b,a.$errorParam=n,j=!0)},function(){k("ngfValidateForce",{$file:a})&&(a.$error=b,a.$errorParam=n,j=!0)})["finally"](function(){l--,i--,i||c.$ngfValidations.push({name:b,valid:!j}),l||h.call(c,c.$ngfValidations)}))})}}c=c||{},c.$ngfValidations=c.$ngfValidations||[],angular.forEach(c.$ngfValidations,function(a){a.valid=!0});var k=function(a,b){return f.attrGetter(a,d,e,b)};if(g)return void h.call(c);if(c.$$ngfValidated=!0,null==a||0===a.length)return void h.call(c);if(a=void 0===a.length?[a]:a.slice(0),i("pattern",function(a){return a.pattern},f.validatePattern),i("minSize",function(a){return a.size&&a.size.min},function(a,c){return a.size>=b(c)}),i("maxSize",function(a){return a.size&&a.size.max},function(a,c){return a.size<=b(c)}),i("validateFn",function(){return null},function(a,b){return b===!0||null===b||""===b}),!a.length)return void h.call(c,c.$ngfValidations);var l=0;j("maxHeight",function(a){return a.height&&a.height.max},/image/,this.imageDimensions,function(a,b){return a.height<=b}),j("minHeight",function(a){return a.height&&a.height.min},/image/,this.imageDimensions,function(a,b){return a.height>=b}),j("maxWidth",function(a){return a.width&&a.width.max},/image/,this.imageDimensions,function(a,b){return a.width<=b}),j("minWidth",function(a){return a.width&&a.width.min},/image/,this.imageDimensions,function(a,b){return a.width>=b}),j("ratio",function(a){return a.ratio},/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++){var f=c[e],g=f.search(/x/i);f=g>-1?parseFloat(f.substring(0,g))/parseFloat(f.substring(g+1)):parseFloat(f),Math.abs(a.width/a.height-f)<1e-4&&(d=!0)}return d}),j("maxDuration",function(a){return a.duration&&a.duration.max},/audio|video/,this.mediaDuration,function(a,c){return a<=b(c)}),j("minDuration",function(a){return a.duration&&a.duration.min},/audio|video/,this.mediaDuration,function(a,c){return a>=b(c)}),j("validateAsyncFn",function(){return null},/./,function(a,b){return b},function(a){return a===!0||null===a||""===a}),l||h.call(c,c.$ngfValidations)},f.imageDimensions=function(a){if(a.width&&a.height){var b=d.defer();return e(function(){b.resolve({width:a.width,height:a.height})}),b.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var c=d.defer();return e(function(){return 0!==a.type.indexOf("image")?void c.reject("not image"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,d=h[0].clientHeight;h.remove(),a.width=b,a.height=d,c.resolve({width:b,height:d})}function f(){h.remove(),c.reject("load error")}function g(){e(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?f():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",f);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){c.reject("load error")})}),a.$ngfDimensionPromise=c.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},f.mediaDuration=function(a){if(a.duration){var b=d.defer();return e(function(){b.resolve(a.duration)}),b.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var c=d.defer();return e(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void c.reject("not media"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.duration=b,h.remove(),c.resolve(b)}function f(){h.remove(),c.reject("load error")}function g(){e(function(){h[0].parentNode&&(h[0].duration?d():i>10?f():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",f);var i=0;g(),angular.element(document.body).append(h)},function(){c.reject("load error")})}),a.$ngfDurationPromise=c.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},f}])}(),function(){function a(a,c,d,e,f,g,h,i){function j(){return c.attr("disabled")||n("ngfDropDisabled",a)}function k(a,b,c,d){var e=n("ngfDragOverClass",a,{$event:c}),f=n("ngfDragOverClass")||"dragover";if(angular.isString(e))return void d(e);if(e&&(e.delay&&(r=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g)for(var h=n("ngfPattern",a,{$event:c}),j=0;j<g.length;j++)if("file"===g[j].kind||""===g[j].kind){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}}d(f)}function l(a,b,c,d){function e(a,b,c){if(null!=b)if(b.isDirectory){var d=(c||"")+b.name;a.push({name:b.name,type:"directory",path:d});var f=b.createReader(),g=[];i++;var h=function(){f.readEntries(function(d){try{if(d.length)g=g.concat(Array.prototype.slice.call(d||[],0)),h();else{for(var f=0;f<g.length;f++)e(a,g[f],(c?c:"")+b.name+"/");i--}}catch(j){i--,console.error(j)}},function(){i--})};h()}else i++,b.file(function(b){try{i--,b.path=(c?c:"")+b.name,a.push(b)}catch(d){i--,console.error(d)}},function(){i--})}var f=[],i=0,j=a.dataTransfer.items;if(j&&j.length>0&&"file"!==h.protocol())for(var k=0;k<j.length;k++){if(j[k].webkitGetAsEntry&&j[k].webkitGetAsEntry()&&j[k].webkitGetAsEntry().isDirectory){var l=j[k].webkitGetAsEntry();if(l.isDirectory&&!c)continue;null!=l&&e(f,l)}else{var m=j[k].getAsFile();null!=m&&f.push(m)}if(!d&&f.length>0)break}else{var n=a.dataTransfer.files;if(null!=n)for(var o=0;o<n.length&&(f.push(n.item(o)),d||!(f.length>0));o++);}var p=0;!function q(a){g(function(){if(i)10*p++<2e4&&q(10);else{if(!d&&f.length>1){for(k=0;"directory"===f[k].type;)k++;f=[f[k]]}b(f)}},a||0)}()}var m=b(),n=function(a,b,c){return i.attrGetter(a,d,b,c)};if(n("dropAvailable")&&g(function(){a[n("dropAvailable")]?a[n("dropAvailable")].value=m:a[n("dropAvailable")]=m}),!m)return void(n("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));i.registerValidators(e,null,d,a);var o,p=null,q=f(n("ngfStopPropagation")),r=1;c[0].addEventListener("dragover",function(b){if(!j()){if(b.preventDefault(),q(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(p),o||(o="C",k(a,d,b,function(a){o=a,c.addClass(o)}))}},!1),c[0].addEventListener("dragenter",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(){j()||(p=g(function(){c.removeClass(o),o=null},r||1))},!1),c[0].addEventListener("drop",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation(),c.removeClass(o),o=null,l(b,function(c){i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)},n("ngfAllowDir",a)!==!1,n("multiple")||n("ngfMultiple",a)))},!1),c[0].addEventListener("paste",function(b){if(!j()){var c=[],f=b.clipboardData||b.originalEvent.clipboardData;if(f&&f.items){for(var g=0;g<f.items.length;g++)-1!==f.items[g].type.indexOf("image")&&c.push(f.items[g].getAsFile());i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)}}},!1)}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImNvbXBhbmllcy9jb21wYW5pZXMubW9kdWxlLmpzIiwiZmVsbG93cy9mZWxsb3dzLm1vZHVsZS5qcyIsImhvbWUvaG9tZS5tb2R1bGUuanMiLCJwcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwidm90ZXMvdm90ZXMubW9kdWxlLmpzIiwiY29tcGFuaWVzL2NvbnRyb2xsZXJzL2NvbXBhbmllcy5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3dzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvc2VydmljZXMvY29tcGFuaWVzLnNlcnZpY2UuanMiLCJmZWxsb3dzL2RpcmVjdGl2ZXMvZmVsbG93Q2FyZC5kaXJlY3RpdmUuanMiLCJmZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsImhvbWUvY29udHJvbGxlcnMvaG9tZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9hZG1pblByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvY29tcGFueVByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvZmVsbG93c1Byb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvcHJvZmlsZS5jb250cm9sbGVyLmpzIiwidm90ZXMvc2VydmljZXMvY29tcGFueVZvdGVzLnNlcnZpY2UuanMiLCJ2b3Rlcy9zZXJ2aWNlcy9mZWxsb3dWb3Rlcy5zZXJ2aWNlLmpzIiwicHJvZmlsZS9zZXJ2aWNlcy90YWdzLnNlcnZpY2UuanMiLCJwcm9maWxlL3NlcnZpY2VzL3VzZXIuc2VydmljZS5qcyIsIm5nLWZpbGUtdXBsb2FkLm1pbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwTkE7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGFwcC5yb3V0ZXNcbiAqIEBkZXNjICAgIGNvbnRhaW5zIHRoZSByb3V0ZXMgZm9yIHRoZSBhcHBcbiAqL1xuXG4gdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUm91dGUnLCAnbmdDb29raWVzJywgICduZ0ZpbGVVcGxvYWQnLCAndWkuYm9vdHN0cmFwJyxcbiAgICAnYXBwLmNvbmZpZycsICdhcHAuY29tcGFuaWVzJywgJ2FwcC5mZWxsb3dzJywgJ2FwcC5wcm9maWxlJywgJ2FwcC52b3RlcyddKVxuICAgIC5ydW4ocnVuKTtcblxuLyoqXG4gKiAgICogQG5hbWUgY29uZmlnXG4gKiAgICAgKiBAZGVzYyBEZWZpbmUgdmFsaWQgYXBwbGljYXRpb24gcm91dGVzXG4gKiAgICAgICAqL1xuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xuXG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAud2hlbignLycsIHtcbiAgICAgICAgY29udHJvbGxlciAgOiAnUm91dGluZ0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybCA6ICdzb3VyY2UvYXBwL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9mZWxsb3dzJywge1xuICAgICAgICBjb250cm9sbGVyOiAnUm91dGluZ0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9mZWxsb3dzLmh0bWwnXG4gICAgfSlcbiAgICAud2hlbignL2NvbXBhbmllcycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL2NvbXBhbmllcy5odG1sJ1xuICAgIH0pXG5cbiAgICAud2hlbignL3Byb2ZpbGUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3Byb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2FkbWluJywge1xuICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLXByb2ZpbGUuaHRtbCdcbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2ZlbGxvdy1wcm9maWxlLmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9jb21wYW55Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvY29tcGFueS1wcm9maWxlLmh0bWwnXG4gICAgfSlcbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1JvdXRpbmdDb250cm9sbGVyJywgUm91dGluZ0NvbnRyb2xsZXIpXG4uY29udHJvbGxlcignTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG5Sb3V0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJyR3aW5kb3cnLCAnVXNlciddO1xuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHdpbmRvdycsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJ107XG5cbmZ1bmN0aW9uIFJvdXRpbmdDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCAkd2luZG93LCBVc2VyKSB7XG5cbiAgICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBmYWxzZTtcbiAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xuXG4gICAgIGZ1bmN0aW9uIHVwZGF0ZUxvZ2luU3RhdHVzKCl7XG5cbiAgICAgICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IFVzZXIuaXNVc2VyTG9nZ2VkSW4oKTtcbiAgICAgfVxuXG4gICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2xvZ2luLXBhZ2UuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgICAgICBzaXplOiAnJ1xuICAgICAgICB9KTtcblxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZyBpbiBjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgIHVwZGF0ZUxvZ2luU3RhdHVzKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cblxuICAgICRzY29wZS5sb2dvdXRVc2VyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIExvZ291dFwiKTtcbiAgICAgICAgVXNlci5DbGVhckNyZWRlbnRpYWxzKCk7XG4gICAgICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJHdpbmRvdywgJG1vZGFsSW5zdGFuY2UsIFVzZXIpIHtcblxuICAgIC8vIHNhdmUgdGhpcyB0aHJvdWdoIGEgcmVmZXNoXG4gICAgJHNjb3BlLmxvZ2luRm9ybSA9IHtcblxuICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgICAgIGVycm9yczogW11cbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24obG9naW5Gb3JtKSB7XG5cbiAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMgPSBbXTtcblxuICAgICAgICBjb25zb2xlLmxvZyhsb2dpbkZvcm0pO1xuICAgICAgICBVc2VyLmxvZ2luKGxvZ2luRm9ybSkuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgICAgICAgICAvL1VzZXIuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICBVc2VyLlNldENyZWRlbnRpYWxzKHVzZXIuaWQsIHVzZXIuZW1haWwsIHVzZXIudXNlclR5cGUpO1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cbiAgICAgICAgfSkuZXJyb3IoIGZ1bmN0aW9uKGVycm9yKXtcblxuICAgICAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMucHVzaChcIkludmFsaWQgdXNlciBjcmVkZW50aWFsc1wiKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICB9O1xufVxuXG5cbnJ1bi4kaW5qZWN0ID0gWyckY29va2llU3RvcmUnLCAnVXNlciddO1xuZnVuY3Rpb24gcnVuKCRjb29raWVTdG9yZSwgVXNlcil7XG5cbiAgICAvLyBrZWVwIHVzZXIgbG9nZ2VkIGluIGFmdGVyIHBhZ2UgcmVmcmVzaFxuICAgIHZhciBjdXJyZW50VXNlciA9ICRjb29raWVTdG9yZS5nZXQoJ2dsb2JhbHMnKSB8fCB7fTtcbiAgICBVc2VyLnNldEN1cnJlbnRVc2VyKGN1cnJlbnRVc2VyKTtcblxuICAgIC8vY29uc29sZS5sb2coY3VycmVudFVzZXIpO1xuICAgIC8vaWYgKCRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlcikge1xuICAgIC8vICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSAnQmFzaWMgJyArICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlci5hdXRoZGF0YTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgLy99XG5cbiAgICAvLyRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCwgY3VycmVudCkge1xuICAgIC8vICAgIC8vIHJlZGlyZWN0IHRvIGxvZ2luIHBhZ2UgaWYgbm90IGxvZ2dlZCBpbiBhbmQgdHJ5aW5nIHRvIGFjY2VzcyBhIHJlc3RyaWN0ZWQgcGFnZVxuICAgIC8vICAgIHZhciByZXN0cmljdGVkUGFnZSA9ICQuaW5BcnJheSgkbG9jYXRpb24ucGF0aCgpLCBbJy9sb2dpbicsICcvcmVnaXN0ZXInXSkgPT09IC0xO1xuICAgIC8vICAgIHZhciBsb2dnZWRJbiA9ICRyb290U2NvcGUuZ2xvYmFscy5jdXJyZW50VXNlcjtcbiAgICAvLyAgICBpZiAocmVzdHJpY3RlZFBhZ2UgJiYgIWxvZ2dlZEluKSB7XG4gICAgLy8gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICAvLyAgICB9XG4gICAgLy99KTtcbn1cbiIsIi8qKlxuICogQSBwbGFjZSB0byBwdXQgYXBwIHdpZGUgY29uZmlnIHN0dWZmXG4gKlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmNvbmZpZycsIFtdKVxuICAgIC5jb25zdGFudCgnQ09ORklHJywge1xuICAgICAgICAnQVBQX05BTUUnOiAnSGFja2VyIEZlbGxvdyBQb3J0YWwnLFxuICAgICAgICAnQVBQX1ZFUlNJT04nOiAnMS4wJyxcbiAgICAgICAgJ1NFUlZJQ0VfVVJMJzogJydcbiAgICB9KTtcblxuXG4vL3ZhciByb290VXJsID0gJ2h0dHBzOi8vcXVpZXQtY292ZS02ODMwLmhlcm9rdWFwcC5jb20nO1xuLy8gdmFyIHJvb3RVcmwgPSBcImh0dHBzOi8vYm9pbGluZy1zcHJpbmdzLTc1MjMuaGVyb2t1YXBwLmNvbVwiOyIsIi8qKlxuICogY29tcGFuaWVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcycsIFtcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJywgW10pO1xuXG4gIC8vIGRlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIGZlbGxvd3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cycsIFtcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcblxuXG59KSgpO1xuIiwiLyoqXG4gKiBob21lIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUnLCBbXG4gICAgICAgICdhcHAuaG9tZS5jb250cm9sbGVycycsXG4gICAgICAgICdhcHAuaG9tZS5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmRpcmVjdGl2ZXMnLCBbXSk7XG4gICAgLy9ob3cgYWJvdXQgdGhpc1xufSkoKTtcbiIsIi8qKlxuICogcHJvZmlsZSBtb2R1bGVcbiAqL1xuXG4gKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICBhbmd1bGFyXG4gICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXG4gICAgICAgICAgICAgICdhcHAucHJvZmlsZS5jb250cm9sbGVycycsXG4gICAgICAgICAgICAgICdhcHAucHJvZmlsZS5zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICdhcHAuZmVsbG93cy5zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJ1xuICAgICAgICAgICAgXSk7XG5cbiAgICAgIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gICAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgIGFuZ3VsYXJcbiAgICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJywgW10pO1xuXG59KSgpO1xuIiwiLyoqXG4gKiB2b3RlcyBtb2R1bGVcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC52b3RlcycsIFtcbiAgICAgICAgJ2FwcC52b3Rlcy5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC52b3Rlcy5zZXJ2aWNlcycsIFtdKTtcblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcblxuICBDb21wYW5pZXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnQ29tcGFuaWVzJ107XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgKi9cbiAgZnVuY3Rpb24gQ29tcGFuaWVzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgQ29tcGFuaWVzKSB7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgfVxuXG4gICAgQ29tcGFuaWVzLmFsbCgpLnN1Y2Nlc3MoIGZ1bmN0aW9uKGNvbXBhbmllcyl7XG5cbiAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gY29tcGFuaWVzO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2RldGFpbF92aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgY29tcGFueTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBjb21wYW55O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIH07XG5cbiAgfVxuXG4vKipcbiAqIENvbXBhbmllcyBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cblxuICBhbmd1bGFyXG4gICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLFxuICAgICdjb21wYW55JywgJ0NvbXBhbnlWb3RlcycsICdVc2VyJ107XG5cbiAgZnVuY3Rpb24gQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgY29tcGFueSwgQ29tcGFueVZvdGVzLCBVc2VyKSB7XG5cbiAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuY29tcGFueSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnZvdGUgPSBmdW5jdGlvbiB2b3RlKGNvbXBhbnkpIHtcblx0XHRcdGNvbnNvbGUubG9nKGNvbXBhbnkuaWQpO1xuICAgICAgdmFyIGN1cnJlbnQgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cdFx0XHRjb25zb2xlLmxvZyhjdXJyZW50KTtcbiAgICAgIGlmKGN1cnJlbnQudXNlclR5cGUgPT09IFwiRmVsbG93XCIpIHtcblx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhjb21wYW55LmlkKTtcbiAgICAgICAgcmV0dXJuIENvbXBhbnlWb3Rlcy5jcmVhdGUoY3VycmVudC5pZCwgY29tcGFueS5pZClcblx0XHRcdFx0LnN1Y2Nlc3MoIGZ1bmN0aW9uKHZvdGUpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwic3VjY2VzcyFcIik7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdm90ZTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImZpbmFsbHlcIik7XG5cdFx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHQkc2NvcGUuZG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkc2NvcGUuZG9uZSA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sMzAwMCk7XG5cdFx0XHRcdH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgY29tcGFueUNhcmQpO1xuXG5cbiAgICBmdW5jdGlvbiBjb21wYW55Q2FyZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiLyoqXG4gKiBGZWxsb3dzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignRmVsbG93c0NvbnRyb2xsZXInLCBGZWxsb3dzQ29udHJvbGxlcik7XG5cbiAgRmVsbG93c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdGZWxsb3dzJ107XG5cbiAgLyoqXG4gICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcbiAgICovXG4gIGZ1bmN0aW9uIEZlbGxvd3NDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBGZWxsb3dzKSB7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgZmVsbG93cyBjb250cm9sbGVyIScpO1xuICAgIH1cblxuICAgIEZlbGxvd3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbihmZWxsb3dzKXtcblxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IGZlbGxvd3M7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oZmVsbG93KSB7XG5cbiAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19kZXRhaWxfdmlldy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXG4gICAgICAgIHNpemU6ICdsZycsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gZmVsbG93O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIH07XG5cblxuICB9XG5cbi8qKlxuICogRmVsbG93cyBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAgJ2ZlbGxvdycsXG5cdCdGZWxsb3dWb3RlcycsICdVc2VyJywgJyR0aW1lb3V0J107XG5cbiAgZnVuY3Rpb24gRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmZWxsb3csIEZlbGxvd1ZvdGVzLCBVc2VyKSB7XG5cbiAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgLy9jb25zb2xlLmxvZyhmZWxsb3cpO1xuXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG4gICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuZmVsbG93KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIH07XG5cbiAgICAkc2NvcGUudm90ZSA9IGZ1bmN0aW9uIHZvdGUoZmVsbG93KSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInZvdGVcIik7XG4gICAgICB2YXIgY3VycmVudCA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgIGlmKGN1cnJlbnQudXNlclR5cGUgPT09IFwiQ29tcGFueVwiKSB7XG5cdFx0XHRcdCRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgRmVsbG93Vm90ZXMuY3JlYXRlKGZlbGxvdy5pZCwgY3VycmVudC5pZClcblx0XHRcdFx0XHQuc3VjY2VzcyggZnVuY3Rpb24odm90ZSkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJzdWNjZXNzIVwiKTtcblx0XHRcdFx0XHRcdC8vcmV0dXJuIHZvdGU7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJmaW5hbGx5XCIpO1xuXHRcdFx0XHRcdFx0JHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdFx0XHRcdCRzY29wZS5kb25lID0gdHJ1ZTtcblx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdCRzY29wZS5kb25lID0gZmFsc2U7XG5cdFx0XHRcdFx0fSwgMzAwMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH07XG5cbiAgfVxuXG59KSgpO1xuIiwiLyoqXG4qIENvbXBhbmllc1xuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xuXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XG5cbiAgLyoqXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNcbiAgKi9cbiAgZnVuY3Rpb24gQ29tcGFuaWVzKCRodHRwLCBVcGxvYWQsIENPTkZJRykge1xuXG4gICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsOiBhbGwsXG4gICAgICBnZXQ6IGdldCxcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgfTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGwoKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0XG4gICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnlcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAbmFtZSBnZXRCeVVzZXJJZFxuICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnkgYnkgdXNlciBpZFxuICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QnlVc2VySWQodXNlcl9pZCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJfaWQvJyArIHBhcnNlSW50KHVzZXJfaWQpICk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKGNvbXBhbnkpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJywgY29tcGFueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdXBkYXRlXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbXBhbnkpIHtcblxuICAgICAgcmV0dXJuIFVwbG9hZC51cGxvYWQoe1xuICAgICAgICB1cmw6IHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGNvbXBhbnkuaWQsXG4gICAgICAgIGZpZWxkczogY29tcGFueSxcbiAgICAgICAgZmlsZTogY29tcGFueS5maWxlLFxuICAgICAgICBtZXRob2Q6ICdQVVQnXG5cbiAgICAgIH0pO1xuXG4gICAgICAvL3JldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgaWQsIGNvbXBhbnkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgY29tcGFueSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkKTtcbiAgICB9XG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycpXG4gICAgLmRpcmVjdGl2ZSgnZmVsbG93Q2FyZCcsIGZlbGxvd0NhcmQpO1xuXG4gIC8vbmctZmVsbG93LWNhcmRcbiBmdW5jdGlvbiBmZWxsb3dDYXJkKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19jYXJkLmh0bWwnLyosXG4gICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgfSk7XG4gICAgICAgfSAqL1xuICAgIH07XG4gIH1cbn0pKCk7XG4iLCIvKipcbiogRmVsbG93c1xuKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLnNlcnZpY2VzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcblx0Lm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnKVxuXHQuc2VydmljZSgnRmVsbG93cycsIEZlbGxvd3MpO1xuXG4gIEZlbGxvd3MuJGluamVjdCA9IFsnJGh0dHAnLCAnVXBsb2FkJywgJ0NPTkZJRyddO1xuXG5cblxuICAvKipcbiAgKiBAbmFtZXNwYWNlIEZlbGxvd3NcbiAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgKi9cbiAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCwgVXBsb2FkLCBDT05GSUcpIHtcblxuXG5cdCAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cblx0cmV0dXJuIHtcblx0ICBhbGw6IGFsbCxcblx0ICBnZXQ6IGdldCxcbiAgICAgIGdldEJ5VXNlcklkOiBnZXRCeVVzZXJJZCxcblx0ICBjcmVhdGU6IGNyZWF0ZSxcblx0ICB1cGRhdGU6IHVwZGF0ZSxcblx0ICBkZXN0cm95OiBkZXN0cm95XG5cdH07XG5cblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXHQvKipcblx0ICogQG5hbWUgYWxsXG5cdCAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3Ncblx0ICovXG5cdGZ1bmN0aW9uIGFsbCgpIHtcblxuXHRcdHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAbmFtZSBnZXRcblx0ICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcblx0ICovXG5cdGZ1bmN0aW9uIGdldChpZCkge1xuXG5cdFx0cmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgaWQpO1xuXHR9XG5cblx0LyoqXG5cdCogQG5hbWUgZ2V0QnlVc2VySWRcblx0KiBAZGVzYyBnZXQgb25lIGZlbGxvdyBieSB1c2VyX2lkXG5cdCovXG5cdGZ1bmN0aW9uIGdldEJ5VXNlcklkKHVzZXJfaWQpIHtcblxuXHQgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvdXNlcl9pZC8nICsgdXNlcl9pZCk7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiBAbmFtZSBjcmVhdGVcblx0ICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGUoZmVsbG93KSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJywgZmVsbG93KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAbmFtZSB1cGRhdGVcblx0ICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZShmZWxsb3cpIHtcblxuICAgICAgICByZXR1cm4gVXBsb2FkLnVwbG9hZCh7XG4gICAgICAgICAgICB1cmw6IHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsXG4gICAgICAgICAgICBmaWVsZHM6IGZlbGxvdyxcbiAgICAgICAgICAgIGZpbGU6IGZlbGxvdy5maWxlLFxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJ1xuXG4gICAgICAgIH0pO1xuXG5cdFx0Ly9yZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS9mZWxsb3dzLycgKyBmZWxsb3cuaWQsIGZlbGxvdyk7XG5cdH1cblxuXHQvKipcblx0ICogQG5hbWUgZGVzdHJveVxuXHQgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxuXHQgKi9cblx0ZnVuY3Rpb24gZGVzdHJveShpZCkge1xuXHQgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcblx0fVxuICB9XG5cbn0pKCk7XG4iLCIvKipcbiogSG9tZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcblxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcblxuICAvKipcbiAgKiBAbmFtZXNwYWNlIEhvbWVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgaG9tZSBjb250cm9sbGVyIScpO1xuICAgICAgLy9Ib21lLmFsbCgpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuKiBBZG1pblByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuXG4gICAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIpO1xuICAgIC8vLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgQWRtaW5Qcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ1VzZXInLCAnRmVsbG93cycsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuICAgICAqL1xuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBGZWxsb3dzLCBDb21wYW5pZXMpIHtcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb3Igc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGFuIEFkbWluXG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkFkbWluXCIgKXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLWNyZWF0ZS11c2VyLmh0bWwnLFxuICAgICAgICAvLyAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgLy8gICAgICAgIHNpemU6ICdsZydcbiAgICAgICAgLy8gICAgICAgIC8vcmVzb2x2ZToge1xuICAgICAgICAvLyAgICAgICAgLy8gICAgZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAvLyAgICB9XG4gICAgICAgIC8vICAgICAgICAvL31cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgfSk7XG4gICAgICAgIC8vfTtcblxuICAgICAgICBmdW5jdGlvbiB1bkhpZ2hsaWdodEZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcImlucHV0XCIpLnJlbW92ZUNsYXNzKFwiZXJyb3JcIik7XG4gICAgICAgICAgICBqUXVlcnkoXCIjdXNlclR5cGVcIikucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcIiNwYXNzd29yZFwiKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhpZ2hsaWdodEVtYWlsRmllbGQoKXtcblxuICAgICAgICAgICAgalF1ZXJ5KFwiZW1haWxcIikuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRVc2VyVHlwZUZpZWxkKCl7XG5cbiAgICAgICAgICAgIGpRdWVyeShcInVzZXJUeXBlXCIpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRtaW4gcHJvZmlsZSB0YWJzXG4gICAgICAgICRzY29wZS50YWJzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOidVc2VyIExpc3QnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOidzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vdXNlci1saXN0Lmh0bWwnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOidOZXcgVXNlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6J3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9uZXctdXNlci1mb3JtLmh0bWwnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOidWb3RlcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6J3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9hZG1pbi12b3Rlcy5odG1sJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKHVzZXIpIHtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzIGhpZ2hsaWdodHMgaW4gY2FzZSBkYXRhIGlzIG5vdyBjb3JyZWN0XG4gICAgICAgICAgICB1bkhpZ2hsaWdodEZpZWxkKCk7XG5cbiAgICAgICAgICAgIC8vIGlmIGV2ZXJ5dGhpbmcgaXMgZ29vZCBsb2cgZGF0YSBhbmQgY2xvc2UsIGVsc2UgaGlnaGxpZ2h0IGVycm9yXG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gZmFsc2U7XG4gICAgICAgICAgICBpZih0eXBlb2YodXNlcikgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBpbmZvXCIpO1xuICAgICAgICAgICAgICAgIC8vaGVpZ2hsaWdodCBhbGxcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRFbWFpbEZpZWxkKCk7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0UGFzc3dvcmRGaWVsZCgpO1xuICAgICAgICAgICAgICAgIGhpZ2hsaWdodFVzZXJUeXBlRmllbGQoKTtcbiAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZih0eXBlb2YodXNlci5lbWFpbCkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFkIGVtYWlsXCIpO1xuICAgICAgICAgICAgICAgICAgICAvL2hlaWdobGlnaHQgZW1haWxcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0RW1haWxGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZih1c2VyLnBhc3N3b3JkKSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYWQgcGFzc3dvcmRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vaGVpZ2hsaWdodCBwYXNzd29yZFxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIudXNlclR5cGUpID09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhZCB0eXBlXCIpO1xuICAgICAgICAgICAgICAgICAgICAvL2hpZ2hsaWdodCBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoICFlcnJvcnMgKXtcblxuICAgICAgICAgICAgICAgIC8vIHNlbmQgdXNlciB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgICAgICBVc2VyLmNyZWF0ZSh1c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyX2lkID0gcmVzcG9uc2UuZGF0YS5pZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVsbG93X3Bvc3QgPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgRmVsbG93cy5jcmVhdGUoZmVsbG93X3Bvc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wYW55X3Bvc3QgPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29tcGFuaWVzLmNyZWF0ZShjb21wYW55X3Bvc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIC8vJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIC8vfTtcblxuICAgICAgICAkc2NvcGUuc3dpdGNoVHlwZSA9IGZ1bmN0aW9uKHVzZXIpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyKTtcblxuICAgICAgICAgICAgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG5cbiAgICAgICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25Db21wYW55XCIpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkZlbGxvd1wiKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiRmVsbG93XCIgKXtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmVsbG93IHNlbGVjdGlvblwiKTtcblxuICAgICAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkNvbXBhbnlcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KFwib3B0aW9uRmVsbG93XCIpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvL2Z1bmN0aW9uIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBVc2VyLCBGZWxsb3dzLCBDb21wYW5pZXMpIHtcbiAgICAvL1xuICAgIC8vICAgIGZ1bmN0aW9uIHVuSGlnaGxpZ2h0RmllbGQoKXtcbiAgICAvL1xuICAgIC8vICAgICAgICBqUXVlcnkoXCJpbnB1dFwiKS5yZW1vdmVDbGFzcyhcImVycm9yXCIpO1xuICAgIC8vICAgICAgICBqUXVlcnkoXCIjdXNlclR5cGVcIikucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgLy8gICAgfVxuICAgIC8vXG4gICAgLy8gICAgZnVuY3Rpb24gaGlnaGxpZ2h0UGFzc3dvcmRGaWVsZCgpe1xuICAgIC8vXG4gICAgLy8gICAgICAgIGpRdWVyeShcIiNwYXNzd29yZFwiKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAvLyAgICB9XG4gICAgLy9cbiAgICAvLyAgICBmdW5jdGlvbiBoaWdobGlnaHRFbWFpbEZpZWxkKCl7XG4gICAgLy9cbiAgICAvLyAgICAgICAgalF1ZXJ5KFwiZW1haWxcIikuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gICAgLy8gICAgfVxuICAgIC8vXG4gICAgLy8gICAgZnVuY3Rpb24gaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpe1xuICAgIC8vXG4gICAgLy8gICAgICAgIGpRdWVyeShcInVzZXJUeXBlXCIpLmFkZENsYXNzKCdlcnJvcicpO1xuICAgIC8vICAgIH1cbiAgICAvL1xuICAgIC8vICAgICRzY29wZS51c2VyID0ge1xuICAgIC8vICAgICAgICBlbWFpbDogXCJcIixcbiAgICAvLyAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgLy8gICAgICAgIHVzZXJUeXBlOiBcIlwiXG4gICAgLy8gICAgfTtcbiAgICAvL1xuICAgIC8vICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgLy9cbiAgICAvLyAgICAgICAgLyoqKioqKioqKipERUJVRyBTVEFSVCoqKioqKioqKi9cbiAgICAvLyAgICAgICAgdXNlci51c2VyVHlwZSA9IFwiRmVsbG93XCJcbiAgICAvLyAgICAgICAgLyoqKioqKioqKipERUJVRyBFTkQqKioqKioqKiovXG4gICAgLy8gICAgICAgIC8vIHJlbW92ZSBwcmV2aW91cyBoaWdobGlnaHRzIGluIGNhc2UgZGF0YSBpcyBub3cgY29ycmVjdFxuICAgIC8vICAgICAgICB1bkhpZ2hsaWdodEZpZWxkKCk7XG4gICAgLy9cbiAgICAvLyAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIE91dHB1dFwiKTtcbiAgICAvLyAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgLy9cbiAgICAvLyAgICAgICAgLy8gaWYgZXZlcnl0aGluZyBpcyBnb29kIGxvZyBkYXRhIGFuZCBjbG9zZSwgZWxzZSBoaWdobGlnaHQgZXJyb3JcbiAgICAvLyAgICAgICAgdmFyIGVycm9ycyA9IGZhbHNlO1xuICAgIC8vICAgICAgICBpZih0eXBlb2YodXNlcikgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGluZm9cIik7XG4gICAgLy8gICAgICAgICAgICAvL2hlaWdobGlnaHQgYWxsXG4gICAgLy8gICAgICAgICAgICBoaWdobGlnaHRFbWFpbEZpZWxkKCk7XG4gICAgLy8gICAgICAgICAgICBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCk7XG4gICAgLy8gICAgICAgICAgICBoaWdobGlnaHRVc2VyVHlwZUZpZWxkKCk7XG4gICAgLy8gICAgICAgICAgICBlcnJvcnMgPSB0cnVlO1xuICAgIC8vICAgICAgICB9XG4gICAgLy8gICAgICAgIGVsc2Uge1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBpZih0eXBlb2YodXNlci5lbWFpbCkgPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgLy8gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCYWQgZW1haWxcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgLy9oZWlnaGxpZ2h0IGVtYWlsXG4gICAgLy8gICAgICAgICAgICAgICAgaGlnaGxpZ2h0RW1haWxGaWVsZCgpO1xuICAgIC8vICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIGlmKHR5cGVvZih1c2VyLnBhc3N3b3JkKSA9PSBcInVuZGVmaW5lZFwiKXtcbiAgICAvLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhZCBwYXNzd29yZFwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAvL2hlaWdobGlnaHQgcGFzc3dvcmRcbiAgICAvLyAgICAgICAgICAgICAgICBoaWdobGlnaHRQYXNzd29yZEZpZWxkKCk7XG4gICAgLy8gICAgICAgICAgICAgICAgZXJyb3JzID0gdHJ1ZTtcbiAgICAvLyAgICAgICAgICAgIH1cbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIudXNlclR5cGUpID09IFwidW5kZWZpbmVkXCIpe1xuICAgIC8vICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQmFkIHR5cGVcIik7XG4gICAgLy8gICAgICAgICAgICAgICAgLy9oaWdobGlnaHQgYnV0dG9uXG4gICAgLy8gICAgICAgICAgICAgICAgaGlnaGxpZ2h0VXNlclR5cGVGaWVsZCgpO1xuICAgIC8vICAgICAgICAgICAgICAgIGVycm9ycyA9IHRydWU7XG4gICAgLy8gICAgICAgICAgICB9XG4gICAgLy8gICAgICAgIH1cbiAgICAvL1xuICAgIC8vICAgICAgICBpZiggIWVycm9ycyApe1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAvLyBzZW5kIHVzZXIgdG8gQVBJIHZpYSBTZXJ2aWNlXG4gICAgLy8gICAgICAgICAgICBVc2VyLmNyZWF0ZSh1c2VyKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgICB2YXIgdXNlcl9pZCA9IHJlc3BvbnNlLmRhdGEuaWQ7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgICBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICAgICAgICAgIHZhciBmZWxsb3dfcG9zdCA9IHtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlcl9pZFxuICAgIC8vICAgICAgICAgICAgICAgICAgICB9O1xuICAgIC8vICAgICAgICAgICAgICAgICAgICBGZWxsb3dzLmNyZWF0ZShmZWxsb3dfcG9zdCk7XG4gICAgLy8gICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgIGVsc2UgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhbnlfcG9zdCA9IHtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlcl9pZFxuICAgIC8vICAgICAgICAgICAgICAgICAgICB9O1xuICAgIC8vICAgICAgICAgICAgICAgICAgICBDb21wYW5pZXMuY3JlYXRlKGNvbXBhbnlfcG9zdCk7XG4gICAgLy8gICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codXNlcik7XG4gICAgLy8gICAgICAgICAgICB9KTtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcbiAgICAvLyAgICAgICAgfVxuICAgIC8vXG4gICAgLy8gICAgfTtcbiAgICAvL1xuICAgIC8vICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIC8vICAgIH07XG4gICAgLy9cbiAgICAvLyAgICAkc2NvcGUuc3dpdGNoVHlwZSA9IGZ1bmN0aW9uKHVzZXIsICRldmVudCl7XG4gICAgLy9cbiAgICAvLyAgICAgICAgY29uc29sZS5sb2codXNlcik7XG4gICAgLy9cbiAgICAvLyAgICAgICAgaWYoIHVzZXIudXNlclR5cGUgPT09IFwiQ29tcGFueVwiICl7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkNvbXBhbnlcIikuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgLy8gICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25GZWxsb3dcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICAgICAgZWxzZSBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuICAgIC8vXG4gICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZlbGxvdyBzZWxlY3Rpb25cIik7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgIGpRdWVyeShcIm9wdGlvbkNvbXBhbnlcIikucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgLy8gICAgICAgICAgICBqUXVlcnkoXCJvcHRpb25GZWxsb3dcIikuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgLy8gICAgICAgIH1cbiAgICAvL1xuICAgIC8vICAgIH07XG4gICAgLy99XG5cbn0pKCk7XG4iLCIvKipcbiogQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdDb21wYW5pZXMnLCAnVXNlcicsICdUYWdzJ107XG5cbiAgICAvKipcbiAgICAqIEBuYW1lc3BhY2UgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyXG4gICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIENvbXBhbmllcywgVXNlciwgVGFncykge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiB0aGUgcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvZiBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYSBDb21wYW55XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkNvbXBhbnlcIiApe1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQ29tcGFuaWVzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uKGNvbXBhbnkpe1xuXG4gICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbih0YWdzKXtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgICAgICAgICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZyl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0YWcuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0YWcubmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkKFwic2VsZWN0I3RhZ3NcIikuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgIC8vdGFnczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5TZXBhcmF0b3JzOiBbJywnLCcgJ11cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcbiAgICAgICAgICAgIC8vUHJvZmlsZS5hbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS51cGRhdGU9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcblxuICAgICAgICAgICAgLy8gZ2V0IHRoZSB0YWdzIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgIGNvbXBhbnkudGFncyA9ICQoXCIjdGFnc1wiKS52YWwoKTtcblxuICAgICAgICAgICAgLy8gc2VuZCBjb21wYW5pZXMgaW5mbyB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgIENvbXBhbmllcy51cGRhdGUoY29tcGFueSkuc3VjY2VzcyhmdW5jdGlvbihuZXdDb21wYW55RGF0YSl7XG5cbiAgICAgICAgICAgICAgICAvLyAqKiBUcmlnZ2VyIFN1Y2Nlc3MgbWVzc2FnZSBoZXJlXG4gICAgICAgICAgICAgICAgY29tcGFueSA9IG5ld0NvbXBhbnlEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gaGlkZSB1cGRhdGUgbWVzc2FnZVxuICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxuXG5cbn0pKCk7XG4iLCIvKipcbiogRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdGZWxsb3dzJywgJ1RhZ3MnLCAnVXNlcicgXTtcblxuICAgIC8qKlxuICAgICogQG5hbWVzcGFjZSBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgRmVsbG93cywgVGFncywgVXNlciApIHtcbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAvLyBQcm9iYWJseSBjYW4gaGFuZGxlIHRoaXMgaW4gdGhlIHJvdXRlcyBvciB3aXRoIG1pZGRsZXdhcmUgb2Ygc29tZSBraW5kXG4gICAgICAgIGlmKCAhVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgRmVsbG93XG4gICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlICE9PSBcIkZlbGxvd1wiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBGZWxsb3dzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvdyl7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgIFRhZ3MuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbih0YWdzKXtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gW107XG4gICAgICAgICAgICAgICAgdGFncy5mb3JFYWNoKGZ1bmN0aW9uKHRhZyl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0YWcuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0YWcubmFtZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1zZWxlY3QyL2Jsb2IvbWFzdGVyL2RlbW8vYXBwLmpzXG5cbiAgICAgICAgICAgICAgICAkKFwic2VsZWN0I3RhZ3NcIikuc2VsZWN0Mih7XG4gICAgICAgICAgICAgICAgICAgIC8vdGFnczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5TZXBhcmF0b3JzOiBbJywnLCcgJ11cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oZmVsbG93LCBmaWxlKSB7XG5cbiAgICAgICAgICAgIGZlbGxvdy50YWdzID0gJChcIiN0YWdzXCIpLnZhbCgpO1xuXG4gICAgICAgICAgICAvLyBzZW5kIGZlbGxvd3MgaW5mbyB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgIEZlbGxvd3MudXBkYXRlKGZlbGxvdykuc3VjY2VzcyhmdW5jdGlvbihuZXdGZWxsb3dEYXRhKXtcblxuICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcbiAgICAgICAgICAgICAgICBmZWxsb3cgPSBuZXdGZWxsb3dEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gaGlkZSB1cGRhdGUgbWVzc2FnZVxuICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlciddO1xuICAvKipcbiAgKiBAbmFtZXNwYWNlIFByb2ZpbGVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyKSB7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAvLyByZWRpcmVjdCB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciB0eXBlXG4gICAgICAgICAgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nKSB7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGUvYWRtaW5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnRmVsbG93Jykge1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2ZlbGxvd1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdDb21wYW55Jykge1xuICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9wcm9maWxlL2NvbXBhbnlcIik7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcblxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICB9XG5cbiAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiogQ29tcGFueVZvdGVzXG4qIEBuYW1lc3BhY2UgYXBwLnZvdGVzLnNlcnZpY2VzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAudm90ZXMuc2VydmljZXMnKVxuICAgIC5zZXJ2aWNlKCdDb21wYW55Vm90ZXMnLCBDb21wYW55Vm90ZXMpO1xuXG4gIENvbXBhbnlWb3Rlcy4kaW5qZWN0ID0gWyckaHR0cCcsICdDT05GSUcnXTtcblxuXG4gIC8qKlxuICAqIEBuYW1lc3BhY2UgQ29tcGFueVZvdGVzXG4gICovXG4gIGZ1bmN0aW9uIENvbXBhbnlWb3RlcygkaHR0cCwgQ09ORklHKSB7XG5cbiAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgIHJldHVybiB7XG4gICAgICBnZXQ6IGdldCxcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBnZXQgYnkgY29tcGFueVxuICAgICAqIEBkZXNjIGdldCB0aGUgY29tcGFuaWVzIG9uZSBjb21wYW55IHZvdGVkIG9uKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldChpZCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvY29tcGFueS8nICsgaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAqIEBkZXNjIGNvbXBhbnkgdm90ZXMgb24gYSBjb21wYW55XG4gICAgICovXG4gICAgIGZ1bmN0aW9uIGNyZWF0ZShmZWxsb3dfaWQsIGNvbXBhbnlfaWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGZlbGxvd19pZCArICcgJyArIGNvbXBhbnlfaWQpO1xuICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzL2NvbXBhbnkvJywge1xuICAgICAgICBmZWxsb3dfaWQ6IGZlbGxvd19pZCxcbiAgICAgICAgY29tcGFueV9pZDogY29tcGFueV9pZFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGVzdHJveVxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSB2b3RlIHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzL2NvbXBhbnknICsgaWQpO1xuICAgIH1cbiAgfVxuXG5cbn0pKCk7XG5cbiIsIi8qKlxuKiBGZWxsb3dWb3Rlc1xuKiBAbmFtZXNwYWNlIGFwcC52b3Rlcy5zZXJ2aWNlc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnZvdGVzLnNlcnZpY2VzJylcbiAgICAuc2VydmljZSgnRmVsbG93Vm90ZXMnLCBGZWxsb3dWb3Rlcyk7XG5cbiAgRmVsbG93Vm90ZXMuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cblxuICAvKipcbiAgKiBAbmFtZXNwYWNlIEZlbGxvd1ZvdGVzXG4gICovXG4gIGZ1bmN0aW9uIEZlbGxvd1ZvdGVzKCRodHRwLCBDT05GSUcpIHtcblxuICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldDogZ2V0LFxuICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICBkZXN0cm95OiBkZXN0cm95XG4gICAgfTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0IGJ5IGNvbXBhbnlcbiAgICAgKiBAZGVzYyBnZXQgdGhlIGNvbXBhbmllcyBvbmUgZmVsbG93IHZvdGVkIG9uKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldChpZCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvZmVsbG93LycgKyBpZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgY3JlYXRlXG4gICAgICogQGRlc2MgZmVsbG93IHZvdGVzIG9uIGEgY29tcGFueVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZShmZWxsb3dfaWQsIGNvbXBhbnlfaWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZmVsbG93Vm90ZUNyZWF0ZVwiICsgZmVsbG93X2lkICsgJyAnICsgY29tcGFueV9pZCk7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdm90ZXMvZmVsbG93LycsIHtcbiAgICAgICAgZmVsbG93X2lkOiBmZWxsb3dfaWQsXG4gICAgICAgIGNvbXBhbnlfaWQ6IGNvbXBhbnlfaWRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgdm90ZSByZWNvcmRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKHJvb3RVcmwgKyAnL2FwaS92MS92b3Rlcy9mZWxsb3cnICsgaWQpO1xuICAgIH1cbiAgfVxuXG5cbn0pKCk7XG5cbiIsIi8qKlxuICogRmVsbG93c1xuICogQG5hbWVzcGFjZSBhcHAuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ1RhZ3MnLCBUYWdzKTtcblxuICAgIFRhZ3MuJGluamVjdCA9IFsnJGh0dHAnLCAnQ09ORklHJ107XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFRhZ3NcbiAgICAgKiBAcmV0dXJucyB7U2VydmljZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBUYWdzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIC8vY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgICAvL3VwZGF0ZTogdXBkYXRlLFxuICAgICAgICAgICAgLy9kZXN0cm95OiBkZXN0cm95XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgYWxsXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFsbCgpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvdGFncycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3RhZ3MvJyArIGlkKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIC8vZnVuY3Rpb24gY3JlYXRlKGZlbGxvdykge1xuICAgICAgICAvLyAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nLCBmZWxsb3cpO1xuICAgICAgICAvL31cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICAvL2Z1bmN0aW9uIHVwZGF0ZShmZWxsb3csIGlkKSB7XG4gICAgICAgIC8vICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkLCBmZWxsb3cpO1xuICAgICAgICAvL31cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgLy9mdW5jdGlvbiBkZXN0cm95KGlkKSB7XG4gICAgICAgIC8vICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBQcm9maWxlXG4gKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLnNlcnZpY2VzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnKVxuICAgIC5mYWN0b3J5KCdVc2VyJywgVXNlcik7XG5cbiAgVXNlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRjb29raWVTdG9yZScsICckaHR0cCcsICdDT05GSUcnXTtcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBVc2VyXG4gICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgKi9cbiAgZnVuY3Rpb24gVXNlcigkcm9vdFNjb3BlLCAkY29va2llU3RvcmUsICRodHRwLCBDT05GSUcpIHtcblxuICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgIC8vIFdpbGwgaG9sZCBpbmZvIGZvciB0aGUgY3VycmVudGx5IGxvZ2dlZCBpbiB1c2VyXG4gICAgICB2YXIgY3VycmVudFVzZXIgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XG5cbiAgICAgICAgICByZXR1cm4gY3VycmVudFVzZXI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRVc2VyKHVzZXIpIHtcblxuICAgICAgICAgIGN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGxvZ2luXG4gICAgICAgKiBAZGVzYyBsb2dpbiBhIG5ldyB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBsb2dpbih1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2xvZ2luJywgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAvL2FsbDogYWxsLFxuICAgICAgICAgIC8vZ2V0OiBnZXQsXG4gICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgIC8vdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgLy9kZXN0cm95OiBkZXN0cm95XG4gICAgICAgICAgU2V0Q3JlZGVudGlhbHM6IFNldENyZWRlbnRpYWxzLFxuICAgICAgICAgIENsZWFyQ3JlZGVudGlhbHM6IENsZWFyQ3JlZGVudGlhbHMsXG4gICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxuICAgICAgICAgIHNldEN1cnJlbnRVc2VyOiBzZXRDdXJyZW50VXNlcixcbiAgICAgICAgICBpc1VzZXJMb2dnZWRJbjogaXNVc2VyTG9nZ2VkSW5cbiAgICAgIH07XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGNvbXBhbmllc1xuICAgICAgICovXG4gICAgICAvL2Z1bmN0aW9uIGFsbCgpIHtcbiAgICAgIC8vXG4gICAgICAvLyAgICByZXR1cm4gW107XG4gICAgICAvL1xuICAgICAgLy8gICAgLy9yZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJyk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBnZXRcbiAgICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55XG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICAvLyAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgICAvL31cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAqIEBkZXNjIGNyZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh1c2VyKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3VzZXJzL2NyZWF0ZScsIHVzZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAqIEBkZXNjIGRlc3Ryb3kgYSB1c2VyIHJlY29yZFxuICAgICAgICovXG4gICAgICAvL2Z1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgIC8vICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArIHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgaWQpO1xuICAgICAgLy99XG5cbiAgICAgIGZ1bmN0aW9uIGlzVXNlckxvZ2dlZEluKCl7XG5cbiAgICAgICAgICAvL2NvbnNvbGUubG9nKGN1cnJlbnRVc2VyKTtcbiAgICAgICAgICBpZiggT2JqZWN0LmtleXMoY3VycmVudFVzZXIpLmxlbmd0aCA+IDAgKXtcblxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBTZXRDcmVkZW50aWFscyhpZCwgdXNlcm5hbWUsIHVzZXJUeXBlKSB7XG5cbiAgICAgICAgICB2YXIgYXV0aGRhdGEgPSBCYXNlNjQuZW5jb2RlKGlkICsgJzonICsgdXNlcm5hbWUgKyAnOicgKyB1c2VyVHlwZSk7XG5cbiAgICAgICAgICBjdXJyZW50VXNlciA9IHtcbiAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgICAgICAgYXV0aGRhdGE6IGF1dGhkYXRhXG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRjb29raWVTdG9yZS5wdXQoJ2dsb2JhbHMnLCBjdXJyZW50VXNlcik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIENsZWFyQ3JlZGVudGlhbHMoKSB7XG5cbiAgICAgICAgICAkcm9vdFNjb3BlLmdsb2JhbHMgPSB7fTtcbiAgICAgICAgICAkY29va2llU3RvcmUucmVtb3ZlKCdnbG9iYWxzJyk7XG4gICAgICB9XG5cbiAgfVxuXG4gIC8vIEJhc2U2NCBlbmNvZGluZyBzZXJ2aWNlIHVzZWQgYnkgQXV0aGVudGljYXRpb25TZXJ2aWNlXG4gIHZhciBCYXNlNjQgPSB7XG5cbiAgICBrZXlTdHI6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPScsXG5cbiAgICBlbmNvZGU6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgICB2YXIgY2hyMSwgY2hyMiwgY2hyMyA9IFwiXCI7XG4gICAgICB2YXIgZW5jMSwgZW5jMiwgZW5jMywgZW5jNCA9IFwiXCI7XG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgY2hyMSA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgY2hyMiA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgY2hyMyA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcblxuICAgICAgICBlbmMxID0gY2hyMSA+PiAyO1xuICAgICAgICBlbmMyID0gKChjaHIxICYgMykgPDwgNCkgfCAoY2hyMiA+PiA0KTtcbiAgICAgICAgZW5jMyA9ICgoY2hyMiAmIDE1KSA8PCAyKSB8IChjaHIzID4+IDYpO1xuICAgICAgICBlbmM0ID0gY2hyMyAmIDYzO1xuXG4gICAgICAgIGlmIChpc05hTihjaHIyKSkge1xuICAgICAgICAgIGVuYzMgPSBlbmM0ID0gNjQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOYU4oY2hyMykpIHtcbiAgICAgICAgICBlbmM0ID0gNjQ7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMxKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzIpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMykgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmM0KTtcbiAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gXCJcIjtcbiAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9IFwiXCI7XG4gICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuXG4gICAgZGVjb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgICAgdmFyIGNocjEsIGNocjIsIGNocjMgPSBcIlwiO1xuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAvLyByZW1vdmUgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IEEtWiwgYS16LCAwLTksICssIC8sIG9yID1cbiAgICAgIHZhciBiYXNlNjR0ZXN0ID0gL1teQS1aYS16MC05XFwrXFwvXFw9XS9nO1xuICAgICAgaWYgKGJhc2U2NHRlc3QuZXhlYyhpbnB1dCkpIHtcbiAgICAgICAgd2luZG93LmFsZXJ0KFwiVGhlcmUgd2VyZSBpbnZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGluIHRoZSBpbnB1dCB0ZXh0LlxcblwiICtcbiAgICAgICAgICAgIFwiVmFsaWQgYmFzZTY0IGNoYXJhY3RlcnMgYXJlIEEtWiwgYS16LCAwLTksICcrJywgJy8nLGFuZCAnPSdcXG5cIiArXG4gICAgICAgICAgICBcIkV4cGVjdCBlcnJvcnMgaW4gZGVjb2RpbmcuXCIpO1xuICAgICAgfVxuICAgICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZywgXCJcIik7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgZW5jMSA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMyID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzMgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jNCA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuXG4gICAgICAgIGNocjEgPSAoZW5jMSA8PCAyKSB8IChlbmMyID4+IDQpO1xuICAgICAgICBjaHIyID0gKChlbmMyICYgMTUpIDw8IDQpIHwgKGVuYzMgPj4gMik7XG4gICAgICAgIGNocjMgPSAoKGVuYzMgJiAzKSA8PCA2KSB8IGVuYzQ7XG5cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIxKTtcblxuICAgICAgICBpZiAoZW5jMyAhPSA2NCkge1xuICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuYzQgIT0gNjQpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gXCJcIjtcbiAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9IFwiXCI7XG5cbiAgICAgIH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgfTtcblxufSkoKTtcbiIsIi8qISA3LjAuMTcgKi9cbiF3aW5kb3cuWE1MSHR0cFJlcXVlc3R8fHdpbmRvdy5GaWxlQVBJJiZGaWxlQVBJLnNob3VsZExvYWR8fCh3aW5kb3cuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNldFJlcXVlc3RIZWFkZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7aWYoXCJfX3NldFhIUl9cIj09PWIpe3ZhciBkPWModGhpcyk7ZCBpbnN0YW5jZW9mIEZ1bmN0aW9uJiZkKHRoaXMpfWVsc2UgYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSh3aW5kb3cuWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNldFJlcXVlc3RIZWFkZXIpKTt2YXIgbmdGaWxlVXBsb2FkPWFuZ3VsYXIubW9kdWxlKFwibmdGaWxlVXBsb2FkXCIsW10pO25nRmlsZVVwbG9hZC52ZXJzaW9uPVwiNy4wLjE3XCIsbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRCYXNlXCIsW1wiJGh0dHBcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGQpe2QubWV0aG9kPWQubWV0aG9kfHxcIlBPU1RcIixkLmhlYWRlcnM9ZC5oZWFkZXJzfHx7fTt2YXIgZT1iLmRlZmVyKCksZj1lLnByb21pc2U7cmV0dXJuIGQuaGVhZGVycy5fX3NldFhIUl89ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYSl7YSYmKGQuX19YSFI9YSxkLnhockZuJiZkLnhockZuKGEpLGEudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLGZ1bmN0aW9uKGEpe2EuY29uZmlnPWQsZS5ub3RpZnk/ZS5ub3RpZnkoYSk6Zi5wcm9ncmVzc0Z1bmMmJmMoZnVuY3Rpb24oKXtmLnByb2dyZXNzRnVuYyhhKX0pfSwhMSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbihhKXthLmxlbmd0aENvbXB1dGFibGUmJihhLmNvbmZpZz1kLGUubm90aWZ5P2Uubm90aWZ5KGEpOmYucHJvZ3Jlc3NGdW5jJiZjKGZ1bmN0aW9uKCl7Zi5wcm9ncmVzc0Z1bmMoYSl9KSl9LCExKSl9fSxhKGQpLnRoZW4oZnVuY3Rpb24oYSl7ZS5yZXNvbHZlKGEpfSxmdW5jdGlvbihhKXtlLnJlamVjdChhKX0sZnVuY3Rpb24oYSl7ZS5ub3RpZnkoYSl9KSxmLnN1Y2Nlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGYudGhlbihmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsZCl9KSxmfSxmLmVycm9yPWZ1bmN0aW9uKGEpe3JldHVybiBmLnRoZW4obnVsbCxmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsZCl9KSxmfSxmLnByb2dyZXNzPWZ1bmN0aW9uKGEpe3JldHVybiBmLnByb2dyZXNzRnVuYz1hLGYudGhlbihudWxsLG51bGwsZnVuY3Rpb24oYil7YShiKX0pLGZ9LGYuYWJvcnQ9ZnVuY3Rpb24oKXtyZXR1cm4gZC5fX1hIUiYmYyhmdW5jdGlvbigpe2QuX19YSFIuYWJvcnQoKX0pLGZ9LGYueGhyPWZ1bmN0aW9uKGEpe3JldHVybiBkLnhockZuPWZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbigpe2ImJmIuYXBwbHkoZixhcmd1bWVudHMpLGEuYXBwbHkoZixhcmd1bWVudHMpfX0oZC54aHJGbiksZn0sZn10aGlzLnVwbG9hZD1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKGMsZCxlKXtpZih2b2lkIDAhPT1kKWlmKGFuZ3VsYXIuaXNEYXRlKGQpJiYoZD1kLnRvSVNPU3RyaW5nKCkpLGFuZ3VsYXIuaXNTdHJpbmcoZCkpYy5hcHBlbmQoZSxkKTtlbHNlIGlmKFwiZm9ybVwiPT09YS5zZW5kRmllbGRzQXMpaWYoYW5ndWxhci5pc09iamVjdChkKSlmb3IodmFyIGYgaW4gZClkLmhhc093blByb3BlcnR5KGYpJiZiKGMsZFtmXSxlK1wiW1wiK2YrXCJdXCIpO2Vsc2UgYy5hcHBlbmQoZSxkKTtlbHNlIGQ9YW5ndWxhci5pc1N0cmluZyhkKT9kOmFuZ3VsYXIudG9Kc29uKGQpLFwianNvbi1ibG9iXCI9PT1hLnNlbmRGaWVsZHNBcz9jLmFwcGVuZChlLG5ldyBCbG9iKFtkXSx7dHlwZTpcImFwcGxpY2F0aW9uL2pzb25cIn0pKTpjLmFwcGVuZChlLGQpfXJldHVybiBhLmhlYWRlcnM9YS5oZWFkZXJzfHx7fSxhLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl09dm9pZCAwLGEudHJhbnNmb3JtUmVxdWVzdD1hLnRyYW5zZm9ybVJlcXVlc3Q/YW5ndWxhci5pc0FycmF5KGEudHJhbnNmb3JtUmVxdWVzdCk/YS50cmFuc2Zvcm1SZXF1ZXN0OlthLnRyYW5zZm9ybVJlcXVlc3RdOltdLGEudHJhbnNmb3JtUmVxdWVzdC5wdXNoKGZ1bmN0aW9uKGMpe3ZhciBkLGU9bmV3IEZvcm1EYXRhLGY9e307Zm9yKGQgaW4gYS5maWVsZHMpYS5maWVsZHMuaGFzT3duUHJvcGVydHkoZCkmJihmW2RdPWEuZmllbGRzW2RdKTtjJiYoZi5kYXRhPWMpO2ZvcihkIGluIGYpaWYoZi5oYXNPd25Qcm9wZXJ0eShkKSl7dmFyIGc9ZltkXTthLmZvcm1EYXRhQXBwZW5kZXI/YS5mb3JtRGF0YUFwcGVuZGVyKGUsZCxnKTpiKGUsZyxkKX1pZihudWxsIT1hLmZpbGUpe3ZhciBoPWEuZmlsZUZvcm1EYXRhTmFtZXx8XCJmaWxlXCI7aWYoYW5ndWxhci5pc0FycmF5KGEuZmlsZSkpZm9yKHZhciBpPWFuZ3VsYXIuaXNTdHJpbmcoaCksaj0wO2o8YS5maWxlLmxlbmd0aDtqKyspZS5hcHBlbmQoaT9oOmhbal0sYS5maWxlW2pdLGEuZmlsZU5hbWUmJmEuZmlsZU5hbWVbal18fGEuZmlsZVtqXS5uYW1lKTtlbHNlIGUuYXBwZW5kKGgsYS5maWxlLGEuZmlsZU5hbWV8fGEuZmlsZS5uYW1lKX1yZXR1cm4gZX0pLGQoYSl9LHRoaXMuaHR0cD1mdW5jdGlvbihiKXtyZXR1cm4gYi50cmFuc2Zvcm1SZXF1ZXN0PWIudHJhbnNmb3JtUmVxdWVzdHx8ZnVuY3Rpb24oYil7cmV0dXJuIHdpbmRvdy5BcnJheUJ1ZmZlciYmYiBpbnN0YW5jZW9mIHdpbmRvdy5BcnJheUJ1ZmZlcnx8YiBpbnN0YW5jZW9mIEJsb2I/YjphLmRlZmF1bHRzLnRyYW5zZm9ybVJlcXVlc3RbMF0uYXBwbHkodGhpcyxhcmd1bWVudHMpfSxkKGIpfSx0aGlzLnNldERlZmF1bHRzPWZ1bmN0aW9uKGEpe3RoaXMuZGVmYXVsdHM9YXx8e319LHRoaXMuZGVmYXVsdHM9e30sdGhpcy52ZXJzaW9uPW5nRmlsZVVwbG9hZC52ZXJzaW9ufV0pLGZ1bmN0aW9uKCl7bmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkVmFsaWRhdGVcIixmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1kO3JldHVybiBlLmdldEF0dHJXaXRoRGVmYXVsdHM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbnVsbCE9YVtiXT9hW2JdOm51bGw9PWUuZGVmYXVsdHNbYl0/ZS5kZWZhdWx0c1tiXTplLmRlZmF1bHRzW2JdLnRvU3RyaW5nKCl9LGUuYXR0ckdldHRlcj1mdW5jdGlvbihiLGMsZCxlKXtpZighZClyZXR1cm4gdGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYik7dHJ5e3JldHVybiBlP2EodGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYikpKGQsZSk6YSh0aGlzLmdldEF0dHJXaXRoRGVmYXVsdHMoYyxiKSkoZCl9Y2F0Y2goZil7aWYoYi5zZWFyY2goL21pbnxtYXh8cGF0dGVybi9pKSlyZXR1cm4gdGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYik7dGhyb3cgZn19LGUudXBkYXRlTW9kZWw9ZnVuY3Rpb24oYyxkLGYsZyxoLGksail7ZnVuY3Rpb24gaygpe3ZhciBqPWgmJmgubGVuZ3RoP2hbMF06bnVsbDtpZihjKXt2YXIgaz0hZS5hdHRyR2V0dGVyKFwibmdmTXVsdGlwbGVcIixkLGYpJiYhZS5hdHRyR2V0dGVyKFwibXVsdGlwbGVcIixkKSYmIWw7YShlLmF0dHJHZXR0ZXIoXCJuZ01vZGVsXCIsZCkpLmFzc2lnbihmLGs/ajpoKX12YXIgbT1lLmF0dHJHZXR0ZXIoXCJuZ2ZNb2RlbFwiLGQpO20mJmEobSkuYXNzaWduKGYsaCksZyYmYShnKShmLHskZmlsZXM6aCwkZmlsZTpqLCRldmVudDppfSksYihmdW5jdGlvbigpe30pfXZhciBsPWUuYXR0ckdldHRlcihcIm5nZktlZXBcIixkLGYpO2lmKGw9PT0hMCl7aWYoIWh8fCFoLmxlbmd0aClyZXR1cm47dmFyIG09KGMmJmMuJG1vZGVsVmFsdWV8fGQuJCRuZ2ZQcmV2RmlsZXN8fFtdKS5zbGljZSgwKSxuPSExO2lmKGUuYXR0ckdldHRlcihcIm5nZktlZXBEaXN0aW5jdFwiLGQsZik9PT0hMCl7Zm9yKHZhciBvPW0ubGVuZ3RoLHA9MDtwPGgubGVuZ3RoO3ArKyl7Zm9yKHZhciBxPTA7bz5xJiZoW3BdLm5hbWUhPT1tW3FdLm5hbWU7cSsrKTtxPT09byYmKG0ucHVzaChoW3BdKSxuPSEwKX1pZighbilyZXR1cm47aD1tfWVsc2UgaD1tLmNvbmNhdChoKX1kLiQkbmdmUHJldkZpbGVzPWgsaj9rKCk6ZS52YWxpZGF0ZShoLGMsZCxmLGUuYXR0ckdldHRlcihcIm5nZlZhbGlkYXRlTGF0ZXJcIixkKSxmdW5jdGlvbigpe2IoZnVuY3Rpb24oKXtrKCl9KX0pfSxlfV0pfSgpLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooKXtyZXR1cm5cImlucHV0XCI9PT1jWzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSYmZC50eXBlJiZcImZpbGVcIj09PWQudHlwZS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIGsoKXtyZXR1cm4gdChcIm5nZkNoYW5nZVwiKXx8dChcIm5nZlNlbGVjdFwiKX1mdW5jdGlvbiBsKGIpe2Zvcih2YXIgYz1iLl9fZmlsZXNffHxiLnRhcmdldCYmYi50YXJnZXQuZmlsZXMsZj1bXSxnPTA7ZzxjLmxlbmd0aDtnKyspZi5wdXNoKGNbZ10pO2kudXBkYXRlTW9kZWwoZSxkLGEsaygpLGYubGVuZ3RoP2Y6bnVsbCxiKX1mdW5jdGlvbiBtKGEpe2lmKGMhPT1hKWZvcih2YXIgYj0wO2I8Y1swXS5hdHRyaWJ1dGVzLmxlbmd0aDtiKyspe3ZhciBkPWNbMF0uYXR0cmlidXRlc1tiXTtcInR5cGVcIiE9PWQubmFtZSYmXCJjbGFzc1wiIT09ZC5uYW1lJiZcImlkXCIhPT1kLm5hbWUmJlwic3R5bGVcIiE9PWQubmFtZSYmKChudWxsPT1kLnZhbHVlfHxcIlwiPT09ZC52YWx1ZSkmJihcInJlcXVpcmVkXCI9PT1kLm5hbWUmJihkLnZhbHVlPVwicmVxdWlyZWRcIiksXCJtdWx0aXBsZVwiPT09ZC5uYW1lJiYoZC52YWx1ZT1cIm11bHRpcGxlXCIpKSxhLmF0dHIoZC5uYW1lLGQudmFsdWUpKX19ZnVuY3Rpb24gbigpe2lmKGooKSlyZXR1cm4gYzt2YXIgYT1hbmd1bGFyLmVsZW1lbnQoJzxpbnB1dCB0eXBlPVwiZmlsZVwiPicpO3JldHVybiBtKGEpLGEuY3NzKFwidmlzaWJpbGl0eVwiLFwiaGlkZGVuXCIpLmNzcyhcInBvc2l0aW9uXCIsXCJhYnNvbHV0ZVwiKS5jc3MoXCJvdmVyZmxvd1wiLFwiaGlkZGVuXCIpLmNzcyhcIndpZHRoXCIsXCIwcHhcIikuY3NzKFwiaGVpZ2h0XCIsXCIwcHhcIikuY3NzKFwiYm9yZGVyXCIsXCJub25lXCIpLmNzcyhcIm1hcmdpblwiLFwiMHB4XCIpLmNzcyhcInBhZGRpbmdcIixcIjBweFwiKS5hdHRyKFwidGFiaW5kZXhcIixcIi0xXCIpLGIucHVzaCh7ZWw6YyxyZWY6YX0pLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYVswXSksYX1mdW5jdGlvbiBvKGIpe2lmKGMuYXR0cihcImRpc2FibGVkXCIpfHx0KFwibmdmU2VsZWN0RGlzYWJsZWRcIixhKSlyZXR1cm4hMTt2YXIgZD1wKGIpO3JldHVybiBudWxsIT1kP2Q6KHIoYikscShuYXZpZ2F0b3IudXNlckFnZW50KT9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d1swXS5jbGljaygpfSwwKTp3WzBdLmNsaWNrKCksITEpfWZ1bmN0aW9uIHAoYSl7dmFyIGI9YS5jaGFuZ2VkVG91Y2hlc3x8YS5vcmlnaW5hbEV2ZW50JiZhLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXM7aWYoXCJ0b3VjaHN0YXJ0XCI9PT1hLnR5cGUpcmV0dXJuIHY9Yj9iWzBdLmNsaWVudFk6MCwhMDtpZihhLnN0b3BQcm9wYWdhdGlvbigpLGEucHJldmVudERlZmF1bHQoKSxcInRvdWNoZW5kXCI9PT1hLnR5cGUpe3ZhciBjPWI/YlswXS5jbGllbnRZOjA7aWYoTWF0aC5hYnMoYy12KT4yMClyZXR1cm4hMX19ZnVuY3Rpb24gcShhKXt2YXIgYj1hLm1hdGNoKC9BbmRyb2lkW15cXGRdKihcXGQrKVxcLihcXGQrKS8pO2lmKGImJmIubGVuZ3RoPjIpe3ZhciBjPWkuZGVmYXVsdHMuYW5kcm9pZEZpeE1pbm9yVmVyc2lvbnx8NDtyZXR1cm4gcGFyc2VJbnQoYlsxXSk8NHx8cGFyc2VJbnQoYlsxXSk9PT1jJiZwYXJzZUludChiWzJdKTxjfXJldHVybi0xPT09YS5pbmRleE9mKFwiQ2hyb21lXCIpJiYvLipXaW5kb3dzLipTYWZhcmkuKi8udGVzdChhKX1mdW5jdGlvbiByKGIpe3cudmFsKCkmJih3LnZhbChudWxsKSxpLnVwZGF0ZU1vZGVsKGUsZCxhLGsoKSxudWxsLGIsITApKX1mdW5jdGlvbiBzKGEpe2lmKHcmJiF3LmF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIikpe2lmKCF3WzBdLnBhcmVudE5vZGUpcmV0dXJuIHZvaWQodz1udWxsKTthLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSx3LnVuYmluZChcImNsaWNrXCIpO3ZhciBiPXcuY2xvbmUoKTtyZXR1cm4gdy5yZXBsYWNlV2l0aChiKSx3PWIsdy5hdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIsXCJ0cnVlXCIpLHcuYmluZChcImNoYW5nZVwiLGwpLHcuYmluZChcImNsaWNrXCIscyksd1swXS5jbGljaygpLCExfXcucmVtb3ZlQXR0cihcIl9fbmdmX2llMTBfRml4X1wiKX12YXIgdD1mdW5jdGlvbihhLGIpe3JldHVybiBpLmF0dHJHZXR0ZXIoYSxkLGIpfSx1PVtdO3UucHVzaChhLiR3YXRjaCh0KFwibmdmTXVsdGlwbGVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJtdWx0aXBsZVwiLHQoXCJuZ2ZNdWx0aXBsZVwiLGEpKX0pKSx1LnB1c2goYS4kd2F0Y2godChcIm5nZkNhcHR1cmVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJjYXB0dXJlXCIsdChcIm5nZkNhcHR1cmVcIixhKSl9KSksZC4kb2JzZXJ2ZShcImFjY2VwdFwiLGZ1bmN0aW9uKCl7dy5hdHRyKFwiYWNjZXB0XCIsdChcImFjY2VwdFwiKSl9KSx1LnB1c2goZnVuY3Rpb24oKXtkLiQkb2JzZXJ2ZXJzJiZkZWxldGUgZC4kJG9ic2VydmVycy5hY2NlcHR9KTt2YXIgdj0wLHc9YztqKCl8fCh3PW4oKSksdy5iaW5kKFwiY2hhbmdlXCIsbCksaigpP2MuYmluZChcImNsaWNrXCIscik6Yy5iaW5kKFwiY2xpY2sgdG91Y2hzdGFydCB0b3VjaGVuZFwiLG8pLGkucmVnaXN0ZXJWYWxpZGF0b3JzKGUsdyxkLGEpLC0xIT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIikmJncuYmluZChcImNsaWNrXCIscyksYS4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7aigpfHx3LnJlbW92ZSgpLGFuZ3VsYXIuZm9yRWFjaCh1LGZ1bmN0aW9uKGEpe2EoKX0pfSksZyhmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8Yi5sZW5ndGg7YSsrKXt2YXIgYz1iW2FdO2RvY3VtZW50LmJvZHkuY29udGFpbnMoYy5lbFswXSl8fChiLnNwbGljZShhLDEpLGMucmVmLnJlbW92ZSgpKX19KSx3aW5kb3cuRmlsZUFQSSYmd2luZG93LkZpbGVBUEkubmdmRml4SUUmJndpbmRvdy5GaWxlQVBJLm5nZkZpeElFKGMsdyxsKX12YXIgYj1bXTtuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmU2VsZWN0XCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiJGNvbXBpbGVcIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGIsYyxkLGUpe3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZixnLGgsaSl7YShmLGcsaCxpLGIsYyxkLGUpfX19XSl9KCksZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVyblwiaW1nXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cImltYWdlXCI6XCJhdWRpb1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJhdWRpb1wiOlwidmlkZW9cIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1widmlkZW9cIjovXFwuL31uZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZERhdGFVcmxcIixbXCJVcGxvYWRCYXNlXCIsXCIkdGltZW91dFwiLFwiJHFcIixmdW5jdGlvbihhLGIsYyl7dmFyIGQ9YTtyZXR1cm4gZC5kYXRhVXJsPWZ1bmN0aW9uKGEsZCl7aWYoZCYmbnVsbCE9YS5kYXRhVXJsfHwhZCYmbnVsbCE9YS5ibG9iVXJsKXt2YXIgZT1jLmRlZmVyKCk7cmV0dXJuIGIoZnVuY3Rpb24oKXtlLnJlc29sdmUoZD9hLmRhdGFVcmw6YS5ibG9iVXJsKX0pLGUucHJvbWlzZX12YXIgZj1kP2EuJG5nZkRhdGFVcmxQcm9taXNlOmEuJG5nZkJsb2JVcmxQcm9taXNlO2lmKGYpcmV0dXJuIGY7dmFyIGc9Yy5kZWZlcigpO3JldHVybiBiKGZ1bmN0aW9uKCl7aWYod2luZG93LkZpbGVSZWFkZXImJmEmJighd2luZG93LkZpbGVBUEl8fC0xPT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4XCIpfHxhLnNpemU8MmU0KSYmKCF3aW5kb3cuRmlsZUFQSXx8LTE9PT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDlcIil8fGEuc2l6ZTw0ZTYpKXt2YXIgYz13aW5kb3cuVVJMfHx3aW5kb3cud2Via2l0VVJMO2lmKGMmJmMuY3JlYXRlT2JqZWN0VVJMJiYhZCl7dmFyIGU7dHJ5e2U9Yy5jcmVhdGVPYmplY3RVUkwoYSl9Y2F0Y2goZil7cmV0dXJuIHZvaWQgYihmdW5jdGlvbigpe2EuYmxvYlVybD1cIlwiLGcucmVqZWN0KCl9KX1iKGZ1bmN0aW9uKCl7YS5ibG9iVXJsPWUsZSYmZy5yZXNvbHZlKGUpfSl9ZWxzZXt2YXIgaD1uZXcgRmlsZVJlYWRlcjtoLm9ubG9hZD1mdW5jdGlvbihjKXtiKGZ1bmN0aW9uKCl7YS5kYXRhVXJsPWMudGFyZ2V0LnJlc3VsdCxnLnJlc29sdmUoYy50YXJnZXQucmVzdWx0KX0pfSxoLm9uZXJyb3I9ZnVuY3Rpb24oKXtiKGZ1bmN0aW9uKCl7YS5kYXRhVXJsPVwiXCIsZy5yZWplY3QoKX0pfSxoLnJlYWRBc0RhdGFVUkwoYSl9fWVsc2UgYihmdW5jdGlvbigpe2FbZD9cImRhdGFVcmxcIjpcImJsb2JVcmxcIl09XCJcIixnLnJlamVjdCgpfSl9KSxmPWQ/YS4kbmdmRGF0YVVybFByb21pc2U9Zy5wcm9taXNlOmEuJG5nZkJsb2JVcmxQcm9taXNlPWcucHJvbWlzZSxmW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhW2Q/XCIkbmdmRGF0YVVybFByb21pc2VcIjpcIiRuZ2ZCbG9iVXJsUHJvbWlzZVwiXX0pLGZ9LGR9XSk7dmFyIGI9YW5ndWxhci5lbGVtZW50KFwiPHN0eWxlPi5uZ2YtaGlkZXtkaXNwbGF5Om5vbmUgIWltcG9ydGFudH08L3N0eWxlPlwiKTtkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoYlswXSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZlNyY1wiLFtcIiRjb21waWxlXCIsXCIkdGltZW91dFwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYixjLGQpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihiLGUsZil7YyhmdW5jdGlvbigpe3ZhciBnPWIuJHdhdGNoKGYubmdmU3JjLGZ1bmN0aW9uKGcpe2lmKGFuZ3VsYXIuaXNTdHJpbmcoZykpcmV0dXJuIGUucmVtb3ZlQ2xhc3MoXCJuZ2YtaGlkZVwiKSxlLmF0dHIoXCJzcmNcIixnKTtpZihnJiZnLnR5cGUmJjA9PT1nLnR5cGUuaW5kZXhPZihhKGVbMF0pKSl7dmFyIGg9ZC5hdHRyR2V0dGVyKFwibmdmTm9PYmplY3RVcmxcIixmLGIpO2QuZGF0YVVybChnLGgpW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2MoZnVuY3Rpb24oKXtoJiZnLmRhdGFVcmx8fCFoJiZnLmJsb2JVcmw/KGUucmVtb3ZlQ2xhc3MoXCJuZ2YtaGlkZVwiKSxlLmF0dHIoXCJzcmNcIixoP2cuZGF0YVVybDpnLmJsb2JVcmwpKTplLmFkZENsYXNzKFwibmdmLWhpZGVcIil9KX0pfWVsc2UgZS5hZGRDbGFzcyhcIm5nZi1oaWRlXCIpfSk7Yi4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7ZygpfSl9KX19fV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZCYWNrZ3JvdW5kXCIsW1wiVXBsb2FkXCIsXCIkY29tcGlsZVwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGIsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGIsZCxlKXtjKGZ1bmN0aW9uKCl7dmFyIGY9Yi4kd2F0Y2goZS5uZ2ZCYWNrZ3JvdW5kLGZ1bmN0aW9uKGYpe2lmKGFuZ3VsYXIuaXNTdHJpbmcoZikpcmV0dXJuIGQuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLFwidXJsKCdcIitmK1wiJylcIik7aWYoZiYmZi50eXBlJiYwPT09Zi50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSl7dmFyIGc9YS5hdHRyR2V0dGVyKFwibmdmTm9PYmplY3RVcmxcIixlLGIpO2EuZGF0YVVybChmLGcpW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2MoZnVuY3Rpb24oKXtnJiZmLmRhdGFVcmx8fCFnJiZmLmJsb2JVcmw/ZC5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJ1cmwoJ1wiKyhnP2YuZGF0YVVybDpmLmJsb2JVcmwpK1wiJylcIik6ZC5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJcIil9KX0pfWVsc2UgZC5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsXCJcIil9KTtiLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtmKCl9KX0pfX19XSksbmdGaWxlVXBsb2FkLmNvbmZpZyhbXCIkY29tcGlsZVByb3ZpZGVyXCIsZnVuY3Rpb24oYSl7YS5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QmJmEuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfGxvY2FsfGZpbGV8ZGF0YXxibG9iKTovKSxhLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0JiZhLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfGxvY2FsfGZpbGV8ZGF0YXxibG9iKTovKX1dKSxuZ0ZpbGVVcGxvYWQuZmlsdGVyKFwibmdmRGF0YVVybFwiLFtcIlVwbG9hZERhdGFVcmxcIixcIiRzY2VcIixmdW5jdGlvbihhLGIpe3JldHVybiBmdW5jdGlvbihjLGQpe3JldHVybiBhbmd1bGFyLmlzU3RyaW5nKGMpP2IudHJ1c3RBc1Jlc291cmNlVXJsKGMpOmMmJiFjLmRhdGFVcmw/KHZvaWQgMD09PWMuZGF0YVVybCYmYW5ndWxhci5pc09iamVjdChjKSYmKGMuZGF0YVVybD1udWxsLGEuZGF0YVVybChjLGQpKSxcIlwiKTooYyYmYy5kYXRhVXJsP2IudHJ1c3RBc1Jlc291cmNlVXJsKGMuZGF0YVVybCk6Yyl8fFwiXCJ9fV0pfSgpLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShiKXtpZihiLmxlbmd0aD4yJiZcIi9cIj09PWJbMF0mJlwiL1wiPT09YltiLmxlbmd0aC0xXSlyZXR1cm4gYi5zdWJzdHJpbmcoMSxiLmxlbmd0aC0xKTt2YXIgYz1iLnNwbGl0KFwiLFwiKSxkPVwiXCI7aWYoYy5sZW5ndGg+MSlmb3IodmFyIGU9MDtlPGMubGVuZ3RoO2UrKylkKz1cIihcIithKGNbZV0pK1wiKVwiLGU8Yy5sZW5ndGgtMSYmKGQrPVwifFwiKTtlbHNlIDA9PT1iLmluZGV4T2YoXCIuXCIpJiYoYj1cIipcIitiKSxkPVwiXlwiK2IucmVwbGFjZShuZXcgUmVnRXhwKFwiWy5cXFxcXFxcXCsqP1xcXFxbXFxcXF5cXFxcXSQoKXt9PSE8Pnw6XFxcXC1dXCIsXCJnXCIpLFwiXFxcXCQmXCIpK1wiJFwiLGQ9ZC5yZXBsYWNlKC9cXFxcXFwqL2csXCIuKlwiKS5yZXBsYWNlKC9cXFxcXFw/L2csXCIuXCIpO3JldHVybiBkfWZ1bmN0aW9uIGIoYSl7aWYoYW5ndWxhci5pc1N0cmluZyhhKSl7aWYoYS5zZWFyY2goL2tiL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTMqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL21iL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTYqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2diL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTkqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2IvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KGEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9zL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvbS9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoNjAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL2gvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDM2MDAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSl9cmV0dXJuIGF9bmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRWYWxpZGF0ZVwiLFtcIlVwbG9hZERhdGFVcmxcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGMsZCxlKXt2YXIgZj1jO3JldHVybiBmLnJlZ2lzdGVyVmFsaWRhdG9ycz1mdW5jdGlvbihhLGIsYyxkKXtmdW5jdGlvbiBlKGEpe2FuZ3VsYXIuZm9yRWFjaChhLiRuZ2ZWYWxpZGF0aW9ucyxmdW5jdGlvbihiKXthLiRzZXRWYWxpZGl0eShiLm5hbWUsYi52YWxpZCl9KX1hJiYoYS4kbmdmVmFsaWRhdGlvbnM9W10sYS4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGcpe3JldHVybiBmLmF0dHJHZXR0ZXIoXCJuZ2ZWYWxpZGF0ZUxhdGVyXCIsYyxkKXx8IWEuJCRuZ2ZWYWxpZGF0ZWQ/KGYudmFsaWRhdGUoZyxhLGMsZCwhMSxmdW5jdGlvbigpe2UoYSksYS4kJG5nZlZhbGlkYXRlZD0hMX0pLGcmJjA9PT1nLmxlbmd0aCYmKGc9bnVsbCksIWJ8fG51bGwhPWcmJjAhPT1nLmxlbmd0aHx8Yi52YWwoKSYmYi52YWwobnVsbCkpOihlKGEpLGEuJCRuZ2ZWYWxpZGF0ZWQ9ITEpLGd9KSl9LGYudmFsaWRhdGVQYXR0ZXJuPWZ1bmN0aW9uKGIsYyl7aWYoIWMpcmV0dXJuITA7dmFyIGQ9bmV3IFJlZ0V4cChhKGMpLFwiZ2lcIik7cmV0dXJuIG51bGwhPWIudHlwZSYmZC50ZXN0KGIudHlwZS50b0xvd2VyQ2FzZSgpKXx8bnVsbCE9Yi5uYW1lJiZkLnRlc3QoYi5uYW1lLnRvTG93ZXJDYXNlKCkpfSxmLnZhbGlkYXRlPWZ1bmN0aW9uKGEsYyxkLGUsZyxoKXtmdW5jdGlvbiBpKGIsZCxlKXtpZihhKXtmb3IodmFyIGY9XCJuZ2ZcIitiWzBdLnRvVXBwZXJDYXNlKCkrYi5zdWJzdHIoMSksZz1hLmxlbmd0aCxoPW51bGw7Zy0tOyl7dmFyIGk9YVtnXSxqPWsoZix7JGZpbGU6aX0pO251bGw9PWomJihqPWQoayhcIm5nZlZhbGlkYXRlXCIpfHx7fSksaD1udWxsPT1oPyEwOmgpLG51bGwhPWomJihlKGksail8fChpLiRlcnJvcj1iLGkuJGVycm9yUGFyYW09aixhLnNwbGljZShnLDEpLGg9ITEpKX1udWxsIT09aCYmYy4kbmdmVmFsaWRhdGlvbnMucHVzaCh7bmFtZTpiLHZhbGlkOmh9KX19ZnVuY3Rpb24gaihiLGQsZSxmLGcpe2lmKGEpe3ZhciBpPTAsaj0hMSxtPVwibmdmXCIrYlswXS50b1VwcGVyQ2FzZSgpK2Iuc3Vic3RyKDEpO2E9dm9pZCAwPT09YS5sZW5ndGg/W2FdOmEsYW5ndWxhci5mb3JFYWNoKGEsZnVuY3Rpb24oYSl7aWYoMCE9PWEudHlwZS5zZWFyY2goZSkpcmV0dXJuITA7dmFyIG49ayhtLHskZmlsZTphfSl8fGQoayhcIm5nZlZhbGlkYXRlXCIseyRmaWxlOmF9KXx8e30pO24mJihsKyssaSsrLGYoYSxuKS50aGVuKGZ1bmN0aW9uKGMpe2coYyxuKXx8KGEuJGVycm9yPWIsYS4kZXJyb3JQYXJhbT1uLGo9ITApfSxmdW5jdGlvbigpe2soXCJuZ2ZWYWxpZGF0ZUZvcmNlXCIseyRmaWxlOmF9KSYmKGEuJGVycm9yPWIsYS4kZXJyb3JQYXJhbT1uLGo9ITApfSlbXCJmaW5hbGx5XCJdKGZ1bmN0aW9uKCl7bC0tLGktLSxpfHxjLiRuZ2ZWYWxpZGF0aW9ucy5wdXNoKHtuYW1lOmIsdmFsaWQ6IWp9KSxsfHxoLmNhbGwoYyxjLiRuZ2ZWYWxpZGF0aW9ucyl9KSl9KX19Yz1jfHx7fSxjLiRuZ2ZWYWxpZGF0aW9ucz1jLiRuZ2ZWYWxpZGF0aW9uc3x8W10sYW5ndWxhci5mb3JFYWNoKGMuJG5nZlZhbGlkYXRpb25zLGZ1bmN0aW9uKGEpe2EudmFsaWQ9ITB9KTt2YXIgaz1mdW5jdGlvbihhLGIpe3JldHVybiBmLmF0dHJHZXR0ZXIoYSxkLGUsYil9O2lmKGcpcmV0dXJuIHZvaWQgaC5jYWxsKGMpO2lmKGMuJCRuZ2ZWYWxpZGF0ZWQ9ITAsbnVsbD09YXx8MD09PWEubGVuZ3RoKXJldHVybiB2b2lkIGguY2FsbChjKTtpZihhPXZvaWQgMD09PWEubGVuZ3RoP1thXTphLnNsaWNlKDApLGkoXCJwYXR0ZXJuXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEucGF0dGVybn0sZi52YWxpZGF0ZVBhdHRlcm4pLGkoXCJtaW5TaXplXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuc2l6ZSYmYS5zaXplLm1pbn0sZnVuY3Rpb24oYSxjKXtyZXR1cm4gYS5zaXplPj1iKGMpfSksaShcIm1heFNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWF4fSxmdW5jdGlvbihhLGMpe3JldHVybiBhLnNpemU8PWIoYyl9KSxpKFwidmFsaWRhdGVGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGI9PT0hMHx8bnVsbD09PWJ8fFwiXCI9PT1ifSksIWEubGVuZ3RoKXJldHVybiB2b2lkIGguY2FsbChjLGMuJG5nZlZhbGlkYXRpb25zKTt2YXIgbD0wO2ooXCJtYXhIZWlnaHRcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5oZWlnaHQmJmEuaGVpZ2h0Lm1heH0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLmhlaWdodDw9Yn0pLGooXCJtaW5IZWlnaHRcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5oZWlnaHQmJmEuaGVpZ2h0Lm1pbn0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLmhlaWdodD49Yn0pLGooXCJtYXhXaWR0aFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLndpZHRoJiZhLndpZHRoLm1heH0sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe3JldHVybiBhLndpZHRoPD1ifSksaihcIm1pbldpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg+PWJ9KSxqKFwicmF0aW9cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5yYXRpb30sL2ltYWdlLyx0aGlzLmltYWdlRGltZW5zaW9ucyxmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1iLnRvU3RyaW5nKCkuc3BsaXQoXCIsXCIpLGQ9ITEsZT0wO2U8Yy5sZW5ndGg7ZSsrKXt2YXIgZj1jW2VdLGc9Zi5zZWFyY2goL3gvaSk7Zj1nPi0xP3BhcnNlRmxvYXQoZi5zdWJzdHJpbmcoMCxnKSkvcGFyc2VGbG9hdChmLnN1YnN0cmluZyhnKzEpKTpwYXJzZUZsb2F0KGYpLE1hdGguYWJzKGEud2lkdGgvYS5oZWlnaHQtZik8MWUtNCYmKGQ9ITApfXJldHVybiBkfSksaihcIm1heER1cmF0aW9uXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuZHVyYXRpb24mJmEuZHVyYXRpb24ubWF4fSwvYXVkaW98dmlkZW8vLHRoaXMubWVkaWFEdXJhdGlvbixmdW5jdGlvbihhLGMpe3JldHVybiBhPD1iKGMpfSksaihcIm1pbkR1cmF0aW9uXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuZHVyYXRpb24mJmEuZHVyYXRpb24ubWlufSwvYXVkaW98dmlkZW8vLHRoaXMubWVkaWFEdXJhdGlvbixmdW5jdGlvbihhLGMpe3JldHVybiBhPj1iKGMpfSksaihcInZhbGlkYXRlQXN5bmNGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LC8uLyxmdW5jdGlvbihhLGIpe3JldHVybiBifSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PSEwfHxudWxsPT09YXx8XCJcIj09PWF9KSxsfHxoLmNhbGwoYyxjLiRuZ2ZWYWxpZGF0aW9ucyl9LGYuaW1hZ2VEaW1lbnNpb25zPWZ1bmN0aW9uKGEpe2lmKGEud2lkdGgmJmEuaGVpZ2h0KXt2YXIgYj1kLmRlZmVyKCk7cmV0dXJuIGUoZnVuY3Rpb24oKXtiLnJlc29sdmUoe3dpZHRoOmEud2lkdGgsaGVpZ2h0OmEuaGVpZ2h0fSl9KSxiLnByb21pc2V9aWYoYS4kbmdmRGltZW5zaW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRGltZW5zaW9uUHJvbWlzZTt2YXIgYz1kLmRlZmVyKCk7cmV0dXJuIGUoZnVuY3Rpb24oKXtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/dm9pZCBjLnJlamVjdChcIm5vdCBpbWFnZVwiKTp2b2lkIGYuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmNsaWVudFdpZHRoLGQ9aFswXS5jbGllbnRIZWlnaHQ7aC5yZW1vdmUoKSxhLndpZHRoPWIsYS5oZWlnaHQ9ZCxjLnJlc29sdmUoe3dpZHRoOmIsaGVpZ2h0OmR9KX1mdW5jdGlvbiBmKCl7aC5yZW1vdmUoKSxjLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2UoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmNsaWVudFdpZHRoP2QoKTppPjEwP2YoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudChcIjxpbWc+XCIpLmF0dHIoXCJzcmNcIixiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkXCIsZCksaC5vbihcImVycm9yXCIsZik7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSkuYXBwZW5kKGgpfSxmdW5jdGlvbigpe2MucmVqZWN0KFwibG9hZCBlcnJvclwiKX0pfSksYS4kbmdmRGltZW5zaW9uUHJvbWlzZT1jLnByb21pc2UsYS4kbmdmRGltZW5zaW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRGltZW5zaW9uUHJvbWlzZX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2V9LGYubWVkaWFEdXJhdGlvbj1mdW5jdGlvbihhKXtpZihhLmR1cmF0aW9uKXt2YXIgYj1kLmRlZmVyKCk7cmV0dXJuIGUoZnVuY3Rpb24oKXtiLnJlc29sdmUoYS5kdXJhdGlvbil9KSxiLnByb21pc2V9aWYoYS4kbmdmRHVyYXRpb25Qcm9taXNlKXJldHVybiBhLiRuZ2ZEdXJhdGlvblByb21pc2U7dmFyIGM9ZC5kZWZlcigpO3JldHVybiBlKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpJiYwIT09YS50eXBlLmluZGV4T2YoXCJ2aWRlb1wiKT92b2lkIGMucmVqZWN0KFwibm90IG1lZGlhXCIpOnZvaWQgZi5kYXRhVXJsKGEpLnRoZW4oZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe3ZhciBiPWhbMF0uZHVyYXRpb247YS5kdXJhdGlvbj1iLGgucmVtb3ZlKCksYy5yZXNvbHZlKGIpfWZ1bmN0aW9uIGYoKXtoLnJlbW92ZSgpLGMucmVqZWN0KFwibG9hZCBlcnJvclwiKX1mdW5jdGlvbiBnKCl7ZShmdW5jdGlvbigpe2hbMF0ucGFyZW50Tm9kZSYmKGhbMF0uZHVyYXRpb24/ZCgpOmk+MTA/ZigpOmcoKSl9LDFlMyl9dmFyIGg9YW5ndWxhci5lbGVtZW50KDA9PT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpP1wiPGF1ZGlvPlwiOlwiPHZpZGVvPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwibm9uZVwiKS5jc3MoXCJwb3NpdGlvblwiLFwiZml4ZWRcIik7aC5vbihcImxvYWRlZG1ldGFkYXRhXCIsZCksaC5vbihcImVycm9yXCIsZik7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtjLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkR1cmF0aW9uUHJvbWlzZT1jLnByb21pc2UsYS4kbmdmRHVyYXRpb25Qcm9taXNlW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhLiRuZ2ZEdXJhdGlvblByb21pc2V9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2V9LGZ9XSl9KCksZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEsYyxkLGUsZixnLGgsaSl7ZnVuY3Rpb24gaigpe3JldHVybiBjLmF0dHIoXCJkaXNhYmxlZFwiKXx8bihcIm5nZkRyb3BEaXNhYmxlZFwiLGEpfWZ1bmN0aW9uIGsoYSxiLGMsZCl7dmFyIGU9bihcIm5nZkRyYWdPdmVyQ2xhc3NcIixhLHskZXZlbnQ6Y30pLGY9bihcIm5nZkRyYWdPdmVyQ2xhc3NcIil8fFwiZHJhZ292ZXJcIjtpZihhbmd1bGFyLmlzU3RyaW5nKGUpKXJldHVybiB2b2lkIGQoZSk7aWYoZSYmKGUuZGVsYXkmJihyPWUuZGVsYXkpLGUuYWNjZXB0fHxlLnJlamVjdCkpe3ZhciBnPWMuZGF0YVRyYW5zZmVyLml0ZW1zO2lmKG51bGwhPWcpZm9yKHZhciBoPW4oXCJuZ2ZQYXR0ZXJuXCIsYSx7JGV2ZW50OmN9KSxqPTA7ajxnLmxlbmd0aDtqKyspaWYoXCJmaWxlXCI9PT1nW2pdLmtpbmR8fFwiXCI9PT1nW2pdLmtpbmQpe2lmKCFpLnZhbGlkYXRlUGF0dGVybihnW2pdLGgpKXtmPWUucmVqZWN0O2JyZWFrfWY9ZS5hY2NlcHR9fWQoZil9ZnVuY3Rpb24gbChhLGIsYyxkKXtmdW5jdGlvbiBlKGEsYixjKXtpZihudWxsIT1iKWlmKGIuaXNEaXJlY3Rvcnkpe3ZhciBkPShjfHxcIlwiKStiLm5hbWU7YS5wdXNoKHtuYW1lOmIubmFtZSx0eXBlOlwiZGlyZWN0b3J5XCIscGF0aDpkfSk7dmFyIGY9Yi5jcmVhdGVSZWFkZXIoKSxnPVtdO2krKzt2YXIgaD1mdW5jdGlvbigpe2YucmVhZEVudHJpZXMoZnVuY3Rpb24oZCl7dHJ5e2lmKGQubGVuZ3RoKWc9Zy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZHx8W10sMCkpLGgoKTtlbHNle2Zvcih2YXIgZj0wO2Y8Zy5sZW5ndGg7ZisrKWUoYSxnW2ZdLChjP2M6XCJcIikrYi5uYW1lK1wiL1wiKTtpLS19fWNhdGNoKGope2ktLSxjb25zb2xlLmVycm9yKGopfX0sZnVuY3Rpb24oKXtpLS19KX07aCgpfWVsc2UgaSsrLGIuZmlsZShmdW5jdGlvbihiKXt0cnl7aS0tLGIucGF0aD0oYz9jOlwiXCIpK2IubmFtZSxhLnB1c2goYil9Y2F0Y2goZCl7aS0tLGNvbnNvbGUuZXJyb3IoZCl9fSxmdW5jdGlvbigpe2ktLX0pfXZhciBmPVtdLGk9MCxqPWEuZGF0YVRyYW5zZmVyLml0ZW1zO2lmKGomJmoubGVuZ3RoPjAmJlwiZmlsZVwiIT09aC5wcm90b2NvbCgpKWZvcih2YXIgaz0wO2s8ai5sZW5ndGg7aysrKXtpZihqW2tdLndlYmtpdEdldEFzRW50cnkmJmpba10ud2Via2l0R2V0QXNFbnRyeSgpJiZqW2tdLndlYmtpdEdldEFzRW50cnkoKS5pc0RpcmVjdG9yeSl7dmFyIGw9altrXS53ZWJraXRHZXRBc0VudHJ5KCk7aWYobC5pc0RpcmVjdG9yeSYmIWMpY29udGludWU7bnVsbCE9bCYmZShmLGwpfWVsc2V7dmFyIG09altrXS5nZXRBc0ZpbGUoKTtudWxsIT1tJiZmLnB1c2gobSl9aWYoIWQmJmYubGVuZ3RoPjApYnJlYWt9ZWxzZXt2YXIgbj1hLmRhdGFUcmFuc2Zlci5maWxlcztpZihudWxsIT1uKWZvcih2YXIgbz0wO288bi5sZW5ndGgmJihmLnB1c2gobi5pdGVtKG8pKSxkfHwhKGYubGVuZ3RoPjApKTtvKyspO312YXIgcD0wOyFmdW5jdGlvbiBxKGEpe2coZnVuY3Rpb24oKXtpZihpKTEwKnArKzwyZTQmJnEoMTApO2Vsc2V7aWYoIWQmJmYubGVuZ3RoPjEpe2ZvcihrPTA7XCJkaXJlY3RvcnlcIj09PWZba10udHlwZTspaysrO2Y9W2Zba11dfWIoZil9fSxhfHwwKX0oKX12YXIgbT1iKCksbj1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGkuYXR0ckdldHRlcihhLGQsYixjKX07aWYobihcImRyb3BBdmFpbGFibGVcIikmJmcoZnVuY3Rpb24oKXthW24oXCJkcm9wQXZhaWxhYmxlXCIpXT9hW24oXCJkcm9wQXZhaWxhYmxlXCIpXS52YWx1ZT1tOmFbbihcImRyb3BBdmFpbGFibGVcIildPW19KSwhbSlyZXR1cm4gdm9pZChuKFwibmdmSGlkZU9uRHJvcE5vdEF2YWlsYWJsZVwiLGEpPT09ITAmJmMuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKSk7aS5yZWdpc3RlclZhbGlkYXRvcnMoZSxudWxsLGQsYSk7dmFyIG8scD1udWxsLHE9ZihuKFwibmdmU3RvcFByb3BhZ2F0aW9uXCIpKSxyPTE7Y1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIixmdW5jdGlvbihiKXtpZighaigpKXtpZihiLnByZXZlbnREZWZhdWx0KCkscShhKSYmYi5zdG9wUHJvcGFnYXRpb24oKSxuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIik+LTEpe3ZhciBlPWIuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQ7Yi5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdD1cIm1vdmVcIj09PWV8fFwibGlua01vdmVcIj09PWU/XCJtb3ZlXCI6XCJjb3B5XCJ9Zy5jYW5jZWwocCksb3x8KG89XCJDXCIsayhhLGQsYixmdW5jdGlvbihhKXtvPWEsYy5hZGRDbGFzcyhvKX0pKX19LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIixmdW5jdGlvbihiKXtqKCl8fChiLnByZXZlbnREZWZhdWx0KCkscShhKSYmYi5zdG9wUHJvcGFnYXRpb24oKSl9LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIixmdW5jdGlvbigpe2ooKXx8KHA9ZyhmdW5jdGlvbigpe2MucmVtb3ZlQ2xhc3Mobyksbz1udWxsfSxyfHwxKSl9LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsZnVuY3Rpb24oYil7aigpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCksYy5yZW1vdmVDbGFzcyhvKSxvPW51bGwsbChiLGZ1bmN0aW9uKGMpe2kudXBkYXRlTW9kZWwoZSxkLGEsbihcIm5nZkNoYW5nZVwiKXx8bihcIm5nZkRyb3BcIiksYyxiKX0sbihcIm5nZkFsbG93RGlyXCIsYSkhPT0hMSxuKFwibXVsdGlwbGVcIil8fG4oXCJuZ2ZNdWx0aXBsZVwiLGEpKSl9LCExKSxjWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLGZ1bmN0aW9uKGIpe2lmKCFqKCkpe3ZhciBjPVtdLGY9Yi5jbGlwYm9hcmREYXRhfHxiLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YTtpZihmJiZmLml0ZW1zKXtmb3IodmFyIGc9MDtnPGYuaXRlbXMubGVuZ3RoO2crKyktMSE9PWYuaXRlbXNbZ10udHlwZS5pbmRleE9mKFwiaW1hZ2VcIikmJmMucHVzaChmLml0ZW1zW2ddLmdldEFzRmlsZSgpKTtpLnVwZGF0ZU1vZGVsKGUsZCxhLG4oXCJuZ2ZDaGFuZ2VcIil8fG4oXCJuZ2ZEcm9wXCIpLGMsYil9fX0sITEpfWZ1bmN0aW9uIGIoKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3JldHVyblwiZHJhZ2dhYmxlXCJpbiBhJiZcIm9uZHJvcFwiaW4gYSYmIS9FZGdlXFwvMTIuL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KX1uZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmRHJvcFwiLFtcIiRwYXJzZVwiLFwiJHRpbWVvdXRcIixcIiRsb2NhdGlvblwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYixjLGQsZSl7cmV0dXJue3Jlc3RyaWN0OlwiQUVDXCIscmVxdWlyZTpcIj9uZ01vZGVsXCIsbGluazpmdW5jdGlvbihmLGcsaCxpKXthKGYsZyxoLGksYixjLGQsZSl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmTm9GaWxlRHJvcFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGEsYyl7YigpJiZjLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIil9fSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkRyb3BBdmFpbGFibGVcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCJVcGxvYWRcIixmdW5jdGlvbihhLGMsZCl7cmV0dXJuIGZ1bmN0aW9uKGUsZixnKXtpZihiKCkpe3ZhciBoPWEoZC5hdHRyR2V0dGVyKFwibmdmRHJvcEF2YWlsYWJsZVwiLGcpKTtjKGZ1bmN0aW9uKCl7aChlKSxoLmFzc2lnbiYmaC5hc3NpZ24oZSwhMCl9KX19fV0pfSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==