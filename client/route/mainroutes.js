var Backbone = require('backbone');
var mainView = require('../view/mainview.js');
var userModel = require('../model/user.js');

module.exports = Backbone.Router.extend({
  routes: {
      '': 'home'
  },
  initialize: function() {
    
  },
  home: function() {
    this.homeView = new mainView({model: new userModel() });
    this.homeView.render();
  }
});

