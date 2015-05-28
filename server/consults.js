if (Meteor.isServer) {
    Meteor.methods({
        /*
        This server-side function updates a record if the consult already
        exists.  If the consult does not already exist, a new record is
        created.   Updating based   has to be done server-side
        because of security restrictions in Meteor.
         */
        'upsertConsult': function (consult) {
            Consults.upsert(
                {
                    _id: consult.id
                },
                {
                    shortName: consult.shortName,
                    tweetHeader: consult.tweetHeader,
                    consultURL: consult.consultURL,
                    keyURL: consult.keyURL,
                    phoneMessage: consult.phoneMessage,
                    hangupMessage: consult.hangupMessage,
                    voice: consult.voice,
                    phone: consult.voice,
                    maxSeconds: consult.maxSeconds,
                    transcribe: consult.transcribe,
                    nameLookup: consult.nameLookup,
                    createdAt: new Date()
                }
            )
        },
        'deleteConsult': function(id) {
            Consults.remove (
                {
                    _id: id
                }

            )
        }


    });
}

