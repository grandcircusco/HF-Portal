/**
 * app.routes
 * @desc    contains the routes for the app
 */

(function () {
  'use strict';

  angular
    .module('app.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
   *   * @name config
   *     * @desc Define valid application routes
   *       */
  function config($routeProvider) {
    /*
    $routeProvider.when('/register', {
      controller: 'FellowsController',
      controllerAs: 'vm',
      templateUrl: '../views/fellows/fellows.html'

    }).otherwise('/');
    */

  }

})();
