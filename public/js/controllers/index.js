'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.num = 2;
    $scope.multiply = function(value){ return value * 2; };
}]);