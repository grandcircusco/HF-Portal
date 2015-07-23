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
      return $http.get('/fellows/');
    }

    /**
     * @name get
     * @desc get one fellow
     */
    function get() {
      return $http.get('/fellows/' + id);
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

  var sizes = {
  	xs: "1-5",
  	s: "6-10",
  	m: "11-15",
  	l: "16-20",
  	xl: "21+"
  };

  var fellows = [{
  	name: "Nick Dedenbach",
  	bio: "I'm cool.",
  	school: "University of Michigan",
  	major: "Computer Engineering",
  	skills: ["C++", "Embedded"],
  	interests: ["Geocaching", "Gaming", "Movies"],
  	link: "github.com/Ryouza"
  },
  {
  	name: "Bruce Wayne",
  	bio: "Dead parents.",
  	school: "Gotham University",
  	major: "Aloofness",
  	skills: ["A lot"],
  	interests: ["Being Batman", "Justice"],
  	link: "github.com/not_batman"
  }];

  var companies = [{
  	name: "Tome",
  	description: "IoT for office, yo",
  	summary: "IoT for office",
  	size: sizes.s,
  	desired_skills: ["Android", "iOS", "Embedded"],
  	location: "Royal Oak",
  	link: "tomesoftware.com"
  },
  {
  	name: "Wayne Enterprises",
  	description: "Suspiciously high R&D budget",
  	summary: "Gears Batman",
  	size: sizes.xl,
  	desired_skills: ["Crimefighting", "Keeping secrets"],
  	location: "Gotham",
  	link: "www.wayneent.com"
  }];

// module.exports = {
// 	companies: companies,
// 	fellows: fellows
// };

/*
var fellow = {
	name: "",
	bio: "",
	school: "",
	major: "",
	skills: [""],
	interests: [""],
	link: ""
}

var company = {
	name: "",
	description: "",
	summary: "",
	size: sizes.,
	desired_skills: [""],
	location: "",
	link: ""
}
*/

})();
