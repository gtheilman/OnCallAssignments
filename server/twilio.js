/*

 This page should have all the methods that interact with the Twilio service.  If you are planning to
 use a different service (like Tropo), you would want to change this page to use their API.   In  pages that call
 this one you would need to make sure that they reference the variable names that API uses (although I imagine that
 variable names like 'from' and 'caller' would be very similar).

 */


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
                        auth: auth

                    });

                if (result.statusCode == 200) {
                    var respJson = JSON.parse(result.content);
                    if (respJson.sid == credentials.accountsid) {
                        Credentials.update(
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
                var credentials = Credentials.findOne();
                if (!credentials.accountsid) {
                    return error
                }
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


            'sendSMS': function (to, from, message) {
                var credentials = Credentials.findOne();
                var auth = credentials.accountsid + ":" + credentials.authtoken;
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/Messages.json";

                Meteor.http.post(restURL,
                    {
                        params: {From: from, To: to, Body: message},
                        auth: auth,
                        headers: {'content-type': 'application/x-www-form-urlencoded'}
                    }, function () {

                    }
                );


            },


            // this is to check details about a call from a student
            'callInfo': function (callSid) {
                var response = Responses.findOne({callSid: callSid});

                if (response.student_id) {
                    var student = Students.findOne({_id: response.student_id});
                } else {
                    var student = {};
                }
                var consult = Consults.findOne({_id: response.consult_id});

                var credentials = Credentials.findOne();
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/Calls/"
                    + callSid + ".json";
                var auth = credentials.accountsid + ":" + credentials.authtoken;
                var result = Meteor.http.get(restURL,
                    {
                        auth: auth
                    });

                if (result.statusCode == 200) {
                    var data = JSON.parse(result.content);
                    Responses.update(
                        {callSid: callSid},

                        {
                            $set: {
                                to: data.to,
                                from: data.from,
                                start_time: data.start_time,
                                caller_name: data.caller_name,
                                student_id: response.student_id,
                                username: student.username,
                                shortName: consult.shortName
                            }

                        });
                    return data
                } else {
                    var errorJson = JSON.parse(result.content);
                    throw new Meteor.Error(result.statusCode, errorJson.error);
                }
            },

            // this is to retrieve information about the recording associated with the call
            'recordingInfo': function (callSid) {
                var credentials = Credentials.findOne();
                var auth = credentials.accountsid + ":" + credentials.authtoken;

                //  need to get list of recordings
                var baseRestURL = "https://api.twilio.com";
                var restURL = baseRestURL + "/2010-04-01/Accounts/" + credentials.accountsid + "/Calls/"
                    + callSid + "/Recordings.json";
                var recordingList = Meteor.http.get(restURL,
                    {
                        auth: auth
                    });
                if (recordingList.statusCode == 200) {
                    var recordingInfo = JSON.parse(recordingList.content);
                    var accountSid = recordingInfo.recordings[0].account_sid;
                    var recordingSid = recordingInfo.recordings[0].sid;
                    var recordingURL = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid +
                        "/Recordings/" + recordingSid + ".mp3";
                    Responses.update(
                        {callSid: callSid},
                        {
                            $set: {
                                recordingURL: recordingURL
                            }
                        }
                    );
                    return recordingURL
                } else {
                    var errorJson = JSON.parse(recordingList.content);
                    throw new Meteor.Error(recordingList.statusCode, errorJson.error);
                }
            }


        }
    )
    ;

}