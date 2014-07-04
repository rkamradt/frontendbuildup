var _ = require('underscore');   // set up the underscore global handle.  _ is the convention
var $ = require('jquery');
var Backbone = require('backbone');

/**
 *    <div class="container">

      <form class="form-signin" role="form">
        <h2 class="form-signin-heading">Please sign in</h2>
        <input type="email" class="form-control" placeholder="Email address" required autofocus>
        <input type="password" class="form-control" placeholder="Password" required>
        <label class="checkbox">
          <input type="checkbox" value="remember-me"> Remember me
        </label>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>

    </div> <!-- /container -->
*/



module.exports = Backbone.View.extend({
  el:'body',
  render: function() {
    this.$el.
      append($("<div />", { "class": "container" }).
        append($("<form />", { "class": "form-signin", "role": "form"}).
          append($("<h2 />", {"class": "form-signin-heading"}).html("Please sign in")).
          append($("<input />", { "type": "email", "class": "form-control", "placeholder": "Email address", "required": true, "autofocus": true })).
          append($("<input />", { "type": "password", "class": "form-control", "placeholder": "Password", "required": true })).
          append($("<label />", { "class": "checkbox" }).
            append($("<input />", { "type": "checkbox", "value": "remember-me"})).
            append($("<span />").html("Remember me"))).
          append($("<button />", { "class": "btn btn-lg btn-primary btn-block", "type": "submit"}).html("Sign in"))));
      /*
        <input type="email" class="form-control" placeholder="Email address" required autofocus>
        <input type="password" class="form-control" placeholder="Password" required>
        <label class="checkbox">
          <input type="checkbox" value="remember-me"> Remember me
        </label>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        */
  } 
});
