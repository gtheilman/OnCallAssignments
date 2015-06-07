if (Meteor.isServer) {


    Meteor.methods({

        testTwitter: function () {

            var credentials = Credentials.findOne();


            var options = {
                consumer_key: credentials.twitter_consumer_key,
                consumer_secret: credentials.twitter_consumer_secret,
                access_token_key: credentials.twitter_access_token_key,
                access_token_secret: credentials.twitter_access_token_secret
            };


            var client = new Twitter(options);
 

            Twitter.getAsync(client, 'favorites/list', function (error, tweets, response) {
                if (error) {
                    return error
                } else if (tweets) {
                    return tweets
                } else {
                    return response
                }
            });
        },


        sendTweet: function (to, subject, text) {
            check([to, subject, text], [String]);


            var credentials = Credentials.findOne();

            if (credentials.emailPassword) {
                var decrypted_emailPassword = Meteor.call("decrypt", credentials.emailPassword);
                process.env.MAIL_URL = 'smtp://' + encodeURIComponent(credentials.emailUsername) + ':' + encodeURIComponent(decrypted_emailPassword) + '@' + encodeURIComponent(credentials.smtpServer) + ':' + credentials.smtpPort;
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

        confirmTwitterCredentials: function () {
            var credential = Credentials.findOne({});
            if (credential.twitter_access_token_secret) {
                return 1
            } else {
                return 0
            }
        },

        updateTwitterCredentials: function (credentials) {
            var encrypted_twitter_access_token_secret = Meteor.call("encrypt", credentials.twitter_access_token_secret);
            var encrypted_twitter_consumer_secret = Meteor.call("encrypt", credentials.twitter_consumer_secret);
            var credential = Credentials.findOne();
            Credentials.update(
                {_id: credential._id},
                {
                    $set: {
                        twitter_consumer_key: credentials.twitter_consumer_key,
                        twitter_consumer_secret: encrypted_twitter_consumer_secret,
                        twitter_access_token_key: credentials.twitter_access_token_key,
                        twitter_access_token_secret: encrypted_twitter_access_token_secret
                    }
                }
            );
            var credential = Credentials.findOne({});
            if (credential.twitter_consumer_key) {
                return credential.twitter_consumer_key
            } else {
                return credential._id
            }


        }


    });

}
