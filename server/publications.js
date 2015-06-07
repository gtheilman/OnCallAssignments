Meteor.publish(null, function () {
    return Meteor.roles.find({})
});


Meteor.publish('consults', function () {
    //returns empty set if not logged in or not in these roles

    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
        return Consults.find();
    } else {
        return Consults.find({activate: true});
    }
});


Meteor.publish('students', function () {
    //returns empty set if not logged in or not in these roles
    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
        return Students.find();
    }
});


Meteor.publish('responses', function () {
    //returns empty set if not logged in or not in these roles
    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
        return Responses.find();
    }
});