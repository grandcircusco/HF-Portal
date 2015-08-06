/**
* FellowVotes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('FellowVotes', FellowVotes);

  FellowVotes.$inject = ['$http'];

  /**
  * @namespace FellowVotes
  * @returns {Service}
  */
  function FellowVotes($http) {
    var FellowVotes = {
      get: get,
      create: create,
      destroy: destroy
    };

    return FellowVotes;

    ////////////////////


    /**
     * @name get by company
     * @desc get the companies one fellow voted on)
     */
    function get(id) {
      return $http.get('/votes/fellow/' + id);
    }

    /**
     * @name create
     * @desc fellow votes on a company
     */
    function create(content) {
      return $http.post('/votes/fellow/', {
        content: content
      });
    }

    /**
     * @name destroy
     * @desc destroy a vote record
     */
    function destroy(id) {
      return $http.delete('/votes/fellow' + id);
    }
  }


})();

