/**
 * CompaniesController
 * @namespace app.companies.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.companies.controllers')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = [ '$routeParams', '$scope', '$modal', 'Companies'];

    /**
     * @namespace CompaniesController
     */
    function CompanyController( $routeParams, $scope, $modal, Companies) {

        activate();

        function activate() {
            //console.log('activated companies controller!');
        }

        Companies.get($routeParams.company_id).success(function (company) {

            console.log( company );

            $scope.company = company;
        });



    }

})();
