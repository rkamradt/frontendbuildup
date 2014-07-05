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
    self.UserAPI.logoff();
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
  describe('#logon', function(){
    it('should be able to log on to the system with my name and password', function(){
        var sut = self.UserAPI.logon("randy@genius.com", "password");
        self.UserAPI.isLoggedon("randy@genius.com").should.be.true;
    });
    it('should fail logon with generic message if email not found' , function(){
        try {
            self.UserAPI.logon("nobody@nowhere.com", "password"); // case wrong email
            throw new Error("excpected exception bad_logon_1 not thrown");
        } catch(e) {
            e.message.should.eql("bad_logon_1");   
        }
    });
    it("should fail logon with generic message is password doesn't match user" , function(){
        try {
            self.UserAPI.logon("admin@genius.com", "password"); // case wrong pass word, 
            throw new Error("excpected exception bad_logon_2 not thrown");
        } catch(e) {
            e.message.should.eql("bad_logon_2");   
        }
    });
    it('should fail logon with no email' , function(){
        try {
            self.UserAPI.logon("", "password"); // case no email, 
            throw new Error("excpected exception email_required_in_logon not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_logon");   
        }
    });
    it('should fail logon with no password' , function(){
        try {
            self.UserAPI.logon("admin@genius.com"); // case no password, 
            throw new Error("excpected exception password_required_in_logon not thrown");
        } catch(e) {
            e.message.should.eql("password_required_in_logon");   
        }
    });
  });
  describe('#isLoggedon', function(){
    it('should return false if isLoggedon is call with a user that is not logged on' , function(){
        self.UserAPI.isLoggedon('admin@genius.com').should.be.false;
    });
    it('should return trueif isLoggedon is call with a user that is logged on' , function(){
        self.UserAPI.logon("randy@genius.com", "password");
        self.UserAPI.isLoggedon('admin@genius.com').should.be.false;
    });
    it('should fail isLoggedon with no email' , function(){
        try {
            self.UserAPI.isLoggedon(); // case no email, 
            throw new Error("excpected exception email_required_in_isLoggedon not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_isLoggedon");   
        }
    });
  });
  describe('#update', function(){
    it('should be able to update my user info except for email, password and role', function(){ // for now only firstname and lastname are changeable by the user, password will be a special case
        var sut = self.UserAPI.logon("randy@genius.com", "password");
        sut.firstName = 'Randal';
        self.UserAPI.update(sut);
        sut = self.UserAPI.findUser("randy@genius.com");
        sut.firstName.should.eql("Randal");
        sut.lastName = 'Conradt';
        self.UserAPI.update(sut);
        sut = self.UserAPI.findUser("randy@genius.com");
        sut.lastName.should.eql("Conradt");
    });
    it('should fail update if not logged on' , function(){
        try {
            var sut = self.UserAPI.createUser("randy2@genius.com", "password2");
            sut.firstName = "Randal";
            console.log("trying to update " + sut);
            self.UserAPI.update(sut); // case not logged on, 
            throw new Error("excpected exception must_be_logged_on_to_update not thrown");
        } catch(e) {
            e.message.should.eql("must_be_logged_on_to_update");   
        }
    });
    it('should fail update if not logged on as self' , function(){
        try {
            self.UserAPI.logon("randy@genius.com", "password");
            var sut = self.UserAPI.createUser("randy2@genius.com", "password2");
            sut.firstName = "Randal";
            self.UserAPI.update(sut); // case not updating another person while not logged on as admin, 
            throw new Error("excpected exception user_must_be_logged_on_or_admin_to_update not thrown");
        } catch(e) {
            e.message.should.eql("user_must_be_logged_on_or_admin_to_update");   
        }
    });
    it('should fail update if user changes their role (only admin can change role)' , function(){
        try {
            var sut = self.UserAPI.logon("randy@genius.com", "password");
            sut.role = 'god';
            self.UserAPI.update(sut);
            throw new Error("excpected exception only_admin_can_change_role not thrown");
        } catch(e) {
            e.message.should.eql("only_admin_can_change_role");   
            sut = self.UserAPI.findUser("randy@genius.com");
            sut.role.should.eql("nobody");
        }
    });
    it('should fail update if user changes their password (handled specially)' , function(){
        try {
            var sut = self.UserAPI.logon("randy@genius.com", "password");
            sut.password = 'password';
            self.UserAPI.update(sut);
            throw new Error("excpected exception cannot_update_password not thrown");
        } catch(e) {
            e.message.should.eql("cannot_update_password");   
            sut = self.UserAPI.findUser("randy@genius.com");
            sut.password.should.eql(sha1('password'));
        }
    });
  });
  describe('#logoff', function(){
    it('should be able to logoff my user account', function(){
        var sut = self.UserAPI.logon("randy@genius.com", "password");
        sut.should.exist;
        self.UserAPI.logoff();
        self.UserAPI.isLoggedon("randy@genius.com").should.be.false;
    });
  });
  describe('#findUsers', function(){
    it('should be able to list of user accounts filtered by a set of criteria' , function(){ // ignoring criteria for now
        self.UserAPI.logon("admin@genius.com", "admin");
        var sut = self.UserAPI.findUsers();
        sut.should.not.be.empty;
    });
    it('should be able to see all the details of a user account except the password' , function(){
        self.UserAPI.logon("admin@genius.com", "admin");
        var sut = self.UserAPI.findUser("randy@genius.com");
        sut.email.should.eql("randy@genius.com");
        sut.firstName.should.eql("Randy");
        sut.lastName.should.eql("Kamradt");
        sut.role.should.eql("nobody");
    });
  });
  describe('#findUser', function(){
    it('should fail if trying to delete a non-existing email' , function(){
        try {
            sut = self.UserAPI.findUser(); // case no email 
            throw new Error("excpected exception email_required_in_findUser not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_findUser");   
        }
    });
    it('should fail if trying to find a null user' , function(){
        self.UserAPI.logon("info@genius.com", "info");
        try {
            sut = self.UserAPI.findUser(); // case no email 
            throw new Error("excpected exception email_required_in_findUser not thrown");
        } catch(e) {
            e.message.should.eql("email_required_in_findUser");   
        }
    });
    it('should be able to store the password in an encrypted format', function(){
        
        var sut = self.UserAPI.logon('randy@genius.com', "password");
        sut.password.should.not.eql("password");
    });
  });
  describe('#updatePassword', function(){
    it('should be able to change the password of a user account should the user forget it' , function(){ 
        self.UserAPI.logon("admin@genius.com", "admin");
        var sut = self.UserAPI.findUser("randy@genius.com", "password");
        self.UserAPI.updatePassword(sut, 'password', 'password1');
        sut = self.UserAPI.findUser("randy@genius.com");
        sut.password.should.eql(sha1("password1"));
    });
  });
  describe('#deleteUser', function(){
    it('should be able to delete any account if logged on as admin' , function(){ // ignoring criteria for now
        self.UserAPI.logon("admin@genius.com", "admin");
        var sut = self.UserAPI.createUser("joker@genius.com", "joker", "The", "Joker");
        sut = self.UserAPI.findUser("joker@genius.com"); // make sure it was actaully created
        sut.should.exist;
        self.UserAPI.deleteUser("joker@genius.com");
        sut = self.UserAPI.findUser("joker@genius.com"); // make sure it was actaully created
        should.not.exist(sut);        
    });
    it('should be able to delete my own user account', function(){
        var sut = self.UserAPI.createUser("randy1@genius.com", "password");
        sut.should.exist
        self.UserAPI.logon("randy1@genius.com", "password")
        self.UserAPI.deleteUser("randy1@genius.com");
        try {
            sut = self.UserAPI.findUser("randy1@genius.com");
            throw new Error("expected exception must_be_logged_on_as_self_or_admin_in_findUser not thrown")
        } catch(e) {
            e.message.should.eql("must_be_logged_on_as_self_or_admin_in_findUser");   
        }
    });
    it('should fail if email does not exist or is null in deleteUser', function(){
        try {
            self.UserAPI.logon("admin@genius.com", "admin"); 
            self.UserAPI.deleteUser("randy1@genius.com");
            throw new Error("expected exception email_doesnt_exist_in_deleteUser not thrown")
        } catch(e) {
            e.message.should.eql("email_doesnt_exist_in_deleteUser");   
        }
        try {
            self.UserAPI.logon("randy@genius.com", "password"); // logon to non-admin account
            self.UserAPI.deleteUser();
            throw new Error("expected exception email_doesnt_exist_in_deleteUser not thrown")
        } catch(e) {
            e.message.should.eql("email_doesnt_exist_in_deleteUser");   
        }
    });
    it('should fail trying to delete a user other than me if Im not logged on as admin', function(){
        try {
            self.UserAPI.logon("randy@genius.com", "password"); // logon to non-admin account
            self.UserAPI.deleteUser("admin@genius.com");
            throw new Error("expected exception can_only_delete_self_or_logged_on_as_admin_role_not_thrown")
        } catch(e) {
            e.message.should.eql("can_only_delete_self_or_logged_on_as_admin_role_not_thrown");   
        }
    });
  });
});  

    