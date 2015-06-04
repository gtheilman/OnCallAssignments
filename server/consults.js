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


                /*   Can't work on this until trial account status is changed.

                 // Set the Request URL associated with that number on the Twilio website
                 // First, get the id associated with this phone number
                 var credentials = Credentials.findOne();
                 var restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid + "/IncomingPhoneNumbers.json";
                 var auth = credentials.accountsid + ":" + credentials.authtoken;
                 var phoneInfo = Meteor.http.get(restURL,
                 {
                 auth: auth,
                 params: {
                 PhoneNumber: "%2B1" + consult.phone
                 }
                 });
                 // Then, try to set the Request URL to our own server
                 if (phoneInfo.statusCode == 200) {
                 console.log(phoneInfo);
                 var respJson = JSON.parse(phoneInfo.content);
                 var sid = respJson.incoming_phone_numbers[0].sid;
                 restURL = "https://api.twilio.com/2010-04-01/Accounts/" + credentials.accountsid
                 + "/IncomingPhoneNumbers/" + sid + ".json";
                 var voiceURLInfo = Meteor.http.post(restURL,
                 {
                 auth: auth,
                 params: {
                 VoiceUrl: Meteor.absoluteUrl() + "say/" + consult.phone
                 }
                 });
                 // Confirm that it was set correctly
                 if (voiceURLInfo.statusCode == 200) {
                 var voiceJson = JSON.parse(phoneInfo.content);
                 if (voiceJson.voice_url == Meteor.absoluteUrl() + "say/" + consult.phone) {
                 return sid
                 } else {
                 var errorJson = voiceJson.parse(result.content);
                 throw new Meteor.Error(result.statusCode, errorJson.error);
                 }
                 }
                 } else {
                 var errorJson = JSON.parse(result.content);
                 throw new Meteor.Error(result.statusCode, errorJson.error);
                 }
                 }


                 */

            }


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
                            nameLookup: consult.nameLookup,
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
                        nameLookup: consult.nameLookup,
                        activate: consult.activate,
                        createdAt: new Date()
                    }
                )
            }


        },


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

