myApp.controller('addItemsController',
  function ($q,$scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService, readService) {

    $scope.default = {};
    $scope.default.categories = ['Jewelry','Gadget','Property','Custom'] 
    var appraisalPercentage = 0;
    var storeConfig = {};
    readService.config()
    .then(function (data){
        storeConfig = data;
        appraisalPercentage = data.appraisalPercentage
    })

    $scope.$watch('item.valuation', function(newValue,oldValue){
        console.log(appraisalPercentage)
        if(newValue){
            $scope.item.pawnValue = newValue * appraisalPercentage/100;
        }else{
            $scope.item.pawnValue = 0;
        }
    })

    $scope.addItems = function (item) {
        item.expiryDate = new moment().add(storeConfig.expiryDate,'days').toISOString();
        writeService.addItem(item)
        .then(function(data){
            configService.showToast('Added an item to the inventory')
            $mdDialog.hide();
        })
    }

  }
)