if (Meteor.isServer) {


    Meteor.methods({
        sendEmail: function (to, from, subject, text) {
            check([to, from, subject, text], [String]);

            process.env.MAIL_URL = "smtp://TwitterConsults@gmail.com:wPSJkqj0QGsC!B6gkpzRTOGkrOlXUD@smtp.gmail.com:465/";

            // Let other method calls from the same client start running,
            // without waiting for the email sending to complete.
            this.unblock();

            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
            });
        }
    });

}
