'use strict';

angular.module('mean.system').controller('WithdrawController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
    $scope.global = Global;

    $scope.makeWithdraw = function () {
		if($scope.address !== undefined && $scope.amount !== undefined){
			$http.get('/send/' +
				$scope.address + '/'+
				$scope.amount).success(function(data) {
					if(data.indexOf('Error') !== -1){
						$scope.error = data;
					}else{
						$scope.message = data;
					}
				});
		}else{
			$scope.error = 'Both fields are mandatory';
		}
	};
}]);