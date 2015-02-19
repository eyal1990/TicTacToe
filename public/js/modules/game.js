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

    .controller('GameCtrl', ['$scope', 'GameService', '$localstorage', 'userService', '$modal', '$rootScope', function ($scope, GameService, $localstorage, userService, $modal, $rootScope) {

        var socket = io.connect('http://localhost:8080');

        var connected = $rootScope.loggedUser;

        console.log(connected.name);

        $scope.$on('$destroy', function () {
            //game.board = GameService.board();
            socket.emit('exit', connected.name);
        });

        window.onbeforeunload = function (event) {
            socket.emit('exit', connected.name);
        };

        this.users = ['yourself', 'computer'];
        this.waitingToResponse = false;
        this.inGame = false;
        this.requestAccapted = false;
        this.invitedUser = "";
        this.askingUser = undefined;
        this.yourTurn = false;
        this.opponent = "";
        //this.inventions = [];

        var game = this;

        this.sendRequest = function (to) {
            if (to == "yourself") {
                this.yourTurn = true;
            }
            else if (to == "computer") {
                alert('This feature is yet to be enabled')
            }
            else {
                game.invitedUser = to;

                socket.emit('ask', { to: to, data: false }, function (result, error) {
                    game.waitingToResponse = result;
                    $scope.$apply();
                });
            }
        };

        this.declineRequest = function (to) {
            game.askingUser = "";
            socket.emit('decline', {name: to, msg: connected.name + " declined your request"});
        };

        this.acceptInvite = function () {
            socket.emit('ask', { to: game.askingUser, data: true }, function (result, error) {
                game.waitingToResponse = result;
                game.requestAccapted = result;
            });

            game.askingUser = undefined;
        };

        this.cancelInvite = function()
        {
            game.waitingToResponse = false;
        }

        socket.on('usernames', function (data) {
            console.log("users:" + data);
            if (data.indexOf(connected.name) > -1) {
                data.splice(data.indexOf(connected.name), 1);
                data.unshift("computer");
                data.unshift("yourself");
            }
            game.users = data;
            $scope.$apply();
        });

        socket.on('declined', function (data) {
            game.waitingToResponse = false;

            alert(data);
            //if (game.invitedUser === game.opponent) {
            //    game.opponent = "";
            //    game.inGame = false;
            //
            //    // inform he was declined and close his pop
            //}
            //else{
            //    // inform the user he was declined
            //    alert(data);
            //}
        });

        socket.on('request', function (data) {

            var from = data.from;
            console.log(data);

            if (game.board.winner !== undefined && game.opponent == from){
                // light his button

                game.askingUser = from;

                return;
            }

            if (!game.waitingToResponse && !game.inGame) {

                console.log('first if');

                if (data.code) {
                    socket.emit('decline', {name: from, msg: connected.name + " cancel the invitation"});
                }
                else {
                    game.askingUser = from;
                    $scope.$apply();
                }
            }
            else if (game.waitingToResponse && game.requestAccapted) {
                console.log('second if');

                game.waitingToResponse = false;
                game.requestAccapted = false;

                game.opponent = from;
                game.yourTurn = true;
                game.inGame = true;
                $scope.$apply();
                // start game with x - allow all boards
            }
            else if (game.waitingToResponse && from == game.invitedUser) {

                console.log('third if');

                socket.emit('ask', { to: from, data: false }, function (result, error) {
                    if (result) {
                        game.opponent = from;
                        game.yourTurn = false;
                        game.inGame = true;
                        game.waitingToResponse = false;
                        $scope.$apply();
                        //start game with o
                    }
                });
            }
            else {
                console.log('fourth if');

                //send decline to the asking
                socket.emit('decline', {name: from, msg: " is already in a game"});
            }
        });

        socket.on('game', function (data) {
            game.yourTurn = !game.yourTurn;

            var cell = data.cell;
            var board = data.board;
            var value = data.value;

            game.board.board[board.x][board.y].board[cell.x][cell.y].value = value;

            game.player = value === 'x' ? 'o' : 'x';

            var cell = game.board.board[board.x][board.y].board[cell.x][cell.y];

            if (cell.board.getWinner()) {
                console.log(cell.board.winner);
                game.board.getWinner() ? alert(game.board.getWinner()) : null;
            }

            var allow = !game.board.board[cell.x][cell.y].isFull() && game.board.board[cell.x][cell.y].winner === undefined;

            game.board.board.forEach(function (row) {
                row.forEach(function (col) {
                    col.isAlowed = !allow && col.winner === undefined;
                });
            });

            game.board.board[cell.x][cell.y].isAlowed = allow;

            $scope.$apply();
        });

        socket.emit('newuser', connected, function (result, error) {
            if (!result) {
                alert("You are already online in other session!")
            }
        });

        game.player = 'x';

        game.board = new BigBoard();//GameService.board;

        game.pick = function (cell) {
            if (!game.yourTurn) return;
            if (!cell.board.isAlowed) return;

            cell.value = game.player;
            game.player = game.player === 'x' ? 'o' : 'x';
            //GameService.sendPick(cell);

            if (cell.board.getWinner()) {
                console.log(cell.board.winner);
                game.board.getWinner() ? alert(game.board.getWinner()) : null;
            }

            var allow = !game.board.board[cell.x][cell.y].isFull() && game.board.board[cell.x][cell.y].winner === undefined;

            game.board.board.forEach(function (row) {
                row.forEach(function (col) {
                    col.isAlowed = !allow && col.winner === undefined;
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

                socket.emit('advance', advance, function (result, error) {
                    game.yourTurn = false;
                });
            }
        };

        $scope.open = function () {

            $scope.items = ['item1', 'item2', 'item3'];

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
                alert(selectedItem);

                if (game.askingUser === game.opponent){
                    game.acceptInvite();
                }
                else {
                    game.sendRequest(game.opponent);
                }

                game.board = new BigBoard();

            }, function () {
                console.log('return');

                if (game.askingUser === game.opponent) {
                    // decline
                    game.declineRequest(game.opponent);
                }

                game.opponent = "";
                game.inGame = false;
                game.board = new BigBoard();
            });
        };
    }])

    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close('hello');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
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
    for (var row in this.board) {
        for (var cell in row)
            if (cell.value === undefined) return false;
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

    if (that.winner) return that.winner;

    wins.forEach(function (win) {
        if (that.winner) return;
        if (that.board[win[0][0]][win[0][1]].winner === that.board[win[1][0]][win[1][1].winner] &&
            that.board[win[0][0]][win[0][1]].winner === that.board[win[2][0]][win[2][1].winner] &&
            that.board[win[0][0]][win[0][1]].winner != undefined) {
            that.winner = that.board[win[0][0]][win[0][1]].winner;
        }
    });

    return that.winner;
};


//Square.prototype.fill = function (player) {
//    this.player = player;
//};
//
//function init() {
//    var board = [];
//    for (var i = 0; i < 3; i++) {
//        for (var j = 0; j < 3; j++) {
//            board.push(new Cell(i, j));
//        }
//    }
//
//    return board;
//}