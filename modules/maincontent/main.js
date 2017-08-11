myApp.controller('mainController',
  function ($rootScope, $q, $scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService, readService, writeService) {

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
      var myChart = new Chart(ctx, {
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
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }


    function composeData(data, filterBy) {
      $scope.chart = {}
      $scope.labels = getLabel(data, filterBy);
      $scope.data = getData(data, filterBy);
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
              for (labels in data.daily[year][month][day]) {
                switch (labels) {
                  case 'extend_loan':
                    datasets[0].data.push(data.daily[year][month][day][labels])
                    break;
                  case 'pawned':
                    datasets[1].data.push(data.daily[year][month][day][labels])
                    break;
                  case 'returned':
                    datasets[2].data.push(data.daily[year][month][day][labels])
                    break;
                  case 'transferred_to_sellable':
                    datasets[3].data.push(data.daily[year][month][day][labels])
                    break;
                  case 'sold':
                    datasets[4].data.push(data.daily[year][month][day][labels])
                    break;
                }
              }
            }
          }
        }
        return datasets;
      }
      if (filterBy == 'monthly') {
        for (year in data.monthly) {
          for (month in data.monthly[year]) {
            for (labels in data.monthly[year][month]) {
              switch (labels) {
                case 'extend_loan':
                  datasets[0].data.push(data.monthly[year][month][labels])
                  break;
                case 'pawned':
                  datasets[1].data.push(data.monthly[year][month][labels])
                  break;
                case 'returned':
                  datasets[2].data.push(data.monthly[year][month][labels])
                  break;
                case 'transferred_to_sellable':
                  datasets[3].data.push(data.monthly[year][month][labels])
                  break;
                case 'sold':
                  datasets[4].data.push(data.monthly[year][month][labels])
                  break;
              }
            }
          }
        }
        return datasets;
      }
      if (filterBy == 'yearly') {
        for (year in data.yearly) {
          for (labels in data.yearly[year]) {
            switch (labels) {
              case 'extend_loan':
                datasets[0].data.push(data.yearly[year][labels])
                break;
              case 'pawned':
                datasets[1].data.push(data.yearly[year][labels])
                break;
              case 'returned':
                datasets[2].data.push(data.yearly[year][labels])
                break;
              case 'transferred_to_sellable':
                datasets[3].data.push(data.yearly[year][labels])
                break;
              case 'sold':
                datasets[4].data.push(data.yearly[year][labels])
                break;
            }
          }
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