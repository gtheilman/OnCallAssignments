if (!Meteor.isClient) {
} else {
    // Highlights the active menu item
    Template.navItems.helpers({
        activeIfTemplateIs: function (template) {
            var currentRoute = Router.current();
            return currentRoute &&
            template === currentRoute.lookupTemplate() ? 'active' : '';
        }
    });


}


if (Meteor.isClient) {
    // account sign-in configuration
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
}


if (Meteor.isClient) {
    Template.consultForm.helpers({
        aliceChecked: function (id) {
            var consult = Consults.findOne({_id: id});
            if (consult.voice == 'alice') {
                return "checked"
            }
        },
        manChecked: function (id) {
            var consult = Consults.findOne({_id: id});
            if (consult.voice == 'man') {
                return "checked"
            }
        },
        womanChecked: function (id) {
            var consult = Consults.findOne({_id: id});
            if (consult.voice == 'woman') {
                return "checked"
            }
        }
    })

}