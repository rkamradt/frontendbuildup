var Browser = require("zombie");
var should = require('should');

describe('Main', function(){
  describe('#index', function(){
    var browser;
    var self;
    before(function(done) {
      self = this;
      this.browser = new Browser();
      this.browser
        .visit("http://localhost:9999/index.html")
        .then(done, done);
    });
    it('should have an email input field in the browser that is required', function(){
      var email = this.browser.html("input[name=email]");
      should.exist(email);
      email.should.containEql('required')
      email.should.containEql('type="email"')
    });
    it('should have an password input field in the browser that is required', function(){
      var password = this.browser.html("input[name=password]");
      should.exist(password);
      password.should.containEql('required');
      password.should.containEql('type="password"');
    });
    it('should have a submit button that will submit the form', function(){
      var button = this.browser.html("button");
      should.exist(button);
      button.should.containEql('type="submit"')
    });
    it('should have display an error message if the submit button is pressed with a bad email', function(){
      var email = this.browser.html("input[name=email]");
      should.exist(email);
      var password = this.browser.html("input[name=password]");
      should.exist(password);
      var button = this.browser.html("button");
      should.exist(button);
      this.browser.fill("email", "bad@bad.com").
      fill("password", "badaswell").
      pressButton("logon", function() {
        should.exist(self.browser.success);
        should.exist(self.browser.html("div[name=logonmessage]"));
//        should.equal(self.browser.text("div[name=logonmessage]"), "Unsuccessful logon, please try again");

      });
    });
    it('should have display an error message if the submit button is pressed with a good email but bad password', function(){
      var email = this.browser.html("input[name=email]");
      should.exist(email);
      var password = this.browser.html("input[name=password]");
      should.exist(password);
      var button = this.browser.html("button");
      should.exist(button);
      this.browser.fill("email", "admin@genius.com").
      fill("password", "badaswell").
      pressButton("logon", function() {
        should.exist(self.browser.success);
        should.exist(self.browser.html("div[name=logonmessage]"));
//        should.equal(self.browser.text("div[name=logonmessage]"), "Unsuccessful logon, please try again");

      });
    });
    it('should replace the logon form with welcome message if the submit button is pressed with a good email and a good password', function(){
      var email = this.browser.html("input[name=email]");
      should.exist(email);
      var password = this.browser.html("input[name=password]");
      should.exist(password);
      var button = this.browser.html("button");
      should.exist(button);
      this.browser.fill("email", "admin@genius.com").
      fill("password", "admin").
      pressButton("logon", function() {
        should.exist(self.browser.success);
        should.exist(self.browser.html("div[name=logonform]"));
        should.equal(self.browser.text("div[name=logonform]"), "Welcome admin@genius.com");

      });
    });
  });
});
