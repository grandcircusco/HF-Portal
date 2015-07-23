var app = angular.module('directivesModule', ['ui.bootstrap']);

app.controller('viewController', function($scope, $modal){

	$scope.companies = [

		{ "name": "Company 1" },
		{ "name": "Company 2" },
		{ "name": "Company 3" },
		{ "name": "Company 4" },
		{ "name": "Company 5" },
		{ "name": "Company 6" }

	];


	$scope.openModal = function (company) {

		var modalInstance = $modal.open({

			templateUrl: 'company_detail_modal_template.html',
			controller: 'ModalInstanceCtrl',
			size: 'lg'

		});

		//modalInstance.result.then(function (selectedItem) {
		//	$scope.selected = selectedItem;
		//}, function () {
		//	$log.info('Modal dismissed at: ' + new Date());
		//});
	};



});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

	//$scope.companies = companies;
	//$scope.selected = {
	//	item: $scope.companies[0]
	//};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});


app.directive('companyView', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl:'company_detail_view_template.html'
	};

});


