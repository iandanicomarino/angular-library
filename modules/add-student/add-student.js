myApp.controller('addStudentController',
  function ($scope, $timeout, $mdSidenav, $log, writeService) {
    $scope.addUser = function(user){
      console.log(user)
      writeService.addStudent(user)
      .then(function(key){
        console.log(key)
      }).catch(function(error){
        console.log(error)
      })
    }
  }
)