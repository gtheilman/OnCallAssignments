# OncallAssignments
This is a program to manage an "on-call" assignment for health-care students.

The scenario given to the students is that they are "on-call" for a certain period of time.  During that time, they must monitor a Twitter feed.  At random times during the on-call period, the faculty member tweets the URL of a webpage containing a "consult".  Each student has an hour to review the consult, formulate a recommendation and phone it in to a number provided in the tweet.

When the student calls the number, they are greeted by a message saying something along the lines of "Thanks for calling me back.  What do you think we should do with this patient?".   They then have two minutes to explain their recommendation.

After the student hangs up, they receive a text message on their phone with a link to a recording of the the response they just left.  This text confirms to the student that their response was received and recorded.

Faculty can then go through the responses left by the students and score them on communications skills, clinical reasoning, professionalism, etc.




This particular version uses Twilio as a backend for the voice recording and text messages.   The faculty member has to have their own Twilio account and is responsible for whatever charges are incurred.   I do not have any financial interest in Twilio and this software could probably be easily adapted to use a different service.   Twilio just seemed to have a nicely documented REST API to work with.

The program is written using the Meteor framework.




This is still in development.  Not ready to be used.
