var app = angular.modal('directivesModule', []);

app.controller('viewController', function($scope){

});

app.directive('companyView', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl:'company_template.html'
	};

});

