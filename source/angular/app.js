/**
 * ng-route lab
 */

(function () {
  'use strict';

  angular
  .module('app', [
      'app.routes',
      'app.fellows',
      'app.companies'

  ]);

  angular
    .module('app.routes', ['ngRoute']);
})();
