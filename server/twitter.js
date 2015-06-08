if (Meteor.isServer) {


    var credentials = Credentials.findOne();
    //var decrypted_twitter_consumer_secret = Meteor.call("decrypt", credentials.twitter_consumer_secret);
    // var decrypted_access_token_secret = Meteor.call("decrypt", credentials.access_token_secret);
    // var decrypted_twitter_consumer_secret = credentials.twitter_consumer_secret;
    // var decrypted_access_token_secret = credentials.access_token_secret;


    var Twit = Meteor.npmRequire('twit');


    var T = new Twit({
        consumer_key: credentials.twitter_consumer_key,
        consumer_secret: credentials.twitter_consumer_secret,
        access_token: credentials.twitter_access_token_key,
        access_token_secret: credentials.twitter_access_token_secret
    });


    Meteor.methods({

        testTwitter: function () {
            var twitter = Async.runSync(function (done) {
                T.get('account/settings', function (err, data, response) {
                    done(null, data);
                });
            });

            return twitter.result;
        },


        sendTweet: function (text) {
            var twitter = Async.runSync(function (done) {
                T.post('account/settings', {time_zone: 'American/Chicago'}, function (err, data, response) {
                    done(null, data);
                });
            });

            return twitter.result;

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
            // var encrypted_twitter_access_token_secret = credentials.twitter_access_token_secret;
            // var encrypted_twitter_consumer_secret = credentials.twitter_consumer_secret;
            var credential = Credentials.findOne();
            Credentials.update(
                {_id: credential._id},
                {
                    $set: {
                        twitter_consumer_key: credentials.twitter_consumer_key,
                        twitter_consumer_secret: credentials.twitter_consumer_secret,
                        twitter_access_token_key: credentials.twitter_access_token_key,
                        twitter_access_token_secret: credentials.twitter_access_token_secret
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
