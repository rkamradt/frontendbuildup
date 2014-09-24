var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  initialize: function() {
  },
  
  el:'body',
  render: function() {
    this.$el.append($("<div />", { "class": "container" }).
      append($("<div />", { "class": "hero-unit" }).
        append($("<h1 />").html("Like Me")).
        append($("<p />").html("This is the users view")).
        append($("<p />").
          append($("<a />", { "class": "btn btn-primary btn-large", "name": "more" }).html("Learn more &raquo;")))));
  },
  learnMore: function() {
    alert("link clicked");
    return false;
  },

  events: {
    "click a[name=more]": "learnMore"
  }

});
