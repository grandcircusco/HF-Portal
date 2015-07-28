var app = angular.module('app');

app.controller('FellowController', ['$scope', '$modal', function($scope, $modal) {
	$scope.fellows = [
		{ "name": "Fellow 1" },
        { "name": "Fellow 2" },
        { "name": "Fellow 3" },
        { "name": "Fellow 4" },
        { "name": "Fellow 5" },
        { "name": "Fellow 6" }
	];
}]);

app.directive('fellowView', function() {
	return {
		restrict: 'AE',
		replace: true,
		template: '<h1>Hello World Fellows</h1>'
	};
});