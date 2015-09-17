'use strict';

// Declare app level module which depends on views, and components
// Normally each view is declared in its own module
angular.module('iswApp', [
  'ngRoute',
  'ngMaterial',

  'iswApp.welcome',
  'iswApp.sidenav',
  'iswApp.searchplayer',
  'iswApp.matchhistory',

  'myApp.view1',
  'myApp.view2',
  'myApp.version'
])

// Routes main configuration
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}])

// Config Angular Material Theming
.config(['$mdThemingProvider', function($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .dark()
    .primaryPalette('teal')
    .backgroundPalette('grey', {default: '900'});
}])

// Define application level controller
.controller('AppController', ['$scope', '$location', function($scope, $location) {
  // The sidenav menu structure
  $scope.menu = [
    {
      name: 'Introduction',
      route: '/',
      hide: true
    },
    {
      name: 'Search by Player',
      route: '/searchplayer'
    },
    {
      name: 'Search by Match ID',
      route: '/searchmatch'
    },
    {
      name: 'About',
      route: '/about'
    }
  ];

  $scope.getTitle = function() {
    var i, top = $scope.menu.length;
    for (i=0; i<top; i++) {
      var item = $scope.menu[i];
      if (item.route === $location.path()) return item.name;
    }
  };
}]);