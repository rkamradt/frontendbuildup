var Browser = require("zombie");
require('should');

describe('Main', function(){
  describe('#index', function(){
    var browser;
    before(function(done) {
      this.browser = new Browser();
      this.browser
        .visit("http://localhost:9999/index.html")
        .then(done, done);
    });
    it('should display "Hello World" in the browser', function(){
      this.browser.html("body").should.equal("<body>Hello World</body>");
    });
  });
});
