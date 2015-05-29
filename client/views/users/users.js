if (!Meteor.isClient) {
} else {

    // Handles the result of the create user form submission
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


    Template.editUserForm.helpers({
        username: function () {
            return Session.get("username");
        },
        email: function () {
            return Session.get("email");
        },
        _id: function () {
            return Session.get("_id");
        },
        admin: function () {
            return Session.get("admin");
        },
        grader: function () {
            return Session.get("grader");
        },
        active: function () {
            return Session.get("active");
        }

    });


    Template.editUserForm.events({
        "submit #editUserForm": function (event) {
            event.preventDefault();

            if ($('#email').val() == "") {
                alert('User email address must be provided');
            } else if ($('#username').val() == "") {
                alert('A username must be provided');
            } else {

                var user =
                {
                    _id: $('#_id').val(),
                    username: $('#username').val(),
                    email: $('#email').val(),
                    active: $('#active').is(':checked'),
                    admin: $('#admin').is(':checked'),
                    grader: $('#grader').is(':checked')
                };

                Meteor.call('editUser', user);

                //clear variables used to edit user
                Session.set("username", "");
                Session.set("email", "");
                Session.set("_id", "");

                Router.go('users');
            }
        },
        'click #deleteUserButton': function (event) {
            Meteor.call('deleteUser', $('#_id').val());

            //clear variables used to edit user
            Session.set("username", "");
            Session.set("email", "");
            Session.set("_id", "");

            Router.go('users');
        },

        // if person is not 'active', all other roles are removed as well
        'change #active': function (event) {
            if (!$('#active').is(':checked')) {
                $('#admin').prop('checked', false);
                $('#grader').prop('checked', false);
            }
        },
        // if person is given a role, they also have to be 'active'
        'change #admin': function (event) {
            if ($('#admin').is(':checked')) {
                $('#active').prop('checked', true);
            }
        },
        // if person is given a role, they also have to be 'active'
        'change #grader': function (event) {
            if ($('#grader').is(':checked')) {
                $('#active').prop('checked', true);
            }
        }

    });

    // Delete User function is called in routes.js file
    // Send User password rest link function is called in routes.js file


}

