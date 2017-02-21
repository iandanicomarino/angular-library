myApp.controller('viewBooksController',
    function ($scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        init();

        var db = firebase.database()

        var ref = db.ref('books')

        ref.on("child_changed", function(snapshot) {
            init();
        });

        function init() {
            readService.books()
                .then(function (books) {
                    console.log(books)
                    $scope.books = books;
                })
        }
    }
)