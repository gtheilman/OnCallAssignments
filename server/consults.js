if (Meteor.isServer) Meteor.methods({


        'reverse': function (s) {
            for (var i = s.length - 1, o = ''; i >= 0; o += s[i--]) {
            }
            return o;
        },


        /*
         This server-side function updates a record if the consult already
         exists.  If the consult does not already exist, a new record is
         created.   Updating based   has to be done server-side
         because of security restrictions in Meteor.
         */
        'upsertConsultData': function (consult) {
            // If marked as active, deactivate any consults using that same phone number
            if
            (consult.activate) {
                // Mark any currently activated consults using that phone as "inactive"
                Consults.update(
                    {
                        phone: consult.
                            phone
                    },
                    {
                        $set: {
                            activate: false
                        }
                    },
                    {multi: true}
                );
                // Set the Request URL associated with that number on the Twilio website

                // First, get the id associated with this phone number
                PhoneNumber = consult.phone;

                Meteor.call(
                    "getPhoneNumberDetails", PhoneNumber, function (error, result) {
                        if (error) {
                            return
                            error
                        } else {
                            sid = result.sid;
                        }

                    });
                // now set the voice URL associated with this phone number on the Twilio website
                Meteor.call("setTwilioVoiceURL",
                    PhoneNumber, sid, function (error, result) {
                        var outgoingURL = Meteor.absoluteUrl() + "say/" +
                                PhoneNumber
                            ;
                        var voice_url = result.incoming_phone_numbers[0].voice_url;
                        if (voice_url !=
                            outgoingURL) {
                            return error
                        }
                    });

                // now set the CNAM lookup status associated with this phone number on the Twilio website
                Meteor.call("setVoiceCallerIdLookup", PhoneNumber, sid, consult.voiceCallerIdLookup
                    ,
                    function (error, result) {
                        var


                            voice_caller_id_lookup = result.

                                incoming_phone_numbers[0].voice_caller_id_lookup;
                        if (
                            voice_caller_id_lookup !=
                            consult.
                                voiceCallerIdLookup) {
                            return error
                        }
                    });


            }
            // end if activate


            // Insert/update the consult

            if (
                Consults.findOne({
                    _id: consult.
                        id
                })) {
                Consults.update(
                    {_id: consult.id},
                    {
                        $set: {
                            shortName: consult.shortName,
                            tweetHeader: consult.tweetHeader,
                            phoneMessage: consult.phoneMessage,
                            hangupMessage: consult.hangupMessage,
                            voice: consult.voice,
                            phone: consult.phone,
                            maxSeconds: consult.maxSeconds,
                            transcribe: consult.transcribe,
                            voiceCallerIdLookup: consult.voiceCallerIdLookup,
                            activate: consult.activate
                        }
                    }
                );

                ConsultPages.update(
                    {consult_id: consult.id},
                    {
                        $set: {
                            consultMD: " \n" + consult.consultMD,
                            consultVisible: consult.consultVisible
                        }
                    }
                );


                KeyPages.update(
                    {consult_id: consult.id},
                    {
                        $set: {
                            keyMD: " \n" + consult.keyMD,
                            keyVisible: consult.keyVisible
                        }
                    }
                );


            } else {
                Consults.insert(
                    {
                        shortName: consult.shortName,
                        tweetHeader: consult.tweetHeader,
                        phoneMessage: consult.phoneMessage,
                        hangupMessage: consult.hangupMessage,
                        voice: consult.voice,
                        phone: consult.phone,
                        maxSeconds: consult.maxSeconds,
                        transcribe: consult.transcribe,
                        voiceCallerIdLookup: consult.voiceCallerIdLookup,
                        activate: consult.activate,
                        createdAt: new Date()
                    }
                );

                var newConsult = Consults.findOne({
                    shortName: consult.shortName,
                    tweetHeader: consult.tweetHeader,
                    maxSeconds: consult.maxSeconds,
                    phoneMessage: consult.phoneMessage,
                    hangupMessage: consult.hangupMessage
                });


                var entry = {
                    consult_id: newConsult._id,
                    consultVisible: consult.consultVisible,
                    consultMD: " \n" + consult.consultMD
                };
                ConsultPages.insert(entry);

                var entry = {
                    consult_id: newConsult._id,
                    keyVisible: consult.keyVisible,
                    keyMD: " \n" + consult.keyMD
                };
                KeyPages.insert(entry);


                // moved this to last because it sometimes caused the program to hang up, preventing the above
                // entries from being created.

                var shortURL = Meteor.call('shortenURL', Meteor.absoluteUrl() + "oncall/" + newConsult._id);

                ConsultPages.update(
                    {consult_id: newConsult._id},
                    {
                        $set: {
                            consultURL: consultURL
                        }
                    }
                )


            }

            return
        }
        ,


        'deleteConsult': function (consult_id) {
            var responses = Responses.find({consult_id: consult_id}).count();
            if (responses == 0) {
                Consults.remove(
                    {
                        _id: consult_id
                    }
                );
                ConsultPages.remove({
                    consult_id: consult_id
                });
                KeyPages.remove({
                    _id: consult_id
                });
                return true
            } else {
                return false
            }
        }


    }
)
;

