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
         * @desc create a new fellow record
         */
        function create(user) {
            return $http.post('http://localhost:3000/api/v1/users/create', user);
        }

        /**
         * @name login
         * @desc login a new fellow record
         */
        function login(user) {

            return $http.post('http://localhost:3000/api/v1/users/login', user);
        }

        function SetCredentials(email, userType, password) {

            var authdata = Base64.encode(email + ':' + password + ':' +  userType);

            $rootScope.globals = {
                currentUser: {
                    email: email,
                    userType: userType,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function ClearCredentials() {

            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
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
