myApp.service('writeService', function ($http, $q, configService) {
    const db = firebase.database();
    var writeServiceFunctions = {
        sendNotification: function (data, key) {
            var cellphone = data.owner.cellphoneNo;
            var email = data.owner.email;
            var item = data.year + ' '+data.brand + ' '+data.model;
            var name = data.owner.firstName +' '+ data.owner.lastName;

            return $q(function (resolve, reject) {
                writeServiceFunctions.sendSMS(cellphone, item, name)
                    .then(function (res) {
                        return writeServiceFunctions.sendEmail(email, item, name)
                    }).then(function(res){
                        writeServiceFunctions.editItem(data,key)
                        .then(function(res){
                            resolve('FINISHED SENDING EMAIL AND SMS AND UPDATED ITEM')
                            writeServiceFunctions.updateReports('sent_notification')
                        })
                    })
            })
        },
        sendSMS: function (cellphone, item, name) {
            return $q(function (resolve, reject) {
                var query = "?cellphone=" + cellphone + "&item=" + item + "&name=" + name;
                $http.get('https://angular-pawnshop.herokuapp.com/sendSMS' + query).then(function (success) {
                    console.log(success);
                    resolve("sucess sending sms->", cellphone)
                }, function (error) {
                    resolve("fail sending sms->", cellphone)
                });
            });
        },
        sendEmail: function (email, item, name) {
            return $q(function (resolve, reject) {
                var query = "?email=" + email + "&item=" + item + "&name=" + name;
                $http.get('https://angular-pawnshop.herokuapp.com/sendEmail' + query).then(function (success) {
                    console.log(success);
                    resolve("sucess sending email->", email)
                }, function (error) {
                    resolve("fail sending email->", email)
                });
            });
        },
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
                        writeServiceFunctions.updateReports('pawned')
                        writeServiceFunctions.updateMoneyReport('outbound_money',data.pawnValue)
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
                                writeServiceFunctions.updateReports('transferred_to_sellable')
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
                                writeServiceFunctions.updateReports('returned');
                                writeServiceFunctions.updateMoneyReport('inbound_money',data.pawnValue)
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
                                writeServiceFunctions.updateReports('sold')
                                writeServiceFunctions.updateMoneyReport('inbound_money',data.soldAs)
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
        updateReports: function(incrementTo){
            var datenow = moment();
            var year    =   ''+datenow.year();
            var month   =   ''+(datenow.month()+1); 
            var date    =   ''+datenow.date();

            var yearly = db.ref('reports/yearly/'+year+'/'+incrementTo)
            var monthly = db.ref('reports/monthly/'+year+'/'+month+'/'+incrementTo);
            var daily = db.ref('reports/daily/'+year+'/'+month+'/'+date+'/'+incrementTo);

            yearly.transaction(function(value){
                if(value != ''&& value != undefined && value != null){
                    value = value+1;  
                   return value;
                }else{
                    return 1;
                }
            })
            monthly.transaction(function(value){
                if(value != ''&& value != undefined && value != null ){
                    value = value+1;  
                   return value;
                }else{
                    return 1;
                }
            })
            daily.transaction(function(value){
                if(value != ''&& value != undefined && value != null ){
                    value = value+1;  
                   return value;
                }else{
                    return 1;
                }
            })
        },
        updateMoneyReport: function(incrementTo,amount){
            var datenow = moment();
            var year    =   ''+datenow.year();
            var month   =   ''+(datenow.month()+1); 
            var date    =   ''+datenow.date();

            var yearly = db.ref('reports/yearly/'+year+'/'+incrementTo)
            var monthly = db.ref('reports/monthly/'+year+'/'+month+'/'+incrementTo);
            var daily = db.ref('reports/daily/'+year+'/'+month+'/'+date+'/'+incrementTo);

            yearly.transaction(function(value){
                if(value != ''&& value != undefined && value != null){
                    value = value + amount;  
                   return value;
                }else{
                    return amount;
                }
            })
            monthly.transaction(function(value){
                if(value != ''&& value != undefined && value != null ){
                    value = value+amount;  
                   return value;
                }else{
                    return amount;
                }
            })
            daily.transaction(function(value){
                if(value != ''&& value != undefined && value != null ){
                    value = value+amount;  
                   return value;
                }else{
                    return amount;
                }
            })
        }

    }
    return writeServiceFunctions;
})