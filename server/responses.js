if (Meteor.isServer) {
    Meteor.methods({

        'updateResponse': function (response) {
            Responses.update(
                {_id: response._id},
                {
                    $set: {
                        student_id: response.student_id
                    }
                }
            );
        }
    });
}


