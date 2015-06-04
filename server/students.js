if (Meteor.isServer) {
    Meteor.methods({
        /*
        This server-side function updates a record if the studentid already
        exists.  If the studentid does not already exist, a new record is
        created.   Updating based on studentid  has to be done server-side
        because of security restrictions in Meteor.
         */
        'upsertStudentData': function (student) {
            Students.upsert(
                {
                    studentid: student.studentid
                },
                {
                    lastName: student.lastName,
                    firstName: student.firstName,
                    username: student.username,
                    email: student.email,
                    studentid: student.studentid,
                    gradYear: student.gradYear,
                    phone: student.phone,
                    createdAt: new Date()
                }
            )
        },
        'deleteStudentData': function (student_id) {
            var responses = Responses.find({student_id: student_id}).count();
            if (responses == 0) {
                Students.remove(
                    {
                        _id: student_id
                    }
                );
                return true
            } else {
                return false
            }
        }


    });
}
        
        
        
    
