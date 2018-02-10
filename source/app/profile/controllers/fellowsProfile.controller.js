/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController)
    .controller('UpdateFellowPasswordModalInstanceController', UpdateFellowPasswordModalInstanceController);

    FellowsProfileController.$inject = ['$scope', '$location', 'Fellows', 'Tags', 'User', 'S3', 'Alert', '$modal'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope, $location, Fellows, Tags, User, S3, Alert, $modal ) {

        var vm = this;

        // Probably can handle this in the routes or with middleware of some kind
        if( !User.isUserLoggedIn() ) {

            //$location.path("/");
            return;
        }

        $scope.tagTransform = function (newTag) {

            var tag = {

                name: newTag
            };

            return tag;
        };

        // Make sure current user is a Fellow
        if( !User.isUserFellowOrIntern() ){

            console.log('redirecting');
            $location.path("/profile");
            return;
        } else {
          console.log('is a fellow or intern');
        }

        $scope.tags = [];

        function getFellow() {

            console.log( "Get Fellow" );

            var currentUser = User.getCurrentUser();

            Fellows.getByUserId(currentUser.id).success(function (fellow) {

                for (var key in fellow) {
                    if (!fellow.hasOwnProperty(key)) continue;
                    if (fellow[key] === null) {
                        fellow[key] = "";
                    }
                }
                $scope.fellow = fellow;

                $("[name='enabled']").bootstrapSwitch({

                    onText: "Visible",
                    offText: "Hidden",
                    state: fellow.enabled,
                    onSwitchChange: function (event, state) {

                        fellow.enabled = ( state ) ? 1 : 0;
                    }
                });

                Tags.all().success(function (tags) {

                    $scope.tags = tags;
                });

            });
        }
        getFellow();

        activate();

        function activate() {
            //console.log('activated profile controller!');
            //Profile.all();
        }

        /* Update fellow password */
        $scope.updateFellowPassword = function() {
            $scope.new_password = {};
            $scope.confirm_password = {};
            var modalInstance = $modal.open({
                templateUrl: 'source/app/profile/partials/admin/update-password-form.html',
                controller: 'UpdateFellowPasswordModalInstanceController',
                size: 'md',
                resolve: {
                }
            });
            modalInstance.result.then( function( response ) {

              $scope.new_password = {};
              $scope.confirm_password = {};
            });
        };


        $scope.update = function(fellow, file) {

            // TODO - there is a better way to do this error checking
            var errors = [];
            if(fellow.bio.length > 350 )
            {
                angular.element( "#bio" ).addClass( 'error' );
                errors.push( "The bio field can only be 350 characters maximum");
            }
            else{

                angular.element( "#bio" ).removeClass( 'error' );
            }

            if( fellow.interests.length > 350 )
            {
                angular.element( "#interests" ).addClass( 'error' );
                errors.push( "The interesting things you have coded field can only be 350 characters maximum");
            }
            else{

                angular.element( "#interests" ).removeClass( 'error' );
            }

            if( fellow.description.length > 25 )
            {
                angular.element( "#description" ).addClass( 'error' );
                errors.push( "The phrase field can only be 25 characters maximum");
            }
            else{

                angular.element( "#description" ).removeClass( 'error' );
            }

            if( fellow.answer.length > 250 )
            {
                angular.element( "#answer" ).addClass( 'error' );
                errors.push( "The answer field can only be 250 characters maximum");
            }
            else{

                angular.element( "#answer" ).removeClass( 'error' );
            }

            if( errors.length  === 0 )
            {
                // make sure each of the links starts with http:// or https://
                for (var i=1; i<6; i++) {
                    fellow['linkURL'+i] = User.httpify(fellow['linkURL'+i]);
                }

                // send fellows info to API via Service
                Fellows.update(fellow).success(function (newFellowData) {

                    // ** Trigger Success message here
                    fellow = newFellowData;

                    // hide update message
                    $("#profile-photo").find(".upload-status").hide();

                    Alert.showAlert('Your profile has been updated', 'success');
                });
            }
            else{

                Alert.showAlert( errors, 'error' );
            }
        };

        /** S3 File uploading **/
        $scope.getS3Key = function(){


            var files = document.getElementById("file_input").files;
            var file = files[0];

            if(file === null){

                alert("No file selected.");
            }
            else{

                get_signed_request(file);
            }
        };


        function get_signed_request(file){

            var xhr = new XMLHttpRequest();

            // Trying to prevent naming collisions by appending the unique user_id to file name
            // -- remove and save the extension - should be the last part
            // -- want to make sure we allow . in the filename outside of extension
            var pieces = file.name.split(".");
            var extension = pieces.pop();
            var file_name = pieces.join(".") + "-" + $scope.fellow.user_id + "." + extension;

            xhr.open("GET", "/sign_s3?file_name="+file_name+"&file_type="+file.type);
            xhr.onreadystatechange = function(){

                if(xhr.readyState === 4){

                    if(xhr.status === 200){

                        var response = JSON.parse(xhr.responseText);
                        upload_file(file, response.signed_request, response.url);
                    }
                    else{

                        alert("Could not get signed URL.");
                    }
                }
            };
            xhr.send();
        }

        function upload_file(file, signed_request, url){

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", signed_request);
            xhr.setRequestHeader('x-amz-acl', 'public-read');

            $("#profile-photo").find(".uploading").show();

            xhr.onload = function() {

                if (xhr.status === 200) {

                    //  Set image preview
                    document.getElementById("preview").src = url;

                    // Update fellow model
                    $scope.fellow.image_url = url;

                    // Angular is weird when updating images that started with an empty string
                    // removing ng-hide to force update
                    $("#preview").removeClass('ng-hide');
                    $(".user-photo").find(".placeholder").hide();
                    $("#profile-photo").find(".upload-status").show();
                    $("#profile-photo").find(".uploading").hide();
                }
            };

            xhr.onerror = function() {

                alert("Could not upload file.");
            };

            xhr.send(file);
        }
    }


    UpdateFellowPasswordModalInstanceController.$inject = ['$scope', '$modalInstance', 'User', 'Alert'];
    function UpdateFellowPasswordModalInstanceController($scope, $modalInstance, User, Alert) {


        $scope.ok = function ok() {

            $scope.errors = [];

            // Form is being validated by angular, but leaving this just in case
            if( typeof $scope.new_password === "undefined" ) {
                $scope.errors.push( "Enter a password" );
            } else if( typeof $scope.confirm_password === "undefined" ) {
                $scope.errors.push( "Confirm your new password" );
            } else if( $scope.new_password !== $scope.confirm_password ){
                $scope.errors.push( "Passwords do not match" );
            }

            if( $scope.errors.length === 0 ){

                var fellow = User.getCurrentUser();
                fellow.password = $scope.new_password;
                fellow.email = fellow.username;
                console.log(fellow);
                console.log(User);
                User.update(fellow).then( function( newUser ){
                    console.log("updated");
                    $modalInstance.close();
                    Alert.showAlert('Your password has been updated', 'success');
                }, function(){
                    console.log("failed");
                    $scope.errors = [ "There was a problem updating the password" ];
                    Alert.showAlert('There was a problem updating the password', 'danger');
                });

            }
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };
    }


})();
