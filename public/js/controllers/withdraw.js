'use strict';

angular.module('mean.system').controller('WithdrawController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
    $scope.global = Global;

    // TÄSSÄ ON TIETOTURVA-AUKKO
    // koska tämä koodi on kaikkien nähtävissä
    // lisää req.user tarkistukset palvelimen päähän
    $scope.makeWithdraw = function () {
		if($scope.address !== undefined && $scope.amount !== undefined){
			$http.get('/send/' + Global.user.username + '/'+
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