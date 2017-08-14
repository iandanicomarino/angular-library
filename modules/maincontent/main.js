myApp.controller('mainController',
  function ($rootScope, $q, $scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService, readService, writeService,PrintPagesCtrl) {
    var myChart
    $scope.filterBy = 'yearly';


    readService.reports().then(
      function (data) {
        $scope.originalreports = data;
        console.log(data);

        composeData($scope.originalreports, $scope.filterBy);
        initializeChart();
      })

     $scope.$watch('filterBy', function(newValue, oldValue) {
        console.log('triggered')
        composeData($scope.originalreports, $scope.filterBy);
        initializeChart();
      });


    function initializeChart() {
      var ctx = document.getElementById("myChart").getContext('2d');
      if (myChart) {
          myChart.destroy();
        }
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: $scope.labels,
          datasets: $scope.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
        },
        options: {
         animation:{
              onComplete : function(){
                  $scope.imgData = myChart.toBase64Image();
              }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
     
      myChart.update();
    }



    function composeData(data, filterBy) {
      $scope.chart = {}
      $scope.labels = getLabel(data, filterBy);
      $scope.data = getData(data, filterBy);
      $scope.fortable = $scope.data;
      console.log($scope.fortable);
    }

     $scope.print = function (div, item, key) {
        $scope.dateGenerated = new Date();
        PrintPagesCtrl.print(div)
    }


    function getData(data, filterBy) {
      var datasets = [];
      
      datasets = [
        {
          label: "Extended Loan",
          backgroundColor: "orange",
          data: []
        },
        {
          label: "Pawned",
          backgroundColor: "green",
          data: []
        },
        {
          label: "Returned",
          backgroundColor: "blue",
          data: []
        },
        {
          label: "Transferred Sellable",
          backgroundColor: "red",
          data: []
        },
        {
          label: "Sold",
          backgroundColor: "yellow",
          data: []
        },


      ]


      if (filterBy == 'daily') {
        for (year in data.daily) {
          console.log(year)
          for (month in data.daily[year]) {
            var prepend = month;
            for (day in data.daily[year][month]) {
              datasets[0].data.push(data.daily[year][month][day]['extend_loan'] || 0)
              datasets[1].data.push(data.daily[year][month][day]['pawned'] || 0)
              datasets[2].data.push(data.daily[year][month][day]['returned'] || 0)
              datasets[3].data.push(data.daily[year][month][day]['transferred_to_sellable'] || 0)
              datasets[4].data.push(data.daily[year][month][day]['sold'] || 0)
            }
          }
        }
        return datasets;
      }
      if (filterBy == 'monthly') {
        for (year in data.monthly) {
          for (month in data.monthly[year]) {
            datasets[0].data.push(data.monthly[year][month]['extend_loan'] || 0)
            datasets[1].data.push(data.monthly[year][month]['pawned'] || 0)
            datasets[2].data.push(data.monthly[year][month]['returned'] || 0)
            datasets[3].data.push(data.monthly[year][month]['transferred_to_sellable'] || 0)
            datasets[4].data.push(data.monthly[year][month]['sold'] || 0)
          }
        }
        return datasets;
      }
      if (filterBy == 'yearly') {
        for (year in data.yearly) {
          datasets[0].data.push(data.yearly[year]['extend_loan'] || 0)
          datasets[1].data.push(data.yearly[year]['pawned'] || 0)
          datasets[2].data.push(data.yearly[year]['returned'] || 0)
          datasets[3].data.push(data.yearly[year]['transferred_to_sellable'] || 0)
          datasets[4].data.push(data.yearly[year]['sold'] || 0)
        }
        return datasets;
      }

    }

    function getLabel(data, filterBy) {
      console.log(data, filterBy);
      var labels = [];
      switch (filterBy) {
        case 'yearly':
          for (key in data.yearly) {
            labels.push(key)
          }
          break;
        case 'monthly':
          for (key in data.monthly) {
            var prepend = key;
            for (key1 in data.monthly[key]) {
              labels.push(prepend + '/' + key1)
            }
          }
          break;
        case 'daily':
          for (year in data.daily) {
            console.log(year)
            for (month in data.daily[year]) {
              var prepend = month;
              for (daily in data.daily[year][month]) {
                labels.push(prepend + '/' + daily)
              }
            }
          }
          break;
      }
      console.log(labels)
      return labels;


    }

    readService.config()
      .then(function (data) {
        console.log(data);
        $scope.config = data;
        $rootScope.$broadcast('theme-change', $scope.config.primary);
      })

  }
)