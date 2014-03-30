'use strict';

angular.module('mean.system').controller('RobVaultController',
	['$scope', '$http', '$location', 'Global',
	function ($scope, $http, $location, Global) {

    $scope.global = Global;

    $scope.crypted_password = 'Loading...';

    $http.get('/get_vault_crypted_password/' + $location.$$search.vault)
		.success(function (data){

		$scope.crypted_password = data;
		var splitArray = data.split(' ');
		$scope.len1 = splitArray[0].length;
		$scope.len2 = splitArray[1].length;
		$scope.len3 = splitArray[2].length;
	});

	$scope.robVault = function () {
		if($scope.text1 !== undefined && $scope.text2 !== undefined &&
			$scope.text3 !== undefined){

			$scope.guess = $scope.text1 + ' ' + $scope.text2 + ' ' + $scope.text3;

			if($scope.text1.length === $scope.len1 &&
				$scope.text2.length === $scope.len2 &&
				$scope.text3.length === $scope.len3) {

				$http.get('/guess/' +
					$location.$$search.vault + '/'+
					$scope.guess).success(function(data) {
						if(data.indexOf('Error') !== -1){
							$scope.error = data;
						}else{
							$scope.message = data;
							$scope.error = '';
						}
					});
			}else{
				$scope.error = 'Give all fields maximum number of chars';
				$scope.message = '';
			}
		}else{
			$scope.error = 'All fields are mandatory';
			$scope.message = '';
		}
	};

}]);