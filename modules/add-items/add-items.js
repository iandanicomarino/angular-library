myApp.controller('addItemsController',
  function ($q,$scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService) {

    $scope.addItems = function (item,copy) {
        console.log(item,copy)
        var promises = [];
        for(var i = 0; i<copy ; i++){
            promises.push(writeService.addItem(item))
        }
        $q.all(promises)
        .then(function(keys){
            console.log(keys)
            if(copy==1){
                configService.showToast('Added a Item')
            }else{
                 configService.showToast('Added multiple copies of a item')
            }
            
            
            $mdDialog.hide();
        })
    }

  }
)