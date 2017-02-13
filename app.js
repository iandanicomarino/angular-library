var myApp = angular.module('myApp', 
    [
        'ngMaterial',
        'ui.router'
    ]
)

myApp.config(function($stateProvider) {
  var loginState = {
    name: 'login',
    url: '/',
    templateUrl: '/modules/login/login.html',
    controller:'loginController'
  }
  var aboutState = {
    name: 'about',
    url: '/about',
    templateUrl: '<h3>Its the UI-Router hello world app!</h3>'
  }

  $stateProvider.state(loginState);
  $stateProvider.state(aboutState);
});