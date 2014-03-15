'use strict';

angular.module('mean.system').controller('CreateVaultController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
	$scope.global = Global;

	$scope.minDate = ( $scope.minDate ) ? null : new Date();

	$scope.dateDifference = function () {
		if($scope.end_date !== undefined){
			return Math.floor(($scope.end_date.getTime() - $scope.minDate.getTime())/(1000*60*60*24));
		}else{
			return 0;
		}
	};

	$scope.createVault = function () {

		if($scope.vault_name !== undefined && $scope.amount !== undefined){
			$scope.message = 'Vault successfully created!';
		}else{
			$scope.error = 'Fill all required fields';
		}
	};
}]);