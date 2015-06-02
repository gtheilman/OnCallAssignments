# OncallAssignments
This is a program to manage an "on-call" assignment for health-care students.

### Scenario
Students are told that they are "on-call" for a certain period of time.  During that time, they must monitor a Twitter feed.  At random times during the on-call period, the faculty member tweets the URL of a webpage containing a "consult".  Each student has an hour to 
- Review the consult
- Formulate a recommendation 
- Phone it in to a telephone number provided in the tweet

When the student calls the telephone number, they are greeted by a message saying something along the lines of 
 
_Thanks for calling me back.  What do you think we should do with this patient?_
 
The students then have two minutes to explain their recommendation.

After the student hangs up, they receive a text message on their phone with a link to a recording of the the response they just left.  This text confirms to the student that their response was received and recorded.

Faculty can then go through the responses left by the students and score them on communications skills, clinical reasoning, professionalism, etc.

### Technical Details

This particular version uses [Twilio](http://www.Twilio.com) as a backend for the voice recording and text messages.   The faculty member has to have their own Twilio account and is responsible for whatever charges are incurred.   I do not have any financial interest in Twilio and this software could probably be easily adapted to use a different service.   Twilio just seemed to have a nicely documented REST API to work with.

The program is written using the Meteor framework.   Meteor was chosen to allow for easy customization and deployment by faculty members with little experience in information technology.   

Meteor lends itself well to deployment using a [Platform as a Service](https://en.wikipedia.org/wiki/Platform_as_a_service) (Paas) provider.  These are services where the server itself is managed by the company and the user is simply responsible for uploading and maintaining the application running on it.  Two common options for deploying Meteor applications are Meteor itself and Modulus.

Deploying to [Meteor](https://www.meteor.com/try/6)   is the simplest option (and it is free!).  However, the service is really intended for prototyping, not production.  It would probably do fine for the short bursts of activity that would be associated with students calling in responses, but I've not really tested it under those conditions.

Deploying to [Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus) takes a few more steps to set up but is not really all that difficult.  Modulus charges to host the application but allows you to "turn off" the application during times it is not being used.  It also has the capability to scaling up for brief periods of time in case you find the website is not keeping up with student demand.


If you are a faculty member at an accredited health-care education school and would like assistance setting this up for your institution, please feel free to contact me.   


**This is still in development.  Not ready to be used.**
