if (Meteor.isServer) {


    Meteor.methods({
        sendEmail: function (to, subject, text) {
            check([to, subject, text], [String]);


            var credentials = Credentials.findOne();

            if (credentials.emailPassword) {
                process.env.MAIL_URL = 'smtp://' + encodeURIComponent(credentials.emailUsername) + ':' + encodeURIComponent(credentials.emailPassword) + '@' + encodeURIComponent(credentials.smtpServer) + ':' + credentials.smtpPort;
            }


            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: credentials.emailUsername,
                subject: subject,
                text: text
            });
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
            var credential = Credentials.findOne();
            Credentials.update(
                {_id: credential._id},
                {
                    $set: {
                        emailUsername: credentials.emailUsername,
                        emailPassword: credentials.emailPassword,
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
