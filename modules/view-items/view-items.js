myApp.controller('viewItemsController',
    function ($scope,$rootScope,$timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        // init();

        var db = firebase.database()

        readService.items()
        .then(function(data){
            console.log(data);
            $scope.items = data
        })

        $scope.default = {};
        $scope.default.categories = ['Jewelry','Gadget','Property','Custom'] 

        $scope.showPrerenderedDialog = function(ev,item) {
            $scope.item = item;
            $scope.item = item
            $mdDialog.show({
            contentElement: '#myDialog',
            controller: DialogController,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
            });
        };


        $scope.viewItemDetails = function (item){
            $mdDialog.show({
            controller: DialogController,
            templateUrl: '/modules/view-items/view-items-details/view-details.html',
            parent: angular.element(document.body),
            targetEvent: 'view-details',
            clickOutsideToClose: true,
            fullscreen: true, // Only for -xs, -sm breakpoints.
            locals: {
                item: item,
                interestingideas: 'wow'
            }
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });            
            $rootScope.$broadcast('viewing_item_details', item);
        }

        function DialogController($scope, $mdDialog, interestingideas,item ) {
            $scope.default.categories = ['Jewelry','Gadget','Property','Custom'] 
            $scope.item = item;
            $scope.interestingideas = interestingideas;
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