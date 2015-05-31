Router.configure({
    loadingTemplate: 'loading', // Something to display while Meteor is starting up.
    layoutTemplate: 'layout'  //Uses Bootstrap Grid System
});

Router.map(function () {
    this.route('home', {
        path: '/'
    });

    this.route('about');

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
        }
    });


    this.route('importStudentCSV', {
        path: 'importStudentCSV',
        template: 'importStudentCSV'
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
                    console.log(result);
                    console.log(result.username);
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
        Meteor.call('passwordUser', id);
        alert("Sent");
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
            return Consults.findOne({_id: this.params._id});
        },
        template: 'consultForm'
    });


    // Provides a full list of all consults
    this.route('consults', {
        data: {
            consultList: function () {
                return Consults.find({})
            }
        }
    });

    // form to enter Twilio credentials
    this.route('twilioForm', {});


    // Assembles XML that provides voice message when student calls the number
    this.route('/say/:phone', {
        where: 'server',
        action: function () {
            var phone = this.params.phone;
            var consultdata = Consults.findOne({phone: phone, activate: true});
            var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            xmlData += "<Response>";
            xmlData += "<Say voice=\"" + consultdata.voice + "\" language=\"en\">" + consultdata.phoneMessage + "</Say>";
            xmlData += "<Record action=\"" + Meteor.absoluteUrl() + "sendConfirmation\" method=\"GET\" ";
            xmlData += "maxLength=\"" + consultdata.maxSeconds + "\" finishOnKey=\"*\"";
            xmlData += "  transcribe=\"" + consultdata.transcribe + "\" trim=\"do-not-trim\" timeout=\"10\"  /> ";
            xmlData += "</Response>";
            this.response.writeHead(200, {'Content-Type': 'application/xml'});
            this.response.end(xmlData);
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
                student_id: '', // leaving this empty until someone manually confirms the identity of the caller
                user_id: ''  // This will be the id of the faculty member who confirms the student's identity later
            });

            var RecordingURLMP3 = RecordingUrl + ".mp3";

            Meteor.call('shortenURL', RecordingURLMP3, function (error, result) {
                if (!error && result.length > 0) {  // if we have a shortened URL, send it
                    RecordingURLMP3 = result;
                    // Couldn't get Twilio to send an SMS by returning TWiML (although that's the way it is supposed
                    // to be done).   Might be because the student has hung up by now.  However, NOT returning
                    // XML causes Twilio to complain.   So the below is to give Twilio something so it won't generate
                    // an error.
                    Meteor.call('sendSMS', Caller, Called, "You can review your consult response at " + RecordingURLMP3, function (error, result) {  // to, from, message
                        if (!error) {
                            this.response.writeHead(200, {'Content-Type': 'application/xml'});
                            this.response.end(error.detail);
                        } else {
                            this.response.writeHead(200, {'Content-Type': 'application/xml'});
                            this.response.end();
                        }
                    });
                } else { // if can't get shortened URL, send original
                    Meteor.call('sendSMS', Caller, Called, "You can review your consult response at " + RecordingURLMP3, function (error, result) {  // to, from, message
                        if (!error) {
                            this.response.writeHead(200, {'Content-Type': 'application/xml'});
                            this.response.end();
                        } else {
                            this.response.writeHead(200, {'Content-Type': 'application/xml'});
                            this.response.end(error.detail);
                        }
                    });

                }
            });
        }
    });


    this.route('test', {
        path: '/test/:callSid',
        data: function () {
            Meteor.call('callInfo', this.params.callSid, function (error, result) {
                if (!error) {
                    console.log(result);
                    console.log(result.from);

                } else {
                    console.log(error.detail);
                    console.log(error);

                }
            });
        }

    });



})
;

