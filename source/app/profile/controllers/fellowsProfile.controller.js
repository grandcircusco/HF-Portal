/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope', '$location', 'Fellows', 'Tags', 'User', 'Upload'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, Fellows, Tags, User, Upload) {
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

        Fellows.getByUserId(currentUser.id).success(function(fellow){

            //console.log(fellow);

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

                //console.log(fellow.tags);
                //$scope.tags = fellow.tags;

                // https://github.com/angular-ui/ui-select2/blob/master/demo/app.js

                $("select#tags").select2({
                    //tags: true,
                    data: data,
                    tokenSeparators: [',',' ']
                });


            });

        });

        activate();

        function activate() {
            //console.log('activated profile controller!');
            //Profile.all();
        }

        $scope.update = function(fellow, file) {

            //console.log(fellow);

            // console.log($scope.fellow);
            fellow.tags = $("#tags").val();
            //console.log(fellow.tags);

            // send fellows info to API via Service
            Fellows.update(fellow).success(function(newFellowData){

                // ** Trigger Success message here
                fellow = newFellowData;

                // update profile photo
                $("#profile-photo").attr('src', fellow.image_url);
            });
        };

        //$scope.upload = function (file) {
        //    Upload.upload({
        //        url: '/api/v1/fellows/uploads/'+currentUser.id,
        //        fields: {  user_id: currentUser.id },
        //        file: file
        //    }).progress(function (evt) {
        //        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        //    }).success(function (data, status, headers, config) {
        //        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        //    }).error(function (data, status, headers, config) {
        //        console.log('error status: ' + status);
        //    });
        //};


    }

})();
