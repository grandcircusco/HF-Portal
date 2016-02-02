/**
 * VotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'VotesController', VotesController );

    VotesController.$inject = [ '$scope', '$location', 'User' ];
    /**
     * @namespace VoteController
     */
    function VotesController($scope, $location, User) {

        var vm = this;

        if( User.isUserLoggedIn() ) {

            $scope.votesFor = [];
            $scope.votesCast = [];

            $scope.currentUser = User.getCurrentUser();

            User.getVotes( $scope.currentUser.id ).success( function( votes ){

                $scope.votesFor = votes.votesFor;
                $scope.votesCast = votes.votesCast;


                console.log( $scope.votesCast );
            });


        }
        else{

            $location.path("/");
        }



    }


})();
