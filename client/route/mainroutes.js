var Backbone = require('backbone');
var mainView = require('../view/mainview.js');
var userView = require('../view/userview.js');
var usersView = require('../view/usersview.js');
var headerView = require('../view/headerView.js');
var userModel = require('../model/user.js');

module.exports = Backbone.Router.extend({
  routes: {
      '': 'home',
      'user' : 'user',
      'users' : 'users'
  },
  initialize: function() {
    
  },
  home: function() {
    if (this.currView) {
      this.currView.close();
    }
    if (!this.headerView) {
      this.headerView = new headerView({model: new userModel()});
      this.headerView.render();
    }
    this.currView = new mainView({model: new userModel() });
    this.currView.render();
  },
  user: function() {
    if (this.currView) {
      this.currView.close();
    }
    if (!this.headerView) {
      this.headerView = new headerView({model: new userModel()});
      this.headerView.render();
    }
    this.currView = new userView({model: new userModel() });
    this.currView.render();
  },
  users: function() {
    if (this.currView) {
      this.currView.close();
    }
    if (!this.headerView) {
      this.headerView = new headerView({model: new userModel()});
      this.headerView.render();
    }
    this.currView = new usersView({model: new userModel() });
    this.currView.render();
  }
});

