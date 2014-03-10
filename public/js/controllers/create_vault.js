'use strict';

angular.module('mean.system').controller('CreateVaultController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
	$scope.global = Global;

	$scope.createVault = function () {

		if($scope.vault_name !== undefined && $scope.amount !== undefined){
			$scope.message = 'Vault successfully created!';
		}else{
			$scope.error = 'Fill all required fields';
		}
	};
}]);