var myApp = angular.module('myApp',
  [
    'ngMaterial',
    'ui.router',
    'firebase',
    'ngSanitize'
  ]
).run(function ($rootScope, $state, configService) {
  firebase.initializeApp(configService.config());
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('COOOL')
    }
  });
})


myApp.config(function ($stateProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('blue');

  var loginState = {
    name: 'login',
    url: '/',
    templateUrl: '/modules/login/login.html',
    controller: 'loginController'
  }
  var aboutState = {
    name: 'about',
    url: '/about',
    templateUrl: '<h3>Its the UI-Router hello world app!</h3>'
  }
  var main = {
    name: 'main',
    url: '/main',
    templateUrl: '/modules/maincontent/main.html'
  }

  var pawnees = {
    name: 'pawnees',
    url: '/pawnees',
    templateUrl: '/modules/view-pawnees/view-pawnee.html',
    controller: 'viewPawneeController'
  }

  var items = {
    name: 'items',
    url: '/items',
    templateUrl: '/modules/view-items/view-items.html',
    controller: 'viewItemsController'
  }
  $stateProvider.state(items);
  $stateProvider.state(pawnees);
  $stateProvider.state(main);
  $stateProvider.state(loginState);
  $stateProvider.state(aboutState);
});