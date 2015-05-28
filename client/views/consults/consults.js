if (!Meteor.isClient) {
} else {

    // Handles the result of the consult form submission
    Template.consultForm.events({
        "submit #consultForm": function (event) {
            event.preventDefault();

            if ($('#shortName').val() == "") {
                alert('A shortName must be provided');
            }

            else {

                var consult =
                {
                    shortName: $('#shortName').val(),
                    tweetHeader: $('#tweetHeader').val(),
                    consultURL: $('#consultURL').val(),
                    keyURL: $('#keyURL').val(),
                    phoneMessage: $('#phoneMessage').val(),
                    hangupMessage: $('#hangupMessage').val(),
                    phone: $('#phone').val(),
                    voice: $('#voice').val(),
                    transcribe: $('#transcribe').val(),
                    nameLookup: $('#nameLookup').val(),
                    createdAt: new Date()
                };

                Meteor.call('upsertConsultData', consult);
                Router.go('consults');
            }
        },
        "click #deleteConsultButton": function (event) {
            Meteor.call('deleteConsultData', $('#consultid').val());
            Router.go('consults');
        }
    });

}

