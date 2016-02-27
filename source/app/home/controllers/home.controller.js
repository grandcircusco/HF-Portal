/**
* HomeController
* @namespace app.home.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.home.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Fellows'];

  /**
  * @namespace HomeController
  */
  function HomeController($scope, Fellows) {

    var vm = this;

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
