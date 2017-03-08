/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.controllers')
        .controller('FellowController', FellowController);

    FellowController.$inject = ['$routeParams', '$scope', '$timeout', 'Fellows', 'User', 'Votes', 'Alert'];

    /**
     * @namespace FellowsController
     */
    function FellowController($routeParams, $scope, $timeout, Fellows, User, Votes, Alert) {

        activate();

        function activate() {
            //console.log('activated fellows controller!');
        }

        $scope.helpers = HFHelpers.helpers;

        $scope.votesFor = [];
        $scope.votesCast = [];
        $scope.currentUser = User.getCurrentUser();

        Fellows.get( $routeParams.fellow_id ).success(function (fellow) {

            $scope.fellow = fellow;

            User.getVotes( fellow.user_id ).success( function( votes ){

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

        $scope.isCompany = function(){

            return ( $scope.currentUser.userType === "Company" );
        };

        $scope.vote = function vote(fellow) {

            if ( $scope.isCompany() ) {

                $scope.loading = true;

                Votes.create($scope.currentUser.id, fellow.user_id)
                    .success(function (vote) {

                        console.log( vote );

                        console.log("success");
                        return vote;
                    })
                    .catch(function (err) {

                        console.log("Error: "+err);
                        Alert.showAlert( err.data, "info" );
                    })
                    .finally(function () {

                        $timeout(function () {

                            $scope.loading = false;
                            $scope.done = true;

                        }, 1500);

                    });
            }
        };

    }


})();
