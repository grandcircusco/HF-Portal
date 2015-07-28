
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
            controller  : 'routingController'
        })
        .when('/fellows', {
            controller: 'routingController',
            templateUrl: 'source/app/fellows/fellows.html'
        })
        .when('/companies', {
            controller: 'CompaniesController',
            templateUrl: 'source/app/companies/company_view.html'
        })
        .when('/register', {
            controller: 'routingController',
            templateUrl: 'register.html'
        })
        .when('/fellows/:id', {
            controller: 'routingController',
            templateUrl: 'source/app/fellows/fellow_detail_view.html'
        })
        .when('/companies/:id', {
            controller: 'routingController',
            templateUrl: 'source/app/companies/company_detail_view.html'
        })
        .otherwise({ redirectTo: '/' });

});


app.controller('routingController', function() {

});

