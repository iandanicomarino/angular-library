myApp.controller('viewConfigController',
  function ($q, $scope, $timeout, $mdSidenav, $log, writeService, readService, $mdDialog, configService) {


    readService.config()
    .then(function(data){
      console.log(data);
      $scope.config = data;
    })


    $scope.saveConfig = function () {
      console.log('triggered')
      writeService.setConfig($scope.config)
        .then(function (data) {
          configService.showToast('Configuration Set')
          $mdDialog.hide();
        })
    }

  }
)