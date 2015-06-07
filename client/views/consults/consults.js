if (!Meteor.isClient) {
} else {

    // Handles the result of the consult form submission
    Template.consultForm.events({
        "submit #consultForm": function (event) {
            event.preventDefault();


            if ($('#activate').is(':checked') && (!($('#consultVisible').is(':checked')))) {
                sAlert.warning('Note that the phone number has been activated but the students cannot view the consult webpage.', {
                    effect: 'scale', position: 'top-right',
                    timeout: '10000', onRouteClose: false, stack: true, offset: '0px'
                });
            }


            if ($('#shortName').val() == "") {
                sAlert.error('A name must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#phone').val() == "") {
                sAlert.error('A Twilio phone number must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#phoneMessage').val() == "") {
                sAlert.error('An outgoing message must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#maxSeconds').val() == "") {
                sAlert.error('What is the maximum length of the recording allowed?', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }

            else {

                var consult =
                {
                    id: $('#id').val(),
                    shortName: $('#shortName').val(),
                    tweetHeader: $('#tweetHeader').val(),
                    consultMD: $('#consultMD').val(),
                    consultVisible: $('#consultVisible').is(':checked'),
                    keyMD: $('#keyMD').val(),
                    keyVisible: $('#keyVisible').is(':checked'),
                    phoneMessage: $('#phoneMessage').val(),
                    hangupMessage: $('#hangupMessage').val(),
                    maxSeconds: $('#maxSeconds').val(),
                    phone: standardizedPhoneFormat($('#phone').val()),
                    voice: $('input:radio[name=voice]:checked').val(),
                    transcribe: $('#transcribe').is(':checked'),
                    voiceCallerIdLookup: $('#voiceCallerIdLookup').is(':checked'),
                    activate: $('#activate').is(':checked')
                };
                // console.log(consult);

                Meteor.call('upsertConsultData', consult, function (result, error) {
                    //  console.log(result);
                    //   console.log(error);
                });
                Router.go('consults');
            }
        },


        "click #deleteConsultButton": function (event) {
            Meteor.call('deleteConsult', $('#id').val(), function (error, result) {
                if (result) {
                    sAlert.success('Deleted.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
                    Router.go('consults');
                } else if (error) {
                    console.log(error);
                    sAlert.error('Something went wrong  Check console.log.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
                }
                else {
                    sAlert.error('Could not delete consult.  Students may have already responded to it.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });

                }

            });

        }
    });

    // Use jquery to select values in DOM based on what is already in db
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
                        sAlert.error('There was an error.  Check the console.log.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                        console.log(err);
                    } else {
                        // console.log("Hitting Twilio Database");
                        // console.log(data);
                        // console.log("After Hitting Twilio Database");
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

            tweetlength: function (tweet) {

                var tweetlength = tweet.length;

                if (tweetlength) {
                    return tweetlength
                }

            },


            tweet: function () {
                var tweet = this.tweetHeader + " ";
                var consultURL = ConsultPages.findOne({consult_id: this._id}).consultURL;

                if (consultURL) {
                    tweet += "    " + consultURL + "    ";
                } else {
                    tweet += Meteor.absoluteUrl() + "oncall/" + this._id + "    ";
                }

                tweet += "    " + friendlyPhoneFormat(this.phone);

                if (tweet) {
                    return tweet
                }

            },

            twilioPhones: function () {
                // simple:reactive-method
                return ReactiveMethod.call("phoneList");
            },

            phoneSelected: function (selectPhone) {

                if (standardizedPhoneFormat($('#twilioPhoneNumber').val()) == standardizedPhoneFormat(selectPhone)) {
                    return "selected"
                }
            },

            getConsultMD: function (consult_id) {
                return ConsultPages.findOne({consult_id: consult_id}).consultMD;
            }
            ,

            consultVisible: function (consult_id) {
                if (ConsultPages.findOne({consult_id: consult_id}).consultVisible) {
                    return true
                }
            }
            ,
            getKeyMD: function (consult_id) {
                return KeyPages.findOne({consult_id: consult_id}).keyMD;
            }
            ,

            keyVisible: function (consult_id) {
                if (KeyPages.findOne({consult_id: consult_id}).keyVisible) {
                    return true
                }


            }
        }
    )
    ;


    Template.consultResponses.helpers({
        responses: function () {
            var consult = Template.parentData(1);
            //console.log("Consult:");
            // console.log(consult._id);
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
            } else if (Students.findOne({_id: student_id, phone: standardizedPhoneFormat(response.from)})) {
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
                    sAlert.error('There was an error.  Check the console.log.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
                    console.log(err);
                } else {
                    $("#btnConfirm_" + response.response_id).removeClass('btn-default').addClass('btn-success').html("Changed");
                    sAlert.success('Changed.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
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
        $('[data-toggle="tooltip"]').tooltip();

        $('#responseTable').DataTable();


    });


}