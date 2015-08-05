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

      return $http.get('http://10.251.1.61:3000/api/v1/fellows');
    }

    /**
     * @name get
     * @desc get one fellow
     */
    function get(id) {
      return $http.get('http://10.251.1.61:3000/api/v1/fellows/' + id);
    }
    /**
     * @name create
     * @desc creeate a new fellow record
     */
    function create(fellow) {
      return $http.post('http://10.251.1.61:3000/api/v1/fellows', fellow);
    }

    /**
     * @name update
     * @desc updates a fellow record
     */
    function update(fellow, id) {
      return $http.put('http://10.251.1.61:3000/api/v1/fellows/' + id, fellow);
    }

    /**
     * @name destroy
     * @desc destroy a fellow record
     */
    function destroy(id) {
      return $http.delete('http://10.251.1.61:3000/api/v1/fellows/' + id);
    }
  }

})();
