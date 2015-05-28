Meteor.publish('students', function() {
    return Students.find();
});

Meteor.publish('consults', function () {
    return Consults.find();
});

