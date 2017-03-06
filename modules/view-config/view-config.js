myApp.controller('viewConfigController',
  function ($q,$scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService) {

    $scope.saveConfig = function () {
        writeService.setConfig($scope.config)
        .then(function(data){
             configService.showToast('Configuration Set')            
            $mdDialog.hide();
        })
    }

  }
)