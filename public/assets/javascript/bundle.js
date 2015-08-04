"use strict";

module.exports = function(sequelize, DataTypes) {

    var Company = sequelize.define("companies", {

        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        primary_contact: DataTypes.STRING,
        company_size: DataTypes.INTEGER,
        industry: DataTypes.STRING,
        description: DataTypes.TEXT,
        founding_year: DataTypes.INTEGER,
        founders: DataTypes.STRING,
        website_url: DataTypes.STRING,
        linked_in_url: DataTypes.STRING,
        image_url: DataTypes.STRING

    },{

        timestamps: true, // add updated_at and created_at
        paranoid: true // add deleted_at

    });

    return Company;
};


"use strict";

module.exports = function(sequelize, DataTypes) {

    var Fellow = sequelize.define("fellows", {

        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        university: DataTypes.STRING,
        major: DataTypes.STRING,
        bio: DataTypes.TEXT,
        interests: DataTypes.TEXT,
        resume_file_path: DataTypes.STRING,
        image_url: DataTypes.STRING

    },{

        timestamps: true, // add updated_at and created_at
        paranoid: true // add deleted_at

    });

    return Fellow;
};
"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
//var config    = require(__dirname + '/../config/config.json')[env];
//var sequelize = new Sequelize(config.database, config.username, config.password, config);
var sequelize = new Sequelize("postgres://localhost:5432/hfportal");
var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

 db.companies.belongsToMany(db.tags, {through: 'companies_tags'});
 db.tags.belongsToMany(db.companies, {through: 'companies_tags'});

 db.fellows.belongsToMany(db.tags, {through: 'fellows_tags'});
 db.tags.belongsToMany(db.fellows, {through: 'fellows_tags'});



"use strict";

module.exports = function(sequelize, DataTypes) {

    var Tag = sequelize.define("tags", {

        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING

    },{

        timestamps: true, // add updated_at and created_at
        paranoid: true // add deleted_at

    });

    return Tag;
};
var express = require('express');
var app = express();

var models = require('../models');
var Companies = models.companies;
var Tags = models.tags;

// GET /companies - get all companies
app.get('/', function getCompanies(req, res) {

    Companies.all({

        include: [{
            model: Tags
        }]

    }).then(function(companies) {

        res.send(companies);
    });

});

// POST /companies - create a new company record
app.post('/', function postCompany(req, res) {
    //res.send('POST request - create a new company record');

    // Take POST data and build a Company Object (sequelize)
    Companies.create({

        user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        primary_contact: req.body.primary_contact,
        company_size: req.body.company_size,
        industry: req.body.industry,
        description: req.body.description,
        founding_year: req.body.founding_year,
        founders: req.body.founders,
        website_url: req.body.website_url,
        linked_in_url: req.body.linked_in_url,
        image_url: req.body.image_url

    }).then(function(err, company) {

        res.send(company);
     });
});


// GET /companies/:id - get one company
app.get('/:id', function getCompany(req, res) {
    //res.send('GET request - get a company record');
    Companies.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        res.send(company);
    });

});

// PUT /companies/:id - updates an existing company record
app.put('/:id', function putCompany(req, res) {

    Companies.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(company) {

        company.user_id = req.body.user_id;
        company.name = req.body.name;
        company.email = req.body.email;
        company.primary_contact = req.body.primary_contact;
        company.company_size = req.body.company_size;
        company.industry = req.body.industry;
        company.description = req.body.description;
        company.founding_year = req.body.founding_year;
        company.founders = req.body.founders;
        company.website_url = req.body.website_url;
        company.linked_in_url = req.body.linked_in_url;
        company.image_url = req.body.image_url;

        company.save();

        res.send(company);
    });

});

// DELETE /companies/:id - deletes an existing company record
app.delete('/:id', function deleteCompany(req, res) {

    Companies.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(company) {

        company.destroy();

        res.send("Company Deleted");
    });

});

module.exports = app;


var express = require('express');
var app = express();

var models = require('../models');
var Fellows = models.fellows;
var Tags = models.tags;

// GET /fellows - get all fellows
app.get('/', function getFellows(req, res) {

    Fellows.all({

        include: [{
            model: Tags
        }]

    }).then(function(fellows) {

        res.send(fellows);
    });

});

// GET /fellows/:id - get one fellow
app.get('/:id', function getFellow(req, res){

    //res.send('GET request - get a company record');
    Fellows.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(fellow) {

        res.send(fellow);
    });
});

// POST /fellows - create a new fellow record
app.post('/', function postFellow(req, res) {

    Fellows.create({

        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        university: req.body.university,
        major: req.body.major,
        bio: req.body.bio,
        interests: req.body.interests,
        resume_file_path: req.body.resume_file_path,
        image_url: req.body.image_url

    }).then(function(err, fellow) {

        res.send(fellow);
    });

});


// PUT /fellows/:id - updates an existing fellow record
app.put('/:id', function putFellow(req, res) {

    Fellows.findOne({

        where: {
            id: req.params.id
        },
        include: [{
            model: Tags
            //where: { state: Sequelize.col('project.state') }
        }]

    }).then(function(fellow) {

        fellow.user_id = req.body.user_id;
        fellow.first_name = req.body.first_name;
        fellow.last_name = req.body.last_name;
        fellow.email = req.body.email;
        fellow.university = req.body.university;
        fellow.major = req.body.major;
        fellow.bio = req.body.bio;
        fellow.interests = req.body.interests;
        fellow.resume_file_path = req.body.resume_file_path;
        fellow.image_url = req.body.image_url;

        fellow.save();

        res.send(fellow);
    });

});

// DELETE /fellows/:id - deletes an existing fellow record
app.delete('/:id', function deleteFellow(req, res) {

    Fellows.findOne({

        where: {
            id: req.params.id
        }

    }).then(function(fellow) {

        fellow.destroy();

        res.send("Fellow Deleted");
    });

});


module.exports = app;

var express = require('express');
var app = express();

var models = require('../models');
var Tags = models.tags;

/** Tags **/

// GET /api/tags - get all companies
app.get('/api/v1/tags', function getTags(req, res) {

    /*Tags.create({
        name: "Javascript"
    });

    Tags.create({
        name: "HTML"
    });

    Tags.create({
        name: "CSS"
    });

    Tags.create({
        name: "C++"
    });

    Tags.create({
        name: "Java"
    });

    Tags.create({
        name: "PHP"
    });

    Tags.create({
        name: "Node"
    });

    Tags.create({
        name: "Angular"
    });

    Tags.create({
        name: "MySQL"
    });

    Tags.create({
        name: "PostgreSQL"
    });*/


    Tags.all().then(function(tags) {

        res.send(tags);
    });

});

module.exports = app;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy9Db21wYW55LmpzIiwibW9kZWxzL0ZlbGxvdy5qcyIsIm1vZGVscy9pbmRleC5qcyIsIm1vZGVscy9UYWcuanMiLCJyb3V0ZXMvY29tcGFuaWVzLmpzIiwicm91dGVzL2ZlbGxvd3MuanMiLCJyb3V0ZXMvdGFncy5qcyIsImFwcC9jb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImFwcC9mZWxsb3dzL2ZlbGxvd3MubW9kdWxlLmpzIiwiYXBwL2hvbWUvaG9tZS5tb2R1bGUuanMiLCJhcHAvcHJvZmlsZS9wcm9maWxlLm1vZHVsZS5qcyIsImFwcC9jb21wYW5pZXMvY29udHJvbGxlcnMvY29tcGFuaWVzLmNvbnRyb2xsZXIuanMiLCJhcHAvY29tcGFuaWVzL2RpcmVjdGl2ZXMvY29tcGFueUNhcmQuZGlyZWN0aXZlLmpzIiwiYXBwL2NvbXBhbmllcy9zZXJ2aWNlcy9jb21wYW5pZXMuc2VydmljZS5qcyIsImFwcC9mZWxsb3dzL2NvbnRyb2xsZXJzL2ZlbGxvd3MuY29udHJvbGxlci5qcyIsImFwcC9mZWxsb3dzL2RpcmVjdGl2ZXMvZmVsbG93Q2FyZC5kaXJlY3RpdmUuanMiLCJhcHAvZmVsbG93cy9zZXJ2aWNlcy9mZWxsb3dzLnNlcnZpY2UuanMiLCJhcHAvaG9tZS9jb250cm9sbGVycy9ob21lLmNvbnRyb2xsZXIuanMiLCJhcHAvcHJvZmlsZS9jb250cm9sbGVycy9hZG1pblByb2ZpbGUuY29udHJvbGxlci5qcyIsImFwcC9wcm9maWxlL2NvbnRyb2xsZXJzL2ZlbGxvd3NQcm9maWxlLmNvbnRyb2xsZXIuanMiLCJhcHAvcHJvZmlsZS9jb250cm9sbGVycy9wcm9maWxlLmNvbnRyb2xsZXIuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZXF1ZWxpemUsIERhdGFUeXBlcykge1xyXG5cclxuICAgIHZhciBDb21wYW55ID0gc2VxdWVsaXplLmRlZmluZShcImNvbXBhbmllc1wiLCB7XHJcblxyXG4gICAgICAgIGlkOiB7IHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLCBwcmltYXJ5S2V5OiB0cnVlLCBhdXRvSW5jcmVtZW50OiB0cnVlIH0sXHJcbiAgICAgICAgdXNlcl9pZDogeyB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUiB9LFxyXG4gICAgICAgIG5hbWU6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgZW1haWw6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgcHJpbWFyeV9jb250YWN0OiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGNvbXBhbnlfc2l6ZTogRGF0YVR5cGVzLklOVEVHRVIsXHJcbiAgICAgICAgaW5kdXN0cnk6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IERhdGFUeXBlcy5URVhULFxyXG4gICAgICAgIGZvdW5kaW5nX3llYXI6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4gICAgICAgIGZvdW5kZXJzOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIHdlYnNpdGVfdXJsOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGxpbmtlZF9pbl91cmw6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgaW1hZ2VfdXJsOiBEYXRhVHlwZXMuU1RSSU5HXHJcblxyXG4gICAgfSx7XHJcblxyXG4gICAgICAgIHRpbWVzdGFtcHM6IHRydWUsIC8vIGFkZCB1cGRhdGVkX2F0IGFuZCBjcmVhdGVkX2F0XHJcbiAgICAgICAgcGFyYW5vaWQ6IHRydWUgLy8gYWRkIGRlbGV0ZWRfYXRcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gQ29tcGFueTtcclxufTtcclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZXF1ZWxpemUsIERhdGFUeXBlcykge1xyXG5cclxuICAgIHZhciBGZWxsb3cgPSBzZXF1ZWxpemUuZGVmaW5lKFwiZmVsbG93c1wiLCB7XHJcblxyXG4gICAgICAgIGlkOiB7IHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLCBwcmltYXJ5S2V5OiB0cnVlLCBhdXRvSW5jcmVtZW50OiB0cnVlIH0sXHJcbiAgICAgICAgdXNlcl9pZDogeyB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUiB9LFxyXG4gICAgICAgIGZpcnN0X25hbWU6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgbGFzdF9uYW1lOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGVtYWlsOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIHVuaXZlcnNpdHk6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgbWFqb3I6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgYmlvOiBEYXRhVHlwZXMuVEVYVCxcclxuICAgICAgICBpbnRlcmVzdHM6IERhdGFUeXBlcy5URVhULFxyXG4gICAgICAgIHJlc3VtZV9maWxlX3BhdGg6IERhdGFUeXBlcy5TVFJJTkcsXHJcbiAgICAgICAgaW1hZ2VfdXJsOiBEYXRhVHlwZXMuU1RSSU5HXHJcblxyXG4gICAgfSx7XHJcblxyXG4gICAgICAgIHRpbWVzdGFtcHM6IHRydWUsIC8vIGFkZCB1cGRhdGVkX2F0IGFuZCBjcmVhdGVkX2F0XHJcbiAgICAgICAgcGFyYW5vaWQ6IHRydWUgLy8gYWRkIGRlbGV0ZWRfYXRcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gRmVsbG93O1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGZzICAgICAgICA9IHJlcXVpcmUoXCJmc1wiKTtcclxudmFyIHBhdGggICAgICA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG52YXIgU2VxdWVsaXplID0gcmVxdWlyZShcInNlcXVlbGl6ZVwiKTtcclxudmFyIGVudiAgICAgICA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8IFwiZGV2ZWxvcG1lbnRcIjtcclxuLy92YXIgY29uZmlnICAgID0gcmVxdWlyZShfX2Rpcm5hbWUgKyAnLy4uL2NvbmZpZy9jb25maWcuanNvbicpW2Vudl07XHJcbi8vdmFyIHNlcXVlbGl6ZSA9IG5ldyBTZXF1ZWxpemUoY29uZmlnLmRhdGFiYXNlLCBjb25maWcudXNlcm5hbWUsIGNvbmZpZy5wYXNzd29yZCwgY29uZmlnKTtcclxudmFyIHNlcXVlbGl6ZSA9IG5ldyBTZXF1ZWxpemUoXCJwb3N0Z3JlczovL2xvY2FsaG9zdDo1NDMyL2hmcG9ydGFsXCIpO1xyXG52YXIgZGIgICAgICAgID0ge307XHJcblxyXG5mc1xyXG4gICAgLnJlYWRkaXJTeW5jKF9fZGlybmFtZSlcclxuICAgIC5maWx0ZXIoZnVuY3Rpb24oZmlsZSkge1xyXG4gICAgICAgIHJldHVybiAoZmlsZS5pbmRleE9mKFwiLlwiKSAhPT0gMCkgJiYgKGZpbGUgIT09IFwiaW5kZXguanNcIik7XHJcbiAgICB9KVxyXG4gICAgLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xyXG4gICAgICAgIHZhciBtb2RlbCA9IHNlcXVlbGl6ZS5pbXBvcnQocGF0aC5qb2luKF9fZGlybmFtZSwgZmlsZSkpO1xyXG4gICAgICAgIGRiW21vZGVsLm5hbWVdID0gbW9kZWw7XHJcbiAgICB9KTtcclxuXHJcbk9iamVjdC5rZXlzKGRiKS5mb3JFYWNoKGZ1bmN0aW9uKG1vZGVsTmFtZSkge1xyXG4gICAgaWYgKFwiYXNzb2NpYXRlXCIgaW4gZGJbbW9kZWxOYW1lXSkge1xyXG4gICAgICAgIGRiW21vZGVsTmFtZV0uYXNzb2NpYXRlKGRiKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5kYi5zZXF1ZWxpemUgPSBzZXF1ZWxpemU7XHJcbmRiLlNlcXVlbGl6ZSA9IFNlcXVlbGl6ZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGI7XHJcblxyXG4gZGIuY29tcGFuaWVzLmJlbG9uZ3NUb01hbnkoZGIudGFncywge3Rocm91Z2g6ICdjb21wYW5pZXNfdGFncyd9KTtcclxuIGRiLnRhZ3MuYmVsb25nc1RvTWFueShkYi5jb21wYW5pZXMsIHt0aHJvdWdoOiAnY29tcGFuaWVzX3RhZ3MnfSk7XHJcblxyXG4gZGIuZmVsbG93cy5iZWxvbmdzVG9NYW55KGRiLnRhZ3MsIHt0aHJvdWdoOiAnZmVsbG93c190YWdzJ30pO1xyXG4gZGIudGFncy5iZWxvbmdzVG9NYW55KGRiLmZlbGxvd3MsIHt0aHJvdWdoOiAnZmVsbG93c190YWdzJ30pO1xyXG5cclxuXHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZXF1ZWxpemUsIERhdGFUeXBlcykge1xyXG5cclxuICAgIHZhciBUYWcgPSBzZXF1ZWxpemUuZGVmaW5lKFwidGFnc1wiLCB7XHJcblxyXG4gICAgICAgIGlkOiB7IHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLCBwcmltYXJ5S2V5OiB0cnVlLCBhdXRvSW5jcmVtZW50OiB0cnVlIH0sXHJcbiAgICAgICAgbmFtZTogRGF0YVR5cGVzLlNUUklOR1xyXG5cclxuICAgIH0se1xyXG5cclxuICAgICAgICB0aW1lc3RhbXBzOiB0cnVlLCAvLyBhZGQgdXBkYXRlZF9hdCBhbmQgY3JlYXRlZF9hdFxyXG4gICAgICAgIHBhcmFub2lkOiB0cnVlIC8vIGFkZCBkZWxldGVkX2F0XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIFRhZztcclxufTsiLCJ2YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxudmFyIGFwcCA9IGV4cHJlc3MoKTtcclxuXHJcbnZhciBtb2RlbHMgPSByZXF1aXJlKCcuLi9tb2RlbHMnKTtcclxudmFyIENvbXBhbmllcyA9IG1vZGVscy5jb21wYW5pZXM7XHJcbnZhciBUYWdzID0gbW9kZWxzLnRhZ3M7XHJcblxyXG4vLyBHRVQgL2NvbXBhbmllcyAtIGdldCBhbGwgY29tcGFuaWVzXHJcbmFwcC5nZXQoJy8nLCBmdW5jdGlvbiBnZXRDb21wYW5pZXMocmVxLCByZXMpIHtcclxuXHJcbiAgICBDb21wYW5pZXMuYWxsKHtcclxuXHJcbiAgICAgICAgaW5jbHVkZTogW3tcclxuICAgICAgICAgICAgbW9kZWw6IFRhZ3NcclxuICAgICAgICB9XVxyXG5cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oY29tcGFuaWVzKSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKGNvbXBhbmllcyk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuLy8gUE9TVCAvY29tcGFuaWVzIC0gY3JlYXRlIGEgbmV3IGNvbXBhbnkgcmVjb3JkXHJcbmFwcC5wb3N0KCcvJywgZnVuY3Rpb24gcG9zdENvbXBhbnkocmVxLCByZXMpIHtcclxuICAgIC8vcmVzLnNlbmQoJ1BPU1QgcmVxdWVzdCAtIGNyZWF0ZSBhIG5ldyBjb21wYW55IHJlY29yZCcpO1xyXG5cclxuICAgIC8vIFRha2UgUE9TVCBkYXRhIGFuZCBidWlsZCBhIENvbXBhbnkgT2JqZWN0IChzZXF1ZWxpemUpXHJcbiAgICBDb21wYW5pZXMuY3JlYXRlKHtcclxuXHJcbiAgICAgICAgdXNlcl9pZDogcmVxLmJvZHkudXNlcl9pZCxcclxuICAgICAgICBuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIGVtYWlsOiByZXEuYm9keS5lbWFpbCxcclxuICAgICAgICBwcmltYXJ5X2NvbnRhY3Q6IHJlcS5ib2R5LnByaW1hcnlfY29udGFjdCxcclxuICAgICAgICBjb21wYW55X3NpemU6IHJlcS5ib2R5LmNvbXBhbnlfc2l6ZSxcclxuICAgICAgICBpbmR1c3RyeTogcmVxLmJvZHkuaW5kdXN0cnksXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHJlcS5ib2R5LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgIGZvdW5kaW5nX3llYXI6IHJlcS5ib2R5LmZvdW5kaW5nX3llYXIsXHJcbiAgICAgICAgZm91bmRlcnM6IHJlcS5ib2R5LmZvdW5kZXJzLFxyXG4gICAgICAgIHdlYnNpdGVfdXJsOiByZXEuYm9keS53ZWJzaXRlX3VybCxcclxuICAgICAgICBsaW5rZWRfaW5fdXJsOiByZXEuYm9keS5saW5rZWRfaW5fdXJsLFxyXG4gICAgICAgIGltYWdlX3VybDogcmVxLmJvZHkuaW1hZ2VfdXJsXHJcblxyXG4gICAgfSkudGhlbihmdW5jdGlvbihlcnIsIGNvbXBhbnkpIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoY29tcGFueSk7XHJcbiAgICAgfSk7XHJcbn0pO1xyXG5cclxuXHJcbi8vIEdFVCAvY29tcGFuaWVzLzppZCAtIGdldCBvbmUgY29tcGFueVxyXG5hcHAuZ2V0KCcvOmlkJywgZnVuY3Rpb24gZ2V0Q29tcGFueShyZXEsIHJlcykge1xyXG4gICAgLy9yZXMuc2VuZCgnR0VUIHJlcXVlc3QgLSBnZXQgYSBjb21wYW55IHJlY29yZCcpO1xyXG4gICAgQ29tcGFuaWVzLmZpbmRPbmUoe1xyXG5cclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5jbHVkZTogW3tcclxuICAgICAgICAgICAgbW9kZWw6IFRhZ3NcclxuICAgICAgICAgICAgLy93aGVyZTogeyBzdGF0ZTogU2VxdWVsaXplLmNvbCgncHJvamVjdC5zdGF0ZScpIH1cclxuICAgICAgICB9XVxyXG5cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oY29tcGFueSkge1xyXG5cclxuICAgICAgICByZXMuc2VuZChjb21wYW55KTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG4vLyBQVVQgL2NvbXBhbmllcy86aWQgLSB1cGRhdGVzIGFuIGV4aXN0aW5nIGNvbXBhbnkgcmVjb3JkXHJcbmFwcC5wdXQoJy86aWQnLCBmdW5jdGlvbiBwdXRDb21wYW55KHJlcSwgcmVzKSB7XHJcblxyXG4gICAgQ29tcGFuaWVzLmZpbmRPbmUoe1xyXG5cclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5jbHVkZTogW3tcclxuICAgICAgICAgICAgbW9kZWw6IFRhZ3NcclxuICAgICAgICAgICAgLy93aGVyZTogeyBzdGF0ZTogU2VxdWVsaXplLmNvbCgncHJvamVjdC5zdGF0ZScpIH1cclxuICAgICAgICB9XVxyXG5cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oY29tcGFueSkge1xyXG5cclxuICAgICAgICBjb21wYW55LnVzZXJfaWQgPSByZXEuYm9keS51c2VyX2lkO1xyXG4gICAgICAgIGNvbXBhbnkubmFtZSA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgICAgY29tcGFueS5lbWFpbCA9IHJlcS5ib2R5LmVtYWlsO1xyXG4gICAgICAgIGNvbXBhbnkucHJpbWFyeV9jb250YWN0ID0gcmVxLmJvZHkucHJpbWFyeV9jb250YWN0O1xyXG4gICAgICAgIGNvbXBhbnkuY29tcGFueV9zaXplID0gcmVxLmJvZHkuY29tcGFueV9zaXplO1xyXG4gICAgICAgIGNvbXBhbnkuaW5kdXN0cnkgPSByZXEuYm9keS5pbmR1c3RyeTtcclxuICAgICAgICBjb21wYW55LmRlc2NyaXB0aW9uID0gcmVxLmJvZHkuZGVzY3JpcHRpb247XHJcbiAgICAgICAgY29tcGFueS5mb3VuZGluZ195ZWFyID0gcmVxLmJvZHkuZm91bmRpbmdfeWVhcjtcclxuICAgICAgICBjb21wYW55LmZvdW5kZXJzID0gcmVxLmJvZHkuZm91bmRlcnM7XHJcbiAgICAgICAgY29tcGFueS53ZWJzaXRlX3VybCA9IHJlcS5ib2R5LndlYnNpdGVfdXJsO1xyXG4gICAgICAgIGNvbXBhbnkubGlua2VkX2luX3VybCA9IHJlcS5ib2R5LmxpbmtlZF9pbl91cmw7XHJcbiAgICAgICAgY29tcGFueS5pbWFnZV91cmwgPSByZXEuYm9keS5pbWFnZV91cmw7XHJcblxyXG4gICAgICAgIGNvbXBhbnkuc2F2ZSgpO1xyXG5cclxuICAgICAgICByZXMuc2VuZChjb21wYW55KTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG4vLyBERUxFVEUgL2NvbXBhbmllcy86aWQgLSBkZWxldGVzIGFuIGV4aXN0aW5nIGNvbXBhbnkgcmVjb3JkXHJcbmFwcC5kZWxldGUoJy86aWQnLCBmdW5jdGlvbiBkZWxldGVDb21wYW55KHJlcSwgcmVzKSB7XHJcblxyXG4gICAgQ29tcGFuaWVzLmZpbmRPbmUoe1xyXG5cclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGNvbXBhbnkpIHtcclxuXHJcbiAgICAgICAgY29tcGFueS5kZXN0cm95KCk7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKFwiQ29tcGFueSBEZWxldGVkXCIpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXBwO1xyXG5cclxuIiwidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbnZhciBhcHAgPSBleHByZXNzKCk7XHJcblxyXG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi4vbW9kZWxzJyk7XHJcbnZhciBGZWxsb3dzID0gbW9kZWxzLmZlbGxvd3M7XHJcbnZhciBUYWdzID0gbW9kZWxzLnRhZ3M7XHJcblxyXG4vLyBHRVQgL2ZlbGxvd3MgLSBnZXQgYWxsIGZlbGxvd3NcclxuYXBwLmdldCgnLycsIGZ1bmN0aW9uIGdldEZlbGxvd3MocmVxLCByZXMpIHtcclxuXHJcbiAgICBGZWxsb3dzLmFsbCh7XHJcblxyXG4gICAgICAgIGluY2x1ZGU6IFt7XHJcbiAgICAgICAgICAgIG1vZGVsOiBUYWdzXHJcbiAgICAgICAgfV1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGZlbGxvd3MpIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoZmVsbG93cyk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuLy8gR0VUIC9mZWxsb3dzLzppZCAtIGdldCBvbmUgZmVsbG93XHJcbmFwcC5nZXQoJy86aWQnLCBmdW5jdGlvbiBnZXRGZWxsb3cocmVxLCByZXMpe1xyXG5cclxuICAgIC8vcmVzLnNlbmQoJ0dFVCByZXF1ZXN0IC0gZ2V0IGEgY29tcGFueSByZWNvcmQnKTtcclxuICAgIEZlbGxvd3MuZmluZE9uZSh7XHJcblxyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgIGlkOiByZXEucGFyYW1zLmlkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbmNsdWRlOiBbe1xyXG4gICAgICAgICAgICBtb2RlbDogVGFnc1xyXG4gICAgICAgICAgICAvL3doZXJlOiB7IHN0YXRlOiBTZXF1ZWxpemUuY29sKCdwcm9qZWN0LnN0YXRlJykgfVxyXG4gICAgICAgIH1dXHJcblxyXG4gICAgfSkudGhlbihmdW5jdGlvbihmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoZmVsbG93KTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbi8vIFBPU1QgL2ZlbGxvd3MgLSBjcmVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxyXG5hcHAucG9zdCgnLycsIGZ1bmN0aW9uIHBvc3RGZWxsb3cocmVxLCByZXMpIHtcclxuXHJcbiAgICBGZWxsb3dzLmNyZWF0ZSh7XHJcblxyXG4gICAgICAgIHVzZXJfaWQ6IHJlcS5ib2R5LnVzZXJfaWQsXHJcbiAgICAgICAgZmlyc3RfbmFtZTogcmVxLmJvZHkuZmlyc3RfbmFtZSxcclxuICAgICAgICBsYXN0X25hbWU6IHJlcS5ib2R5Lmxhc3RfbmFtZSxcclxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuZW1haWwsXHJcbiAgICAgICAgdW5pdmVyc2l0eTogcmVxLmJvZHkudW5pdmVyc2l0eSxcclxuICAgICAgICBtYWpvcjogcmVxLmJvZHkubWFqb3IsXHJcbiAgICAgICAgYmlvOiByZXEuYm9keS5iaW8sXHJcbiAgICAgICAgaW50ZXJlc3RzOiByZXEuYm9keS5pbnRlcmVzdHMsXHJcbiAgICAgICAgcmVzdW1lX2ZpbGVfcGF0aDogcmVxLmJvZHkucmVzdW1lX2ZpbGVfcGF0aCxcclxuICAgICAgICBpbWFnZV91cmw6IHJlcS5ib2R5LmltYWdlX3VybFxyXG5cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oZXJyLCBmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoZmVsbG93KTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG5cclxuLy8gUFVUIC9mZWxsb3dzLzppZCAtIHVwZGF0ZXMgYW4gZXhpc3RpbmcgZmVsbG93IHJlY29yZFxyXG5hcHAucHV0KCcvOmlkJywgZnVuY3Rpb24gcHV0RmVsbG93KHJlcSwgcmVzKSB7XHJcblxyXG4gICAgRmVsbG93cy5maW5kT25lKHtcclxuXHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IHJlcS5wYXJhbXMuaWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY2x1ZGU6IFt7XHJcbiAgICAgICAgICAgIG1vZGVsOiBUYWdzXHJcbiAgICAgICAgICAgIC8vd2hlcmU6IHsgc3RhdGU6IFNlcXVlbGl6ZS5jb2woJ3Byb2plY3Quc3RhdGUnKSB9XHJcbiAgICAgICAgfV1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGZlbGxvdykge1xyXG5cclxuICAgICAgICBmZWxsb3cudXNlcl9pZCA9IHJlcS5ib2R5LnVzZXJfaWQ7XHJcbiAgICAgICAgZmVsbG93LmZpcnN0X25hbWUgPSByZXEuYm9keS5maXJzdF9uYW1lO1xyXG4gICAgICAgIGZlbGxvdy5sYXN0X25hbWUgPSByZXEuYm9keS5sYXN0X25hbWU7XHJcbiAgICAgICAgZmVsbG93LmVtYWlsID0gcmVxLmJvZHkuZW1haWw7XHJcbiAgICAgICAgZmVsbG93LnVuaXZlcnNpdHkgPSByZXEuYm9keS51bml2ZXJzaXR5O1xyXG4gICAgICAgIGZlbGxvdy5tYWpvciA9IHJlcS5ib2R5Lm1ham9yO1xyXG4gICAgICAgIGZlbGxvdy5iaW8gPSByZXEuYm9keS5iaW87XHJcbiAgICAgICAgZmVsbG93LmludGVyZXN0cyA9IHJlcS5ib2R5LmludGVyZXN0cztcclxuICAgICAgICBmZWxsb3cucmVzdW1lX2ZpbGVfcGF0aCA9IHJlcS5ib2R5LnJlc3VtZV9maWxlX3BhdGg7XHJcbiAgICAgICAgZmVsbG93LmltYWdlX3VybCA9IHJlcS5ib2R5LmltYWdlX3VybDtcclxuXHJcbiAgICAgICAgZmVsbG93LnNhdmUoKTtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoZmVsbG93KTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG4vLyBERUxFVEUgL2ZlbGxvd3MvOmlkIC0gZGVsZXRlcyBhbiBleGlzdGluZyBmZWxsb3cgcmVjb3JkXHJcbmFwcC5kZWxldGUoJy86aWQnLCBmdW5jdGlvbiBkZWxldGVGZWxsb3cocmVxLCByZXMpIHtcclxuXHJcbiAgICBGZWxsb3dzLmZpbmRPbmUoe1xyXG5cclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGZlbGxvdykge1xyXG5cclxuICAgICAgICBmZWxsb3cuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICByZXMuc2VuZChcIkZlbGxvdyBEZWxldGVkXCIpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcclxuIiwidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbnZhciBhcHAgPSBleHByZXNzKCk7XHJcblxyXG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi4vbW9kZWxzJyk7XHJcbnZhciBUYWdzID0gbW9kZWxzLnRhZ3M7XHJcblxyXG4vKiogVGFncyAqKi9cclxuXHJcbi8vIEdFVCAvYXBpL3RhZ3MgLSBnZXQgYWxsIGNvbXBhbmllc1xyXG5hcHAuZ2V0KCcvYXBpL3YxL3RhZ3MnLCBmdW5jdGlvbiBnZXRUYWdzKHJlcSwgcmVzKSB7XHJcblxyXG4gICAgLypUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJKYXZhc2NyaXB0XCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIkhUTUxcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgVGFncy5jcmVhdGUoe1xyXG4gICAgICAgIG5hbWU6IFwiQ1NTXCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIkMrK1wiXHJcbiAgICB9KTtcclxuXHJcbiAgICBUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJKYXZhXCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIlBIUFwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJOb2RlXCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIkFuZ3VsYXJcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgVGFncy5jcmVhdGUoe1xyXG4gICAgICAgIG5hbWU6IFwiTXlTUUxcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgVGFncy5jcmVhdGUoe1xyXG4gICAgICAgIG5hbWU6IFwiUG9zdGdyZVNRTFwiXHJcbiAgICB9KTsqL1xyXG5cclxuXHJcbiAgICBUYWdzLmFsbCgpLnRoZW4oZnVuY3Rpb24odGFncykge1xyXG5cclxuICAgICAgICByZXMuc2VuZCh0YWdzKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcclxuIiwiLyoqXHJcbiAqIGNvbXBhbmllcyBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcycsIFtcclxuICAgICAgICAnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycsXHJcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnLFxyXG4gICAgICAgICdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnXHJcbiAgICAgICAgXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBzZXJ2aWNlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJywgW10pO1xyXG5cclxuICAvLyBkZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuZGlyZWN0aXZlcycsIFtdKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBmZWxsb3dzIG1vZHVsZVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cycsIFtcclxuICAgICAgICAnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuZmVsbG93cy5zZXJ2aWNlcycsXHJcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmRpcmVjdGl2ZXMnXHJcbiAgICAgICAgXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJywgW10pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIGhvbWUgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lJywgW1xyXG4gICAgICAgICdhcHAuaG9tZS5jb250cm9sbGVycycsXHJcbiAgICAgICAgJ2FwcC5ob21lLnNlcnZpY2VzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuZGlyZWN0aXZlcycsIFtdKTtcclxuICAgIC8vaG93IGFib3V0IHRoaXNcclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIHByb2ZpbGUgbW9kdWxlXHJcbiAqL1xyXG5cclxuIChmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgLm1vZHVsZSgnYXBwLnByb2ZpbGUnLCBbXHJcbiAgICAnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnXHJcbiAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBDb21wYW5pZXNDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmNvbnRyb2xsZXJzJylcclxuICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNDb250cm9sbGVyJywgQ29tcGFuaWVzQ29udHJvbGxlcilcclxuICAgIC5jb250cm9sbGVyKCdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKTtcclxuXHJcbiAgQ29tcGFuaWVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJywgJ0NvbXBhbmllcyddO1xyXG4gIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZScsICdjb21wYW55J107XHJcblxyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBDb21wYW5pZXNDb250cm9sbGVyXHJcbiAgKi9cclxuICBmdW5jdGlvbiBDb21wYW5pZXNDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsLCBDb21wYW5pZXMpIHtcclxuXHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgIC8vIFVzZSB2bSBmb3IgdGhpcz9cclxuICAgICRzY29wZS5jb21wYW5pZXMgPSBDb21wYW5pZXMuYWxsKCk7XHJcblxyXG4gICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uIChjb21wYW55KSB7XHJcblxyXG4gICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2RldGFpbF92aWV3Lmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgc2l6ZTogJ2xnJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICBjb21wYW55OiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcGFueTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtKSB7XHJcbiAgICAgIC8vXHQkc2NvcGUuc2VsZWN0ZWQgPSBzZWxlY3RlZEl0ZW07XHJcbiAgICAgIC8vfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAvL1x0JGxvZy5pbmZvKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcclxuICAgICAgLy99KTtcclxuICAgIH07XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmF0ZWQgY29tcGFuaWVzIGNvbnRyb2xsZXIhJylcclxuXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgY29tcGFueSl7XHJcblxyXG4gICAgJHNjb3BlLmNvbXBhbnkgPSBjb21wYW55O1xyXG5cclxuICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLmNvbXBhbnkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2NvbXBhbnlDYXJkJywgY29tcGFueUNhcmQpO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYW55Q2FyZCgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0FFJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3NvdXJjZS9hcHAvY29tcGFuaWVzL3BhcnRpYWxzL2NvbXBhbnlfY2FyZC5odG1sJy8qLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIGVsZW0uYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvKipcclxuKiBDb21wYW5pZXNcclxuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxyXG4gICAgLnNlcnZpY2UoJ0NvbXBhbmllcycsIENvbXBhbmllcyk7XHJcblxyXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzXHJcbiAgKiBAcmV0dXJucyB7U2VydmljZX1cclxuICAqL1xyXG4gIGZ1bmN0aW9uIENvbXBhbmllcygkaHR0cCkge1xyXG4gICAgdmFyIENvbXBhbmllcyA9IHtcclxuICAgICAgYWxsOiBhbGwsXHJcbiAgICAgIGdldDogZ2V0LFxyXG4gICAgICBjcmVhdGU6IGNyZWF0ZSxcclxuICAgICAgdXBkYXRlOiB1cGRhdGUsXHJcbiAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIENvbXBhbmllcztcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgYWxsXHJcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYWxsKCkge1xyXG5cclxuICAgICAgcmV0dXJuIFtcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICBuYW1lOlx0J0NvbXBhbnkgMScsXHJcbiAgICAgICAgICB1c2VyX2lkOiAnMScsXHJcbiAgICAgICAgICBlbWFpbDogXCJcIixcclxuICAgICAgICAgIHByaW1hcnlfY29udGFjdDogXCJcIixcclxuICAgICAgICAgIGNvbXBhbnlfc2l6ZTogXCJcIixcclxuICAgICAgICAgIGluZHVzdHJ5OiBcIlwiLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICAgICAgICBmb3VuZGluZ195ZWFyOiAyMDEzLFxyXG4gICAgICAgICAgZm91bmRlcnM6IFwiXCIsXHJcbiAgICAgICAgICB2ZXJpZmllZDogMSxcclxuICAgICAgICAgIGltYWdlX3VybDogXCJcIixcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAyJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAzJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSA0JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSA1JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9XHJcblxyXG4gICAgICBdO1xyXG5cclxuICAgICAgLy9yZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3YxL2NvbXBhbmllcy8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGdldFxyXG4gICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdjEvY29tcGFuaWVzLycgKyBwYXJzZUludChpZCkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGNyZWF0ZVxyXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIHVwZGF0ZVxyXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbnRlbnQsIGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC51cGRhdGUoJy9hcGkvdjFjb21wYW5pZXMvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS92MWNvbXBhbmllcy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogRmVsbG93c0NvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXHJcblx0LmNvbnRyb2xsZXIoJ0ZlbGxvd3NDb250cm9sbGVyJywgRmVsbG93c0NvbnRyb2xsZXIpXHJcblx0LmNvbnRyb2xsZXIoJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gICAgRmVsbG93c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdGZWxsb3dzJ107XHJcbiAgICBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBGZWxsb3dzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgRmVsbG93cykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKVxyXG4gICAgICAgICAgICAvL0ZlbGxvd3MuYWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IEZlbGxvd3MuYWxsKCk7XHJcblxyXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbihmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93KSB7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5mZWxsb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJylcclxuICAgIC5kaXJlY3RpdmUoJ2ZlbGxvd0NhcmQnLCBmZWxsb3dDYXJkKTtcclxuXHJcblxyXG4gZnVuY3Rpb24gZmVsbG93Q2FyZCgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWNlOiAnQUUnLFxyXG4gICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICBzY29wZTogdHJ1ZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICcvc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19jYXJkLmh0bWwnLyosXHJcbiAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbSwgYXR0cnMpIHtcclxuICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICB9ICovXHJcbiAgICB9O1xyXG4gIH1cclxufSkoKTsiLCIvKipcclxuKiBGZWxsb3dzXHJcbiogQG5hbWVzcGFjZSBhcHAuZmVsbG93cy5zZXJ2aWNlc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3Muc2VydmljZXMnKVxyXG4gICAgLnNlcnZpY2UoJ0ZlbGxvd3MnLCBGZWxsb3dzKTtcclxuXHJcbiAgRmVsbG93cy4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgRmVsbG93c1xyXG4gICogQHJldHVybnMge1NlcnZpY2V9XHJcbiAgKi9cclxuICBmdW5jdGlvbiBGZWxsb3dzKCRodHRwKSB7XHJcbiAgICB2YXIgRmVsbG93cyA9IHtcclxuICAgICAgYWxsOiBhbGwsXHJcbiAgICAgIGdldDogZ2V0LFxyXG4gICAgICBjcmVhdGU6IGNyZWF0ZSxcclxuICAgICAgdXBkYXRlOiB1cGRhdGUsXHJcbiAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIEZlbGxvd3M7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGFsbFxyXG4gICAgICogQGRlc2MgZ2V0IGFsbCB0aGUgZmVsbG93c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhbGwoKSB7XHJcblxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSAxJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSAyJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdNYXRsYWInLCAnUEhQJ10sXHJcbiAgICAgICAgICBkZXNjOlx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuJyArXHJcbiAgICAgICAgICAnIEV0aWFtIHV0IGludGVyZHVtIG51bmMuIEluIGhhYyBoYWJpdGFzc2UgcGxhdGVhIGRpY3R1bXN0LicgK1xyXG4gICAgICAgICAgJyBEdWlzIGVnZXQgZG9sb3IgdXQganVzdG8gY3Vyc3VzIGNvbnZhbGxpcyBzZWQgZWdldCBuaWJoLiAnICtcclxuICAgICAgICAgICdGdXNjZSBzZWQgZWxpdCBldSBxdWFtIHByZXRpdW0gdmVzdGlidWx1bSBpbiBldSBudWxsYS4gU2VkJyArXHJcbiAgICAgICAgICAnIGRpY3R1bSBzZW0gdXQgdGVsbHVzIGJsYW5kaXQgbWF0dGlzLiBBbGlxdWFtIG5lYyBlcmF0IG1pLicgK1xyXG4gICAgICAgICAgJyBOdWxsYSBub24gZHVpIG5lYyBhdWd1ZSBmYWNpbGlzaXMgY29uc2VxdWF0LiBOdWxsYSBtb2xsaXMnICtcclxuICAgICAgICAgICdudW5jIHNlZCBlcm9zIGVsZWlmZW5kLCBpbiB2b2x1dHBhdCBhbnRlIGhlbmRyZXJpdC4gJyArXHJcbiAgICAgICAgICAnUHJhZXNlbnQgZXUgdnVscHV0YXRlIGV4LCBhYyByaG9uY3VzIG5pc2kuJyxcclxuICAgICAgICAgIHNyYzpcdCcvcHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTpcdCdOYW1lIDMnLFxyXG4gICAgICAgICAgdGFnczpcdFsnQysrJywgJ0phdmEnLCAnQyddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSA0JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdBbmRyb2lkJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcblxyXG4gICAgICAvL3JldHVybiAkaHR0cC5nZXQoJy9mZWxsb3dzLycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZ2V0XHJcbiAgICAgKiBAZGVzYyBnZXQgb25lIGZlbGxvd1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXQoaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2ZlbGxvd3MvJyArIGkpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBjcmVhdGVcclxuICAgICAqIEBkZXNjIGNyZWVhdGUgYSBuZXcgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBjcmVhdGUoY29udGVudCwgaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9mZWxsb3dzLycgKyBpZCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1cGRhdGVcclxuICAgICAqIEBkZXNjIHVwZGF0ZXMgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAudXBkYXRlKCcvZmVsbG93cy8nICsgaWQsIHtcclxuICAgICAgICBjb250ZW50OiBjb250ZW50XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgZGVzdHJveVxyXG4gICAgICogQGRlc2MgZGVzdHJveSBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZGVzdHJveShpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKCcvZmVsbG93cy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIEhvbWVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAuaG9tZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmhvbWUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICBIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIEhvbWVDb250cm9sbGVyXHJcbiAgKi9cclxuICBmdW5jdGlvbiBIb21lQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBob21lIGNvbnRyb2xsZXIhJylcclxuICAgICAgLy9Ib21lLmFsbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQWRtaW5Qcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignQWRtaW5Qcm9maWxlQ29udHJvbGxlcicsIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIpXHJcbiAgICAuY29udHJvbGxlcignQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gICAgQWRtaW5Qcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsJ107XHJcbiAgICBBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lc3BhY2UgQWRtaW5Qcm9maWxlQ29udHJvbGxlclxyXG4gICAgICovXHJcbiAgICAgZnVuY3Rpb24gQWRtaW5Qcm9maWxlQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCkge1xyXG5cclxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcclxuXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi1jcmVhdGUtdXNlci5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblByb2ZpbGVNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBzaXplOiAnbGcnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcilcclxuXHJcbiAgICBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIEBuYW1lc3BhY2UgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICRzY29wZS5mZWxsb3cgPSB7XHJcbiAgICAgICAgICAgIGJpbzpcIkkgYW0gYSBwZXJzb24uIEkgd2VudCB0byBzY2hvb2wuIEkgaGF2ZSBhIGRlZ3JlZS4gUGxlYXNlIHBheSBtZSBtb25leXNcIixcclxuICAgICAgICAgICAgaW1nOlwicHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5mZWxsb3c9IHtcclxuICAgICAgICAgICAgYmlvOlwiSSBhbSBhIHBlcnNvbi4gSSB3ZW50IHRvIHNjaG9vbC4gSSBoYXZlIGEgZGVncmVlLiBQbGVhc2UgcGF5IG1lIG1vbmV5c1wiLFxyXG4gICAgICAgICAgICBpbWc6XCJwdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmdcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIHByb2ZpbGUgY29udHJvbGxlciEnKVxyXG4gICAgICAgICAgICAvL1Byb2ZpbGUuYWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUudXBkYXRlPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZlbGxvdyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIFByb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XHJcblxyXG4gIFByb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBQcm9maWxlQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbn0pKCk7XHJcbiIsIlxyXG4vKipcclxuICogYXBwLnJvdXRlc1xyXG4gKiBAZGVzYyAgICBjb250YWlucyB0aGUgcm91dGVzIGZvciB0aGUgYXBwXHJcbiAqL1xyXG5cclxuIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ3VpLmJvb3RzdHJhcCcsICdhcHAuY29tcGFuaWVzJywgJ2FwcC5mZWxsb3dzJywgJ2FwcC5wcm9maWxlJ10pO1xyXG4gdmFyIHN0cmluZyA9IFwiZHVtbXlcIlxyXG5cclxuLyoqXHJcbiAqICAgKiBAbmFtZSBjb25maWdcclxuICogICAgICogQGRlc2MgRGVmaW5lIHZhbGlkIGFwcGxpY2F0aW9uIHJvdXRlc1xyXG4gKiAgICAgICAqL1xyXG4gYXBwLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlcil7XHJcblxyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXIgIDogJ1JvdXRpbmdDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybCA6ICdzb3VyY2UvYXBwL2hvbWUvaG9tZS5odG1sJ1xyXG4gICAgfSlcclxuICAgIC53aGVuKCcvZmVsbG93cycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnUm91dGluZ0NvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL2ZlbGxvd3MuaHRtbCdcclxuICAgIH0pXHJcbiAgICAud2hlbignL2NvbXBhbmllcycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL2NvbXBhbmllcy9jb21wYW5pZXMuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUvYWRtaW4nLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2FkbWluLXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2ZlbGxvdycsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9mZWxsb3ctcHJvZmlsZS5odG1sJ1xyXG4gICAgfSlcclxuXHJcbiAgICAud2hlbignL3Byb2ZpbGUvY29tcGFueScsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFueVByb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9jb21wYW55LXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcbiAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xyXG5cclxufSk7XHJcblxyXG5hcHAuY29udHJvbGxlcignUm91dGluZ0NvbnRyb2xsZXInLCBSb3V0aW5nQ29udHJvbGxlcilcclxuLmNvbnRyb2xsZXIoJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyKVxyXG5cclxuUm91dGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCddO1xyXG5Mb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWxJbnN0YW5jZSddO1xyXG5cclxuZnVuY3Rpb24gUm91dGluZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwpIHtcclxuXHJcbiAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvbG9naW4tcGFnZS5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcicsXHJcbiAgICAgICAgc2l6ZTogJ3NtJyxcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxufVxyXG5cclxuZnVuY3Rpb24gTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSkge1xyXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICB9O1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==