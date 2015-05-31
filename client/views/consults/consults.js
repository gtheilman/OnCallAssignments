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
        },

        consultResponse: function () {
            return Responses.find({consult_id: Session.get("consult_id")});
        }


    });

    Template.responseRow.helpers({
        responseCells: function () {
            // return "before";
            var callInfo = Meteor.call('callInfo', this.callSid);
            console.log(callInfo.from);
            return callInfo.from;

        }
    })


}



