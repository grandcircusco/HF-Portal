/**
 * CompaniesController
 * @namespace app.companies.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.companies.controllers')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = [ '$routeParams', '$scope', '$timeout', 'Companies', 'User', 'Votes', 'Alert'];

    /**
     * @namespace CompaniesController
     */
    function CompanyController( $routeParams, $scope, $timeout, Companies, User, Votes, Alert) {

        activate();

        function activate() {
            //console.log('activated companies controller!');
        }

        $scope.helpers = HFHelpers.helpers;
        
        $scope.votesFor = [];
        $scope.votesCast = [];
        $scope.currentUser = User.getCurrentUser();

        Companies.get( $routeParams.company_id ).success(function (company) {

            $scope.company = company;

            User.getVotes( company.user_id ).success( function( votes ){

                $scope.votesFor = votes.votesFor;
                $scope.votesCast = votes.votesCast;
            });
        });

        $scope.currentUserVoted = function currentUserVoted(){

            for( var i = 0; i < $scope.votesFor.length; i++ ){

                var element = $scope.votesFor[i];
                if( element.id == $scope.currentUser.id ) return true;
            }
            return false;
        };

        $scope.isFellow = function(){

            return ( $scope.currentUser.userType === "Fellow");
        };

        $scope.vote = function vote(company) {


            if( $scope.isFellow() ) {

                $scope.loading = true;

                return Votes.create($scope.currentUser.id, company.user_id)
                    .success(function (vote) {

                        console.log( vote );
                        console.log("success");
                        return vote;
                    })
                    .catch(function (err) {

                        console.log("Error: "+error);
                        Alert.showAlert( err.data, "info" );
                    })
                    .finally(function () {

                      $timeout(function() {
                        $scope.loading = false;
                        $scope.done = true;

                      }, 1500);
                      
                    });
            }
        };

    }

})();
