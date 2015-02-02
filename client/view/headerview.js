var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var HeaderWidget = require('../component/header');

module.exports = Backbone.View.extend({
  initialize: function() {
  },
  
  el:'body',
  template: '<div class="widget-container"></div>',
  render: function() {
    this.$el.html(this.template);
    React.renderComponent(new HeaderWidget(), this.$('.widget-container').get(0));
    return this;
  },
  logonSuccess: function(model, response, options) {
    window.currUser = options.view.model;
    $('form[name=logonform]').replaceWith(options.view.createUserPanel());
  },
  logonFailure: function(model, response, options) {
    $('form[name=logonform]').replaceWith(options.view.createUserPanel("Unsuccessful logon, please try again"));
  },
  logon: function() {
    this.model.save(
      {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
        rememberme: $('input[name=rememberme]').val()
      },
      {
        success: this.logonSuccess, error: this.logonFailure,
        view: this
      }
    );
    return false;
  },

  events: {
    "click button[name=logon]": "logon"
  },
  createUserPanel: function(message) {
    if (window.currUser) {
      return $("<div />", { "class": "navbar-brand navbar-right", "name": "logonform" }).
        html("Welcome " + window.currUser.get("email"));
    } else {
      if (!message) {
        message = "";
      }
      return $("<form />", { "class": "navbar-form navbar-right", "name": "logonform" }).
              append($("<div />", { "class": "form-group" }).
                append($("<input />", { "class": "form-control", "name": "email", "type": "email", "placeholder": "Email address", "required": true }))).
              append($("<div />", { "class": "form-group" }).
                append($("<input />", { "class": "form-control", "name": "password", "type": "password", "placeholder": "Password", "required": true }))).
              append($("<button />", { "class": "btn btn-success", "type": "submit", "name": "logon" }).html("Sign in")).
              append($("<div />", { "class": "form-group", "style": "color: white", "name": "logonmessage" }).html(message));
    }
  }
});