/**
* Votes
* @namespace app.votes.services
*/
(function () {
  'use strict';

  angular
    .module('app.votes.services')
    .service('Votes', Votes);

  Votes.$inject = ['$http'];

  /**
  * @namespace Votes
  * @returns {Service}
  */
  function Votes($http) {
    var Votes = {
      getByvote: getByvote,
      getByCompany: getByCompany,
      create: create,
      destroy: destroy
    };

    return Votes;

    ////////////////////


    /**
     * @name get
     * @desc get the companies one vote voted on)
     */
    function getByvote(id) {
      return $http.get('/votes/vote/' + i);
    }

    /**
     * @name get
     * @desc get the votes one company voted on
     */
    function getByCompany(id) {
      return $http.get('/votes/company/' + i);
    }

    /**
     * @name create
     * @desc create a new vote record
     */
    function create(content) {
      return $http.post('/votes/', {
        content: content
      });
    }

    /**
     * @name update
     * @desc updates a vote record
     */
    function update(content, id) {
      return $http.update('/votes/' + id, {
        content: content
      });
    }

    /**
     * @name destroy
     * @desc destroy a vote record
     */
    function destroy(id) {
      return $http.delete('/votes/' + id);
    }
  }


})();

