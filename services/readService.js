myApp.service('readService', function($q,configService){
    const db = firebase.database();
    var readServiceFunctions = {
        pawnees : function(user){
            return $q(function(resolve,reject){
                var ref = db.ref('pawnees')
                ref.once('value')
                .then(function(snapshot){
                    resolve(snapshot.val());
                },function(error){
                    reject(error)
                })
            })
        },
        items : function(user){
            return $q(function(resolve,reject){
                var ref = db.ref('items')
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