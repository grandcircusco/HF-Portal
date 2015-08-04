/**
* AdminProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('AdminProfileController', AdminProfileController)
    .controller('AdminProfileModalInstanceController', AdminProfileModalInstanceController);

    AdminProfileController.$inject = ['$scope', '$modal'];
    AdminProfileModalInstanceController.$inject = ['$scope', '$modalInstance'];

    /**
     * @namespace AdminProfileController
     */
     function AdminProfileController($scope, $modal) {

        $scope.openModal = function() {

            var modalInstance = $modal.open({

                templateUrl: 'source/app/profile/partials/admin-create-user.html',
                controller: 'AdminProfileModalInstanceController',
                size: 'lg',
                resolve: {
                    function(){

                    }
                }

            });
        };
    }

    function AdminProfileModalInstanceController ($scope, $modalInstance) {

        $scope.ok = function (user) {

            // if everything is good log data and close, else highlight error
            if(typeof(user) == "undefined"){
                console.log("No info");
                //heighlight all
            }else if(typeof(user.email) == "undefined"){
                console.log("Bad email");
                //heighlight email
            }else if(typeof(user.password) == "undefined"){
                console.log("Bad password");
                //heighlight password
            }else if(typeof(user.userType) == "undefined"){
                console.log("Bad type");
                //heighlight password
            }else{
                console.log(user);
                $modalInstance.close();
            }


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.switchType = function(user){
            console.log("switch!");
            console.log("user type is " + user.userType);
            
        };
    }

})();
