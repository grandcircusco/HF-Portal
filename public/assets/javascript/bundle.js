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


/*! 7.3.9 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="7.3.9",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function g(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&f?{loaded:a.loaded+d._start,total:d._file.size,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){f&&d._chunkSize&&!d._finished?(g({loaded:d._end,total:d._file.size,config:d,type:"progress"}),e.upload(d)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.headers.__setXHR_=function(){return function(a){a&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,g(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,g(h(a)))},!1))}},f?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):i():i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},k}var e=this;this.isResumeSupported=function(){return window.Blob&&(new Blob).slice};var f=this.isResumeSupported();this.upload=function(a){function b(c,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))c.append(e,d);else if("form"===a.sendFieldsAs)if(angular.isObject(d))for(var f in d)d.hasOwnProperty(f)&&b(c,d[f],e+"["+f+"]");else c.append(e,d);else d=angular.isString(d)?d:angular.toJson(d),"json-blob"===a.sendFieldsAs?c.append(e,new Blob([d],{type:"application/json"})):c.append(e,d)}function c(a){return a instanceof Blob||a.flashId&&a.name&&a.size}function g(b,d,e){if(c(d)){if(a._file=a._file||d,null!=a._start&&f){a._end&&a._end>=d.size&&(a._finished=!0,a._end=d.size);var h=d.slice(a._start,a._end||d.size);h.name=d.name,d=h,a._chunkSize&&(b.append("chunkSize",a._end-a._start),b.append("chunkNumber",Math.floor(a._start/a._chunkSize)),b.append("totalSize",a._file.size))}b.append(e,d,d.fileName||d.name)}else{if(!angular.isObject(d))throw"Expected file object in Upload.upload file option: "+d.toString();for(var i in d)if(d.hasOwnProperty(i)){var j=i.split(",");j[1]&&(d[i].fileName=j[1].replace(/^\s+|\s+$/g,"")),g(b,d[i],j[0])}}}return a._chunkSize=e.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(c){var d,e=new FormData,f={};for(d in a.fields)a.fields.hasOwnProperty(d)&&(f[d]=a.fields[d]);c&&(f.data=c);for(d in f)if(f.hasOwnProperty(d)){var h=f[d];a.formDataAppender?a.formDataAppender(e,d,h):b(e,h,d)}if(null!=a.file)if(angular.isArray(a.file))for(var i=0;i<a.file.length;i++)g(e,a.file[i],"file");else g(e,a.file,"file");return e}),d(a)},this.http=function(b){return b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=e.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1e3*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1e6*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1e9*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","UploadResize",function(a,b,c,d){var e=d;return e.getAttrWithDefaults=function(a,b){return null!=a[b]?a[b]:null==e.defaults[b]?e.defaults[b]:e.defaults[b].toString()},e.attrGetter=function(b,c,d,e){if(!d)return this.getAttrWithDefaults(c,b);try{return e?a(this.getAttrWithDefaults(c,b))(d,e):a(this.getAttrWithDefaults(c,b))(d)}catch(f){if(b.search(/min|max|pattern/i))return this.getAttrWithDefaults(c,b);throw f}},e.updateModel=function(c,d,f,g,h,i,j){function k(){var j=h&&h.length?h[0]:null;if(c){var k=!e.attrGetter("ngfMultiple",d,f)&&!e.attrGetter("multiple",d)&&!p;a(e.attrGetter("ngModel",d)).assign(f,k?j:h)}var l=e.attrGetter("ngfModel",d);l&&a(l).assign(f,h),g&&a(g)(f,{$files:h,$file:j,$newFiles:m,$duplicateFiles:n,$event:i}),b(function(){})}function l(a,b){var c=e.attrGetter("ngfResize",d,f);if(!c||!e.isResizeSupported())return b();for(var g=a.length,h=function(){g--,0===g&&b()},i=function(b){return function(c){a.splice(b,1,c),h()}},j=function(a){return function(b){h(),a.$error="resize",a.$errorParam=(b?(b.message?b.message:b)+": ":"")+(a&&a.name)}},k=0;k<a.length;k++){var l=a[k];l.$error||0!==l.type.indexOf("image")?h():e.resize(l,c.width,c.height,c.quality).then(i(k),j(l))}}var m=h,n=[],o=(c&&c.$modelValue||d.$$ngfPrevFiles||[]).slice(0),p=e.attrGetter("ngfKeep",d,f);if(p===!0){if(!h||!h.length)return;var q=!1;if(e.attrGetter("ngfKeepDistinct",d,f)===!0){for(var r=o.length,s=0;s<h.length;s++){for(var t=0;r>t;t++)if(h[s].name===o[t].name){n.push(h[s]);break}t===r&&(o.push(h[s]),q=!0)}if(!q)return;h=o}else h=o.concat(h)}d.$$ngfPrevFiles=h,j?k():e.validate(h,c,d,f,e.attrGetter("ngfValidateLater",d),function(){l(h,function(){b(function(){k()})})});for(var u=o.length;u--;){var v=o[u];window.URL&&v.blobUrl&&(URL.revokeObjectURL(v.blobUrl),delete v.blobUrl)}},e}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"id"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');return n(a),a.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:a}),document.body.appendChild(a[0]),a}function p(c){if(b.attr("disabled")||t("ngfSelectDisabled",a))return!1;var d=q(c);return null!=d?d:(r(c),e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1)}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)},u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),j.registerValidators(d,w,c,a),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),a.$on("$destroy",function(){k()||w.remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.dataUrl:a.blobUrl)||a.dataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ngf-hide"):e.addClass("ngf-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;if("ngfThumbnail"===g&&(d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),0===d.width&&window.getComputedStyle)){var f=getComputedStyle(e[0]);d={width:parseInt(f.width.slice(0,-2)),height:parseInt(f.height.slice(0,-2))}}return angular.isString(c)?(e.removeClass("ngf-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ngf-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.dataUrl=function(a,d){if(d&&null!=a.dataUrl||!d&&null!=a.blobUrl){var e=c.defer();return b(function(){e.resolve(d?a.dataUrl:a.blobUrl)}),e.promise}var f=d?a.$ngfDataUrlPromise:a.$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!d){var e;try{e=c.createObjectURL(a)}catch(f){return void b(function(){a.blobUrl="",g.reject()})}b(function(){a.blobUrl=e,e&&g.resolve(e)})}else{var h=new FileReader;h.onload=function(c){b(function(){a.dataUrl=c.target.result,g.resolve(c.target.result)})},h.onerror=function(){b(function(){a.dataUrl="",g.reject()})},h.readAsDataURL(a)}}else b(function(){a[d?"dataUrl":"blobUrl"]="",g.reject()})}),f=d?a.$ngfDataUrlPromise=g.promise:a.$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[d?"$ngfDataUrlPromise":"$ngfBlobUrlPromise"]}),f},d}]);var c=angular.element("<style>.ngf-hide{display:none !important}</style>");document.getElementsByTagName("head")[0].appendChild(c[0]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){var b="",c=[];if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])b=a.substring(1,a.length-1);else{var e=a.split(",");if(e.length>1)for(var f=0;f<e.length;f++){var g=d(e[f]);g.regexp?(b+="("+g.regexp+")",f<e.length-1&&(b+="|")):c=c.concat(g.excludes)}else 0===a.indexOf("!")?c.push("^((?!"+d(a.substring(1)).regexp+").)*$"):(0===a.indexOf(".")&&(a="*"+a),b="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",b=b.replace(/\\\*/g,".*").replace(/\\\?/g,"."))}return{regexp:b,excludes:c}}var e=a;return e.registerValidators=function(a,b,c,d){function f(a){angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})}a&&(a.$ngfValidations=[],a.$formatters.push(function(g){return e.attrGetter("ngfValidateLater",c,d)||!a.$$ngfValidated?(e.validate(g,a,c,d,!1,function(){f(a),a.$$ngfValidated=!1}),g&&0===g.length&&(g=null),!b||null!=g&&0!==g.length||b.val()&&b.val(null)):(f(a),a.$$ngfValidated=!1),g}))},e.validatePattern=function(a,b){if(!b)return!0;var c=d(b),e=!0;if(c.regexp&&c.regexp.length){var f=new RegExp(c.regexp,"i");e=null!=a.type&&f.test(a.type)||null!=a.name&&f.test(a.name)}for(var g=c.excludes.length;g--;){var h=new RegExp(c.excludes[g],"i");e=e&&(null==a.type||h.test(a.type))&&(null==a.name||h.test(a.name))}return e},e.validate=function(a,b,c,d,f,g){function h(c,d,e){if(a){for(var f="ngf"+c[0].toUpperCase()+c.substr(1),g=a.length,h=null;g--;){var i=a[g],k=j(f,{$file:i});null==k&&(k=d(j("ngfValidate")||{}),h=null==h?!0:h),null!=k&&(e(i,k)||(i.$error=c,i.$errorParam=k,a.splice(g,1),h=!1))}null!==h&&b.$ngfValidations.push({name:c,valid:h})}}function i(c,d,e,f,h){if(a){var i=0,l=!1,m="ngf"+c[0].toUpperCase()+c.substr(1);a=void 0===a.length?[a]:a,angular.forEach(a,function(a){if(0!==a.type.search(e))return!0;var n=j(m,{$file:a})||d(j("ngfValidate",{$file:a})||{});n&&(k++,i++,f(a,n).then(function(b){h(b,n)||(a.$error=c,a.$errorParam=n,l=!0)},function(){j("ngfValidateForce",{$file:a})&&(a.$error=c,a.$errorParam=n,l=!0)})["finally"](function(){k--,i--,i||b.$ngfValidations.push({name:c,valid:!l}),k||g.call(b,b.$ngfValidations)}))})}}b=b||{},b.$ngfValidations=b.$ngfValidations||[],angular.forEach(b.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return e.attrGetter(a,c,d,b)};if(f)return void g.call(b);if(b.$$ngfValidated=!0,null==a||0===a.length)return void g.call(b);if(a=void 0===a.length?[a]:a.slice(0),h("pattern",function(a){return a.pattern},e.validatePattern),h("minSize",function(a){return a.size&&a.size.min},function(a,b){return a.size>=e.translateScalars(b)}),h("maxSize",function(a){return a.size&&a.size.max},function(a,b){return a.size<=e.translateScalars(b)}),h("validateFn",function(){return null},function(a,b){return b===!0||null===b||""===b}),!a.length)return void g.call(b,b.$ngfValidations);var k=0;i("maxHeight",function(a){return a.height&&a.height.max},/image/,this.imageDimensions,function(a,b){return a.height<=b}),i("minHeight",function(a){return a.height&&a.height.min},/image/,this.imageDimensions,function(a,b){return a.height>=b}),i("maxWidth",function(a){return a.width&&a.width.max},/image/,this.imageDimensions,function(a,b){return a.width<=b}),i("minWidth",function(a){return a.width&&a.width.min},/image/,this.imageDimensions,function(a,b){return a.width>=b}),i("ratio",function(a){return a.ratio},/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++){var f=c[e],g=f.search(/x/i);f=g>-1?parseFloat(f.substring(0,g))/parseFloat(f.substring(g+1)):parseFloat(f),Math.abs(a.width/a.height-f)<1e-4&&(d=!0)}return d}),i("maxDuration",function(a){return a.duration&&a.duration.max},/audio|video/,this.mediaDuration,function(a,b){return a<=e.translateScalars(b)}),i("minDuration",function(a){return a.duration&&a.duration.min},/audio|video/,this.mediaDuration,function(a,b){return a>=e.translateScalars(b)}),i("validateAsyncFn",function(){return null},/./,function(a,b){return b},function(a){return a===!0||null===a||""===a}),k||g.call(b,b.$ngfValidations)},e.imageDimensions=function(a){if(a.width&&a.height){var d=b.defer();return c(function(){d.resolve({width:a.width,height:a.height})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void f.reject("not image"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.width=b,a.height=c,f.resolve({width:b,height:c})}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?e():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",e);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){f.reject("load error")})}),a.$ngfDimensionPromise=f.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},e.mediaDuration=function(a){if(a.duration){var d=b.defer();return c(function(){d.resolve(a.duration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var f=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void f.reject("not media"):void e.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.duration=b,h.remove(),f.resolve(b)}function e(){h.remove(),f.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?e():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",e);var i=0;g(),angular.element(document.body).append(h)},function(){f.reject("load error")})}),a.$ngfDurationPromise=f.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},e}]),ngFileUpload.service("UploadResize",["UploadValidate","$q","$timeout",function(a,b,c){var d=a,e=function(a,b,c,d){var e=Math.min(c/a,d/b);return{width:a*e,height:b*e}},f=function(a,c,d,f,g){var h=b.defer(),i=document.createElement("canvas"),j=document.createElement("img");return 0===c&&(c=j.width,d=j.height),j.onload=function(){try{var a=e(j.width,j.height,c,d);i.width=a.width,i.height=a.height;var b=i.getContext("2d");b.drawImage(j,0,0,a.width,a.height),h.resolve(i.toDataURL(g||"image/WebP",f||1))}catch(k){h.reject(k)}},j.onerror=function(){h.reject()},j.src=a,h.promise},g=function(a){for(var b=a.split(","),c=b[0].match(/:(.*?);/)[1],d=atob(b[1]),e=d.length,f=new Uint8Array(e);e--;)f[e]=d.charCodeAt(e);return new Blob([f],{type:c})};return d.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")},d.resize=function(a,e,h,i){var j=b.defer();return 0!==a.type.indexOf("image")?(c(function(){j.resolve("Only images are allowed for resizing!")}),j.promise):(d.dataUrl(a,!0).then(function(b){f(b,e,h,i,a.type).then(function(b){var c=g(b);c.name=a.name,j.resolve(c)},function(){j.reject()})},function(){j.reject()}),j.promise)},d}]),function(){function a(a,c,d,e,f,g,h,i){function j(){return c.attr("disabled")||n("ngfDropDisabled",a)}function k(a,b,c,d){var e=n("ngfDragOverClass",a,{$event:c}),f=n("ngfDragOverClass")||"dragover";if(angular.isString(e))return void d(e);if(e&&(e.delay&&(r=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g)for(var h=n("ngfPattern",a,{$event:c}),j=0;j<g.length;j++)if("file"===g[j].kind||""===g[j].kind){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}}d(f)}function l(a,b,c,d){function e(a,b,c){if(null!=b)if(b.isDirectory){var d=(c||"")+b.name;a.push({name:b.name,type:"directory",path:d});var f=b.createReader(),g=[];i++;var h=function(){f.readEntries(function(d){try{if(d.length)g=g.concat(Array.prototype.slice.call(d||[],0)),h();else{for(var f=0;f<g.length;f++)e(a,g[f],(c?c:"")+b.name+"/");i--}}catch(j){i--,console.error(j)}},function(){i--})};h()}else i++,b.file(function(b){try{i--,b.path=(c?c:"")+b.name,a.push(b)}catch(d){i--,console.error(d)}},function(){i--})}var f=[],i=0,j=a.dataTransfer.items;if(j&&j.length>0&&"file"!==h.protocol())for(var k=0;k<j.length;k++){if(j[k].webkitGetAsEntry&&j[k].webkitGetAsEntry()&&j[k].webkitGetAsEntry().isDirectory){var l=j[k].webkitGetAsEntry();if(l.isDirectory&&!c)continue;null!=l&&e(f,l)}else{var m=j[k].getAsFile();null!=m&&f.push(m)}if(!d&&f.length>0)break}else{var n=a.dataTransfer.files;if(null!=n)for(var o=0;o<n.length&&(f.push(n.item(o)),d||!(f.length>0));o++);}var p=0;!function q(a){g(function(){if(i)10*p++<2e4&&q(10);else{if(!d&&f.length>1){for(k=0;"directory"===f[k].type;)k++;f=[f[k]]}b(f)}},a||0)}()}var m=b(),n=function(a,b,c){return i.attrGetter(a,d,b,c)};if(n("dropAvailable")&&g(function(){a[n("dropAvailable")]?a[n("dropAvailable")].value=m:a[n("dropAvailable")]=m}),!m)return void(n("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));i.registerValidators(e,null,d,a);var o,p=null,q=f(n("ngfStopPropagation")),r=1;c[0].addEventListener("dragover",function(b){if(!j()){if(b.preventDefault(),q(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(p),o||(o="C",k(a,d,b,function(a){o=a,c.addClass(o)}))}},!1),c[0].addEventListener("dragenter",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(){j()||(p=g(function(){o&&c.removeClass(o),o=null},r||1))},!1),c[0].addEventListener("drop",function(b){j()||(b.preventDefault(),q(a)&&b.stopPropagation(),o&&c.removeClass(o),o=null,l(b,function(c){i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)},n("ngfAllowDir",a)!==!1,n("multiple")||n("ngfMultiple",a)))},!1),c[0].addEventListener("paste",function(b){if(!j()){var c=[],f=b.clipboardData||b.originalEvent.clipboardData;if(f&&f.items){for(var g=0;g<f.items.length;g++)-1!==f.items[g].type.indexOf("image")&&c.push(f.items[g].getAsFile());i.updateModel(e,d,a,n("ngfChange")||n("ngfDrop"),c,b)}}},!1)}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload",function(b,c,d,e){return{restrict:"AEC",require:"?ngModel",link:function(f,g,h,i){a(f,g,h,i,b,c,d,e)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZy5qcyIsImFsZXJ0cy9hbGVydC5tb2R1bGUuanMiLCJjb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImZlbGxvd3MvZmVsbG93cy5tb2R1bGUuanMiLCJob21lL2hvbWUubW9kdWxlLmpzIiwicHJvZmlsZS9wcm9maWxlLm1vZHVsZS5qcyIsInRhZ3MvdGFncy5tb2R1bGUuanMiLCJ2b3Rlcy92b3Rlcy5tb2R1bGUuanMiLCJhbGVydHMvY29udHJvbGxlci9hbGVydC5jb250cm9sbGVyLmpzIiwiYWxlcnRzL3NlcnZpY2VzL2FsZXJ0LnNlcnZpY2UuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFuaWVzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFueS5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiY29tcGFuaWVzL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3cuY29udHJvbGxlci5qcyIsImZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93cy5jb250cm9sbGVyLmpzIiwiZmVsbG93cy9kaXJlY3RpdmVzL2ZlbGxvd0NhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9zZXJ2aWNlcy9mZWxsb3dzLnNlcnZpY2UuanMiLCJob21lL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvYWRtaW5Qcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2NvbXBhbnlQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL2ZlbGxvd3NQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJwcm9maWxlL2NvbnRyb2xsZXJzL3Byb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvc2VydmljZXMvczMuc2VydmljZS5qcyIsInByb2ZpbGUvc2VydmljZXMvdXNlci5zZXJ2aWNlLmpzIiwidGFncy9jb250cm9sbGVycy90YWdzLmNvbnRyb2xsZXIuanMiLCJ0YWdzL3NlcnZpY2VzL3RhZ3Muc2VydmljZS5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2FkbWluVm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL2NvbXBhbnlWb3Rlcy5jb250cm9sbGVyLmpzIiwidm90ZXMvY29udHJvbGxlcnMvZmVsbG93Vm90ZXMuY29udHJvbGxlci5qcyIsInZvdGVzL2NvbnRyb2xsZXJzL3ZvdGVzLmNvbnRyb2xsZXIuanMiLCJ2b3Rlcy9zZXJ2aWNlcy92b3Rlcy5zZXJ2aWNlLmpzIiwibmctZmlsZS11cGxvYWQubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogYXBwLnJvdXRlc1xuICogQGRlc2MgICAgY29udGFpbnMgdGhlIHJvdXRlcyBmb3IgdGhlIGFwcFxuICovXG5cbiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICduZ0ZpbGVVcGxvYWQnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnLCAndWkuc2VsZWN0JyxcbiAgICAnYXBwLmNvbmZpZycsICdhcHAuaG9tZScsICdhcHAuY29tcGFuaWVzJywgJ2FwcC5mZWxsb3dzJywgJ2FwcC50YWdzJywgJ2FwcC5wcm9maWxlJywgJ2FwcC52b3RlcycsICdhcHAuYWxlcnQnIF0pXG4gICAgLnJ1bihydW4pO1xuXG4vKipcbiAqICAgKiBAbmFtZSBjb25maWdcbiAqICAgICAqIEBkZXNjIERlZmluZSB2YWxpZCBhcHBsaWNhdGlvbiByb3V0ZXNcbiAqICAgICAgICovXG4gYXBwLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpe1xuXG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAud2hlbignLycsIHtcbiAgICAgICAgY29udHJvbGxlciAgOiAnSG9tZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybCA6ICdzb3VyY2UvYXBwL2hvbWUvaG9tZS5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9mZWxsb3dzJywge1xuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9mZWxsb3dzLmh0bWwnXG4gICAgfSlcbiAgICAud2hlbignL2ZlbGxvd3MvOmZlbGxvd19pZC86ZmVsbG93X25hbWUnLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2ZlbGxvd3MvZmVsbG93Lmh0bWwnXG4gICAgfSlcbiAgICAud2hlbignL2NvbXBhbmllcycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL2NvbXBhbmllcy5odG1sJ1xuICAgIH0pXG4gICAgLndoZW4oJy9jb21wYW5pZXMvOmNvbXBhbnlfaWQvOmNvbXBhbnlfbmFtZScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW55Lmh0bWwnXG4gICAgfSlcblxuICAgIC53aGVuKCcvdGFncycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ1RhZ3NDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3RhZ3MvdGFncy5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZScsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ1Byb2ZpbGVDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcHJvZmlsZS5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcblxuICAgIC53aGVuKCcvcHJvZmlsZS9hZG1pbicsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi1wcm9maWxlLmh0bWwnLFxuICAgICAgICByZXNvbHZlOiB7IGxvZ2dlZEluOiBjaGVja0xvZ2dlZGluIH1cbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2ZlbGxvdy1wcm9maWxlLmh0bWwnLFxuICAgICAgICByZXNvbHZlOiB7IGxvZ2dlZEluOiBjaGVja0xvZ2dlZGluIH1cbiAgICB9KVxuXG4gICAgLndoZW4oJy9wcm9maWxlL2NvbXBhbnknLCB7XG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW55UHJvZmlsZUNvbnRyb2xsZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9jb21wYW55LXByb2ZpbGUuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG5cbiAgICAud2hlbiggJy92b3RlcycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ1ZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy92b3Rlcy5odG1sJyxcbiAgICAgICAgcmVzb2x2ZTogeyBsb2dnZWRJbjogY2hlY2tMb2dnZWRpbiB9XG4gICAgfSlcblxuICAgIC53aGVuKCAnL3ZvdGVzL2ZlbGxvdycsIHtcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd1ZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy9mZWxsb3ctdm90ZXMuaHRtbCcsXG4gICAgICAgIHJlc29sdmU6IHsgbG9nZ2VkSW46IGNoZWNrTG9nZ2VkaW4gfVxuICAgIH0pXG5cbiAgICAud2hlbiggJy92b3Rlcy9jb21wYW55Jywge1xuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVZvdGVzQ29udHJvbGxlcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC92b3Rlcy9wYXJ0aWFscy9jb21wYW55LXZvdGVzLmh0bWwnLFxuICAgICAgICByZXNvbHZlOiB7IGxvZ2dlZEluOiBjaGVja0xvZ2dlZGluIH1cbiAgICB9KVxuXG4gICAgLm90aGVyd2lzZSh7IHJlZGlyZWN0VG86ICcvJyB9KTtcblxufSk7XG5cbi8vIE9uIHBhdGhzIHRoYXQgcmVxdWlyZSBsb2dpbiwgbWFrZSBzdXJlIHRoZSBsb2dpbiBpcyBjb25maXJtZWQgYmVmb3JlIHRoZSByb3V0ZSBpcyBsb2FkZWQuXG52YXIgY2hlY2tMb2dnZWRpbiA9IGZ1bmN0aW9uKCRxLCAkdGltZW91dCwgJGh0dHAsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgQ09ORklHLCBVc2VyKXtcblxuICAgIC8vIEluaXRpYWxpemUgYSBuZXcgcHJvbWlzZVxuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAvLyBrZWVwIHVzZXIgbG9nZ2VkIGluIGFmdGVyIHBhZ2UgcmVmcmVzaFxuICAgIC8vIENoZWNrIGJhY2tlbmQgZm9yIGV4aXN0aW5nIHVzZXIgaW4gc2Vzc2lvbiBhbmQgdXBkYXRlIFVzZXIgU2VydmljZVxuICAgICRodHRwLmdldCggQ09ORklHLlNFUlZJQ0VfVVJMICsgJy9hcGkvdjEvdXNlcnMvY29uZmlybS1sb2dpbicgKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAodXNlcikge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB1c2VyICk7XG5cbiAgICAgICAgICAgIGlmICh1c2VyICYmIHVzZXIuaWQpIHtcblxuICAgICAgICAgICAgICAgIFVzZXIuU2V0Q3JlZGVudGlhbHMoIHVzZXIuaWQsIHVzZXIuZW1haWwsIHVzZXIudXNlclR5cGUgKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnVybCgnLycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5hcHAuY29udHJvbGxlcignUm91dGluZ0NvbnRyb2xsZXInLCBSb3V0aW5nQ29udHJvbGxlcilcbi5jb250cm9sbGVyKCdMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XG5cblJvdXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnJHdpbmRvdycsICdVc2VyJywgJyRsb2NhdGlvbicsICckYW5jaG9yU2Nyb2xsJ107XG5Mb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJ107XG5cbmZ1bmN0aW9uIFJvdXRpbmdDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCAkd2luZG93LCBVc2VyLCAkbG9jYXRpb24sICRhbmNob3JTY3JvbGwpIHtcblxuICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IGZhbHNlO1xuICAgIHVwZGF0ZUxvZ2luU3RhdHVzKCk7XG5cbiAgICAkc2NvcGUuc2Nyb2xsVG8gPSBmdW5jdGlvbihpZCl7XG5cbiAgICAgICAgJGxvY2F0aW9uLmhhc2goaWQpO1xuICAgICAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUxvZ2luU3RhdHVzKCl7XG5cbiAgICAgICAgJHNjb3BlLmlzVXNlckxvZ2dlZEluID0gVXNlci5pc1VzZXJMb2dnZWRJbigpO1xuICAgICAgICAkc2NvcGUuaXNVc2VyQWRtaW4gPSBVc2VyLmlzVXNlckFkbWluKCk7XG4gICAgICAgICRzY29wZS5pc1VzZXJGZWxsb3cgPSBVc2VyLmlzVXNlckZlbGxvdygpO1xuICAgICAgICAkc2NvcGUuaXNVc2VyQ29tcGFueSA9IFVzZXIuaXNVc2VyQ29tcGFueSgpO1xuICAgIH1cblxuICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9sb2dpbi1wYWdlLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgc2l6ZTogJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB1cGRhdGVMb2dpblN0YXR1cygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLiRvbignbG9naW5TdGF0dXNDaGFuZ2VkJywgdXBkYXRlTG9naW5TdGF0dXMpO1xuXG4gICAgJHNjb3BlLmxvZ291dFVzZXIgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIFVzZXIuQ2xlYXJDcmVkZW50aWFscygpO1xuXG4gICAgICAgICRzY29wZS5pc1VzZXJMb2dnZWRJbiA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaXNVc2VyQWRtaW4gPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmlzVXNlckZlbGxvdyA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaXNVc2VyQ29tcGFueSA9IGZhbHNlO1xuXG4gICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlcikge1xuXG4gICAgLy8gc2F2ZSB0aGlzIHRocm91Z2ggYSByZWZyZXNoXG4gICAgJHNjb3BlLmxvZ2luRm9ybSA9IHtcblxuICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgcGFzc3dvcmQ6IFwiXCIsXG4gICAgICAgIGVycm9yczogW11cbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24obG9naW5Gb3JtKSB7XG5cbiAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMgPSBbXTtcblxuICAgICAgICBVc2VyLmxvZ2luKGxvZ2luRm9ybSkuc3VjY2VzcyhmdW5jdGlvbiggZGF0YSApe1xuXG4gICAgICAgICAgICBpZiggZGF0YS5zdWNjZXNzICl7XG5cbiAgICAgICAgICAgICAgICB2YXIgdXNlciA9IGRhdGEudXNlcjtcblxuICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cbiAgICAgICAgICAgICAgICBVc2VyLlNldENyZWRlbnRpYWxzKCB1c2VyLmlkLCB1c2VyLmVtYWlsLCB1c2VyLnVzZXJUeXBlICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvZ2luRm9ybS5lcnJvcnMucHVzaCggXCJJbnZhbGlkIHVzZXIgY3JlZGVudGlhbHNcIiApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pLmVycm9yKCBmdW5jdGlvbihlcnJvcil7XG5cbiAgICAgICAgICAgICRzY29wZS5sb2dpbkZvcm0uZXJyb3JzLnB1c2goIFwiSW52YWxpZCB1c2VyIGNyZWRlbnRpYWxzXCIgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgfTtcbn1cblxuXG5ydW4uJGluamVjdCA9IFsnJGh0dHAnLCAnVXNlcicsICdDT05GSUcnXTtcbmZ1bmN0aW9uIHJ1bigkaHR0cCwgVXNlciwgQ09ORklHICl7XG5cblxuXG59XG5cblxuLyoqXG4gKiBIZWxwZXIgRnVuY3Rpb25zXG4gKiovXG5cbnZhciBIRkhlbHBlcnMgPSBIRkhlbHBlcnMgfHwge307XG5cbkhGSGVscGVycy5oZWxwZXJzID0ge1xuXG4gICAgc2x1Z2lmeTogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc3RyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgJy0nKSAgICAgICAgICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCAtXG4gICAgICAgICAgICAucmVwbGFjZSgvW15cXHdcXC1dKy9nLCAnJykgICAgICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyc1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLVxcLSsvZywgJy0nKSAgICAgICAgIC8vIFJlcGxhY2UgbXVsdGlwbGUgLSB3aXRoIHNpbmdsZSAtXG4gICAgICAgICAgICAucmVwbGFjZSgvXi0rLywgJycpICAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIHN0YXJ0IG9mIHRleHRcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tKyQvLCAnJyk7ICAgICAgICAgICAgLy8gVHJpbSAtIGZyb20gZW5kIG9mIHRleHRcbiAgICB9LFxuXG4gICAgcGFyYWdyYXBoaXplOiBmdW5jdGlvbiggc3RyICkge1xuXG4gICAgICAgIGlmKCB0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyApIHJldHVybiAnJztcblxuICAgICAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoIFwiXFxuXCIgKTtcbiAgICAgICAgcmV0dXJuICggcGFydHMubGVuZ3RoID4gMCA/ICc8cD4nICsgcGFydHMuam9pbignPC9wPjxwPicpICsgJzwvcD4nIDogJycgKTtcbiAgICB9XG59O1xuXG5hcHAuZmlsdGVyKFwic2FuaXRpemVcIiwgWyckc2NlJywgZnVuY3Rpb24oJHNjZSkge1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGh0bWxDb2RlKXtcblxuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChodG1sQ29kZSk7XG4gICAgfTtcbn1dKTtcblxuYXBwLmZpbHRlcigncHJvcHNGaWx0ZXInLCBmdW5jdGlvbigpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbihpdGVtcywgcHJvcHMpIHtcblxuICAgICAgICB2YXIgb3V0ID0gW107XG5cbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShpdGVtcykpIHtcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBwcm9wc1twcm9wXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbVtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1NYXRjaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTGV0IHRoZSBvdXRwdXQgYmUgdGhlIGlucHV0IHVudG91Y2hlZFxuICAgICAgICAgICAgb3V0ID0gaXRlbXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG59KTsiLCIvKipcbiAqIEEgcGxhY2UgdG8gcHV0IGFwcCB3aWRlIGNvbmZpZyBzdHVmZlxuICpcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2FwcC5jb25maWcnLCBbXSlcbiAgICAuY29uc3RhbnQoJ0NPTkZJRycsIHtcbiAgICAgICAgJ0FQUF9OQU1FJzogJ0hhY2tlciBGZWxsb3cgUG9ydGFsJyxcbiAgICAgICAgJ0FQUF9WRVJTSU9OJzogJzEuMCcsXG4gICAgICAgICdTRVJWSUNFX1VSTCc6ICcnXG4gICAgfSk7XG5cblxuLy92YXIgcm9vdFVybCA9ICdodHRwczovL3F1aWV0LWNvdmUtNjgzMC5oZXJva3VhcHAuY29tJztcbi8vIHZhciByb290VXJsID0gXCJodHRwczovL2JvaWxpbmctc3ByaW5ncy03NTIzLmhlcm9rdWFwcC5jb21cIjsiLCIvKipcbiAqIGFsZXJ0IG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQnLCBbXG4gICAgICAgICAgICAnYXBwLmFsZXJ0LmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICdhcHAuYWxlcnQuc2VydmljZXMnXG4gICAgICAgIF0pO1xuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hbGVydC5jb250cm9sbGVycycsIFtdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuc2VydmljZXMnLCBbXSk7XG5cblxufSkoKTtcbiIsIi8qKlxuICogY29tcGFuaWVzIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcycsIFtcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxuICAgICAgICAnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJywgW10pO1xuXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJywgW10pO1xuXG4gIC8vIGRlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIGZlbGxvd3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cycsIFtcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnXG4gICAgICAgIF0pO1xuXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycsIFtdKTtcblxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcblxuXG59KSgpO1xuIiwiLyoqXG4gKiBob21lIG1vZHVsZVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUnLCBbXG4gICAgICAgICdhcHAuaG9tZS5jb250cm9sbGVycycsXG4gICAgICAgIC8vJ2FwcC5ob21lLnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuZGlyZWN0aXZlcycsIFtdKTtcbiAgICAvL2hvdyBhYm91dCB0aGlzXG59KSgpO1xuIiwiLyoqXG4gKiBwcm9maWxlIG1vZHVsZVxuICovXG5cbiAoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJyxcbiAgICAgICAgICAgICAgJ2FwcC5wcm9maWxlLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnXG4gICAgICAgICAgICBdKTtcblxuICAgICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgICAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcbiAgICAgYW5ndWxhclxuICAgICAgICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuc2VydmljZXMnLCBbXSk7XG5cbn0pKCk7XG4iLCIvKipcbiAqIHRhZ3MgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzJywgW1xuXG4gICAgICAgICAgICAnYXBwLnRhZ3MuY29udHJvbGxlcnMnLFxuICAgICAgICAgICAgJ2FwcC50YWdzLnNlcnZpY2VzJ1xuICAgICAgICBdKTtcblxuICAgIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudGFncy5zZXJ2aWNlcycsIFtdKTtcblxuXG4gICAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLmNvbnRyb2xsZXJzJywgW10pO1xuXG5cblxufSkoKTtcbiIsIi8qKlxuICogdm90ZXMgbW9kdWxlXG4gKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMnLCBbXG5cbiAgICAgICAgICAgICdhcHAudm90ZXMuY29udHJvbGxlcnMnLFxuICAgICAgICAgICAgJ2FwcC52b3Rlcy5zZXJ2aWNlcydcbiAgICAgICAgXSk7XG5cbiAgICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzLnNlcnZpY2VzJywgW10pO1xuXG5cbiAgICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJywgW10pO1xuXG5cblxufSkoKTtcbiIsIi8qKlxuICogQWxlcnRDb250cm9sbGVyXG4gKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuYWxlcnQuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignQWxlcnRDb250cm9sbGVyJywgQWxlcnRDb250cm9sbGVyKTtcblxuICAgIEFsZXJ0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBbGVydENvbnRyb2xsZXIoICRzY29wZSwgQWxlcnQgKSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuYWxlcnQgPSBBbGVydC5hbGVydDtcblxuICAgICAgICAvLyBDbG9zZSBhbGVydCB3aW5kb3dcbiAgICAgICAgJHNjb3BlLmNsb3NlQWxlcnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICBBbGVydC5jbG9zZUFsZXJ0KCk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbn0pKCk7XG4iLCIvKipcbiAqIEFsZXJ0XG4gKiBAbmFtZXNwYWNlIGFwcC5hbGVydC5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFsZXJ0LnNlcnZpY2VzJylcbiAgICAgICAgLnNlcnZpY2UoJ0FsZXJ0JywgQWxlcnQpO1xuXG4gICAgQWxlcnQuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcblxuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIEFsZXJ0XG4gICAgICovXG4gICAgZnVuY3Rpb24gQWxlcnQoICR0aW1lb3V0ICkge1xuXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFsZXJ0OiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvd0FsZXJ0OiBmdW5jdGlvbihuZXdNZXNzYWdlLCBuZXdUeXBlKSB7XG5cbiAgICAgICAgICAgICAgICBpZiggQXJyYXkuaXNBcnJheSggbmV3TWVzc2FnZSApIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQubWVzc2FnZSA9IG5ld01lc3NhZ2Uuam9pbiggJzxiciAvPicgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGVydC5tZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnR5cGUgPSBuZXdUeXBlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQuc2hvdyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBJIHRoaW5rIHRoaXMgaXMgb2s/XG4gICAgICAgICAgICAgICAgLy8gRm9yIHNvbWUgcmVhc29uIEkgd2FudGVkIHRoZSBhbGVydCB0byBhdXRvIGNsZWFyIGFuZCBjb3VsZG4ndCBmaWd1cmUgYVxuICAgICAgICAgICAgICAgIC8vIGJldHRlciB3YXkgdG8gaGF2ZSBhIHRpbWVvdXQgYXV0b21hdGljYWxseSBjbG9zZSB0aGUgYWxlcnQuIEkgZmVlbCBsaWtlXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBzb21lIHNvcnQgb2Ygc2NvcGluZyB3ZWlyZG5lc3MgZ29pbmcgb24gaGVyZSwgYnV0IGl0IHdvcmtzIGFuZCBJXG4gICAgICAgICAgICAgICAgLy8gYW0gdGlyZWQsIHNvIGl0IGlzIGdldHRpbmcgY29tbWl0dGVkIDstcFxuICAgICAgICAgICAgICAgIHZhciBhbGVydCA9IHRoaXMuYWxlcnQ7XG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoIGZ1bmN0aW9uKCl7IGFsZXJ0LnNob3cgPSBmYWxzZTsgfSwgIDUwMDAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZUFsZXJ0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxlcnQudHlwZSA9ICdpbmZvJztcbiAgICAgICAgICAgICAgICB0aGlzLmFsZXJ0LnNob3cgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbmllc0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIENvbXBhbmllcykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICBDb21wYW5pZXMuYWxsKCkuc3VjY2VzcyhmdW5jdGlvbiAoY29tcGFuaWVzKSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wYW5pZXMgTW9kYWwgSW5zdGFuY2UgQ29udHJvbGxlclxuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsXG4gICAgICAgICdjb21wYW55JywgJ1ZvdGVzJywgJ1VzZXInXTtcblxuICAgIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFZvdGVzLCBVc2VyKSB7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFuaWVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlDb250cm9sbGVyJywgQ29tcGFueUNvbnRyb2xsZXIpO1xuXG4gICAgQ29tcGFueUNvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRyb3V0ZVBhcmFtcycsICckc2NvcGUnLCAnJHRpbWVvdXQnLCAnQ29tcGFuaWVzJywgJ1VzZXInLCAnVm90ZXMnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlDb250cm9sbGVyKCAkcm91dGVQYXJhbXMsICRzY29wZSwgJHRpbWVvdXQsIENvbXBhbmllcywgVXNlciwgVm90ZXMsIEFsZXJ0KSB7XG5cbiAgICAgICAgYWN0aXZhdGUoKTtcblxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSBbXTtcbiAgICAgICAgJHNjb3BlLnZvdGVzQ2FzdCA9IFtdO1xuICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgQ29tcGFuaWVzLmdldCggJHJvdXRlUGFyYW1zLmNvbXBhbnlfaWQgKS5zdWNjZXNzKGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcblxuICAgICAgICAgICAgVXNlci5nZXRWb3RlcyggY29tcGFueS51c2VyX2lkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSB2b3Rlcy52b3Rlc0ZvcjtcbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNDYXN0ID0gdm90ZXMudm90ZXNDYXN0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlclZvdGVkID0gZnVuY3Rpb24gY3VycmVudFVzZXJWb3RlZCgpe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8ICRzY29wZS52b3Rlc0Zvci5sZW5ndGg7IGkrKyApe1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkc2NvcGUudm90ZXNGb3JbaV07XG4gICAgICAgICAgICAgICAgaWYoIGVsZW1lbnQuaWQgPT0gJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmlzRmVsbG93ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgcmV0dXJuICggJHNjb3BlLmN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSBcIkZlbGxvd1wiKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUudm90ZSA9IGZ1bmN0aW9uIHZvdGUoY29tcGFueSkge1xuXG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuaXNGZWxsb3coKSApIHtcblxuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBWb3Rlcy5jcmVhdGUoJHNjb3BlLmN1cnJlbnRVc2VyLmlkLCBjb21wYW55LnVzZXJfaWQpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICh2b3RlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvdGU7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIEFsZXJ0LnNob3dBbGVydCggZXJyLmRhdGEsIFwiaW5mb1wiICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJylcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBjb21wYW55Q2FyZCk7XG5cblxuICAgIGZ1bmN0aW9uIGNvbXBhbnlDYXJkKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2NhcmQuaHRtbCcvKixcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuICAgICAgICAgICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0qL1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIvKipcbiogQ29tcGFuaWVzXG4qIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5zZXJ2aWNlc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycpXG4gICAgLnNlcnZpY2UoJ0NvbXBhbmllcycsIENvbXBhbmllcyk7XG5cbiAgQ29tcGFuaWVzLiRpbmplY3QgPSBbJyRodHRwJywgJ1VwbG9hZCcsICdDT05GSUcnXTtcblxuICAvKipcbiAgKiBAbmFtZXNwYWNlIENvbXBhbmllc1xuICAqL1xuICBmdW5jdGlvbiBDb21wYW5pZXMoJGh0dHAsIFVwbG9hZCwgQ09ORklHKSB7XG5cbiAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgIHJldHVybiB7XG4gICAgICBhbGw6IGFsbCxcbiAgICAgIGFsbFdpdGhVc2VyOiBhbGxXaXRoVXNlcixcbiAgICAgIGdldDogZ2V0LFxuICAgICAgZ2V0QnlVc2VySWQ6IGdldEJ5VXNlcklkLFxuICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICB1cGRhdGU6IHVwZGF0ZSxcbiAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICB9O1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIGFsbFxuICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGNvbXBhbmllc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsbCgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBhbGxcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXMgd2l0aCB0aGVpciB1c2VyIGFjY291bnQgaW5mb1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFsbFdpdGhVc2VyKCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJzJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZ2V0XG4gICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnlcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgcGFyc2VJbnQoaWQpICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBAbmFtZSBnZXRCeVVzZXJJZFxuICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnkgYnkgdXNlciBpZFxuICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QnlVc2VySWQodXNlcl9pZCkge1xuICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzL3VzZXJfaWQvJyArIHBhcnNlSW50KHVzZXJfaWQpICk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKGNvbXBhbnkpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS9jb21wYW5pZXMvJywgY29tcGFueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgdXBkYXRlXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGNvbXBhbnkgcmVjb3JkXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbXBhbnkpIHtcblxuICAgICAgLy9yZXR1cm4gVXBsb2FkLnVwbG9hZCh7XG4gICAgICAvLyAgdXJsOiByb290VXJsICsgJy9hcGkvdjEvY29tcGFuaWVzLycgKyBjb21wYW55LmlkLFxuICAgICAgLy8gIGZpZWxkczogY29tcGFueSxcbiAgICAgIC8vICBmaWxlOiBjb21wYW55LmZpbGUsXG4gICAgICAvLyAgbWV0aG9kOiAnUFVUJ1xuICAgICAgLy9cbiAgICAgIC8vfSk7XG5cbiAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgY29tcGFueS5pZCwgY29tcGFueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgZGVzdHJveVxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBjb21wYW55IHJlY29yZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nICsgaWQpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd0NvbnRyb2xsZXInLCBGZWxsb3dDb250cm9sbGVyKTtcblxuICAgIEZlbGxvd0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvdXRlUGFyYW1zJywgJyRzY29wZScsICckdGltZW91dCcsICdGZWxsb3dzJywgJ1VzZXInLCAnVm90ZXMnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dDb250cm9sbGVyKCRyb3V0ZVBhcmFtcywgJHNjb3BlLCAkdGltZW91dCwgRmVsbG93cywgVXNlciwgVm90ZXMpIHtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5oZWxwZXJzID0gSEZIZWxwZXJzLmhlbHBlcnM7XG5cbiAgICAgICAgJHNjb3BlLnZvdGVzRm9yID0gW107XG4gICAgICAgICRzY29wZS52b3Rlc0Nhc3QgPSBbXTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgIEZlbGxvd3MuZ2V0KCAkcm91dGVQYXJhbXMuZmVsbG93X2lkICkuc3VjY2VzcyhmdW5jdGlvbiAoZmVsbG93KSB7XG5cbiAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgIFVzZXIuZ2V0Vm90ZXMoIGZlbGxvdy51c2VyX2lkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNGb3IgPSB2b3Rlcy52b3Rlc0ZvcjtcbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXNDYXN0ID0gdm90ZXMudm90ZXNDYXN0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzY29wZS5jdXJyZW50VXNlclZvdGVkID0gZnVuY3Rpb24gY3VycmVudFVzZXJWb3RlZCgpe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8ICRzY29wZS52b3Rlc0Zvci5sZW5ndGg7IGkrKyApe1xuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkc2NvcGUudm90ZXNGb3JbaV07XG4gICAgICAgICAgICAgICAgaWYoIGVsZW1lbnQuaWQgPT0gJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmlzQ29tcGFueSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAoICRzY29wZS5jdXJyZW50VXNlci51c2VyVHlwZSA9PT0gXCJDb21wYW55XCIgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUudm90ZSA9IGZ1bmN0aW9uIHZvdGUoZmVsbG93KSB7XG5cbiAgICAgICAgICAgIGlmICggJHNjb3BlLmlzQ29tcGFueSgpICkge1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgVm90ZXMuY3JlYXRlKCRzY29wZS5jdXJyZW50VXNlci5pZCwgZmVsbG93LnVzZXJfaWQpXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uICh2b3RlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCB2b3RlICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2b3RlO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIitlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRmVsbG93c0NvbnRyb2xsZXInLCBGZWxsb3dzQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJ0ZlbGxvd3MnXTtcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGZWxsb3dzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgRmVsbG93cykge1xuXG4gICAgICAgIGFjdGl2YXRlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgZmVsbG93cyBjb250cm9sbGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBGZWxsb3dzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24gKGZlbGxvd3MpIHtcblxuICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKGZlbGxvdykge1xuXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19kZXRhaWxfdmlldy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZmVsbG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmVsbG93O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZWxsb3dzIE1vZGFsIEluc3RhbmNlIENvbnRyb2xsZXJcbiAgICAgKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXG4gICAgICovXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXG4gICAgICAgIC5jb250cm9sbGVyKCdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdmZWxsb3cnLFxuICAgICAgICAnVm90ZXMnLCAnVXNlcicsICckdGltZW91dCddO1xuXG4gICAgZnVuY3Rpb24gRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdywgVm90ZXMsIFVzZXIpIHtcblxuICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coZmVsbG93KTtcblxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiBvaygpIHtcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5mZWxsb3cpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcblxuICAgIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJylcbiAgICAuZGlyZWN0aXZlKCdmZWxsb3dDYXJkJywgZmVsbG93Q2FyZCk7XG5cbiAgLy9uZy1mZWxsb3ctY2FyZFxuIGZ1bmN0aW9uIGZlbGxvd0NhcmQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHRydWUsXG4gICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2ZlbGxvd3MvcGFydGlhbHMvZmVsbG93X2NhcmQuaHRtbCcvKixcbiAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgZWxlbS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICB9KTtcbiAgICAgICB9ICovXG4gICAgfTtcbiAgfVxufSkoKTtcbiIsIi8qKlxuICogRmVsbG93c1xuICogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnKVxuICAgICAgICAuc2VydmljZSgnRmVsbG93cycsIEZlbGxvd3MpO1xuXG4gICAgRmVsbG93cy4kaW5qZWN0ID0gWyckaHR0cCcsICdVcGxvYWQnLCAnQ09ORklHJ107XG5cblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1xuICAgICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3MoJGh0dHAsIFVwbG9hZCwgQ09ORklHKSB7XG5cbiAgICAgICAgdmFyIHJvb3RVcmwgPSBDT05GSUcuU0VSVklDRV9VUkw7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFsbDogYWxsLFxuICAgICAgICAgICAgYWxsV2l0aFVzZXI6IGFsbFdpdGhVc2VyLFxuICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICBnZXRCeVVzZXJJZDogZ2V0QnlVc2VySWQsXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGFsbFxuICAgICAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGwoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgZmVsbG93cyB3aXRoIHRoZWlyIHVzZXIgYWNjb3VudCBpbmZvXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhbGxXaXRoVXNlcigpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy91c2VycycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0KGlkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXRCeVVzZXJJZFxuICAgICAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvdyBieSB1c2VyX2lkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRCeVVzZXJJZCh1c2VyX2lkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvdXNlcl9pZC8nICsgdXNlcl9pZCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBjcmVhdGVcbiAgICAgICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBjcmVhdGUoZmVsbG93KSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nLCBmZWxsb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICAgKiBAZGVzYyB1cGRhdGVzIGEgZmVsbG93IHJlY29yZFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKGZlbGxvdykge1xuXG4gICAgICAgICAgICAvL3JldHVybiBVcGxvYWQudXBsb2FkKHtcbiAgICAgICAgICAgIC8vICAgIHVybDogcm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGZlbGxvdy5pZCxcbiAgICAgICAgICAgIC8vICAgIGZpZWxkczogZmVsbG93LFxuICAgICAgICAgICAgLy8gICAgZmlsZTogZmVsbG93LmZpbGUsXG4gICAgICAgICAgICAvLyAgICBtZXRob2Q6ICdQVVQnXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy99KTtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChyb290VXJsICsgJy9hcGkvdjEvZmVsbG93cy8nICsgZmVsbG93LmlkLCBmZWxsb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAgICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL2ZlbGxvd3MvJyArIGlkKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4qIEhvbWVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLmhvbWUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XG5cbiAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZlbGxvd3MnXTtcblxuICAvKipcbiAgKiBAbmFtZXNwYWNlIEhvbWVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSwgRmVsbG93cykge1xuXG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIC8vRmVsbG93cy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKGZlbGxvd3Mpe1xuICAgIC8vXG4gICAgLy8gICRzY29wZS5mZWxsb3dzID0gZmVsbG93cztcbiAgICAvL30pO1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIGhvbWUgY29udHJvbGxlciEnKTtcbiAgICAgIC8vSG9tZS5hbGwoKTtcbiAgICB9XG4gIH1cbn0pKCk7XG4iLCIvKipcbiogQWRtaW5Qcm9maWxlQ29udHJvbGxlclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXG4qL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBBZG1pblByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJG1vZGFsJywgJyR3aW5kb3cnLCAnVXNlcicsICdGZWxsb3dzJywgJ0NvbXBhbmllcyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBBZG1pblByb2ZpbGVDb250cm9sbGVyXG4gICAgICovXG4gICAgIGZ1bmN0aW9uIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sICRtb2RhbCwgJHdpbmRvdywgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgLy8gVE9ETyAtIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiByb3V0ZXMgb3Igd2l0aCBtaWRkbGV3YXJlIG9yIHNvbWUga2luZFxuICAgICAgICBpZiggIVVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIGN1cnJlbnQgdXNlciBpcyBhbiBBZG1pblxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJBZG1pblwiICl7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IFtdO1xuICAgICAgICAkc2NvcGUuY29tcGFuaWVzID0gW107XG4gICAgICAgICRzY29wZS51c2VyTGlzdExvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYoICRzY29wZS5mZWxsb3dzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIEZlbGxvd3MuYWxsV2l0aFVzZXIoKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3dzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBmZWxsb3dzO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuY29tcGFuaWVzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgIENvbXBhbmllcy5hbGxXaXRoVXNlcigpLnN1Y2Nlc3MoZnVuY3Rpb24gKGNvbXBhbmllcykge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgICRzY29wZS51c2VyTGlzdExvYWQoKTtcblxuXG4gICAgICAgICRzY29wZS5mZWxsb3dWb3RlcyA9IGZ1bmN0aW9uKCBmZWxsb3cgKXtcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9mZWxsb3ctdm90ZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdzogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnlWb3RlcyA9IGZ1bmN0aW9uKCBjb21wYW55ICl7XG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vY29tcGFueS12b3Rlcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcGFueTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHNob3cgc3VjY2Vzcy9mYWlsdXJlXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZWRpdEZlbGxvdyA9IGZ1bmN0aW9uKGZlbGxvdyl7XG5cbiAgICAgICAgICAgIC8vIHNlbmQgdXNlciBkYXRhIHRvIHNlcnZpY2VcblxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG5cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9lZGl0LWZlbGxvdy1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdFZGl0RmVsbG93TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmVsbG93O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuZWRpdENvbXBhbnk9IGZ1bmN0aW9uKGNvbXBhbnkpe1xuXG4gICAgICAgICAgICAvLyBzZW5kIHVzZXIgZGF0YSB0byBzZXJ2aWNlXG5cbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4vZWRpdC1jb21wYW55LWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBjb21wYW55OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gQFRPRE8gLSBJbXBsZW1lbnQgTGF0ZXJcbiAgICAgICAgJHNjb3BlLmFyY2hpdmVGZWxsb3cgPSBmdW5jdGlvbih1c2VyKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBcmNoaXZlIFVzZXI6IFwiK3VzZXIuaWQpO1xuICAgICAgICAgICAgLy8gc2VuZCB1c2VyIGRhdGEgdG8gc2VydmljZVxuXG4gICAgICAgICAgICAvLyBzaG93IHN1Y2Nlc3MvZmFpbHVyZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyogQ3JlYXRlIFVzZXIgKi9cbiAgICAgICAgJHNjb3BlLmNyZWF0ZVVzZXIgPSBmdW5jdGlvbiAodXNlcikge1xuXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi9uZXctdXNlci1mb3JtLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbiggZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG5ld0l0ZW0gPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgaWYoIG5ld0l0ZW0udXNlci51c2VyVHlwZSA9PT0gJ0ZlbGxvdycgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZlbGxvd3MudW5zaGlmdCggbmV3SXRlbSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKCBuZXdJdGVtLnVzZXIudXNlclR5cGUgPT09ICdDb21wYW55JyApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFuaWVzLnVuc2hpZnQoIG5ld0l0ZW0gKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5yZW1vdmVGZWxsb3cgPSBmdW5jdGlvbiggZmVsbG93ICl7XG5cbiAgICAgICAgICAgIHZhciBjID0gY29uZmlybSggXCJBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIFwiICsgZmVsbG93LmZpcnN0X25hbWUgKyBcIiBcIiArIGZlbGxvdy5sYXN0X25hbWUgKyBcIj9cIik7XG5cbiAgICAgICAgICAgIGlmKCBjICl7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZmVsbG93XG4gICAgICAgICAgICAgICAgRmVsbG93cy5kZXN0cm95KCBmZWxsb3cuaWQgKS50aGVuKCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdyByZW1vdmUgdXNlclxuICAgICAgICAgICAgICAgICAgICBVc2VyLmRlc3Ryb3koIGZlbGxvdy51c2VyX2lkKS50aGVuKCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZWxvYWQgdXNlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5yZW1vdmVDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnkgKXtcblxuICAgICAgICAgICAgdmFyIGMgPSBjb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgXCIgKyBjb21wYW55Lm5hbWUgKyBcIj9cIik7XG5cbiAgICAgICAgICAgIGlmKCBjICl7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgY29tcGFueVxuICAgICAgICAgICAgICAgIENvbXBhbmllcy5kZXN0cm95KCBjb21wYW55LmlkICkudGhlbiggZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyBub3cgcmVtb3ZlIHVzZXJcbiAgICAgICAgICAgICAgICAgICAgVXNlci5kZXN0cm95KCBjb21wYW55LnVzZXJfaWQpLnRoZW4oIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbG9hZCB1c2Vyc1xuICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBNb2RhbCBJbnN0YW5jZSBDb250cm9sbGVyc1xuICAgICAqIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3MuY29udHJvbGxlcnNcbiAgICAgKi9cblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignRWRpdENvbXBhbnlNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEVkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDcmVhdGVVc2VyTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21wYW55Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxuICAgICAgICAuY29udHJvbGxlcignRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xuXG4gICAgRWRpdEZlbGxvd01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdmZWxsb3cnLCAnVXNlcicsICdGZWxsb3dzJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRGZWxsb3dNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93LCBVc2VyLCBGZWxsb3dzKSB7XG5cbiAgICAgICAgJHNjb3BlLnVzZXIgPSBmZWxsb3cudXNlcjtcbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcblxuICAgICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICQoXCJbbmFtZT0nZW5hYmxlZCddXCIpLmJvb3RzdHJhcFN3aXRjaCh7XG5cbiAgICAgICAgICAgICAgICBvblRleHQ6IFwiVmlzaWJsZVwiLFxuICAgICAgICAgICAgICAgIG9mZlRleHQ6IFwiSGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgc3RhdGU6ICRzY29wZS5mZWxsb3cuZW5hYmxlZCxcbiAgICAgICAgICAgICAgICBvblN3aXRjaENoYW5nZTogZnVuY3Rpb24gKGV2ZW50LCBzdGF0ZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3cuZW5hYmxlZCA9ICggc3RhdGUgKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICBVc2VyLnVwZGF0ZSgkc2NvcGUudXNlcikudGhlbihmdW5jdGlvbihuZXdVc2VyKXtcblxuICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IG5ld1VzZXI7XG5cbiAgICAgICAgICAgICAgICAvLyB1c2VyIGlzIHVwZGF0ZWQsIHNvIG5vdyB1cGRhdGUgZmVsbG93XG4gICAgICAgICAgICAgICAgRmVsbG93cy51cGRhdGUoICRzY29wZS5mZWxsb3cgKS50aGVuKGZ1bmN0aW9uKG5ld0ZlbGxvdyl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmVsbG93ID0gbmV3RmVsbG93O1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBmZWxsb3dcIiBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIGZlbGxvd1wiIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBFZGl0Q29tcGFueU1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55JywgJ1VzZXInLCAnQ29tcGFuaWVzJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRDb21wYW55TW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnksIFVzZXIsIENvbXBhbmllcykge1xuXG4gICAgICAgICRzY29wZS51c2VyID0gY29tcGFueS51c2VyO1xuICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG5cbiAgICAgICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAkKFwiW25hbWU9J2VuYWJsZWQnXVwiKS5ib290c3RyYXBTd2l0Y2goe1xuXG4gICAgICAgICAgICAgICAgb25UZXh0OiBcIlZpc2libGVcIixcbiAgICAgICAgICAgICAgICBvZmZUZXh0OiBcIkhpZGRlblwiLFxuICAgICAgICAgICAgICAgIHN0YXRlOiAkc2NvcGUuY29tcGFueS5lbmFibGVkLFxuICAgICAgICAgICAgICAgIG9uU3dpdGNoQ2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQsIHN0YXRlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkuZW5hYmxlZCA9ICggc3RhdGUgKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICBVc2VyLnVwZGF0ZSgkc2NvcGUudXNlcikudGhlbiggZnVuY3Rpb24oIG5ld1VzZXIgKXtcblxuICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IG5ld1VzZXI7XG5cbiAgICAgICAgICAgICAgICBDb21wYW5pZXMudXBkYXRlKCRzY29wZS5jb21wYW55KS50aGVuKCBmdW5jdGlvbiggbmV3Q29tcGFueSApe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBuZXdDb21wYW55O1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG5cbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBbIFwiVGhlcmUgd2FzIGFuIGVycm9yIHVwZGF0aW5nIHRoZSBjb21wYW55XCIgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIGNvbXBhbnlcIiBdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS51c2VyKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgRmVsbG93Vm90ZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnZmVsbG93JyBdO1xuICAgIGZ1bmN0aW9uIEZlbGxvd1ZvdGVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoICRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdyApe1xuXG4gICAgICAgICRzY29wZS51c2VyID0gZmVsbG93LnVzZXI7XG4gICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgLy8gQ2hlY2sgZmVsbG93IFZvdGVzRm9yIHRvIHNlZSBpZiBhIGNvbXBhbnkgdm90ZWQgZm9yIGEgZmVsbG93XG4gICAgICAgICRzY29wZS5jb21wYW55Vm90ZWRGb3JGZWxsb3cgPSBmdW5jdGlvbiggY29tcGFueV91c2VyX2lkICl7XG5cbiAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgZmVsbG93LnVzZXIuVm90ZXNGb3IubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gZmVsbG93LnVzZXIuVm90ZXNGb3JbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0Nhc3QgdG8gc2VlIGlmIHRoZXkgdm90ZWQgZm9yIGEgY29tcGFueVxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZWRGb3JDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGZlbGxvdy51c2VyLlZvdGVzQ2FzdC5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBmZWxsb3cudXNlci5Wb3Rlc0Nhc3RbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uIG9rKCkge1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55JyBdO1xuICAgIGZ1bmN0aW9uIENvbXBhbnlWb3Rlc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCAkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55ICl7XG5cbiAgICAgICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0Nhc3QgdG8gc2VlIGlmIHRoZXkgdm90ZWQgZm9yIGEgY29tcGFueVxuICAgICAgICAkc2NvcGUuZmVsbG93Vm90ZWRGb3JDb21wYW55ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbXBhbnkudXNlci5Wb3Rlc0Zvci5sZW5ndGg7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHZvdGUgPSBjb21wYW55LnVzZXIuVm90ZXNGb3JbaV07XG5cbiAgICAgICAgICAgICAgICBpZiggdm90ZS5pZCA9PT0gY29tcGFueV91c2VyX2lkIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENoZWNrIGZlbGxvdyBWb3Rlc0ZvciB0byBzZWUgaWYgYSBjb21wYW55IHZvdGVkIGZvciBhIGZlbGxvd1xuICAgICAgICAkc2NvcGUuY29tcGFueVZvdGVkRm9yRmVsbG93ID0gZnVuY3Rpb24oIGNvbXBhbnlfdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IGNvbXBhbnkudXNlci5Wb3Rlc0Nhc3QubGVuZ3RoOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciB2b3RlID0gY29tcGFueS51c2VyLlZvdGVzQ2FzdFtpXTtcblxuICAgICAgICAgICAgICAgIGlmKCB2b3RlLmlkID09PSBjb21wYW55X3VzZXJfaWQgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgQ3JlYXRlVXNlck1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdVc2VyJywgJ0ZlbGxvd3MnLCAnQ29tcGFuaWVzJyBdO1xuICAgIGZ1bmN0aW9uIENyZWF0ZVVzZXJNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgVXNlciwgRmVsbG93cywgQ29tcGFuaWVzKSB7XG5cbiAgICAgICAgJHNjb3BlLnZlcmlmeV9wYXNzd29yZCA9IFwiXCI7XG5cbiAgICAgICAgJHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uICh1c2VyKXtcblxuICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFtdO1xuXG4gICAgICAgICAgICAvLyBGb3JtIGlzIGJlaW5nIHZhbGlkYXRlZCBieSBhbmd1bGFyLCBidXQgbGVhdmluZyB0aGlzIGp1c3QgaW4gY2FzZVxuICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyICA9PT0gXCJ1bmRlZmluZWRcIil7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIFwiQWRkIHNvbWUgZGF0YSBmaXJzdFwiICk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyLmVtYWlsID09PSBcInVuZGVmaW5lZFwiICkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggXCJFbnRlciBhbiBlbWFpbFwiICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB1c2VyLnBhc3N3b3JkID09PSBcInVuZGVmaW5lZFwiICkge1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggXCJFbnRlciBhIHBhc3N3b3JkXCIgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHVzZXIudXNlclR5cGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycy5wdXNoKCBcIkNob29zZSBhIHVzZXIgdHlwZVwiICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoIHVzZXIucGFzc3dvcmQgIT09ICRzY29wZS52ZXJpZnlfcGFzc3dvcmQgKXtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzLnB1c2goIFwiUGFzc3dvcmRzIGRvIG5vdCBtYXRjaFwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmKCAkc2NvcGUuZXJyb3JzLmxlbmd0aCA9PT0gMCApe1xuXG4gICAgICAgICAgICAgICAgLy8gc2VuZCB1c2VyIHRvIEFQSSB2aWEgU2VydmljZVxuICAgICAgICAgICAgICAgIFVzZXIuY3JlYXRlKHVzZXIpLnRoZW4oIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHVzZXIgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggdXNlciApO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2VyX2lkID0gcmVzcG9uc2UuZGF0YS5pZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJGZWxsb3dcIiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmVsbG93X3Bvc3QgPSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiB1c2VyX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgRmVsbG93cy5jcmVhdGUoZmVsbG93X3Bvc3QpLnRoZW4oIGZ1bmN0aW9uKCBmZWxsb3cgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBmZWxsb3cgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBmZWxsb3cgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSggZmVsbG93ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZlbGxvdyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXNwb25zZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggcmVzcG9uc2UuZGF0YS5lcnJvciApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggdXNlci51c2VyVHlwZSA9PT0gXCJDb21wYW55XCIgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhbnlfcG9zdCA9IHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcl9pZDogdXNlcl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbXBhbmllcy5jcmVhdGUoY29tcGFueV9wb3N0KS50aGVuKCBmdW5jdGlvbiggY29tcGFueSApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGNvbXBhbnkgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCBjb21wYW55ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGZlbGxvdyBlcnJvciBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCByZXNwb25zZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggcmVzcG9uc2UuZGF0YS5lcnJvciApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB1c2VyIGVycm9yIGNhbGxiYWNrXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHJlc3BvbnNlICk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMucHVzaCggcmVzcG9uc2UuZGF0YS5lcnJvciApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uIGNhbmNlbCgpIHtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgICAgIH07XG5cblxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuKiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgICAuY29udHJvbGxlcignQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJywgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyKTtcblxuICAgIENvbXBhbnlQcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ0NvbXBhbmllcycsICdVc2VyJywgJ1RhZ3MnLCAnQWxlcnQnXTtcblxuICAgIC8qKlxuICAgICogQG5hbWVzcGFjZSBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgQ29tcGFuaWVzLCBVc2VyLCBUYWdzLCBBbGVydCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgICAgIC8vIFByb2JhYmx5IGNhbiBoYW5kbGUgdGhpcyBpbiB0aGUgcm91dGVzIG9yIHdpdGggbWlkZGxld2FyZSBvZiBzb21lIGtpbmRcbiAgICAgICAgaWYoICFVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICAgIC8vJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnRhZ1RyYW5zZm9ybSA9IGZ1bmN0aW9uIChuZXdUYWcpIHtcblxuICAgICAgICAgICAgdmFyIHRhZyA9IHtcblxuICAgICAgICAgICAgICAgIG5hbWU6IG5ld1RhZ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYWtlIHN1cmUgY3VycmVudCB1c2VyIGlzIGEgQ29tcGFueVxuICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgIGlmKCBjdXJyZW50VXNlci51c2VyVHlwZSAhPT0gXCJDb21wYW55XCIgKXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50YWdzID0gW107XG4gICAgICAgIGZ1bmN0aW9uIGdldENvbXBhbnkoKSB7XG5cbiAgICAgICAgICAgIHZhciBjdXJyZW50VXNlciA9IFVzZXIuZ2V0Q3VycmVudFVzZXIoKTtcblxuICAgICAgICAgICAgQ29tcGFuaWVzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uIChjb21wYW55KSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICRzY29wZS5jb21wYW55ICk7XG5cbiAgICAgICAgICAgICAgICAkKFwiW25hbWU9J2VuYWJsZWQnXVwiKS5ib290c3RyYXBTd2l0Y2goe1xuXG4gICAgICAgICAgICAgICAgICAgIG9uVGV4dDogXCJWaXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIG9mZlRleHQ6IFwiSGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBjb21wYW55LmVuYWJsZWQsXG4gICAgICAgICAgICAgICAgICAgIG9uU3dpdGNoQ2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQsIHN0YXRlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhbnkuZW5hYmxlZCA9ICggc3RhdGUgKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoZnVuY3Rpb24gKHRhZ3MpIHtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGFncyA9IHRhZ3M7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXRDb21wYW55KCk7XG4gICAgICAgIC8vJHNjb3BlLiRvbiggJ2xvZ2luU3RhdHVzQ2hhbmdlZCcsICBnZXRDb21wYW55KTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdhY3RpdmF0ZWQgcHJvZmlsZSBjb250cm9sbGVyIScpO1xuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGNvbXBhbnkpIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggY29tcGFueS50YWdzICk7XG5cbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgY29tcGFueS5iaW8gIT0gJ3VuZGVmaW5lZCcgJiYgY29tcGFueS5iaW8gIT09IG51bGwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChjb21wYW55LmJpby5sZW5ndGggPiAzNTApIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KFwiI2Jpb1wiKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJUaGUgYmlvIGZpZWxkIGNhbiBvbmx5IGJlIDM1MCBjaGFyYWN0ZXJzIG1heGltdW1cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIiNiaW9cIikucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggZXJyb3JzLmxlbmd0aCAgPT09IDAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIHNlbmQgY29tcGFuaWVzIGluZm8gdG8gQVBJIHZpYSBTZXJ2aWNlXG4gICAgICAgICAgICAgICAgQ29tcGFuaWVzLnVwZGF0ZShjb21wYW55KS5zdWNjZXNzKGZ1bmN0aW9uIChuZXdDb21wYW55RGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICoqIFRyaWdnZXIgU3VjY2VzcyBtZXNzYWdlIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY29tcGFueSA9IG5ld0NvbXBhbnlEYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZGUgdXBkYXRlIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgQWxlcnQuc2hvd0FsZXJ0KCdZb3VyIHByb2ZpbGUgaGFzIGJlZW4gdXBkYXRlZCcsICdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWxlcnQuc2hvd0FsZXJ0KCBlcnJvcnMsICdlcnJvcicgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiogUzMgRmlsZSB1cGxvYWRpbmcgKiovXG4gICAgICAgICRzY29wZS5nZXRTM0tleSA9IGZ1bmN0aW9uKCl7XG5cblxuICAgICAgICAgICAgdmFyIGZpbGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlX2lucHV0XCIpLmZpbGVzO1xuICAgICAgICAgICAgdmFyIGZpbGUgPSBmaWxlc1swXTtcblxuICAgICAgICAgICAgaWYoZmlsZSA9PT0gbnVsbCl7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIk5vIGZpbGUgc2VsZWN0ZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGdldF9zaWduZWRfcmVxdWVzdChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRfc2lnbmVkX3JlcXVlc3QoZmlsZSl7XG5cbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgLy8gVHJ5aW5nIHRvIHByZXZlbnQgbmFtaW5nIGNvbGxpc2lvbnMgYnkgYXBwZW5kaW5nIHRoZSB1bmlxdWUgdXNlcl9pZCB0byBmaWxlIG5hbWVcbiAgICAgICAgICAgIC8vIC0tIHJlbW92ZSBhbmQgc2F2ZSB0aGUgZXh0ZW5zaW9uIC0gc2hvdWxkIGJlIHRoZSBsYXN0IHBhcnRcbiAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICB2YXIgcGllY2VzID0gZmlsZS5uYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIHZhciBleHRlbnNpb24gPSBwaWVjZXMucG9wKCk7XG4gICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gcGllY2VzLmpvaW4oXCIuXCIpICsgXCItXCIgKyAkc2NvcGUuY29tcGFueS51c2VyX2lkICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGUgPT09IDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRfZmlsZShmaWxlLCByZXNwb25zZS5zaWduZWRfcmVxdWVzdCwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBnZXQgc2lnbmVkIFVSTC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZF9maWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG5cbiAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZGluZ1wiKS5zaG93KCk7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgU2V0IGltYWdlIHByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgY29tcGFueSBtb2RlbFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tcGFueS5pbWFnZV91cmwgPSB1cmw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQW5ndWxhciBpcyB3ZWlyZCB3aGVuIHVwZGF0aW5nIGltYWdlcyB0aGF0IHN0YXJ0ZWQgd2l0aCBhbiBlbXB0eSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZpbmcgbmctaGlkZSB0byBmb3JjZSB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcmV2aWV3XCIpLnJlbW92ZUNsYXNzKCduZy1oaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIudXNlci1waG90b1wiKS5maW5kKFwiLnBsYWNlaG9sZGVyXCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNwcm9maWxlLXBob3RvXCIpLmZpbmQoXCIudXBsb2FkLXN0YXR1c1wiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZGluZ1wiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ291bGQgbm90IHVwbG9hZCBmaWxlLlwiKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5zZW5kKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0pKCk7XG4iLCIvKipcbiogRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcbiovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcik7XG5cbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdGZWxsb3dzJywgJ1RhZ3MnLCAnVXNlcicsICdTMycsICdBbGVydCcgXTtcblxuICAgIC8qKlxuICAgICogQG5hbWVzcGFjZSBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcbiAgICAqL1xuICAgIGZ1bmN0aW9uIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRsb2NhdGlvbiwgRmVsbG93cywgVGFncywgVXNlciwgUzMsIEFsZXJ0ICkge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgLy8gUHJvYmFibHkgY2FuIGhhbmRsZSB0aGlzIGluIHRoZSByb3V0ZXMgb3Igd2l0aCBtaWRkbGV3YXJlIG9mIHNvbWUga2luZFxuICAgICAgICBpZiggIVVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgLy8kbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUudGFnVHJhbnNmb3JtID0gZnVuY3Rpb24gKG5ld1RhZykge1xuXG4gICAgICAgICAgICB2YXIgdGFnID0ge1xuXG4gICAgICAgICAgICAgICAgbmFtZTogbmV3VGFnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjdXJyZW50IHVzZXIgaXMgYSBGZWxsb3dcbiAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgIT09IFwiRmVsbG93XCIgKXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS50YWdzID0gW107XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0RmVsbG93KCkge1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJHZXQgRmVsbG93XCIgKTtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICBGZWxsb3dzLmdldEJ5VXNlcklkKGN1cnJlbnRVc2VyLmlkKS5zdWNjZXNzKGZ1bmN0aW9uIChmZWxsb3cpIHtcblxuICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3cgPSBmZWxsb3c7XG5cbiAgICAgICAgICAgICAgICAkKFwiW25hbWU9J2VuYWJsZWQnXVwiKS5ib290c3RyYXBTd2l0Y2goe1xuXG4gICAgICAgICAgICAgICAgICAgIG9uVGV4dDogXCJWaXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIG9mZlRleHQ6IFwiSGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBmZWxsb3cuZW5hYmxlZCxcbiAgICAgICAgICAgICAgICAgICAgb25Td2l0Y2hDaGFuZ2U6IGZ1bmN0aW9uIChldmVudCwgc3RhdGUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmVsbG93LmVuYWJsZWQgPSAoIHN0YXRlICkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgVGFncy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uICh0YWdzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRhZ3MgPSB0YWdzO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBnZXRGZWxsb3coKTtcblxuICAgICAgICBhY3RpdmF0ZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcbiAgICAgICAgICAgIC8vUHJvZmlsZS5hbGwoKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGZlbGxvdywgZmlsZSkge1xuXG4gICAgICAgICAgICAvLyBUT0RPIC0gdGhlcmUgaXMgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMgZXJyb3IgY2hlY2tpbmdcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSBbXTtcbiAgICAgICAgICAgIGlmKCBmZWxsb3cuYmlvLmxlbmd0aCA+IDM1MCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCBcIiNiaW9cIiApLmFkZENsYXNzKCAnZXJyb3InICk7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goIFwiVGhlIGJpbyBmaWVsZCBjYW4gb25seSBiZSAzNTAgY2hhcmFjdGVycyBtYXhpbXVtXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCggXCIjYmlvXCIgKS5yZW1vdmVDbGFzcyggJ2Vycm9yJyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggZmVsbG93LmludGVyZXN0cy5sZW5ndGggPiAzNTAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCggXCIjaW50ZXJlc3RzXCIgKS5hZGRDbGFzcyggJ2Vycm9yJyApO1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKCBcIlRoZSBpbnRlcmVzdGluZyB0aGluZ3MgeW91IGhhdmUgY29kZWQgZmllbGQgY2FuIG9ubHkgYmUgMzUwIGNoYXJhY3RlcnMgbWF4aW11bVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoIFwiI2ludGVyZXN0c1wiICkucmVtb3ZlQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGZlbGxvdy5kZXNjcmlwdGlvbi5sZW5ndGggPiAyNSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCBcIiNkZXNjcmlwdGlvblwiICkuYWRkQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCggXCJUaGUgcGhyYXNlIGZpZWxkIGNhbiBvbmx5IGJlIDI1IGNoYXJhY3RlcnMgbWF4aW11bVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoIFwiI2Rlc2NyaXB0aW9uXCIgKS5yZW1vdmVDbGFzcyggJ2Vycm9yJyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggZmVsbG93LmFuc3dlci5sZW5ndGggPiAyNTAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCggXCIjYW5zd2VyXCIgKS5hZGRDbGFzcyggJ2Vycm9yJyApO1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKCBcIlRoZSBhbnN3ZXIgZmllbGQgY2FuIG9ubHkgYmUgMjUwIGNoYXJhY3RlcnMgbWF4aW11bVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoIFwiI2Fuc3dlclwiICkucmVtb3ZlQ2xhc3MoICdlcnJvcicgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGVycm9ycy5sZW5ndGggID09PSAwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBzZW5kIGZlbGxvd3MgaW5mbyB0byBBUEkgdmlhIFNlcnZpY2VcbiAgICAgICAgICAgICAgICBGZWxsb3dzLnVwZGF0ZShmZWxsb3cpLnN1Y2Nlc3MoZnVuY3Rpb24gKG5ld0ZlbGxvd0RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAqKiBUcmlnZ2VyIFN1Y2Nlc3MgbWVzc2FnZSBoZXJlXG4gICAgICAgICAgICAgICAgICAgIGZlbGxvdyA9IG5ld0ZlbGxvd0RhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaGlkZSB1cGRhdGUgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWQtc3RhdHVzXCIpLmhpZGUoKTtcblxuICAgICAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoJ1lvdXIgcHJvZmlsZSBoYXMgYmVlbiB1cGRhdGVkJywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICAgICBBbGVydC5zaG93QWxlcnQoIGVycm9ycywgJ2Vycm9yJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKiBTMyBGaWxlIHVwbG9hZGluZyAqKi9cbiAgICAgICAgJHNjb3BlLmdldFMzS2V5ID0gZnVuY3Rpb24oKXtcblxuXG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVfaW5wdXRcIikuZmlsZXM7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGZpbGVzWzBdO1xuXG4gICAgICAgICAgICBpZihmaWxlID09PSBudWxsKXtcblxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiTm8gZmlsZSBzZWxlY3RlZC5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0X3NpZ25lZF9yZXF1ZXN0KGZpbGUpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAvLyAtLSByZW1vdmUgYW5kIHNhdmUgdGhlIGV4dGVuc2lvbiAtIHNob3VsZCBiZSB0aGUgbGFzdCBwYXJ0XG4gICAgICAgICAgICAvLyAtLSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhbGxvdyAuIGluIHRoZSBmaWxlbmFtZSBvdXRzaWRlIG9mIGV4dGVuc2lvblxuICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICB2YXIgZXh0ZW5zaW9uID0gcGllY2VzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGZpbGVfbmFtZSA9IHBpZWNlcy5qb2luKFwiLlwiKSArIFwiLVwiICsgJHNjb3BlLmZlbGxvdy51c2VyX2lkICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiL3NpZ25fczM/ZmlsZV9uYW1lPVwiK2ZpbGVfbmFtZStcIiZmaWxlX3R5cGU9XCIrZmlsZS50eXBlKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgaWYoeGhyLnJlYWR5U3RhdGUgPT09IDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGxvYWRfZmlsZShmaWxlLCByZXNwb25zZS5zaWduZWRfcmVxdWVzdCwgcmVzcG9uc2UudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCBnZXQgc2lnbmVkIFVSTC5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZF9maWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbihcIlBVVFwiLCBzaWduZWRfcmVxdWVzdCk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG5cbiAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZGluZ1wiKS5zaG93KCk7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgU2V0IGltYWdlIHByZXZpZXdcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmV2aWV3XCIpLnNyYyA9IHVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgZmVsbG93IG1vZGVsXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mZWxsb3cuaW1hZ2VfdXJsID0gdXJsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFuZ3VsYXIgaXMgd2VpcmQgd2hlbiB1cGRhdGluZyBpbWFnZXMgdGhhdCBzdGFydGVkIHdpdGggYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92aW5nIG5nLWhpZGUgdG8gZm9yY2UgdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJldmlld1wiKS5yZW1vdmVDbGFzcygnbmctaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnVzZXItcGhvdG9cIikuZmluZChcIi5wbGFjZWhvbGRlclwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcHJvZmlsZS1waG90b1wiKS5maW5kKFwiLnVwbG9hZC1zdGF0dXNcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3Byb2ZpbGUtcGhvdG9cIikuZmluZChcIi51cGxvYWRpbmdcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB4aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIvKipcbiogUHJvZmlsZUNvbnRyb2xsZXJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xuKi9cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlciddO1xuICAvKipcbiAgKiBAbmFtZXNwYWNlIFByb2ZpbGVDb250cm9sbGVyXG4gICovXG4gIGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyKSB7XG5cbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgICB2YXIgY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAvLyByZWRpcmVjdCB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciB0eXBlXG4gICAgICAgICAgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nKSB7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJMaWtlIGEgYm9zc1wiKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9hZG1pblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdGZWxsb3cnKSB7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJMaWtlIGEgZmVsbGFcIik7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3Byb2ZpbGUvZmVsbG93XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChjdXJyZW50VXNlci51c2VyVHlwZSA9PT0gJ0NvbXBhbnknKSB7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJMaWtlIGEgY29tcGFueVwiKTtcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvcHJvZmlsZS9jb21wYW55XCIpO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgfVxuXG4gIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBTM1xuICogQG5hbWVzcGFjZSBhcHAuc2VydmljZXNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBAVE9ETyAtLSBJbXBsZW1lbnQgdGhlIFMzIHNlcnZpY2VcblxuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdTMycsIFMzKTtcblxuICAgIFMzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBTM1xuICAgICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFMzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBnZXRTM0tleTogZ2V0UzNLZXksXG4gICAgICAgICAgICB1cGxvYWRGaWxlOiB1cGxvYWRGaWxlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBHZXQgdGhlIGltYWdlIGZpbGUgYW5kIHRyaWdnZXIgcmVxdWVzdCB0byBTM1xuICAgICAgICBmdW5jdGlvbiBnZXRTM0tleSggZmlsZSwgdXNlcl9pZCApe1xuXG4gICAgICAgICAgICBpZihmaWxlICE9PSBudWxsKXtcblxuICAgICAgICAgICAgICAgIC8vIFRyeWluZyB0byBwcmV2ZW50IG5hbWluZyBjb2xsaXNpb25zIGJ5IGFwcGVuZGluZyB0aGUgdW5pcXVlIHVzZXJfaWQgdG8gZmlsZSBuYW1lXG4gICAgICAgICAgICAgICAgLy8gLS0gcmVtb3ZlIGFuZCBzYXZlIHRoZSBleHRlbnNpb24gLSBzaG91bGQgYmUgdGhlIGxhc3QgcGFydFxuICAgICAgICAgICAgICAgIC8vIC0tIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFsbG93IC4gaW4gdGhlIGZpbGVuYW1lIG91dHNpZGUgb2YgZXh0ZW5zaW9uXG4gICAgICAgICAgICAgICAgdmFyIHBpZWNlcyA9IGZpbGUubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgdmFyIGV4dGVuc2lvbiA9IHBpZWNlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZV9uYW1lID0gdXNlcl9pZCArIFwiLVwiICsgcGllY2VzLmpvaW4oXCIuXCIpICsgXCIuXCIgKyBleHRlbnNpb247XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvc2lnbl9zMz9maWxlX25hbWU9XCIrZmlsZV9uYW1lK1wiJmZpbGVfdHlwZT1cIitmaWxlLnR5cGVcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0dWFsbHkgdXBsb2FkIHRoZSBuZXcgZmlsZSB0byBTM1xuICAgICAgICAvLyAtLSBwdXRzIHRoZSBuZXcgdXJsIGluIGEgaGlkZGVuIGZvcm0gZWxlbWVudFxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRGaWxlKGZpbGUsIHNpZ25lZF9yZXF1ZXN0LCB1cmwpe1xuXG4gICAgICAgICAgICAvLyAqKiBUSElTIERPRVMgTk9UIFdPUksgKiovXG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG5cbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgICAgIHVybDogc2lnbmVkX3JlcXVlc3QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hbXotYWNsJzogJ3B1YmxpYy1yZWFkJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YTogZmlsZSxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmlsZS50eXBlXG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3ZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIC8veGhyLm9wZW4oXCJQVVRcIiwgc2lnbmVkX3JlcXVlc3QpO1xuICAgICAgICAgICAgLy94aHIuc2V0UmVxdWVzdEhlYWRlcigneC1hbXotYWNsJywgJ3B1YmxpYy1yZWFkJyk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy94aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICAgICAgLy8gICAgfVxuICAgICAgICAgICAgLy99O1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8veGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICBhbGVydChcIkNvdWxkIG5vdCB1cGxvYWQgZmlsZS5cIik7XG4gICAgICAgICAgICAvL307XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy94aHIuc2VuZChmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogUHJvZmlsZVxuICogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5zZXJ2aWNlc1xuICovXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLnNlcnZpY2VzJylcbiAgICAuZmFjdG9yeSgnVXNlcicsIFVzZXIpO1xuXG4gIFVzZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckaHR0cCcsICdDT05GSUcnXTtcblxuICAvKipcbiAgICogQG5hbWVzcGFjZSBVc2VyXG4gICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxuICAgKi9cbiAgZnVuY3Rpb24gVXNlcigkcm9vdFNjb3BlLCAkaHR0cCwgQ09ORklHKSB7XG5cbiAgICAgIHZhciByb290VXJsID0gQ09ORklHLlNFUlZJQ0VfVVJMO1xuXG4gICAgICAvLyBXaWxsIGhvbGQgaW5mbyBmb3IgdGhlIGN1cnJlbnRseSBsb2dnZWQgaW4gdXNlclxuICAgICAgdmFyIGN1cnJlbnRVc2VyID0ge307XG5cbiAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xuXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcih1c2VyKSB7XG5cbiAgICAgICAgICBjdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFZvdGVzKCB1c2VyX2lkICl7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgdXNlcl9pZCArICcvdm90ZXMnICk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgbG9naW5cbiAgICAgICAqIEBkZXNjIGxvZ2luIGEgbmV3IHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGxvZ2luKHVzZXIpIHtcbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdXNlcnMvbG9naW4nLCB1c2VyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgIC8vYWxsOiBhbGwsXG4gICAgICAgICAgLy9nZXQ6IGdldCxcbiAgICAgICAgICBnZXRWb3RlczogZ2V0Vm90ZXMsXG4gICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgICAgICAgU2V0Q3JlZGVudGlhbHM6IFNldENyZWRlbnRpYWxzLFxuICAgICAgICAgIENsZWFyQ3JlZGVudGlhbHM6IENsZWFyQ3JlZGVudGlhbHMsXG4gICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxuICAgICAgICAgIHNldEN1cnJlbnRVc2VyOiBzZXRDdXJyZW50VXNlcixcbiAgICAgICAgICBpc1VzZXJMb2dnZWRJbjogaXNVc2VyTG9nZ2VkSW4sXG4gICAgICAgICAgaXNVc2VyQWRtaW46IGlzVXNlckFkbWluLFxuICAgICAgICAgIGlzVXNlckZlbGxvdzogaXNVc2VyRmVsbG93LFxuICAgICAgICAgIGlzVXNlckNvbXBhbnk6IGlzVXNlckNvbXBhbnlcbiAgICAgIH07XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBhbGxcbiAgICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIHVzZXJzXG4gICAgICAgKi9cbiAgICAgIC8vZnVuY3Rpb24gYWxsKCkge1xuICAgICAgLy9cbiAgICAgIC8vICAgIHJldHVybiBbXTtcbiAgICAgIC8vXG4gICAgICAvLyAgICAvL3JldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL2NvbXBhbmllcy8nKTtcbiAgICAgIC8vfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGdldFxuICAgICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIHVzZXJcbiAgICAgICAqL1xuICAgICAgLy9mdW5jdGlvbiBnZXQoaWQpIHtcbiAgICAgIC8vICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyBwYXJzZUludChpZCkgKTtcbiAgICAgIC8vfVxuXG4gICAgICAvKipcbiAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICogQGRlc2MgY3JlYXRlIGEgbmV3IHVzZXIgcmVjb3JkXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh1c2VyKSB7XG5cbiAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChyb290VXJsICsgJy9hcGkvdjEvdXNlcnMvY3JlYXRlJywgdXNlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQG5hbWUgdXBkYXRlXG4gICAgICAgKiBAZGVzYyB1cGRhdGVhIGEgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gdXBkYXRlKHVzZXIpIHtcblxuICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQocm9vdFVybCArICcvYXBpL3YxL3VzZXJzLycgKyB1c2VyLmlkLCB1c2VyKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAbmFtZSBkZXN0cm95XG4gICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdXNlciByZWNvcmRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xuICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArIHJvb3RVcmwgKyAnL2FwaS92MS91c2Vycy8nICsgaWQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc1VzZXJMb2dnZWRJbigpe1xuXG4gICAgICAgICAgaWYoIE9iamVjdC5rZXlzKGN1cnJlbnRVc2VyKS5sZW5ndGggPiAwICl7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc1VzZXJBZG1pbigpe1xuXG4gICAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQWRtaW4nIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyRmVsbG93KCl7XG5cbiAgICAgICAgICBpZiggY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdGZWxsb3cnIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNVc2VyQ29tcGFueSgpe1xuXG4gICAgICAgICAgaWYoIGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBTZXRDcmVkZW50aWFscyhpZCwgdXNlcm5hbWUsIHVzZXJUeXBlKSB7XG5cbiAgICAgICAgICB2YXIgYXV0aGRhdGEgPSBCYXNlNjQuZW5jb2RlKGlkICsgJzonICsgdXNlcm5hbWUgKyAnOicgKyB1c2VyVHlwZSk7XG5cbiAgICAgICAgICBjdXJyZW50VXNlciA9IHtcbiAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgICAgICAgYXV0aGRhdGE6IGF1dGhkYXRhXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGxvZ2luU3RhdHVzQ2hhbmdlZCgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBDbGVhckNyZWRlbnRpYWxzKCkge1xuXG4gICAgICAgICAgJGh0dHAuZ2V0KCByb290VXJsICsgJy9hcGkvdjEvdXNlcnMvbG9nb3V0JyApLnRoZW4oIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgY3VycmVudFVzZXIgPSB7fTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGxvZ2luU3RhdHVzQ2hhbmdlZCgpO1xuICAgICAgfVxuXG5cbiAgICAgIGZ1bmN0aW9uIGxvZ2luU3RhdHVzQ2hhbmdlZCgpIHtcblxuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbG9naW5TdGF0dXNDaGFuZ2VkJyk7XG4gICAgICB9XG5cbiAgfVxuXG4gIC8vIEJhc2U2NCBlbmNvZGluZyBzZXJ2aWNlIHVzZWQgYnkgQXV0aGVudGljYXRpb25TZXJ2aWNlXG4gIHZhciBCYXNlNjQgPSB7XG5cbiAgICBrZXlTdHI6ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPScsXG5cbiAgICBlbmNvZGU6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgICB2YXIgY2hyMSwgY2hyMiwgY2hyMyA9IFwiXCI7XG4gICAgICB2YXIgZW5jMSwgZW5jMiwgZW5jMywgZW5jNCA9IFwiXCI7XG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgY2hyMSA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgY2hyMiA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgY2hyMyA9IGlucHV0LmNoYXJDb2RlQXQoaSsrKTtcblxuICAgICAgICBlbmMxID0gY2hyMSA+PiAyO1xuICAgICAgICBlbmMyID0gKChjaHIxICYgMykgPDwgNCkgfCAoY2hyMiA+PiA0KTtcbiAgICAgICAgZW5jMyA9ICgoY2hyMiAmIDE1KSA8PCAyKSB8IChjaHIzID4+IDYpO1xuICAgICAgICBlbmM0ID0gY2hyMyAmIDYzO1xuXG4gICAgICAgIGlmIChpc05hTihjaHIyKSkge1xuICAgICAgICAgIGVuYzMgPSBlbmM0ID0gNjQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOYU4oY2hyMykpIHtcbiAgICAgICAgICBlbmM0ID0gNjQ7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXQgPSBvdXRwdXQgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmMxKSArXG4gICAgICAgICAgdGhpcy5rZXlTdHIuY2hhckF0KGVuYzIpICtcbiAgICAgICAgICB0aGlzLmtleVN0ci5jaGFyQXQoZW5jMykgK1xuICAgICAgICAgIHRoaXMua2V5U3RyLmNoYXJBdChlbmM0KTtcbiAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gXCJcIjtcbiAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9IFwiXCI7XG4gICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuXG4gICAgZGVjb2RlOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgICAgdmFyIGNocjEsIGNocjIsIGNocjMgPSBcIlwiO1xuICAgICAgdmFyIGVuYzEsIGVuYzIsIGVuYzMsIGVuYzQgPSBcIlwiO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAvLyByZW1vdmUgYWxsIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IEEtWiwgYS16LCAwLTksICssIC8sIG9yID1cbiAgICAgIHZhciBiYXNlNjR0ZXN0ID0gL1teQS1aYS16MC05XFwrXFwvXFw9XS9nO1xuICAgICAgaWYgKGJhc2U2NHRlc3QuZXhlYyhpbnB1dCkpIHtcbiAgICAgICAgd2luZG93LmFsZXJ0KFwiVGhlcmUgd2VyZSBpbnZhbGlkIGJhc2U2NCBjaGFyYWN0ZXJzIGluIHRoZSBpbnB1dCB0ZXh0LlxcblwiICtcbiAgICAgICAgICAgIFwiVmFsaWQgYmFzZTY0IGNoYXJhY3RlcnMgYXJlIEEtWiwgYS16LCAwLTksICcrJywgJy8nLGFuZCAnPSdcXG5cIiArXG4gICAgICAgICAgICBcIkV4cGVjdCBlcnJvcnMgaW4gZGVjb2RpbmcuXCIpO1xuICAgICAgfVxuICAgICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZywgXCJcIik7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgZW5jMSA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuICAgICAgICBlbmMyID0gdGhpcy5rZXlTdHIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSsrKSk7XG4gICAgICAgIGVuYzMgPSB0aGlzLmtleVN0ci5pbmRleE9mKGlucHV0LmNoYXJBdChpKyspKTtcbiAgICAgICAgZW5jNCA9IHRoaXMua2V5U3RyLmluZGV4T2YoaW5wdXQuY2hhckF0KGkrKykpO1xuXG4gICAgICAgIGNocjEgPSAoZW5jMSA8PCAyKSB8IChlbmMyID4+IDQpO1xuICAgICAgICBjaHIyID0gKChlbmMyICYgMTUpIDw8IDQpIHwgKGVuYzMgPj4gMik7XG4gICAgICAgIGNocjMgPSAoKGVuYzMgJiAzKSA8PCA2KSB8IGVuYzQ7XG5cbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0ICsgU3RyaW5nLmZyb21DaGFyQ29kZShjaHIxKTtcblxuICAgICAgICBpZiAoZW5jMyAhPSA2NCkge1xuICAgICAgICAgIG91dHB1dCA9IG91dHB1dCArIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyMik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuYzQgIT0gNjQpIHtcbiAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNocjMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hyMSA9IGNocjIgPSBjaHIzID0gXCJcIjtcbiAgICAgICAgZW5jMSA9IGVuYzIgPSBlbmMzID0gZW5jNCA9IFwiXCI7XG5cbiAgICAgIH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xuXG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbiAgfTtcblxufSkoKTtcbiIsIi8qKlxuICogVGFnc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnRhZ3MuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudGFncy5jb250cm9sbGVycycgKVxuICAgICAgICAuY29udHJvbGxlciggJ1RhZ3NDb250cm9sbGVyJywgVGFnc0NvbnRyb2xsZXIgKTtcblxuICAgIFRhZ3NDb250cm9sbGVyLiRpbmplY3QgPSBbICckc2NvcGUnLCAnJGxvY2F0aW9uJywgJyRtb2RhbCcsICdVc2VyJywgJ1RhZ3MnIF07XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFRhZ3NDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gVGFnc0NvbnRyb2xsZXIoICRzY29wZSwgJGxvY2F0aW9uLCAkbW9kYWwsIFVzZXIsIFRhZ3MgKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUubmV3VGFnID0gJyc7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyQWRtaW4oKSApIHtcblxuICAgICAgICAgICAgVGFncy5hbGwoKS5zdWNjZXNzKCBmdW5jdGlvbiggdGFncyApe1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRhZ3MgPSB0YWdzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuYWRkVGFnID0gZnVuY3Rpb24oIG5ld1RhZyApe1xuXG4gICAgICAgICAgICBUYWdzLmNyZWF0ZSggbmV3VGFnICkudGhlbiggZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmV3VGFnID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgICRzY29wZS5uZXdUYWcgPSAnJztcbiAgICAgICAgICAgICAgICAkc2NvcGUudGFncy51bnNoaWZ0KCBuZXdUYWcgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5lZGl0VGFnID0gZnVuY3Rpb24oIHRhZyApe1xuXG4gICAgICAgICAgICAvLyBzaG93IG1vZGFsIHdpdGggdGFnXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcblxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC90YWdzL3BhcnRpYWxzL2VkaXQtdGFnLWZvcm0uaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHNpemU6ICdtZCcsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICB0YWc6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gc2hvdyBzdWNjZXNzL2ZhaWx1cmVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUucmVtb3ZlVGFnID0gZnVuY3Rpb24oIHRhZyApe1xuXG4gICAgICAgICAgICB2YXIgYyA9IGNvbmZpcm0oIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSBcIiArIHRhZy5uYW1lICsgXCI/XCIpO1xuXG4gICAgICAgICAgICBpZiggYyApe1xuXG4gICAgICAgICAgICAgICAgVGFncy5kZXN0cm95KCB0YWcuaWQpLnRoZW4oIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbm93IHVwZGF0ZSBhdmFpbGFibGUgdGFnc1xuICAgICAgICAgICAgICAgICAgICBUYWdzLmFsbCgpLnN1Y2Nlc3MoIGZ1bmN0aW9uKCB0YWdzICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50YWdzID0gdGFncztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC50YWdzLmNvbnRyb2xsZXJzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0VkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBFZGl0VGFnc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcblxuICAgIEVkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ3RhZycsICdUYWdzJyBdO1xuICAgIGZ1bmN0aW9uIEVkaXRUYWdzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIHRhZywgVGFncykge1xuXG4gICAgICAgICRzY29wZS50YWcgPSB0YWc7XG5cbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gb2soKSB7XG5cbiAgICAgICAgICAgIFRhZ3MudXBkYXRlKCAkc2NvcGUudGFnICkudGhlbihmdW5jdGlvbihuZXdUYWcpe1xuXG4gICAgICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoIG5ld1RhZyApO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIC8vIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9ycyA9IFsgXCJUaGVyZSB3YXMgYW4gZXJyb3IgdXBkYXRpbmcgdGhlIHRhZ1wiIF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTtcbiIsIi8qKlxuICogVm90ZXNcbiAqIEBuYW1lc3BhY2UgYXBwLnRhZ3Muc2VydmljZXNcbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudGFncy5zZXJ2aWNlcycpXG4gICAgICAgIC5zZXJ2aWNlKCdUYWdzJywgVGFncyk7XG5cbiAgICBUYWdzLiRpbmplY3QgPSBbJyRodHRwJywgJ0NPTkZJRyddO1xuXG5cbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFRhZ3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBUYWdzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgICAgICAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICAgICAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZ2V0IGFsbCB0YWdzXG4gICAgICAgICAqIEBkZXNjIGdldCBhbGwgcG9zc2libGUgdGFnc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWxsKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoIHJvb3RVcmwgKyAnL2FwaS92MS90YWdzJyApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGdldCBhIHRhZ1xuICAgICAgICAgKiBAZGVzYyBnZXQgYSB0YWcgYnkgdGFnX2lkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoIHRhZ19pZCApe1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyB0YWdfaWQgKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGNyZWF0ZVxuICAgICAgICAgKiBAZGVzYyBjcmVhdGUgYSB0YWcgYnkgbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKCBuYW1lICkge1xuXG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycsIHtcblxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIHVwZGF0ZVxuICAgICAgICAgKiBAZGVzYyB1cGRhdGUgYSB0YWdcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSggdGFnICkge1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KHJvb3RVcmwgKyAnL2FwaS92MS90YWdzLycgKyB0YWcuaWQsIHRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgZGVzdHJveVxuICAgICAgICAgKiBAZGVzYyBkZXN0cm95IGEgdm90ZSByZWNvcmRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShyb290VXJsICsgJy9hcGkvdjEvdGFncy8nICsgaWQpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn0pKCk7XG5cbiIsIi8qKlxuICogQWRtaW5Wb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnQWRtaW5Wb3Rlc0NvbnRyb2xsZXInLCBBZG1pblZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgQWRtaW5Wb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gQWRtaW5Wb3Rlc0NvbnRyb2xsZXIoJHNjb3BlLCAkbG9jYXRpb24sIFVzZXIsIFZvdGVzKSB7XG5cbiAgICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgICAkc2NvcGUuaGVscGVycyA9IEhGSGVscGVycy5oZWxwZXJzO1xuXG4gICAgICAgIGlmKCBVc2VyLmlzVXNlckxvZ2dlZEluKCkgKSB7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogQ29tcGFueVZvdGVzQ29udHJvbGxlclxuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuY29udHJvbGxlcnNcbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoICdhcHAudm90ZXMuY29udHJvbGxlcnMnIClcbiAgICAgICAgLmNvbnRyb2xsZXIoICdDb21wYW55Vm90ZXNDb250cm9sbGVyJywgQ29tcGFueVZvdGVzQ29udHJvbGxlciApO1xuXG4gICAgQ29tcGFueVZvdGVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyAnJHNjb3BlJywgJyRsb2NhdGlvbicsICdVc2VyJywgJ1ZvdGVzJyBdO1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2UgVm90ZUNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBDb21wYW55Vm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAgIFZvdGVzLmdldCggJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXMgPSB2b3RlcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5yZW1vdmVWb3RlID0gZnVuY3Rpb24oIHZvdGUgKXtcblxuICAgICAgICAgICAgLy8gYmUgc3VyZSBpdCB3YXNuJ3QgYW4gYWNjaWRlbnRhbCBjbGlja1xuICAgICAgICAgICAgdmFyIGMgPSBjb25maXJtKCBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZW1vdmUgeW91ciB2b3RlP1wiKTtcbiAgICAgICAgICAgIGlmKCAhYyApIHJldHVybjtcblxuICAgICAgICAgICAgVm90ZXMuZGVzdHJveSggdm90ZS5pZCApLnRoZW4oIGZ1bmN0aW9uKCByZXNwb25zZSApe1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHZvdGUgZnJvbSAkc2NvdGUudm90ZXNcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgJHNjb3BlLnZvdGVzLmxlbmd0aDsgaSsrICl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkc2NvcGUudm90ZXNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGl0ZW0uaWQgPT09IHZvdGUuaWQgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnZvdGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBGZWxsb3dWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnRmVsbG93Vm90ZXNDb250cm9sbGVyJywgRmVsbG93Vm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBGZWxsb3dWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gRmVsbG93Vm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgJHNjb3BlLmhlbHBlcnMgPSBIRkhlbHBlcnMuaGVscGVycztcblxuICAgICAgICBpZiggVXNlci5pc1VzZXJMb2dnZWRJbigpICkge1xuXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSBVc2VyLmdldEN1cnJlbnRVc2VyKCk7XG5cbiAgICAgICAgICAgIFZvdGVzLmdldCggJHNjb3BlLmN1cnJlbnRVc2VyLmlkICkuc3VjY2VzcyggZnVuY3Rpb24oIHZvdGVzICl7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXMgPSB2b3RlcztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnJlbW92ZVZvdGUgPSBmdW5jdGlvbiggdm90ZSApe1xuXG4gICAgICAgICAgICAvLyBiZSBzdXJlIGl0IHdhc24ndCBhbiBhY2NpZGVudGFsIGNsaWNrXG4gICAgICAgICAgICB2YXIgYyA9IGNvbmZpcm0oIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHJlbW92ZSB5b3VyIHZvdGU/XCIpO1xuICAgICAgICAgICAgaWYoICFjICkgcmV0dXJuO1xuXG4gICAgICAgICAgICBWb3Rlcy5kZXN0cm95KCB2b3RlLmlkICkudGhlbiggZnVuY3Rpb24oIHJlc3BvbnNlICl7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdm90ZSBmcm9tICRzY290ZS52b3Rlc1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwOyAkc2NvcGUudm90ZXMubGVuZ3RoOyBpKysgKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICRzY29wZS52b3Rlc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiggaXRlbS5pZCA9PT0gdm90ZS5pZCApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudm90ZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc0NvbnRyb2xsZXJcbiAqIEBuYW1lc3BhY2UgYXBwLnZvdGVzLmNvbnRyb2xsZXJzXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCAnYXBwLnZvdGVzLmNvbnRyb2xsZXJzJyApXG4gICAgICAgIC5jb250cm9sbGVyKCAnVm90ZXNDb250cm9sbGVyJywgVm90ZXNDb250cm9sbGVyICk7XG5cbiAgICBWb3Rlc0NvbnRyb2xsZXIuJGluamVjdCA9IFsgJyRzY29wZScsICckbG9jYXRpb24nLCAnVXNlcicsICdWb3RlcycgXTtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlIFZvdGVDb250cm9sbGVyXG4gICAgICovXG4gICAgZnVuY3Rpb24gVm90ZXNDb250cm9sbGVyKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyLCBWb3Rlcykge1xuXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgaWYoIFVzZXIuaXNVc2VyTG9nZ2VkSW4oKSApIHtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlci5nZXRDdXJyZW50VXNlcigpO1xuXG4gICAgICAgICAgICAvLyByZWRpcmVjdCB0aGUgdXNlciBiYXNlZCBvbiB0aGVpciB0eXBlXG4gICAgICAgICAgICBpZiAoY3VycmVudFVzZXIudXNlclR5cGUgPT09ICdBZG1pbicpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9hZG1pblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnRmVsbG93Jykge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL3ZvdGVzL2ZlbGxvd1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRVc2VyLnVzZXJUeXBlID09PSAnQ29tcGFueScpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi92b3Rlcy9jb21wYW55XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG59KSgpO1xuIiwiLyoqXG4gKiBWb3Rlc1xuICogQG5hbWVzcGFjZSBhcHAudm90ZXMuc2VydmljZXNcbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAudm90ZXMuc2VydmljZXMnKVxuICAgICAgICAuc2VydmljZSgnVm90ZXMnLCBWb3Rlcyk7XG5cbiAgICBWb3Rlcy4kaW5qZWN0ID0gWyckaHR0cCcsICdDT05GSUcnXTtcblxuXG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZSBWb3Rlc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFZvdGVzKCRodHRwLCBDT05GSUcpIHtcblxuICAgICAgICB2YXIgcm9vdFVybCA9IENPTkZJRy5TRVJWSUNFX1VSTDtcblxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICBnZXQ6IGdldCxcbiAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBnZXQgdm90ZXNcbiAgICAgICAgICogQGRlc2MgZ2V0IHRoZSB2b3RlcyBmb3IgYSB1c2VyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXQoIHZvdGVyX2lkICl7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzLycgKyB2b3Rlcl9pZCApO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgY3JlYXRlXG4gICAgICAgICAqIEBkZXNjIGNhc3QgYSB2b3RlIGZvciBhIHVzZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSggdm90ZXJfaWQsIHZvdGVlX2lkICkge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB2b3Rlcl9pZCArIFwiIFwiICsgdm90ZWVfaWQgKTtcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3Qocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzLycsIHtcblxuICAgICAgICAgICAgICAgIHZvdGVyX2lkOiB2b3Rlcl9pZCxcbiAgICAgICAgICAgICAgICB2b3RlZV9pZDogdm90ZWVfaWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIGRlc3Ryb3lcbiAgICAgICAgICogQGRlc2MgZGVzdHJveSBhIHZvdGUgcmVjb3JkXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUocm9vdFVybCArICcvYXBpL3YxL3ZvdGVzLycgKyBpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcblxuIiwiLyohIDcuMy45ICovXG4hd2luZG93LlhNTEh0dHBSZXF1ZXN0fHx3aW5kb3cuRmlsZUFQSSYmRmlsZUFQSS5zaG91bGRMb2FkfHwod2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe2lmKFwiX19zZXRYSFJfXCI9PT1iKXt2YXIgZD1jKHRoaXMpO2QgaW5zdGFuY2VvZiBGdW5jdGlvbiYmZCh0aGlzKX1lbHNlIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0od2luZG93LlhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZXRSZXF1ZXN0SGVhZGVyKSk7dmFyIG5nRmlsZVVwbG9hZD1hbmd1bGFyLm1vZHVsZShcIm5nRmlsZVVwbG9hZFwiLFtdKTtuZ0ZpbGVVcGxvYWQudmVyc2lvbj1cIjcuMy45XCIsbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRCYXNlXCIsW1wiJGh0dHBcIixcIiRxXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGQpe2Z1bmN0aW9uIGcoYSl7ai5ub3RpZnkmJmoubm90aWZ5KGEpLGsucHJvZ3Jlc3NGdW5jJiZjKGZ1bmN0aW9uKCl7ay5wcm9ncmVzc0Z1bmMoYSl9KX1mdW5jdGlvbiBoKGEpe3JldHVybiBudWxsIT1kLl9zdGFydCYmZj97bG9hZGVkOmEubG9hZGVkK2QuX3N0YXJ0LHRvdGFsOmQuX2ZpbGUuc2l6ZSx0eXBlOmEudHlwZSxjb25maWc6ZCxsZW5ndGhDb21wdXRhYmxlOiEwLHRhcmdldDphLnRhcmdldH06YX1mdW5jdGlvbiBpKCl7YShkKS50aGVuKGZ1bmN0aW9uKGEpe2YmJmQuX2NodW5rU2l6ZSYmIWQuX2ZpbmlzaGVkPyhnKHtsb2FkZWQ6ZC5fZW5kLHRvdGFsOmQuX2ZpbGUuc2l6ZSxjb25maWc6ZCx0eXBlOlwicHJvZ3Jlc3NcIn0pLGUudXBsb2FkKGQpKTooZC5fZmluaXNoZWQmJmRlbGV0ZSBkLl9maW5pc2hlZCxqLnJlc29sdmUoYSkpfSxmdW5jdGlvbihhKXtqLnJlamVjdChhKX0sZnVuY3Rpb24oYSl7ai5ub3RpZnkoYSl9KX1kLm1ldGhvZD1kLm1ldGhvZHx8XCJQT1NUXCIsZC5oZWFkZXJzPWQuaGVhZGVyc3x8e307dmFyIGo9ZC5fZGVmZXJyZWQ9ZC5fZGVmZXJyZWR8fGIuZGVmZXIoKSxrPWoucHJvbWlzZTtyZXR1cm4gZC5oZWFkZXJzLl9fc2V0WEhSXz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhKXthJiYoZC5fX1hIUj1hLGQueGhyRm4mJmQueGhyRm4oYSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsZnVuY3Rpb24oYSl7YS5jb25maWc9ZCxnKGgoYSkpfSwhMSksYS51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixmdW5jdGlvbihhKXthLmxlbmd0aENvbXB1dGFibGUmJihhLmNvbmZpZz1kLGcoaChhKSkpfSwhMSkpfX0sZj9kLl9jaHVua1NpemUmJmQuX2VuZCYmIWQuX2ZpbmlzaGVkPyhkLl9zdGFydD1kLl9lbmQsZC5fZW5kKz1kLl9jaHVua1NpemUsaSgpKTpkLnJlc3VtZVNpemVVcmw/YS5nZXQoZC5yZXN1bWVTaXplVXJsKS50aGVuKGZ1bmN0aW9uKGEpe2QuX3N0YXJ0PWQucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyP2QucmVzdW1lU2l6ZVJlc3BvbnNlUmVhZGVyKGEuZGF0YSk6cGFyc2VJbnQoKG51bGw9PWEuZGF0YS5zaXplP2EuZGF0YTphLmRhdGEuc2l6ZSkudG9TdHJpbmcoKSksZC5fY2h1bmtTaXplJiYoZC5fZW5kPWQuX3N0YXJ0K2QuX2NodW5rU2l6ZSksaSgpfSxmdW5jdGlvbihhKXt0aHJvdyBhfSk6ZC5yZXN1bWVTaXplP2QucmVzdW1lU2l6ZSgpLnRoZW4oZnVuY3Rpb24oYSl7ZC5fc3RhcnQ9YSxpKCl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTppKCk6aSgpLGsuc3VjY2Vzcz1mdW5jdGlvbihhKXtyZXR1cm4gay50aGVuKGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsuZXJyb3I9ZnVuY3Rpb24oYSl7cmV0dXJuIGsudGhlbihudWxsLGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxkKX0pLGt9LGsucHJvZ3Jlc3M9ZnVuY3Rpb24oYSl7cmV0dXJuIGsucHJvZ3Jlc3NGdW5jPWEsay50aGVuKG51bGwsbnVsbCxmdW5jdGlvbihiKXthKGIpfSksa30say5hYm9ydD1rLnBhdXNlPWZ1bmN0aW9uKCl7cmV0dXJuIGQuX19YSFImJmMoZnVuY3Rpb24oKXtkLl9fWEhSLmFib3J0KCl9KSxrfSxrLnhocj1mdW5jdGlvbihhKXtyZXR1cm4gZC54aHJGbj1mdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oKXtiJiZiLmFwcGx5KGssYXJndW1lbnRzKSxhLmFwcGx5KGssYXJndW1lbnRzKX19KGQueGhyRm4pLGt9LGt9dmFyIGU9dGhpczt0aGlzLmlzUmVzdW1lU3VwcG9ydGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHdpbmRvdy5CbG9iJiYobmV3IEJsb2IpLnNsaWNlfTt2YXIgZj10aGlzLmlzUmVzdW1lU3VwcG9ydGVkKCk7dGhpcy51cGxvYWQ9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihjLGQsZSl7aWYodm9pZCAwIT09ZClpZihhbmd1bGFyLmlzRGF0ZShkKSYmKGQ9ZC50b0lTT1N0cmluZygpKSxhbmd1bGFyLmlzU3RyaW5nKGQpKWMuYXBwZW5kKGUsZCk7ZWxzZSBpZihcImZvcm1cIj09PWEuc2VuZEZpZWxkc0FzKWlmKGFuZ3VsYXIuaXNPYmplY3QoZCkpZm9yKHZhciBmIGluIGQpZC5oYXNPd25Qcm9wZXJ0eShmKSYmYihjLGRbZl0sZStcIltcIitmK1wiXVwiKTtlbHNlIGMuYXBwZW5kKGUsZCk7ZWxzZSBkPWFuZ3VsYXIuaXNTdHJpbmcoZCk/ZDphbmd1bGFyLnRvSnNvbihkKSxcImpzb24tYmxvYlwiPT09YS5zZW5kRmllbGRzQXM/Yy5hcHBlbmQoZSxuZXcgQmxvYihbZF0se3R5cGU6XCJhcHBsaWNhdGlvbi9qc29uXCJ9KSk6Yy5hcHBlbmQoZSxkKX1mdW5jdGlvbiBjKGEpe3JldHVybiBhIGluc3RhbmNlb2YgQmxvYnx8YS5mbGFzaElkJiZhLm5hbWUmJmEuc2l6ZX1mdW5jdGlvbiBnKGIsZCxlKXtpZihjKGQpKXtpZihhLl9maWxlPWEuX2ZpbGV8fGQsbnVsbCE9YS5fc3RhcnQmJmYpe2EuX2VuZCYmYS5fZW5kPj1kLnNpemUmJihhLl9maW5pc2hlZD0hMCxhLl9lbmQ9ZC5zaXplKTt2YXIgaD1kLnNsaWNlKGEuX3N0YXJ0LGEuX2VuZHx8ZC5zaXplKTtoLm5hbWU9ZC5uYW1lLGQ9aCxhLl9jaHVua1NpemUmJihiLmFwcGVuZChcImNodW5rU2l6ZVwiLGEuX2VuZC1hLl9zdGFydCksYi5hcHBlbmQoXCJjaHVua051bWJlclwiLE1hdGguZmxvb3IoYS5fc3RhcnQvYS5fY2h1bmtTaXplKSksYi5hcHBlbmQoXCJ0b3RhbFNpemVcIixhLl9maWxlLnNpemUpKX1iLmFwcGVuZChlLGQsZC5maWxlTmFtZXx8ZC5uYW1lKX1lbHNle2lmKCFhbmd1bGFyLmlzT2JqZWN0KGQpKXRocm93XCJFeHBlY3RlZCBmaWxlIG9iamVjdCBpbiBVcGxvYWQudXBsb2FkIGZpbGUgb3B0aW9uOiBcIitkLnRvU3RyaW5nKCk7Zm9yKHZhciBpIGluIGQpaWYoZC5oYXNPd25Qcm9wZXJ0eShpKSl7dmFyIGo9aS5zcGxpdChcIixcIik7alsxXSYmKGRbaV0uZmlsZU5hbWU9alsxXS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpKSxnKGIsZFtpXSxqWzBdKX19fXJldHVybiBhLl9jaHVua1NpemU9ZS50cmFuc2xhdGVTY2FsYXJzKGEucmVzdW1lQ2h1bmtTaXplKSxhLl9jaHVua1NpemU9YS5fY2h1bmtTaXplP3BhcnNlSW50KGEuX2NodW5rU2l6ZS50b1N0cmluZygpKTpudWxsLGEuaGVhZGVycz1hLmhlYWRlcnN8fHt9LGEuaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXT12b2lkIDAsYS50cmFuc2Zvcm1SZXF1ZXN0PWEudHJhbnNmb3JtUmVxdWVzdD9hbmd1bGFyLmlzQXJyYXkoYS50cmFuc2Zvcm1SZXF1ZXN0KT9hLnRyYW5zZm9ybVJlcXVlc3Q6W2EudHJhbnNmb3JtUmVxdWVzdF06W10sYS50cmFuc2Zvcm1SZXF1ZXN0LnB1c2goZnVuY3Rpb24oYyl7dmFyIGQsZT1uZXcgRm9ybURhdGEsZj17fTtmb3IoZCBpbiBhLmZpZWxkcylhLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShkKSYmKGZbZF09YS5maWVsZHNbZF0pO2MmJihmLmRhdGE9Yyk7Zm9yKGQgaW4gZilpZihmLmhhc093blByb3BlcnR5KGQpKXt2YXIgaD1mW2RdO2EuZm9ybURhdGFBcHBlbmRlcj9hLmZvcm1EYXRhQXBwZW5kZXIoZSxkLGgpOmIoZSxoLGQpfWlmKG51bGwhPWEuZmlsZSlpZihhbmd1bGFyLmlzQXJyYXkoYS5maWxlKSlmb3IodmFyIGk9MDtpPGEuZmlsZS5sZW5ndGg7aSsrKWcoZSxhLmZpbGVbaV0sXCJmaWxlXCIpO2Vsc2UgZyhlLGEuZmlsZSxcImZpbGVcIik7cmV0dXJuIGV9KSxkKGEpfSx0aGlzLmh0dHA9ZnVuY3Rpb24oYil7cmV0dXJuIGIudHJhbnNmb3JtUmVxdWVzdD1iLnRyYW5zZm9ybVJlcXVlc3R8fGZ1bmN0aW9uKGIpe3JldHVybiB3aW5kb3cuQXJyYXlCdWZmZXImJmIgaW5zdGFuY2VvZiB3aW5kb3cuQXJyYXlCdWZmZXJ8fGIgaW5zdGFuY2VvZiBCbG9iP2I6YS5kZWZhdWx0cy50cmFuc2Zvcm1SZXF1ZXN0WzBdLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sYi5fY2h1bmtTaXplPWUudHJhbnNsYXRlU2NhbGFycyhiLnJlc3VtZUNodW5rU2l6ZSksYi5fY2h1bmtTaXplPWIuX2NodW5rU2l6ZT9wYXJzZUludChiLl9jaHVua1NpemUudG9TdHJpbmcoKSk6bnVsbCxkKGIpfSx0aGlzLnRyYW5zbGF0ZVNjYWxhcnM9ZnVuY3Rpb24oYSl7aWYoYW5ndWxhci5pc1N0cmluZyhhKSl7aWYoYS5zZWFyY2goL2tiL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTMqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL21iL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTYqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2diL2kpPT09YS5sZW5ndGgtMilyZXR1cm4gcGFyc2VGbG9hdCgxZTkqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0yKSk7aWYoYS5zZWFyY2goL2IvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KGEuc3Vic3RyaW5nKDAsYS5sZW5ndGgtMSkpO2lmKGEuc2VhcmNoKC9zL2kpPT09YS5sZW5ndGgtMSlyZXR1cm4gcGFyc2VGbG9hdChhLnN1YnN0cmluZygwLGEubGVuZ3RoLTEpKTtpZihhLnNlYXJjaCgvbS9pKT09PWEubGVuZ3RoLTEpcmV0dXJuIHBhcnNlRmxvYXQoNjAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSk7aWYoYS5zZWFyY2goL2gvaSk9PT1hLmxlbmd0aC0xKXJldHVybiBwYXJzZUZsb2F0KDM2MDAqYS5zdWJzdHJpbmcoMCxhLmxlbmd0aC0xKSl9cmV0dXJuIGF9LHRoaXMuc2V0RGVmYXVsdHM9ZnVuY3Rpb24oYSl7dGhpcy5kZWZhdWx0cz1hfHx7fX0sdGhpcy5kZWZhdWx0cz17fSx0aGlzLnZlcnNpb249bmdGaWxlVXBsb2FkLnZlcnNpb259XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkUmVzaXplXCIsZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9ZDtyZXR1cm4gZS5nZXRBdHRyV2l0aERlZmF1bHRzPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPWFbYl0/YVtiXTpudWxsPT1lLmRlZmF1bHRzW2JdP2UuZGVmYXVsdHNbYl06ZS5kZWZhdWx0c1tiXS50b1N0cmluZygpfSxlLmF0dHJHZXR0ZXI9ZnVuY3Rpb24oYixjLGQsZSl7aWYoIWQpcmV0dXJuIHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpO3RyeXtyZXR1cm4gZT9hKHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpKShkLGUpOmEodGhpcy5nZXRBdHRyV2l0aERlZmF1bHRzKGMsYikpKGQpfWNhdGNoKGYpe2lmKGIuc2VhcmNoKC9taW58bWF4fHBhdHRlcm4vaSkpcmV0dXJuIHRoaXMuZ2V0QXR0cldpdGhEZWZhdWx0cyhjLGIpO3Rocm93IGZ9fSxlLnVwZGF0ZU1vZGVsPWZ1bmN0aW9uKGMsZCxmLGcsaCxpLGope2Z1bmN0aW9uIGsoKXt2YXIgaj1oJiZoLmxlbmd0aD9oWzBdOm51bGw7aWYoYyl7dmFyIGs9IWUuYXR0ckdldHRlcihcIm5nZk11bHRpcGxlXCIsZCxmKSYmIWUuYXR0ckdldHRlcihcIm11bHRpcGxlXCIsZCkmJiFwO2EoZS5hdHRyR2V0dGVyKFwibmdNb2RlbFwiLGQpKS5hc3NpZ24oZixrP2o6aCl9dmFyIGw9ZS5hdHRyR2V0dGVyKFwibmdmTW9kZWxcIixkKTtsJiZhKGwpLmFzc2lnbihmLGgpLGcmJmEoZykoZix7JGZpbGVzOmgsJGZpbGU6aiwkbmV3RmlsZXM6bSwkZHVwbGljYXRlRmlsZXM6biwkZXZlbnQ6aX0pLGIoZnVuY3Rpb24oKXt9KX1mdW5jdGlvbiBsKGEsYil7dmFyIGM9ZS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZCxmKTtpZighY3x8IWUuaXNSZXNpemVTdXBwb3J0ZWQoKSlyZXR1cm4gYigpO2Zvcih2YXIgZz1hLmxlbmd0aCxoPWZ1bmN0aW9uKCl7Zy0tLDA9PT1nJiZiKCl9LGk9ZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2Euc3BsaWNlKGIsMSxjKSxoKCl9fSxqPWZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXtoKCksYS4kZXJyb3I9XCJyZXNpemVcIixhLiRlcnJvclBhcmFtPShiPyhiLm1lc3NhZ2U/Yi5tZXNzYWdlOmIpK1wiOiBcIjpcIlwiKSsoYSYmYS5uYW1lKX19LGs9MDtrPGEubGVuZ3RoO2srKyl7dmFyIGw9YVtrXTtsLiRlcnJvcnx8MCE9PWwudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/aCgpOmUucmVzaXplKGwsYy53aWR0aCxjLmhlaWdodCxjLnF1YWxpdHkpLnRoZW4oaShrKSxqKGwpKX19dmFyIG09aCxuPVtdLG89KGMmJmMuJG1vZGVsVmFsdWV8fGQuJCRuZ2ZQcmV2RmlsZXN8fFtdKS5zbGljZSgwKSxwPWUuYXR0ckdldHRlcihcIm5nZktlZXBcIixkLGYpO2lmKHA9PT0hMCl7aWYoIWh8fCFoLmxlbmd0aClyZXR1cm47dmFyIHE9ITE7aWYoZS5hdHRyR2V0dGVyKFwibmdmS2VlcERpc3RpbmN0XCIsZCxmKT09PSEwKXtmb3IodmFyIHI9by5sZW5ndGgscz0wO3M8aC5sZW5ndGg7cysrKXtmb3IodmFyIHQ9MDtyPnQ7dCsrKWlmKGhbc10ubmFtZT09PW9bdF0ubmFtZSl7bi5wdXNoKGhbc10pO2JyZWFrfXQ9PT1yJiYoby5wdXNoKGhbc10pLHE9ITApfWlmKCFxKXJldHVybjtoPW99ZWxzZSBoPW8uY29uY2F0KGgpfWQuJCRuZ2ZQcmV2RmlsZXM9aCxqP2soKTplLnZhbGlkYXRlKGgsYyxkLGYsZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGQpLGZ1bmN0aW9uKCl7bChoLGZ1bmN0aW9uKCl7YihmdW5jdGlvbigpe2soKX0pfSl9KTtmb3IodmFyIHU9by5sZW5ndGg7dS0tOyl7dmFyIHY9b1t1XTt3aW5kb3cuVVJMJiZ2LmJsb2JVcmwmJihVUkwucmV2b2tlT2JqZWN0VVJMKHYuYmxvYlVybCksZGVsZXRlIHYuYmxvYlVybCl9fSxlfV0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZTZWxlY3RcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkY29tcGlsZVwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZShhKXt2YXIgYj1hLm1hdGNoKC9BbmRyb2lkW15cXGRdKihcXGQrKVxcLihcXGQrKS8pO2lmKGImJmIubGVuZ3RoPjIpe3ZhciBjPWQuZGVmYXVsdHMuYW5kcm9pZEZpeE1pbm9yVmVyc2lvbnx8NDtyZXR1cm4gcGFyc2VJbnQoYlsxXSk8NHx8cGFyc2VJbnQoYlsxXSk9PT1jJiZwYXJzZUludChiWzJdKTxjfXJldHVybi0xPT09YS5pbmRleE9mKFwiQ2hyb21lXCIpJiYvLipXaW5kb3dzLipTYWZhcmkuKi8udGVzdChhKX1mdW5jdGlvbiBmKGEsYixjLGQsZixoLGksail7ZnVuY3Rpb24gaygpe3JldHVyblwiaW5wdXRcIj09PWJbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpJiZjLnR5cGUmJlwiZmlsZVwiPT09Yy50eXBlLnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbCgpe3JldHVybiB0KFwibmdmQ2hhbmdlXCIpfHx0KFwibmdmU2VsZWN0XCIpfWZ1bmN0aW9uIG0oYil7Zm9yKHZhciBlPWIuX19maWxlc198fGIudGFyZ2V0JiZiLnRhcmdldC5maWxlcyxmPVtdLGc9MDtnPGUubGVuZ3RoO2crKylmLnB1c2goZVtnXSk7ai51cGRhdGVNb2RlbChkLGMsYSxsKCksZi5sZW5ndGg/ZjpudWxsLGIpfWZ1bmN0aW9uIG4oYSl7aWYoYiE9PWEpZm9yKHZhciBjPTA7YzxiWzBdLmF0dHJpYnV0ZXMubGVuZ3RoO2MrKyl7dmFyIGQ9YlswXS5hdHRyaWJ1dGVzW2NdO1widHlwZVwiIT09ZC5uYW1lJiZcImNsYXNzXCIhPT1kLm5hbWUmJlwiaWRcIiE9PWQubmFtZSYmXCJzdHlsZVwiIT09ZC5uYW1lJiYoKG51bGw9PWQudmFsdWV8fFwiXCI9PT1kLnZhbHVlKSYmKFwicmVxdWlyZWRcIj09PWQubmFtZSYmKGQudmFsdWU9XCJyZXF1aXJlZFwiKSxcIm11bHRpcGxlXCI9PT1kLm5hbWUmJihkLnZhbHVlPVwibXVsdGlwbGVcIikpLGEuYXR0cihkLm5hbWUsZC52YWx1ZSkpfX1mdW5jdGlvbiBvKCl7aWYoaygpKXJldHVybiBiO3ZhciBhPWFuZ3VsYXIuZWxlbWVudCgnPGlucHV0IHR5cGU9XCJmaWxlXCI+Jyk7cmV0dXJuIG4oYSksYS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImFic29sdXRlXCIpLmNzcyhcIm92ZXJmbG93XCIsXCJoaWRkZW5cIikuY3NzKFwid2lkdGhcIixcIjBweFwiKS5jc3MoXCJoZWlnaHRcIixcIjBweFwiKS5jc3MoXCJib3JkZXJcIixcIm5vbmVcIikuY3NzKFwibWFyZ2luXCIsXCIwcHhcIikuY3NzKFwicGFkZGluZ1wiLFwiMHB4XCIpLmF0dHIoXCJ0YWJpbmRleFwiLFwiLTFcIiksZy5wdXNoKHtlbDpiLHJlZjphfSksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhWzBdKSxhfWZ1bmN0aW9uIHAoYyl7aWYoYi5hdHRyKFwiZGlzYWJsZWRcIil8fHQoXCJuZ2ZTZWxlY3REaXNhYmxlZFwiLGEpKXJldHVybiExO3ZhciBkPXEoYyk7cmV0dXJuIG51bGwhPWQ/ZDoocihjKSxlKG5hdmlnYXRvci51c2VyQWdlbnQpP3NldFRpbWVvdXQoZnVuY3Rpb24oKXt3WzBdLmNsaWNrKCl9LDApOndbMF0uY2xpY2soKSwhMSl9ZnVuY3Rpb24gcShhKXt2YXIgYj1hLmNoYW5nZWRUb3VjaGVzfHxhLm9yaWdpbmFsRXZlbnQmJmEub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcztpZihcInRvdWNoc3RhcnRcIj09PWEudHlwZSlyZXR1cm4gdj1iP2JbMF0uY2xpZW50WTowLCEwO2lmKGEuc3RvcFByb3BhZ2F0aW9uKCksYS5wcmV2ZW50RGVmYXVsdCgpLFwidG91Y2hlbmRcIj09PWEudHlwZSl7dmFyIGM9Yj9iWzBdLmNsaWVudFk6MDtpZihNYXRoLmFicyhjLXYpPjIwKXJldHVybiExfX1mdW5jdGlvbiByKGIpe3cudmFsKCkmJih3LnZhbChudWxsKSxqLnVwZGF0ZU1vZGVsKGQsYyxhLGwoKSxudWxsLGIsITApKX1mdW5jdGlvbiBzKGEpe2lmKHcmJiF3LmF0dHIoXCJfX25nZl9pZTEwX0ZpeF9cIikpe2lmKCF3WzBdLnBhcmVudE5vZGUpcmV0dXJuIHZvaWQodz1udWxsKTthLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSx3LnVuYmluZChcImNsaWNrXCIpO3ZhciBiPXcuY2xvbmUoKTtyZXR1cm4gdy5yZXBsYWNlV2l0aChiKSx3PWIsdy5hdHRyKFwiX19uZ2ZfaWUxMF9GaXhfXCIsXCJ0cnVlXCIpLHcuYmluZChcImNoYW5nZVwiLG0pLHcuYmluZChcImNsaWNrXCIscyksd1swXS5jbGljaygpLCExfXcucmVtb3ZlQXR0cihcIl9fbmdmX2llMTBfRml4X1wiKX12YXIgdD1mdW5jdGlvbihhLGIpe3JldHVybiBqLmF0dHJHZXR0ZXIoYSxjLGIpfSx1PVtdO3UucHVzaChhLiR3YXRjaCh0KFwibmdmTXVsdGlwbGVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJtdWx0aXBsZVwiLHQoXCJuZ2ZNdWx0aXBsZVwiLGEpKX0pKSx1LnB1c2goYS4kd2F0Y2godChcIm5nZkNhcHR1cmVcIiksZnVuY3Rpb24oKXt3LmF0dHIoXCJjYXB0dXJlXCIsdChcIm5nZkNhcHR1cmVcIixhKSl9KSksYy4kb2JzZXJ2ZShcImFjY2VwdFwiLGZ1bmN0aW9uKCl7dy5hdHRyKFwiYWNjZXB0XCIsdChcImFjY2VwdFwiKSl9KSx1LnB1c2goZnVuY3Rpb24oKXtjLiQkb2JzZXJ2ZXJzJiZkZWxldGUgYy4kJG9ic2VydmVycy5hY2NlcHR9KTt2YXIgdj0wLHc9YjtrKCl8fCh3PW8oKSksdy5iaW5kKFwiY2hhbmdlXCIsbSksaygpP2IuYmluZChcImNsaWNrXCIscik6Yi5iaW5kKFwiY2xpY2sgdG91Y2hzdGFydCB0b3VjaGVuZFwiLHApLGoucmVnaXN0ZXJWYWxpZGF0b3JzKGQsdyxjLGEpLC0xIT09bmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIikmJncuYmluZChcImNsaWNrXCIscyksYS4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7aygpfHx3LnJlbW92ZSgpLGFuZ3VsYXIuZm9yRWFjaCh1LGZ1bmN0aW9uKGEpe2EoKX0pfSksaChmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2E8Zy5sZW5ndGg7YSsrKXt2YXIgYj1nW2FdO2RvY3VtZW50LmJvZHkuY29udGFpbnMoYi5lbFswXSl8fChnLnNwbGljZShhLDEpLGIucmVmLnJlbW92ZSgpKX19KSx3aW5kb3cuRmlsZUFQSSYmd2luZG93LkZpbGVBUEkubmdmRml4SUUmJndpbmRvdy5GaWxlQVBJLm5nZkZpeElFKGIsdyxtKX12YXIgZz1bXTtyZXR1cm57cmVzdHJpY3Q6XCJBRUNcIixyZXF1aXJlOlwiP25nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGUsZyxoLGkpe2YoZSxnLGgsaSxhLGIsYyxkKX19fV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhKXtyZXR1cm5cImltZ1wiPT09YS50YWdOYW1lLnRvTG93ZXJDYXNlKCk/XCJpbWFnZVwiOlwiYXVkaW9cIj09PWEudGFnTmFtZS50b0xvd2VyQ2FzZSgpP1wiYXVkaW9cIjpcInZpZGVvXCI9PT1hLnRhZ05hbWUudG9Mb3dlckNhc2UoKT9cInZpZGVvXCI6Ly4vfWZ1bmN0aW9uIGIoYixjLGQsZSxmLGcsaCxpKXtmdW5jdGlvbiBqKGEpe3ZhciBnPWIuYXR0ckdldHRlcihcIm5nZk5vT2JqZWN0VXJsXCIsZixkKTtiLmRhdGFVcmwoYSxnKVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtjKGZ1bmN0aW9uKCl7dmFyIGI9KGc/YS5kYXRhVXJsOmEuYmxvYlVybCl8fGEuZGF0YVVybDtpP2UuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLFwidXJsKCdcIisoYnx8XCJcIikrXCInKVwiKTplLmF0dHIoXCJzcmNcIixiKSxiP2UucmVtb3ZlQ2xhc3MoXCJuZ2YtaGlkZVwiKTplLmFkZENsYXNzKFwibmdmLWhpZGVcIil9KX0pfWMoZnVuY3Rpb24oKXt2YXIgYz1kLiR3YXRjaChmW2ddLGZ1bmN0aW9uKGMpe3ZhciBkPWg7aWYoXCJuZ2ZUaHVtYm5haWxcIj09PWcmJihkfHwoZD17d2lkdGg6ZVswXS5jbGllbnRXaWR0aCxoZWlnaHQ6ZVswXS5jbGllbnRIZWlnaHR9KSwwPT09ZC53aWR0aCYmd2luZG93LmdldENvbXB1dGVkU3R5bGUpKXt2YXIgZj1nZXRDb21wdXRlZFN0eWxlKGVbMF0pO2Q9e3dpZHRoOnBhcnNlSW50KGYud2lkdGguc2xpY2UoMCwtMikpLGhlaWdodDpwYXJzZUludChmLmhlaWdodC5zbGljZSgwLC0yKSl9fXJldHVybiBhbmd1bGFyLmlzU3RyaW5nKGMpPyhlLnJlbW92ZUNsYXNzKFwibmdmLWhpZGVcIiksaT9lLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIixcInVybCgnXCIrYytcIicpXCIpOmUuYXR0cihcInNyY1wiLGMpKTp2b2lkKCFjfHwhYy50eXBlfHwwIT09Yy50eXBlLnNlYXJjaChhKGVbMF0pKXx8aSYmMCE9PWMudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/ZS5hZGRDbGFzcyhcIm5nZi1oaWRlXCIpOmQmJmIuaXNSZXNpemVTdXBwb3J0ZWQoKT9iLnJlc2l6ZShjLGQud2lkdGgsZC5oZWlnaHQsZC5xdWFsaXR5KS50aGVuKGZ1bmN0aW9uKGEpe2ooYSl9LGZ1bmN0aW9uKGEpe3Rocm93IGF9KTpqKGMpKX0pO2QuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2MoKX0pfSl9bmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWREYXRhVXJsXCIsW1wiVXBsb2FkQmFzZVwiLFwiJHRpbWVvdXRcIixcIiRxXCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWE7cmV0dXJuIGQuZGF0YVVybD1mdW5jdGlvbihhLGQpe2lmKGQmJm51bGwhPWEuZGF0YVVybHx8IWQmJm51bGwhPWEuYmxvYlVybCl7dmFyIGU9Yy5kZWZlcigpO3JldHVybiBiKGZ1bmN0aW9uKCl7ZS5yZXNvbHZlKGQ/YS5kYXRhVXJsOmEuYmxvYlVybCl9KSxlLnByb21pc2V9dmFyIGY9ZD9hLiRuZ2ZEYXRhVXJsUHJvbWlzZTphLiRuZ2ZCbG9iVXJsUHJvbWlzZTtpZihmKXJldHVybiBmO3ZhciBnPWMuZGVmZXIoKTtyZXR1cm4gYihmdW5jdGlvbigpe2lmKHdpbmRvdy5GaWxlUmVhZGVyJiZhJiYoIXdpbmRvdy5GaWxlQVBJfHwtMT09PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOFwiKXx8YS5zaXplPDJlNCkmJighd2luZG93LkZpbGVBUEl8fC0xPT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5XCIpfHxhLnNpemU8NGU2KSl7dmFyIGM9d2luZG93LlVSTHx8d2luZG93LndlYmtpdFVSTDtpZihjJiZjLmNyZWF0ZU9iamVjdFVSTCYmIWQpe3ZhciBlO3RyeXtlPWMuY3JlYXRlT2JqZWN0VVJMKGEpfWNhdGNoKGYpe3JldHVybiB2b2lkIGIoZnVuY3Rpb24oKXthLmJsb2JVcmw9XCJcIixnLnJlamVjdCgpfSl9YihmdW5jdGlvbigpe2EuYmxvYlVybD1lLGUmJmcucmVzb2x2ZShlKX0pfWVsc2V7dmFyIGg9bmV3IEZpbGVSZWFkZXI7aC5vbmxvYWQ9ZnVuY3Rpb24oYyl7YihmdW5jdGlvbigpe2EuZGF0YVVybD1jLnRhcmdldC5yZXN1bHQsZy5yZXNvbHZlKGMudGFyZ2V0LnJlc3VsdCl9KX0saC5vbmVycm9yPWZ1bmN0aW9uKCl7YihmdW5jdGlvbigpe2EuZGF0YVVybD1cIlwiLGcucmVqZWN0KCl9KX0saC5yZWFkQXNEYXRhVVJMKGEpfX1lbHNlIGIoZnVuY3Rpb24oKXthW2Q/XCJkYXRhVXJsXCI6XCJibG9iVXJsXCJdPVwiXCIsZy5yZWplY3QoKX0pfSksZj1kP2EuJG5nZkRhdGFVcmxQcm9taXNlPWcucHJvbWlzZTphLiRuZ2ZCbG9iVXJsUHJvbWlzZT1nLnByb21pc2UsZltcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYVtkP1wiJG5nZkRhdGFVcmxQcm9taXNlXCI6XCIkbmdmQmxvYlVybFByb21pc2VcIl19KSxmfSxkfV0pO3ZhciBjPWFuZ3VsYXIuZWxlbWVudChcIjxzdHlsZT4ubmdmLWhpZGV7ZGlzcGxheTpub25lICFpbXBvcnRhbnR9PC9zdHlsZT5cIik7ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGNbMF0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZTcmNcIixbXCJVcGxvYWRcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJBRVwiLGxpbms6ZnVuY3Rpb24oZCxlLGYpe2IoYSxjLGQsZSxmLFwibmdmU3JjXCIsYS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZixkKSwhMSl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmQmFja2dyb3VuZFwiLFtcIlVwbG9hZFwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkFFXCIsbGluazpmdW5jdGlvbihkLGUsZil7YihhLGMsZCxlLGYsXCJuZ2ZCYWNrZ3JvdW5kXCIsYS5hdHRyR2V0dGVyKFwibmdmUmVzaXplXCIsZixkKSwhMCl9fX1dKSxuZ0ZpbGVVcGxvYWQuZGlyZWN0aXZlKFwibmdmVGh1bWJuYWlsXCIsW1wiVXBsb2FkXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiQUVcIixsaW5rOmZ1bmN0aW9uKGQsZSxmKXt2YXIgZz1hLmF0dHJHZXR0ZXIoXCJuZ2ZTaXplXCIsZixkKTtiKGEsYyxkLGUsZixcIm5nZlRodW1ibmFpbFwiLGcsYS5hdHRyR2V0dGVyKFwibmdmQXNCYWNrZ3JvdW5kXCIsZixkKSl9fX1dKX0oKSxuZ0ZpbGVVcGxvYWQuc2VydmljZShcIlVwbG9hZFZhbGlkYXRlXCIsW1wiVXBsb2FkRGF0YVVybFwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7dmFyIGI9XCJcIixjPVtdO2lmKGEubGVuZ3RoPjImJlwiL1wiPT09YVswXSYmXCIvXCI9PT1hW2EubGVuZ3RoLTFdKWI9YS5zdWJzdHJpbmcoMSxhLmxlbmd0aC0xKTtlbHNle3ZhciBlPWEuc3BsaXQoXCIsXCIpO2lmKGUubGVuZ3RoPjEpZm9yKHZhciBmPTA7ZjxlLmxlbmd0aDtmKyspe3ZhciBnPWQoZVtmXSk7Zy5yZWdleHA/KGIrPVwiKFwiK2cucmVnZXhwK1wiKVwiLGY8ZS5sZW5ndGgtMSYmKGIrPVwifFwiKSk6Yz1jLmNvbmNhdChnLmV4Y2x1ZGVzKX1lbHNlIDA9PT1hLmluZGV4T2YoXCIhXCIpP2MucHVzaChcIl4oKD8hXCIrZChhLnN1YnN0cmluZygxKSkucmVnZXhwK1wiKS4pKiRcIik6KDA9PT1hLmluZGV4T2YoXCIuXCIpJiYoYT1cIipcIithKSxiPVwiXlwiK2EucmVwbGFjZShuZXcgUmVnRXhwKFwiWy5cXFxcXFxcXCsqP1xcXFxbXFxcXF5cXFxcXSQoKXt9PSE8Pnw6XFxcXC1dXCIsXCJnXCIpLFwiXFxcXCQmXCIpK1wiJFwiLGI9Yi5yZXBsYWNlKC9cXFxcXFwqL2csXCIuKlwiKS5yZXBsYWNlKC9cXFxcXFw/L2csXCIuXCIpKX1yZXR1cm57cmVnZXhwOmIsZXhjbHVkZXM6Y319dmFyIGU9YTtyZXR1cm4gZS5yZWdpc3RlclZhbGlkYXRvcnM9ZnVuY3Rpb24oYSxiLGMsZCl7ZnVuY3Rpb24gZihhKXthbmd1bGFyLmZvckVhY2goYS4kbmdmVmFsaWRhdGlvbnMsZnVuY3Rpb24oYil7YS4kc2V0VmFsaWRpdHkoYi5uYW1lLGIudmFsaWQpfSl9YSYmKGEuJG5nZlZhbGlkYXRpb25zPVtdLGEuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihnKXtyZXR1cm4gZS5hdHRyR2V0dGVyKFwibmdmVmFsaWRhdGVMYXRlclwiLGMsZCl8fCFhLiQkbmdmVmFsaWRhdGVkPyhlLnZhbGlkYXRlKGcsYSxjLGQsITEsZnVuY3Rpb24oKXtmKGEpLGEuJCRuZ2ZWYWxpZGF0ZWQ9ITF9KSxnJiYwPT09Zy5sZW5ndGgmJihnPW51bGwpLCFifHxudWxsIT1nJiYwIT09Zy5sZW5ndGh8fGIudmFsKCkmJmIudmFsKG51bGwpKTooZihhKSxhLiQkbmdmVmFsaWRhdGVkPSExKSxnfSkpfSxlLnZhbGlkYXRlUGF0dGVybj1mdW5jdGlvbihhLGIpe2lmKCFiKXJldHVybiEwO3ZhciBjPWQoYiksZT0hMDtpZihjLnJlZ2V4cCYmYy5yZWdleHAubGVuZ3RoKXt2YXIgZj1uZXcgUmVnRXhwKGMucmVnZXhwLFwiaVwiKTtlPW51bGwhPWEudHlwZSYmZi50ZXN0KGEudHlwZSl8fG51bGwhPWEubmFtZSYmZi50ZXN0KGEubmFtZSl9Zm9yKHZhciBnPWMuZXhjbHVkZXMubGVuZ3RoO2ctLTspe3ZhciBoPW5ldyBSZWdFeHAoYy5leGNsdWRlc1tnXSxcImlcIik7ZT1lJiYobnVsbD09YS50eXBlfHxoLnRlc3QoYS50eXBlKSkmJihudWxsPT1hLm5hbWV8fGgudGVzdChhLm5hbWUpKX1yZXR1cm4gZX0sZS52YWxpZGF0ZT1mdW5jdGlvbihhLGIsYyxkLGYsZyl7ZnVuY3Rpb24gaChjLGQsZSl7aWYoYSl7Zm9yKHZhciBmPVwibmdmXCIrY1swXS50b1VwcGVyQ2FzZSgpK2Muc3Vic3RyKDEpLGc9YS5sZW5ndGgsaD1udWxsO2ctLTspe3ZhciBpPWFbZ10saz1qKGYseyRmaWxlOml9KTtudWxsPT1rJiYoaz1kKGooXCJuZ2ZWYWxpZGF0ZVwiKXx8e30pLGg9bnVsbD09aD8hMDpoKSxudWxsIT1rJiYoZShpLGspfHwoaS4kZXJyb3I9YyxpLiRlcnJvclBhcmFtPWssYS5zcGxpY2UoZywxKSxoPSExKSl9bnVsbCE9PWgmJmIuJG5nZlZhbGlkYXRpb25zLnB1c2goe25hbWU6Yyx2YWxpZDpofSl9fWZ1bmN0aW9uIGkoYyxkLGUsZixoKXtpZihhKXt2YXIgaT0wLGw9ITEsbT1cIm5nZlwiK2NbMF0udG9VcHBlckNhc2UoKStjLnN1YnN0cigxKTthPXZvaWQgMD09PWEubGVuZ3RoP1thXTphLGFuZ3VsYXIuZm9yRWFjaChhLGZ1bmN0aW9uKGEpe2lmKDAhPT1hLnR5cGUuc2VhcmNoKGUpKXJldHVybiEwO3ZhciBuPWoobSx7JGZpbGU6YX0pfHxkKGooXCJuZ2ZWYWxpZGF0ZVwiLHskZmlsZTphfSl8fHt9KTtuJiYoaysrLGkrKyxmKGEsbikudGhlbihmdW5jdGlvbihiKXtoKGIsbil8fChhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0sZnVuY3Rpb24oKXtqKFwibmdmVmFsaWRhdGVGb3JjZVwiLHskZmlsZTphfSkmJihhLiRlcnJvcj1jLGEuJGVycm9yUGFyYW09bixsPSEwKX0pW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2stLSxpLS0saXx8Yi4kbmdmVmFsaWRhdGlvbnMucHVzaCh7bmFtZTpjLHZhbGlkOiFsfSksa3x8Zy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpfSkpfSl9fWI9Ynx8e30sYi4kbmdmVmFsaWRhdGlvbnM9Yi4kbmdmVmFsaWRhdGlvbnN8fFtdLGFuZ3VsYXIuZm9yRWFjaChiLiRuZ2ZWYWxpZGF0aW9ucyxmdW5jdGlvbihhKXthLnZhbGlkPSEwfSk7dmFyIGo9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZS5hdHRyR2V0dGVyKGEsYyxkLGIpfTtpZihmKXJldHVybiB2b2lkIGcuY2FsbChiKTtpZihiLiQkbmdmVmFsaWRhdGVkPSEwLG51bGw9PWF8fDA9PT1hLmxlbmd0aClyZXR1cm4gdm9pZCBnLmNhbGwoYik7aWYoYT12b2lkIDA9PT1hLmxlbmd0aD9bYV06YS5zbGljZSgwKSxoKFwicGF0dGVyblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnBhdHRlcm59LGUudmFsaWRhdGVQYXR0ZXJuKSxoKFwibWluU2l6ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnNpemUmJmEuc2l6ZS5taW59LGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuc2l6ZT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaChcIm1heFNpemVcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5zaXplJiZhLnNpemUubWF4fSxmdW5jdGlvbihhLGIpe3JldHVybiBhLnNpemU8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGgoXCJ2YWxpZGF0ZUZuXCIsZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj09PSEwfHxudWxsPT09Ynx8XCJcIj09PWJ9KSwhYS5sZW5ndGgpcmV0dXJuIHZvaWQgZy5jYWxsKGIsYi4kbmdmVmFsaWRhdGlvbnMpO3ZhciBrPTA7aShcIm1heEhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0PD1ifSksaShcIm1pbkhlaWdodFwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmhlaWdodCYmYS5oZWlnaHQubWlufSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuaGVpZ2h0Pj1ifSksaShcIm1heFdpZHRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEud2lkdGgmJmEud2lkdGgubWF4fSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEud2lkdGg8PWJ9KSxpKFwibWluV2lkdGhcIixmdW5jdGlvbihhKXtyZXR1cm4gYS53aWR0aCYmYS53aWR0aC5taW59LC9pbWFnZS8sdGhpcy5pbWFnZURpbWVuc2lvbnMsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS53aWR0aD49Yn0pLGkoXCJyYXRpb1wiLGZ1bmN0aW9uKGEpe3JldHVybiBhLnJhdGlvfSwvaW1hZ2UvLHRoaXMuaW1hZ2VEaW1lbnNpb25zLGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPWIudG9TdHJpbmcoKS5zcGxpdChcIixcIiksZD0hMSxlPTA7ZTxjLmxlbmd0aDtlKyspe3ZhciBmPWNbZV0sZz1mLnNlYXJjaCgveC9pKTtmPWc+LTE/cGFyc2VGbG9hdChmLnN1YnN0cmluZygwLGcpKS9wYXJzZUZsb2F0KGYuc3Vic3RyaW5nKGcrMSkpOnBhcnNlRmxvYXQoZiksTWF0aC5hYnMoYS53aWR0aC9hLmhlaWdodC1mKTwxZS00JiYoZD0hMCl9cmV0dXJuIGR9KSxpKFwibWF4RHVyYXRpb25cIixmdW5jdGlvbihhKXtyZXR1cm4gYS5kdXJhdGlvbiYmYS5kdXJhdGlvbi5tYXh9LC9hdWRpb3x2aWRlby8sdGhpcy5tZWRpYUR1cmF0aW9uLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE8PWUudHJhbnNsYXRlU2NhbGFycyhiKX0pLGkoXCJtaW5EdXJhdGlvblwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmR1cmF0aW9uJiZhLmR1cmF0aW9uLm1pbn0sL2F1ZGlvfHZpZGVvLyx0aGlzLm1lZGlhRHVyYXRpb24sZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT49ZS50cmFuc2xhdGVTY2FsYXJzKGIpfSksaShcInZhbGlkYXRlQXN5bmNGblwiLGZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LC8uLyxmdW5jdGlvbihhLGIpe3JldHVybiBifSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PSEwfHxudWxsPT09YXx8XCJcIj09PWF9KSxrfHxnLmNhbGwoYixiLiRuZ2ZWYWxpZGF0aW9ucyl9LGUuaW1hZ2VEaW1lbnNpb25zPWZ1bmN0aW9uKGEpe2lmKGEud2lkdGgmJmEuaGVpZ2h0KXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoe3dpZHRoOmEud2lkdGgsaGVpZ2h0OmEuaGVpZ2h0fSl9KSxkLnByb21pc2V9aWYoYS4kbmdmRGltZW5zaW9uUHJvbWlzZSlyZXR1cm4gYS4kbmdmRGltZW5zaW9uUHJvbWlzZTt2YXIgZj1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtyZXR1cm4gMCE9PWEudHlwZS5pbmRleE9mKFwiaW1hZ2VcIik/dm9pZCBmLnJlamVjdChcIm5vdCBpbWFnZVwiKTp2b2lkIGUuZGF0YVVybChhKS50aGVuKGZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoKXt2YXIgYj1oWzBdLmNsaWVudFdpZHRoLGM9aFswXS5jbGllbnRIZWlnaHQ7aC5yZW1vdmUoKSxhLndpZHRoPWIsYS5oZWlnaHQ9YyxmLnJlc29sdmUoe3dpZHRoOmIsaGVpZ2h0OmN9KX1mdW5jdGlvbiBlKCl7aC5yZW1vdmUoKSxmLnJlamVjdChcImxvYWQgZXJyb3JcIil9ZnVuY3Rpb24gZygpe2MoZnVuY3Rpb24oKXtoWzBdLnBhcmVudE5vZGUmJihoWzBdLmNsaWVudFdpZHRoP2QoKTppPjEwP2UoKTpnKCkpfSwxZTMpfXZhciBoPWFuZ3VsYXIuZWxlbWVudChcIjxpbWc+XCIpLmF0dHIoXCJzcmNcIixiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIikuY3NzKFwicG9zaXRpb25cIixcImZpeGVkXCIpO2gub24oXCJsb2FkXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSkuYXBwZW5kKGgpfSxmdW5jdGlvbigpe2YucmVqZWN0KFwibG9hZCBlcnJvclwiKX0pfSksYS4kbmdmRGltZW5zaW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRGltZW5zaW9uUHJvbWlzZVtcImZpbmFsbHlcIl0oZnVuY3Rpb24oKXtkZWxldGUgYS4kbmdmRGltZW5zaW9uUHJvbWlzZX0pLGEuJG5nZkRpbWVuc2lvblByb21pc2V9LGUubWVkaWFEdXJhdGlvbj1mdW5jdGlvbihhKXtpZihhLmR1cmF0aW9uKXt2YXIgZD1iLmRlZmVyKCk7cmV0dXJuIGMoZnVuY3Rpb24oKXtkLnJlc29sdmUoYS5kdXJhdGlvbil9KSxkLnByb21pc2V9aWYoYS4kbmdmRHVyYXRpb25Qcm9taXNlKXJldHVybiBhLiRuZ2ZEdXJhdGlvblByb21pc2U7dmFyIGY9Yi5kZWZlcigpO3JldHVybiBjKGZ1bmN0aW9uKCl7cmV0dXJuIDAhPT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpJiYwIT09YS50eXBlLmluZGV4T2YoXCJ2aWRlb1wiKT92b2lkIGYucmVqZWN0KFwibm90IG1lZGlhXCIpOnZvaWQgZS5kYXRhVXJsKGEpLnRoZW4oZnVuY3Rpb24oYil7ZnVuY3Rpb24gZCgpe3ZhciBiPWhbMF0uZHVyYXRpb247YS5kdXJhdGlvbj1iLGgucmVtb3ZlKCksZi5yZXNvbHZlKGIpfWZ1bmN0aW9uIGUoKXtoLnJlbW92ZSgpLGYucmVqZWN0KFwibG9hZCBlcnJvclwiKX1mdW5jdGlvbiBnKCl7YyhmdW5jdGlvbigpe2hbMF0ucGFyZW50Tm9kZSYmKGhbMF0uZHVyYXRpb24/ZCgpOmk+MTA/ZSgpOmcoKSl9LDFlMyl9dmFyIGg9YW5ndWxhci5lbGVtZW50KDA9PT1hLnR5cGUuaW5kZXhPZihcImF1ZGlvXCIpP1wiPGF1ZGlvPlwiOlwiPHZpZGVvPlwiKS5hdHRyKFwic3JjXCIsYikuY3NzKFwidmlzaWJpbGl0eVwiLFwibm9uZVwiKS5jc3MoXCJwb3NpdGlvblwiLFwiZml4ZWRcIik7aC5vbihcImxvYWRlZG1ldGFkYXRhXCIsZCksaC5vbihcImVycm9yXCIsZSk7dmFyIGk9MDtnKCksYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLmFwcGVuZChoKX0sZnVuY3Rpb24oKXtmLnJlamVjdChcImxvYWQgZXJyb3JcIil9KX0pLGEuJG5nZkR1cmF0aW9uUHJvbWlzZT1mLnByb21pc2UsYS4kbmdmRHVyYXRpb25Qcm9taXNlW1wiZmluYWxseVwiXShmdW5jdGlvbigpe2RlbGV0ZSBhLiRuZ2ZEdXJhdGlvblByb21pc2V9KSxhLiRuZ2ZEdXJhdGlvblByb21pc2V9LGV9XSksbmdGaWxlVXBsb2FkLnNlcnZpY2UoXCJVcGxvYWRSZXNpemVcIixbXCJVcGxvYWRWYWxpZGF0ZVwiLFwiJHFcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEsZT1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1NYXRoLm1pbihjL2EsZC9iKTtyZXR1cm57d2lkdGg6YSplLGhlaWdodDpiKmV9fSxmPWZ1bmN0aW9uKGEsYyxkLGYsZyl7dmFyIGg9Yi5kZWZlcigpLGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7cmV0dXJuIDA9PT1jJiYoYz1qLndpZHRoLGQ9ai5oZWlnaHQpLGoub25sb2FkPWZ1bmN0aW9uKCl7dHJ5e3ZhciBhPWUoai53aWR0aCxqLmhlaWdodCxjLGQpO2kud2lkdGg9YS53aWR0aCxpLmhlaWdodD1hLmhlaWdodDt2YXIgYj1pLmdldENvbnRleHQoXCIyZFwiKTtiLmRyYXdJbWFnZShqLDAsMCxhLndpZHRoLGEuaGVpZ2h0KSxoLnJlc29sdmUoaS50b0RhdGFVUkwoZ3x8XCJpbWFnZS9XZWJQXCIsZnx8MSkpfWNhdGNoKGspe2gucmVqZWN0KGspfX0sai5vbmVycm9yPWZ1bmN0aW9uKCl7aC5yZWplY3QoKX0sai5zcmM9YSxoLnByb21pc2V9LGc9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPWEuc3BsaXQoXCIsXCIpLGM9YlswXS5tYXRjaCgvOiguKj8pOy8pWzFdLGQ9YXRvYihiWzFdKSxlPWQubGVuZ3RoLGY9bmV3IFVpbnQ4QXJyYXkoZSk7ZS0tOylmW2VdPWQuY2hhckNvZGVBdChlKTtyZXR1cm4gbmV3IEJsb2IoW2ZdLHt0eXBlOmN9KX07cmV0dXJuIGQuaXNSZXNpemVTdXBwb3J0ZWQ9ZnVuY3Rpb24oKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO3JldHVybiB3aW5kb3cuYXRvYiYmYS5nZXRDb250ZXh0JiZhLmdldENvbnRleHQoXCIyZFwiKX0sZC5yZXNpemU9ZnVuY3Rpb24oYSxlLGgsaSl7dmFyIGo9Yi5kZWZlcigpO3JldHVybiAwIT09YS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKT8oYyhmdW5jdGlvbigpe2oucmVzb2x2ZShcIk9ubHkgaW1hZ2VzIGFyZSBhbGxvd2VkIGZvciByZXNpemluZyFcIil9KSxqLnByb21pc2UpOihkLmRhdGFVcmwoYSwhMCkudGhlbihmdW5jdGlvbihiKXtmKGIsZSxoLGksYS50eXBlKS50aGVuKGZ1bmN0aW9uKGIpe3ZhciBjPWcoYik7Yy5uYW1lPWEubmFtZSxqLnJlc29sdmUoYyl9LGZ1bmN0aW9uKCl7ai5yZWplY3QoKX0pfSxmdW5jdGlvbigpe2oucmVqZWN0KCl9KSxqLnByb21pc2UpfSxkfV0pLGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShhLGMsZCxlLGYsZyxoLGkpe2Z1bmN0aW9uIGooKXtyZXR1cm4gYy5hdHRyKFwiZGlzYWJsZWRcIil8fG4oXCJuZ2ZEcm9wRGlzYWJsZWRcIixhKX1mdW5jdGlvbiBrKGEsYixjLGQpe3ZhciBlPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIsYSx7JGV2ZW50OmN9KSxmPW4oXCJuZ2ZEcmFnT3ZlckNsYXNzXCIpfHxcImRyYWdvdmVyXCI7aWYoYW5ndWxhci5pc1N0cmluZyhlKSlyZXR1cm4gdm9pZCBkKGUpO2lmKGUmJihlLmRlbGF5JiYocj1lLmRlbGF5KSxlLmFjY2VwdHx8ZS5yZWplY3QpKXt2YXIgZz1jLmRhdGFUcmFuc2Zlci5pdGVtcztpZihudWxsIT1nKWZvcih2YXIgaD1uKFwibmdmUGF0dGVyblwiLGEseyRldmVudDpjfSksaj0wO2o8Zy5sZW5ndGg7aisrKWlmKFwiZmlsZVwiPT09Z1tqXS5raW5kfHxcIlwiPT09Z1tqXS5raW5kKXtpZighaS52YWxpZGF0ZVBhdHRlcm4oZ1tqXSxoKSl7Zj1lLnJlamVjdDticmVha31mPWUuYWNjZXB0fX1kKGYpfWZ1bmN0aW9uIGwoYSxiLGMsZCl7ZnVuY3Rpb24gZShhLGIsYyl7aWYobnVsbCE9YilpZihiLmlzRGlyZWN0b3J5KXt2YXIgZD0oY3x8XCJcIikrYi5uYW1lO2EucHVzaCh7bmFtZTpiLm5hbWUsdHlwZTpcImRpcmVjdG9yeVwiLHBhdGg6ZH0pO3ZhciBmPWIuY3JlYXRlUmVhZGVyKCksZz1bXTtpKys7dmFyIGg9ZnVuY3Rpb24oKXtmLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGQpe3RyeXtpZihkLmxlbmd0aClnPWcuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGR8fFtdLDApKSxoKCk7ZWxzZXtmb3IodmFyIGY9MDtmPGcubGVuZ3RoO2YrKyllKGEsZ1tmXSwoYz9jOlwiXCIpK2IubmFtZStcIi9cIik7aS0tfX1jYXRjaChqKXtpLS0sY29uc29sZS5lcnJvcihqKX19LGZ1bmN0aW9uKCl7aS0tfSl9O2goKX1lbHNlIGkrKyxiLmZpbGUoZnVuY3Rpb24oYil7dHJ5e2ktLSxiLnBhdGg9KGM/YzpcIlwiKStiLm5hbWUsYS5wdXNoKGIpfWNhdGNoKGQpe2ktLSxjb25zb2xlLmVycm9yKGQpfX0sZnVuY3Rpb24oKXtpLS19KX12YXIgZj1bXSxpPTAsaj1hLmRhdGFUcmFuc2Zlci5pdGVtcztpZihqJiZqLmxlbmd0aD4wJiZcImZpbGVcIiE9PWgucHJvdG9jb2woKSlmb3IodmFyIGs9MDtrPGoubGVuZ3RoO2srKyl7aWYoaltrXS53ZWJraXRHZXRBc0VudHJ5JiZqW2tdLndlYmtpdEdldEFzRW50cnkoKSYmaltrXS53ZWJraXRHZXRBc0VudHJ5KCkuaXNEaXJlY3Rvcnkpe3ZhciBsPWpba10ud2Via2l0R2V0QXNFbnRyeSgpO2lmKGwuaXNEaXJlY3RvcnkmJiFjKWNvbnRpbnVlO251bGwhPWwmJmUoZixsKX1lbHNle3ZhciBtPWpba10uZ2V0QXNGaWxlKCk7bnVsbCE9bSYmZi5wdXNoKG0pfWlmKCFkJiZmLmxlbmd0aD4wKWJyZWFrfWVsc2V7dmFyIG49YS5kYXRhVHJhbnNmZXIuZmlsZXM7aWYobnVsbCE9bilmb3IodmFyIG89MDtvPG4ubGVuZ3RoJiYoZi5wdXNoKG4uaXRlbShvKSksZHx8IShmLmxlbmd0aD4wKSk7bysrKTt9dmFyIHA9MDshZnVuY3Rpb24gcShhKXtnKGZ1bmN0aW9uKCl7aWYoaSkxMCpwKys8MmU0JiZxKDEwKTtlbHNle2lmKCFkJiZmLmxlbmd0aD4xKXtmb3Ioaz0wO1wiZGlyZWN0b3J5XCI9PT1mW2tdLnR5cGU7KWsrKztmPVtmW2tdXX1iKGYpfX0sYXx8MCl9KCl9dmFyIG09YigpLG49ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBpLmF0dHJHZXR0ZXIoYSxkLGIsYyl9O2lmKG4oXCJkcm9wQXZhaWxhYmxlXCIpJiZnKGZ1bmN0aW9uKCl7YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0/YVtuKFwiZHJvcEF2YWlsYWJsZVwiKV0udmFsdWU9bTphW24oXCJkcm9wQXZhaWxhYmxlXCIpXT1tfSksIW0pcmV0dXJuIHZvaWQobihcIm5nZkhpZGVPbkRyb3BOb3RBdmFpbGFibGVcIixhKT09PSEwJiZjLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIikpO2kucmVnaXN0ZXJWYWxpZGF0b3JzKGUsbnVsbCxkLGEpO3ZhciBvLHA9bnVsbCxxPWYobihcIm5nZlN0b3BQcm9wYWdhdGlvblwiKSkscj0xO2NbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsZnVuY3Rpb24oYil7aWYoIWooKSl7aWYoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCksbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpPi0xKXt2YXIgZT1iLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkO2IuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3Q9XCJtb3ZlXCI9PT1lfHxcImxpbmtNb3ZlXCI9PT1lP1wibW92ZVwiOlwiY29weVwifWcuY2FuY2VsKHApLG98fChvPVwiQ1wiLGsoYSxkLGIsZnVuY3Rpb24oYSl7bz1hLGMuYWRkQ2xhc3Mobyl9KSl9fSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsZnVuY3Rpb24oYil7aigpfHwoYi5wcmV2ZW50RGVmYXVsdCgpLHEoYSkmJmIuc3RvcFByb3BhZ2F0aW9uKCkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsZnVuY3Rpb24oKXtqKCl8fChwPWcoZnVuY3Rpb24oKXtvJiZjLnJlbW92ZUNsYXNzKG8pLG89bnVsbH0scnx8MSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLGZ1bmN0aW9uKGIpe2ooKXx8KGIucHJldmVudERlZmF1bHQoKSxxKGEpJiZiLnN0b3BQcm9wYWdhdGlvbigpLG8mJmMucmVtb3ZlQ2xhc3Mobyksbz1udWxsLGwoYixmdW5jdGlvbihjKXtpLnVwZGF0ZU1vZGVsKGUsZCxhLG4oXCJuZ2ZDaGFuZ2VcIil8fG4oXCJuZ2ZEcm9wXCIpLGMsYil9LG4oXCJuZ2ZBbGxvd0RpclwiLGEpIT09ITEsbihcIm11bHRpcGxlXCIpfHxuKFwibmdmTXVsdGlwbGVcIixhKSkpfSwhMSksY1swXS5hZGRFdmVudExpc3RlbmVyKFwicGFzdGVcIixmdW5jdGlvbihiKXtpZighaigpKXt2YXIgYz1bXSxmPWIuY2xpcGJvYXJkRGF0YXx8Yi5vcmlnaW5hbEV2ZW50LmNsaXBib2FyZERhdGE7aWYoZiYmZi5pdGVtcyl7Zm9yKHZhciBnPTA7ZzxmLml0ZW1zLmxlbmd0aDtnKyspLTEhPT1mLml0ZW1zW2ddLnR5cGUuaW5kZXhPZihcImltYWdlXCIpJiZjLnB1c2goZi5pdGVtc1tnXS5nZXRBc0ZpbGUoKSk7aS51cGRhdGVNb2RlbChlLGQsYSxuKFwibmdmQ2hhbmdlXCIpfHxuKFwibmdmRHJvcFwiKSxjLGIpfX19LCExKX1mdW5jdGlvbiBiKCl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtyZXR1cm5cImRyYWdnYWJsZVwiaW4gYSYmXCJvbmRyb3BcImluIGEmJiEvRWRnZVxcLzEyLi9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9bmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZkRyb3BcIixbXCIkcGFyc2VcIixcIiR0aW1lb3V0XCIsXCIkbG9jYXRpb25cIixcIlVwbG9hZFwiLGZ1bmN0aW9uKGIsYyxkLGUpe3JldHVybntyZXN0cmljdDpcIkFFQ1wiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oZixnLGgsaSl7YShmLGcsaCxpLGIsYyxkLGUpfX19XSksbmdGaWxlVXBsb2FkLmRpcmVjdGl2ZShcIm5nZk5vRmlsZURyb3BcIixmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihhLGMpe2IoKSYmYy5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpfX0pLG5nRmlsZVVwbG9hZC5kaXJlY3RpdmUoXCJuZ2ZEcm9wQXZhaWxhYmxlXCIsW1wiJHBhcnNlXCIsXCIkdGltZW91dFwiLFwiVXBsb2FkXCIsZnVuY3Rpb24oYSxjLGQpe3JldHVybiBmdW5jdGlvbihlLGYsZyl7aWYoYigpKXt2YXIgaD1hKGQuYXR0ckdldHRlcihcIm5nZkRyb3BBdmFpbGFibGVcIixnKSk7YyhmdW5jdGlvbigpe2goZSksaC5hc3NpZ24mJmguYXNzaWduKGUsITApfSl9fX1dKX0oKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
