var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios');
var fs = require('fs');
var url = require('url')
var express = require('express')
var html2json = require('html2json').html2json;
app.use('/', express.static(__dirname + '/'))
app.use(express.static(__dirname + '/'))

app.get('/', function (req, res) {
    res.send(JSON.stringify({a:1}))
});

var clients = 0;
io.on('connection', function (socket) {
    console.log("connected");
    var date = new Date().getTime();
    var body = '';
    app.post('/data/push', function (req, res) {
        console.log(req.connection.remoteAddress)
        // console.log(req)
        // filePath = __dirname + `/data${date}.txt`
        req.on('data', function (data) {
            body += data;

        });

        req.on('end', function () {
            var json = html2json(body);
            console.log('json', json);

            var feed = json.child[0];
            socket.emit('data', feed);
            res.send(feed)
        })
    })

    socket.on('disconnect', function () {
        console.log("disconnected");
    });
});

http.listen(3000, function () {
    console.log('listening on localhost:3000');
});