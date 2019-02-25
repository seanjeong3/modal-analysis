"use strict";

var ModalAnalysisApp = angular.module('ModalAnalysisApp', ['ngRoute','ngMaterial', 'ngResource']);

ModalAnalysisApp.controller('MainController', ['$scope', '$rootScope', '$location', '$resource', '$http',
    function($scope, $rootScope, $location, $resource, $http) {

	$scope.dof = '2';
	$scope.m = '[1,1]';
	$scope.k = '[1,1]';
	$scope.modalProperty = '';

	$scope.getModalProperties = function() {
		var url = 'http://localhost:3000/modal_analysis?';
		url = url + 'dof=' + $scope.dof + '&';
		url = url + 'm=' + $scope.m + '&';
		url = url + 'k=' + $scope.k;
		$scope.modalProperty = '';
		
		$scope.FetchModel(url, function(model) {
            console.log(model);
            $scope.$apply(function() {
                $scope.modalProperty = model;
            });
        });

	};

	$scope.FetchModel = function(url, doneCallback) {
		var xhr = new XMLHttpRequest();
		function xhrHandler() {
			if (xhr.readyState !== 4) {
				return;
			};
			if (xhr.status !== 200) {
				console.log("error: " + xhr.status);
				return;
			};
			var model = JSON.parse(xhr.response);
			doneCallback(model);
			};
		xhr.onreadystatechange = xhrHandler;
		xhr.open("GET", url);
		xhr.send();
	};

}]);
