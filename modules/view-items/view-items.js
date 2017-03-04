myApp.controller('viewItemsController',
    function ($scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        init();

        var db = firebase.database()

        var ref = db.ref('items')

        ref.on("child_changed", function(snapshot) {
            init();
        });

        function init() {
            readService.items()
                .then(function (items) {
                    console.log(items)
                    $scope.items = items;
                })
        }
    }
)