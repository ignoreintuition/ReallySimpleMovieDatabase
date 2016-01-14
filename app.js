'use strict';
var api_key = ''; // enter your TheMovieDB API Key

(function(){ 
	var app = angular.module('myApp', [
		'ngRoute',
		'myApp.view1',
		'myApp.view2',
		'myApp.version'
		]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/view1'});
	}],
	['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	}]);

	var items = [];
	app.directive( 'backButton', function() {
	    return {
	        restrict: 'A',
	        link: function( scope, element, attrs ) {
	            element.on( 'click', function () {
	                history.back();
	                scope.$apply();
	            } );
	        }
	    };
	} );

	app.controller('MovieController', function(savedSearch){
		this.movies = savedSearch.get();
	});

	app.factory('savedSearch', function() {
	 var searchString = [];
	 function set(data) {
	   searchString = data;
	 }
	 function get() {
	  return searchString;
	 }

	 return {
	  set: set,
	  get: get
	 }

	});
	app.controller('ParseQueryStringController', function($scope, $location, $window, $http, savedSearch){
		$scope.myQs = $location.search();
		var jsonString = "https://api.themoviedb.org/3/movie/"+$scope.myQs.id+"?api_key="+api_key+"&language=en&append_to_response=releases,trailers&include_image_language=en";
		$http.get(jsonString).then(function(results){
			$scope.moviesDtlItem = results.data;
			console.log(savedSearch.get())
		});

	});

	app.controller('SearchController', function($scope, $http, savedSearch){
		this.search='';
		this.performSearch = function(movieList) {
			var jsonString = "http://api.themoviedb.org/3/search/movie?api_key="+api_key+"&query="+this.search+"&append_to_response=runtime";
			$http.get(jsonString).success(function(data){
				movieList.movies = data.results;
				savedSearch.set(data.results);
			});
		};
	});
})();
