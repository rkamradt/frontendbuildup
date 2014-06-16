var express = require('express');
var path = require('path');
var http = require('http');
var app = express();

app.use('/', express.static(path.join(__dirname, 'dist')));

http.createServer(app).listen(9999, function() {
    console.log('Server up: http://localhost:' + 9999);
});
