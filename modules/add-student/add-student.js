myApp.controller('addStudentController',
  function ($scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService) {
    $scope.addUser = function (user) {
      writeService.addStudent(user)
        .then(function (key) {
          configService.showToast('Added a Student')
          $mdDialog.hide();
        }).catch(function (error) {
          console.log(error)
        })
    }
  }
)