var Browser = require("zombie");
var should = require('should');

describe('Main', function(){
  describe('#index', function(){
    var browser;
    before(function(done) {
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
    it('should have a submit button that will submit the form (tested elsewhere)', function(){
      var button = this.browser.html("button");
      should.exist(button);
      button.should.containEql('type="submit"')
    });
  });
});
