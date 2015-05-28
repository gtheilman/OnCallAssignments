Students = new Meteor.Collection('students');
Consults = new Meteor.Collection('consults');
Twilio = new Meteor.Collection('twilio');


if (Meteor.isServer) {
    Meteor.startup(function () {
        // These fields were chosen, in part, to conform with what Blackboard needs to
        // upload a spreadsheet to the Grade Center.  Other learning management systems
        // may have different field names or requirements.

        // Puts a single fake entry into the database so we know it is working
        if (!Students.findOne()) {
            var students = [
                {
                    lastName: 'Student',
                    firstName: 'Fake',
                    username: 'fstudent',
                    email: 'fstudent@gmail.com',
                    studentid: '123456',
                    gradYear: '2017',
                    phone: '6015551212'
                }
            ];
            students.forEach(function (student) {
                Students.insert(student);
            })
        }


        if (!Consults.findOne()) {
            var consults = [
                {
                    shortName: "AmphotericinDose",
                    tweetHeader: "Pharmacy Consult.",
                    consultURL: "https://bitly.com/consult",
                    keyURL: "https://bitly.com/consultKey",
                    phoneMessage: "Thanks for calling.  What do you think we should do with this patient?",
                    hangupMessage: "Thanks for the advice.  I appreciate your help.",
                    voice: "default",
                    maxSeconds: "120",
                    phone: "6661212234",
                    transcribe: false,
                    nameLookup: false,
                    createdAt: new Date()
                }
            ];
            consults.forEach(function (consult) {
                Consults.insert(consult);
            })
        }


        if (!Twilio.findOne()) {
            var twilio =
                {
                    accountsid: "",
                    authtoken: "",
                    createdAt: new Date()
                };
            Twilio.insert(twilio);
        }


    });
}


