/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';
    console.log("this is FellowsProfileController");

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope', 'Fellows', 'Tags'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope , Fellows, Tags) {
        var vm = this;

        var tempID = 1; //TODO change to not hard coded

        Fellows.get(tempID).success(function(fellow){

            $scope.fellow = fellow;

            Tags.all().success(function(tags){


                var data = [];
                tags.forEach(function(tag){

                    var item = {

                        id: tag.id,
                        text: tag.name
                    };
                    data.push(item)
                });

                var vals = [];
                fellow.tags.forEach(function(tag){

                    vals.push(tag.id);
                });

                $("#tags").select2({
                    //tags: true,
                    data: data
                }).select2('val', vals);

            });


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
            $scope.fellow.tags = $(".js-example-tokenizer").val();

            // send fellows info to API via Service
            Fellows.update($scope.fellow, tempID);

        };
        


    }



})();
