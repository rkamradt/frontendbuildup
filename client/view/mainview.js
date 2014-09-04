var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  initialize: function() {
  },
  
  el:'body',
  render: function() {
    this.$el.
      append($("<div />", { "class": "container" }).
        append($("<form />", { "class": "form-signin", "role": "form"}).
          append($("<h2 />", {"class": "form-signin-heading"}).html("Please sign in")).
          append($("<input />", { "name": "email", "type": "email", "class": "form-control", "placeholder": "Email address", "required": true, "autofocus": true })).
          append($("<input />", { "name": "password", "type": "password", "class": "form-control", "placeholder": "Password", "required": true })).
          append($("<label />", { "class": "checkbox" }).
            append($("<input />", { "name": "rememberme", "type": "checkbox", "value": "remember-me"})).
            append($("<span />").html("Remember me"))).
          append($("<button />", { "class": "btn btn-lg btn-primary btn-block", "type": "submit", "name": "logon" }).html("Sign in"))));
  },
  logonSuccess: function() {
    alert("good logon, we should navigate somewhere");
  },
  logonFailure: function() {
    $('h2[class=form-signin-heading]').html("Logon unsuccessful. Please sign in");
  },
  logon: function() {
    this.model.save(
      {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
        rememberme: $('input[name=rememberme]').val()
      },
      {
        success: this.logonSuccess, error: this.logonFailure
      }
    );
    return false;
  },

  events: {
    "click button[name=logon]": "logon"
  }

});
