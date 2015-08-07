/**
* CompanyProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('CompanyProfileController', CompanyProfileController);

    CompanyProfileController.$inject = ['$scope', '$location', 'Companies', 'User', 'Tags'];

    /**
    * @namespace CompanyProfileController
    */
    function CompanyProfileController($scope, $location, Companies, User, Tags) {
        var vm = this;

        // Probably can handle this in the routes or with middleware or some kind
        if( !User.isUserLoggedIn() ) {

            $location.path("/");
            return;
        }

        // Make sure current user is a Company
        var currentUser = User.getCurrentUser();
        if( currentUser.userType !== "Company" ){

            $location.path("/profile");
            return;
        }

        console.log(currentUser);

        Companies.get(currentUser.id).success(function(company){

            $scope.company = company;

            Tags.all().success(function(tags){
                //console.log(tags);

                var data = [];
                tags.forEach(function(tag){

                    var item = {

                        id: tag.id,
                        text: tag.name
                    };
                    data.push(item)
                });

                var vals = [];
                company.tags.forEach(function(tag){

                    vals.push(tag.id);
                });

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

        $scope.update= function(company) {

            // get the tags from the form
            company.tags = $("#tags").val();

            // send fellows info to API via Service
            Companies.update(company, currentUser.id).success(function(data){
                //console.log("POST");
                //console.log(data);

                // ** Trigger Success message here
            });
        };


    }



})();
