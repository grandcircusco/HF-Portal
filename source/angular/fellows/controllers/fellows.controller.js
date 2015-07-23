/**
* FellowsController
* @namespace app.fellows.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.fellows.controllers')
    .controller('FellowsController', FellowsController);

  FellowsController.$inject = ['$scope', 'Fellows'];

  /**
  * @namespace FellowsController
  */
  function FellowsController($scope, Fellows) {
    var vm = this;

    activate();

    function activate() {
      console.log('activated fellows controller!')
      //Fellows.all();
    }

  }
})();
