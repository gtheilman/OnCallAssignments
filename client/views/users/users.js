if (!Meteor.isClient) {
} else {

    // Handles the result of the user form submission
    Template.userForm.events({
        "submit #userForm": function (event) {
            event.preventDefault();

            if ($('#email').val() == "") {
                alert('User email address must be provided');
            } else if ($('#password').val() == "") {
                alert('User password must be provided');
            } else if ($('#username').val() == "") {
                alert('A username must be provided');
            } else {

                var user =
                {
                    username: $('#username').val(),
                    email: $('#email').val(),
                    password: $('#password').val(),
                    createdAt: new Date()
                };

                Meteor.call('createNewUser', user);
                Router.go('users');
            }
        }

    });


    // Delete User function is called in routes.js file
    // Send User password rest link function is called in routes.js file


}

