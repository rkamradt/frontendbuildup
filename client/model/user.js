var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    urlRoot: "api/users",
    defaults: {
        "email":  "randy@genius.com",
        "password":     "password",
        "rememberme":    true
    }

});
