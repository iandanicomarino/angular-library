myApp.controller('viewItemsController',
    function ($scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        init();

        var db = firebase.database()

        var ref = db.ref('items')

        ref.on("child_changed", function(snapshot) {
            init();
        });

    }
)