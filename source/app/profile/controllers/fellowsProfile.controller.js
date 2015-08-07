/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope', '$location', 'Fellows', 'Tags', 'User'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, Fellows, Tags, User) {
        var vm = this;

        // Probably can handle this in the routes or with middleware or some kind
        if( !User.isUserLoggedIn() ) {

            $location.path("/");
            return;
        }

        // Make sure current user is a Fellow
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Fellow" ){

            $location.path("/profile");
            return;
        }

        Fellows.get(currentUser.id).success(function(fellow){

            $scope.fellow = fellow;

            Tags.all().success(function(tags){


                var data = [];
                tags.forEach(function(tag){

                    var item = {

                        id: tag.id,
                        text: tag.name
                    };
                    data.push(item);
                });

                var vals = [];
                if( typeof fellow.tags !== 'undefined' ) {
                    fellow.tags.forEach(function (tag) {

                        vals.push(tag.id);
                    });
                }

                $("#tags").select2({
                    //tags: true,
                    data: data
                }).select2('val', vals);

            });

        });

        activate();

        function activate() {
            //console.log('activated profile controller!');
            //Profile.all();
        }

        $scope.update= function() {

            // console.log($scope.fellow);
            $scope.fellow.tags = $("#tags").val();

            // send fellows info to API via Service
            Fellows.update($scope.fellow, tempID).success(function(data){

                // ** Trigger Success message here
            });
        };
    }

})();
