var app = angular.module('fellow_app', []);

app.controller('fellow_controller', function($scope) {
	$scope.fellows = ['James York', 'Alex Suriano', 'Cam Herringshaw', 'Major Sapp'];
});

app.directive('fellowCard', function() {
	return {
		replace: true,
		templateUrl: '/src/views/partials/fellow_card.html'
	};
});