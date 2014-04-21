'use strict';

angular.module('mean.system').controller('CreateVaultController',
	['$scope', '$http', '$location', 'Global', function ($scope, $http, $location, Global) {
	$scope.global = Global;

	var today = new Date();
	var tomorrow = new Date();
	tomorrow.setDate(today.getDate()+1);

	$scope.minDate = ( $scope.minDate ) ? null : tomorrow;

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.dateDifference = function () {
		if($scope.end_date !== undefined){
			return Math.floor(($scope.end_date.getTime() - $scope.minDate.getTime())/(1000*60*60*24)+2);
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
		 	 	'description': $scope.description,
		 	 	'ciphers' : selectedCipherSources})
		 	 	.success(function(data, status, headers, config) {
					console.log('success');
					$scope.error = '';
					$scope.message = 'Vault created successfully!';
					$location.path('/');
				}).error(function(data, status) { // called asynchronously if an error occurs
					// or server returns response with an error status.

					if(status == 500){
						$scope.error = 'Cipher function error, you may have to reload the whole page.';
					}else{
						$scope.error = data;
					}

					console.log('fail');
					$scope.message = '';
					
				});

		 	console.log(user);

			
		}else{
			$scope.message = '';
			$scope.error = 'Fill all required fields';
		}

		/* jshint ignore:end */
	};
}]);

