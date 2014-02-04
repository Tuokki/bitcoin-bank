'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.num = 2;
    $scope.multiply = function(value){ return value * 2; };
}]);

//- Drag and drop kokeilu

//- http://logicbomb.github.io/ng-directives/drag-drop.html

//- http://wterminal.appspot.com/demo