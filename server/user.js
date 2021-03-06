var sha1 = require('sha1');


module.exports = function() {
    return {
        _users: null,
        initialize: function() {
            this.createUser("admin@genius.com", 'admin', 'Admin', 'Admin');
            this.createUser("randy@genius.com", 'password', 'Randy', 'Kamradt');
            this.createUser("info@genius.com", 'info', 'Info', 'Info');
        },
        createUser: function(email, password, firstName, lastName) {
            var user = this._internalFindUser(email);
            if (user) {
                throw new Error("email_already_exists_in_createUser");
            }
            if (!email) {
                throw new Error("email_required_in_createUser");
            }
            if (!password) {
                throw new Error("password_required_in_createUser");
            }
            user = {
                email: email,
                password: sha1(password),
                firstName: firstName,
                lastName: lastName,
                role: "nobody",
                toString: function() { return this.email; }
            };
            if (!this._users) { // make the first user an admin
                user.role = 'admin';
                this._users = [user];
            } else {
                this._users.push(user);
            }
            return this._cloneUser(user);
        },
        findUser: function(email) {
            if (!email) {
                throw new Error("email_required_in_findUser");
            }
            return this._cloneUser(this._internalFindUser(email));
        },
        findUsers: function() {
            var ret = null;
            for (var i = 0; i < this._users.length; i++) {
                var value = this._users[i];
                if (!ret) {
                    ret = [this._cloneUser(value)];
                } else {
                    ret.push(this._cloneUser(value));
                }
            }
            return ret;
        },
        update: function(user) {
            var from = this._internalFindUser(user.email);
            // expect user.password to be hashed (returned from findUser) if it's unhash, it wont match anyway
            if (from.password !== user.password) {
                throw new Error("cannot_update_password");
            }
            for (var i in user) { // have to fix this if user has more than one level
                from[i] = user[i];
            }
            return this._cloneUser(from);

        },
        updatePassword: function(email, oldpassword, password) {
            if (!email) {
                throw new Error("email_required_in_updatePassword");
            }
            if (!password) {
                throw new Error("password_required_in_updatePassword");
            }
            var user = this._internalFindUser(email);
            if (!user) {
                throw new Error("email_doesnt_exist_in_updatePassword");
            }
            user.password = sha1(password);
            return this._cloneUser(user);
        },
        deleteUser: function(email) {
            var user = this._internalFindUser(email);
            if (!user) {
                throw new Error("email_doesnt_exist_in_deleteUser");
            }
            var i = this._users.indexOf(user);
            this._users.splice(i, 1);
        },
        _internalFindUser: function(email) {
            if (!this._users) {
                return null;
            }
            var user = null;
            for (var i = 0; i < this._users.length; i++) {
                var value = this._users[i];
                if (value.email === email) {
                    user = value;
                }
            }
            return user;
        },
        _cloneUser: function(user) {
            if (!user) {
                return null;
            }
            var copy = {};
            for (var i in user) { // have to fix this if user has more than one level
                copy[i] = user[i];
            }
            return copy;
         }
        
    };
};
