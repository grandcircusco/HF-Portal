/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope', 'Fellows'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope , Fellows) {
        var vm = this;

        var tempID = 2; //TODO change to not hard coded


        Fellows.get(tempID).success(function(fellow){
            $scope.fellow = fellow;
        });

        // $(document).ready(function() {
        //       $(".js-example-basic-multiple").select2({
        //             maximumSelectionLength: 3
        //         });
        // });

        $(".js-example-tokenizer").select2({
          tags: true,
          tokenSeparators: [',', ' ']
          
        });



        activate();

        function activate() {
            console.log('activated profile controller!');
            //Profile.all();

        }

        $scope.update= function() {

            // console.log($scope.fellow);
            $scope.fellow.skills = $(".js-example-tokenizer").val();

            // send fellows info to API via Service
            Fellows.update($scope.fellow, tempID);

        };
        


    }



})();
