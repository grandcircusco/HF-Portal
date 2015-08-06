/**
* Fellows
* @namespace app.fellows.services
*/
(function () {
  'use strict';

  angular
    .module('app.fellows.services')
    .service('Fellows', Fellows);

  Fellows.$inject = ['$http'];

  var rootUrl = 'https://quiet-cove-6830.herokuapp.com';

  /**
  * @namespace Fellows
  * @returns {Service}
  */
  function Fellows($http) {

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
     * @desc get all the fellows
     */
    function all() {

      return $http.get(rootUrl + '/api/v1/fellows');
    }

    /**
     * @name get
     * @desc get one fellow
     */
    function get(id) {
      return $http.get(rootUrl + '/api/v1/fellows/' + id);
    }
    /**
     * @name create
     * @desc creeate a new fellow record
     */
    function create(fellow) {

      return $http.post(rootUrl + '/api/v1/fellows/', fellow);
    }

    /**
     * @name update
     * @desc updates a fellow record
     */
    function update(fellow, id) {
      return $http.put(rootUrl + '/api/v1/fellows/' + id, fellow);
    }

    /**
     * @name destroy
     * @desc destroy a fellow record
     */
    function destroy(id) {
      return $http.delete(rootUrl + '/api/v1/fellows/' + id);
    }
  }

})();
