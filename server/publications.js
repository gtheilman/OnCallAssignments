Meteor.publish(null, function () {
    return Meteor.roles.find({})
});


Meteor.publish('consults', function () {
    //returns empty set if not logged in or not active
    if (this.userId) {
        if (Roles.userIsInRole(this.userId, 'active')) {
            return Consults.find();
        }
    } else {
        return Consults.find({activate: true});
    }
});


Meteor.publish('students', function () {
    //returns empty set if not logged in or not active
    if (this.userId) {
        if (Roles.userIsInRole(this.userId, 'active')) {
            return Students.find();
        }
    }
});


Meteor.publish('responses', function () {
    //returns empty set if not logged in or not active
    if (this.userId) {
        if (Roles.userIsInRole(this.userId, 'active')) {
            return Responses.find();
        }
    }
});