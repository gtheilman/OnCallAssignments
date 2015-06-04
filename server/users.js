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
                        Roles.addUsersToRoles(newUser._id, ['grader', 'active']);
                        return true
                    }

                }
            },
            'retrieveUser': function (id) {
                if (Roles.userIsInRole(Meteor.user(), 'active')) {
                    var user = Meteor.users.findOne({_id: id});
                    user.admin = Roles.userIsInRole(id, 'admin');
                    user.grader = Roles.userIsInRole(id, 'grader');
                    user.active = Roles.userIsInRole(id, 'active');
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
                        Roles.addUsersToRoles(user._id, ['admin', 'active']);
                    } else {
                        Roles.removeUsersFromRoles(user._id, ['admin']);
                    }
                    if (user.grader) {
                        Roles.addUsersToRoles(user._id, ['grader', 'active']);
                    } else {
                        Roles.removeUsersFromRoles(user._id, ['grader']);
                    }
                    if (user.active) {
                        Roles.addUsersToRoles(user._id, ['active']);
                    } else {
                        Roles.removeUsersFromRoles(user._id, ['admin', 'active', 'grader']);
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
                if (Roles.userIsInRole(Meteor.user(), 'active')) {
                    Accounts.sendResetPasswordEmail(_id);
                    return true
                } else {
                    return false
                }
            }


        }
    );


}
        
        
        
    
