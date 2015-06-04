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

###Installation

If you are a faculty member at an accredited health-care education school and would like assistance setting this up for your institution, please feel free to contact me.   

Installation does involve some use of the command line.  If you have no idea what "ls", "sudo" or "mkdir" mean, it might be best to get someone to help you.

**Step 1:** Install Meteor on your local Windows, Mac or Linux computer.

The official instructions are [here](https://www.meteor.com/install), but you also might find these [unofficial instructions](http://meteortips.com/first-meteor-tutorial/getting-started/) or [this video](https://youtu.be/9EsDHeI327s) helpful.

**Step 2:**  Create a directory on your local computer.  Call it something like "OnCallAssignments".

**Step 3:**  Download the zip file with the contents of this repository and unzip it into that directory. 
The "Download Zip" button is on the right-side of the repository page.  

**Step 4:**  Deploy the application

While you can [run the application locally] (http://docs.meteor.com/#/basic/quickstart) on your local computer, you'll likely have problems with Twilio if your program is not accessible to the outside world.   So, [deploy your application]  (http://docs.meteor.com/#/basic/quickstart)  on Meteor's free server to try it out.  For production purposes, a PaaS service like [Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus) may be more appropriate.

When you deploy to Meteor, you will be given a URL where your application can be accessed.  Make a note of it.

**Step 6:** Run the application using the Meteor URL  

When the application is initially set up, the login | password  is _admin | admin_.   Change the admin password right away to something private.   Create a user account for yourself and use it rather than the admin account.  Make sure to give your new account the appropriate roles (i.e., administrator, active).

**Step 6:**  Get a Twilio account

**Step 7:**  Enter your Twiliio credentials into the application.

**Step 8:**  Call the Twilio phone number from a cell phone.

**This is still in development.  Not ready to be used.**
