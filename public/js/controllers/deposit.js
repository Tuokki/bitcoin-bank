'use strict';

angular.module('mean.system').controller('DepositController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
    $scope.global = Global;

	$http.get('/generate/' + Global.user.username)
		.success(function (data){

		$scope.paymentAddress = data;
	});

	$scope.loadData = function () {
		$http.get('/generate/' + Global.user.username).success(function(data) {
			$scope.paymentAddress = data;
		});
	};

}]);