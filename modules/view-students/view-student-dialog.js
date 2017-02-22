myApp.controller('editStudentController',
  function ($rootScope, $scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService) {


    $scope.$on('show-student', function (event, args) {
      console.log(args)
      $scope.selectedUser = args.student;
      $scope.activeStudentKey = args.key;
      $scope.$apply();
    });

    $scope.editUser = function (user, key) {
      writeService.editStudent(user, key)
        .then(function (key) {
          configService.showToast('Edited a Student')
          $mdDialog.hide();
        }).catch(function (error) {
          console.log(error)
        })
    }
  }
)