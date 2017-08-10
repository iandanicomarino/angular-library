myApp.controller('viewConfigController',
  function ($rootScope,$q, $scope, $timeout, $mdSidenav, $log, writeService, readService, $mdDialog, configService, $mdTheming) {


    readService.config()
    .then(function(data){
      console.log(data);
      $scope.config = data;
    })

    $scope.default = {};
    $scope.default.colors = ["red","green","blue","orange","yellow"] 

    $scope.saveConfig = function () {
      console.log('triggered')
      writeService.setConfig($scope.config)
        .then(function (data) {
          $rootScope.$broadcast('theme-change', $scope.config.primary);
          configService.showToast('Configuration Set')
          $mdDialog.hide();
        })
    }

  }
)