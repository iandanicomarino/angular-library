myApp.controller('viewItemsController',
    function ($scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        // init();

        var db = firebase.database()

        readService.items()
        .then(function(data){
            console.log(data);
            $scope.items = data
        })
    }
)