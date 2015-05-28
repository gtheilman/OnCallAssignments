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
            title: "Edit",
            render: function (val, type, doc) {
                return "<a href = '/studentForm/" + val + "'>Edit</a>";

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
            title: "Delete",
            render: function (val, type, doc) {
                return "<a href = '/deleteUser/" + val + "'>Delete</a>";

            }
        }

    ]
});


TabularTables.Consults = new Tabular.Table({
    name: "ConsultList",
    collection: Consults,
    columns: [
        {data: "shortName", title: "ShortName"},
        {data: "tweetHeader", title: "tweetHeader"},
        {data: "consultURL", title: "consultURL"},
        {data: "keyURL", title: "keyURL"},
        {data: "phone", title: "Phone"},
        {
            data: "_id",
            title: "Edit",
            render: function (val, type, doc) {
                return "<a href = '/consultForm/" + val + "'>Edit</a>";

            }
        }

    ]
});
