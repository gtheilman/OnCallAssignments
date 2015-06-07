if (Meteor.isServer) {

    Meteor.methods({
            'createNewUser': function (user) {
                if (Roles.userIsInRole(Meteor.user(), 'admin')) {
                    Accounts.createUser({
                        username: user.username,
                        email: user.email,
                        password: user.password
                    });

                    var newUser = Meteor.users.findOne({username: user.username});

                    if (newUser) {
                        Roles.addUsersToRoles(newUser._id, ['grader']);
                        return true
                    }

                }
            },
            'retrieveUser': function (id) {
                if (Roles.userIsInRole(Meteor.user(), 'admin')) {
                    var user = Meteor.users.findOne({_id: id});
                    user.admin = Roles.userIsInRole(id, 'admin');
                    user.grader = Roles.userIsInRole(id, 'grader');
                    return user
                }
            },
            'editUser': function (user) {
                if (Roles.userIsInRole(Meteor.user(), 'admin')) {
                    Meteor.users.update(
                        {_id: user._id},
                        {
                            $set: {
                                username: user.username,
                                emails: [{address: user.email}]
                            }
                        }
                    );
                    if (user.admin) {
                        Roles.addUsersToRoles(user._id, ['admin']);
                    } else {
                        Roles.removeUsersFromRoles(user._id, ['admin']);
                    }
                    if (user.grader) {
                        Roles.addUsersToRoles(user._id, ['grader']);
                    } else {
                        Roles.removeUsersFromRoles(user._id, ['grader']);
                    }
                }
            },

            'deleteUser': function (id) {
                if (Roles.userIsInRole(Meteor.user(), 'admin')) {
                    var adminId = Meteor.users.findOne({username: 'admin'});
                    if (id == adminId) {
                        return
                    } else {
                        Meteor.users.remove(
                            {
                                _id: id
                            }
                        )
                    }
                } else {
                    return
                }
            },
            'passwordUser': function (_id) {
                if (Roles.userIsInRole(Meteor.user(), 'admin')) {
                    Accounts.sendResetPasswordEmail(_id);
                    return true
                } else {
                    return false
                }
            }


        }
    );


}
        
        
        
    
