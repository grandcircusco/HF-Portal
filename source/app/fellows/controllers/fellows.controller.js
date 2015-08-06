/**
 * FellowsController
 * @namespace app.fellows.controllers
 */
(function () {
  'use strict';

  angular
    .module('app.fellows.controllers')
    .controller('FellowsController', FellowsController)

  FellowsController.$inject = ['$scope', '$modal', 'Fellows'];

  /**
   * @namespace FellowsController
   */
  function FellowsController($scope, $modal, Fellows) {
    var vm = this;

    activate();

    function activate() {
      console.log('activated fellows controller!');
      //Fellows.all();
    }

    /*Fellows.all().success(function(fellows){

      $scope.fellows = fellows;
      });*/
    $scope.fellows = Fellows.all();

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

/**
 * Fellows Modal Instance Controller
 * @namespace app.fellows.controllers
 */

  angular
    .module('app.fellows.controllers')
    .controller('FellowsModalInstanceController', FellowsModalInstanceController);

  FellowsModalInstanceController.$inject = ['$scope', '$modalInstance',
    'fellow', 'FellowVotes', 'User'];

  function FellowsModalInstanceController ($scope, $modalInstance, fellow, FellowVotes, User) {

    $scope.fellow = fellow;

    $scope.ok = function ok() {
      $modalInstance.close($scope.fellow);
    };

    $scope.cancel = function cancel() {
      $modalInstance.dismiss('cancel');
    };

    $scope.vote = function vote(fellow) {
      var current = User.getCurrentUser();
      console.log(current);
      console.log(current.userType);
      if(current.userType == "Company") {
        return FellowVotes.create(fellow.id, current.id);
      }
    }

  }

})();
