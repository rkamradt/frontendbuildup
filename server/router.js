var express = require('express');
var UserAPI = require('./user')();
var sha1 = require('sha1');

var router = express.Router();
UserAPI.initialize();

router.param('email', function(req, res, next, email) {
  try {
    req.user = UserAPI.findUser(email);
  } catch(e) {
    console.log(e.message);
  }
  next();
});

router.route('/api/users/:email')
.get(function(req, res, next) {
    if (req.session.role === 'nobody') {
      res.status(403).end();
    } else if (!req.user) {
      res.status(404).end(); // not found
    } else if (req.session.role !== 'admin' && req.session.user.email !== req.user.email) {
      res.status(403).end();
    } else {
      res.json(req.user);
    }
})
.put(function(req, res, next) {
    if (req.session.role === 'nobody') {
      res.status(403).end();
    } else if (!req.user) {
      res.status(404).end(); // not found
    } else if (req.session.role !== 'admin' && req.session.user.email !== req.user.email) {
      res.status(403).end();
    } else if (req.session.role !== 'admin' && req.session.user.role !== req.user.role) {
      res.status(403).end();
    } else {
      var user = UserAPI.findUser(req.email);
      user.firstName = req.firstName || user.firstName;
      user.lastName = req.lastName || user.lastName;
      user.role = req.role || user.role;
      try {
        user = UserAPI.update(user);
        res.json(user);
      } catch(e) {
        res.status(400).send(e.message); // all exceptions are 400 (bad request)
      }
    }
})
.post(function(req, res, next) {
    res.status(405); // bad method
})
.delete(function(req, res, next) {
    if (req.session.role === 'nobody') {
      res.status(403).end();
    } else if (!req.user) {
      res.status(404).end(); // not found
    } else if (req.session.role !== 'admin' && req.session.user.email !== req.user.email) {
      res.status(403).end();
    } else {
      try {
        UserAPI.deleteUser(req.email);
        res.status(200).end();
      } catch(e) {
        res.status(400).send(e.message); // all exceptions are 400 (bad request)
      }
    }
});

router.route('/api/users')
.get(function(req, res, next) {
    if (req.session.role !== 'admin') { // must be admin to get a list of users
      console.log('must be admin to get list of users, sending 403');
      res.status(403).end();
    } else {
      try {
        var users = UserAPI.findUsers();
        console.log('findUsers returned ' + users.toString);
        res.json(users);
      } catch(e) {
        console.log('error returned from findUsers, sending 400 message: ' + e.message);
        res.status(400).send(e.message); // all exceptions are 400 (bad request)
      }
    }
})
.post(function(req, res, next) { // special case for logon
    var user ={};
    user.email = req.body.email;
    user = UserAPI.findUser(user.email);
    if (!user) {
      console.log('log on cant find user sending 400 email: ' + req.body.email);
      res.status(400).send('bad_log_on');
    } else if (user.password !== sha1(req.body.password)) {
      console.log('log on password doesnt match, sending 400 email: ' + req.body.email);
      res.status(400).send('bad_log_on');
    } else {
      console.log('log on good returning user ' + user.toString());
      req.session.role = user.role;
      req.session.user = user;
      res.json(user);
    }
})
.put(function(req, res, next) { 
    var user ={
      email: req.email,
      password: req.password,
      firstName: req.firstName,
      lastName: req.lastName,
      role: req.role
    };
    try {
      user = UserAPI.createUser(user);
      console.log('createUser good, returning user ' + user.toString());
      res.json(user);
    } catch(e) {
      console.log('error returned from createUser, sending 400 message: ' + e.message);
      res.status(400).send(e.message); // all exceptions are 400 (bad request)
    }
})
.delete(function(req, res, next) { // special case for logoff
    if (!req.session.user) {
      console.log('not logged on error in logoff, sending 400');
      res.status(400).send('not_logged_on');
    } else {
      req.session.role = 'nobody';
      req.session.user = null;
      console.log('logoff ok, returning 200');
      res.status(200).end();
    }
});

module.exports = router;