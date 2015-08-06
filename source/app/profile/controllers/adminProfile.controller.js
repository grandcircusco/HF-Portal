/**
* AdminProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';


    angular
    .module('app.profile.controllers')
    .controller('AdminProfileController', AdminProfileController)
    .controller('AdminProfileModalInstanceController', AdminProfileModalInstanceController);

    AdminProfileController.$inject = ['$scope', '$modal', 'User', 'Fellows', 'Companies'];
    AdminProfileModalInstanceController.$inject = ['$scope', '$modalInstance', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope,  $modal, User, Fellows, Companies) {

        $scope.currentUser = User.getCurrentUser();
        console.log($scope.currentUser);

        $scope.openModal = function() {

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin-create-user.html',
                controller: 'AdminProfileModalInstanceController',
                size: 'lg'
                //resolve: {
                //    function(){
                //
                //    }
                //}

            });
        };

        function unHighlightField(){

            jQuery("input").removeClass("error");
            jQuery("#userType").removeClass('error');
        }

        function highlightPasswordField(){

            jQuery("#password").addClass('error');
        }

        function highlightEmailField(){

            jQuery("email").addClass('error');
        }

        function highlightUserTypeField(){

            jQuery("userType").addClass('error');
        }

        $scope.user = {
            email: "",
            password: "",
            userType: ""
        };

        $scope.ok = function (user) {

            /**********DEBUG START*********/
            user.userType = "Fellow"
            /**********DEBUG END*********/
                // remove previous highlights in case data is now correct
            unHighlightField();

            console.log("User Output");
            console.log(user);

            // if everything is good log data and close, else highlight error
            var errors = false;
            if(typeof(user) == "undefined"){
                console.log("No info");
                //heighlight all
                highlightEmailField();
                highlightPasswordField();
                highlightUserTypeField();
                errors = true;
            }
            else {

                if(typeof(user.email) == "undefined"){
                    console.log("Bad email");
                    //heighlight email
                    highlightEmailField();
                    errors = true;
                }

                if(typeof(user.password) == "undefined"){
                    console.log("Bad password");
                    //heighlight password
                    highlightPasswordField();
                    errors = true;
                }

                if(typeof(user.userType) == "undefined"){
                    console.log("Bad type");
                    //highlight button
                    highlightUserTypeField();
                    errors = true;
                }
            }

            if( !errors ){

                // send user to API via Service
                User.create(user).then(function(response) {

                    console.log(response);

                    var user_id = response.data.id;

                    if( user.userType === "Fellow" ){

                        var fellow_post = {

                            user_id: user_id
                        };
                        Fellows.create(fellow_post);
                    }
                    else if( user.userType === "Company" ){

                        var company_post = {

                            user_id: user_id
                        };
                        Companies.create(company_post);
                    }
                    //console.log(user);
                });

                $modalInstance.close();
            }

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.switchType = function(user, $event){

            console.log(user);

            if( user.userType === "Company" ){

                jQuery("optionCompany").addClass('selected');
                jQuery("optionFellow").removeClass('selected');
            }
            else if( user.userType === "Fellow" ){

                console.log("Fellow selection");

                jQuery("optionCompany").removeClass('selected');
                jQuery("optionFellow").addClass('selected');
            }

        };
    }


    function AdminProfileModalInstanceController ($scope, $modalInstance, User, Fellows, Companies) {

        function unHighlightField(){

            jQuery("input").removeClass("error");
            jQuery("#userType").removeClass('error');
        }

        function highlightPasswordField(){

            jQuery("#password").addClass('error');
        }

        function highlightEmailField(){

            jQuery("email").addClass('error');
        }

        function highlightUserTypeField(){

            jQuery("userType").addClass('error');
        }

        $scope.user = {
            email: "",
            password: "",
            userType: ""
        };

        $scope.ok = function (user) {

            /**********DEBUG START*********/
            user.userType = "Fellow"
            /**********DEBUG END*********/
            // remove previous highlights in case data is now correct
            unHighlightField();

            console.log("User Output");
            console.log(user);

            // if everything is good log data and close, else highlight error
            var errors = false;
            if(typeof(user) == "undefined"){
                console.log("No info");
                //heighlight all
                highlightEmailField();
                highlightPasswordField();
                highlightUserTypeField();
                errors = true;
            }
            else {

                if(typeof(user.email) == "undefined"){
                    console.log("Bad email");
                    //heighlight email
                    highlightEmailField();
                    errors = true;
                }

                if(typeof(user.password) == "undefined"){
                    console.log("Bad password");
                    //heighlight password
                    highlightPasswordField();
                    errors = true;
                }

                if(typeof(user.userType) == "undefined"){
                    console.log("Bad type");
                    //highlight button
                    highlightUserTypeField();
                    errors = true;
                }
            }

            if( !errors ){

                // send user to API via Service
                User.create(user).then(function(response) {

                    console.log(response);

                    var user_id = response.data.id;

                    if( user.userType === "Fellow" ){

                        var fellow_post = {

                            user_id: user_id
                        };
                        Fellows.create(fellow_post);
                    }
                    else if( user.userType === "Company" ){

                        var company_post = {

                            user_id: user_id
                        };
                        Companies.create(company_post);
                    }
                    //console.log(user);
                });

                $modalInstance.close();
            }

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.switchType = function(user, $event){

            console.log(user);

            if( user.userType === "Company" ){

                jQuery("optionCompany").addClass('selected');
                jQuery("optionFellow").removeClass('selected');
            }
            else if( user.userType === "Fellow" ){

                console.log("Fellow selection");

                jQuery("optionCompany").removeClass('selected');
                jQuery("optionFellow").addClass('selected');
            }

        };
    }

})();
