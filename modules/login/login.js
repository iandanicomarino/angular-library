myApp.controller('loginController', 
function($scope, $q, $state){
    
    $scope.user = {};

    $scope.login= function(user){
        console.log($state)
        console.log(user);
    }

}
)