Meteor.publish(null, function () {
    return Meteor.roles.find({})
});


Meteor.publish('consults', function () {
    //returns empty set if not logged in or not in these roles

    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
        return Consults.find();
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

Meteor.publish('consultpages', function () {
    // for faculty, see everything
    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
        return ConsultPages.find();
    } else {
        // only let students see the consult pages that are set as visible
        return ConsultPages.find({consultVisible: true});
    }
});
Meteor.publish('keypages', function () {
    // for faculty, see everything
    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'grader')) {
        return KeyPages.find();
    } else {
        // only let students see the consult pages that are set as visible
        return KeyPages.find({keyVisible: true});
    }
});
