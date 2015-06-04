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
                    phone: $('#phone').val(),
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

    });
    //   Get responses along with consult information
    Template.studentConsultResponses.helpers({
        responses: function () {
            var student = Template.parentData(1);
            // console.log("xStudent:");
            // console.log(student._id);

            ConfirmedStudentResponses.remove({}); // clear out the temporary db

            Responses.find({student_id: student._id}, {createdAt: 1}).forEach(
                function (response) {
                    // console.log("Response:");
                    // console.log(response);
                    response.consult = Consults.findOne({"_id": response.consult_id});
                    ConfirmedStudentResponses.insert(response);
                }
            );

            // console.log("ConfirmedStudentResponses");
            var confirmedStudentResponses = ConfirmedStudentResponses.find();
            // console.log(confirmedStudentResponses);
            return confirmedStudentResponses;


            // return Responses.find({student_id: student._id}, {createdAt: 1});
        },

        createdAtFormatted: function () {
            return moment(this.createdAt).format("YYYY-MM-DD HH:mm");
        }
    });

    // TODO:  Determine whether any responses exist for this student
    Template.studentForm.helpers({
        countResponses: function () {
            var student = Template.parentData(1);
            console.log("student:");
            console.log(student);
            if (Responses.find({student_id: $('#student_id').val()})) {
                return true
            }
        },

        createdAtFormatted: function () {
            return moment(this.createdAt).format("YYYY-MM-DD HH:mm");
        }
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
                                phone: csvData.phone
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