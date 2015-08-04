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

  /**
  * @namespace Companies
  * @returns {Service}
  */
  function Companies($http) {
    var Companies = {
      all: all,
      get: get,
      create: create,
      update: update,
      destroy: destroy
    };

    return Companies;

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
     * @desc creeate a new fellow record
     */
    function create(content, id) {
      return $http.post('/api/v1/companies/' + id, {
        content: content
      });
    }

    /**
     * @name update
     * @desc updates a fellow record
     */
    function update(content, id) {
      return $http.update('/api/v1companies/' + id, {
        content: content
      });
    }

    /**
     * @name destroy
     * @desc destroy a fellow record
     */
    function destroy(id) {
      return $http.delete('/api/v1companies/' + id);
    }
  }
})();
