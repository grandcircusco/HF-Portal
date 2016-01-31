/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.controllers')
        .controller('FellowController', FellowController);

    FellowController.$inject = ['$routeParams', '$scope', '$timeout', 'Fellows'];

    /**
     * @namespace FellowsController
     */
    function FellowController($routeParams, $scope, $timeout, Fellows) {

        activate();

        function activate() {
            //console.log('activated fellows controller!');
        }

        Fellows.get( $routeParams.fellow_id ).success(function (fellow) {

            console.log( fellow );

            $scope.fellow = fellow;
        });

        $scope.vote = function vote(fellow) {

            var current = User.getCurrentUser();
            if (current.userType === "Company") {

                $scope.loading = true;

                Votes.create(current.id, fellow.user_id)
                    .success(function (vote) {

                        console.log("success: "+vote);
                        return vote;
                    })
                    .catch(function (err) {

                        console.log("Error: "+err);
                    })
                    .finally(function () {

                        $scope.loading = false;
                        $scope.done = true;

                        $timeout(function () {

                            $scope.done = false;

                        }, 3000);

                    });
            }
        };

    }


})();
