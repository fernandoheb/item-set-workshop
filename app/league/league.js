'use strict';

angular.module('iswApp.league', ['ngResource'])

.factory('leagueData', ['$resource', function($resource) {
  return {
    dragonVersion: $resource('/api/dragonVersion', {}, {get: {method: 'GET', cache: true}}),
    champions: $resource('/api/champions', {}, {get: {method: 'GET', cache: true}})
  }
}]);