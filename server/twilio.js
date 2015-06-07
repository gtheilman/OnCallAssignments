/*

 This page should have all the methods that interact with the Twilio service.  If you are planning to
 use a different service (like Tropo), you would want to change this page to use their API.   In  pages that call
 this one you would need to make sure that they reference the variable names that API uses (although I imagine that
 variable names like 'from' and 'caller' would be very similar).

 */


if (Meteor.isServer) {


    Meteor.methods({


            encrypt: function (message) {
                // The admin account is created automatically when the application is installed and the admin account
                // cannot be deleted by the application.   The _id of the admin is generated randomly by the program.
                // So, we are going to use the _id of the admin (which should
                // never change) as the passphrase for encryption.  Users other than admin shouldn't be able to
                //  search for the user id from the console under their own logins
                var passphrase = Meteor.users.findOne({username: "admin"})._id;
                return CryptoJS.AES.encrypt(message, passphrase).toString();
            },


            decrypt: function (encrypted) {
                var passphrase = Meteor.users.findOne({username: "admin"})._id;
                return CryptoJS.AES.decrypt(encrypted, passphrase).toString(CryptoJS.enc.Utf8);
            },


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


            // this is to check if newly submitted credentials are valid and enter them into the db
            'validateTwilioCredentials': function (credentials) {
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + ".json";
                var auth = credentials.accountsid + ":" + credentials.authtoken;

                var result = Meteor.http.get(restURL,
                    {
                        auth: auth

                    });

                if (result.statusCode == 200) {
                    var encrypted_authtoken = Meteor.call("encrypt", credentials.authtoken);
                    var respJson = JSON.parse(result.content);
                    if (respJson.sid == credentials.accountsid) {
                        Credentials.update(
                            {},
                            {
                                $set: {
                                    accountsid: credentials.accountsid,
                                    authtoken: encrypted_authtoken,
                                    createdAt: new Date()
                                }
                            }
                        );
                    }
                    //  Set initial voice URL
                    // Check to see if initial example consult number has been changed
                    var firstTestConsult = Consults.findOne({shortName: "First Test Consult"});
                    if (firstTestConsult) {
                        if (firstTestConsult.phone == "16015551212") {
                            Meteor.call("phoneList", function (error, result) {

                                if (error) {
                                    return error
                                } else {
                                    phone_number = result[0].phone_number.replace("+", "");
                                    phone_sid = result[0].sid;

                                    Consults.update(
                                        {_id: firstTestConsult._id},
                                        {
                                            $set: {
                                                phone: phone_number
                                            }
                                        }
                                    );
                                }
                            });


                            Meteor.call("setTwilioVoiceURL", phone_number, phone_sid, function (error, result) {
                                if (result) {
                                    returned_account_sid = result.account_sid;
                                } else {
                                    var errorJson = JSON.parse(result.content);
                                    throw new Meteor.Error(result.statusCode, errorJson.error);
                                }
                            });

                            return credentials.accountsid


                        } //end 16015551212


                        // if (firstTestConsult) BELOW
                    }

                    // end if STatus code 200 below
                } else {
                    var errorJson = JSON.parse(result.content);
                    throw new Meteor.Error(result.statusCode, errorJson.error);
                }
                return credentials.accountsid    // SUCCCESS
            }, // END validateTwilioCredentials


            // this is to check if the credentials already in the db are valid
            'confirmTwilioCredentials': function () {
                var credentials = Credentials.findOne();
                if (!credentials.accountsid) {
                    return error
                }
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + ".json";
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;


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


            // this is to check for the data associated with a phone number.
            'getPhoneNumberDetails': function (PhoneNumber) {
                var credentials = Credentials.findOne();
                if (!credentials.accountsid) {
                    return error
                }
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/IncomingPhoneNumbers.json";
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;
                var phoneInfo = Meteor.http.get(restURL,
                    {
                        auth: auth,
                        params: {
                            PhoneNumber: PhoneNumber
                        }
                    });

                if (phoneInfo.statusCode == 200) {
                    var respJson = JSON.parse(phoneInfo.content);
                    return respJson.incoming_phone_numbers[0];
                } else {
                    return 0;
                }

            }
            ,


            // Extra fee (1 cent) to lookup name associated with number
            'getTranscription': function (PhoneNumber) {
                var credentials = Credentials.findOne();
                if (!credentials.accountsid) {
                    return error
                }
                var restURL = "https://lookups.twilio.com/v1/PhoneNumbers/+" + PhoneNumber;
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;
                var phoneInfo = Meteor.http.get(restURL,
                    {
                        auth: auth,
                    });
                var respJson = JSON.parse(phoneInfo.content);
                return respJson;

            }
            ,


            // this is to set the URL Twilio contacts when a phone call is received
            'setTwilioVoiceURL': function (PhoneNumber, sid) {
                var credentials = Credentials.findOne();
                if (!credentials.accountsid) {
                    return error
                }
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;
                restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid
                + "/IncomingPhoneNumbers/" + sid + ".json";

                var outgoingURL = Meteor.absoluteUrl() + "say/" + PhoneNumber;

                var voiceURLInfo = Meteor.http.post(restURL,
                    {
                        auth: auth,
                        params: {
                            VoiceUrl: outgoingURL
                        }
                    });
                // Confirm that it was set correctly
                if (voiceURLInfo.statusCode == 200) {
                    return voiceJson = JSON.parse(voiceURLInfo.content);

                } else {
                    return false
                }

            },


            // this is to set the URL Twilio contacts when a phone call is received
            'setVoiceCallerIdLookup': function (PhoneNumber, sid, status) {
                var credentials = Credentials.findOne();
                if (!credentials.accountsid) {
                    return error
            }
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;
                restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid
                + "/IncomingPhoneNumbers/" + sid + ".json";

                var outgoingURL = Meteor.absoluteUrl() + "say/" + PhoneNumber;

                var VoiceCallerIdLookupInfo = Meteor.http.post(restURL,
                    {
                        auth: auth,
                        params: {
                            VoiceCallerIdLookup: status
                        }
                    });
                // Confirm that it was set correctly
                if (VoiceCallerIdLookupInfo.statusCode == 200) {
                    return voiceJson = JSON.parse(VoiceCallerIdLookupInfo.content);

                } else {
                    return false
                }

            },









            'sendSMS': function (to, from, message) {
                var credentials = Credentials.findOne();
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;
                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/Messages.json";

                Meteor.http.post(restURL,
                    {
                        params: {From: from, To: to, Body: message},
                        auth: auth,
                        headers: {'content-type': 'application/x-www-form-urlencoded'}
                    }, function () {

                    }
                );


            }

            ,


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
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;
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
                                callerName: data.caller_name,
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
            }

            ,


            // this is to retrieve all the phone numbers associated with this account
            'phoneList': function (callSid) {
                var credentials = Credentials.findOne();
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;

                var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/IncomingPhoneNumbers.json";
                var phones = Meteor.http.get(restURL,
                    {
                        auth: auth

                    });


                if (phones.statusCode == 200) {
                    var phonesJSON = JSON.parse(phones.content);
                    return phonesJSON.incoming_phone_numbers;

                } else {
                    var errorJson = JSON.parse(phones.content);
                    throw new Meteor.Error(recordingList.statusCode, errorJson.error);
                }
            }

            ,


            // this is to retrieve information about the recording associated with the call
            'recordingInfo': function (callSid) {
                var credentials = Credentials.findOne();
                var authtoken = Meteor.call("decrypt", credentials.authtoken);
                var auth = credentials.accountsid + ":" + authtoken;

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
                                recordingURL: recordingURL,
                                recordingSid: recordingSid
                            }
                        }
                    );

                    var transcriptionURI = baseRestURL + "/2010-04-01/Accounts/" + credentials.accountsid + "/Recordings/" + recordingSid + "/Transcriptions.json";

                    var transcriptionList = Meteor.http.get(transcriptionURI,
                        {
                            auth: auth
                        });

                    var transcriptionInfo = JSON.parse(transcriptionList.content);

                    var transcriptionSid = transcriptionInfo.transcriptions[0].sid;
                    var transcriptionText = transcriptionInfo.transcriptions[0].transcription_text;

                    if (transcriptionSid) {
                        Responses.update(
                            {callSid: callSid},
                            {
                                $set: {
                                    transcriptionSid: transcriptionSid,
                                    transcriptionText: transcriptionText
                                }
                            }
                        );
                    }

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