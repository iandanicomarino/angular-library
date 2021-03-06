myApp.controller('addItemsController',
  function ($q,$scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService, readService) {

    $scope.default = {};
    $scope.default.categories = ['Jewelry','Gadget','Property','Custom'] 
    $scope.default.idTypes = ['AFP ID',"Driver's License",'GSIS ID','NBI Clearance','Passport','Postal ID','PRC ID',"School ID",'SSS ID',"Seaman's Book",'UMID','Voters ID',] 
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
        item.owner.dateOfBirth = new moment(item.owner.dateOfBirth).toISOString(); 
        item.expiryDate = new moment().add(storeConfig.expiryDate,'days').toISOString();
        item.sentANotification = false;
        writeService.addItem(item)
        .then(function(data){
            configService.showToast('Added an item to the inventory')
            $mdDialog.hide();
        })
    }

  }
)