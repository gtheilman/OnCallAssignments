if (!Meteor.isClient) {
} else {

    Template.twilioForm.helpers({
        credentialValidityCheck: function () {
            return Session.get("credentialValidityCheck");
        }
    });

    // Handles the result of the user (faculty) form submission
    Template.twilioForm.events({
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

                Meteor.call("validateTwilioCredentials", credentials, function (error, result) {
                    if (error) {
                        console.log(error.reason);
                        alert('Invalid credentials');
                    }
                    else {
                        // console.log(result);
                        if (result == $('#accountsid').val()) {
                            alert('Credentials validated by Twilio');
                            Router.go('consults');
                        } else {
                            alert('Invalid credentials');
                            Router.go('twilioForm');
                        }
                    }
                });

            }
        }

    });
}

