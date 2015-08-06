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

  //var rootUrl = 'https://quiet-cove-6830.herokuapp.com';

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

		return $http.get('/api/v1/fellows');
	}

	/**
	 * @name get
	 * @desc get one fellow
	 * @desc get one fellow
	 */
	function get(id) {

		console.log("request from angular to node");
		var res = $http.get('/api/v1/fellows/' + id).success(function(data) {
			console.log("fellows data");
			console.log(data.first_name);
			console.log(data.tags);
		});

		return res;

		//return $http.get('/api/v1/fellows/' + id);

	}
	/**
	 * @name create
	 * @desc creeate a new fellow record
	 */
	function create(fellow) {
		return $http.post('/api/v1/fellows/', fellow);
	}

	/**
	 * @name update
	 * @desc updates a fellow record
	 */
	function update(fellow, id) {
		return $http.put('/api/v1/fellows/' + id, fellow);
	}

	/**
	 * @name destroy
	 * @desc destroy a fellow record
	 */
	function destroy(id) {
	  return $http.delete('/api/v1/fellows/' + id);
	}
  }


  var fellows = [
		{
		  name:	'Name 1',
		  tags:	['C++', 'Java', 'PHP'],
                  id: 1,
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
