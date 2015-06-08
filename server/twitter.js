if (Meteor.isServer) {


    Meteor.methods({

        testTwitter: function () {

            var credentials = Credentials.findOne();
            //var decrypted_twitter_consumer_secret = Meteor.call("decrypt", credentials.twitter_consumer_secret);
            // var decrypted_access_token_secret = Meteor.call("decrypt", credentials.access_token_secret);
            var decrypted_twitter_consumer_secret = credentials.twitter_consumer_secret;
            var decrypted_access_token_secret = credentials.access_token_secret;


            var Twit = Meteor.npmRequire('twit');


            var T = new Twit({
                consumer_key: "kZtrtUq3quBAK2zvhF2wHZvD7",
                consumer_secret: "jCWvQABoNHKweH0TXSe3YjOzzrP1ZNKlABQZuyPqugz1vSu7tG",
                access_token: "48777223-f1WSLPivKfR944qj8L2naLP8Tr3d1zXsC0yVyS5T8",
                access_token_secret: "k5aSbqjAQFMfKjuA5IzujVreeSZxsqieNQfrUKUabaUIr"
            });


            var twitter = Async.runSync(function (done) {
                T.get('search/tweets', {q: 'banana since:2011-11-11', count: 100}, function (err, data, response) {

                    done(null, data);
                });
            });

            return twitter.result;


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
            // var encrypted_twitter_access_token_secret = Meteor.call("encrypt", credentials.twitter_access_token_secret);
            // var encrypted_twitter_consumer_secret = Meteor.call("encrypt", credentials.twitter_consumer_secret);
            var encrypted_twitter_access_token_secret = credentials.twitter_access_token_secret;
            var encrypted_twitter_consumer_secret = credentials.twitter_consumer_secret;
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
