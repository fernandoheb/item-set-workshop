'use strict';

angular.module('iswApp.welcome', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'welcome/welcome.html',
    controller: 'WelcomeController'
  });
}])

.controller('WelcomeController', [function() {
  // Nothing to be added here yet
}]);