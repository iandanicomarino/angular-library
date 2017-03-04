myApp.controller('viewPawneeController',
    function ($scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        init();

        var db = firebase.database()

        var ref = db.ref('pawnees')

        ref.on("child_changed", function(snapshot) {
            init();
        });

        function init() {
            readService.pawnees()
                .then(function (pawnees) {
                    console.log(pawnees)
                    $scope.pawnees = pawnees;
                })
        }
    }
)