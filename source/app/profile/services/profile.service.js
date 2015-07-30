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
          name:	'James York',
          tags:	['C++', 'Java', 'PHP'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'http://www.itinthed.com/wp-content/uploads/306367_101503800760' +
          '32138_1742107767_n.jpg'
        },
        {
          name:	'Alex Suriano',
          tags:	['C++', 'Matlab', 'PHP'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/11012847'+
          '_10152997381158017_1834732506110573484_n.jpg?oh=02e4ca83e0e4' +
          '2dbf819326f7fe81e379&oe=5618EF64'
        },
        {
          name:	'Cam Herringshaw',
          tags:	['C++', 'Java', 'C'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/7/000/1' +
          'ac/1e0/3c3be82.jpg'
        },
        {
          name:	'Major Sapp',
          tags:	['C++', 'Android', 'PHP'],
          desc:	'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
          ' Etiam ut interdum nunc. In hac habitasse platea dictumst.' +
          ' Duis eget dolor ut justo cursus convallis sed eget nibh. ' +
          'Fusce sed elit eu quam pretium vestibulum in eu nulla. Sed' +
          ' dictum sem ut tellus blandit mattis. Aliquam nec erat mi.' +
          ' Nulla non dui nec augue facilisis consequat. Nulla mollis' +
          'nunc sed eros eleifend, in volutpat ante hendrerit. ' +
          'Praesent eu vulputate ex, ac rhoncus nisi.',
          src:	'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/1/005/089/38a/3ddb6de.jpg'
        }
      ];

      //return $http.get('/fellows/');
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
