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
          name:	'Company 1',
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

      //return $http.get('/companies/');
    }

    /**
     * @name get
     * @desc get just one company
     */
    function get(id) {
      return $http.get('/companies/' + i);
    }

    /**
     * @name create
     * @desc creeate a new fellow record
     */
    function create(content, id) {
      return $http.post('/companies/' + id, {
        content: content
      });
    }

    /**
     * @name update
     * @desc updates a fellow record
     */
    function update(content, id) {
      return $http.update('/companies/' + id, {
        content: content
      });
    }

    /**
     * @name destroy
     * @desc destroy a fellow record
     */
    function destroy(id) {
      return $http.delete('/companies/' + id);
    }
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

                templateUrl: 'source/app/profile/partials/admin_detail_view.html',
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
    .controller('FellowsProfileController', FellowsProfileController)

    FellowsProfileController.$inject = ['$scope'];

    /**
    * @namespace FellowsProfileController
    */
    function FellowsProfileController($scope) {
        var vm = this;

        $scope.fellow = {
            bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
            img:"public/assets/images/placeholder-hi.png"
        }

        $scope.fellow= {
            bio:"I am a person. I went to school. I have a degree. Please pay me moneys",
            img:"public/assets/images/placeholder-hi.png"
        };

        activate();

        function activate() {
            console.log('activated profile controller!')
            //Profile.all();
        }

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

    .when('/profile/fellows', {
        controller: 'FellowsProfileController',
        templateUrl: 'source/app/profile/partials/fellow-profile.html'
    })

    .when('/profile/companies', {
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
        templateUrl: 'source/app/profile/partials/login_detail_view.html',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9jb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImFwcC9mZWxsb3dzL2ZlbGxvd3MubW9kdWxlLmpzIiwiYXBwL2hvbWUvaG9tZS5tb2R1bGUuanMiLCJhcHAvcHJvZmlsZS9mb3JtX2Z1bmN0aW9ucy5qcyIsImFwcC9wcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwiYXBwL2NvbXBhbmllcy9jb250cm9sbGVycy9jb21wYW5pZXMuY29udHJvbGxlci5qcyIsImFwcC9jb21wYW5pZXMvZGlyZWN0aXZlcy9jb21wYW55Q2FyZC5kaXJlY3RpdmUuanMiLCJhcHAvY29tcGFuaWVzL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwiYXBwL2ZlbGxvd3MvY29udHJvbGxlcnMvZmVsbG93cy5jb250cm9sbGVyLmpzIiwiYXBwL2ZlbGxvd3MvZGlyZWN0aXZlcy9mZWxsb3dDYXJkLmRpcmVjdGl2ZS5qcyIsImFwcC9mZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsImFwcC9ob21lL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsImFwcC9wcm9maWxlL2NvbnRyb2xsZXJzL2FkbWluUHJvZmlsZS5jb250cm9sbGVyLmpzIiwiYXBwL3Byb2ZpbGUvY29udHJvbGxlcnMvZmVsbG93c1Byb2ZpbGUuY29udHJvbGxlci5qcyIsImFwcC9wcm9maWxlL2NvbnRyb2xsZXJzL3Byb2ZpbGUuY29udHJvbGxlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBjb21wYW5pZXMgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXHJcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJyxcclxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcclxuXHJcbiAgLy8gZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogZmVsbG93cyBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MnLCBbXHJcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAnYXBwLmZlbGxvd3Muc2VydmljZXMnLFxyXG4gICAgICAgICdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBob21lIG1vZHVsZVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZScsIFtcclxuICAgICAgICAnYXBwLmhvbWUuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuaG9tZS5zZXJ2aWNlcydcclxuICAgICAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmRpcmVjdGl2ZXMnLCBbXSk7XHJcbiAgICAvL2hvdyBhYm91dCB0aGlzXHJcbn0pKCk7XHJcbiIsIiIsIi8qKlxyXG4gKiBwcm9maWxlIG1vZHVsZVxyXG4gKi9cclxuXHJcbiAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW1xyXG4gICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJ1xyXG4gICAgXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQ29tcGFuaWVzQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignQ29tcGFuaWVzQ29udHJvbGxlcicsIENvbXBhbmllc0NvbnRyb2xsZXIpXHJcbiAgICAuY29udHJvbGxlcignQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcclxuICBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnY29tcGFueSddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gQ29tcGFuaWVzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgQ29tcGFuaWVzKSB7XHJcblxyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAvLyBVc2Ugdm0gZm9yIHRoaXM/XHJcbiAgICAkc2NvcGUuY29tcGFuaWVzID0gQ29tcGFuaWVzLmFsbCgpO1xyXG5cclxuICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoY29tcGFueSkge1xyXG5cclxuICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcblxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY29tcGFueTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL21vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkge1xyXG4gICAgICAvL1x0JHNjb3BlLnNlbGVjdGVkID0gc2VsZWN0ZWRJdGVtO1xyXG4gICAgICAvL30sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy9cdCRsb2cuaW5mbygnTW9kYWwgZGlzbWlzc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XHJcbiAgICAgIC8vfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGNvbXBhbmllcyBjb250cm9sbGVyIScpXHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnkpe1xyXG5cclxuICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcclxuXHJcbiAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdjb21wYW55Q2FyZCcsIGNvbXBhbnlDYXJkKTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGFueUNhcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2NhcmQuaHRtbCcvKixcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqXHJcbiogQ29tcGFuaWVzXHJcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLnNlcnZpY2VzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdDb21wYW5pZXMnLCBDb21wYW5pZXMpO1xyXG5cclxuICBDb21wYW5pZXMuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIENvbXBhbmllc1xyXG4gICogQHJldHVybnMge1NlcnZpY2V9XHJcbiAgKi9cclxuICBmdW5jdGlvbiBDb21wYW5pZXMoJGh0dHApIHtcclxuICAgIHZhciBDb21wYW5pZXMgPSB7XHJcbiAgICAgIGFsbDogYWxsLFxyXG4gICAgICBnZXQ6IGdldCxcclxuICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICBkZXN0cm95OiBkZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBDb21wYW5pZXM7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgY29tcGFuaWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFsbCgpIHtcclxuXHJcbiAgICAgIHJldHVybiBbXHJcblxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAxJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAyJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAzJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSA0JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSA1JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9XHJcblxyXG4gICAgICBdO1xyXG5cclxuICAgICAgLy9yZXR1cm4gJGh0dHAuZ2V0KCcvY29tcGFuaWVzLycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZ2V0XHJcbiAgICAgKiBAZGVzYyBnZXQganVzdCBvbmUgY29tcGFueVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2NvbXBhbmllcy8nICsgaSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBjcmVhdGVcclxuICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGUoY29udGVudCwgaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9jb21wYW5pZXMvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIHVwZGF0ZVxyXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbnRlbnQsIGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC51cGRhdGUoJy9jb21wYW5pZXMvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2NvbXBhbmllcy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogRmVsbG93c0NvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXHJcblx0LmNvbnRyb2xsZXIoJ0ZlbGxvd3NDb250cm9sbGVyJywgRmVsbG93c0NvbnRyb2xsZXIpXHJcblx0LmNvbnRyb2xsZXIoJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gICAgRmVsbG93c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdGZWxsb3dzJ107XHJcbiAgICBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBGZWxsb3dzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgRmVsbG93cykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKVxyXG4gICAgICAgICAgICAvL0ZlbGxvd3MuYWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IEZlbGxvd3MuYWxsKCk7XHJcblxyXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbihmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93KSB7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5mZWxsb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJylcclxuICAgIC5kaXJlY3RpdmUoJ2ZlbGxvd0NhcmQnLCBmZWxsb3dDYXJkKTtcclxuXHJcblxyXG4gZnVuY3Rpb24gZmVsbG93Q2FyZCgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWNlOiAnQUUnLFxyXG4gICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19jYXJkLmh0bWwnLyosXHJcbiAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcclxuICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICB9ICovXHJcbiAgICB9O1xyXG4gIH1cclxufSkoKTsiLCIvKipcclxuKiBGZWxsb3dzXHJcbiogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5zZXJ2aWNlc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnKVxyXG4gICAgLnNlcnZpY2UoJ0ZlbGxvd3MnLCBGZWxsb3dzKTtcclxuXHJcbiAgRmVsbG93cy4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgRmVsbG93c1xyXG4gICogQHJldHVybnMge1NlcnZpY2V9XHJcbiAgKi9cclxuICBmdW5jdGlvbiBGZWxsb3dzKCRodHRwKSB7XHJcbiAgICB2YXIgRmVsbG93cyA9IHtcclxuICAgICAgYWxsOiBhbGwsXHJcbiAgICAgIGdldDogZ2V0LFxyXG4gICAgICBjcmVhdGU6IGNyZWF0ZSxcclxuICAgICAgdXBkYXRlOiB1cGRhdGUsXHJcbiAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEZlbGxvd3M7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgZmVsbG93c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhbGwoKSB7XHJcblxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSAxJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSAyJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdNYXRsYWInLCAnUEhQJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDMnLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ0phdmEnLCAnQyddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSA0JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdBbmRyb2lkJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcblxyXG4gICAgICAvL3JldHVybiAkaHR0cC5nZXQoJy9mZWxsb3dzLycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZ2V0XHJcbiAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2ZlbGxvd3MvJyArIGkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBjcmVhdGVcclxuICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGUoY29udGVudCwgaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9mZWxsb3dzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1cGRhdGVcclxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAudXBkYXRlKCcvZmVsbG93cy8nICsgaWQsIHtcclxuICAgICAgICBjb250ZW50OiBjb250ZW50XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZGVzdHJveVxyXG4gICAgICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvZmVsbG93cy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIEhvbWVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIEhvbWVDb250cm9sbGVyXHJcbiAgKi9cclxuICBmdW5jdGlvbiBIb21lQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBob21lIGNvbnRyb2xsZXIhJylcclxuICAgICAgLy9Ib21lLmFsbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQWRtaW5Qcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIpXHJcbiAgICAuY29udHJvbGxlcignQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gICAgQWRtaW5Qcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJ107XHJcbiAgICBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2UgQWRtaW5Qcm9maWxlQ29udHJvbGxlclxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gQWRtaW5Qcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCkge1xyXG5cclxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbl9kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcilcclxuXHJcbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSB7XHJcbiAgICAgICAgICAgIGJpbzpcIkkgYW0gYSBwZXJzb24uIEkgd2VudCB0byBzY2hvb2wuIEkgaGF2ZSBhIGRlZ3JlZS4gUGxlYXNlIHBheSBtZSBtb25leXNcIixcclxuICAgICAgICAgICAgaW1nOlwicHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5mZWxsb3c9IHtcclxuICAgICAgICAgICAgYmlvOlwiSSBhbSBhIHBlcnNvbi4gSSB3ZW50IHRvIHNjaG9vbC4gSSBoYXZlIGEgZGVncmVlLiBQbGVhc2UgcGF5IG1lIG1vbmV5c1wiLFxyXG4gICAgICAgICAgICBpbWc6XCJwdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmdcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKVxyXG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZlbGxvdyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIFByb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XHJcblxyXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBQcm9maWxlQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIlxyXG4vKipcclxuICogYXBwLnJvdXRlc1xyXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXHJcbiAqL1xyXG5cclxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ3VpLmJvb3RzdHJhcCcsICdhcHAuY29tcGFuaWVzJywgJ2FwcC5mZWxsb3dzJywgJ2FwcC5wcm9maWxlJ10pO1xyXG4gdmFyIHN0cmluZyA9IFwiZHVtbXlcIlxyXG5cclxuLyoqXHJcbiAqICAgKiBAbmFtZSBjb25maWdcclxuICogICAgICogQGRlc2MgRGVmaW5lIHZhbGlkIGFwcGxpY2F0aW9uIHJvdXRlc1xyXG4gKiAgICAgICAqL1xyXG4gYXBwLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XHJcblxyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXIgIDogJ1JvdXRpbmdDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybCA6ICdzb3VyY2UvYXBwL2hvbWUvaG9tZS5odG1sJ1xyXG4gICAgfSlcclxuICAgIC53aGVuKCcvZmVsbG93cycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnUm91dGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvd3MuaHRtbCdcclxuICAgIH0pXHJcbiAgICAud2hlbignL2NvbXBhbmllcycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW5pZXMuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUvYWRtaW4nLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvd3MnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvZmVsbG93LXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2NvbXBhbmllcycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9jb21wYW55LXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xyXG5cclxufSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignUm91dGluZ0NvbnRyb2xsZXInLCBSb3V0aW5nQ29udHJvbGxlcilcclxuLmNvbnRyb2xsZXIoJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxyXG5cclxuUm91dGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCddO1xyXG5Mb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZSddO1xyXG5cclxuZnVuY3Rpb24gUm91dGluZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwpIHtcclxuXHJcbiAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvbG9naW5fZGV0YWlsX3ZpZXcuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHNpemU6ICdzbScsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcclxuICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=