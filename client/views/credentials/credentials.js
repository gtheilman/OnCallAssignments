if (!Meteor.isClient) {
} else {

    Template.credentialsForm.helpers({
        credentialValidityCheck: function () {
            return Session.get("credentialValidityCheck");
        },

        emailCredentialsCheck: function () {
            return Session.get("emailValidityCheck");
        },


        twilioPhones: function () {
            // simple:reactive-method
            return ReactiveMethod.call("phoneList");
        }

    });


    // Handles the result of the user (faculty) form submission
    Template.credentialsForm.events({
        "submit #twilioCredentialsForm": function (event) {
            event.preventDefault();

            if ($('#authtoken').val() == "") {

                sAlert.error('A Twilio AuthToken must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#accountsid').val() == "") {
                sAlert.error('A Twilio AccountSID must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }
            else {
                var credentials =
                {
                    accountsid: $('#accountsid').val(),
                    authtoken: $('#authtoken').val()
                };

                Meteor.call("validateTwilioCredentials", credentials, function (error, result) {
                    if (error) {
                        console.log(error);
                        sAlert.error('Invalid credentials', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                    }
                    else {

                        if (result == $('#accountsid').val()) {
                            sAlert.success('Credentials validated by Twilio.', {
                                effect: 'scale', position: 'top-right',
                                timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                            });
                            Session.set("credentialValidityCheck", '<div class="alert alert-success" role="alert">The Twilio credentials in the database are valid.</div>');
                            Session.set("credentialsStatus", 1);
                            Router.go('consults');
                        } else {
                            console.log(error);
                            sAlert.error('Invalid credentials...', {
                                effect: 'scale', position: 'top-right',
                                timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                            });
                            Session.set("credentialValidityCheck", '<div class="alert alert-danger" role="alert">The Twilio credentials in the database are NOT valid.</div>');
                            // Router.go('credentialsForm');
                        }
                    }
                });

            }
        },
        "submit #emailCredentialsForm": function (event) {
            event.preventDefault();

            if ($('#emailUsername').val() == "") {
                sAlert.error('A username must be provided.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#emailPassword').val() == "") {
                sAlert.error('A password must be provided.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#smtpServer').val() == "") {
                sAlert.error('An SMTP Server must be provided.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#smtpPort').val() == "") {
                sAlert.error('An SMTP port must be provided.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }
            else {
                var credentials =
                {
                    emailUsername: $('#emailUsername').val(),
                    emailPassword: $('#emailPassword').val(),
                    smtpServer: $('#smtpServer').val(),
                    smtpPort: $('#smtpPort').val()
                };
                // console.log(credentials);

                Meteor.call("updateEmailCredentials", credentials, function (error, result) {
                    if (error) {
                        console.log(error.reason);
                        sAlert.error('Problem saving credentials.  See console.log.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                    } else {
                        // console.log(result);
                        Session.set("emailValidityCheck", '<div class="alert alert-success" role="alert">There are email credentials in the database.</div>');
                        Router.go('consults');
                    }


                });

            }
        },


        "click #clearTwilioCredentialsButton": function (event) {
            event.preventDefault();
            if (confirm("Do you really want to clear all the credentials in the system?")) {
                Meteor.call('clearTwilioCredentials', function (error, result) {
                    if (result) {

                        Session.set("credentialsStatus", 0);
                        Session.set("credentialValidityCheck", '<div class="alert alert-danger" role="alert">The Twilio credentials in the database are NOT valid.</div>');
                        sAlert.warning('It does not appear that Twilio credentials are in the database.   You cannot use the program without them.  Go to <a href="http://www.twilio.com">Twilio</a> to sign up. ', {
                            effect: 'scale', html: true, position: 'top-right',
                            timeout: '45000', onRouteClose: false, stack: true, offset: '0px'
                        });
                        Session.set("emailValidityCheck", '<div class="alert alert-danger" role="alert">There are no email credentials in the database.</div>');
                        sAlert.success('Email credentials updated.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                        Router.go('consults');
                    } else {
                        console.log(error);
                    }
                });
            }
        }
        ,


        "click #restartButton": function (event) {
            event.preventDefault();
            if (confirm("Do you really want to restart the server?")) {
                Meteor.call('resetServer', function (error, result) {
                        if (result) {
                            alert("Restarting...");
                        }
                    }
                );
            }
        },
        "submit #testEmail": function (event) {
            event.preventDefault();
            if ($('#testEmailAddress').val() == "") {
                sAlert.error('An email address must be provided.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }
            else {
                Meteor.call('sendEmail',
                    $('#testEmailAddress').val(),
                    'Test from OnCallAssignments',
                    'This is the test email you requested from the OnCallAssignments program.',
                    function (error, result) {
                        if (result) {
                            sAlert.success('Sent', {
                                effect: 'scale', position: 'top-right',
                                timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                            });
                        } else if (error) {
                            console.log("Email send error");
                            console.log(error);
                            sAlert.error('There was a problem.   Check the console.log', {
                                effect: 'scale', position: 'top-right',
                                timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                            });
                        }
                    }
                );


            }
        }


    })
    ;
}

