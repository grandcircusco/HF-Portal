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
      getByFellow: getByFellow,
      getByCompany: getByCompany,
      fellowVote: fellowVote,
      companyVote: companyVote,
      destroy: destroy
    };

    return Votes;

    ////////////////////


    /**
     * @name get by company
     * @desc get the companies one fellow voted on)
     */
    function getByFellow(id) {
      return $http.get('/votes/vote/' + i);
    }

    /**
     * @name get by fellow
     * @desc get the votes one company voted on
     */
    function getByCompany(id) {
      return $http.get('/votes/company/' + i);
    }


    /**
     * @name create
     * @desc fellow votes on a company
     */
    function fellowVote(content) {
      return $http.post('/votes/fellow/', {
        content: content
      });
    }

    /**
     * @name create
     * @desc company votes on a fellow
     */
    function companyVote(content) {
      return $http.post('/votes/company/', {
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

