if (Meteor.isServer) {
    Meteor.methods({

        // this is to check if newly submitted credentials are valid
        'validateTwilioCredentials': function (credentials) {
            var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + ".json";
            var auth = credentials.accountsid + ":" + credentials.authtoken;

            var result = Meteor.http.get(restURL,
                {
                    auth: auth,
                    params: {
                        //  username: credentials.accountsid,
                        //  password: credentials.authtoken
                    }
                });

            if (result.statusCode == 200) {
                var respJson = JSON.parse(result.content);
                if (respJson.sid == credentials.accountsid) {
                    TwilioCredentials.update(
                        {},
                        {
                            $set: {
                                accountsid: credentials.accountsid,
                                authtoken: credentials.authtoken,
                                createdAt: new Date()
                            }
                        }
                    );
                }

                return respJson.sid;
            } else {
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        },

        // this is to check if the credentials already in the db are valid
        'confirmTwilioCredentials': function () {
            var credentials = TwilioCredentials.findOne();
            var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + ".json";
            var auth = credentials.accountsid + ":" + credentials.authtoken;
            var result = Meteor.http.get(restURL,
                {
                    auth: auth
                });

            if (result.statusCode == 200) {
                var respJson = JSON.parse(result.content);
                if (respJson.sid == credentials.accountsid) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0
            }
        },
        'sendSMS': function () {
            var credentials = TwilioCredentials.findOne();
            twilio = Twilio(credentials.accountsid, credentials.authtoken);
            twilio.sendSms({
                to: '+16016131286', // Any number Twilio can deliver to
                from: '+16017148499', // A number you bought from Twilio and can use for outbound communication
                body: 'word to your mother.' // body of the SMS message
            }, function (err, responseData) { //this function is executed when a response is received from Twilio
                if (!err) { // "err" is an error received during the request, if any
                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."
                }
            });
        }


    });

}