var express = require('express');
var UserAPI = require('./user')();

var router = express.Router();
UserAPI.initialize();

router.param('email', function(req, res, next, email) {
  req.user = UserAPI.findUser(email);
  next();
});

router.route('/api/users/:email')
.get(function(req, res, next) {
    res.json(req.user);
})
.put(function(req, res, next) {
    var user = UserAPI.findUser(req.email);
    user.firstName = req.firstName || user.firstName;
    user.lastName = req.lastName || user.lastName;
    user.role = req.role || user.role;
    user = UserAPI.update(user);
    res.json(user);
})
.post(function(req, res, next) {
    next(new Error("bad_verb"));
})
.delete(function(req, res, next) {
    UserAPI.deleteUser(req.email)
})

router.route('/api/users')
.get(function(req, res, next) {
    res.json(UserAPI.findUsers());
})
.post(function(req, res, next) { 
    var user ={};
    user.email = req.body.email;
    user.password = req.body.password;
    user = UserAPI.logon(user.email, user.password);
    res.json(user);
})
.put(function(req, res, next) { // special case for logon
    var user ={
        email: req.email,
        password: req.password,
        firstName: req.firstName,
        lastName: req.lastName,
        role: req.role
    }
    user = UserAPI.createUser(user);
    res.json(user);
})
.delete(function(req, res, next) { // special case for logoff
    UserAPI.logoff();
    res.json({});
})

module.exports = router;