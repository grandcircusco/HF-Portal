
/**
 * app.routes
 * @desc    contains the routes for the app
 */

 var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'app.companies', 'app.fellows', 'app.profile']);
 var string = "dummy"

/**
 *   * @name config
 *     * @desc Define valid application routes
 *       */
 app.config(function($routeProvider){

    $routeProvider
    .when('/', {
        controller  : 'RoutingController',
        templateUrl : 'source/app/home/home.html'
    })
    .when('/fellows', {
        controller: 'RoutingController',
        templateUrl: 'source/app/fellows/fellows.html'
    })
    .when('/companies', {
        controller: 'CompaniesController',
        templateUrl: 'source/app/companies/companies.html'
    })

    .when('/profile', {
        controller: 'ProfileController',
        templateUrl: 'source/app/profile/profile.html'
    })

    .when('/profile/admin', {
        controller: 'AdminProfileController',
        templateUrl: 'source/app/profile/partials/admin-profile.html'
    })

    .when('/profile/fellow', {
        controller: 'FellowsProfileController',
        templateUrl: 'source/app/profile/partials/fellow-profile.html'
    })

    .when('/profile/company', {
        controller: 'CompanyProfileController',
        templateUrl: 'source/app/profile/partials/company-profile.html'
    })
    .otherwise({ redirectTo: '/' });

});

app.controller('RoutingController', RoutingController)
.controller('LoginModalInstanceController', LoginModalInstanceController)

RoutingController.$inject = ['$scope', '$modal'];
LoginModalInstanceController.$inject = ['$scope', '$modalInstance'];

function RoutingController($scope, $modal) {

  $scope.openModal = function() {
    var modalInstance = $modal.open({
        templateUrl: 'source/app/profile/partials/login-page.html',
        controller: 'LoginModalInstanceController',
        size: 'sm',
        resolve: {
            function(){

            }
        }
    });
}
}

function LoginModalInstanceController ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * companies module
 */

(function () {
  'use strict';

  angular
    .module('app.companies', [
        'app.companies.controllers',
        'app.companies.services',
        'app.companies.directives'
        ]);

  //declare the controllers module
  angular
    .module('app.companies.controllers', []);

  //declare the services module
  angular
    .module('app.companies.services', []);

  // declare the directives module
  angular
    .module('app.companies.directives', []);

})();

/**
 * fellows module
 */

(function () {
  'use strict';

  angular
    .module('app.fellows', [
        'app.fellows.controllers',
        'app.fellows.services',
        'app.fellows.directives'
        ]);

  //declare the controllers module
  angular
    .module('app.fellows.controllers', []);

  //declare the services module
  angular
    .module('app.fellows.services', []);

  //declare the directives module
  angular
    .module('app.fellows.directives', []);


})();

/**
 * home module
 */

(function () {
  'use strict';

  angular
    .module('app.home', [
        'app.home.controllers',
        'app.home.services'
        ]);

  //declare the controllers module
  angular
    .module('app.home.controllers', []);

  //declare the directives module
  angular
    .module('app.home.directives', []);
    //how about this
})();

/**
 * profile module
 */

 (function () {
  'use strict';

  angular
  .module('app.profile', [
    'app.profile.controllers'
    ]);

  //declare the controllers module
  angular
  .module('app.profile.controllers', []);

})();

/**
* CompaniesController
* @namespace app.companies.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.companies.controllers')
    .controller('CompaniesController', CompaniesController)
    .controller('CompaniesModalInstanceController', CompaniesModalInstanceController);

  CompaniesController.$inject = ['$scope', '$modal', 'Companies'];
  CompaniesModalInstanceController.$inject = ['$scope', '$modalInstance', 'company'];

  /**
  * @namespace CompaniesController
  */
  function CompaniesController($scope, $modal, Companies) {

    var vm = this;

    $scope.companies = Companies.all();
    // Use vm for this?
    //Companies.all().success(function(companies){
    //
    //  $scope.companies = companies;
    //
    //});

    console.log($scope.companies);

    $scope.openModal = function (company) {

      var modalInstance = $modal.open({

        templateUrl: 'source/app/companies/partials/company_detail_view.html',
        controller: 'CompaniesModalInstanceController',
        size: 'lg',
        resolve: {
          company: function(){
            return company;
          }
        }

      });

      //modalInstance.result.then(function (selectedItem) {
      //	$scope.selected = selectedItem;
      //}, function () {
      //	$log.info('Modal dismissed at: ' + new Date());
      //});
    };

    activate();

    function activate() {

      console.log('activated companies controller!')

    }

  }

  function CompaniesModalInstanceController($scope, $modalInstance, company){

    $scope.company = company;

    $scope.ok = function () {
      $modalInstance.close($scope.company);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }

})();

(function() {
    'use strict';

    angular
        .module('app.companies.directives')
        .directive('companyCard', companyCard);


    function companyCard() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            templateUrl: '/source/app/companies/partials/company_card.html'/*,
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                });
            }*/
        };
    }

})();
/**
* FellowsController
* @namespace app.fellows.controllers
*/
(function () {
'use strict';

angular
	.module('app.fellows.controllers')
	.controller('FellowsController', FellowsController)
	.controller('FellowsModalInstanceController', FellowsModalInstanceController);

    FellowsController.$inject = ['$scope', '$modal', 'Fellows'];
    FellowsModalInstanceController.$inject = ['$scope', '$modalInstance', 'fellow'];

    /**
     * @namespace FellowsController
     */
    function FellowsController($scope, $modal, Fellows) {
        var vm = this;

        activate();

        function activate() {
            console.log('activated fellows controller!')
            //Fellows.all();
        }

        $scope.fellows = Fellows.all();

        $scope.openModal = function(fellow) {

            var modalInstance = $modal.open({

                templateUrl: 'source/app/fellows/partials/fellow_detail_view.html',
                controller: 'FellowsModalInstanceController',
                size: 'lg',
                resolve: {
                    fellow: function(){
                        return fellow;
                    }
                }

            });
        };


    }

    function FellowsModalInstanceController ($scope, $modalInstance, fellow) {


        $scope.fellow = fellow;

        $scope.ok = function () {
            $modalInstance.close($scope.fellow);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }

})();

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

      return [];

      //return $http.get('/api/v1/companies/');
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

(function() {
  'use strict';

  angular
    .module('app.fellows.directives')
    .directive('fellowCard', fellowCard);


 function fellowCard() {
    return {
      restrice: 'AE',
      replace: true,
      scope: true,
      templateUrl: '/source/app/fellows/partials/fellow_card.html'/*,
       link: function(scope, elem, attrs) {
        elem.bind('click', function() {
        });
       } */
    };
  }
})();
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
    var Fellows = {
      all: all,
      get: get,
      create: create,
      update: update,
      destroy: destroy
    };

    return Fellows;

    ////////////////////

    /**
     * @name all
     * @desc get all the fellows
     */
    function all() {

      return [
        {
          name:	'Name 1',
          tags:	['C++', 'Java', 'PHP'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'/public/assets/images/placeholder-hi.png'
        },
        {
          name:	'Name 2',
          tags:	['C++', 'Matlab', 'PHP'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'/public/assets/images/placeholder-hi.png'
        },
        
        {
          name:	'Name 3',
          tags:	['C++', 'Java', 'C'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'/public/assets/images/placeholder-hi.png'
        },
        {
          name:	'Name 4',
          tags:	['C++', 'Android', 'PHP'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'/public/assets/images/placeholder-hi.png'
        }
      ];

      //return $http.get('/fellows/');
    }

    /**
     * @name get
     * @desc get one fellow
     */
    function get(id) {
      return $http.get('/fellows/' + i);
    }
    /**
     * @name create
     * @desc creeate a new fellow record
     */
    function create(content, id) {
      return $http.post('/fellows/' + id, {
        content: content
      });
    }

    /**
     * @name update
     * @desc updates a fellow record
     */
    function update(content, id) {
      return $http.update('/fellows/' + id, {
        content: content
      });
    }

    /**
     * @name destroy
     * @desc destroy a fellow record
     */
    function destroy(id) {
      return $http.delete('/fellows/' + id);
    }
  }

})();

/**
* HomeController
* @namespace app.home.controllers
*/
(function () {
  'use strict';

  angular
    .module('app.home.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope'];

  /**
  * @namespace HomeController
  */
  function HomeController($scope) {
    var vm = this;

    activate();

    function activate() {
      console.log('activated home controller!')
      //Home.all();
    }
  }
})();

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

/**
* CompanyProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('CompanyProfileController', CompanyProfileController);

    CompanyProfileController.$inject = ['$scope'];

    /**
    * @namespace CompanyProfileController
    */
    function CompanyProfileController($scope) {
        var vm = this;

        $scope.company= {
            img:"public/assets/images/placeholder-hi.png"
        };

       

        $(".js-example-tokenizer").select2({
          tags: true,
          tokenSeparators: [',', ' ']
          
        });

        

        activate();

        function activate() {
            console.log('activated profile controller!');
            //Profile.all();
        };
        
        $scope.update= function() {
            $scope.company.skills = $(".js-example-tokenizer").val();
            console.log($scope.company);
            
        };


    }



})();

/**
* FellowsProfileController
* @namespace app.profile.controllers
*/
(function () {
    'use strict';

    angular
    .module('app.profile.controllers')
    .controller('FellowsProfileController', FellowsProfileController);

    FellowsProfileController.$inject = ['$scope'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope) {
        var vm = this;

        $scope.fellow = {
            bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
            img:"public/assets/images/placeholder-hi.png"
        };

        // $(document).ready(function() {
        //       $(".js-example-basic-multiple").select2({
        //             maximumSelectionLength: 3
        //         });
        // });

        $(".js-example-tokenizer").select2({
          tags: true,
          tokenSeparators: [',', ' ']
          
        });

        

        activate();

        function activate() {
            console.log('activated profile controller!');
            //Profile.all();
        };
        
        $scope.update= function() {
            $scope.fellow.skills = $(".js-example-tokenizer").val();
            console.log($scope.fellow);
            
        };


    }



})();

/**
* ProfileController
* @namespace app.profile.controllers
*/
(function () {
  'use strict';

  angular
  .module('app.profile.controllers')
  .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$scope'];
  /**
  * @namespace ProfileController
  */
  function ProfileController($scope) {
    var vm = this;


  }


})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbXBhbmllcy9jb21wYW5pZXMubW9kdWxlLmpzIiwiZmVsbG93cy9mZWxsb3dzLm1vZHVsZS5qcyIsImhvbWUvaG9tZS5tb2R1bGUuanMiLCJwcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwiY29tcGFuaWVzL2NvbnRyb2xsZXJzL2NvbXBhbmllcy5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3dzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvc2VydmljZXMvY29tcGFuaWVzLnNlcnZpY2UuanMiLCJmZWxsb3dzL2RpcmVjdGl2ZXMvZmVsbG93Q2FyZC5kaXJlY3RpdmUuanMiLCJmZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsImhvbWUvY29udHJvbGxlcnMvaG9tZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9hZG1pblByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvY29tcGFueVByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvZmVsbG93c1Byb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvcHJvZmlsZS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIGFwcC5yb3V0ZXNcclxuICogQGRlc2MgICAgY29udGFpbnMgdGhlIHJvdXRlcyBmb3IgdGhlIGFwcFxyXG4gKi9cclxuXHJcbiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAnYXBwLmNvbXBhbmllcycsICdhcHAuZmVsbG93cycsICdhcHAucHJvZmlsZSddKTtcclxuIHZhciBzdHJpbmcgPSBcImR1bW15XCJcclxuXHJcbi8qKlxyXG4gKiAgICogQG5hbWUgY29uZmlnXHJcbiAqICAgICAqIEBkZXNjIERlZmluZSB2YWxpZCBhcHBsaWNhdGlvbiByb3V0ZXNcclxuICogICAgICAgKi9cclxuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xyXG5cclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAud2hlbignLycsIHtcclxuICAgICAgICBjb250cm9sbGVyICA6ICdSb3V0aW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmwgOiAnc291cmNlL2FwcC9ob21lL2hvbWUuaHRtbCdcclxuICAgIH0pXHJcbiAgICAud2hlbignL2ZlbGxvd3MnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ1JvdXRpbmdDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9mZWxsb3dzLmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLndoZW4oJy9jb21wYW5pZXMnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFuaWVzLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC53aGVuKCcvcHJvZmlsZScsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3Byb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2FkbWluJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblByb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi1wcm9maWxlLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC53aGVuKCcvcHJvZmlsZS9mZWxsb3cnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvZmVsbG93LXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2NvbXBhbnknLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvY29tcGFueS1wcm9maWxlLmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLm90aGVyd2lzZSh7IHJlZGlyZWN0VG86ICcvJyB9KTtcclxuXHJcbn0pO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1JvdXRpbmdDb250cm9sbGVyJywgUm91dGluZ0NvbnRyb2xsZXIpXHJcbi5jb250cm9sbGVyKCdMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcilcclxuXHJcblJvdXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnXTtcclxuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnXTtcclxuXHJcbmZ1bmN0aW9uIFJvdXRpbmdDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsKSB7XHJcblxyXG4gICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2xvZ2luLXBhZ2UuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHNpemU6ICdzbScsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcclxuICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgfTtcclxufVxyXG4iLCIvKipcclxuICogY29tcGFuaWVzIG1vZHVsZVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzJywgW1xyXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsXHJcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcydcclxuICAgICAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnLCBbXSk7XHJcblxyXG4gIC8vIGRlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJywgW10pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIGZlbGxvd3MgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzJywgW1xyXG4gICAgICAgICdhcHAuZmVsbG93cy5jb250cm9sbGVycycsXHJcbiAgICAgICAgJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJyxcclxuICAgICAgICAnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcydcclxuICAgICAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycsIFtdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIGhvbWUgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lJywgW1xyXG4gICAgICAgICdhcHAuaG9tZS5jb250cm9sbGVycycsXHJcbiAgICAgICAgJ2FwcC5ob21lLnNlcnZpY2VzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuZGlyZWN0aXZlcycsIFtdKTtcclxuICAgIC8vaG93IGFib3V0IHRoaXNcclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIHByb2ZpbGUgbW9kdWxlXHJcbiAqL1xyXG5cclxuIChmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXHJcbiAgICAnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnXHJcbiAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBDb21wYW5pZXNDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcclxuICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgQ29tcGFuaWVzQ29udHJvbGxlcilcclxuICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcclxuXHJcbiAgQ29tcGFuaWVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJ0NvbXBhbmllcyddO1xyXG4gIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55J107XHJcblxyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNDb250cm9sbGVyXHJcbiAgKi9cclxuICBmdW5jdGlvbiBDb21wYW5pZXNDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBDb21wYW5pZXMpIHtcclxuXHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICRzY29wZS5jb21wYW5pZXMgPSBDb21wYW5pZXMuYWxsKCk7XHJcbiAgICAvLyBVc2Ugdm0gZm9yIHRoaXM/XHJcbiAgICAvL0NvbXBhbmllcy5hbGwoKS5zdWNjZXNzKGZ1bmN0aW9uKGNvbXBhbmllcyl7XHJcbiAgICAvL1xyXG4gICAgLy8gICRzY29wZS5jb21wYW5pZXMgPSBjb21wYW5pZXM7XHJcbiAgICAvL1xyXG4gICAgLy99KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuY29tcGFuaWVzKTtcclxuXHJcbiAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKGNvbXBhbnkpIHtcclxuXHJcbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICBzaXplOiAnbGcnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wYW55O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9tb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcclxuICAgICAgLy9cdCRzY29wZS5zZWxlY3RlZCA9IHNlbGVjdGVkSXRlbTtcclxuICAgICAgLy99LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vXHQkbG9nLmluZm8oJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xyXG4gICAgICAvL30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG5cclxuICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKVxyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55KXtcclxuXHJcbiAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XHJcblxyXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuY29tcGFueSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBjb21wYW55Q2FyZCk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhbnlDYXJkKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8qKlxyXG4qIEZlbGxvd3NDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxyXG5cdC5jb250cm9sbGVyKCdGZWxsb3dzQ29udHJvbGxlcicsIEZlbGxvd3NDb250cm9sbGVyKVxyXG5cdC5jb250cm9sbGVyKCdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIEZlbGxvd3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnRmVsbG93cyddO1xyXG4gICAgRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdmZWxsb3cnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmVsbG93c0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIEZlbGxvd3MpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJylcclxuICAgICAgICAgICAgLy9GZWxsb3dzLmFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBGZWxsb3dzLmFsbCgpO1xyXG5cclxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oZmVsbG93KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfZGV0YWlsX3ZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmVsbG93OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmVsbG93O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdykge1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcclxuXHJcbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuZmVsbG93KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQ29tcGFuaWVzXHJcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLnNlcnZpY2VzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xyXG5cclxuICBDb21wYW5pZXMuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIENvbXBhbmllc1xyXG4gICogQHJldHVybnMge1NlcnZpY2V9XHJcbiAgKi9cclxuICBmdW5jdGlvbiBDb21wYW5pZXMoJGh0dHApIHtcclxuICAgIHZhciBDb21wYW5pZXMgPSB7XHJcbiAgICAgIGFsbDogYWxsLFxyXG4gICAgICBnZXQ6IGdldCxcclxuICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICBkZXN0cm95OiBkZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBDb21wYW5pZXM7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFsbCgpIHtcclxuXHJcbiAgICAgIHJldHVybiBbXTtcclxuXHJcbiAgICAgIC8vcmV0dXJuICRodHRwLmdldCgnL2FwaS92MS9jb21wYW5pZXMvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBnZXRcclxuICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldChpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3YxL2NvbXBhbmllcy8nICsgcGFyc2VJbnQoaWQpICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBjcmVhdGVcclxuICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGUoY29udGVudCwgaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdjEvY29tcGFuaWVzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1cGRhdGVcclxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAudXBkYXRlKCcvYXBpL3YxY29tcGFuaWVzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBkZXN0cm95XHJcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvdjFjb21wYW5pZXMvJyArIGlkKTtcclxuICAgIH1cclxuICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgnZmVsbG93Q2FyZCcsIGZlbGxvd0NhcmQpO1xyXG5cclxuXHJcbiBmdW5jdGlvbiBmZWxsb3dDYXJkKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdHJpY2U6ICdBRScsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2ZlbGxvd3MvcGFydGlhbHMvZmVsbG93X2NhcmQuaHRtbCcvKixcclxuICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB9KTtcclxuICAgICAgIH0gKi9cclxuICAgIH07XHJcbiAgfVxyXG59KSgpOyIsIi8qKlxyXG4qIEZlbGxvd3NcclxuKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLnNlcnZpY2VzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXHJcbiAgICAuc2VydmljZSgnRmVsbG93cycsIEZlbGxvd3MpO1xyXG5cclxuICBGZWxsb3dzLiRpbmplY3QgPSBbJyRodHRwJ107XHJcblxyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBGZWxsb3dzXHJcbiAgKiBAcmV0dXJucyB7U2VydmljZX1cclxuICAqL1xyXG4gIGZ1bmN0aW9uIEZlbGxvd3MoJGh0dHApIHtcclxuICAgIHZhciBGZWxsb3dzID0ge1xyXG4gICAgICBhbGw6IGFsbCxcclxuICAgICAgZ2V0OiBnZXQsXHJcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxyXG4gICAgICB1cGRhdGU6IHVwZGF0ZSxcclxuICAgICAgZGVzdHJveTogZGVzdHJveVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gRmVsbG93cztcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgYWxsXHJcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFsbCgpIHtcclxuXHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDEnLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ0phdmEnLCAnUEhQJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDInLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ01hdGxhYicsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J05hbWUgMycsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdDJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDQnLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ0FuZHJvaWQnLCAnUEhQJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuXHJcbiAgICAgIC8vcmV0dXJuICRodHRwLmdldCgnL2ZlbGxvd3MvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBnZXRcclxuICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldChpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZmVsbG93cy8nICsgaSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGNyZWF0ZVxyXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2ZlbGxvd3MvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIHVwZGF0ZVxyXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbnRlbnQsIGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC51cGRhdGUoJy9mZWxsb3dzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBkZXN0cm95XHJcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9mZWxsb3dzLycgKyBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogSG9tZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5ob21lLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcclxuICAqL1xyXG4gIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGhvbWUgY29udHJvbGxlciEnKVxyXG4gICAgICAvL0hvbWUuYWxsKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBBZG1pblByb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlQ29udHJvbGxlcilcclxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcclxuXHJcbiAgICBBZG1pblByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnXTtcclxuICAgIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBBZG1pblByb2ZpbGVDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLWNyZWF0ZS11c2VyLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAodXNlcikge1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgZXZlcnl0aGluZyBpcyBnb29kIGxvZyBkYXRhIGFuZCBjbG9zZSwgZWxzZSBoaWdobGlnaHQgZXJyb3JcclxuICAgICAgICAgICAgaWYodHlwZW9mKHVzZXIpID09IFwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBpbmZvXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9oZWlnaGxpZ2h0IGFsbFxyXG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YodXNlci5lbWFpbCkgPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhZCBlbWFpbFwiKTtcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2hsaWdodCBlbWFpbFxyXG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YodXNlci5wYXNzd29yZCkgPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhZCBwYXNzd29yZFwiKTtcclxuICAgICAgICAgICAgICAgIC8vaGVpZ2hsaWdodCBwYXNzd29yZFxyXG4gICAgICAgICAgICB9ZWxzZSBpZih0eXBlb2YodXNlci51c2VyVHlwZSkgPT0gXCJ1bmRlZmluZWRcIil7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJhZCB0eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgLy9oZWlnaGxpZ2h0IHBhc3N3b3JkXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlcik7XHJcbiAgICAgICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuc3dpdGNoVHlwZSA9IGZ1bmN0aW9uKHVzZXIpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInN3aXRjaCFcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXNlciB0eXBlIGlzIFwiICsgdXNlci51c2VyVHlwZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBDb21wYW55UHJvZmlsZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcik7XHJcblxyXG4gICAgQ29tcGFueVByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAbmFtZXNwYWNlIENvbXBhbnlQcm9maWxlQ29udHJvbGxlclxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIENvbXBhbnlQcm9maWxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAkc2NvcGUuY29tcGFueT0ge1xyXG4gICAgICAgICAgICBpbWc6XCJwdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmdcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgXHJcblxyXG4gICAgICAgICQoXCIuanMtZXhhbXBsZS10b2tlbml6ZXJcIikuc2VsZWN0Mih7XHJcbiAgICAgICAgICB0YWdzOiB0cnVlLFxyXG4gICAgICAgICAgdG9rZW5TZXBhcmF0b3JzOiBbJywnLCAnICddXHJcbiAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKTtcclxuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZT0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jb21wYW55LnNraWxscyA9ICQoXCIuanMtZXhhbXBsZS10b2tlbml6ZXJcIikudmFsKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jb21wYW55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcik7XHJcblxyXG4gICAgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93ID0ge1xyXG4gICAgICAgICAgICBiaW86XCJJIGFtIGEgcGVyc29uLiBJIHdlbnQgdG8gc2Nob29sLiBJIGhhdmUgYSBkZWdyZWUuIFBsZWFzZSBwYXkgbWUgbW9uZXlzXCIsXHJcbiAgICAgICAgICAgIGltZzpcInB1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZ1wiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gICAgICAgJChcIi5qcy1leGFtcGxlLWJhc2ljLW11bHRpcGxlXCIpLnNlbGVjdDIoe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIG1heGltdW1TZWxlY3Rpb25MZW5ndGg6IDNcclxuICAgICAgICAvLyAgICAgICAgIH0pO1xyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAkKFwiLmpzLWV4YW1wbGUtdG9rZW5pemVyXCIpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgdGFnczogdHJ1ZSxcclxuICAgICAgICAgIHRva2VuU2VwYXJhdG9yczogWycsJywgJyAnXVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XHJcbiAgICAgICAgICAgIC8vUHJvZmlsZS5hbGwoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS51cGRhdGU9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZmVsbG93LnNraWxscyA9ICQoXCIuanMtZXhhbXBsZS10b2tlbml6ZXJcIikudmFsKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mZWxsb3cpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIFByb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XHJcblxyXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBQcm9maWxlQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==