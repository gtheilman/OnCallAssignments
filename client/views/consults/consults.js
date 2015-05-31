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

}


if (!Meteor.isClient) {
} else {
    Template.consultForm.helpers({
        aliceChecked: function () {
            var consult = Consults.findOne({_id: Session.get("consult_id")});
            if (consult.voice == 'alice') {
                return consult && "checked"
            }
        }
        ,
        manChecked: function () {
            var consult = Consults.findOne({_id: Session.get("consult_id")});
            if (consult.voice == 'man') {
                return consult && "checked"
            }
        }
        ,
        womanChecked: function () {
            var consult = Consults.findOne({_id: Session.get("consult_id")});
            if (consult.voice == 'woman') {
                return consult && "checked"
            }
        }


    });

    // Retrieve consult responses from Twilio website and store them in a temporary local collection
    Template.responses.created = function () {
        // consult_id was set by iron router when the route was started
        Responses.find({consult_id: Session.get("consult_id")}).forEach(function (response) {
            Meteor.call('callInfo', response.callSid, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    if (response.student_id) {
                        var student = Students.findOne({_id: response.student_id});
                    } else {
                        var student = {};
                    }
                    var consult = Consults.findOne({_id: response.consult_id});

                    ConsultResponses.insert({
                        callSid: data.sid,
                        to: data.to,
                        from: data.from,
                        start_time: data.start_time,
                        caller_name: data.caller_name,
                        student_id: response.student_id,
                        username: student.username,
                        consult_id: response.consult_id,
                        shortName: consult.shortName

                    })
                }
            });
        });
    };

    Template.responses.helpers({
            consultResponse: function () {
                return Responses.find({consult_id: Session.get("consult_id")});
            },

            consultRow: function () {
                var consultResponse = ConsultResponses.findOne({callSid: this.callSid});
                var toCell = "<td>" + consultResponse.to + "</td>";
                var fromCell = "<td>" + consultResponse.from + "</td>";
                var start_timeCell = "<td>" + consultResponse.start_time + "</td>";

                return toCell;

            }
        }
    )
    ;


}



