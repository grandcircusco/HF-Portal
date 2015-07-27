/**
* CompaniesController
* @namespace app.companies.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.companies.controllers')
    .controller('CompaniesController', CompaniesController)
    .controller('CompaniesModalInstanceController', CompaniesModalInstanceController)
    .directive('companyView', CompanyView);

  CompaniesController.$inject = ['$scope', 'Companies'];
  CompaniesController.$inject = ['$scope', '$modalInstance', 'company'];

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

  function CompaniesModalInstanceController($scope, $modalInstance, company){

    $scope.company = company;

    $scope.ok = function () {
      $modalInstance.close($scope.company);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

  function CompanyView(){

    return {
      restrict: 'AE',
      replace: 'true',
      templateUrl:'src/views/partials/company_detail_view_template.html'
    };
  }

})();
