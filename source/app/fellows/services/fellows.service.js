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

  // var rootUrl = "http://10.251.1.61:3000";
  var rootUrl = 'https://quiet-cove-6830.herokuapp.com';

  /**
  * @namespace Fellows
  * @returns {Service}
  */
  function Fellows($http) {

	return {
	  all: all,
	  get: get,
	  create: create,
	  update: update,
	  destroy: destroy
	};

	////////////////////

	/**
	 * @name all
	 * @desc get all the fellows
	 */
	function all() {
		return $http.get(rootUrl + '/api/v1/fellows');
	}

	/**
	 * @name get
	 * @desc get one fellow
	 * @desc get one fellow
	 */
	function get(id) {
		return $http.get(rootUrl + '/api/v1/fellows/' + id);
	}
	/**
	 * @name create
	 * @desc creeate a new fellow record
	 */
	function create(fellow) {
		return $http.post(rootUrl + '/api/v1/fellows/', fellow);
	}

	/**
	 * @name update
	 * @desc updates a fellow record
	 */
	function update(fellow, id) {
		return $http.put(rootUrl + '/api/v1/fellows/' + id, fellow);
	}

	/**
	 * @name destroy
	 * @desc destroy a fellow record
	 */
	function destroy(id) {
	  return $http.delete(rootUrl + '/api/v1/fellows/' + id);
	}
  }

  var fellows = [
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

})();
