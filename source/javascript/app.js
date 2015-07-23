var app = angular.module('fellow_app', []);

app.controller('fellow_controller', function($scope) {
	$scope.fellows = ['James York', 'Alex Suriano', 'Cam Herringshaw', 'Major Sapp'];
});