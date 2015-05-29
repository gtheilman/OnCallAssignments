if (!Meteor.isClient) {
} else {
    // Highlights the active menu item
    Template.navItems.helpers({
        activeIfTemplateIs: function (template) {
            var currentRoute = Router.current();
            return currentRoute &&
            template === currentRoute.lookupTemplate() ? 'active' : '';
        },

        logout: function () {
            Meteor.logout();
        }
    });
}


if (Meteor.isClient) {
    // account sign-in configuration
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
}

