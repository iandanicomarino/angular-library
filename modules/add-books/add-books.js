myApp.controller('addBooksController',
  function ($q,$scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService) {

    $scope.addBooks = function (book,copy) {
        console.log(book,copy)
        var promises = [];
        for(var i = 0; i<copy ; i++){
            promises.push(writeService.addBook(book))
        }
        $q.all(promises)
        .then(function(keys){
            console.log(keys)
            if(copy==1){
                configService.showToast('Added a Book')
            }else{
                 configService.showToast('Added multiple copies of a book')
            }
            
            
            $mdDialog.hide();
        })
    }

  }
)