'use strict';

angular.module('mean.system').controller('IndexController', ['$scope','$http', 'Global', function ($scope, $http, Global) {
	$scope.global = Global;

	$scope.alerts = [
		{ type: 'warning', msg: 'This site is under development, use at your own risk.' }
	];

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.vaults = [];

	$http.get('/vaults')
		.success(function (data){

		$scope.vaults = data;
	});
}]);