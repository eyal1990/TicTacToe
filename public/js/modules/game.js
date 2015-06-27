angular.module('TicTacToe.game', [])

    .directive('miniTicTacToe', function () {
        return {
            restrict: 'E',
            scope: {
                miniBoard: '='
            },
            templateUrl: 'templates/miniTicTacToe.html',
            replace: true,
            link: function (scope) {

            }
        };
    })

    .factory('GameService', function () {
        return {
            board: new BigBoard(),
            sendPick: sendPick()
        };

        function sendPick(cell) {
            // socket
        }
    })

    .controller('GameCtrl', ['$scope', 'GameService', '$localstorage', '$modal', '$rootScope',
                function ($scope, GameService, $localstorage, $modal, $rootScope) {

        // var socket = io.connect(serverData.ip());
        // var connected = $rootScope.loggedUser;

        // function closeSocket(){
        //     if (game.opponent != ""){
        //         userService.setGameResult(connected, false);
        //         socket.emit('quit', game.opponent);
        //     }

        //     socket.emit('exit', connected.name);
        //     //socket.disconnect();
        // }

        $scope.$on('$destroy', function () {
            // closeSocket();
        });

        window.onbeforeunload = function (event) {
            // closeSocket();
        };

        this.users = ['yourself', 'computer'];
        this.waitingToResponse = false;
        this.inGame = false;
        this.invitedUser = "";
        this.askingUser = undefined;
        this.yourTurn = false;
        this.opponent = "";

        var game = this;

        this.cleanBoard = function(){
            game.board = new BigBoard();
        };

        this.sendRequest = function (to) {
            if (to == "yourself") {
                this.yourTurn = true;
                game.board = new BigBoard();
            }
            else if (to == "computer") {
                alert('This feature is yet to be enabled')
            }
            else {
                this.yourTurn = false;
                game.invitedUser = to;
                // socket.emit('ask', { to: to, code: 0 }, function (result, error) {
                //     game.waitingToResponse = result;
                //     $scope.$apply();
                // });
            }
        };

        this.declineRequest = function (to) {
            game.askingUser = "";
            // socket.emit('decline', {name: to, msg: connected.name + " declined your request"});
        };

        this.acceptInvite = function () {
            // socket.emit('ask', { to: game.askingUser, code: 1 }, function (result, error) {
            //     game.waitingToResponse = result;
            // });

            game.askingUser = undefined;
        };

        this.cancelInvite = function(){
            game.waitingToResponse = false;
        };

        this.surrender = function(){
            userService.setGameResult(connected, false);
            // socket.emit('quit', game.opponent);
            $scope.open(false, 'You surrendered');
        };

        function startGame(first, opponent){
            game.waitingToResponse = false;
            game.opponent = opponent;
            game.yourTurn = first;
            game.inGame = true;
            game.board = new BigBoard();
            $scope.$apply();
        }

        // socket.on('surrender', function (data) {
        //     console.log(data);

        //     userService.setGameResult(connected, true);
        //     $scope.open(true, data);
        // });

        // socket.on('usernames', function (data) {
        //     console.log("users:" + data);
        //     if (data.indexOf(connected.name) > -1) {
        //         data.splice(data.indexOf(connected.name), 1);
        //         data.unshift("computer");
        //         data.unshift("yourself");
        //     }
        //     game.users = data;
        //     $scope.$apply();
        // });

        // socket.on('declined', function (data) {
        //     game.waitingToResponse = false;

        //     alert(data);
        // });

        // socket.on('request', function (data) {

        //     var from = data.from;
        //     console.log(game.opponent == from + ' from:' + from + ' opponent: ' + game.opponent);

        //     if (game.opponent == from){
        //         game.askingUser = from;
        //         return;
        //     }

        //     if (!game.waitingToResponse && !game.inGame) {
        //         if (data.code == 0) {
        //             game.askingUser = from;
        //             $scope.$apply();
        //         }
        //         else {
        //             socket.emit('decline', {name: from, msg: connected.name + " cancel the invitation"});
        //         }
        //     }
        //     else if (game.waitingToResponse && data.code == 2) {
        //         startGame(true, from);
        //     }
        //     else if (game.waitingToResponse && data.code == 1) {
        //         socket.emit('ask', { to: from, code: 2 }, function (result, error) {
        //             if (result) startGame(false, from);
        //         });
        //     }
        //     else {
        //         console.log('fourth if');

        //         //send decline to the asking
        //         socket.emit('decline', {name: from, msg: " is already in a game"});
        //     }
        // });

        // socket.on('game', function (data) {
        //     game.yourTurn = !game.yourTurn;

        //     var cell = data.cell;
        //     var board = data.board;
        //     var value = data.value;

        //     game.board.board[board.x][board.y].board[cell.x][cell.y].value = value;
        //     game.player = value === 'x' ? 'o' : 'x';

        //     var cell = game.board.board[board.x][board.y].board[cell.x][cell.y];

        //     if (cell.board.getWinner()) {
        //         if (game.board.getWinner()){
        //             game.yourTurn = false;
        //             userService.setGameResult(connected, false, function(user) {
        //                 $rootScope.loggedUser = user;
        //             });
        //             $scope.open(false, game.opponent + ' kicked your butt');
        //         }
        //     }

        //     var allow = !game.board.board[cell.x][cell.y].isFull() && game.board.board[cell.x][cell.y].winner === undefined;

        //     game.board.board.forEach(function (row) {
        //         row.forEach(function (col) {
        //             col.isAlowed = !allow && col.winner === undefined && !col.isFull();
        //         });
        //     });

        //     game.board.board[cell.x][cell.y].isAlowed = allow;

        //     $scope.$apply();
        // });

        // socket.emit('newuser', connected, function (result, error) {
        //     if (!result) {
        //         alert("You are already online in other session!")
        //     }
        // });

        game.player = 'x';

        game.board = new BigBoard();//GameService.board;

        game.pick = function (cell) {
            if (!game.yourTurn) return;
            if (!cell.board.isAlowed) return;

            cell.value = game.player;
            game.player = game.player === 'x' ? 'o' : 'x';

            if (cell.board.getWinner()) {
                if (game.board.getWinner()){
                    if (game.inGame){
                        userService.setGameResult(connected, true, function(user) {
                            // $rootScope.loggedUser = user;
                        });
                        $scope.open(true, 'You kicked his butt');
                    }
                    else {
                        $scope.open(true, game.board.winner + ' won');
                    }
                }
            }

            var allow = !game.board.board[cell.x][cell.y].isFull() && game.board.board[cell.x][cell.y].winner === undefined;

            game.board.board.forEach(function (row) {
                row.forEach(function (col) {
                    col.isAlowed = !allow && col.winner === undefined && !col.isFull();
                });
            });

            game.board.board[cell.x][cell.y].isAlowed = allow;

            if (game.inGame) {
                var advance = {
                    name: game.opponent,
                    cell: {x: cell.x, y: cell.y},
                    board: {x: cell.board.x, y: cell.board.y},
                    value: cell.value
                };

                // socket.emit('advance', advance, function (result, error) {
                //     game.yourTurn = false;
                //     $scope.$apply();
                // });
            }
        };

        $scope.open = function (win, msg) {

            $scope.items = [win, msg, 'item3'];

            var modalInstance = $modal.open({
                templateUrl: 'templates/endGameMsg.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if (game.opponent == "") {
                    game.board = new BigBoard();
                    return;
                }

                if (game.askingUser === game.opponent){
                    game.acceptInvite();
                }
                else {
                    game.sendRequest(game.opponent);
                }

                game.inGame = false;

            }, function () {
                if (game.askingUser === game.opponent) {
                    game.declineRequest(game.opponent);
                }

                game.opponent = "";
                game.yourTurn = false;
                game.inGame = false;
                //game.board = new BigBoard();
            });
        };
    }])

    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;
        //$scope.selected = {
        //    item: $scope.items[0]
        //};

        $scope.ok = function () {
            $modalInstance.close('restart');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('continue');
        };
    });


function Cell(x, y, board) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.value = undefined;
}

function SmallBoard(x, y) {
    this.x = x;
    this.y = y;
    this.isAlowed = true;
    this.winner = undefined;
    this.board = [];

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new Cell(i, j, this));
        }
    }
}

SmallBoard.prototype.isFull = function () {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (!this.board[i][j].value){
                return false;
            }
        }
    }

    return true;
};

SmallBoard.prototype.getWinner = function () {
    var wins = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];

    var that = this;

    if (that.winner) return that.winner;

    wins.forEach(function (win) {
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].value === that.board[win[1][0]][win[1][1]].value &&
            that.board[win[0][0]][win[0][1]].value === that.board[win[2][0]][win[2][1]].value &&
            that.board[win[0][0]][win[0][1]].value != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].value;
        }
    });

    return that.winner;
};

function BigBoard() {
    this.board = [];
    this.winner = undefined;

    for (var i = 0; i < 3; i++) {
        this.board.push([]);
        for (var j = 0; j < 3; j++) {
            this.board[i].push(new SmallBoard(i, j));
        }
    }
}

BigBoard.prototype.getWinner = function () {
    var wins = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];

    var that = this;

    //if (that.winner) return that.winner;

    wins.forEach(function (win) {
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].winner === that.board[win[1][0]][win[1][1]].winner &&
            that.board[win[0][0]][win[0][1]].winner === that.board[win[2][0]][win[2][1]].winner &&
            that.board[win[0][0]][win[0][1]].winner != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].winner;
        }
    });

    return that.winner;
};