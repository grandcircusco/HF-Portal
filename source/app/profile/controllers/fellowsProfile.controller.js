/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope) {
        var vm = this;

        $scope.fellow = {
            bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
            img:"public/assets/images/placeholder-hi.png"
        };

        Fellows.get(17).success(function(fellow){

            $scope.fellow = fellow;

        });


        activate();

        function activate() {
            console.log('activated profile controller!');
            //Profile.all();
        };

        $scope.update= function() {
            console.log($scope.fellow);
        };

    }



})();
