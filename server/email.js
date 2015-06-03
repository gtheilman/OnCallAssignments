if (Meteor.isServer) {


    Meteor.methods({
        sendEmail: function (to, from, subject, text) {
            check([to, from, subject, text], [String]);


            var credentials = Credentials.findOne();

            if (credentials.emailPassword.length > 1) {
                process.env.MAIL_URL = 'smtp://' + encodeURIComponent(credentials.emailUsername) + ':' + encodeURIComponent(credentials.emailPassword) + '@' + encodeURIComponent(credentials.smtpServer) + ':' + credentials.smtpPort;
            }


            // process.env.MAIL_URL = "smtp://TwitterConsults@gmail.com:wPSJkqj0QGsC!B6gkpzRTOGkrOlXUD@smtp.gmail.com:465/";

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: from,
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
