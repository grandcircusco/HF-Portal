/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
    'use strict';

    angular
        .module('app.fellows.controllers')
        .controller('FellowsController', FellowsController);

    FellowsController.$inject = ['$scope', '$modal', '$location', 'Fellows'];

    /**
     * @namespace FellowsController
     */
    function FellowsController($scope, $modal, $location, Fellows) {

        activate();

        function activate() {
            $scope.isFellows = $location.path().includes('fellows');
            $scope.isInterns = $location.path().includes('interns');
            if ($scope.isInterns) {
              $scope.fellow_type = "interns";
            } else if ($scope.isFellows) {
              $scope.fellow_type = "fellows";
            }
        }

        $scope.helpers = HFHelpers.helpers;
        $scope.fellows = [];

        Fellows.all().success(function (fellows) {
            // filter by fellows or interns
            for (let f of fellows) {
              console.dir(f);
              if (f.fellow_type === 'Intern' && $scope.isInterns || 
                  f.fellow_type === 'Fellow' && $scope.isFellows) {
                  console.log('adding');
                  console.dir(f);
                  $scope.fellows.push(f);
              } else {
                console.log('not adding');
              }
            }

        });

        $scope.openModal = function (fellow) {

            $scope.fellow = fellow;

            var modalInstance = $modal.open({

                templateUrl: 'source/app/fellows/partials/fellow_detail_view.html',
                controller: 'FellowsModalInstanceController',
                size: 'lg',
                resolve: {
                    fellow: function () {
                        return fellow;
                    }
                }

            });

        };


    }

    /**
     * Fellows Modal Instance Controller
     * @namespace app.fellows.controllers
     */
    angular
        .module('app.fellows.controllers')
        .controller('FellowsModalInstanceController', FellowsModalInstanceController);

    FellowsModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow',
        'Votes', 'User', '$timeout'];

    function FellowsModalInstanceController($scope, $modalInstance, fellow, Votes, User) {

        $scope.fellow = fellow;

        //console.log(fellow);

        $scope.ok = function ok() {
            $modalInstance.close($scope.fellow);
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };

    }

})();
