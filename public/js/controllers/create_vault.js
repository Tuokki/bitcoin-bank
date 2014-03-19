'use strict';

angular.module('mean.system').controller('CreateVaultController',
	['$scope', '$http', 'Global', function ($scope, $http, Global) {
	$scope.global = Global;

	$scope.minDate = ( $scope.minDate ) ? null : new Date();

	$scope.dateDifference = function () {
		if($scope.end_date !== undefined){
			return Math.floor(($scope.end_date.getTime() - $scope.minDate.getTime())/(1000*60*60*24)+1);
		}else{
			return 0;
		}
	};

	$scope.createVault = function () {

		/* jshint ignore:start */
		var ciphersAdded = false;
		var selectedCipherNames = new Array();
		var selectedCipherSources = new Array();

		var t = 0;
		if(document.getElementById('div1').childNodes.length == 1){
			selectedCipherNames[t] = document.getElementById('div1').innerHTML;
			t++;
			ciphersAdded = true;
		}

		if(document.getElementById('div2').childNodes.length == 1){
			selectedCipherNames[t] = document.getElementById('div2').innerHTML;
			t++;
			ciphersAdded = true;
		}		

		if(document.getElementById('div3').childNodes.length == 1){
			selectedCipherNames[t] = document.getElementById('div3').innerHTML;
			t++;
			ciphersAdded = true;
		}

		if(ciphersAdded){

			var p = 0;
			var n = 0;
   
    		while (selectedCipherNames[p]){
	   
	   			var k = 0;
	   			while(ciphers[k]){
		        	if(_.isEqual(ciphers[k].name.trim(), selectedCipherNames[p].trim()) == true){
		            	var source = _.clone(ciphers[k].source, true);
		            	selectedCipherSources[n] = source;
		            	n++;
		        	}
		        	k++;
	        	}

	        	p++;
			}
		}

		if(!ciphersAdded){
			$scope.error = 'You must add atleast one cipher algorithm';
			return;
		}

		if($scope.vault_name !== undefined && $scope.amount !== undefined &&
			$scope.end_date !== undefined && $scope.description !== undefined &&
			$scope.location !== undefined && ciphersAdded){

			// tallenna tietokantaan
		 	 $http.post('/save_vault', {'vault_name': $scope.vault_name, 
		 	 	'amount': $scope.amount, 
		 	 	'end_date': $scope.end_date,
		 	 	'location': $scope.location,
		 	 	'ciphers' : selectedCipherSources})
		 	 	.success(function(data, status, headers, config) {
					console.log('success');
				}).error(function(data, status) { // called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('fail');
				});

		 	console.log(user);

			$scope.error = '';
			$scope.message = 'Vault created successfully!';
		}else{
			$scope.message = '';
			$scope.error = 'Fill all required fields';
		}

		/* jshint ignore:end */
	};
}]);