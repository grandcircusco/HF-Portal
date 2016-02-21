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

    AdminProfileController.$inject = ['$scope', '$location', '$modal', 'User', 'Fellows', 'Companies'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $location, $modal, User, Fellows, Companies) {

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

        $scope.fellows = [];
        $scope.companies = [];
        $scope.userListLoad = function() {


            if( $scope.fellows.length === 0 ) {

                Fellows.allWithUser().success(function (fellows) {

                    console.log( fellows );

                    $scope.fellows = fellows;

                });
            }

            if( $scope.companies.length === 0 ) {

                Companies.allWithUser().success(function (companies) {

                    console.log( companies );

                    $scope.companies = companies;

                });
            }
        };
        $scope.userListLoad();

        $scope.editFellow = function(fellow){

            // send user data to service

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/edit-user-form.html',
                controller: 'EditUserModalInstanceController',
                size: 'md',
                resolve: {
                    user: function(){
                        return fellow.user;
                    },
                    name: function(){
                        return fellow.first_name+" "+fellow.last_name;
                    }
                }

            });

            // show success/failure
            return false;
        };

        $scope.fellowVotes = function( fellow ){

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/fellow-votes.html',
                controller: 'FellowVotesModalInstanceController',
                size: 'md',
                resolve: {

                    fellow: function(){
                        return fellow;
                    }
                }

            });

            // show success/failure
            return false;

        };

        $scope.companyVotes = function( company ){

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/company-votes.html',
                controller: 'CompanyVotesModalInstanceController',
                size: 'md',
                resolve: {

                    company: function(){
                        return company;
                    }
                }

            });

            // show success/failure
            return false;

        };

        // @TODO - Implement Later
        $scope.archiveFellow = function(user){

            console.log("Archive User: "+user.id);
            // send user data to service

            // show success/failure
            return false;
        };

        $scope.editCompany= function(company){

            // send user data to service

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin/edit-user-form.html',
                controller: 'EditUserModalInstanceController',
                size: 'md',
                resolve: {
                    user: function(){
                        return company.user;
                    },
                    name: function(){
                        return company.name;
                    }
                }

            });

            // show success/failure
            return false;
        };
        $scope.archiveCompany = function(user){

            console.log("Archive User: "+user.id);
            // send user data to service

            // show success/failure
            return false;
        };

        // Admin profile tabs
        //$scope.tabs = [
        //    {
        //        title:'User List',
        //        template:'source/app/profile/partials/admin/user-list.html',
        //        action: $scope.userListLoad
        //    },
        //    {
        //        title:'New User',
        //        template:'source/app/profile/partials/admin/new-user-form.html',
        //        action: $scope.userListLoad
        //    },
        //    {
        //        title:'Votes',
        //        template:'source/app/profile/partials/admin/admin-votes.html',
        //        action: $scope.userListLoad
        //    }
        //];

        /* Create User */
        $scope.createUser = function (user) {
            var modalInstance = $modal.open({
                templateUrl: 'source/app/profile/partials/admin/new-user-form.html',
                controller: 'CreateUserModalInstanceController',
                size: 'md',
                resolve: {
                    
                }
            });
                    // remove previous highlights in case data is now correct
                    

        };
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
    }


    /**
     * Fellows Modal Instance Controller
     * @namespace app.fellows.controllers
     */

    angular
        .module('app.fellows.controllers')
        .controller('EditUserModalInstanceController', EditUserModalInstanceController)
        .controller('CreateUserModalInstanceController', CreateUserModalInstanceController)
        .controller('CompanyVotesModalInstanceController', CompanyVotesModalInstanceController)
        .controller('FellowVotesModalInstanceController', FellowVotesModalInstanceController);

    EditUserModalInstanceController.$inject = ['$scope', '$modalInstance', 'user', 'name', 'User' ];
    function EditUserModalInstanceController ($scope, $modalInstance, user, name, User) {

        $scope.user = user;
        $scope.name = name;

        //console.log(fellow);

        $scope.ok = function ok() {

            User.update($scope.user);

            $modalInstance.close($scope.user);
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };


    }

    FellowVotesModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow' ];
    function FellowVotesModalInstanceController( $scope, $modalInstance, fellow ){

        $scope.fellow = fellow;

        // Check fellow VotesFor to see if a company voted for a fellow
        $scope.companyVotedForFellow = function( company_user_id ){

            for( var i = 0; i < fellow.user.VotesFor.length; i++ )
            {
                var vote = fellow.user.VotesFor[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        // Check fellow VotesCast to see if they voted for a company
        $scope.fellowVotedForCompany = function( company_user_id ){

            for( var i = 0; i < fellow.user.VotesCast.length; i++ )
            {
                var vote = fellow.user.VotesCast[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        $scope.ok = function ok() {

            $modalInstance.close();
        };
    }

    CompanyVotesModalInstanceController.$inject = ['$scope', '$modalInstance', 'company' ];
    function CompanyVotesModalInstanceController( $scope, $modalInstance, company ){

        $scope.company = company;

        // Check fellow VotesCast to see if they voted for a company
        $scope.fellowVotedForCompany = function( company_user_id ){

            for( var i = 0; i < company.user.VotesFor.length; i++ )
            {
                var vote = company.user.VotesFor[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        // Check fellow VotesFor to see if a company voted for a fellow
        $scope.companyVotedForFellow = function( company_user_id ){

            for( var i = 0; i < company.user.VotesCast.length; i++ )
            {
                var vote = company.user.VotesCast[i];

                if( vote.id === company_user_id )
                {
                    return true;
                }
            }

            return false;
        };

        $scope.ok = function ok() {

            $modalInstance.close();
        };
    }

    CreateUserModalInstanceController.$inject = ['$scope', '$modalInstance', 'User', 'Fellows', 'Companies' ];
    function CreateUserModalInstanceController ($scope, $modalInstance, User, Fellows, Companies) {

        
        //console.log(fellow);

        // $scope.ok = function ok() {

        //     User.update($scope.user);

        //     $modalInstance.close($scope.user);
        // };

        $scope.create = function (user){
                // unHighlightField();

                // if everything is good log data and close, else highlight error
                var errors = false;
                console.log("In create.");
                if(typeof(user) == "undefined"){
                    console.log("No info");
                    //highlight all
                    // highlightEmailField();
                    // highlightPasswordField();
                    // highlightUserTypeField();
                    errors = true;
                }
                else {
                    console.log("checking info.");
                    if(typeof(user.email) == "undefined"){
                        console.log("Bad email");
                        //highlight email
                        // highlightEmailField();
                        errors = true;
                    }

                    if(typeof(user.password) == "undefined"){
                        console.log("Bad password");
                        //highlight password
                        // highlightPasswordField();
                        errors = true;
                    }
                    console.log("the user type is" + user.userType);
                    if(typeof(user.userType) == "undefined"){
                        console.log("Bad type");
                        //highlight button
                        // highlightUserTypeField();
                        errors = true;
                    }
                }
                console.log("u tryna create brah?");
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
                }
            

            $modalInstance.close();
        

        };
        
        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };


    }

})();
