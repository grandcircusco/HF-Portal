/**
 * CompaniesController
 * @namespace app.companies.controllers
 */
(function () {
  'use strict';

  angular
    .module('app.companies.controllers')
    .controller('CompaniesController', CompaniesController)
    .controller('CompaniesModalInstanceController', CompaniesModalInstanceController);

  CompaniesController.$inject = ['$scope', '$modal', 'Companies'];
  CompaniesModalInstanceController.$inject = ['$scope', '$modalInstance',
    'company', 'CompanyVotes', 'User'];

  /**
   * @namespace CompaniesController
   */
  function CompaniesController($scope, $modal, Companies) {

    var vm = this;

    activate();
    Companies.all().success( function(companies){

          $scope.companies = companies;
          //console.log(companies);
    });

    $scope.openModal = function (company) {

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

      //modalInstance.result.then(function (selectedItem) {
      //	$scope.selected = selectedItem;
      //}, function () {
      //	$log.info('Modal dismissed at: ' + new Date());
      //});
    };

    function activate() {

      //console.log('activated companies controller!');
    }

  }

  function CompaniesModalInstanceController($scope, $modalInstance, company, CompanyVotes, User) {

    $scope.company = company;

    $scope.ok = function () {
      $modalInstance.close($scope.company);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.vote = function vote(company) {
      var current = User.getCurrentUser();
      if(current.userType === "Fellow") {
        return CompanyVotes.create(company.id, current.id);
      }
    };
  }

})();
