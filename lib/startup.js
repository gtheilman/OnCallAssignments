// This prevents people from creating accounts using the login dialog
//  New users (faculty) can only be created by someone who is already logged in
Accounts.config({
    forbidClientAccountCreation: true
});


if (Meteor.isServer) {
    Meteor.startup(function () {
        // Sets up an admin account if one does not exist.
        // Would strongly suggest changing password after first login.
        // Remember that since external user signup is disabled in accounts-ui
        // this is the only login to initially get in to set up users (faculty).
        //  If this password is lost prior to setting up other accounts
        //  you will be 'locked-out' of the application and will need to reinstall
        if (!Meteor.users.findOne({username: "admin"})) {

            // Since the absence of an admin account suggests this is the first use of the program,
            // we will take this opportunity to create roles
            Roles.createRole('admin'); // can do everything
            Roles.createRole('grader');// restricted from adding/deleting/changing users, students, consults.
            Roles.createRole('active'); // absence of this role keeps the user in database, but prevents them from logging in


            Accounts.createUser({
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin'
            });
            var user = Meteor.users.findOne({username: 'admin'});

            Roles.addUsersToRoles(user._id, ['admin', 'active']);

        }


        // These fields were chosen, in part, to conform with what Blackboard needs to
        // upload a spreadsheet to the Grade Center.  Other learning management systems
        // may have different field names or requirements.

        // Puts a single fake entry into the database so we know it is working
        if (!Students.findOne()) {
            var students = [
                {
                    lastName: 'Student',
                    firstName: 'Fake',
                    username: 'fstudent',
                    email: 'fstudent@gmail.com',
                    studentid: '123456',
                    gradYear: '2017',
                    phone: '6016131286'
                }
            ];
            students.forEach(function (student) {
                Students.insert(student);
            })
        }


        if (!Consults.findOne()) {
            var consults = [
                {
                    shortName: "AmphotericinDose",
                    tweetHeader: "Pharmacy Consult.",
                    consultURL: "https://bitly.com/consult",
                    keyURL: "https://bitly.com/consultKey",
                    phoneMessage: "Thanks for calling.  What do you think we should do with this patient?",
                    hangupMessage: "Thanks for the advice.  I appreciate your help.",
                    voice: "man",
                    maxSeconds: "120",
                    phone: "6017148897",
                    activate: true,
                    transcribe: false,
                    nameLookup: false,
                    createdAt: new Date()
                }
            ];
            consults.forEach(function (consult) {
                Consults.insert(consult);
            })
        }

        if (!TwilioCredentials.findOne()) {
            var twilio =
            {
                accountsid: "",
                authtoken: "",
                createdAt: new Date()
            };
            TwilioCredentials.insert(twilio);
        }
    });
}

if (Meteor.isClient) {

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
}


