/**
* CompanyVotes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('CompanyVotes', CompanyVotes);

  CompanyVotes.$inject = ['$http'];

  var rootUrl = "http://10.251.1.61:3000";
  //var rootUrl = "localhost:3000";

  /**
  * @namespace CompanyVotes
  * @returns {Service}
  */
  function CompanyVotes($http) {
    var CompanyVotes = {
      get: get,
      create: create,
      destroy: destroy
    };

    return CompanyVotes;

    ////////////////////


    /**
     * @name get by company
     * @desc get the companies one company voted on)
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/votes/company/' + id);
    }

    /**
     * @name create
     * @desc company votes on a company
     */
    function create(content) {
      return $http.post(rootUrl + '/api/v1/votes/company/', {
        content: content
      });
    }

    /**
     * @name destroy
     * @desc destroy a vote record
     */
    function destroy(id) {
      return $http.delete(rootUrl + '/api/v1/votes/company' + id);
    }
  }


})();

