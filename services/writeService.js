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