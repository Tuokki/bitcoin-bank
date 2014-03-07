'use strict';

angular.module('mean.system').controller('CreateVaultController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
    $scope.global = Global;


    $scope.createVault = function () {
		if($scope.name !== undefined && $scope.amount !== undefined){
			$scope.message = 'success';
		}else{
			$scope.error = 'error';
		}
	};
}]);