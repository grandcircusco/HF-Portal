(function() {
  'use strict';

  angular
    .module('app.fellows.directives')
    .directive('fellowCard', fellowCard);


 function fellowCard() {
    return {
      replace: true,
      scope: true,
      templateUrl: '/src/views/partials/fellow_card.html',
      link: function(scope, elem, attrs) {
        elem.bind('click', function() {
        });
      }
    };
  });
})();

