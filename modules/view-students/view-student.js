myApp.controller('viewStudentController',
    function ($scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        init();

        var db = firebase.database()

        var ref = db.ref('students')

        ref.on("child_changed", function(snapshot) {
            init();
        });

        function init() {
            readService.students()
                .then(function (students) {
                    console.log(students)
                    $scope.students = students;
                })
        }
    }
)