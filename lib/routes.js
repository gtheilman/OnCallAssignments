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

    // Generates a text message
    this.route('/text/:_id', function () {
        var phone = this.params._id;
        Meteor.call('sendSMS', function (error, result) {
            if (!error) {
                console.log(error);
            } else {
                console.log(result);
            }
        });
        alert("Said");
        Router.go('users');
    });

    // Assembles XML that provides voice message when student calls the number
    Router.route('/say/:phone', {
        where: 'server',
        action: function () {
            var phone = this.params.phone;
            var consultdata = Consults.findOne({phone: phone, activate: true});
            var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            xmlData += "<Response>";
            xmlData += "<Say voice=\"" + consultdata.voice + "\" language=\"en\">" + consultdata.phoneMessage + "</Say>";
            xmlData += "<Record action=\" " + Meteor.absoluteUrl() + "sendConfirmation\" method=\"GET\" ";
            xmlData += "maxLength=\"" + consultdata.maxSeconds + "\" finishOnKey=\"*\"";
            xmlData += "  transcribe=\"" + consultdata.transcribe + "\" trim=\"do-not-trim\" /> ";
            xmlData += "</Response>";
            this.response.writeHead(200, {'Content-Type': 'application/xml'});
            this.response.end(xmlData);
        }
    });

    // Collects the information sent about the recording, stores it in the database and sends a confirmatory SMS
    Router.route('/sendConfirmation', {
        where: 'server',
        action: function () {
            var RecordingUrl = this.params.query.RecordingUrl;
            var Called = this.params.query.Called;
            var Caller = this.params.query.Caller;
            Responses.insert({
                RecordingUrl: RecordingUrl,
                Called: Called,
                Caller: Caller
            });

            var xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            xmlData += "<Response>";
            xmlData += "<Sms from=\"+" + Called + "\" to=\"+" + Caller + "\">" + RecordingURL + "</Sms>";
            xmlData += "</Response>";
            this.response.writeHead(200, {'Content-Type': 'application/xml'});
            this.response.end(xmlData);
        }
    });

})
;

