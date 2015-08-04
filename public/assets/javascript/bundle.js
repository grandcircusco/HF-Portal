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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy9Db21wYW55LmpzIiwibW9kZWxzL0ZlbGxvdy5qcyIsIm1vZGVscy9pbmRleC5qcyIsIm1vZGVscy9UYWcuanMiLCJyb3V0ZXMvY29tcGFuaWVzLmpzIiwicm91dGVzL2ZlbGxvd3MuanMiLCJyb3V0ZXMvdGFncy5qcyIsImFwcC9jb21wYW5pZXMvY29tcGFuaWVzLm1vZHVsZS5qcyIsImFwcC9mZWxsb3dzL2ZlbGxvd3MubW9kdWxlLmpzIiwiYXBwL2hvbWUvaG9tZS5tb2R1bGUuanMiLCJhcHAvcHJvZmlsZS9mb3JtX2Z1bmN0aW9ucy5qcyIsImFwcC9wcm9maWxlL3Byb2ZpbGUubW9kdWxlLmpzIiwiYXBwL2NvbXBhbmllcy9jb250cm9sbGVycy9jb21wYW5pZXMuY29udHJvbGxlci5qcyIsImFwcC9jb21wYW5pZXMvZGlyZWN0aXZlcy9jb21wYW55Q2FyZC5kaXJlY3RpdmUuanMiLCJhcHAvZmVsbG93cy9jb250cm9sbGVycy9mZWxsb3dzLmNvbnRyb2xsZXIuanMiLCJhcHAvY29tcGFuaWVzL3NlcnZpY2VzL2NvbXBhbmllcy5zZXJ2aWNlLmpzIiwiYXBwL2ZlbGxvd3MvZGlyZWN0aXZlcy9mZWxsb3dDYXJkLmRpcmVjdGl2ZS5qcyIsImFwcC9mZWxsb3dzL3NlcnZpY2VzL2ZlbGxvd3Muc2VydmljZS5qcyIsImFwcC9ob21lL2NvbnRyb2xsZXJzL2hvbWUuY29udHJvbGxlci5qcyIsImFwcC9wcm9maWxlL2NvbnRyb2xsZXJzL2FkbWluUHJvZmlsZS5jb250cm9sbGVyLmpzIiwiYXBwL3Byb2ZpbGUvY29udHJvbGxlcnMvZmVsbG93c1Byb2ZpbGUuY29udHJvbGxlci5qcyIsImFwcC9wcm9maWxlL2NvbnRyb2xsZXJzL3Byb2ZpbGUuY29udHJvbGxlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VxdWVsaXplLCBEYXRhVHlwZXMpIHtcclxuXHJcbiAgICB2YXIgQ29tcGFueSA9IHNlcXVlbGl6ZS5kZWZpbmUoXCJjb21wYW5pZXNcIiwge1xyXG5cclxuICAgICAgICBpZDogeyB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUiwgcHJpbWFyeUtleTogdHJ1ZSwgYXV0b0luY3JlbWVudDogdHJ1ZSB9LFxyXG4gICAgICAgIHVzZXJfaWQ6IHsgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIgfSxcclxuICAgICAgICBuYW1lOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGVtYWlsOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIHByaW1hcnlfY29udGFjdDogRGF0YVR5cGVzLlNUUklORyxcclxuICAgICAgICBjb21wYW55X3NpemU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4gICAgICAgIGluZHVzdHJ5OiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBEYXRhVHlwZXMuVEVYVCxcclxuICAgICAgICBmb3VuZGluZ195ZWFyOiBEYXRhVHlwZXMuSU5URUdFUixcclxuICAgICAgICBmb3VuZGVyczogRGF0YVR5cGVzLlNUUklORyxcclxuICAgICAgICB3ZWJzaXRlX3VybDogRGF0YVR5cGVzLlNUUklORyxcclxuICAgICAgICBsaW5rZWRfaW5fdXJsOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGltYWdlX3VybDogRGF0YVR5cGVzLlNUUklOR1xyXG5cclxuICAgIH0se1xyXG5cclxuICAgICAgICB0aW1lc3RhbXBzOiB0cnVlLCAvLyBhZGQgdXBkYXRlZF9hdCBhbmQgY3JlYXRlZF9hdFxyXG4gICAgICAgIHBhcmFub2lkOiB0cnVlIC8vIGFkZCBkZWxldGVkX2F0XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIENvbXBhbnk7XHJcbn07XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VxdWVsaXplLCBEYXRhVHlwZXMpIHtcclxuXHJcbiAgICB2YXIgRmVsbG93ID0gc2VxdWVsaXplLmRlZmluZShcImZlbGxvd3NcIiwge1xyXG5cclxuICAgICAgICBpZDogeyB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUiwgcHJpbWFyeUtleTogdHJ1ZSwgYXV0b0luY3JlbWVudDogdHJ1ZSB9LFxyXG4gICAgICAgIHVzZXJfaWQ6IHsgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIgfSxcclxuICAgICAgICBmaXJzdF9uYW1lOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGxhc3RfbmFtZTogRGF0YVR5cGVzLlNUUklORyxcclxuICAgICAgICBlbWFpbDogRGF0YVR5cGVzLlNUUklORyxcclxuICAgICAgICB1bml2ZXJzaXR5OiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIG1ham9yOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGJpbzogRGF0YVR5cGVzLlRFWFQsXHJcbiAgICAgICAgaW50ZXJlc3RzOiBEYXRhVHlwZXMuVEVYVCxcclxuICAgICAgICByZXN1bWVfZmlsZV9wYXRoOiBEYXRhVHlwZXMuU1RSSU5HLFxyXG4gICAgICAgIGltYWdlX3VybDogRGF0YVR5cGVzLlNUUklOR1xyXG5cclxuICAgIH0se1xyXG5cclxuICAgICAgICB0aW1lc3RhbXBzOiB0cnVlLCAvLyBhZGQgdXBkYXRlZF9hdCBhbmQgY3JlYXRlZF9hdFxyXG4gICAgICAgIHBhcmFub2lkOiB0cnVlIC8vIGFkZCBkZWxldGVkX2F0XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIEZlbGxvdztcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBmcyAgICAgICAgPSByZXF1aXJlKFwiZnNcIik7XHJcbnZhciBwYXRoICAgICAgPSByZXF1aXJlKFwicGF0aFwiKTtcclxudmFyIFNlcXVlbGl6ZSA9IHJlcXVpcmUoXCJzZXF1ZWxpemVcIik7XHJcbnZhciBlbnYgICAgICAgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCBcImRldmVsb3BtZW50XCI7XHJcbi8vdmFyIGNvbmZpZyAgICA9IHJlcXVpcmUoX19kaXJuYW1lICsgJy8uLi9jb25maWcvY29uZmlnLmpzb24nKVtlbnZdO1xyXG4vL3ZhciBzZXF1ZWxpemUgPSBuZXcgU2VxdWVsaXplKGNvbmZpZy5kYXRhYmFzZSwgY29uZmlnLnVzZXJuYW1lLCBjb25maWcucGFzc3dvcmQsIGNvbmZpZyk7XHJcbnZhciBzZXF1ZWxpemUgPSBuZXcgU2VxdWVsaXplKFwicG9zdGdyZXM6Ly9sb2NhbGhvc3Q6NTQzMi9oZnBvcnRhbFwiKTtcclxudmFyIGRiICAgICAgICA9IHt9O1xyXG5cclxuZnNcclxuICAgIC5yZWFkZGlyU3luYyhfX2Rpcm5hbWUpXHJcbiAgICAuZmlsdGVyKGZ1bmN0aW9uKGZpbGUpIHtcclxuICAgICAgICByZXR1cm4gKGZpbGUuaW5kZXhPZihcIi5cIikgIT09IDApICYmIChmaWxlICE9PSBcImluZGV4LmpzXCIpO1xyXG4gICAgfSlcclxuICAgIC5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcclxuICAgICAgICB2YXIgbW9kZWwgPSBzZXF1ZWxpemUuaW1wb3J0KHBhdGguam9pbihfX2Rpcm5hbWUsIGZpbGUpKTtcclxuICAgICAgICBkYlttb2RlbC5uYW1lXSA9IG1vZGVsO1xyXG4gICAgfSk7XHJcblxyXG5PYmplY3Qua2V5cyhkYikuZm9yRWFjaChmdW5jdGlvbihtb2RlbE5hbWUpIHtcclxuICAgIGlmIChcImFzc29jaWF0ZVwiIGluIGRiW21vZGVsTmFtZV0pIHtcclxuICAgICAgICBkYlttb2RlbE5hbWVdLmFzc29jaWF0ZShkYik7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZGIuc2VxdWVsaXplID0gc2VxdWVsaXplO1xyXG5kYi5TZXF1ZWxpemUgPSBTZXF1ZWxpemU7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRiO1xyXG5cclxuIGRiLmNvbXBhbmllcy5iZWxvbmdzVG9NYW55KGRiLnRhZ3MsIHt0aHJvdWdoOiAnY29tcGFuaWVzX3RhZ3MnfSk7XHJcbiBkYi50YWdzLmJlbG9uZ3NUb01hbnkoZGIuY29tcGFuaWVzLCB7dGhyb3VnaDogJ2NvbXBhbmllc190YWdzJ30pO1xyXG5cclxuIGRiLmZlbGxvd3MuYmVsb25nc1RvTWFueShkYi50YWdzLCB7dGhyb3VnaDogJ2ZlbGxvd3NfdGFncyd9KTtcclxuIGRiLnRhZ3MuYmVsb25nc1RvTWFueShkYi5mZWxsb3dzLCB7dGhyb3VnaDogJ2ZlbGxvd3NfdGFncyd9KTtcclxuXHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VxdWVsaXplLCBEYXRhVHlwZXMpIHtcclxuXHJcbiAgICB2YXIgVGFnID0gc2VxdWVsaXplLmRlZmluZShcInRhZ3NcIiwge1xyXG5cclxuICAgICAgICBpZDogeyB0eXBlOiBEYXRhVHlwZXMuSU5URUdFUiwgcHJpbWFyeUtleTogdHJ1ZSwgYXV0b0luY3JlbWVudDogdHJ1ZSB9LFxyXG4gICAgICAgIG5hbWU6IERhdGFUeXBlcy5TVFJJTkdcclxuXHJcbiAgICB9LHtcclxuXHJcbiAgICAgICAgdGltZXN0YW1wczogdHJ1ZSwgLy8gYWRkIHVwZGF0ZWRfYXQgYW5kIGNyZWF0ZWRfYXRcclxuICAgICAgICBwYXJhbm9pZDogdHJ1ZSAvLyBhZGQgZGVsZXRlZF9hdFxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBUYWc7XHJcbn07IiwidmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbnZhciBhcHAgPSBleHByZXNzKCk7XHJcblxyXG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi4vbW9kZWxzJyk7XHJcbnZhciBDb21wYW5pZXMgPSBtb2RlbHMuY29tcGFuaWVzO1xyXG52YXIgVGFncyA9IG1vZGVscy50YWdzO1xyXG5cclxuLy8gR0VUIC9jb21wYW5pZXMgLSBnZXQgYWxsIGNvbXBhbmllc1xyXG5hcHAuZ2V0KCcvJywgZnVuY3Rpb24gZ2V0Q29tcGFuaWVzKHJlcSwgcmVzKSB7XHJcblxyXG4gICAgQ29tcGFuaWVzLmFsbCh7XHJcblxyXG4gICAgICAgIGluY2x1ZGU6IFt7XHJcbiAgICAgICAgICAgIG1vZGVsOiBUYWdzXHJcbiAgICAgICAgfV1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGNvbXBhbmllcykge1xyXG5cclxuICAgICAgICByZXMuc2VuZChjb21wYW5pZXMpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuXHJcbi8vIFBPU1QgL2NvbXBhbmllcyAtIGNyZWF0ZSBhIG5ldyBjb21wYW55IHJlY29yZFxyXG5hcHAucG9zdCgnLycsIGZ1bmN0aW9uIHBvc3RDb21wYW55KHJlcSwgcmVzKSB7XHJcbiAgICAvL3Jlcy5zZW5kKCdQT1NUIHJlcXVlc3QgLSBjcmVhdGUgYSBuZXcgY29tcGFueSByZWNvcmQnKTtcclxuXHJcbiAgICAvLyBUYWtlIFBPU1QgZGF0YSBhbmQgYnVpbGQgYSBDb21wYW55IE9iamVjdCAoc2VxdWVsaXplKVxyXG4gICAgQ29tcGFuaWVzLmNyZWF0ZSh7XHJcblxyXG4gICAgICAgIHVzZXJfaWQ6IHJlcS5ib2R5LnVzZXJfaWQsXHJcbiAgICAgICAgbmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICBlbWFpbDogcmVxLmJvZHkuZW1haWwsXHJcbiAgICAgICAgcHJpbWFyeV9jb250YWN0OiByZXEuYm9keS5wcmltYXJ5X2NvbnRhY3QsXHJcbiAgICAgICAgY29tcGFueV9zaXplOiByZXEuYm9keS5jb21wYW55X3NpemUsXHJcbiAgICAgICAgaW5kdXN0cnk6IHJlcS5ib2R5LmluZHVzdHJ5LFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiByZXEuYm9keS5kZXNjcmlwdGlvbixcclxuICAgICAgICBmb3VuZGluZ195ZWFyOiByZXEuYm9keS5mb3VuZGluZ195ZWFyLFxyXG4gICAgICAgIGZvdW5kZXJzOiByZXEuYm9keS5mb3VuZGVycyxcclxuICAgICAgICB3ZWJzaXRlX3VybDogcmVxLmJvZHkud2Vic2l0ZV91cmwsXHJcbiAgICAgICAgbGlua2VkX2luX3VybDogcmVxLmJvZHkubGlua2VkX2luX3VybCxcclxuICAgICAgICBpbWFnZV91cmw6IHJlcS5ib2R5LmltYWdlX3VybFxyXG5cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oZXJyLCBjb21wYW55KSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKGNvbXBhbnkpO1xyXG4gICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG4vLyBHRVQgL2NvbXBhbmllcy86aWQgLSBnZXQgb25lIGNvbXBhbnlcclxuYXBwLmdldCgnLzppZCcsIGZ1bmN0aW9uIGdldENvbXBhbnkocmVxLCByZXMpIHtcclxuICAgIC8vcmVzLnNlbmQoJ0dFVCByZXF1ZXN0IC0gZ2V0IGEgY29tcGFueSByZWNvcmQnKTtcclxuICAgIENvbXBhbmllcy5maW5kT25lKHtcclxuXHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IHJlcS5wYXJhbXMuaWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY2x1ZGU6IFt7XHJcbiAgICAgICAgICAgIG1vZGVsOiBUYWdzXHJcbiAgICAgICAgICAgIC8vd2hlcmU6IHsgc3RhdGU6IFNlcXVlbGl6ZS5jb2woJ3Byb2plY3Quc3RhdGUnKSB9XHJcbiAgICAgICAgfV1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGNvbXBhbnkpIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoY29tcGFueSk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuLy8gUFVUIC9jb21wYW5pZXMvOmlkIC0gdXBkYXRlcyBhbiBleGlzdGluZyBjb21wYW55IHJlY29yZFxyXG5hcHAucHV0KCcvOmlkJywgZnVuY3Rpb24gcHV0Q29tcGFueShyZXEsIHJlcykge1xyXG5cclxuICAgIENvbXBhbmllcy5maW5kT25lKHtcclxuXHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IHJlcS5wYXJhbXMuaWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY2x1ZGU6IFt7XHJcbiAgICAgICAgICAgIG1vZGVsOiBUYWdzXHJcbiAgICAgICAgICAgIC8vd2hlcmU6IHsgc3RhdGU6IFNlcXVlbGl6ZS5jb2woJ3Byb2plY3Quc3RhdGUnKSB9XHJcbiAgICAgICAgfV1cclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGNvbXBhbnkpIHtcclxuXHJcbiAgICAgICAgY29tcGFueS51c2VyX2lkID0gcmVxLmJvZHkudXNlcl9pZDtcclxuICAgICAgICBjb21wYW55Lm5hbWUgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICAgIGNvbXBhbnkuZW1haWwgPSByZXEuYm9keS5lbWFpbDtcclxuICAgICAgICBjb21wYW55LnByaW1hcnlfY29udGFjdCA9IHJlcS5ib2R5LnByaW1hcnlfY29udGFjdDtcclxuICAgICAgICBjb21wYW55LmNvbXBhbnlfc2l6ZSA9IHJlcS5ib2R5LmNvbXBhbnlfc2l6ZTtcclxuICAgICAgICBjb21wYW55LmluZHVzdHJ5ID0gcmVxLmJvZHkuaW5kdXN0cnk7XHJcbiAgICAgICAgY29tcGFueS5kZXNjcmlwdGlvbiA9IHJlcS5ib2R5LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGNvbXBhbnkuZm91bmRpbmdfeWVhciA9IHJlcS5ib2R5LmZvdW5kaW5nX3llYXI7XHJcbiAgICAgICAgY29tcGFueS5mb3VuZGVycyA9IHJlcS5ib2R5LmZvdW5kZXJzO1xyXG4gICAgICAgIGNvbXBhbnkud2Vic2l0ZV91cmwgPSByZXEuYm9keS53ZWJzaXRlX3VybDtcclxuICAgICAgICBjb21wYW55LmxpbmtlZF9pbl91cmwgPSByZXEuYm9keS5saW5rZWRfaW5fdXJsO1xyXG4gICAgICAgIGNvbXBhbnkuaW1hZ2VfdXJsID0gcmVxLmJvZHkuaW1hZ2VfdXJsO1xyXG5cclxuICAgICAgICBjb21wYW55LnNhdmUoKTtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoY29tcGFueSk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuLy8gREVMRVRFIC9jb21wYW5pZXMvOmlkIC0gZGVsZXRlcyBhbiBleGlzdGluZyBjb21wYW55IHJlY29yZFxyXG5hcHAuZGVsZXRlKCcvOmlkJywgZnVuY3Rpb24gZGVsZXRlQ29tcGFueShyZXEsIHJlcykge1xyXG5cclxuICAgIENvbXBhbmllcy5maW5kT25lKHtcclxuXHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IHJlcS5wYXJhbXMuaWRcclxuICAgICAgICB9XHJcblxyXG4gICAgfSkudGhlbihmdW5jdGlvbihjb21wYW55KSB7XHJcblxyXG4gICAgICAgIGNvbXBhbnkuZGVzdHJveSgpO1xyXG5cclxuICAgICAgICByZXMuc2VuZChcIkNvbXBhbnkgRGVsZXRlZFwiKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcclxuXHJcbiIsInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG52YXIgYXBwID0gZXhwcmVzcygpO1xyXG5cclxudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4uL21vZGVscycpO1xyXG52YXIgRmVsbG93cyA9IG1vZGVscy5mZWxsb3dzO1xyXG52YXIgVGFncyA9IG1vZGVscy50YWdzO1xyXG5cclxuLy8gR0VUIC9mZWxsb3dzIC0gZ2V0IGFsbCBmZWxsb3dzXHJcbmFwcC5nZXQoJy8nLCBmdW5jdGlvbiBnZXRGZWxsb3dzKHJlcSwgcmVzKSB7XHJcblxyXG4gICAgRmVsbG93cy5hbGwoe1xyXG5cclxuICAgICAgICBpbmNsdWRlOiBbe1xyXG4gICAgICAgICAgICBtb2RlbDogVGFnc1xyXG4gICAgICAgIH1dXHJcblxyXG4gICAgfSkudGhlbihmdW5jdGlvbihmZWxsb3dzKSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKGZlbGxvd3MpO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuXHJcbi8vIEdFVCAvZmVsbG93cy86aWQgLSBnZXQgb25lIGZlbGxvd1xyXG5hcHAuZ2V0KCcvOmlkJywgZnVuY3Rpb24gZ2V0RmVsbG93KHJlcSwgcmVzKXtcclxuXHJcbiAgICAvL3Jlcy5zZW5kKCdHRVQgcmVxdWVzdCAtIGdldCBhIGNvbXBhbnkgcmVjb3JkJyk7XHJcbiAgICBGZWxsb3dzLmZpbmRPbmUoe1xyXG5cclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaW5jbHVkZTogW3tcclxuICAgICAgICAgICAgbW9kZWw6IFRhZ3NcclxuICAgICAgICAgICAgLy93aGVyZTogeyBzdGF0ZTogU2VxdWVsaXplLmNvbCgncHJvamVjdC5zdGF0ZScpIH1cclxuICAgICAgICB9XVxyXG5cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oZmVsbG93KSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKGZlbGxvdyk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4vLyBQT1NUIC9mZWxsb3dzIC0gY3JlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcclxuYXBwLnBvc3QoJy8nLCBmdW5jdGlvbiBwb3N0RmVsbG93KHJlcSwgcmVzKSB7XHJcblxyXG4gICAgRmVsbG93cy5jcmVhdGUoe1xyXG5cclxuICAgICAgICB1c2VyX2lkOiByZXEuYm9keS51c2VyX2lkLFxyXG4gICAgICAgIGZpcnN0X25hbWU6IHJlcS5ib2R5LmZpcnN0X25hbWUsXHJcbiAgICAgICAgbGFzdF9uYW1lOiByZXEuYm9keS5sYXN0X25hbWUsXHJcbiAgICAgICAgZW1haWw6IHJlcS5ib2R5LmVtYWlsLFxyXG4gICAgICAgIHVuaXZlcnNpdHk6IHJlcS5ib2R5LnVuaXZlcnNpdHksXHJcbiAgICAgICAgbWFqb3I6IHJlcS5ib2R5Lm1ham9yLFxyXG4gICAgICAgIGJpbzogcmVxLmJvZHkuYmlvLFxyXG4gICAgICAgIGludGVyZXN0czogcmVxLmJvZHkuaW50ZXJlc3RzLFxyXG4gICAgICAgIHJlc3VtZV9maWxlX3BhdGg6IHJlcS5ib2R5LnJlc3VtZV9maWxlX3BhdGgsXHJcbiAgICAgICAgaW1hZ2VfdXJsOiByZXEuYm9keS5pbWFnZV91cmxcclxuXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGVyciwgZmVsbG93KSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKGZlbGxvdyk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuXHJcbi8vIFBVVCAvZmVsbG93cy86aWQgLSB1cGRhdGVzIGFuIGV4aXN0aW5nIGZlbGxvdyByZWNvcmRcclxuYXBwLnB1dCgnLzppZCcsIGZ1bmN0aW9uIHB1dEZlbGxvdyhyZXEsIHJlcykge1xyXG5cclxuICAgIEZlbGxvd3MuZmluZE9uZSh7XHJcblxyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgIGlkOiByZXEucGFyYW1zLmlkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbmNsdWRlOiBbe1xyXG4gICAgICAgICAgICBtb2RlbDogVGFnc1xyXG4gICAgICAgICAgICAvL3doZXJlOiB7IHN0YXRlOiBTZXF1ZWxpemUuY29sKCdwcm9qZWN0LnN0YXRlJykgfVxyXG4gICAgICAgIH1dXHJcblxyXG4gICAgfSkudGhlbihmdW5jdGlvbihmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgZmVsbG93LnVzZXJfaWQgPSByZXEuYm9keS51c2VyX2lkO1xyXG4gICAgICAgIGZlbGxvdy5maXJzdF9uYW1lID0gcmVxLmJvZHkuZmlyc3RfbmFtZTtcclxuICAgICAgICBmZWxsb3cubGFzdF9uYW1lID0gcmVxLmJvZHkubGFzdF9uYW1lO1xyXG4gICAgICAgIGZlbGxvdy5lbWFpbCA9IHJlcS5ib2R5LmVtYWlsO1xyXG4gICAgICAgIGZlbGxvdy51bml2ZXJzaXR5ID0gcmVxLmJvZHkudW5pdmVyc2l0eTtcclxuICAgICAgICBmZWxsb3cubWFqb3IgPSByZXEuYm9keS5tYWpvcjtcclxuICAgICAgICBmZWxsb3cuYmlvID0gcmVxLmJvZHkuYmlvO1xyXG4gICAgICAgIGZlbGxvdy5pbnRlcmVzdHMgPSByZXEuYm9keS5pbnRlcmVzdHM7XHJcbiAgICAgICAgZmVsbG93LnJlc3VtZV9maWxlX3BhdGggPSByZXEuYm9keS5yZXN1bWVfZmlsZV9wYXRoO1xyXG4gICAgICAgIGZlbGxvdy5pbWFnZV91cmwgPSByZXEuYm9keS5pbWFnZV91cmw7XHJcblxyXG4gICAgICAgIGZlbGxvdy5zYXZlKCk7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKGZlbGxvdyk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuLy8gREVMRVRFIC9mZWxsb3dzLzppZCAtIGRlbGV0ZXMgYW4gZXhpc3RpbmcgZmVsbG93IHJlY29yZFxyXG5hcHAuZGVsZXRlKCcvOmlkJywgZnVuY3Rpb24gZGVsZXRlRmVsbG93KHJlcSwgcmVzKSB7XHJcblxyXG4gICAgRmVsbG93cy5maW5kT25lKHtcclxuXHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IHJlcS5wYXJhbXMuaWRcclxuICAgICAgICB9XHJcblxyXG4gICAgfSkudGhlbihmdW5jdGlvbihmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgZmVsbG93LmRlc3Ryb3koKTtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoXCJGZWxsb3cgRGVsZXRlZFwiKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XHJcbiIsInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG52YXIgYXBwID0gZXhwcmVzcygpO1xyXG5cclxudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4uL21vZGVscycpO1xyXG52YXIgVGFncyA9IG1vZGVscy50YWdzO1xyXG5cclxuLyoqIFRhZ3MgKiovXHJcblxyXG4vLyBHRVQgL2FwaS90YWdzIC0gZ2V0IGFsbCBjb21wYW5pZXNcclxuYXBwLmdldCgnL2FwaS92MS90YWdzJywgZnVuY3Rpb24gZ2V0VGFncyhyZXEsIHJlcykge1xyXG5cclxuICAgIC8qVGFncy5jcmVhdGUoe1xyXG4gICAgICAgIG5hbWU6IFwiSmF2YXNjcmlwdFwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJIVE1MXCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIkNTU1wiXHJcbiAgICB9KTtcclxuXHJcbiAgICBUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJDKytcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgVGFncy5jcmVhdGUoe1xyXG4gICAgICAgIG5hbWU6IFwiSmF2YVwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJQSFBcIlxyXG4gICAgfSk7XHJcblxyXG4gICAgVGFncy5jcmVhdGUoe1xyXG4gICAgICAgIG5hbWU6IFwiTm9kZVwiXHJcbiAgICB9KTtcclxuXHJcbiAgICBUYWdzLmNyZWF0ZSh7XHJcbiAgICAgICAgbmFtZTogXCJBbmd1bGFyXCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIk15U1FMXCJcclxuICAgIH0pO1xyXG5cclxuICAgIFRhZ3MuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBcIlBvc3RncmVTUUxcIlxyXG4gICAgfSk7Ki9cclxuXHJcblxyXG4gICAgVGFncy5hbGwoKS50aGVuKGZ1bmN0aW9uKHRhZ3MpIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQodGFncyk7XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XHJcbiIsIi8qKlxyXG4gKiBjb21wYW5pZXMgbW9kdWxlXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMnLCBbXHJcbiAgICAgICAgJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuY29tcGFuaWVzLnNlcnZpY2VzJyxcclxuICAgICAgICAnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuY29udHJvbGxlcnMnLCBbXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgc2VydmljZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5zZXJ2aWNlcycsIFtdKTtcclxuXHJcbiAgLy8gZGVjbGFyZSB0aGUgZGlyZWN0aXZlcyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuY29tcGFuaWVzLmRpcmVjdGl2ZXMnLCBbXSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogZmVsbG93cyBtb2R1bGVcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MnLCBbXHJcbiAgICAgICAgJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJyxcclxuICAgICAgICAnYXBwLmZlbGxvd3Muc2VydmljZXMnLFxyXG4gICAgICAgICdhcHAuZmVsbG93cy5kaXJlY3RpdmVzJ1xyXG4gICAgICAgIF0pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGNvbnRyb2xsZXJzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIHNlcnZpY2VzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJywgW10pO1xyXG5cclxuICAvL2RlY2xhcmUgdGhlIGRpcmVjdGl2ZXMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycsIFtdKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBob21lIG1vZHVsZVxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZScsIFtcclxuICAgICAgICAnYXBwLmhvbWUuY29udHJvbGxlcnMnLFxyXG4gICAgICAgICdhcHAuaG9tZS5zZXJ2aWNlcydcclxuICAgICAgICBdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBjb250cm9sbGVycyBtb2R1bGVcclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAuaG9tZS5jb250cm9sbGVycycsIFtdKTtcclxuXHJcbiAgLy9kZWNsYXJlIHRoZSBkaXJlY3RpdmVzIG1vZHVsZVxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmRpcmVjdGl2ZXMnLCBbXSk7XHJcbiAgICAvL2hvdyBhYm91dCB0aGlzXHJcbn0pKCk7XHJcbiIsIiIsIi8qKlxyXG4gKiBwcm9maWxlIG1vZHVsZVxyXG4gKi9cclxuXHJcbiAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlJywgW1xyXG4gICAgJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJ1xyXG4gICAgXSk7XHJcblxyXG4gIC8vZGVjbGFyZSB0aGUgY29udHJvbGxlcnMgbW9kdWxlXHJcbiAgYW5ndWxhclxyXG4gIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJywgW10pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogQ29tcGFuaWVzQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLmNvbXBhbmllcy5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5jb250cm9sbGVycycpXHJcbiAgICAuY29udHJvbGxlcignQ29tcGFuaWVzQ29udHJvbGxlcicsIENvbXBhbmllc0NvbnRyb2xsZXIpXHJcbiAgICAuY29udHJvbGxlcignQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLCBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gIENvbXBhbmllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdDb21wYW5pZXMnXTtcclxuICBDb21wYW5pZXNNb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnY29tcGFueSddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gQ29tcGFuaWVzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgQ29tcGFuaWVzKSB7XHJcblxyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAvLyBVc2Ugdm0gZm9yIHRoaXM/XHJcbiAgICAkc2NvcGUuY29tcGFuaWVzID0gQ29tcGFuaWVzLmFsbCgpO1xyXG5cclxuICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbiAoY29tcGFueSkge1xyXG5cclxuICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcblxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvcGFydGlhbHMvY29tcGFueV9kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiAnQ29tcGFuaWVzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHNpemU6ICdsZycsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgY29tcGFueTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBhbnk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL21vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkge1xyXG4gICAgICAvL1x0JHNjb3BlLnNlbGVjdGVkID0gc2VsZWN0ZWRJdGVtO1xyXG4gICAgICAvL30sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy9cdCRsb2cuaW5mbygnTW9kYWwgZGlzbWlzc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XHJcbiAgICAgIC8vfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGNvbXBhbmllcyBjb250cm9sbGVyIScpXHJcblxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENvbXBhbmllc01vZGFsSW5zdGFuY2VDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGNvbXBhbnkpe1xyXG5cclxuICAgICRzY29wZS5jb21wYW55ID0gY29tcGFueTtcclxuXHJcbiAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5jb21wYW55KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmNvbXBhbmllcy5kaXJlY3RpdmVzJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdjb21wYW55Q2FyZCcsIGNvbXBhbnlDYXJkKTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gY29tcGFueUNhcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBRScsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zb3VyY2UvYXBwL2NvbXBhbmllcy9wYXJ0aWFscy9jb21wYW55X2NhcmQuaHRtbCcvKixcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqXHJcbiogRmVsbG93c0NvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5mZWxsb3dzLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuXHQubW9kdWxlKCdhcHAuZmVsbG93cy5jb250cm9sbGVycycpXHJcblx0LmNvbnRyb2xsZXIoJ0ZlbGxvd3NDb250cm9sbGVyJywgRmVsbG93c0NvbnRyb2xsZXIpXHJcblx0LmNvbnRyb2xsZXIoJ0ZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcicsIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlcik7XHJcblxyXG4gICAgRmVsbG93c0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCcsICdGZWxsb3dzJ107XHJcbiAgICBGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJywgJ2ZlbGxvdyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWVzcGFjZSBGZWxsb3dzQ29udHJvbGxlclxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBGZWxsb3dzQ29udHJvbGxlcigkc2NvcGUsICRtb2RhbCwgRmVsbG93cykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZhdGVkIGZlbGxvd3MgY29udHJvbGxlciEnKVxyXG4gICAgICAgICAgICAvL0ZlbGxvd3MuYWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93cyA9IEZlbGxvd3MuYWxsKCk7XHJcblxyXG4gICAgICAgICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbihmZWxsb3cpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9mZWxsb3dzL3BhcnRpYWxzL2ZlbGxvd19kZXRhaWxfdmlldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGZWxsb3dzTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmZWxsb3c6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWxsb3c7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEZlbGxvd3NNb2RhbEluc3RhbmNlQ29udHJvbGxlciAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgZmVsbG93KSB7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93ID0gZmVsbG93O1xyXG5cclxuICAgICAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5mZWxsb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBDb21wYW5pZXNcclxuKiBAbmFtZXNwYWNlIGFwcC5jb21wYW5pZXMuc2VydmljZXNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5jb21wYW5pZXMuc2VydmljZXMnKVxyXG4gICAgLnNlcnZpY2UoJ0NvbXBhbmllcycsIENvbXBhbmllcyk7XHJcblxyXG4gIENvbXBhbmllcy4kaW5qZWN0ID0gWyckaHR0cCddO1xyXG5cclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgQ29tcGFuaWVzXHJcbiAgKiBAcmV0dXJucyB7U2VydmljZX1cclxuICAqL1xyXG4gIGZ1bmN0aW9uIENvbXBhbmllcygkaHR0cCkge1xyXG4gICAgdmFyIENvbXBhbmllcyA9IHtcclxuICAgICAgYWxsOiBhbGwsXHJcbiAgICAgIGdldDogZ2V0LFxyXG4gICAgICBjcmVhdGU6IGNyZWF0ZSxcclxuICAgICAgdXBkYXRlOiB1cGRhdGUsXHJcbiAgICAgIGRlc3Ryb3k6IGRlc3Ryb3lcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIENvbXBhbmllcztcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgYWxsXHJcbiAgICAgKiBAZGVzYyBnZXQgYWxsIHRoZSBjb21wYW5pZXNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYWxsKCkge1xyXG5cclxuICAgICAgcmV0dXJuIFtcclxuXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICBuYW1lOlx0J0NvbXBhbnkgMScsXHJcbiAgICAgICAgICB1c2VyX2lkOiAnMScsXHJcbiAgICAgICAgICBlbWFpbDogXCJcIixcclxuICAgICAgICAgIHByaW1hcnlfY29udGFjdDogXCJcIixcclxuICAgICAgICAgIGNvbXBhbnlfc2l6ZTogXCJcIixcclxuICAgICAgICAgIGluZHVzdHJ5OiBcIlwiLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICAgICAgICBmb3VuZGluZ195ZWFyOiAyMDEzLFxyXG4gICAgICAgICAgZm91bmRlcnM6IFwiXCIsXHJcbiAgICAgICAgICB2ZXJpZmllZDogMSxcclxuICAgICAgICAgIGltYWdlX3VybDogXCJcIixcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAyJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSAzJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSA0JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnQ29tcGFueSA1JyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9XHJcblxyXG4gICAgICBdO1xyXG5cclxuICAgICAgLy9yZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3YxL2NvbXBhbmllcy8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGdldFxyXG4gICAgICogQGRlc2MgZ2V0IGp1c3Qgb25lIGNvbXBhbnlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdjEvY29tcGFuaWVzLycgKyBwYXJzZUludChpZCkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGNyZWF0ZVxyXG4gICAgICogQGRlc2MgY3JlZWF0ZSBhIG5ldyBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZShjb250ZW50LCBpZCkge1xyXG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS92MS9jb21wYW5pZXMvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIHVwZGF0ZVxyXG4gICAgICogQGRlc2MgdXBkYXRlcyBhIGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGNvbnRlbnQsIGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC51cGRhdGUoJy9hcGkvdjFjb21wYW5pZXMvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2FwaS92MWNvbXBhbmllcy8nICsgaWQpO1xyXG4gICAgfVxyXG4gIH1cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLmZlbGxvd3MuZGlyZWN0aXZlcycpXHJcbiAgICAuZGlyZWN0aXZlKCdmZWxsb3dDYXJkJywgZmVsbG93Q2FyZCk7XHJcblxyXG5cclxuIGZ1bmN0aW9uIGZlbGxvd0NhcmQoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN0cmljZTogJ0FFJyxcclxuICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgc2NvcGU6IHRydWUsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAnL3NvdXJjZS9hcHAvZmVsbG93cy9wYXJ0aWFscy9mZWxsb3dfY2FyZC5odG1sJy8qLFxyXG4gICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XHJcbiAgICAgICAgZWxlbS5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgfSAqL1xyXG4gICAgfTtcclxuICB9XHJcbn0pKCk7IiwiLyoqXHJcbiogRmVsbG93c1xyXG4qIEBuYW1lc3BhY2UgYXBwLmZlbGxvd3Muc2VydmljZXNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5mZWxsb3dzLnNlcnZpY2VzJylcclxuICAgIC5zZXJ2aWNlKCdGZWxsb3dzJywgRmVsbG93cyk7XHJcblxyXG4gIEZlbGxvd3MuJGluamVjdCA9IFsnJGh0dHAnXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBAbmFtZXNwYWNlIEZlbGxvd3NcclxuICAqIEByZXR1cm5zIHtTZXJ2aWNlfVxyXG4gICovXHJcbiAgZnVuY3Rpb24gRmVsbG93cygkaHR0cCkge1xyXG4gICAgdmFyIEZlbGxvd3MgPSB7XHJcbiAgICAgIGFsbDogYWxsLFxyXG4gICAgICBnZXQ6IGdldCxcclxuICAgICAgY3JlYXRlOiBjcmVhdGUsXHJcbiAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICBkZXN0cm95OiBkZXN0cm95XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBGZWxsb3dzO1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSBhbGxcclxuICAgICAqIEBkZXNjIGdldCBhbGwgdGhlIGZlbGxvd3NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYWxsKCkge1xyXG5cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J05hbWUgMScsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnSmF2YScsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J05hbWUgMicsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnTWF0bGFiJywgJ1BIUCddLFxyXG4gICAgICAgICAgZGVzYzpcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LicgK1xyXG4gICAgICAgICAgJyBFdGlhbSB1dCBpbnRlcmR1bSBudW5jLiBJbiBoYWMgaGFiaXRhc3NlIHBsYXRlYSBkaWN0dW1zdC4nICtcclxuICAgICAgICAgICcgRHVpcyBlZ2V0IGRvbG9yIHV0IGp1c3RvIGN1cnN1cyBjb252YWxsaXMgc2VkIGVnZXQgbmliaC4gJyArXHJcbiAgICAgICAgICAnRnVzY2Ugc2VkIGVsaXQgZXUgcXVhbSBwcmV0aXVtIHZlc3RpYnVsdW0gaW4gZXUgbnVsbGEuIFNlZCcgK1xyXG4gICAgICAgICAgJyBkaWN0dW0gc2VtIHV0IHRlbGx1cyBibGFuZGl0IG1hdHRpcy4gQWxpcXVhbSBuZWMgZXJhdCBtaS4nICtcclxuICAgICAgICAgICcgTnVsbGEgbm9uIGR1aSBuZWMgYXVndWUgZmFjaWxpc2lzIGNvbnNlcXVhdC4gTnVsbGEgbW9sbGlzJyArXHJcbiAgICAgICAgICAnbnVuYyBzZWQgZXJvcyBlbGVpZmVuZCwgaW4gdm9sdXRwYXQgYW50ZSBoZW5kcmVyaXQuICcgK1xyXG4gICAgICAgICAgJ1ByYWVzZW50IGV1IHZ1bHB1dGF0ZSBleCwgYWMgcmhvbmN1cyBuaXNpLicsXHJcbiAgICAgICAgICBzcmM6XHQnL3B1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZydcclxuICAgICAgICB9LFxyXG4gICAgICAgIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6XHQnTmFtZSAzJyxcclxuICAgICAgICAgIHRhZ3M6XHRbJ0MrKycsICdKYXZhJywgJ0MnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOlx0J05hbWUgNCcsXHJcbiAgICAgICAgICB0YWdzOlx0WydDKysnLCAnQW5kcm9pZCcsICdQSFAnXSxcclxuICAgICAgICAgIGRlc2M6XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4nICtcclxuICAgICAgICAgICcgRXRpYW0gdXQgaW50ZXJkdW0gbnVuYy4gSW4gaGFjIGhhYml0YXNzZSBwbGF0ZWEgZGljdHVtc3QuJyArXHJcbiAgICAgICAgICAnIER1aXMgZWdldCBkb2xvciB1dCBqdXN0byBjdXJzdXMgY29udmFsbGlzIHNlZCBlZ2V0IG5pYmguICcgK1xyXG4gICAgICAgICAgJ0Z1c2NlIHNlZCBlbGl0IGV1IHF1YW0gcHJldGl1bSB2ZXN0aWJ1bHVtIGluIGV1IG51bGxhLiBTZWQnICtcclxuICAgICAgICAgICcgZGljdHVtIHNlbSB1dCB0ZWxsdXMgYmxhbmRpdCBtYXR0aXMuIEFsaXF1YW0gbmVjIGVyYXQgbWkuJyArXHJcbiAgICAgICAgICAnIE51bGxhIG5vbiBkdWkgbmVjIGF1Z3VlIGZhY2lsaXNpcyBjb25zZXF1YXQuIE51bGxhIG1vbGxpcycgK1xyXG4gICAgICAgICAgJ251bmMgc2VkIGVyb3MgZWxlaWZlbmQsIGluIHZvbHV0cGF0IGFudGUgaGVuZHJlcml0LiAnICtcclxuICAgICAgICAgICdQcmFlc2VudCBldSB2dWxwdXRhdGUgZXgsIGFjIHJob25jdXMgbmlzaS4nLFxyXG4gICAgICAgICAgc3JjOlx0Jy9wdWJsaWMvYXNzZXRzL2ltYWdlcy9wbGFjZWhvbGRlci1oaS5wbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICBdO1xyXG5cclxuICAgICAgLy9yZXR1cm4gJGh0dHAuZ2V0KCcvZmVsbG93cy8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGdldFxyXG4gICAgICogQGRlc2MgZ2V0IG9uZSBmZWxsb3dcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0KGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9mZWxsb3dzLycgKyBpKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgY3JlYXRlXHJcbiAgICAgKiBAZGVzYyBjcmVlYXRlIGEgbmV3IGZlbGxvdyByZWNvcmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlKGNvbnRlbnQsIGlkKSB7XHJcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvZmVsbG93cy8nICsgaWQsIHtcclxuICAgICAgICBjb250ZW50OiBjb250ZW50XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgdXBkYXRlXHJcbiAgICAgKiBAZGVzYyB1cGRhdGVzIGEgZmVsbG93IHJlY29yZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoY29udGVudCwgaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLnVwZGF0ZSgnL2ZlbGxvd3MvJyArIGlkLCB7XHJcbiAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuYW1lIGRlc3Ryb3lcclxuICAgICAqIEBkZXNjIGRlc3Ryb3kgYSBmZWxsb3cgcmVjb3JkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlc3Ryb3koaWQpIHtcclxuICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL2ZlbGxvd3MvJyArIGlkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBIb21lQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLmhvbWUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5ob21lLmNvbnRyb2xsZXJzJylcclxuICAgIC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcclxuXHJcbiAgSG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJ107XHJcblxyXG4gIC8qKlxyXG4gICogQG5hbWVzcGFjZSBIb21lQ29udHJvbGxlclxyXG4gICovXHJcbiAgZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmF0ZWQgaG9tZSBjb250cm9sbGVyIScpXHJcbiAgICAgIC8vSG9tZS5hbGwoKTtcclxuICAgIH1cclxuICB9XHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4qIEFkbWluUHJvZmlsZUNvbnRyb2xsZXJcclxuKiBAbmFtZXNwYWNlIGFwcC5wcm9maWxlLmNvbnRyb2xsZXJzXHJcbiovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwLnByb2ZpbGUuY29udHJvbGxlcnMnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZUNvbnRyb2xsZXInLCBBZG1pblByb2ZpbGVDb250cm9sbGVyKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0FkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbCddO1xyXG4gICAgQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRtb2RhbEluc3RhbmNlJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZXNwYWNlIEFkbWluUHJvZmlsZUNvbnRyb2xsZXJcclxuICAgICAqL1xyXG4gICAgIGZ1bmN0aW9uIEFkbWluUHJvZmlsZUNvbnRyb2xsZXIoJHNjb3BlLCAkbW9kYWwpIHtcclxuXHJcbiAgICAgICAgJHNjb3BlLm9wZW5Nb2RhbCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XHJcblxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvYWRtaW4tY3JlYXRlLXVzZXIuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9maWxlTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ2xnJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEFkbWluUHJvZmlsZU1vZGFsSW5zdGFuY2VDb250cm9sbGVyICgkc2NvcGUsICRtb2RhbEluc3RhbmNlKSB7XHJcblxyXG4gICAgICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiogRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyXHJcbiogQG5hbWVzcGFjZSBhcHAucHJvZmlsZS5jb250cm9sbGVyc1xyXG4qL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcC5wcm9maWxlLmNvbnRyb2xsZXJzJylcclxuICAgIC5jb250cm9sbGVyKCdGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXInLCBGZWxsb3dzUHJvZmlsZUNvbnRyb2xsZXIpXHJcblxyXG4gICAgRmVsbG93c1Byb2ZpbGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBAbmFtZXNwYWNlIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlclxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIEZlbGxvd3NQcm9maWxlQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93ID0ge1xyXG4gICAgICAgICAgICBiaW86XCJJIGFtIGEgcGVyc29uLiBJIHdlbnQgdG8gc2Nob29sLiBJIGhhdmUgYSBkZWdyZWUuIFBsZWFzZSBwYXkgbWUgbW9uZXlzXCIsXHJcbiAgICAgICAgICAgIGltZzpcInB1YmxpYy9hc3NldHMvaW1hZ2VzL3BsYWNlaG9sZGVyLWhpLnBuZ1wiXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuZmVsbG93PSB7XHJcbiAgICAgICAgICAgIGJpbzpcIkkgYW0gYSBwZXJzb24uIEkgd2VudCB0byBzY2hvb2wuIEkgaGF2ZSBhIGRlZ3JlZS4gUGxlYXNlIHBheSBtZSBtb25leXNcIixcclxuICAgICAgICAgICAgaW1nOlwicHVibGljL2Fzc2V0cy9pbWFnZXMvcGxhY2Vob2xkZXItaGkucG5nXCJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRlZCBwcm9maWxlIGNvbnRyb2xsZXIhJylcclxuICAgICAgICAgICAgLy9Qcm9maWxlLmFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZT0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mZWxsb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuKiBQcm9maWxlQ29udHJvbGxlclxyXG4qIEBuYW1lc3BhY2UgYXBwLnByb2ZpbGUuY29udHJvbGxlcnNcclxuKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAubW9kdWxlKCdhcHAucHJvZmlsZS5jb250cm9sbGVycycpXHJcbiAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xyXG5cclxuICBQcm9maWxlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnXTtcclxuICAvKipcclxuICAqIEBuYW1lc3BhY2UgUHJvZmlsZUNvbnRyb2xsZXJcclxuICAqL1xyXG4gIGZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKCRzY29wZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG59KSgpO1xyXG4iLCJcclxuLyoqXHJcbiAqIGFwcC5yb3V0ZXNcclxuICogQGRlc2MgICAgY29udGFpbnMgdGhlIHJvdXRlcyBmb3IgdGhlIGFwcFxyXG4gKi9cclxuXHJcbiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICd1aS5ib290c3RyYXAnLCAnYXBwLmNvbXBhbmllcycsICdhcHAuZmVsbG93cycsICdhcHAucHJvZmlsZSddKTtcclxuIHZhciBzdHJpbmcgPSBcImR1bW15XCJcclxuXHJcbi8qKlxyXG4gKiAgICogQG5hbWUgY29uZmlnXHJcbiAqICAgICAqIEBkZXNjIERlZmluZSB2YWxpZCBhcHBsaWNhdGlvbiByb3V0ZXNcclxuICogICAgICAgKi9cclxuIGFwcC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpe1xyXG5cclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAud2hlbignLycsIHtcclxuICAgICAgICBjb250cm9sbGVyICA6ICdSb3V0aW5nQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmwgOiAnc291cmNlL2FwcC9ob21lL2hvbWUuaHRtbCdcclxuICAgIH0pXHJcbiAgICAud2hlbignL2ZlbGxvd3MnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ1JvdXRpbmdDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvZmVsbG93cy9mZWxsb3dzLmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLndoZW4oJy9jb21wYW5pZXMnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbmllc0NvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9jb21wYW5pZXMvY29tcGFuaWVzLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC53aGVuKCcvcHJvZmlsZScsIHtcclxuICAgICAgICBjb250cm9sbGVyOiAnUHJvZmlsZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3Byb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2FkbWluJywge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblByb2ZpbGVDb250cm9sbGVyJyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NvdXJjZS9hcHAvcHJvZmlsZS9wYXJ0aWFscy9hZG1pbi1wcm9maWxlLmh0bWwnXHJcbiAgICB9KVxyXG5cclxuICAgIC53aGVuKCcvcHJvZmlsZS9mZWxsb3cnLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0ZlbGxvd3NQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvZmVsbG93LXByb2ZpbGUuaHRtbCdcclxuICAgIH0pXHJcblxyXG4gICAgLndoZW4oJy9wcm9maWxlL2NvbXBhbnknLCB7XHJcbiAgICAgICAgY29udHJvbGxlcjogJ0NvbXBhbnlQcm9maWxlQ29udHJvbGxlcicsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzb3VyY2UvYXBwL3Byb2ZpbGUvcGFydGlhbHMvY29tcGFueS1wcm9maWxlLmh0bWwnXHJcbiAgICB9KVxyXG4gICAgLm90aGVyd2lzZSh7IHJlZGlyZWN0VG86ICcvJyB9KTtcclxuXHJcbn0pO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1JvdXRpbmdDb250cm9sbGVyJywgUm91dGluZ0NvbnRyb2xsZXIpXHJcbi5jb250cm9sbGVyKCdMb2dpbk1vZGFsSW5zdGFuY2VDb250cm9sbGVyJywgTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlcilcclxuXHJcblJvdXRpbmdDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbW9kYWwnXTtcclxuTG9naW5Nb2RhbEluc3RhbmNlQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnXTtcclxuXHJcbmZ1bmN0aW9uIFJvdXRpbmdDb250cm9sbGVyKCRzY29wZSwgJG1vZGFsKSB7XHJcblxyXG4gICRzY29wZS5vcGVuTW9kYWwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc291cmNlL2FwcC9wcm9maWxlL3BhcnRpYWxzL2xvZ2luLXBhZ2UuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXInLFxyXG4gICAgICAgIHNpemU6ICdzbScsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExvZ2luTW9kYWxJbnN0YW5jZUNvbnRyb2xsZXIgKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UpIHtcclxuICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xyXG4gICAgfTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=