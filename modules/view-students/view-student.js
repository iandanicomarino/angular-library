myApp.controller('viewStudentController',
    function ($rootScope, $scope, $timeout, $mdSidenav, $log, readService, $mdDialog, configService) {
        init();

        var db = firebase.database()

        var ref = db.ref('students')

        ref.on("child_changed", function (snapshot) {
            init();
        });

        function init() {
            readService.students()
                .then(function (students) {
                    console.log(students)
                    $scope.students = students;
                })
        }

        $scope.showViewStudentDialog = function (ev, student, key) {
           
            

            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/modules/view-students/view-student-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
                 var args = { student: student, key: key }
            // $rootScope.$broadcast('show-student', args);

        }

        function DialogController($scope, $mdDialog) {
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
    })