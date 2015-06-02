TabularTables = {};


Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Students = new Tabular.Table({
    name: "StudentList",
    collection: Students,
    columns: [
        {data: "studentid", title: "Student ID"},
        {data: "username", title: "Username"},
        {data: "lastName", title: "Last Name"},
        {data: "firstName", title: "First Name"},
        {data: "email", title: "Email"},
        {data: "gradYear", title: "Graduating"},
        {data: "phone", title: "Phone"},
        {
            data: "_id",
            title: "View/Edit/Delete",
            render: function (val, type, doc) {
                return "<a href = '/studentForm/" + val + "'>View/Edit/Delete</a>";

            }
        }

    ]
});

TabularTables.Users = new Tabular.Table({
    name: "UserList",
    collection: Meteor.users,
    columns: [
        {data: "username", title: "username"},
        {
            data: "_id",
            title: "Send Password",
            render: function (val, type, doc) {
                return "<a href = '/passwordUser/" + val + "'>Send Password Link</a>";

            }
        },
        {
            data: "_id",
            title: "View/Edit/Delete",
            render: function (val, type, doc) {
                return "<a href = '/editUserForm/" + val + "'>View/Edit/Delete</a>";

            }
        }

    ]
});


TabularTables.Consults = new Tabular.Table({
    name: "ConsultList",
    collection: Consults,
    columns: [
        {
            data: "createdAt",
            title: "Created",
            render: function (val, type, doc) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        {data: "shortName", title: "Name"},
        {data: "tweetHeader", title: "Tweet Alert"},
        {
            data: "consultURL", title: "Consult",
            render: function (val) {
                return "<a href = '" + val + "' target='_blank' >" + val + "</a>";
            }
        },
        {
            data: "keyURL", title: "Key",
            render: function (val) {
                return "<a href = '" + val + "' target='_blank' >" + val + "</a>";
            }
        },
        {data: "phone", title: "Phone"},
        {
            data: "_id",
            title: "Edit",
            render: function (val, type, doc) {
                return "<a href = '/consultForm/" + val + "'>Edit/Review/Grade</a>";

            }
        },
        {
            data: "activate",
            title: "Active?",
            render: function (val) {
                if (val) {
                    return "Active";
                }


            }
        }

    ]
});


TabularTables.Responses = new Tabular.Table({
    name: "ResponseList",
    collection: Responses,
    columns: [
        {data: "start_time", title: "Time"},
        {data: "from", title: "From"},
        {
            data: "recordingURL",
            title: "Recording",
            render: function (val, type, doc) {
                return "<audio controls><source src=\"" + val +
                    " type=\"audio/mpeg\">Your browser does not support the audio element.</audio>";

            }
        },
        ,
        {
            data: "student_id",
            title: "Student",
            render: function (val) {
                var select = '<select name="student_id">';
                Students.find({}, {lastName: 1, firstName: 1}).forEach(function (student) {
                    select += '<option value="' + student._id + '">' + student.lastName + ', ' + student.firstName + '</option>';
                });
                select += "</select>";
                return select
            }
        },
        {data: "consult_id", title: "Consult ID"}

    ]
});



