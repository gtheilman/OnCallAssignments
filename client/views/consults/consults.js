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


if (Meteor.isClient) {
    Template.consultForm.helpers({
        aliceChecked: function (id) {
            var consult = Consults.findOne({_id: id});
            if (consult.voice == 'alice') {
                return "checked"
            }
        },
        manChecked: function (id) {
            var consult = Consults.findOne({_id: id});
            if (consult.voice == 'man') {
                return "checked"
            }
        },
        womanChecked: function (id) {
            var consult = Consults.findOne({_id: id});
            if (consult.voice == 'woman') {
                return "checked"
            }
        },
        consultSelector: function (id) {
            return {consult_id: Session.get('consult_id')};
        }
    });
}

