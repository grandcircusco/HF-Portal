/**
* HomeController
* @namespace app.home.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.profile.controllers')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope'];
  /**
  * @namespace HomeController
  */
  function ProfileController($scope) {
    var vm = this;
    
    $scope.fellow= {
      bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
      img:"public/assets/images/placeholder-hi.png"
    };
  
    activate();

    function activate() {
      console.log('activated home controller!')
      //Home.all();
    }

    $scope.update= function() {
      console.log($scope.fellow);

    };
  }


})();
