
/**
 * app.routes
 * @desc    contains the routes for the app
 */

var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'app.companies', 'app.fellows']);

/**
 *   * @name config
 *     * @desc Define valid application routes
 *       */
app.config(function($routeProvider){

    $routeProvider
        .when('/', {
            templateUrl : 'source/app/home/home.html',
            controller  : 'RoutingController'
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
            controller: 'AdminProfileController',
            templateUrl: 'source/app/profile/profile.html'

        })
        //.when('/fellows/:id', {
        //    controller: 'routingController',
        //    templateUrl: 'source/app/fellows/fellow_detail_view.html'
        //})
        //.when('/companies/:id', {
        //    controller: 'routingController',
        //    templateUrl: 'source/app/companies/company_detail_view.html'
        //})
        .otherwise({ redirectTo: '/' });

});

app.controller('RoutingController', RoutingController)
  .controller('LoginModalInstanceController', LoginModalInstanceController)

    RoutingController.$inject = ['$scope', '$modal'];
    LoginModalInstanceController.$inject = ['$scope', '$modalInstance'];

    function RoutingController($scope, $modal) {

      $scope.openModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'source/app/profile/partials/login_detail_view.html',
            controller: 'LoginModalInstanceController',
            size: 'sm',
            resolve: {
                function(){

                }
            }
        });
      }
   }

    function LoginModalInstanceController ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
