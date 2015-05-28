if (Meteor.isServer) {
    Meteor.methods({
        'validateTwilioCredentials': function (credentials) {
            Twilio.update(
                {},
                {
                    accountsid: credentials.accountsid,
                    authtoken: credentials.authtoken,
                    createdAt: new Date()
                }
            )
        }

    });
}
        
        
        
    
