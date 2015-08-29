'use strict';

angular.module('iswApp.searchplayer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/searchplayer', {
    templateUrl: 'searchplayer/searchplayer.html',
    controller: 'SearchPlayerController'
  });
}])

.controller('SearchPlayerController', [function() {
  // Nothing to be added yet
}]);