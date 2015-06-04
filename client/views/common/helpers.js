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

    // account sign-in configuration
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });


    Template.registerHelper('phoneFormat', function (phone) {
        phone = phone.replace("+1", '');
        phone = phone.replace(/^1/, '');
        phone = phone.replace(/[^0-9]/g, '');
        phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        return phone;
    });


}


