if (Meteor.isServer) {
    Meteor.methods({

        'updateResponse': function (response) {
            /*
             //  check to see if student already has a phone associated with them.  If not, use the caller id
             var student = Students.findOne({_id: response.student_id});
             if (student.phone.length >6 ) {
             var phone = standardizedPhoneFormat(student.phone);
             } else {
             var phone = standardizedPhoneFormat(response.phone);
             }

             */
            Responses.update(
                {_id: response.response_id},
                {
                    $set: {
                        student_id: response.student_id
                    }
                }
            );
        },

        'updateStudentPhone': function (student_id, phone) {
            Students.update(
                {_id: student_id},
                {
                    $set: {
                        phone: phone
                    }
                }
            );
            return true
        }
    });
}


