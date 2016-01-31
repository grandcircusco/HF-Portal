/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.controllers')
        .controller('FellowController', FellowController);

    FellowController.$inject = ['$routeParams', '$scope', '$modal', 'Fellows'];

    /**
     * @namespace FellowsController
     */
    function FellowController($routeParams, $scope, $modal, Fellows) {

        activate();

        function activate() {
            //console.log('activated fellows controller!');
        }

        Fellows.get( $routeParams.fellow_id ).success(function (fellow) {

            console.log( fellow );

            $scope.fellow = fellow;
        });

    }


})();
