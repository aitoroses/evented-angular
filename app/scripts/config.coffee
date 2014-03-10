
'use strict'

app = angular.module("ngEvented")

app.config [
  '$routeProvider'
  '$locationProvider'
  '$httpProvider'
  '$eventedProvider'
  ($routeProvider, $locationProvider, $httpProvider, $eventedProvider) ->
    
    $routeProvider.when("/",
      templateUrl: "templates/main.html"
      controller: 'mainCtrl as main'

    ).otherwise "/"

    $locationProvider.html5Mode true

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    # Server url configuration
    $eventedProvider.connect 'http://localhost:5000'

]


return
