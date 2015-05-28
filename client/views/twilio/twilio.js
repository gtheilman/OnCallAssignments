if (!Meteor.isClient) {
} else {

    // Handles the result of the user form submission
    Template.userForm.events({
        "submit #twilioForm": function (event) {
            event.preventDefault();

            if ($('#authtoken').val() == "") {
                alert('An AuthToken must be provided');
            } else if ($('#accountsid').val() == "") {
                alert('An AccountSID must be provided');
            }
            else {
                var credentials =
                {
                    accountsid: $('#accountsid').val(),
                    authtoken: $('#authtoken').val()
                };

                Meteor.call('validateTwilioCredentials', credentials);
                // Router.go('users');
            }
        }

    })
    ;


}

