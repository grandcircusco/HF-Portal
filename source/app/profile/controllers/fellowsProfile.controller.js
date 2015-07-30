/**
* FellowsController
* @namespace app.profile.controllers
*/
(function () {
'use strict';

angular
	.module('app.profile.controllers')
	.controller('FellowsProfileController', FellowsProfileController)
	.controller('FellowsProfileModalInstanceController', FellowsProfileModalInstanceController);

    FellowsProfileController.$inject = ['$scope', '$modal'];
    FellowsProfileModalInstanceController.$inject = ['$scope', '$modalInstance'];

    /**
     * @namespace FellowsProfileController
     */
    function FellowsProfileController($scope, $modal) {

        $scope.openModal = function(fellow) {

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/user_detail_view.html',
                controller: 'FellowsModalInstanceController',
                size: 'lg',
                resolve: {
                    function(){

                    }
                }

            });
        };


    }

    function FellowsProfileModalInstanceController ($scope, $modalInstance, fellow) {


        $scope.fellow = fellow;

        $scope.ok = function () {
            $modalInstance.close(;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

})();
