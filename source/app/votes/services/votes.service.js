/**
 * Votes
 * @namespace app.votes.services
 */
(function () {
    'use strict';

    angular
        .module('app.votes.services')
        .service('Votes', Votes);

    Votes.$inject = ['$http', 'CONFIG'];


    /**
     * @namespace CompanyVotes
     */
    function Votes($http, CONFIG) {

        var rootUrl = CONFIG.SERVICE_URL;

        return {

            getVotesFor: getVotesFor,
            getVotesCast: getVotesCast,
            create: create,
            destroy: destroy
        };

        /**
         * @name get votes
         * @desc get the votes cast for a user
         */
        function getVotesFor(user_id) {

            return $http.get(rootUrl + '/api/v1/votes/for/' + user_id);
        }

        /**
         * @name get votes
         * @desc get the votes cast by a user
         */
        function getVotesCast(user_id) {

            return $http.get(rootUrl + '/api/v1/votes/by/' + user_id);
        }

        /**
         * @name create
         * @desc cast a vote for a user
         */
        function create( voter_id, votee_id ) {

            console.log( voter_id + " " + votee_id );

            return $http.post(rootUrl + '/api/v1/votes/', {

                voter_id: voter_id,
                votee_id: votee_id
            });
        }

        /**
         * @name destroy
         * @desc destroy a vote record
         */
        function destroy(id) {

            return $http.delete(rootUrl + '/api/v1/votes/' + id);
        }
    }


})();

