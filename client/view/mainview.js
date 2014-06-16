var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el:'body',
  template: _.template('Hello World'),
  render: function() {
    this.$el.html(this.template({}));
  } 
});
