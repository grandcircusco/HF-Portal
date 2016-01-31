/**
 * VotesController
 * @namespace app.votes.controllers
 */
(function () {
    'use strict';

    angular
        .module( 'app.votes.controllers' )
        .controller( 'VotesController', VotesController );

    VotesController.$inject = [ '$scope', '$location', 'User', 'Votes' ];
    /**
     * @namespace VoteController
     */
    function VotesController($scope, $location, User, Votes) {

        var vm = this;

        if( User.isUserLoggedIn() ) {

            var currentUser = User.getCurrentUser();

            // Get the companies voted on by the current logged in user
            CompanyVotes.get( currentUser.id )
                        .success( function( votes ){

                             console.log( votes );
                             $scope.company_votes = votes;
                        });

            FellowVotes.get( currentUser.id )
                        .success( function( votes ){

                            console.log( votes );
                            $scope.fellow_votes = votes;
                        });


        }
        else{

            $location.path("/");
        }



    }


})();
