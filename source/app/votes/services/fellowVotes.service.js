/**
* FellowVotes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('FellowVotes', FellowVotes);

  FellowVotes.$inject = ['$http', 'CONFIG'];


  /**
  * @namespace FellowVotes
  */
  function FellowVotes($http, CONFIG) {

    var rootUrl = CONFIG.SERVICE_URL;

    return {
      get: get,
      create: create,
      destroy: destroy
    };


    ////////////////////


    /**
     * @name get by company
     * @desc get the companies one fellow voted on)
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/votes/fellow/' + id);
    }

    /**
     * @name create
     * @desc fellow votes on a company
     */
    function create(user_id, fellow_id) {
      console.log("fellowVoteCreate" + user_id + ' ' + fellow_id);
      return $http.post(rootUrl + '/api/v1/votes/fellow/', {
        user_id: user_id,
        fellow_id: fellow_id
      });
    }

    /**
     * @name destroy
     * @desc destroy a vote record
     */
    function destroy(id) {
      return $http.delete(rootUrl + '/api/v1/votes/fellow' + id);
    }
  }


})();

