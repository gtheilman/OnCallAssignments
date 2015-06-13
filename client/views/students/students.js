if (!Meteor.isClient) {
} else {


    // Handles the result of the student form submission
    Template.studentForm.events({
        "submit #studentForm": function (event) {
            event.preventDefault();

            if ($('#studentid').val() == "") {
                sAlert.error('Student ID must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }
            else if ($('#lastName').val() == "") {
                sAlert.error('Last name must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else if ($('#firstName').val() == "") {
                sAlert.error('First name must be provided', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            }

            else {

                var student =
                {
                    lastName: $('#lastName').val(),
                    firstName: $('#firstName').val(),
                    username: $('#username').val(),
                    email: $('#email').val(),
                    studentid: $('#studentid').val(),
                    gradYear: $('#gradYear').val(),
                    phone: standardizedPhoneFormat($('#phone').val()),
                    createdAt: new Date()
                };
                /*
                 This Meteor.call to a server-side function updates a record if the
                 studentid already exists.  If the studentid does not already exist,
                 a new record is created.   Updating based on studentid  has to be
                 done server-side because of security restrictions in Meteor.
                 */
                Meteor.call('upsertStudentData', student);
                Router.go('students');
            }
        },
        "click #deleteStudentButton": function (event) {
            if (confirm("Are you sure you want to delete this student?")) {
                Meteor.call('deleteStudentData', $('#student_id').val(), function (error, result) {
                    if (result) {
                        sAlert.success('Deleted.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                        Router.go('students');
                    } else if (error) {
                        console.log(error);
                        sAlert.error('Something went wrong  Check console.log.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });
                    }
                    else {
                        sAlert.error('Could not delete student.  They may have responses in the database already.', {
                            effect: 'scale', position: 'top-right',
                            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                        });

                    }

                });
            }

        }

    });
    //   Get responses along with consult information
    Template.studentConsultResponses.helpers({
        responses: function () {
            var student = Template.parentData(1);
            ConfirmedStudentResponses.remove({}); // clear out the temporary db

            // I think I might be getting errors when I delete a student because this is being called before the
            // page refreshes.  See if I can prevent this from running if not needed.
            if (student) {
                Responses.find({student_id: student._id}, {createdAt: 1}).forEach(
                    function (response) {

                        response.consult = Consults.findOne({"_id": response.consult_id});
                        ConfirmedStudentResponses.insert(response);
                    }
                );

                var confirmedStudentResponses = ConfirmedStudentResponses.find();

                return confirmedStudentResponses;
            }

        },

        consultURL: function (consult_id) {
            return Meteor.absoluteUrl() + 'oncall/' + consult_id;

        },

        keyURL: function (consult_id) {
            return Meteor.absoluteUrl() + 'key/' + reverse(consult_id)
        },

        createdAtFormatted: function () {
            return moment(this.createdAt).format("YYYY-MM-DD HH:mm");
        }
    });


    Template.studentForm.helpers({


            createdAtFormatted: function () {
                return moment(this.createdAt).format("YYYY-MM-DD HH:mm");
            },

            gradYears: function () {
                var gradYears = [
                    {
                        year: moment().format("YYYY")
                    },
                    {
                        year: moment().add(1, 'y').format("YYYY")
                    }
                    ,
                    {
                        year: moment().add(2, 'y').format("YYYY")
                    }
                    ,
                    {
                        year: moment().add(3, 'y').format("YYYY")
                    },
                    {
                        year: moment().add(4, 'y').format("YYYY")
                    }
                ];
                return gradYears
            },

            selected_gradYear: function (year) {
                if ($("#studentGradYear").val() == year) {
                    return "selected";
                }
            }
        }
    )
    ;
    Template.studentForm.onRendered(function () {

        $('[data-toggle="tooltip"]').tooltip();

        $('#gradYear').val($('#studentGradYear').val());


    });


    Template.studentConsultResponses.onRendered(function () {

        $('[data-toggle="tooltip"]').tooltip();
        $('#studentResponsesTable').DataTable();


    });

    Template.importStudentCSV.events({
        "click .btnReadCsv": function (event, template) {
            Papa.parse(template.find('#csv-file').files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    _.each(results.data, function (csvData) {
                        // console.log(csvData.studentid);
                        if (!csvData.lastName) {
                            csvData.lastName = ''
                        }
                        if (!csvData.firstName) {
                            csvData.firstName = ''
                        }
                        if (!csvData.username) {
                            csvData.username = ''
                        }
                        if (!csvData.email) {
                            csvData.email = ''
                        }
                        if (!csvData.gradYear) {
                            csvData.gradYear = ''
                        }
                        if (!csvData.phone) {
                            csvData.phone = ''
                        }
                        if (csvData.studentid) {  // skips row if no studentid
                            var student = {
                                lastName: csvData.lastName,
                                firstName: csvData.firstName,
                                studentid: csvData.studentid,
                                username: csvData.username,
                                email: csvData.email,
                                gradYear: csvData.gradYear,
                                phone: standardizedPhoneFormat(csvData.phone)
                            };
                            Meteor.call('upsertStudentData', student);
                        } else {
                            sAlert.warning('A student was not processed because they had no Student ID.', {
                                effect: 'scale', position: 'top-right',
                                timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                            });
                        }

                    });
                }
            });
            Router.go('students');
        }
    });

}