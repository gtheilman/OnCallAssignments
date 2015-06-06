if (Meteor.isServer) {
    Meteor.methods({
        /*
         This server-side function updates a record if the consult already
         exists.  If the consult does not already exist, a new record is
         created.   Updating based   has to be done server-side
         because of security restrictions in Meteor.
         */
        'upsertConsultData': function (consult) {
            // If marked as active, deactivate any consults using that same phone number
            if (consult.activate) {
                // Mark any currently activated consults using that phone as "inactive"
                Consults.update(
                    {phone: consult.phone},
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

                Meteor.call("getPhoneNumberDetails", PhoneNumber, function (error, result) {
                    if (error) {
                        return error
                    } else {
                        sid = result.sid;
                    }

                });

                // now set the voice URL associated with this phone number on the Twilio website
                Meteor.call("setTwilioVoiceURL", PhoneNumber, sid, function (error, result) {
                    var voice_url = result.incoming_phone_numbers[0].voice_url;
                    if (voice_url != outgoingURL) {
                        return error
                    }
                });


            } // end if activate

            // Insert/update the consult

            if (Consults.findOne({_id: consult.id})) {

                Consults.update(
                    {_id: consult.id},
                    {
                        $set: {
                            shortName: consult.shortName,
                            tweetHeader: consult.tweetHeader,
                            consultURL: consult.consultURL,
                            keyURL: consult.keyURL,
                            phoneMessage: consult.phoneMessage,
                            hangupMessage: consult.hangupMessage,
                            voice: consult.voice,
                            phone: consult.phone,
                            maxSeconds: consult.maxSeconds,
                            transcribe: consult.transcribe,
                            activate: consult.activate
                        }
                    }
                )
            } else {
                Consults.insert(
                    {
                        shortName: consult.shortName,
                        tweetHeader: consult.tweetHeader,
                        consultURL: consult.consultURL,
                        keyURL: consult.keyURL,
                        phoneMessage: consult.phoneMessage,
                        hangupMessage: consult.hangupMessage,
                        voice: consult.voice,
                        phone: consult.phone,
                        maxSeconds: consult.maxSeconds,
                        transcribe: consult.transcribe,
                        activate: consult.activate,
                        createdAt: new Date()
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
                return true
            } else {
                return false
            }
        }


    })
    ;
}

