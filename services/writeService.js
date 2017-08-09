myApp.service('writeService', function ($http,$q, configService) {
    const db = firebase.database();
    var writeServiceFunctions = {
        sendSMS: function(){
            $http.get('http://angular-pawnshop.herokuapp.com/').then(function(success){
                console.log(success);
            }, function(error){
                console.log(error);
            });
        },
        //http://localhost:1111/sendSMS?cellphone=639175471139&item=ipod%20classic&name=Ajahm%20Ganda
        //http://localhost:1111/sendEmail?email=nekomarino@gmail.com&item=ipod%20classic&name=Ajahm%20Ganda

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
        editItem: function (data, key) {
            return $q(function (resolve, reject) {
                var ref = db.ref('items/' + key)
                data.updatedAt = new Date().toISOString();
                data.status = 'PAWNED'
                ref.set(data)
                    .then(function (key) {
                        resolve()
                    }, function (error) {
                        console.log(error)
                        reject(error)
                    })
            })
        },
        transferToSellable: function (data, key) {
            return $q(function (resolve, reject) {
                var ref1 = db.ref('items/' + key);
                ref1.remove()
                    .then(function (resolved) {
                        var ref = db.ref('sellable-items/' + key)
                        data.dateCreated = new Date().toISOString();
                        data.timeCreated = new Date().getTime()
                        data.status = 'SELLABLE'
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
        returnItem: function (data, key) {
            return $q(function (resolve, reject) {
                var ref1 = db.ref('items/' + key);
                ref1.remove()
                    .then(function (resolved) {
                        var ref = db.ref('returned-items/' + key)
                        data.dateCreated = new Date().toISOString();
                        data.timeCreated = new Date().getTime()
                        data.status = 'RETURNED'
                        ref.set(data)
                            .then(function (key) {
                                resolve(key)
                                console.log(key)
                            }, function (error) {
                                console.log(error)
                                reject(error)
                            })
                    })
            })
        },
        sellItem: function (data, key) {
            return $q(function (resolve, reject) {
                var ref1 = db.ref('sellable-items/' + key);
                ref1.remove()
                    .then(function (resolved) {
                        var ref = db.ref('sold-items/' + key)
                        data.dateCreated = new Date().toISOString();
                        data.timeCreated = new Date().getTime()
                        data.status = 'SOLD'
                        ref.set(data)
                            .then(function (key) {
                                resolve(key)
                                console.log(key)
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