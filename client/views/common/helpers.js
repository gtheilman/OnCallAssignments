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

    this.friendlyPhoneFormat = function (phone) {
        if (phone.length > 6) {
            phone = phone.replace("+1", '');
            phone = phone.replace(/^1/, '');
            phone = phone.replace(/[^0-9]/g, '');
            phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            return phone;
        } else {
            return ""
        }
    };

    Template.registerHelper('friendlyPhoneFormat', friendlyPhoneFormat);


    this.standardizedPhoneFormat = function (phone) {
        if (phone.length > 6) {
            phone = phone.replace(/[^0-9]/g, '');
            if (phone.charAt(0) != "1") {
                phone = "1" + phone;
            }
            return phone;
        } else {
            return ""
        }
    };

    Template.registerHelper('standardizedPhoneFormat', standardizedPhoneFormat);


    // Decided to make the URL for the consult keys the same ending string as the consults, only reversed
    reverse = function reverse(s) {
        for (var i = s.length - 1, o = ''; i >= 0; o += s[i--]) {
        }
        return o;
    };

    Template.registerHelper('reverse', reverse);

    Template.navItems.helpers({
        hasRole: function () {
            if (Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'grader')) {
                return true
            }
        }
    });

    Template.oncall.helpers({

        addNewLine: function (md) {
            return "  \n" + md;
        }
    });


    Template.key.helpers({

        addNewLine: function (md) {
            return "  \n" + md;
        }
    });


}


