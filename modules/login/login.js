myApp.controller('loginController', 
function($scope, $q, $state){
    
    $scope.user = {};

    $scope.login= function(user){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(function(user){
            console.log(user);
            $state.go('main')
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        });
    }

}
)