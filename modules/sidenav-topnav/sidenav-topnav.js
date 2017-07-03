myApp.controller('topBarController',
  function ($scope, $timeout, $mdSidenav, $log, $mdDialog) {
    $scope.showAdvanced = function (ev) {
      if (ev == "addPawnee") {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: '/modules/add-pawnee/add-pawnee.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
          .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      if (ev == "addItems") {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: '/modules/add-items/add-items.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
          .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            $scope.status = 'You cancelled the dialog.';
          });
      }
      if (ev == 'addConfig') {
         $mdDialog.show({
          controller: DialogController,
          templateUrl: '/modules/view-config/view-config.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true // Only for -xs, -sm breakpoints.
        })
          .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            $scope.status = 'You cancelled the dialog.';
          });

      }
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function () {
        $mdDialog.hide();
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }
    $scope.toggleSidebar = buildDelayedToggler('left')

    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function () {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    function buildDelayedToggler(id) {
      return debounce(function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(id)
          .toggle()
          .then(function () {
            $log.debug("toggle " + id + " is done");
          });
      }, 200);
    }

  }
)