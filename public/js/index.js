var app = angular.module('tic-tac-toe', ['ui.router', 'TicTacToe.game', 'mm.foundation'])

    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider

            // .state('login', {
            //     url: '/login',
            //     templateUrl: 'templates/login.html',
            //     controller: 'loginCtrl as login'
            // })

            // .state('register',
            // {
            //     url: '/register',
            //     controller: 'regCtrl as reg',
            //     templateUrl: 'templates/register.html'
            // })

            .state('game',
            {
                url: '/game',
                controller: 'GameCtrl as game',
                templateUrl: 'templates/game.html'
            })

            // .state('user',
            // {
            //     url: '/user',
            //     controller: 'UserDetailsCtrl as ctrl',
            //     templateUrl: 'templates/userDetails.html'
            // })

            // .state('admin',
            // {
            //     url: '/admin',
            //     abstract: true,
            //     templateUrl: 'templates/admin.html'
            // })

            // .state('admin.userManager', {
            //     url: '^/manager',
            //     controller: 'UserManagerCtrl as man',
            //     templateUrl: 'templates/userManager.html'
            // })

            // .state('admin.map', {
            //     url: '^/map',
            //     controller: 'MapCtrl as mapC',
            //     templateUrl: 'templates/map.html'
            // })

            // .state('admin.graph', {
            //     url: '^/graph',
            //     controller: 'GraphsCtrl as gra',
            //     templateUrl: 'templates/graph.html'
            // })

            .state('main',
            {
                url: '/main',
                templateUrl: 'templates/main.html'
            });

        $urlRouterProvider.otherwise('/game');

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || false);
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            }
        }
    }])

    // .factory('serverData', [function () {
    //     return ({ip: createIP});

    //     function createIP(data){
    //         var address = 'http://localhost:8080';
    //         //var address = 'http://192.168.1.16:8080';
    //         //var address = 'http://192.168.43.61:8080';

    //         if (data) address += '/' + data;

    //         return address;
    //     }
    // }])

    .controller('MainCtrl', ['$localstorage', '$rootScope', function ($localstorage, $rootScope) {

        // var user = $localstorage.getObject('user');

        // if (user){
        //     loginService.loginUser({ name: user.name, password: user.password }, function(){
        //         console.log('removed: ' + user.name);
        //         $localstorage.remove('user');
        //     });
        // }
    }]);



