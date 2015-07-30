/**
* ProfileController
* @namespace app.profile.controllers
*/
(function () {
  'use strict';

  angular
<<<<<<< HEAD
    .module('app.profile.controllers')
=======
    .module('app.profile.controllers', ['ngAnimate'])
>>>>>>> e377d8ebbf1f4cb88eb65bbc4dbd268fbccbe856
    .controller('ProfileController', ProfileController);
    // .controller('ProfileController', ['$scope', function($scope) {
    //   $scope.templates = [ 
    //     { name: 'Admin', url: 'source/app/profile/partials/admin-profile.html'},
    //     { name: 'Fellow', url: 'source/app/profile/partials/fellow-profile.html'},
    //     { name: 'Company', url: 'source/app/profile/partials/company-profile.html'}];
    //   $scope.template = $scope.templates[0];
    // }]);

  ProfileController.$inject = ['$scope'];
  /**
  * @namespace ProfileController
  */
  function ProfileController($scope) {
    var vm = this;
    
    $scope.fellow= {
      bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
      img:"public/assets/images/placeholder-hi.png"
    };
  
    activate();

    function activate() {
      console.log('activated profile controller!')
      //Profile.all();
    }

    $scope.update= function() {
      console.log($scope.fellow);

    };
  }


})();
