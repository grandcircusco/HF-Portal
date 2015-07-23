
/**
 * app.routes
 * @desc    contains the routes for the app
 */

(function () {
  'use strict';

  angular
    .module('app',
      'app.fellows',
      'app.companies',
      ['ngRoute']);
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
   *   * @name config
   *     * @desc Define valid application routes
   *       */
  function config($routeProvider) {
	$routeProvider
     .when('/', {
                templateUrl : 'source/app/home/home.html',
                controller  : 'routingController'
      })
      .when('/fellows', {
        controller: 'routingController',
        templateUrl: 'source/app/fellows/fellows.html'
      })
      .when('/companies', {
        controller: 'routingController',
        templateUrl: 'source/app/companies/company_view.html'
      })
      .when('/register', {
        controller: 'routingController',
        templateUrl: 'register.html'
      })
      .when('/fellow/:id', {
        controller: 'routingController',
        templateUrl: 'source/app/fellows/fellow_detail_view.html'
      })
      .when('/company/:id', {
        controller: 'routingController',
        templateUrl: 'source/app/companies/company_detail_view.html'
      })
      .otherwise({ redirectTo: '/' });

  }

})();

app.controller('routingController', function() {

});
