/**
* FellowsController
* @namespace app.fellows.controllers
*/
(function () {
'use strict';

angular
	.module('app.fellows.controllers')
	.controller('FellowsController', FellowsController)
	.controller('FellowsModalInstanceController', FellowsModalInstanceController);

    FellowsController.$inject = ['$scope', '$modal', 'Fellows', 'Users', 'Votes'];
    FellowsModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow'];

    /**
     * @namespace FellowsController
     */
    function FellowsController($scope, $modal, Fellows, Users, Votes) {
        var vm = this;

        activate();

        function activate() {
            console.log('activated fellows controller!');
            //Fellows.all();
        }

        Fellows.all().success(function(fellows){

             $scope.fellows = fellows;
        });

        $scope.openModal = function(fellow) {
            $scope.fellow = fellow;
            var modalInstance = $modal.open({

                templateUrl: 'source/app/fellows/partials/fellow_detail_view.html',
                controller: 'FellowsModalInstanceController',
                size: 'lg',
                resolve: {
                    fellow: function(){
                        return fellow;
                    }
                }

            });
        };


    }

    function FellowsModalInstanceController ($scope, $modalInstance, fellow) {


        $scope.fellow = fellow;

        $scope.ok = function ok() {
            $modalInstance.close($scope.fellow);
        };

        $scope.cancel = function cancel() {
            $modalInstance.dismiss('cancel');
        };

        $scope.vote = function vote(fellow) {
          var company = Users.getCurrentUser();
          if(company.type == "Company") {
            return Voters.fellowCreate(fellow, company);
          }
        }

    }

})();
