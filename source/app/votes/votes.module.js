/**
 * votes module
 */

(function () {
  'use strict';

  angular
    .module('app.votes', [
        'app.votes.controllers',
        'app.votes.services'
        //'app.votes.directives'
        ]);

  //declare the controllers module
  angular
    .module('app.votes.controllers', []);

  //declare the services module
  angular
    .module('app.votes.services', []);

  //declare the directives module
  //angular
  //  .module('app.votes.directives', []);


})();
