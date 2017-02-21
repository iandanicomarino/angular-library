myApp.service('writeService', function($q,configService){
    const db = firebase.database();
    var writeServiceFunctions = {
        addStudent : function(user){
            return $q(function(resolve,reject){
                var ref = db.ref('students')
                ref.push(user)
                .then(function(key){
                    resolve(key)
                    console.log(key)
                    console.log(key.key)
                },function(error){
                    console.log(error)
                    reject(error)
                })
            })
        }
    }
    return writeServiceFunctions;
})