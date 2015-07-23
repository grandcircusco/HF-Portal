var app = angular.module('fellow_app', []);

app.directive('fellowCard', function() {
	return {
		replace: true,
		scope: true,
		templateUrl: '/src/views/partials/fellow_card.html',
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				
			});
		}
	};
});

app.controller('fellow_controller', function($scope) {
	$scope.fellows = [{
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
	}, {
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
	}, {
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
	}, {
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
	}];
});