/**
* Companies
* @namespace app.companies.services
*/
(function () {
  'use strict';

  angular
    .module('app.companies.services')
    .service('Companies', Companies);

  Companies.$inject = ['$http'];

  //var rootUrl = 'https://quiet-cove-6830.herokuapp.com';

  /**
  * @namespace Companies
  * @returns {Service}
  */
  function Companies($http) {

    return {
      all: all,
      get: get,
      create: create,
      update: update,
      destroy: destroy
    };

    ////////////////////

    /**
     * @name all
     * @desc get all the companies
     */
    function all() {
      return $http.get('/api/v1/companies/');
    }

    /**
     * @name get
     * @desc get just one company
     */
    function get(id) {
      return $http.get('/api/v1/companies/' + parseInt(id) );
    }

    /**
     * @name create
     * @desc creeate a new company record
     */
    function create(company) {
      return $http.post('/api/v1/companies/', company);
    }

    /**
     * @name update
     * @desc updates a company record
     */
    function update(company, id) {

      return $http.put('/api/v1/companies/' + id, company);
    }

    /**
     * @name destroy
     * @desc destroy a company record
     */
    function destroy(id) {
      return $http.delete('/api/v1/companies/' + id);
    }
  }
})();
