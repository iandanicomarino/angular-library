myApp.controller('addPawneeController',
  function ($scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService) {
    $scope.addUser = function (user) {
      writeService.addPawnee(user)
        .then(function (key) {
          configService.showToast('Added a Pawnee')
          $mdDialog.hide();
        }).catch(function (error) {
          console.log(error)
        })
    }
  }
)