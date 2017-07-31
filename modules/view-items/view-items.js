myApp.controller('viewItemsController',
    function ($q,$scope, $rootScope, $timeout, $mdToast, $mdSidenav, $log, readService, $mdDialog, configService, writeService) {
        // init();

        var db = firebase.database()
        var storeConfig ={}


        init();

        function init() {
            readService.config()
                .then(function (config) {
                    storeConfig = config
                    readService.items()
                        .then(function (data) {
                            $scope.items = transferToSellable(data)
                            console.log($scope.items)
                        })
                    readService.returnedItems()
                        .then(function (data) {
                            $scope.returneditems = data;
                        })
                    readService.soldItems()
                        .then(function (data) {
                            $scope.soldItems = data;
                        })

                })

        }

        function transferToSellable (items){
            var forTransfer = []; 

            for (var key in items){
                var expiryDate = new Date(items[key].expiryDate);
                var dateNow = new Date()
                var dataForTranfer = {};
                if(expiryDate < dateNow){
                    dataForTranfer.key = key;
                    dataForTranfer.data = items[key];
                    forTransfer.push(dataForTranfer);
                    console.log('delete'+items+key)
                    delete items[key];
                }
            }

            var promises = [];

            forTransfer.forEach(function(data){
                promises.push(writeService.transferToSellable(data.data,data.key))
            })

            $q.all(promises)
            .then(function(resolved){
                var toast = $mdToast.simple()
                        .textContent('Transferred '+ resolved.length+ ' items to sellable')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');

                $mdToast.show(toast);
            })

             readService.sellableItems()
             .then(function(data){
                 $scope.sellableItems = data;
             })
            return items;

        }


        $scope.default = {};
        $scope.default.categories = ['Jewelry', 'Gadget', 'Property', 'Custom']

        $scope.viewItemDetails = function (item) {
            $mdDialog.show({
                controller: viewItemDetails,
                templateUrl: '/modules/view-items/view-items-details/view-details.html',
                parent: angular.element(document.body),
                targetEvent: 'view-details',
                clickOutsideToClose: true,
                fullscreen: true, // Only for -xs, -sm breakpoints.
                locals: {
                    item: item,
                }
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }

        $scope.sellItem = function(ev,item,key){

             var confirm = $mdDialog.prompt()
                .title('Sell this item? '+item.brand + ' '+ item.model)
                .htmlContent("<p>Enter Amount.<p>")
                .placeholder('0.00')
                .ariaLabel('Amount')
                .initialValue('0.00')
                .targetEvent(ev)
                .ok('Sell Item')
                .cancel('Cancel');
            $mdDialog.show(confirm)
            .then(function (result) {
                if (isNaN(result)) {
                    var toast = $mdToast.simple()
                        .textContent('Amount not valid please input as 0.00')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');
                    $mdToast.show(toast);
                    $scope.invalidAmount = true;
                    $scope.sellItem(ev, item, key);
                } else{
                    item.soldAs = result;
                     var toast = $mdToast.simple()
                        .textContent('Sold Item @ PHP'+result)
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');
                    $mdToast.show(toast);
                    writeService.sellItem(item, key)
                    .then(function (data) {
                        init();
                    })
                }

            })

        }


        $scope.returnItem = function (ev, item, key) {
            console.log(item)
            var now = new moment();
            var timecreated = new moment(item.dateCreated);
            var daysOnHand = now.diff(timecreated,'days');
            if(daysOnHand == 0){
                daysOnHand++;
            }
            console.log(daysOnHand);
            var buyBackValue = item.pawnValue + (item.pawnValue * (storeConfig.defaultInterestPercentage/100) * Math.ceil(daysOnHand/storeConfig.expiryDate))
            buyBackValue = Number((buyBackValue).toFixed(2))

            var confirm = $mdDialog.prompt()
                .title('Does the owner want to get the item back? Buyback Value is PHP' + buyBackValue)
                .htmlContent("<p>Enter Amount.<p>")
                .placeholder('0.00')
                .ariaLabel('Amount')
                .initialValue('0.00')
                .targetEvent(ev)
                .ok('Return Item')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function (result) {
                $scope.amount = parseFloat(result);
                if (isNaN($scope.amount) || $scope.amount < item.pawnValue) {
                    var toast = $mdToast.simple()
                        .textContent('Amount not valid please input as 0.00')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');
                    $mdToast.show(toast);
                    $scope.invalidAmount = true;
                    $scope.returnItem(ev, item, key);
                } else {
                    item.buyBackValue = buyBackValue;
                    writeService.returnItem(item, key)
                        .then(function (data) {
                            init();
                        })
                }
            }, function () {
                $scope.status = 'You didn\'t name your dog.';
            });
        };

        $scope.extendDate = function (ev,item,key) {
            var confirm = $mdDialog.prompt()
                .title('Extend Date')
                .htmlContent("<p>Enter Amount.<p>")
                .placeholder('0.00')
                .ariaLabel('Amount')
                .initialValue('0.00')
                .targetEvent(ev)
                .ok('Extend Item')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (result) {
                $scope.amount = parseFloat(result);
                if (isNaN($scope.amount)) {
                    var toast = $mdToast.simple()
                        .textContent('Amount not valid please input as 0.00')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');
                    $mdToast.show(toast);
                    $scope.invalidAmount = true;
                    $scope.showPrompt();
                }else{
                    console.log(item)
                    var newDate = new Date(moment(item.expiryDate).add(storeConfig.expiryDate,'days'))
                    item.expiryDate = newDate.toISOString();
                    console.log(item.expiryDate)
                    writeService.editItem(item,key)
                    .then(function(data){
                         var toast = $mdToast.simple()
                            .textContent('Item expiry extended')
                            .highlightAction(true)
                            .highlightClass('md-accent')
                            .position('bottom left right');
                        $mdToast.show(toast);
                    })
                }
                
            }, function () {
                $scope.status = 'You didn\'t name your dog.';
            });
        };

        $scope.checkIfEmpty = function (obj){
            if (obj == null || obj == undefined){
                return true;
            }
            return Object.keys(obj).length == 0? true:false;
        }


        function viewItemDetails($scope, $mdDialog, item) {
            $scope.default = {};
            $scope.default.categories = ['Jewelry', 'Gadget', 'Property', 'Custom']
            $scope.item = item;
            console.log(item)

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
    }
)