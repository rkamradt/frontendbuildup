var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return { message: "", currUser: "" };
    },
    render: function() {
        if (this.state.currUser) {
              return (
                  <div className="nav-brand navbar-right" name="logonform">Welcome {this.state.currUser}</div>
              );
        } else {
              return (
                  <form className="navbar-form navbar-right" name="logonform">
                      <div className="form-group">
                          <input className="form-control" name="email" type="email" placeholder="Email address" required='true' />
                      </div>  
                      <div className="form-group">
                          <input class="form-control" name="password" type="password" placeholder="Password" required='true' />
                      </div>
                      <button className="btn btn-success" type="submit" name="logon">Sign In</button>
                      <div className="form-group" name="logonmessage">{this.state.message}</div>
                  </form>
              );
        }
    }
});

