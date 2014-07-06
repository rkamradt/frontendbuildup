var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  
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
  logon: function() {
//    this.model.set({
//      email: $('input[name=email').val(),
//      password: $('input[name=password]').val(),
//      rememberme: $('input[name=rememberme]').val(),
//    });
    this.model.save();
    return false;
  },

  events: {
    "click button[name=logon]": "logon"
  },

});
