var express = require('express')
    , path = require('path')
    , countrynames = require('countrynames')
    , mongoose = require('mongoose')
    , bodyParser = require('body-parser')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);



// mongoose.connect('mongodb://db.cs.colman.ac.il/TicTacToe');

// var userSchema = mongoose.Schema({
//     name: String,
//     password: String,
//     mail: String,
//     country: String,
//     blocked: Boolean,
//     admin: Boolean,
//     createDate: Date,
//     wins : Number,
//     loses: Number
// }, { collection: 'users'});

// var User = mongoose.model('User', userSchema);

// var users = {};

// io.sockets.on('connection', function (socket) {

//     socket.on('message', function (data) {
//         console.log('New Chat Message ', data);
//         io.sockets.emit('chat',{msg: data, nick: socket.username});
//     });

//     socket.on('advance', function (data, callback) {
//         console.log('New move to ', data.name);
//         if (data.name in users) {
//             users[data.name].emit('game', data);
//             callback(true);
//         }
//         else {
//             callback(false);
//         }
//     });

//     socket.on('quit', function (user) {
//         if (user in users) {
//             users[user].emit('surrender', socket.username + ' surrendered!');
//         }
//     });

//     socket.on('ask', function (data, callback) {
//         console.log('New request to ', data.to);
//         if (data.to in users) {
//             users[data.to].emit('request', { from: socket.username, code: data.code});
//             callback(true);
//         }
//         else {
//             callback(false);
//         }
//     });

//     socket.on('decline', function (data) {
//         if (data.name in users) {
//             users[data.name].emit('declined', data.msg);
//         }
//     });

//     socket.on('newuser', function (data, callback) {
//         if (data.name in users) {
//             console.log('connected to a game')
//             callback(false);
//         }
//         else {
//             User.findOne(data, function (err, user) {
//                 if (user) {
//                     socket.username = data.name;
//                     users[data.name] = socket;

//                     console.log(data.name, ' Is Now Connected!');
//                     io.sockets.emit('log', data.name + ' is now online');
//                     io.sockets.emit('usernames', Object.keys(users));

//                     callback(true);
//                 }
//                 else {
//                     callback(false);
//                 }
//             })
//         }
//     });

//     socket.on('exit', function (data) {
//         if (!socket.username) return;

//         delete users[socket.username];
//         console.log(socket.username,' Has Been Disconnected!');
//         io.sockets.emit('log',socket.username + ' is now offline');
//         io.sockets.emit('usernames', Object.keys(users));
//     });

// });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname , 'public')));

app.get("/game", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(8080);
// app.get("/getAllUsers", function(req, res) {

//     User.find({}, function (err, db_users) {
//         res.json(db_users);
//     })
// });

// app.get("/getUsersPerCountry", function(req, res) {

//     User.aggregate(
//         [
//             { $group : { _id : "$country", count: { $sum: 1 } } }
//         ], function (err, result) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log(result);
//             res.json(result);
//         });
// });

// app.get("/getUsersPerMonth", function(req, res) {

//     User.aggregate(
//         [
//             { $group : {
//                 _id : { year: { $year : "$createDate" }, month: { $month : "$createDate" }},
//                 count : { $sum : 1 }}
//             },
//             { $group : {
//                 _id : { year: "$_id.year", month: "$_id.month" },
//                 dailyusage: { $sum : "$count" }}
//             },
//             { $group : {
//                 _id : "$_id.year",
//                 monthly: { $push: { month: "$_id.month", UserRegistered: "$dailyusage" }}}
//             },
//         ], function (err, result) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log(result);
//             res.json(result);
//         });
// });


// app.post("/setGameResult", function(req, res) {
//     User.findOne({'name' : req.body.name}, function (err, user){
//         if (user) {
//             var update = { wins: user.wins + 1 };
//             if (!req.body.win)
//                 update = { loses: user.loses + 1 };

//             User.findByIdAndUpdate(user._id, { $set: update}, function (err, user) {
//                 res.json(user);
//             });
//         }
//         else {
//             res.json(500, { message: 'error occurred' });
//         }
//     })
// });

// app.post("/blockUser", function(req, res) {
//     User.findOne({'name' : req.body.name}, function (err, user){
//         if (user) {
//             User.findByIdAndUpdate(user._id, { $set: { blocked: req.body.blocked }}, function (err, user) {
//                 res.json(user);
//             });
//         }
//         else {
//             res.json(500, { message: 'error occurred' });
//         }
//     })
// });

// app.post("/deleteUser", function(req, res) {
//     User.findOne({'name' : req.body.name}, function (err, user){
//         if (user) {
//             User.remove({ _id: user._id }, function (err, user) {
//                 User.find({}, function (err, db_users) {
//                     console.log(db_users.length);
//                     res.json(db_users);
//                 })
//             });
//         }
//         else {
//             res.json(500, { message: 'error occurred' });
//         }
//     })
// });

// app.post("/checkUser", function(req, res) {
//     var userToCheck = User(req.body);
//     User.findOne({'name' : req.body.name, 'password' : req.body.password}, function (err, user){
//         if (user) {
//             console.log(user.name + " has logged in");
//             res.json(user);
//         }
//         else {
//             console.log('sign in attempt failed');
//             res.json(500, { message: 'User or password are incorrect' });
//         }
//     })
// });

// app.post("/createUser", function(req, res) {
//     if (req.body.name == 'computer' || req.body.name == 'yourself'){
//         res.json(500, { message: 'Username already exists' });
//         return;
//     }

//     User.findOne({'name' : req.body.name}, function (err, user){
//         if (user) {
//             console.log(user.name + " already exists");
//             res.json(500, { message: 'Username already exists' });
//         }
//         else
//         {
//             User.findOne({'mail' : req.body.mail}, function (err, user) {
//                 if (user) {
//                     console.log(user.mail + " in use");
//                     res.json(500, { message: 'Mail is already in use' });
//                 }
//                 else {
//                     var newUser = User(req.body);
//                     newUser.country = countrynames.getName(newUser.country);
//                     newUser.admin = false;
//                     newUser.blocked = false;
//                     newUser.createDate = Date.now();
//                     newUser.wins = 0;
//                     newUser.loses = 0;
//                     newUser.save();
//                     console.log(newUser.name + " has created");
//                     res.json(newUser);
//                 }
//             });
//         }
//     });
// });

//app.listen(8080);