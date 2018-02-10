/**
* ProfileController
* @namespace app.profile.controllers
*/
(function () {
  'use strict';

  angular
  .module('app.profile.controllers')
  .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope', '$location', 'User'];
  /**
  * @namespace ProfileController
  */
  function ProfileController($scope, $location, User) {

      var vm = this;

      if( User.isUserLoggedIn() ) {

          // redirect the user based on their type
          if (User.isUserAdmin()) {
              $location.path("/profile/admin");
          }
          else if (User.isUserFellow()) {
              $location.path("/profile/fellow");
          }
          else if (User.isUserIntern()) {
              $location.path("/profile/intern");
          }
          else if (User.isUserCompany()) {
              $location.path("/profile/company");
          }
      }
      else{

           $location.path("/");
      }

  }


})();
