var $ = require('jquery');       // set up the jquery global handle.  $ is the convention
var Backbone = require('backbone');
Backbone.$ = $;  // give Backbone the global handle to jquery (just in case is isn't $)
var router = require('./route/mainroutes');

$(document).ready(function() {
  app = new router();
  Backbone.history.start();
});