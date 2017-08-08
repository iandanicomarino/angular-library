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



myApp.service('PrintPagesCtrl', function () {
    var printpage = {
        print: function (div) {
            console.log(div)
          	angular.element(document).ready(function () {	
              var originalTitle = document.title;
              printpage.printElement(document.getElementById(div));
              window.print();
            });
        },
        printElement : function (elem, append, delimiter) {
					var domClone = elem.cloneNode(true);
					var $printSection = document.getElementById("printSection");
					if (!$printSection) {
						var $printSection = document.createElement("div");
						$printSection.id = "printSection";
						document.body.appendChild($printSection);
					}

					if (append !== true) {
						$printSection.innerHTML = "";
					}

					else if (append === true) {
						if (typeof(delimiter) === "string") {
							$printSection.innerHTML += delimiter;
						}
						else if (typeof(delimiter) === "object") {
							$printSection.appendChlid(delimiter);
						}
					}

					$printSection.appendChild(domClone);
				}
    }
    return printpage;
})