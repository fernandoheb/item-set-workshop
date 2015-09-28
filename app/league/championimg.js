'use strict';

angular.module('iswApp.league')

.directive('iwsChampionImg', ['$q', 'leagueData', function($q, leagueData) {
  //noinspection JSUnusedLocalSymbols
  function link(scope, element, attrs) {
    // Get dragon version and champions...
    $q.all([
      leagueData.dragonVersion.get({region: scope.region}).$promise,
      leagueData.champions.get().$promise
    ]).then(function(data) {
      var version = data[0].version;
      var champions = data[1];

      // And then set the source based on the type
      switch (attrs.type) {
        default:
        case 'square':
          scope.imgSource = 'http://ddragon.leagueoflegends.com/cdn/' + version + '/img/champion/' + champions[scope.championId] + '.png';
          break;
        // TODO CASES WITH SPLASH AND LOADING SCREEN
      }
    });
  }

  return {
    scope: {
      championId: '=',
      region: '='
    },
    templateUrl: 'matchhistory/championimg.html',
    link: link
  };
}]);