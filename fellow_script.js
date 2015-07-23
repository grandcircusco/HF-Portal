var app = angular.module('fellow_app', []);

app.controller('fellow_controller', function($scope) {
	$scope.fellows = [{
		name: 'James York'
	}, {
		name: 'Alex Suriano'
	}, {
		name: 'Cam Herringshaw'
	}, {
		name: 'Major Sapp'
	}];
});

app.directive('fellowCard', function() {
	return {
		replace: true,
		scope: true,
		templateUrl: '/src/views/partials/fellow_card.html'
	};
});