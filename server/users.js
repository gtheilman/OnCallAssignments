if (Meteor.isServer) {
    Meteor.methods({

        'createNewUser': function (user) {
            Accounts.createUser({
                username:user.username,
                email: user.email,
                password: user.password
            })
        },
        'deleteUser': function(id) {
            Meteor.users.remove (
                {
                    _id: id
                }

            )
        },
        'passwordUser': function(id) {

            Accounts.sendResetPasswordEmail(id);
        }



    });
}
        
        
        
    
