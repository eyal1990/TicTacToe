// angular.module('TicTacToe.users', ['nvd3ChartDirectives'])

//     .factory('loginService', ['$http', '$state', '$rootScope', '$localstorage', 'serverData', function ($http, $state, $rootScope, $localstorage, serverData) {

//         return ({loginUser: loginUser, saveUser: saveUser});

//         function loginUser(user, onErrorCallback) {
//             $http.post(serverData.ip('checkUser'), user).success(successCallback).error(onErrorCallback);
//         }

//         function saveUser(user, onErrorCallback) {
//             $http.post(serverData.ip('createUser'), user).success(successCallback).error(onErrorCallback);
//         }

//         function successCallback(user) {
//             if (user) {
//                 $rootScope.loggedUser = user;
//                 $localstorage.setObject('user', user);
//                 $state.go('main');
//             }
//         }
//     }])

//     .factory('userService', ['$http', 'serverData', function ($http, serverData) {

//         return ({getAllUsers: getAllUsers, setGameResult: setGameResult, blockUser: blockUser, deleteUser: deleteUser});

//         function getAllUsers(successCallback, onErrorCallback) {
//             $http.get(serverData.ip('getAllUsers')).success(successCallback).error(onErrorCallback);
//         }

//         function setGameResult(user, win, successCallback, onErrorCallback) {
//             $http.post(serverData.ip('setGameResult'), {
//                 name: user.name,
//                 win: win
//             }).success(successCallback).error(onErrorCallback);
//         }

//         function blockUser(user, successCallback, onErrorCallback) {
//             $http.post(serverData.ip('blockUser'), user).success(successCallback).error(onErrorCallback);
//         }

//         function deleteUser(user, successCallback, onErrorCallback) {
//             $http.post(serverData.ip('deleteUser'), user).success(successCallback).error(onErrorCallback);
//         }
//     }])

//     .controller('UserManagerCtrl', ['userService', function (userService) {
//         this.users = {};

//         this.blockUser = function (user) {
//             userService.blockUser(user, function (data) {
//                 console.log(data);
//             });
//         };

//         this.deleteUser = function (user) {
//             this.users.splice(this.users.indexOf(user), 1);
//             userService.deleteUser(user, function (data) {
//                 console.log(data);
//             });
//         };

//         var that = this;

//         userService.getAllUsers(function (data) {
//             console.log(data);
//             that.users = data;
//         });

//     }])

//     .controller('UserDetailsCtrl', ['userService', '$rootScope', '$state', '$localstorage', function (userService, $rootScope, $state, $localstorage) {
//         var vm = this;

//         vm.user = {
//             name: $rootScope.loggedUser.name,
//             mail: $rootScope.loggedUser.mail,
//             data: [
//                 { key: 'wins', y: $rootScope.loggedUser.wins },
//                 { key: 'loses', y: $rootScope.loggedUser.loses }
//             ]
//         };

//         vm.signUserOut = function () {
//             $localstorage.remove('user');
//             $rootScope.loggedUser = null;

//             $state.go('main');
//         };

//         vm.deleteUser = function () {
//             userService.deleteUser($rootScope.loggedUser);
//             this.signUserOut();
//         };

//         vm.xFunction = function() {
//             return function(d) {
//                 return d.key;
//             };
//         };
//         vm.yFunction = function() {
//             return function(d) {
//                 return d.y;
//             };
//         };

//         vm.descriptionFunction = function() {
//             return function(d) {
//                 return d.key;
//             }
//         };
//     }])

//     .controller('loginCtrl', ['loginService', function (loginService) {
//         var that = this;

//         this.submit = function () {
//             loginService.loginUser(this.user, function (err) {
//                 that.message = err.message;
//             });
//         };
//     }])

//     .controller('regCtrl', ['loginService', '$http', function (loginService, $http) {
//         this.user = {};
//         var that = this;

//         this.submit = function () {
//             loginService.saveUser(this.user, function (err) {
//                 that.message1 = '';
//                 that.message2 = '';

//                 if (err.message.indexOf("Username") > -1) {
//                     that.message1 = err.message;
//                 }

//                 if (err.message.indexOf("Mail") > -1) {
//                     that.message2 = err.message;
//                 }
//             });
//         };

//         $http.get('http://ipinfo.io/json').
//             success(function (data) {
//                 console.log(data);
//                 that.user.country = data.country;
//             });
//     }]);