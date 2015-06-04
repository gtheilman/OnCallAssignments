if (Meteor.isServer) {
    Meteor.methods({

        'updateResponse': function (response) {
            Responses.update(
                {_id: response.response_id},
                {
                    $set: {
                        student_id: response.student_id
                    }
                }
            );
        }
    });
}


