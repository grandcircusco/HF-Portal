/**
 * Profile
 * @namespace app.profile.services
 */
(function () {
    'use strict';

    angular
        .module('app.profile.services')
        .service('User', User);

    User.$inject = ['$http'];

    /**
     * @namespace User
     * @returns {Service}
     */
    function User($http) {

        var User = {

            //all: all,
            //get: get,
            create: create,
            login: login
            //update: update,
            //destroy: destroy
        };

        return User;

        ////////////////////

        /**
         * @name all
         * @desc get all the companies
         */
        //function all() {
        //
        //    return [];
        //
        //    //return $http.get('/api/v1/companies/');
        //}

        /**
         * @name get
         * @desc get just one company
         */
        //function get(id) {
        //    return $http.get('/api/v1/users/' + parseInt(id) );
        //}

        /**
         * @name create
         * @desc creeate a new fellow record
         */
        function create(content) {
            return $http.post('/api/v1/users/create', {
                content: content
            });
        }

        /**
         * @name login
         * @desc login a new fellow record
         */
        function login(content) {

            return $http.post('/api/v1/users/login', {
                content: content
            });
        }


        /**
         * @name update
         * @desc updates a fellow record
         */
        //function update(content, id) {
        //    return $http.update('/api/v1/users/' + id, {
        //        content: content
        //    });
        //}

        /**
         * @name destroy
         * @desc destroy a fellow record
         */
        //function destroy(id) {
        //    return $http.delete('/api/v1/users/' + id);
        //}
    }
})();
