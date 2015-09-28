'use strict';

angular.module('iswApp.matchhistory', ['ngRoute', 'ngResource', 'iswApp.league'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/matchhistory', {
    templateUrl: 'matchhistory/matchhistory.html',
    controller: 'MatchHistoryController'
  });
}])

.controller('MatchHistoryController', ['$scope', '$resource', '$routeParams', 'leagueData', function($scope, $resource, $routeParams, leagueData) {
  var matchHistory = $resource('/api/matchHistory');
  $scope.region = $routeParams.region;
  $scope.matchesData = matchHistory.get({summoner: $routeParams.summoner, region: $routeParams.region});
  $scope.champions = leagueData.champions.get();
}]);