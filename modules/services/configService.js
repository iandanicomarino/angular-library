myApp.service('configService', function ($mdToast) {
    return {
        config: function () {
            return {
                apiKey: "AIzaSyDDT5HzZ4ochsk-y41urk9906g6yYFNPBc",
                authDomain: "library-system-74f7d.firebaseapp.com",
                databaseURL: "https://library-system-74f7d.firebaseio.com",
                storageBucket: "library-system-74f7d.appspot.com",
                messagingSenderId: "511688677886"
            }
        },
        showToast: function (text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }
    }
})