myApp.controller('mainController',
  function ($rootScope, $q, $scope, $timeout, $mdSidenav, $log, writeService, $mdDialog, configService, readService, writeService) {

    $scope.filterBy = 'daily';


    readService.reports().then(
      function (data) {
        $scope.originalreports = data;
        console.log(data);
        composeData($scope.originalreports, $scope.filterBy);

        initializeChart();
      })


      function initializeChart(){
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
                            beginAtZero:true
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
        for (year in data) {
          console.log(year)
          for (month in data[year]) {
            console.log(month)
            for (day in data[year][month]) {
              console.log(day)
              for (labels in data[year][month][day]) {
                switch (labels) {
                  case 'extend_loan':
                    datasets[0].data.push(data[year][month][day][labels])
                    break;
                  case 'pawned':
                    datasets[1].data.push(data[year][month][day][labels])
                    break;
                  case 'returned':
                    datasets[2].data.push(data[year][month][day][labels])
                    break;
                  case 'transferred_to_sellable':
                    datasets[3].data.push(data[year][month][day][labels])
                    break;
                  case 'sold':
                    datasets[4].data.push(data[year][month][day][labels])
                    break;
                }
              }
            }
          }
        }
      }

      console.log(datasets)
      return datasets;


    }

    function getLabel(data, filterBy) {
      console.log(data, filterBy);
      var labels = [];
      switch (filterBy) {
        case 'yearly':
          for (key in data) {
            labels.push(key)
          }
          break;
        case 'monthly':
          for (key in data) {
            var prepend = key;
            for (key1 in data[key]) {
              labels.push(prepend + '/' + key1)
            }
          }
          break;
        case 'daily':
          for (key in data) {
            for (key1 in data[key]) {
              var prepend = key1;
              for (key2 in data[key][key1])
                labels.push(prepend + '/' + key2)
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