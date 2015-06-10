Router.configure({
    layoutTemplate: 'layout'  //Uses Bootstrap Grid System
});
Router.map(function () {
    this.route('home', {
        path: '/',
        action: function () {
            if (Session.get("credentialsStatus") == 0) {
                Router.go('credentialsForm');
            } else {
                Router.go('title')
            }
        }
    });
    this.route('title', {
        path: '/title',
        template: 'title'
    });

    this.route('/about', {where: 'server'}).get(function () {
        this.response.writeHead(302, {
            'Location': "https://github.com/gtheilman/OncallAssignments"
        });
        this.response.end();
    });

    // This is for creating new students.  Note that same page is also used for editing students
    this.route('newStudentForm', {
        path: '/studentForm',
        template: 'studentForm'
    });

    // This is for editing students.  Note that same page is used for new students.
    this.route('editStudentForm', {
        path: '/studentForm/:_id',
        data: function () {
            return Students.findOne({_id: this.params._id});
        },
        template: 'studentForm'

    });

    // Provides a full list of all students
    this.route('students', {
        data: {
            studentList: function () {
                return Students.find({}, {sort: {lastName: 1, firstName: 1}})
            }
        },
        waitOn: function () {
            return Meteor.subscribe('students');
        }
    });


    this.route('importStudentCSV', {
        path: 'importStudentCSV',
        template: 'importStudentCSV'
    });

    // download a CSV file of students in db
    this.route('/exportStudentCSV', {
        where: 'server',
        action: function () {
            var filename = 'students.csv';
            var fileData = "";

            var headers = {
                'Content-type': 'text/csv',
                'Content-Disposition': "attachment; filename=" + filename
            };

            var csv = '"lastName","firstName","username","studentid","email","gradYear","phone"\n';
            Students.find().forEach(function (student) {
                csv += '\"' + student.lastName + '\",';
                csv += '\"' + student.firstName + '\",';
                csv += '\"' + student.username + '\",';
                csv += '\"' + student.studentid + '\",';
                csv += '\"' + student.email + '\",';
                csv += '\"' + student.gradYear + '\",';
                csv += '\"' + student.phone + '\"\n';
            });

            this.response.writeHead(200, headers);
            return this.response.end(csv);
        }
    });


    // download a sample CSV file for importing students
    this.route('/exportSampleStudentCSV', {
        path: 'exportSampleStudentCSV',
        where: 'server',
        action: function () {
            var filename = 'sampleStudents.csv';
            var fileData = "";

            var headers = {
                'Content-type': 'text/csv',
                'Content-Disposition': "attachment; filename=" + filename
            };

            var csv = '"lastName","firstName","username","studentid","email","gradYear","phone"\n';
            csv += '\"' + "Smith" + '\",';
            csv += '\"' + "John" + '\",';
            csv += '\"' + "jsmith" + '\",';
            csv += '\"' + "1234678" + '\",';
            csv += '\"' + "jsmith@example.com" + '\",';
            csv += '\"' + "2019" + '\",';
            csv += '\"' + "12025551212" + '\"\n';
            csv += '\"' + "Jones" + '\",';
            csv += '\"' + "Mary" + '\",';
            csv += '\"' + "mjones" + '\",';
            csv += '\"' + "87654321" + '\",';
            csv += '\"' + "mjones@example.com" + '\",';
            csv += '\"' + "2019" + '\",';
            csv += '\"' + "13015551212" + '\"\n';


            this.response.writeHead(200, headers);
            return this.response.end(csv);
        }
    });


    // Provides a full list of all users (faculty)
    this.route('users', {
        data: {
            userList: function () {
                return Meteor.users.find({}, {sort: {email: 1}})
            }
        }
    });

    // This is for creating new users (faculty). There is no page for editing users, just deleting them.
    this.route('newUserForm', {
        path: '/userForm',
        template: 'userForm'
    });

    this.route('editUserForm', {
        path: '/editUserForm/:_id',
        data: function () {
            Meteor.call('retrieveUser', this.params._id, function (error, result) {
                if (!error) {
                    //console.log(result);
                    //  console.log(result.username);
                    Session.set("username", result.username);
                    Session.set("email", result.emails[0].address);
                    Session.set("_id", result._id);
                    Session.set("admin", result.admin);
                    Session.set("grader", result.grader);
                }
            });
        },
        template: 'editUserForm'
    });

    // Deletes user (faculty)
    this.route('/deleteUser/:_id', function () {
        var id = this.params._id;
        Meteor.call('deleteUser', id);
        Router.go('users');
    });

    // sends a password reset email to user (faculty)
    this.route('/passwordUser/:_id', function () {
        var id = this.params._id;
        Meteor.call('passwordUser', id, function (error, result) {
            if (result) {
                sAlert.success('Sent', {
                    effect: 'scale', position: 'top-right',
                    timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                });
            } else {
                if (result) {
                    sAlert.error('There was a problem sending the password link.', {
                        effect: 'scale', position: 'top-right',
                        timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
                    });
                }
            }
        });


    });


    // This is for creating new consults.  Note that same page is also used for editing consults
    this.route('newConsultForm', {
        path: '/consultForm',
        template: 'consultForm'
    });

    // This is for editing consults.  Note that same page is used for new consults.
    this.route('editConsultForm', {
        path: '/consultForm/:_id',
        data: function () {
            Session.set("consult_id", this.params._id);
            var consult = Consults.findOne({_id: this.params._id});
            //  console.log("ConsultForm consult:");
            //  console.log(consult);
            return consult

        },
        template: 'consultForm'
    });


    // Provides a full list of all consults
    this.route('consults', {
        data: {
            consultList: function () {
                return Consults.find({}, {createdAt: -1})
            }
        },
        waitOn: function () {
            return Meteor.subscribe('consults');
        }
    });

    // form to enter Twilio/email credentials
    this.route('credentialsForm', {});


    // Assembles XML that provides voice message when student calls the number
    this.route('/say/:phone', {
        where: 'server',
        action: function () {
            var phone = this.params.phone;
            var consultdata = Consults.findOne({phone: phone, activate: true});

            // if there is a consult active for this number, say the message
            if (consultdata) {
                var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
                xmlData += "<Response>";
                xmlData += "<Say voice=\"" + consultdata.voice + "\" language=\"en\">" + consultdata.phoneMessage + "</Say>";
                xmlData += "<Record action=\"" + Meteor.absoluteUrl() + "sendConfirmation\" method=\"GET\" ";
                xmlData += "maxLength=\"" + consultdata.maxSeconds + "\"  /> ";
                if (consultdata.transcribe) {
                    xmlData += "  transcribeCallback=\"" + Meteor.absoluteUrl() + "receiveTranscription\"  /> ";
                }
                xmlData += "</Response>";
                this.response.writeHead(200, {'Content-Type': 'application/xml'});
                this.response.end(xmlData);
            } else {
                // No consult active.  Reject the call so that we don't get charged by Twilio.
                var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
                xmlData += "<Response>";
                xmlData += "<Reject />";
                xmlData += "</Response>";
                this.response.writeHead(200, {'Content-Type': 'application/xml'});
                this.response.end(xmlData);
            }
        }
    });

    // Collects the information sent about the recording, stores it in the database and sends a confirmatory SMS
    this.route('/sendConfirmation', {
        where: 'server',
        action: function () {
            var CallSid = this.params.query.CallSid;
            var RecordingUrl = this.params.query.RecordingUrl;
            var Called = this.params.query.Called.substr(this.params.query.Called.length - 11);
            var Caller = this.params.query.Caller.substr(this.params.query.Called.length - 11);
            var CallerName = this.params.query.CallerName;

            // Leaves off the '+' so that the number is the same as the format as in the database
            var phone = this.params.query.Called.substr(this.params.query.Called.length - 11);
            var consultdata = Consults.findOne({phone: phone, activate: true});
            var consult_id = consultdata._id;

            Responses.insert({
                callSid: CallSid,
                phone: phone,
                consult_id: consult_id,
                callerName: CallerName,
                createdAt: new Date(),
                student_id: '', // leaving this empty until someone manually confirms the identity of the caller
                user_id: ''  // This will be the id of the faculty member who confirms the student's identity later
            });

            var RecordingURLMP3 = RecordingUrl + ".mp3";


            Meteor.call('shortenURL', RecordingURLMP3, function (error, result) {
                if (!error && result.length > 0) {  // if we have a shortened URL, send it
                    RecordingURLMP3 = result;
                    Meteor.call('sendSMS', Caller, Called, "You can review your consult response at " + RecordingURLMP3, function (error, result) {  // to, from, message
                        if (!error) {
                            // console.log(result);
                        } else {
                            // return error
                        }
                    });

                } else { // if can't get shortened URL, send original
                    Meteor.call('sendSMS', Caller, Called, "You can review your consult response at " + RecordingURLMP3, function (error, result) {  // to, from, message
                        if (!error) {
                            // console.log(result);
                        } else {
                            // return error
                        }
                    });

                }
            });
            // try to send email confirmation
            var credentials = Credentials.findOne({});
            if (credentials.emailPassword) {
                var student = Students.findOne({phone: Caller});
                if (student) {
                    var to = student.email;
                    var subject = "On-Call Assignment Response";
                    var text = "You can review your consult response at " + RecordingURLMP3;
                    Meteor.call('sendEmail', to, subject, text
                    );
                }
            }
            // HangupMessage

            if (!consultdata.hangupMessage) {
                consultdata.hangupMessage = "Thanks for your help.  Goodbye";
            }
            var xmlData = "<Response><Say voice=\"" + consultdata.voice + "\" language=\"en\">" + consultdata.hangupMessage + "</Say></Response>";
            this.response.writeHead(200, {'Content-Type': 'application/xml'});
            this.response.end(xmlData);
        }
    });

    //TODO:  Get this working
    // download a CSV file of responses in db
    this.route('exportResponsesCSV', {
        path: '/exportResponsesCSV/:_id',
        where: 'server',
        action: function () {
            var filename = 'responses.csv';
            var fileData = "";
            var headers = {
                'Content-type': 'text/csv',
                'Content-Disposition': "attachment; filename=" + filename
            };
            var csv = '"received","recordingURL","transcript","callerID","phoneRegistrant","studentLastName","studentFirstName","studentID", "studentUsername",' +
                ' "studentEmail", "studentGradYear","studentPhone","consultName","consultURL","keyURL"\n';
            Responses.find({consult_id: this.params._id}).forEach(function (response) {
                csv += '\"' + response.createdAt + '\",';
                csv += '\"' + response.recordingURL + '\",';
                if (response.transcriptionText) {
                    csv += '\"' + response.transcriptionText + '\",';
                } else {
                    csv += '\"' + '\",';
                }
                csv += '\"' + response.phone + '\",';
                if (response.callerName) {
                    csv += '\"' + response.callerName + '\",';
                } else {
                    csv += '\"' + '\",';
                }

                var student = Students.findOne({_id: response.student_id});
                if (student) {
                    csv += '\"' + student.lastName + '\",';
                    csv += '\"' + student.firstName + '\",';
                    csv += '\"' + student.studentid + '\",';
                    csv += '\"' + student.username + '\",';
                    csv += '\"' + student.email + '\",';
                    csv += '\"' + student.gradYear + '\",';
                    csv += '\"' + student.phone + '\",';
                } else {
                    csv += '\"' + '\",';
                    csv += '\"' + '\",';
                    csv += '\"' + '\",';
                    csv += '\"' + '\",';
                    csv += '\"' + '\",';
                    csv += '\"' + '\",';
                    csv += '\"' + '\",';
                }

                var consult = Consults.findOne({_id: response.consult_id});
                csv += '\"' + consult.shortName + '\",';
                csv += '\"' + Meteor.absoluteUrl() + "oncall/" + consult._id + '\",';
                var key = Meteor.call('reverse', consult._id);
                var keyURL = Meteor.absoluteUrl() + "oncall/" + key;
                csv += '\"' + keyURL + '\"\n';
            });
            this.response.writeHead(200, headers);
            return this.response.end(csv);
        }
    });


    // Collects the information sent about the recording, stores it in the database and sends a confirmatory SMS
    this.route('/receiveTranscription', {
        where: 'server',
        action: function () {
            var recordingSid = this.params.query.RecordingSid;
            var transcriptionText = this.params.query.TranscriptionText;

            Responses.update(
                {recordingSid: recordingSid},

                {
                    $set: {

                        transcriptionText: transcriptionText
                    }
                }
            );
        }
    });


    this.route('oncall', {
        path: '/oncall/:_id',
        data: function () {
            return ConsultPages.findOne({consult_id: this.params._id})
        },
        action: function () {
            this.render('oncall');
        },
        layoutTemplate: 'layoutOnCall'
    });


    this.route('key', {
        path: '/key/:_id',
        data: function () {
            // to keep things simplier, the key url is the same as the consult, just reversed
            var reverse_id = reverse(this.params._id);
            return KeyPages.findOne({consult_id: reverse_id});
        },
        action: function () {
            this.render('key');
        },
        layoutTemplate: 'layoutOnCall'
    });



})
;

