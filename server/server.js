if (Meteor.isServer) {
    Meteor.methods({
        'resetServer': function () {
            //reset server
            if (Roles.userIsInRole(this.userId, 'admin')) {

                Meteor.setTimeout(function () {
                    process.exit();
                }, 1000);

                return true

            }

        }
    });
}