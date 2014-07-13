var should = require('should');
var sha1 = require('sha1');
var User = require('../server/user');


describe('UserAPI', function(){
  var UserAPI;
  var self = this;
  beforeEach(function(done) {
    self.UserAPI = User();
    self.UserAPI.initialize();
    done(); // when we use a database, all of this will need to be asynchronous
  });
  afterEach(function(done) {
    done(); // when we use a database, all of this will need to be asynchronous
  });
  describe('#createUser', function(){
    it('should be able to create a user given a email, password, firstname, and lastname' , function(){
        var sut = self.UserAPI.createUser("joker@genius.com", "joker", "The", "Joker");
        sut.email.should.eql("joker@genius.com");
        sut.password.should.eql(sha1('joker'));
        sut.firstName.should.eql("The");
        sut.lastName.should.eql("Joker");
        sut.role.should.eql("nobody"); // default role
    });
    it('should fail creating a user if the email already exists' , function(){
        try {
            var sut = self.UserAPI.createUser("randy@genius.com", "joker", "The", "Joker");
            throw new Error("excpected exception email_already_exists not thrown");
        } catch(e) {
            e.message.should.eql("email_already_exists_in_createUser");   
        }
    });
    it('should fail creating a user without an email' , function(){
        try {
            var sut = self.UserAPI.createUser("", "joker", "The", "Joker");
            throw new Error("excpected exception email_required_in_createUser not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_createUser");   
        }
    });
    it('should fail creating a user without a password' , function(){
        try {
            var sut = self.UserAPI.createUser("joker1@genius.com", "", "The", "Joker");
            throw new Error("excpected exception password_required_in_createUser not thrown");
        } catch(e) {
            e.message.should.eql("password_required_in_createUser");   
        }
    });
  });
  describe('#update', function(){
    it('should be able to update my user info except for email and password', function(){ // for now only firstname and lastname are changeable by the user, password will be a special case
        var sut = self.UserAPI.findUser("randy@genius.com");
        sut.firstName = 'Randal';
        self.UserAPI.update(sut);
        sut = self.UserAPI.findUser("randy@genius.com");
        sut.firstName.should.eql("Randal");
        sut.lastName = 'Conradt';
        self.UserAPI.update(sut);
        sut = self.UserAPI.findUser("randy@genius.com");
        sut.lastName.should.eql("Conradt");
    });
    it('should fail update if user changes their password (handled specially)' , function(){
        try {
            var sut = self.UserAPI.findUser("randy@genius.com");
            sut.password = 'anotherpassword';
            self.UserAPI.update(sut);
            throw new Error("excpected exception cannot_update_password not thrown");
        } catch(e) {
            e.message.should.eql("cannot_update_password");   
            sut = self.UserAPI.findUser("randy@genius.com");
            sut.password.should.eql(sha1('password'));
        }
    });
  });
  describe('#findUsers', function(){
    it('should be able to list of user accounts filtered by a set of criteria' , function(){ // ignoring criteria for now
        var sut = self.UserAPI.findUsers();
        sut.should.not.be.empty;
    });
  });
  describe('#findUser', function(){
    it('should be able to see all the details of a user account except the password' , function(){
        var sut = self.UserAPI.findUser("randy@genius.com");
        sut.email.should.eql("randy@genius.com");
        sut.firstName.should.eql("Randy");
        sut.lastName.should.eql("Kamradt");
        sut.role.should.eql("nobody");
    });
    it('should fail if trying to delete a non-existing email' , function(){
        try {
            sut = self.UserAPI.findUser(); // case no email 
            throw new Error("excpected exception email_required_in_findUser not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_findUser");   
        }
    });
    it('should fail if trying to find a null user' , function(){
        try {
            sut = self.UserAPI.findUser(); // case no email 
            throw new Error("excpected exception email_required_in_findUser not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_findUser");   
        }
    });
    it('should be able to store the password in an encrypted format', function(){
        
        var sut = self.UserAPI.findUser('randy@genius.com');
        sut.password.should.not.eql("password");
    });
  });
  describe('#updatePassword', function(){
    it('should be able to change the password of a user account should the user forget it' , function(){ 
        self.UserAPI.updatePassword("randy@genius.com", 'password', 'password1');
        var sut = self.UserAPI.findUser("randy@genius.com");
        sut.password.should.eql(sha1("password1"));
    });
  });
  describe('#deleteUser', function(){
    it('should be able to delete a user account', function(){
        var sut = self.UserAPI.createUser("randy1@genius.com", "password");
        sut.should.exist
        self.UserAPI.deleteUser("randy1@genius.com");
        sut = self.UserAPI.findUser("randy1@genius.com");
        should.not.exist(sut);
    });
    it('should fail if email does not exist or is null in deleteUser', function(){
        try {
            self.UserAPI.deleteUser("randy1@genius.com");
            throw new Error("expected exception email_doesnt_exist_in_deleteUser not thrown")
        } catch(e) {
            e.message.should.eql("email_doesnt_exist_in_deleteUser");   
        }
        try {
            self.UserAPI.deleteUser();
            throw new Error("expected exception email_doesnt_exist_in_deleteUser not thrown")
        } catch(e) {
            e.message.should.eql("email_doesnt_exist_in_deleteUser");   
        }
    });
  });
});  

    