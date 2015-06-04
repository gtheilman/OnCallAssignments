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
            } else if ($('#maxSeconds').val() == "") {
                alert('What is the maximum length of the recording?');
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
                    activate: $('#activate').is(':checked')
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
                                // console.log(recordingInfo)

                            }
                        });
                    }
                });
            }
        });
    };


    Template.consultForm.helpers({

            tweet: function () {
                var tweet = "<span class='label label-info'>" + this.tweetHeader + " ";
                tweet += this.consultURL + " ";
                tweet += this.phone + " ";
                tweet += "</span>    ";

                var tweetLength = tweet.length;
                var tweetCharacters = "  <i>(" + tweetLength + " characters)</i>";

                tweetLine = tweet + tweetCharacters;

                return tweetLine
            }


        }
    );


    Template.consultResponses.helpers({
        responses: function () {
            var consult = Template.parentData(1);
            console.log("Consult:");
            console.log(consult._id);
            return Responses.find({consult_id: consult._id}, {createdAt: 1});
        },

        createdAtFormatted: function () {
            return moment(this.createdAt).format("YYYY-MM-DD HH:mm");
        },

        students: function () {

            return Students.find({}, {lastName: 1, firstName: 1});

        },

        selected: function (student_id) {
            var response = Template.parentData(1);
            if (student_id == response.student_id) {
                $("#btnConfirm_" + response.response_id).removeClass('btn-default').addClass('btn-success');
                return "selected";
            } else if (Students.findOne({_id: student_id, phone: response.from.replace("+1", "")})) {
                $("#btnConfirm_" + response.response_id).removeClass('btn-default').addClass('btn-info');
                return "selected";
            }
        }


    });
    /*  This was an incredibly hackish way of getting the students associated with the response record.  The problem
     * was trying to associate button presses with forms when they all had the same names and ids. Ended up giving
     *  each form/button/select a different name and pulling the info out of the event.currentTarget scope.*/
    Template.consultResponses.events({
        "submit .studentSelectForm": function (event) {
            event.preventDefault();
            var response_id = event.currentTarget.id;
            var student_id = $("#selector_" + response_id).val();
            var response = {
                student_id: student_id,
                response_id: response_id
            };

            Meteor.call('updateResponse', response, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    $("#btnConfirm_" + response.response_id).removeClass('btn-default').addClass('btn-success').html("Changed");
                }

            });


        }
    });

    // Change the color of the buttons on the responses to blue if they have already been associated with students.
    Template.consultResponses.onRendered(function () {
        var consult_id = this.data._id;

        Responses.find({consult_id: consult_id}).forEach(function (response) {
            if (response.student_id) {
                $("#btnConfirm_" + response._id).removeClass('btn-default').addClass('btn-info').html("Change");
                $("#selector_" + response._id).val(response.student_id);
            }
        });


    });


}