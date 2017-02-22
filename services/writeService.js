myApp.service('writeService', function($q,configService){
    const db = firebase.database();
    var writeServiceFunctions = {
        addStudent : function(data){
            return $q(function(resolve,reject){
                var ref = db.ref('students')
                ref.push(data)
                .then(function(key){
                    resolve(key)
                    console.log(key)
                    console.log(key.key)
                },function(error){
                    console.log(error)
                    reject(error)
                })
            })
        },
        addBook : function(data){
            return $q(function(resolve,reject){
                var ref = db.ref('books')
                ref.push(data)
                .then(function(key){
                    resolve(key)
                    console.log(key)
                    console.log(key.key)
                },function(error){
                    console.log(error)
                    reject(error)
                })
            })
        },
         editStudent : function(data,key){
            return $q(function(resolve,reject){
                var ref = db.ref('students/'+key)
                ref.set(data)
                .then(function(key){
                    resolve(key)
                    console.log(key)
                    console.log(key.key)
                },function(error){
                    console.log(error)
                    reject(error)
                })
            })
        },
        
    }
    return writeServiceFunctions;
})