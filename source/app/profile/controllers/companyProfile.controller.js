/**
* CompanyProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('CompanyProfileController', CompanyProfileController);

    CompanyProfileController.$inject = ['$scope', 'Companies', 'User', 'Tags'];

    /**
    * @namespace CompanyProfileController
    */
    function CompanyProfileController($scope, Companies, User, Tags) {
        var vm = this;

        var currentUser = User.getCurrentUser();
        Companies.get(currentUser.id).success(function(company){

            $scope.company = company;

            Tags.all().success(function(tags){
                console.log(tags);

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
            console.log('activated profile controller!');
            //Profile.all();
        }

        $scope.update= function(company) {
            // console.log($scope.company);
            //console.log($(".js-example-tokenizer").val());
            //
            //
            //$scope.company.skills = $(".js-example-tokenizer").val();
            //console.log($scope.company);
            //console.log($(".js-example-tokenizer").val());

            // Confirm which tags are already in the database for this company
            //for (var i = 0; i < tags.length; i++) {
            //    console.log(tags[i]);
            //    var currTag = Tags.findOne({
            //        where: {
            //            name: tags[i]
            //        }
            //    });
            //
            //    console.log(currTag.id);
            //
            //}

            company.tags = $("#tags").val();


            // send fellows info to API via Service
            Companies.update(company, currentUser.id).success(function(data){
                console.log("POST");
              console.log(data);
            });
        };


    }



})();
