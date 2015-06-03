if (!Meteor.isClient) {
} else {

    Template.credentialsForm.helpers({
        credentialValidityCheck: function () {
            return Session.get("credentialValidityCheck");
        },

        emailCredentialsCheck: function () {
            return Session.get("emailValidityCheck");
        }

    });

    // Handles the result of the user (faculty) form submission
    Template.credentialsForm.events({
        "submit #twilioCredentialsForm": function (event) {
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
                            Session.set("credentialValidityCheck", '<div class="alert alert-success" role="alert">The Twilio credentials in the database are valid.</div>');
                            Router.go('consults');
                        } else {
                            alert('Invalid credentials');
                            Session.set("credentialValidityCheck", '<div class="alert alert-danger" role="alert">The Twilio credentials in the database are NOT valid.</div>');
                            Router.go('credentialsForm');
                        }
                    }
                });

            }
        },
        "submit #emailCredentialsForm": function (event) {
            event.preventDefault();

            if ($('#emailUsername').val() == "") {
                alert('A username must be provided');
            } else if ($('#emailPassword').val() == "") {
                alert('An password must be provided');
            } else if ($('#smtpServer').val() == "") {
                alert('An SMTP server must be provided');
            } else if ($('#smtpPort').val() == "") {
                alert('An port must be provided');
            }
            else {
                var credentials =
                {
                    emailUsername: $('#emailUsername').val(),
                    emailPassword: $('#emailPassword').val(),
                    smtpServer: $('#smtpServer').val(),
                    smtpPort: $('#smtpPort').val()
                };
                console.log(credentials);

                Meteor.call("updateEmailCredentials", credentials, function (error, result) {
                    if (error) {
                        console.log(error.reason);
                        alert('Problem saving email credentials');
                    } else {
                        console.log(result);
                        Session.set("emailValidityCheck", '<div class="alert alert-success" role="alert">There are email credentials in the database.</div>');
                        Router.go('consults');
                    }


                });

            }
        },
        "submit #testEmail": function (event) {
            event.preventDefault();

            if ($('#testEmailAddress').val() == "") {
                alert('An email address must be provided');
            }
            else {
                Meteor.call('sendEmail',
                    $('#testEmailAddress').val(),
                    $('#testEmailAddress').val(),
                    'Test from OnCallAssignments',
                    'This is the test email you requested from the OnCallAssignments program.');
                alert("Sent");
            }
        }

    });
}

