/**
* CompanyVotes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('CompanyVotes', CompanyVotes);

  CompanyVotes.$inject = ['$http', 'CONFIG'];


  /**
  * @namespace CompanyVotes
  */
  function CompanyVotes($http, CONFIG) {

    var rootUrl = CONFIG.SERVICE_URL;

    return {
      get: get,
      create: create,
      destroy: destroy
    };

    /**
     * @name get by company
     * @desc get the companies one company voted on)
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/votes/company/' + id);
    }

    /**
     * @name create
     * @desc company votes on a fellow
     */
     function create(user_id, company_id) {
      console.log(company_id + ' ' + user_id);
      return $http.post(rootUrl + '/api/v1/votes/company/', {
        company_id: company_id,
        user_id: user_id
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

