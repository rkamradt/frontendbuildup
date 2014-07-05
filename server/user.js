var sha1 = require('sha1');


module.exports = function() {
    return {
        _loggedOnUser: null,
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
        logon: function(email, password) {
            if (!email) {
                throw new Error("email_required_in_logon");
            }
            if (!password) {
                throw new Error("password_required_in_logon");
            }
            var user = this._internalFindUser(email);
            if (!user) {
                throw new Error("bad_logon_1");
            }
            if (sha1(password) != user.password) {
                throw new Error("bad_logon_2");
            }
            this._loggedOnUser = user;
            return this._cloneUser(user);
        },
        isLoggedon: function(email) {
            if (!email) {
                throw new Error("email_required_in_isLoggedon");
            }
            var user = this._internalFindUser(email);
            return this._loggedOnUser === user;    
        },
        update: function(user) {
            if (!this._loggedOnUser) {
                throw new Error("must_be_logged_on_to_update");
            }
            if (user.email != this._loggedOnUser.email && this._loggedOnUser.role != 'admin') {
                throw new Error("user_must_be_logged_on_or_admin_to_update");
            }
            var from = this._internalFindUser(user.email);
            if (from.email != user.email) {
                throw new Error("cannot_update_email");
            }
            // expect user.password to be hashed (returned from findUser) if it's unhash, it wont match anyway
            if (from.password != user.password) {
                throw new Error("cannot_update_password");
            }
            if (this._loggedOnUser.role != "admin" && from.role != user.role) {
                throw new Error("only_admin_can_change_role");
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
        logoff: function() {
            this._loggedOnUser = null;  
        },
        deleteUser: function(email) {
            var user = this._internalFindUser(email);
            if (!user) {
                throw new Error("email doesn't exist in updatePassword");
            }
            if (this._loggedOnUser.role != 'admin' && this._loggedOnUser.email != email) {
                throw new Error("can only delete self or logged on as admin role")
            }
            var i = this._users.indexOf(user);
            this._users.splice(i, 1);
            if (this._loggedOnUser.email == email) {
                this._loggedOnUser = null;
            }
        },
        _internalFindUser: function(email) {
            if (!this._users) {
                return null;
            }
            var user = null;
            for (var i = 0; i < this._users.length; i++) {
                var value = this._users[i];
                if (value.email == email) {
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
