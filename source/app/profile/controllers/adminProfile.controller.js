/**
* AdminProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';


    angular
    .module('app.profile.controllers')
    .controller('AdminProfileController', AdminProfileController);
    //.controller('AdminProfileModalInstanceController', AdminProfileModalInstanceController);

    AdminProfileController.$inject = ['$scope', '$location',  'FileUploader', 'ngFileUpload', 'User', 'Fellows', 'Companies'];
    //AdminProfileModalInstanceController.$inject = ['$scope', '$modalInstance', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $location, User, Fellows, Companies) {

        // Probably can handle this in the routes or with middleware or some kind
        if( !User.isUserLoggedIn() ) {

            $location.path("/");
            return;
        }

        // Make sure current user is an Admin
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Admin" ){

            $location.path("/profile");
            return;
        }

        //$scope.openModal = function() {
        //
        //    var modalInstance = $modal.open({
        //
        //        templateUrl: 'source/app/profile/partials/admin-create-user.html',
        //        controller: 'AdminProfileModalInstanceController',
        //        size: 'lg'
        //        //resolve: {
        //        //    function(){
        //        //
        //        //    }
        //        //}
        //
        //    });
        //};

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

        // Admin profile tabs
        $scope.tabs = [
            {
                title:'User List',
                template:'source/app/profile/partials/admin/user-list.html'
            },
            {
                title:'New User',
                template:'source/app/profile/partials/admin/new-user-form.html'
            },
            {
                title:'Votes',
                template:'source/app/profile/partials/admin/admin-votes.html'
            }
        ];


        $scope.ok = function (user) {

            // remove previous highlights in case data is now correct
            unHighlightField();

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

                });

                //$modalInstance.close();
            }

        };

        //$scope.cancel = function () {
        //    $modalInstance.dismiss('cancel');
        //};

        $scope.switchType = function(user){

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


    //function AdminProfileModalInstanceController ($scope, $modalInstance, User, Fellows, Companies) {
    //
    //    function unHighlightField(){
    //
    //        jQuery("input").removeClass("error");
    //        jQuery("#userType").removeClass('error');
    //    }
    //
    //    function highlightPasswordField(){
    //
    //        jQuery("#password").addClass('error');
    //    }
    //
    //    function highlightEmailField(){
    //
    //        jQuery("email").addClass('error');
    //    }
    //
    //    function highlightUserTypeField(){
    //
    //        jQuery("userType").addClass('error');
    //    }
    //
    //    $scope.user = {
    //        email: "",
    //        password: "",
    //        userType: ""
    //    };
    //
    //    $scope.ok = function (user) {
    //
    //        /**********DEBUG START*********/
    //        user.userType = "Fellow"
    //        /**********DEBUG END*********/
    //        // remove previous highlights in case data is now correct
    //        unHighlightField();
    //
    //        console.log("User Output");
    //        console.log(user);
    //
    //        // if everything is good log data and close, else highlight error
    //        var errors = false;
    //        if(typeof(user) == "undefined"){
    //            console.log("No info");
    //            //heighlight all
    //            highlightEmailField();
    //            highlightPasswordField();
    //            highlightUserTypeField();
    //            errors = true;
    //        }
    //        else {
    //
    //            if(typeof(user.email) == "undefined"){
    //                console.log("Bad email");
    //                //heighlight email
    //                highlightEmailField();
    //                errors = true;
    //            }
    //
    //            if(typeof(user.password) == "undefined"){
    //                console.log("Bad password");
    //                //heighlight password
    //                highlightPasswordField();
    //                errors = true;
    //            }
    //
    //            if(typeof(user.userType) == "undefined"){
    //                console.log("Bad type");
    //                //highlight button
    //                highlightUserTypeField();
    //                errors = true;
    //            }
    //        }
    //
    //        if( !errors ){
    //
    //            // send user to API via Service
    //            User.create(user).then(function(response) {
    //
    //                console.log(response);
    //
    //                var user_id = response.data.id;
    //
    //                if( user.userType === "Fellow" ){
    //
    //                    var fellow_post = {
    //
    //                        user_id: user_id
    //                    };
    //                    Fellows.create(fellow_post);
    //                }
    //                else if( user.userType === "Company" ){
    //
    //                    var company_post = {
    //
    //                        user_id: user_id
    //                    };
    //                    Companies.create(company_post);
    //                }
    //                //console.log(user);
    //            });
    //
    //            $modalInstance.close();
    //        }
    //
    //    };
    //
    //    $scope.cancel = function () {
    //        $modalInstance.dismiss('cancel');
    //    };
    //
    //    $scope.switchType = function(user, $event){
    //
    //        console.log(user);
    //
    //        if( user.userType === "Company" ){
    //
    //            jQuery("optionCompany").addClass('selected');
    //            jQuery("optionFellow").removeClass('selected');
    //        }
    //        else if( user.userType === "Fellow" ){
    //
    //            console.log("Fellow selection");
    //
    //            jQuery("optionCompany").removeClass('selected');
    //            jQuery("optionFellow").addClass('selected');
    //        }
    //
    //    };
    //}

})();
