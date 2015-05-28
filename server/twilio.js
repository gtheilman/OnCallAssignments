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
                    Twilio.update(
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
            var credentials = Twilio.findOne();
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
        }

    });

}