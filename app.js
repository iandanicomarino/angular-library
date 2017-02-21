var myApp = angular.module('myApp',
  [
    'ngMaterial',
    'ui.router',
    'firebase'
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
    .primaryPalette('blue')
    .accentPalette('green');

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

  var students = {
    name: 'students',
    url: '/students',
    templateUrl: '/modules/view-students/view-student.html',
    controller: 'viewStudentController'
  }

  var books = {
    name: 'books',
    url: '/books',
    templateUrl: '/modules/view-books/view-books.html',
    controller: 'viewBooksController'
  }
  $stateProvider.state(books);
  $stateProvider.state(students);
  $stateProvider.state(main);
  $stateProvider.state(loginState);
  $stateProvider.state(aboutState);
});