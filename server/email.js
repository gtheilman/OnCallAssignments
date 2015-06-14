if (Meteor.isServer) {


    Meteor.methods({
        sendEmail: function (to, subject, text) {
            check([to, subject, text], [String]);

            var credentials = Credentials.findOne();

            if (credentials.emailPassword) {
                var decrypted_emailPassword = Meteor.call("decrypt", credentials.emailPassword);
                process.env.MAIL_URL = 'smtp://' + encodeURIComponent(credentials.emailUsername) + ':' + encodeURIComponent(decrypted_emailPassword) + '@' + encodeURIComponent(credentials.smtpServer) + ':' + credentials.smtpPort;
                var emailFrom = credentials.emailUsername;
            } else {
                var admin = Meteor.users.findOne({username: 'admin'});
                var emailFrom = admin.emails[0].address;
            }

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: emailFrom,
                subject: subject,
                text: text
            });

            var response = "to:" + to + " from: " + emailFrom + "  subject: " + subject + "  text:  " + text;

            return response
        },

        confirmEmailCredentials: function () {
            var credential = Credentials.findOne({});
            if (credential.emailUsername) {
                return 1
            } else {
                return 0
            }


        },


        updateEmailCredentials: function (credentials) {
            var encrypted_emailPassword = Meteor.call("encrypt", credentials.emailPassword);
            var credential = Credentials.findOne();
            Credentials.update(
                {_id: credential._id},
                {
                    $set: {
                        emailUsername: credentials.emailUsername,
                        emailPassword: encrypted_emailPassword,
                        smtpServer: credentials.smtpServer,
                        smtpPort: credentials.smtpPort
                    }
                }
            );
            var credential = Credentials.findOne({});
            if (credential.emailUsername) {
                return credential.emailUsername
            } else {
                return credential._id
            }





        }


    });

}
