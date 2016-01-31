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
