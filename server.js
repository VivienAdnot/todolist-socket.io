var http = require('http');
var fileSystem = require('fs');
var socketIO = require('socket.io');

var server = http.createServer(function(req, res) {
    fileSystem.readFile("./client/index.html", "utf-8", function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

var io = socketIO.listen(server);

var todos = ["first todo"];

io.sockets.on('connection', function (socket) {
    socket.emit('list', todos);

    socket.on('new-todo', function(todo) {
        todos.push(todo);
        socket.emit('list', todos);
        socket.broadcast.emit('list', todos);
    });

    socket.on('delete', function(index) {
        todos.splice(index, 1);
        socket.emit('list', todos);
        socket.broadcast.emit('list', todos);
    });
});

server.listen(8000);
