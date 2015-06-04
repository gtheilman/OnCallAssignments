Router.configure({
    // loadingTemplate: 'loading', // put in iron router progress package, instead.
    layoutTemplate: 'layout'  //Uses Bootstrap Grid System
});

Router.map(function () {
    this.route('home', {
        path: '/'
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

    // download a CSV file of students
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
                    Session.set("active", result.active);
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
        //TODO:  Callback this
        Meteor.call('passwordUser', id);
        sAlert.success('Sent', {
            effect: 'scale', position: 'top-right',
            timeout: '5000', onRouteClose: false, stack: true, offset: '0px'
        });
        Router.go('users');
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

    // form to enter Twilio/email/twitter credentials
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
                xmlData += "maxLength=\"" + consultdata.maxSeconds + "\" finishOnKey=\"*\"";
                xmlData += "  transcribe=\"" + consultdata.transcribe + "\" trim=\"do-not-trim\" timeout=\"10\"  /> ";
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

            // Leaves off the '1' so that the number is the same as the format as in the database
            var phone = this.params.query.Called.substr(this.params.query.Called.length - 10);
            var consult_id = Consults.findOne({phone: phone, activate: true})._id;

            Responses.insert({
                callSid: CallSid,
                phone: phone,
                consult_id: consult_id,
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
                            return error
                        }
                    });
                } else { // if can't get shortened URL, send original
                    Meteor.call('sendSMS', Caller, Called, "You can review your consult response at " + RecordingURLMP3, function (error, result) {  // to, from, message
                        if (!error) {
                            // console.log(result);
                        } else {
                            return error
                        }
                    });

                }
            });
            // Couldn't get Twilio to send an SMS by returning TWiML (although that's the way it is supposed
            // to be done).   Might be because the student has hung up by now.  However, NOT returning
            // XML causes Twilio to complain.   So the below is to give Twilio something so it won't generate
            // an error.
            var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Hangup/></Response>";
            this.response.writeHead(200, {'Content-Type': 'application/xml'});
            this.response.end(xmlData);
        }
    });


    this.route('test', {
        path: '/test/',
        data: function () {
            Meteor.call('sendEmail',
                'gtheilman@gmail.com',
                'TwitterConsults@gmail.com',
                'Test from OnCallAssignments',
                'This is a test of @ x2 Email with retrieval from db commented out and %40 in host ');

        }

    });


})
;

