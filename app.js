var myApp = angular.module('myApp', 
    [
        'ngMaterial',
        'ui.router',
        'firebase'
    ]
).run(function( $rootScope,$state){
firebase.auth().onAuthStateChanged(function(user){
    if (user){
      console.log('COOOL')
    }
});
})

myApp.controller('topBarController', 
function($scope, $timeout, $mdSidenav, $log){
    
    $scope.toggleSidebar = buildDelayedToggler('left')

function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

function buildDelayedToggler(id) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(id)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

}
)

myApp.config(function($stateProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('green');

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
   var main = {
    name: 'main',
    url: '/main',
    templateUrl: '/modules/maincontent/main.html'
  }
  $stateProvider.state(main);
  $stateProvider.state(loginState);
  $stateProvider.state(aboutState);
});