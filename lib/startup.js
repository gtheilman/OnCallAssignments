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
            Accounts.createUser({
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin'
            });
            var user = Meteor.users.findOne({username: 'admin'});

            Roles.addUsersToRoles(user._id, ['admin']);

        }


        // These fields were chosen, in part, to conform with what Blackboard needs to
        // upload a spreadsheet to the Grade Center.  Other learning management systems
        // may have different field names or requirements.



        if (!Consults.findOne()) {
            var consult =
                {
                    shortName: "First Test Consult",
                    tweetHeader: "Pharmacist On-Call:  ",
                    consultMD: "\n\r\n#Patient Case#\r\n\r\nThis is an example of a document written in Markdown.\r\n\r\nMarkdown is a simple formatting syntax .   Unlike HTML, Markdown is very readable even in its raw form.   \r\n\r\nWhile there are lots of examples on the web very sophisticated use of Markdown, many of these examples use plugins and don\'t work with this particular application.   It\'s best to stick with the basics:\r\n\r\n*Italicized text looks pretty good.*\r\n\r\n**As does bolded text.**\r\n\r\nHere is a [link](https:\/\/stackedit.io) to a nice Markdown editor.\r\n\r\n> This is a blockquote\r\n \r\n\r\n 1. This\r\n 2. is\r\n 3. a\r\n 4. numbered\r\n 5. list\r\n \r\n \r\nA horizontal rule\r\n \r\n\r\n\r\n----------\r\nUnder the horizontal rule\r\n\r\n![Obligatory picture of a cat](http:\/\/www.vetprofessionals.com\/catprofessional\/images\/home-cat.jpg)\r\n\r\n*It\'s not the Internet without pictures of cats.*",
                    keyMD: "\r\n\r\n#Key#\r\n\r\n This is where you might put the rubric that you used to score the consult.\r\n\r\nWe usually just include a link to this document when we post the students\' scores.",
                    phoneMessage: "Thanks for calling me back. This is the sample kon sult that comes with the application.  If this were an actual kon sult, I would probably ask something like:  What do you think we should do with this patient?  Press any key when you are done.",
                    hangupMessage: "I appreciate your help.  Good bye.",
                    voice: "alice",
                    maxSeconds: "120",
                    phone: "16015551212",
                    activate: true,
                    transcribe: false,
                    voiceCallerIdLookup: false,
                    createdAt: new Date()
                }
                ;

                Consults.insert(consult);

        }

        if (!Students.findOne()) {
            var student =
                {
                    firstName: "Ima",
                    lastName: "Student",
                    studentid: "9999999",
                    username: "istudent",
                    email: "istudent@example.com",
                    phone: "14105551212",
                    gradYear: "2020",
                    createdAt: new Date()
                }
                ;
            Students.insert(student);

        }


        if (!Credentials.findOne()) {
            var twilio =
            {
                accountsid: "null",
                authtoken: "null",
                emailUsername: "",
                emailPassword: "",
                smtpServer: "",
                smtpPort: "",
                createdAt: new Date()
            };
            Credentials.insert(twilio);
        }
    });
}

if (Meteor.isClient) {

// checking on startup whether or not the Twilio credentials in the database are valid or not.
    Session.set("credentialsStatus", 0);
    Meteor.call("confirmTwilioCredentials", function (error, result) {
        if (error) {
            Session.set("credentialValidityCheck", '<div class="alert alert-danger" role="alert">The Twilio credentials in the database are NOT valid.</div>');
            sAlert.warning('It does not appear that Twilio credentials are in the database.   You cannot use the program without them.  Go to <a href="http://www.twilio.com">Twilio</a> to sign up. ', {
                effect: 'scale', html: true, position: 'top-right',
                timeout: '45000', onRouteClose: false, stack: true, offset: '0px'
            });
        }
        else {
            // console.log(result);
            if (result == 1) {
                // console.log(result);
                Session.set("credentialValidityCheck", '<div class="alert alert-success" role="alert">The Twilio credentials in the database are valid.</div>');
                Session.set("credentialsStatus", 1);
            } else {
                Session.set("credentialValidityCheck", '<div class="alert alert-danger" role="alert">The Twilio credentials in the database are NOT valid.</div>');
                sAlert.warning('It does not appear that Twilio credentials are in the database.   You cannot use the program without them.  Go to <a href="http://www.twilio.com">Twilio</a> to sign up. ', {
                    effect: 'scale', html: true, position: 'top-right',
                    timeout: 'none', onRouteClose: false, stack: true, offset: '0px'
                });

            }
        }
    });


    // checking whether there are email credentials.  However, can't verify they are valid or not.

    Meteor.call("confirmEmailCredentials", function (error, result) {
        if (error) {
            Session.set("emailValidityCheck", '<div class="alert alert-danger" role="alert">There are no email credentials in the database.</div>');
        }
        else {
            // console.log(result);
            if (result == 1) {
                // console.log(result);
                Session.set("emailValidityCheck", '<div class="alert alert-success" role="alert">There are email credentials in the database.</div>');
            } else {
                Session.set("emailValidityCheck", '<div class="alert alert-danger" role="alert">There are no email credentials in the database.</div>');

            }
        }
    });
}


