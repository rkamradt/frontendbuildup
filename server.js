var express = require('express');
var path = require('path');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var router = require('./server/router');
var morgan = require('morgan');

app.use(bodyParser.urlencoded({extended: true}))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride());
app.use(morgan({ format: 'dev', immediate: true }));
app.use(router);
app.use('/', express.static(path.join(__dirname, 'dist')));

http.createServer(app).listen(9999, function() {
    console.log('Server up: http://localhost:' + 9999);
});
