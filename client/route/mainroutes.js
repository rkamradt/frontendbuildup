var Backbone = require('backbone');
var mainView = require('../view/mainview.js');

module.exports = Backbone.Router.extend({
  routes: {
      '': 'home'
  },
  initialize: function() {
    
  },
  home: function() {
    this.homeView = new mainView();
    this.homeView.render();
  }
});

