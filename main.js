var $ = require('jquery');       // set up the jquery global handle.  $ is the convention
var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var Backbone = require('backbone');
Backbone.$ = $;  // give Backbone the global handle to jquery (just in case is isn't $)

var router = Backbone.Router.extend({
  routes: {
      '': 'home'
  },
  initialize: function() {
    
  },
  home: function() {
    this.homeView = new homeView();
    this.homeView.render();
  }
});
var homeView = Backbone.View.extend({
  el:'body',
  template: _.template('Hello World'),
  render: function() {
    this.$el.html(this.template({}));
  } 
});
var app;
$(document).ready(function() {
  app = new router();
  Backbone.history.start();
});
