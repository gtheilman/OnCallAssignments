Meteor.startup(function () {

    // checking on startup whether or not the Twilio credentials in the database are valid or not.
    Meteor.call("confirmTwilioCredentials", function (error, result) {
        if (error) {
            console.log(error.reason);
            Session.set("credentialvaliditycheck", "The Twilio credentials in the database are NOT valid.");
        }
        else {
            // console.log(result);
            if (result == 1) {
                console.log(result);
                Session.set("credentialValidityCheck", "The Twilio credentials in the database are valid.");
            } else {
                Session.set("credentialValidityCheck", "The Twilio credentials in the database are NOT valid.");

            }
        }
    });
});

