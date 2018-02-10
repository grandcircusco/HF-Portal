/**
 * CompaniesController
 * @namespace app.companies.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.companies.controllers')
        .controller('CompaniesController', CompaniesController);

    CompaniesController.$inject = ['$scope', '$modal', 'Companies', 'User'];

    /**
     * @namespace CompaniesController
     */
    function CompaniesController($scope, $modal, Companies, User) {

        activate();

        function activate() {
            console.log('activated companies controller!');
        }

        $scope.companies = [];

        Companies.all().success(function (companies) {

            let userType = User.getCurrentUser().userType;
            console.dir(companies);
            if (User.isUserAdmin() || User.isUserCompany()) {
              // show the admin and companies all the companies
              $scope.companies = companies;
            } else if (User.isUserFellowOrIntern()){
              // only show companies if target user type is viewing
              for (let co of companies) {
                if (co.fellow_type === "Any" || co.fellow_type === userType) {
                  $scope.companies.push(co);
                }
              }
            } 
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
