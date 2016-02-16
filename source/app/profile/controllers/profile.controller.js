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

          var currentUser = User.getCurrentUser();
          console.log("The current user is " + currentUser.userType);
          // redirect the user based on their type
          if (currentUser.userType === 'Admin') {
              console.log("Like a boss");
              $location.path("/profile/admin");
          }
          else if (currentUser.userType === 'Fellow') {
              console.log("Like a fella");
              $location.path("/profile/fellow");
          }
          else if (currentUser.userType === 'Company') {
              console.log("Like a company");
              $location.path("/profile/company");
          }
      }
      else{

           $location.path("/");
      }

  }


})();
