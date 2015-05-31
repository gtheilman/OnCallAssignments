if (Meteor.isServer) {
    Meteor.methods({
            shortenURL: function (URL) {
                var shortenerURL = "http://tiny-url.info/api/v1/random";
                var queryString = 'url=' + URL;
                var shortenerURLString = shortenerURL + "?" + queryString;
                var result = Meteor.http.get(shortenerURLString);

                // used to see if short URL returned is valid before texting it to student
                function isUrlValid(url) {
                    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
                }

                if (isUrlValid(result.content)) {
                    return result.content;
                } else {
                    return URL;  // send back the original
                }

            },


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
            }

            ,

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
            }

            ,
            'sendSMS': function (to, from, message) {
                var credentials = TwilioCredentials.findOne();
                twilio = Twilio(credentials.accountsid, credentials.authtoken);
                twilio.sendSms({
                    to: to, // Any number Twilio can deliver to
                    from: from, // A number you bought from Twilio and can use for outbound communication
                    body: message // body of the SMS message
                }, function (err, responseData) { //this function is executed when a response is received from Twilio
                    if (!err) { // "err" is an error received during the request, if any
                        // "responseData" is a JavaScript object containing data received from Twilio.
                        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                        // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                        console.log(responseData.from); // outputs "+14506667788"
                        console.log(responseData.body); // outputs "word to your mother."
                    }
                });
            },


            // this is to check if newly submitted credentials are valid
            'callInfo': function (callSid) {
                var credentials = TwilioCredentials.findOne();
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/Calls/"
                    + callSid + ".json";
                var auth = credentials.accountsid + ":" + credentials.authtoken;
                var result = Meteor.http.get(restURL,
                    {
                        auth: auth
                    });

                if (result.statusCode == 200) {
                    var respJson = JSON.parse(result.content);
                    return respJson
                } else {
                    var errorJson = JSON.parse(result.content);
                    throw new Meteor.Error(result.statusCode, errorJson.error);
                }
            }


        }
    )
    ;

}