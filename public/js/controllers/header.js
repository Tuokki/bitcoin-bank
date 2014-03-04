'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$http', 'Global', function ($scope, $http, Global) {
    $scope.global = Global;

    $scope.isCollapsed = false;

    $scope.refreshBalance = function() {

    	$scope.loading = true;

		$http.get('/users/me').success(function(data) {
			$scope.global.user.balance = data.balance;
			$scope.loading = false;
		});
	};
}]);