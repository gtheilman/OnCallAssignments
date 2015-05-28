Meteor.publish('students', function() {
    return Students.find();
});

