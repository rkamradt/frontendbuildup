var React = require('react');
var LogonWidget = require('./logon');

module.exports = React.createClass({
    getInitialState: function() {
        return { message: "", currUser: "" };
    },
    render: function() {
        return (
            <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" hfre="#">Like Me</a>
                    </div>
                    <div className="navbar-collapse collapes" name="navbarcontents">
                        <LogonWidget />
                    </div>
                </div>
            </div>
        );
    }
});

