'use strict';

angular.module('iswApp.matchhistory', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/matchhistory', {
    templateUrl: 'matchhistory/matchhistory.html',
    controller: 'MatchHistoryController'
  });
}])

.controller('MatchHistoryController', ['$scope', '$resource', '$routeParams', function($scope, $resource, $routeParams) {
  var matchHistory = $resource('/api/matchHistory');
  $scope.matchesData = matchHistory.get({summoner: $routeParams.summoner, region: $routeParams.region});

}]);