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



});
