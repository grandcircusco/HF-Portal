/**
* CompanyProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('CompanyProfileController', CompanyProfileController);

    CompanyProfileController.$inject = ['$scope'];

    /**
    * @namespace CompanyProfileController
    */
    function CompanyProfileController($scope) {
        var vm = this;

        $scope.company= {
            img:"public/assets/images/placeholder-hi.png"
        };

       

        $(".js-example-tokenizer").select2({
          tags: true,
          tokenSeparators: [',', ' ']
          
        });

        

        activate();

        function activate() {
            console.log('activated profile controller!');
            //Profile.all();
        };
        
        $scope.update= function() {
            $scope.company.skills = $(".js-example-tokenizer").val();
            console.log($scope.company);
            
        };


    }



})();
