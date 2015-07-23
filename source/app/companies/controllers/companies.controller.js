/**
* CompaniesController
* @namespace app.companies.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.companies.controllers')
    .controller('CompaniesController', CompaniesController);

  CompaniesController.$inject = ['$scope', 'Companies'];

  /**
  * @namespace CompaniesController
  */
  function CompaniesController($scope, Companies) {
    var vm = this;

    activate();

    function activate() {
      console.log('activated companies controller!')
      //Companies.all();
    }

  }
})();
