if (!Meteor.isClient) {
} else {


    // Handles the result of the student form submission
    Template.studentForm.events({
        "submit #studentForm": function (event) {
            event.preventDefault();

            if ($('#studentid').val() == "") {
                alert('Student ID must be provided');
            }
            else if ($('#lastName').val() == "") {
                alert('Last name must be provided');
            } else if ($('#firstName').val() == "") {
                alert('First name must be provided');
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
            Meteor.call('deleteStudentData', $('#studentid').val());
            Router.go('students');
        }
    });

}

Template.importStudentCSV.events({
    "click .btnReadCsv": function (event, template) {
        Papa.parse(template.find('#csv-file').files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                _.each(results.data, function (csvData) {
                    console.log(csvData.studentid);
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
                        console.log("Record skipped because no studentid present.")
                    }

                });
            }
        });
        Router.go('students');
    }
});