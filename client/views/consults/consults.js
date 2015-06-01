if (!Meteor.isClient) {
} else {

    // Handles the result of the consult form submission
    Template.consultForm.events({
        "submit #consultForm": function (event) {
            event.preventDefault();


            if ($('#shortName').val() == "") {
                alert('A name must be provided');
            } else if ($('#phone').val() == "") {
                alert('A phone number must be provided');
            } else if ($('#phoneMessage').val() == "") {
                alert('An outgoing phone message must be provided.');
            }

            else {


                var consult =
                {
                    id: $('#id').val(),
                    shortName: $('#shortName').val(),
                    tweetHeader: $('#tweetHeader').val(),
                    consultURL: $('#consultURL').val(),
                    keyURL: $('#keyURL').val(),
                    phoneMessage: $('#phoneMessage').val(),
                    hangupMessage: $('#hangupMessage').val(),
                    maxSeconds: $('#maxSeconds').val(),
                    phone: $('#phone').val(),
                    voice: $('input:radio[name=voice]:checked').val(),
                    transcribe: $('#transcribe').is(':checked'),
                    nameLookup: $('#nameLookup').is(':checked'),
                    activate: $('#activate').is(':checked'),
                    createdAt: new Date()
                };

                Meteor.call('upsertConsultData', consult);
                Router.go('consults');
            }
        },
        "click #deleteConsultButton": function (event) {
            Meteor.call('deleteConsult', $('#id').val());
            Router.go('consults');
        }
    });

    /*
     Template.consultForm.helpers({
        aliceChecked: function () {
            var consult = Consults.findOne({_id: Session.get("consult_id")});
            if (consult.voice == 'alice') {
     return "checked"
     } else {
     return null
            }
        }
        ,
        manChecked: function () {
            var consult = Consults.findOne({_id: Session.get("consult_id")});
            if (consult.voice == 'man') {
     return  "checked"
     } else {
     return  null
            }
        }
        ,
        womanChecked: function () {
            var consult = Consults.findOne({_id: Session.get("consult_id")});
            if (consult.voice == 'woman') {
     return "checked"
     } else {
     return  null
            }
        }
    });

     */

    Template.consultForm.onRendered(function () {
        var consult = Consults.findOne({_id: Session.get("consult_id")});
        if (consult.voice == 'alice') {
            $("#voiceAlice").prop("checked", true);
        } else if (consult.voice == 'woman') {
            $("#voiceWoman").prop("checked", true);

        } else if (consult.voice == 'man') {
            $("#voiceMan").prop("checked", true);
        }

    });


    // Retrieve consult responses from Twilio website
    Template.responses.created = function () {
        // consult_id was set by iron router when the route was started
        Responses.find({consult_id: Session.get("consult_id")}).forEach(function (response) {
            // Only hit Twilio if we don't have the information already
            if (!response.recordingURL) {
                Meteor.call('callInfo', response.callSid, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Hitting Twilio Database");
                        console.log(data);
                        console.log("After Hitting Twilio Database");
                        // Get recording information
                        Meteor.call('recordingInfo', response.callSid, function (err, recordingInfo) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(recordingInfo)

                            }
                        });
                    }
                });
            }
        });
    };


    Template.responses.helpers({

            consultResponseSelector: function () {
                return {consult_id: Session.get("consult_id")};
            }


        }
    )
    ;


}



