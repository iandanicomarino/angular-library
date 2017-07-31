myApp.controller('viewItemsController',
    function ($scope, $rootScope, $timeout, $mdToast, $mdSidenav, $log, readService, $mdDialog, configService, writeService) {
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
                            $scope.items = data
                        })
                    readService.returnedItems()
                        .then(function (data) {
                            $scope.returneditems = data
                        })
                })

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


        $scope.returnItem = function (ev, item, key) {
            console.log(item)
            var now = new moment();
            var timecreated = new moment(item.dateCreated);
            var daysOnHand = now.diff(timecreated,'days');
            console.log(daysOnHand);
            var buyBackValue = item.pawnValue + (item.pawnValue * (storeConfig.defaultInterestPercentage/100) * Math.max(daysOnHand/storeConfig.expiryDate))
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

                $scope.invalidAmount = false;
            }, function () {
                $scope.status = 'You didn\'t name your dog.';
            });
        };

        $scope.extendDate = function (ev) {
            var confirm = $mdDialog.prompt()
                .title('Extend Date')
                .htmlContent("<p>Enter Amount.<p>")
                .placeholder('0.00')
                .ariaLabel('Amount')
                .initialValue('0.00')
                .targetEvent(ev)
                .ok('Return Item')
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
                }
                $scope.invalidAmount = false;
            }, function () {
                $scope.status = 'You didn\'t name your dog.';
            });
        };


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