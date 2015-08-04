
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

    // Use vm for this?
    $scope.companies = Companies.all();

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

      return [

        {
          id: 1,
          name:	'Company 1',
          user_id: '1',
          email: "",
          primary_contact: "",
          company_size: "",
          industry: "",
          description: "",
          founding_year: 2013,
          founders: "",
          verified: 1,
          image_url: "",
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
          name:	'Company 2',
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
          name:	'Company 3',
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
          name:	'Company 4',
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
          name:	'Company 5',
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
        }

      ];

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

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
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

        $scope.fellow= {
            bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
            img:"public/assets/images/placeholder-hi.png"
        };

        activate();

        function activate() {
            console.log('activated profile controller!');
            //Profile.all();
        };

        $scope.update= function() {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbXBhbmllcy9jb21wYW5pZXMubW9kdWxlLmpzIiwiZmVsbG93cy9mZWxsb3dzLm1vZHVsZS5qcyIsImhvbWUvaG9tZS5tb2R1bGUuanMiLCJwcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwiY29tcGFuaWVzL2NvbnRyb2xsZXJzL2NvbXBhbmllcy5jb250cm9sbGVyLmpzIiwiY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3dzLmNvbnRyb2xsZXIuanMiLCJjb21wYW5pZXMvc2VydmljZXMvY29tcGFuaWVzLnNlcnZpY2UuanMiLCJmZWxsb3dzL2RpcmVjdGl2ZXMvZmVsbG93Q2FyZC5kaXJlY3RpdmUuanMiLCJmZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsImhvbWUvY29udHJvbGxlcnMvaG9tZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS9jb250cm9sbGVycy9hZG1pblByb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvZmVsbG93c1Byb2ZpbGUuY29udHJvbGxlci5qcyIsInByb2ZpbGUvY29udHJvbGxlcnMvcHJvZmlsZS5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogYXBwLnJvdXRlc1xyXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXHJcbiAqL1xyXG5cclxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ3VpLmJvb3RzdHJhcCcsICdhcHAuY29tcGFuaWVzJywgJ2FwcC5mZWxsb3dzJywgJ2FwcC5wcm9maWxlJ10pO1xyXG4gdmFyIHN0cmluZyA9IFwiZHVtbXlcIlxyXG5cclxuLyoqXHJcbiAqICAgKiBAbmFtZSBjb25maWdcclxuICogICAgICogQGRlc2MgRGVmaW5lIHZhbGlkIGFwcGxpY2F0aW9uIHJvdXRlc1xyXG4gKiAgICAgICAqL1xyXG4gYXBwLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XHJcblxyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXIgIDogJ1JvdXRpbmdDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybCA6ICdzb3VyY2UvYXBwL2hvbWUvaG9tZS5odG1sJ1xyXG4gICAgfSlcclxuICAgIC53aGVuKCcvZmVsbG93cycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnUm91dGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvd3MuaHRtbCdcclxuICAgIH0pXHJcbiAgICAud2hlbignL2NvbXBhbmllcycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW5pZXMuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUvYWRtaW4nLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvdycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9mZWxsb3ctcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUvY29tcGFueScsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9jb21wYW55LXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xyXG5cclxufSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignUm91dGluZ0NvbnRyb2xsZXInLCBSb3V0aW5nQ29udHJvbGxlcilcclxuLmNvbnRyb2xsZXIoJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxyXG5cclxuUm91dGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCddO1xyXG5Mb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZSddO1xyXG5cclxuZnVuY3Rpb24gUm91dGluZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwpIHtcclxuXHJcbiAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvbG9naW4tcGFnZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgc2l6ZTogJ3NtJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxufVxyXG5cclxuZnVuY3Rpb24gTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xyXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICB9O1xyXG59XHJcbiIsIi8qKlxyXG4gKiBjb21wYW5pZXMgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXHJcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJyxcclxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcclxuXHJcbiAgLy8gZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogZmVsbG93cyBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MnLCBbXHJcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAnYXBwLmZlbGxvd3Muc2VydmljZXMnLFxyXG4gICAgICAgICdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogaG9tZSBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUnLCBbXHJcbiAgICAgICAgJ2FwcC5ob21lLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAnYXBwLmhvbWUuc2VydmljZXMnXHJcbiAgICAgICAgXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5kaXJlY3RpdmVzJywgW10pO1xyXG4gICAgLy9ob3cgYWJvdXQgdGhpc1xyXG59KSgpO1xyXG4iLCIvKipcclxuICogcHJvZmlsZSBtb2R1bGVcclxuICovXHJcblxyXG4gKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAubW9kdWxlKCdhcHAucHJvZmlsZScsIFtcclxuICAgICdhcHAucHJvZmlsZS5jb250cm9sbGVycydcclxuICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIENvbXBhbmllc0NvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0NvbnRyb2xsZXInLCBDb21wYW5pZXNDb250cm9sbGVyKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuICBDb21wYW5pZXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnQ29tcGFuaWVzJ107XHJcbiAgQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2NvbXBhbnknXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIENvbXBhbmllc0NvbnRyb2xsZXJcclxuICAqL1xyXG4gIGZ1bmN0aW9uIENvbXBhbmllc0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIENvbXBhbmllcykge1xyXG5cclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgLy8gVXNlIHZtIGZvciB0aGlzP1xyXG4gICAgJHNjb3BlLmNvbXBhbmllcyA9IENvbXBhbmllcy5hbGwoKTtcclxuXHJcbiAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24gKGNvbXBhbnkpIHtcclxuXHJcbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfZGV0YWlsX3ZpZXcuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICBzaXplOiAnbGcnLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgIGNvbXBhbnk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wYW55O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy9tb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcclxuICAgICAgLy9cdCRzY29wZS5zZWxlY3RlZCA9IHNlbGVjdGVkSXRlbTtcclxuICAgICAgLy99LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vXHQkbG9nLmluZm8oJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xyXG4gICAgICAvL30pO1xyXG4gICAgfTtcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG5cclxuICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBjb21wYW5pZXMgY29udHJvbGxlciEnKVxyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBjb21wYW55KXtcclxuXHJcbiAgICAkc2NvcGUuY29tcGFueSA9IGNvbXBhbnk7XHJcblxyXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuY29tcGFueSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnY29tcGFueUNhcmQnLCBjb21wYW55Q2FyZCk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhbnlDYXJkKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9jYXJkLmh0bWwnLyosXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgICAgICAgICAgZWxlbS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8qKlxyXG4qIEZlbGxvd3NDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnKVxyXG5cdC5jb250cm9sbGVyKCdGZWxsb3dzQ29udHJvbGxlcicsIEZlbGxvd3NDb250cm9sbGVyKVxyXG5cdC5jb250cm9sbGVyKCdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIEZlbGxvd3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnLCAnRmVsbG93cyddO1xyXG4gICAgRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdmZWxsb3cnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2UgRmVsbG93c0NvbnRyb2xsZXJcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmVsbG93c0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwsIEZlbGxvd3MpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBmZWxsb3dzIGNvbnRyb2xsZXIhJylcclxuICAgICAgICAgICAgLy9GZWxsb3dzLmFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmZlbGxvd3MgPSBGZWxsb3dzLmFsbCgpO1xyXG5cclxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oZmVsbG93KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfZGV0YWlsX3ZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c01vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmVsbG93OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmVsbG93O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGZlbGxvdykge1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLmZlbGxvdyA9IGZlbGxvdztcclxuXHJcbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuZmVsbG93KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQ29tcGFuaWVzXHJcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLnNlcnZpY2VzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xyXG5cclxuICBDb21wYW5pZXMuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIENvbXBhbmllc1xyXG4gICogQHJldHVybnMge1NlcnZpY2V9XHJcbiAgKi9cclxuICBmdW5jdGlvbiBDb21wYW5pZXMoJGh0dHApIHtcclxuICAgIHZhciBDb21wYW5pZXMgPSB7XHJcbiAgICAgIGFsbDogYWxsLFxyXG4gICAgICBnZXQ6IGdldCxcclxuICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICBkZXN0cm95OiBkZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBDb21wYW5pZXM7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFsbCgpIHtcclxuXHJcbiAgICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgbmFtZTpcdCdDb21wYW55IDEnLFxyXG4gICAgICAgICAgdXNlcl9pZDogJzEnLFxyXG4gICAgICAgICAgZW1haWw6IFwiXCIsXHJcbiAgICAgICAgICBwcmltYXJ5X2NvbnRhY3Q6IFwiXCIsXHJcbiAgICAgICAgICBjb21wYW55X3NpemU6IFwiXCIsXHJcbiAgICAgICAgICBpbmR1c3RyeTogXCJcIixcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxyXG4gICAgICAgICAgZm91bmRpbmdfeWVhcjogMjAxMyxcclxuICAgICAgICAgIGZvdW5kZXJzOiBcIlwiLFxyXG4gICAgICAgICAgdmVyaWZpZWQ6IDEsXHJcbiAgICAgICAgICBpbWFnZV91cmw6IFwiXCIsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J0NvbXBhbnkgMicsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J0NvbXBhbnkgMycsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J0NvbXBhbnkgNCcsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J0NvbXBhbnkgNScsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgXTtcclxuXHJcbiAgICAgIC8vcmV0dXJuICRodHRwLmdldCgnL2FwaS92MS9jb21wYW5pZXMvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBnZXRcclxuICAgICAqIEBkZXNjIGdldCBqdXN0IG9uZSBjb21wYW55XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldChpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3YxL2NvbXBhbmllcy8nICsgcGFyc2VJbnQoaWQpICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBjcmVhdGVcclxuICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGUoY29udGVudCwgaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvdjEvY29tcGFuaWVzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1cGRhdGVcclxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAudXBkYXRlKCcvYXBpL3YxY29tcGFuaWVzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBkZXN0cm95XHJcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvdjFjb21wYW5pZXMvJyArIGlkKTtcclxuICAgIH1cclxuICB9XHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnKVxyXG4gICAgLmRpcmVjdGl2ZSgnZmVsbG93Q2FyZCcsIGZlbGxvd0NhcmQpO1xyXG5cclxuXHJcbiBmdW5jdGlvbiBmZWxsb3dDYXJkKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdHJpY2U6ICdBRScsXHJcbiAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2ZlbGxvd3MvcGFydGlhbHMvZmVsbG93X2NhcmQuaHRtbCcvKixcclxuICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB9KTtcclxuICAgICAgIH0gKi9cclxuICAgIH07XHJcbiAgfVxyXG59KSgpOyIsIi8qKlxyXG4qIEZlbGxvd3NcclxuKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLnNlcnZpY2VzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5zZXJ2aWNlcycpXHJcbiAgICAuc2VydmljZSgnRmVsbG93cycsIEZlbGxvd3MpO1xyXG5cclxuICBGZWxsb3dzLiRpbmplY3QgPSBbJyRodHRwJ107XHJcblxyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBGZWxsb3dzXHJcbiAgKiBAcmV0dXJucyB7U2VydmljZX1cclxuICAqL1xyXG4gIGZ1bmN0aW9uIEZlbGxvd3MoJGh0dHApIHtcclxuICAgIHZhciBGZWxsb3dzID0ge1xyXG4gICAgICBhbGw6IGFsbCxcclxuICAgICAgZ2V0OiBnZXQsXHJcbiAgICAgIGNyZWF0ZTogY3JlYXRlLFxyXG4gICAgICB1cGRhdGU6IHVwZGF0ZSxcclxuICAgICAgZGVzdHJveTogZGVzdHJveVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gRmVsbG93cztcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgYWxsXHJcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBmZWxsb3dzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFsbCgpIHtcclxuXHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDEnLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ0phdmEnLCAnUEhQJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDInLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ01hdGxhYicsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J05hbWUgMycsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdDJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDQnLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ0FuZHJvaWQnLCAnUEhQJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuXHJcbiAgICAgIC8vcmV0dXJuICRodHRwLmdldCgnL2ZlbGxvd3MvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBnZXRcclxuICAgICAqIEBkZXNjIGdldCBvbmUgZmVsbG93XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldChpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZmVsbG93cy8nICsgaSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGNyZWF0ZVxyXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2ZlbGxvd3MvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIHVwZGF0ZVxyXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbnRlbnQsIGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC51cGRhdGUoJy9mZWxsb3dzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBkZXN0cm95XHJcbiAgICAgKiBAZGVzYyBkZXN0cm95IGEgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBkZXN0cm95KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9mZWxsb3dzLycgKyBpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogSG9tZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5ob21lLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCBIb21lQ29udHJvbGxlcik7XHJcblxyXG4gIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgSG9tZUNvbnRyb2xsZXJcclxuICAqL1xyXG4gIGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGhvbWUgY29udHJvbGxlciEnKVxyXG4gICAgICAvL0hvbWUuYWxsKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBBZG1pblByb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlQ29udHJvbGxlcilcclxuICAgIC5jb250cm9sbGVyKCdBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcclxuXHJcbiAgICBBZG1pblByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnXTtcclxuICAgIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBBZG1pblByb2ZpbGVDb250cm9sbGVyXHJcbiAgICAgKi9cclxuICAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLWNyZWF0ZS11c2VyLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyJywgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyKTtcclxuXHJcbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSB7XHJcbiAgICAgICAgICAgIGJpbzpcIkkgYW0gYSBwZXJzb24uIEkgd2VudCB0byBzY2hvb2wuIEkgaGF2ZSBhIGRlZ3JlZS4gUGxlYXNlIHBheSBtZSBtb25leXNcIixcclxuICAgICAgICAgICAgaW1nOlwicHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93PSB7XHJcbiAgICAgICAgICAgIGJpbzpcIkkgYW0gYSBwZXJzb24uIEkgd2VudCB0byBzY2hvb2wuIEkgaGF2ZSBhIGRlZ3JlZS4gUGxlYXNlIHBheSBtZSBtb25leXNcIixcclxuICAgICAgICAgICAgaW1nOlwicHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJyk7XHJcbiAgICAgICAgICAgIC8vUHJvZmlsZS5hbGwoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZlbGxvdyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIFByb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XHJcblxyXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBQcm9maWxlQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbn0pKCk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==