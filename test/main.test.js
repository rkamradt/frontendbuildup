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
    it('should have an checkbox in the browser that will retain logon info (tested elsewhere)', function(){
      var checkbox = this.browser.html("input[name=rememberme]");
      should.exist(checkbox);
      checkbox.should.containEql('type="checkbox"')
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
        should.equal(self.browser.text("h2[class=form-signin-heading]"), "Logon unsuccessful. Please sign in");

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
        should.equal(self.browser.text("h2[class=form-signin-heading]"), "Logon unsuccessful. Please sign in");

      });
    });
    it('should move to the home screen if the submit button is pressed with a good email and a good password', function(){
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
        should.equal(self.browser.text("title"), "Welcome To our Webapp");

      });
    });
  });
});
