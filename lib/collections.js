Students = new Meteor.Collection('students');
Consults = new Meteor.Collection('consults');
TwilioCredentials = new Meteor.Collection('twilioCredentials');
Responses = new Meteor.Collection('responses');

// This is a local,temporary collection that stores information that is received from the Twilio website
// It is emptied and refreshed whenever necessary
ConsultResponses = new Meteor.Collection();

