myApp.service('writeService', function ($q, configService) {
    const db = firebase.database();
    var writeServiceFunctions = {
        addPawnee: function (data) {
            return $q(function (resolve, reject) {
                var ref = db.ref('pawnees')
                ref.push(data)
                    .then(function (key) {
                        resolve(key)
                        console.log(key)
                        console.log(key.key)
                    }, function (error) {
                        console.log(error)
                        reject(error)
                    })
            })
        },
        addItem: function (data) {
            return $q(function (resolve, reject) {
                var ref = db.ref('items')
                data.dateCreated = new Date().toISOString();
                data.timeCreated = new Date().getTime()
                data.status = 'PAWNED'
                ref.push(data)
                    .then(function (key) {
                        resolve(key)
                        console.log(key)
                        console.log(key.key)
                    }, function (error) {
                        console.log(error)
                        reject(error)
                    })
            })
        },
        returnItem: function (data,key) {
            return $q(function (resolve, reject) {
                var ref1 = db.ref('items/'+key);
                ref1.remove()
                .then(function(resolved){
                var ref = db.ref('returned-items/'+key)
                data.dateCreated = new Date().toISOString();
                data.timeCreated = new Date().getTime()
                data.status = 'returned'
                ref.set(data)
                    .then(function (key) {
                        resolve(key)
                        console.log(key)
                        console.log(key.key)
                    }, function (error) {
                        console.log(error)
                        reject(error)
                    })
                })
            })
        },
        setConfig: function (data) {
            return $q(function (resolve, reject) {
                var ref = db.ref('config')
                ref.set(data)
                    .then(function (key) {
                        resolve(key)
                    }, function (error) {
                        console.log(error)
                        reject(error)
                    })
            })
        },
        
    }
    return writeServiceFunctions;
})