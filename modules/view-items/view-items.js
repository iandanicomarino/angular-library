myApp.controller('viewItemsController',
    function ($q, $scope, $rootScope, $timeout, $mdToast, $mdSidenav, $log, readService, $mdDialog, configService, writeService, PrintPagesCtrl) {
        // init();

        var db = firebase.database()
        var storeConfig = {}
        var original = {};

        init();

        function init() {
            $scope.loading = true;
            readService.config()
                .then(function (config) {
                    $scope.loading = false;
                    storeConfig = config
                    readService.items()
                        .then(function (data) {
                            $scope.items = transferToSellable(data)
                            original.items = $scope.items;
                            console.log($scope.items)
                        })
                    readService.returnedItems()
                        .then(function (data) {
                            $scope.returneditems = data;
                            original.returneditems = $scope.returneditems;
                        })
                    readService.soldItems()
                        .then(function (data) {
                            $scope.soldItems = data;
                            original.soldItems = $scope.soldItems;
                        })
                })
        }

       $scope.print = function (div, item, key){
           $scope.selectedKey = key;
           $scope.selectedItem = item;
           console.log(div);
           PrintPagesCtrl.print(div)
       }


        $scope.search = function (query, which) {
            switch (which) {
                case "pawnedItems":
                    if (query == '' || query == undefined) {
                        $scope.items = original.items;
                    } else {
                        $scope.items = searchQuery(original.items, query);
                    }
                    break;
                case "returnedItems":
                    if (query == '' || query == undefined) {
                        $scope.returneditems = original.returneditems;
                    } else {
                        $scope.returneditems = searchQuery(original.returneditems, query);
                    }
                    break;
                case "sellableItems":
                    if (query == '' || query == undefined) {
                        $scope.sellableItems = original.sellableItems;
                    } else {
                        $scope.sellableItems = searchQuery(original.sellableItems, query);
                    }
                    break;
                 case "soldItems":
                    if (query == '' || query == undefined) {
                        $scope.soldItems = original.soldItems;
                    } else {
                        $scope.soldItems = searchQuery(original.soldItems, query);
                    }
                    break;
            }
        }

        function searchQuery(object, query) {
            var query = query.toLowerCase();
            var object = angular.copy(object);
            for (var key in object) {
                var forreturn = false;
                if (key.toLowerCase().includes(query)){
                    forreturn = true;
                }
                for (var key2 in object[key]) {
                    if (typeof (object[key][key2]) == 'string') {

                        if (object[key][key2].toLowerCase().includes(query)) {
                            forreturn = true;
                        }
                    }
                }

                for (var key2 in object[key]['owner']) {
                    if (typeof (object[key]['owner'][key2]) == 'string') {
                        // console.log(object[key]['owner'][key2].toLowerCase());

                        if (object[key]['owner'][key2].toLowerCase().includes(query)) {
                            forreturn = true;
                        }
                    }
                }


                if (forreturn == false) {
                    delete object[key];
                }
            }
            return object;
        }

        function transferToSellable(items) {
            var forTransfer = [];

            for (var key in items) {
                var expiryDate = new Date(items[key].expiryDate);
                var dateNow = new Date()
                var dataForTranfer = {};
                if (expiryDate < dateNow) {
                    dataForTranfer.key = key;
                    dataForTranfer.data = items[key];
                    forTransfer.push(dataForTranfer);
                    console.log('delete' + items + key)
                    delete items[key];
                }
            }

            var promises = [];

            forTransfer.forEach(function (data) {
                promises.push(writeService.transferToSellable(data.data, data.key))
            })

            $q.all(promises)
                .then(function (resolved) {
                    var toast = $mdToast.simple()
                        .textContent('Transferred ' + resolved.length + ' items to sellable')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');

                    $mdToast.show(toast);
                })

            readService.sellableItems()
                .then(function (data) {
                    $scope.sellableItems = data;
                    original.sellableItems = $scope.sellableItems;
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

        $scope.sellItem = function (ev, item, key) {

            var confirm = $mdDialog.prompt()
                .title('Sell this item? ' + item.brand + ' ' + item.model)
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
                    } else {
                        item.soldAs = result;
                        var toast = $mdToast.simple()
                            .textContent('Sold Item @ PHP' + result)
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
            var daysOnHand = now.diff(timecreated, 'days');
            if (daysOnHand == 0) {
                daysOnHand++;
            }
            console.log(daysOnHand);
            var buyBackValue = item.pawnValue + (item.pawnValue * (storeConfig.defaultInterestPercentage / 100) * Math.ceil(daysOnHand / storeConfig.maturityDate))
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

        $scope.extendDate = function (ev, item, key) {
            var now = new moment();
            var timecreated = new moment(item.dateCreated);
            var daysOnHand = now.diff(timecreated, 'days');
            if (daysOnHand == 0) {
                daysOnHand++;
            }
            console.log(daysOnHand);
            var loanRenewalValue =(item.pawnValue * (storeConfig.defaultInterestPercentage / 100) * Math.ceil(daysOnHand / storeConfig.maturityDate))
            loanRenewalValue = Number((loanRenewalValue).toFixed(2))

            var confirm = $mdDialog.prompt()
                .title('Loan Renewal, Cost is PHP '+loanRenewalValue)
                .htmlContent("<p>Enter Amount.<p>")
                .placeholder('0.00')
                .ariaLabel('Amount')
                .initialValue('0.00')
                .targetEvent(ev)
                .ok('Extend Item')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (result) {
                $scope.amount = parseFloat(result);
                console.log(result);
                if (isNaN($scope.amount) || $scope.amount < loanRenewalValue) {
                    var toast = $mdToast.simple()
                        .textContent('Amount not valid please input as 0.00')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position('bottom left right');
                    $mdToast.show(toast);
                    $scope.invalidAmount = true;
                    $scope.extendDate(ev,item,key);
                } else {
                    console.log(item)
                    var newDateCreated = new Date().toISOString();
                    var newDate = new Date(moment(newDateCreated).add(storeConfig.expiryDate, 'days'))
                    item.expiryDate = newDate.toISOString();
                    item.dateCreated = newDateCreated;
                    writeService.editItem(item, key)
                        .then(function (data) {
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

        $scope.checkIfEmpty = function (obj) {
            if (obj == null || obj == undefined) {
                return true;
            }
            return Object.keys(obj).length == 0 ? true : false;
        }


        function viewItemDetails($scope, $mdDialog, item) {
            $scope.default = {};
            $scope.default.categories = ['Jewelry', 'Gadget', 'Property', 'Custom']
            $scope.default.idTypes = ['AFP ID',"Driver's License",'GSIS ID','NBI Clearance','Passport','Postal ID','PRC ID',"School ID",'SSS ID',"Seaman's Book",'UMID','Voters ID',] 
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