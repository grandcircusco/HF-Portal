/**
* HomeController
* @namespace app.home.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.home.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Fellows', 'User', "$location"];

  /**
  * @namespace HomeController
  */
  function HomeController($scope, Fellows, User, $location) {

    // save this through a refresh
    $scope.loginForm = {

        email: "",
        password: "",
        errors: []
    };

    $scope.login = function(loginForm) {

        $scope.loginForm.errors = [];

        User.login(loginForm).success(function( data ){

            if( data.success ){

                var user = data.user;

                //$modalInstance.close();

                User.SetCredentials( user.id, user.email, user.userType );

                if (User.isUserFellow()) {
                    $location.url("/profile/fellow");
                } else if (User.isUserCompany()) {
                    $location.url("/profile/company");
                } else if (User.isUserAdmin()) {
                    $location.url("/profile/admin");
                }


            }
            else{

                $scope.loginForm.errors.push( "Invalid user credentials" );
            }

        }).error( function(error){

            $scope.loginForm.errors.push( "Invalid user credentials" );
        });

    };


    //Fellows.all().success(function(fellows){
    //
    //  $scope.fellows = fellows;
    //});

    activate();

    function activate() {
      //console.log('activated home controller!');
      //Home.all();
    }
  }
})();
