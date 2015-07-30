/**
* ProfileController
* @namespace app.profile.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.profile.controllers')
    .controller('ProfileController', ProfileController);
    // .controller('ProfileController', ['$scope', function($scope) {
    //   
    //   $scope.template = $scope.templates[0];
    // }]);

  ProfileController.$inject = ['$scope'];

  /**
  * @namespace ProfileController
  */
  function ProfileController($scope) {
    var vm = this;
  
    $scope.templates = [ 
          { name: 'Admin', url: 'source/app/profile/partials/admin-profile.html'},
          { name: 'Fellow', url: 'source/app/profile/partials/fellow-profile.html'},
          { name: 'Company', url: 'source/app/profile/partials/company-profile.html'}];

    $scope.template = $scope.templates[0];
    
    activate();

    function activate() {
      console.log('activated profile controller!')
      //Profile.all();
    }
  }
})();
