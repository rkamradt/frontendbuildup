var express = require('express');
var path = require('path');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var router = require('./server/router');
var morgan = require('morgan');
var session = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

app.use(session({
  keys: ['topsecret', 'needtoknow'],
}));

app.use(function (req, res, next) {
  if (req.session.isNew) {
    req.session.role = "nobody";
    console.log("creating a new session setting role to nobody");
  } else {
    console.log("session already established, role = "+ req.session.role);
  }
  next();
});


app.use(methodOverride());
app.use(morgan("dev", { format: 'dev', immediate: true }));
app.use(router);
app.use('/', express.static(path.join(__dirname, 'dist')));

http.createServer(app).listen(9999, function() {
    console.log('Server up: http://localhost:' + 9999);
});
