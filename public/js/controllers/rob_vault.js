'use strict';

angular.module('mean.system').controller('RobVaultController',
	['$scope', '$http', '$location', '$timeout', 'Global',
	function ($scope, $http, $location, $timeout, Global) {

    $scope.global = Global;

    $scope.crypted_password = 'Loading...';
    $scope.vault_name = $location.$$search.vault;

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
						}else if(data.indexOf('cracked') !== -1){

							$scope.message = data;
							$scope.error = '';

							$timeout(function(){
								$location.path('/'); 
							},2000);
							
						}else{
							$scope.message = 'Vault did not open: ' + data;
							$scope.error = '';
						}
					});
			}else{
				$scope.error = 'Password length is too short';
				$scope.message = '';
			}
		}else{
			$scope.error = 'All fields are mandatory';
			$scope.message = '';
		}
	};

}]);