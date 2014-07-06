var express = require('express');
var UserAPI = require('../server/user')();

var router = express.Router();
UserAPI.initialize();

router.param('email', function(req, res, next, email) {
  req.user = UserAPI.findUser(email);
  next();
});

router.route('/api/users/:email')
.get(function(req, res, next) {
console.log("routing api/users/:email GET");
    res.json(req.user);
})
.post(function(req, res, next) {
console.log("routing api/users/:email POST");
    var user = UserAPI.findUser(req.email);
    user.firstName = req.firstName || user.firstName;
    user.lastName = req.lastName || user.lastName;
    user.role = req.role || user.role;
    user = UserAPI.update(user);
    res.json(user);
})
.put(function(req, res, next) {
console.log("routing api/users/:email PUT");
    next(new Error("bad_verb"));
})
.delete(function(req, res, next) {
console.log("routing api/users/:email DELETE");
    UserAPI.deleteUser(req.email)
})

router.route('/api/users')
.get(function(req, res, next) {
console.log("routing api/users/ GET");
    res.json(UserAPI.findUsers());
})
.post(function(req, res, next) { // special case for logon?
console.log("routing api/users/ POST req = " + JSON.stringify(req.body));
    var user ={};
    user.email = req.body.email;
    user.password = req.body.password;
console.log("parameters to logon email: " + user.email + " password: " + user.password);
    user = UserAPI.logon(user.email, user.password);
    res.json(user);
})
.put(function(req, res, next) {
console.log("routing api/users/ PUT");
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
.delete(function(req, res, next) { // special case for logoff?
console.log("routing api/users/ DELETE");
    UserAPI.logoff();
    res.json({});
})

module.exports = router;