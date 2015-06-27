// angular.module('TicTacToe.statistics', ['uiGmapgoogle-maps', 'nvd3ChartDirectives'])

//     .factory('dataService', ['$http', 'serverData', function ($http,serverData) {

//         return ({getUsersPerCountry: getUsersPerCountry, getUsersPerMonth: getUsersPerMonth});

//         function getUsersPerCountry(successCallback, onErrorCallback) {
//             $http.get(serverData.ip('getUsersPerCountry')).success(function(data) {
//                 console.log(data);
//                 successCallback(data);
//             }).error(onErrorCallback);
//         }

//         function getUsersPerMonth(successCallback, onErrorCallback) {
//             $http.get(serverData.ip('getUsersPerMonth')).success(function(data) {
//                 console.log(data);
//                 successCallback(data);
//             }).error(onErrorCallback);
//         }

//     }])

//     .controller('GraphsCtrl', ['$scope','dataService', function ($scope, dataService) {
//         var vm = this;

//         dataService.getUsersPerMonth(function(result){
//             vm.usersPerMonth = [{
//                 key: result[result.length - 1],
//                 values: dataForGraph(result[result.length - 1].monthly)
//             }];

//             vm.allData = result;

//             vm.years = [];

//             result.forEach(function (year) {
//                 vm.years.push(year._id);
//             });

//             vm.selectedYear = 2015;
//         });
        
//         vm.setGraph = function () {
//             // Get data by the selected year
//             dataService.getUsersPerMonth(function(result){

//                 result.forEach(function(data) {
//                     if (data._id === vm.selectedYear) {
//                         vm.usersPerMonth = [{
//                             key: vm.selectedYear,
//                             values: dataForGraph(data.monthly)
//                         }];
//                     }
//                 });

//                 $scope.$apply();
//             });
//         };

//         function dataForGraph (monthly) {
//             var values = [];
//             var index = 1;
//             monthly.forEach(function(mon) {
//                 for (var i = index; i < mon.month; i++) {
//                     values.push([i, 0]);
//                 }
//                 index = mon.month;
//                 values.push([index, mon.UserRegistered]);
//             });

//             if (index < 12) {
//                 for (var i = index + 1; i < 13; i++) {
//                     values.push([i, 0]);
//                 }
//             }

//             return values;
//         }
//     }])

//     .controller('MapCtrl', ['dataService', function (dataService ) {
//         this.map = {center: {latitude: 40.1451, longitude: -29.6680 }, zoom: 3 };

//         this.locations = [];
//         var that = this;

//         geocoder = new google.maps.Geocoder();
//         dataService.getUsersPerCountry(function(data){

//             function pushInfo(country, cnt, id){
//                 geocoder.geocode({'address': country}, function (results, status) {
//                     if (status == google.maps.GeocoderStatus.OK) {
//                         var info = {
//                             id: id,
//                             coords: {
//                                 latitude: results[0].geometry.location.k,
//                                 longitude: results[0].geometry.location.D
//                             },
//                             options: {
//                                 labelContent: cnt,
//                                 labelVisible: true,
//                                 //labelAnchor:"22 0",
//                                 labelClass:"labels"
//                             }
//                         }
//                         that.locations.push(info);
//                     } else {
//                         console.log("Geocode was not successful for the following reason: " + status);
//                     }
//                 });
//             }

//             for (i = 0; i < data.length; i++) {
//                 pushInfo(data[i]._id, data[i].count, i)
//             }
//         });

//     }]);