var express = require('express');
var UserAPI = require('./user')();
var sha1 = require('sha1');

var router = express.Router();
UserAPI.initialize();

router.param('email', function(req, res, next, email) {
  req.user = UserAPI.findUser(email);
  next();
});

router.route('/api/users/:email')
.get(function(req, res, next) {
    if (req.session.role === 'nobody') {
      res.send(403);
    } else if (!req.user) {
      res.send(404); // not found
    } else if (req.session.role !== 'admin' && req.session.user.email !== req.user.email) {
      res.send(403);
    } else {
      res.json(req.user);
    }
})
.put(function(req, res, next) {
    if (req.session.role === 'nobody') {
      res.send(403);
    } else if (!req.user) {
      res.send(404); // not found
    } else if (req.session.role !== 'admin' && req.session.user.email !== req.user.email) {
      res.send(403);
    } else if (req.session.role !== 'admin' && req.session.user.role !== req.user.role) {
      res.send(403);
    } else {
      var user = UserAPI.findUser(req.email);
      user.firstName = req.firstName || user.firstName;
      user.lastName = req.lastName || user.lastName;
      user.role = req.role || user.role;
      try {
        user = UserAPI.update(user);
        res.json(user);
      } catch(e) {
        res.send(400, e.message); // all exceptions are 400 (bad request)
      }
    }
})
.post(function(req, res, next) {
    res.send(405); // bad method
})
.delete(function(req, res, next) {
    if (req.session.role === 'nobody') {
      res.send(403);
    } else if (!req.user) {
      res.send(404); // not found
    } else if (req.session.role !== 'admin' && req.session.user.email !== req.user.email) {
      res.send(403);
    } else {
      try {
        UserAPI.deleteUser(req.email);
        res.send(200);
      } catch(e) {
        res.send(400, e.message); // all exceptions are 400 (bad request)
      }
    }
});

router.route('/api/users')
.get(function(req, res, next) {
    if (req.session.role !== 'admin') { // must be admin to get a list of users
      res.send(403);
    } else {
      try {
        res.json(UserAPI.findUsers());
      } catch(e) {
        res.send(400, e.message); // all exceptions are 400 (bad request)
      }
    }
})
.post(function(req, res, next) { // special case for logon
    var user ={};
    user.email = req.body.email;
    user = UserAPI.findUser(user.email);
    if (!user) {
      res.send(400, 'bad_log_on');
    } else if (user.password === sha1(req.body.password)) {
      res.send(400, 'bad_log_on');
    } else {
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
      res.json(user);
    } catch(e) {
      res.send(400, e.message); // all exceptions are 400 (bad request)
    }
})
.delete(function(req, res, next) { // special case for logoff
    if (!req.session.user) {
      res.send(400, 'not_logged_on');
    } else {
      req.session.role = 'nobody';
      req.session.user = null;
      res.send(200);
    }
});

module.exports = router;