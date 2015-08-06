/**
* VotesController
* @namespace app.votes.controllers
*/
(function () {
'use strict';

angular
	.module('app.votes.controllers')
	.controller('VotesController', VotesController)

    VotesController.$inject = ['$scope', '$modal', 'votes'];

    /**
     * @namespace votesController
     */
    function VotesController($scope, $modal, Votes) {
        var vm = this;

        activate();

        function activate() {
            console.log('activated votes controller!');
            //votes.all();
        }

    }

})();
