myApp.service('readService', function($q,configService){
    const db = firebase.database();
    var readServiceFunctions = {
        students : function(user){
            return $q(function(resolve,reject){
                var ref = db.ref('students')
                ref.once('value')
                .then(function(snapshot){
                    resolve(snapshot.val());
                },function(error){
                    reject(error)
                })
            })
        }
    }
    return readServiceFunctions;
})