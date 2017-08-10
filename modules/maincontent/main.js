myApp.controller('mainController',
  function ($rootScope,$q,$scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService, readService) {

    readService.config()
    .then(function(data){
      console.log(data);
      $scope.config = data;
        $rootScope.$broadcast('theme-change', $scope.config.primary);
    })

  }
)