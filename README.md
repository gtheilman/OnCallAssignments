# OnCallAssignments
This is a web-based program to manage an "on-call" assignment for health-care students.

### Scenario
Students are told that they are "on-call" for a certain period of time.  During that time, they must monitor a Twitter feed.  At random times during the on-call period, the faculty member tweets the URL of a webpage containing a "consult".  Each student has an hour to 
- Review the consult
- Formulate a recommendation 
- Phone in the recommendation to a telephone number provided in the tweet

When the student calls the telephone number, they are greeted by a message saying something along the lines of 
 
_Thanks for calling me back.  What do you think we should do with this patient?_
 
The students then have two minutes to explain their recommendation.  They press a key to indicate they are finished.   The voice thanks them for their advice and hangs up.

Within a few minutes the student receives a text message (SMS) on their phone with a link to a recording of the the response they just left.  This SMS confirms to the student that their response was received and recorded.  If the student has an email on file that is associated with the caller ID of their phone, they will also be emailed the link.

Faculty can then go through the responses left by the students and score them on communications skills, clinical reasoning, professionalism, etc.


![ScreenShot.png](https://github.com/gtheilman/OncallAssignments/blob/master/media/ScreenShot.png)
 

Additional features:
- Manage several different phone numbers.  For example, different classes could be using the application at the same time, just by calling different telephone numbers.
- Different permission levels for administrators and those who just need to grade student responses
- Generate web pages to display a written consult and/or a grading rubric (key)
-  Transcribe the recording (extra fee charged by provider)
-  Look up the person registered to an incoming cell phone number (extra fee charged by provider)
-  Choose from different voices for outgoing messages
-  Specify the maximum amount of time students have to record their responses (no rambling).
-  Import and export students in CSV format


The program doesn't currently interact with Twitter.   However, it will generate a "draft tweet" that you can cut and paste into the Twitter website, a Blackboard Announcement, or whatever method by which you choose to disseminate the consult request.



### Technical Details

This particular version uses [Twilio](http://www.Twilio.com) as a backend for the voice recording and text messages.   The faculty member has to have their own Twilio account and is responsible for whatever [charges](https://www.twilio.com/pricing) are incurred.   I do not have any financial interest in Twilio and this software could probably be easily adapted to use a different service.   Twilio just seemed to have a nicely documented REST API to work with.

![](https://github.com/gtheilman/OncallAssignments/blob/master/media/Process.png)
 
The program is written using Bootstrap and the Meteor framework.   Meteor was chosen to allow for easy customization and deployment by faculty members with little programming experience.   

Meteor lends itself well to deployment using a [Platform as a Service](https://en.wikipedia.org/wiki/Platform_as_a_service) (Paas) provider.  These are services where the server itself is managed by the company and the user is simply responsible for uploading and maintaining the application running on it.  Two common options for deploying Meteor applications are Meteor itself and Modulus.

Deploying to [Meteor](https://www.meteor.com/try/6)   is the simplest option (and it is free!).  However, the service is really intended for prototyping, not production.  It would probably do fine for the short bursts of activity that would be associated with students calling in responses, but I've not really tested it under those conditions.

Deploying to [Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus) takes a few more steps to set up but is not really all that difficult.  Modulus charges to host the application but allows you to "turn off" the application during times it is not being used.  It also has the capability to scaling up for brief periods of time in case you find the website is not keeping up with student demand.

###Installation

If you are a faculty member at an accredited health-care education school and would like assistance setting this up for your institution, please feel free to contact me.   

Installation does involve some use of the command line.  If you have no idea what "ls", "sudo" or "mkdir" mean, it might be best to get someone to help you.  But, if you are feeling adventurous, go ahead and follow the instructions below.

**Step 1:**  Sign up for a [Twilio account](https://www.twilio.com/)

The Twilio website takes you through the process of obtaining a phone number, but [this video](https://www.youtube.com/watch?v=MR5sAZUlx_0) might also help.  At this point, you don't need to provide Twilio a credit card.  The phone number used in the demo account is limited, but sufficient for testing purposes.

**Step 2** Sign up for a [Meteor account](https://www.meteor.com/)

It may not be immediately obvious, but to create an account you first click on the "Sign In" button on the Meteor website.  Then you will be given the opportunity to create a new account.


**Step 3:** Install Meteor on your local Windows, Mac or Linux computer.

The official instructions are [here](https://www.meteor.com/install), but you also might find these [unofficial instructions](http://meteortips.com/first-meteor-tutorial/getting-started/)  helpful.   

_Windows:_   The Windows installation process is pretty similar to what you see with installing other Windows programs.


_Mac:_  The Mac installer requires that you use [Terminal](http://guides.macrumors.com/Terminal).   You can [find the icon to open Terminal](http://www.wikihow.com/Open-Applications-Using-Terminal-on-Mac) in your Applications/Utilities folder.  Once you have Terminal open, cut and paste [the command](https://www.meteor.com/install) from the Meteor website into the Terminal window.  Then press <code>return</code>.


You can skip the "demo application" that Meteor asks you to create.

**Step 4:**  Download the application files to your local computer

Go to the [releases page](https://github.com/gtheilman/OnCallAssignments/releases) to obtain the most recent version of the application.   Download the zip file.

If you have a Mac, it will probably unzip the folder for you automatically.

If you have Windows, you'll need to unzip the folder yourself.

**Step 5:**  Run the application locally at least once.  
 
1.  Go back to the Terminal  (or [Windows command prompt](Open the [command prompt](http://www.7tutorials.com/7-ways-launch-command-prompt-windows-7-windows-8) )).

2. From the command prompt, type <code>cd </code>.   That's the letter "c" , the letter "d" and a space.  Don't hit return yet.

3. Find the folder with the files your just downloaded and unzipped.  It is probably start with "OnCallAssignments-".  Don't move it from its original location.

4. [Drag](http://osxdaily.com/2009/11/23/copy-a-files-path-to-the-terminal-by-dragging-and-dropping/) the folder _name_ with little folder icon in front of it into the Terminal/command prompt window.   You are not selecting a bunch of files, but just that one line with the folder name.  Drop it anywhere in the Terminal/command prompt window.

5. Click with your mouse anywhere in the Terminal/command prompt window.  Now press the <code>Enter/return</code> key.

6. Type the word _meteor_ in the Terminal window.   Press the <code>Enter/return</code> key.



**Step 6:**  Deploy the application

While you can open the application in a web browser while it is running on your local computer, you'll likely have problems with Twilio if your program is not accessible to the outside world.   So, we're going to stop the program on your local computer by holding down the <code>Ctrl</code> (or <code>control</code>key and tapping <code>c</code> twice
 

Instead, we are going to [install your application]  (http://docs.meteor.com/#/basic/quickstart)  on Meteor's free server to try it out.  

Think of a unique one-word name for the application. Suppose you decide to call it <code>foo</code>.

Then, from the command prompt (or Terminal) type <code>meteor deploy foo </code> (or whatever name you chose).    Press the <code>Enter/return</code> key.

You will likely be asked for your Meteor username and password during this process.   When you type your password, it won't look like anything is happening on the screen.  Don't worry, it _is_ being typed.  When you are done,   press the <code>Enter/return</code> key.

After you successfully deploy to Meteor, a URL where your application can be accessed will be in the Terminal/command prompt window.  It will very likely be something like <code>http://foo.meteor.com</code>.  Make a note of it.

**Step 7:** Open the application in your web browser using the provided URL  

When the application is initially set up, the _login | password_  is _admin | admin_.   Change the admin password right away to something private.   Create a user account for yourself and use it rather than the admin account.  Make sure to give your new account the appropriate role (i.e., administrator).

**Step 8:**  Enter your Twilio credentials into the application.

These are the AccountSID and AuthToken associated with your Twilio account.  They can be accessed on the Twilio page in your Account settings.   

Copy and paste these into the "Credentials" page in the application.

**Step 9:**  Call the Twilio phone number from a cell phone and leave a message.

**Step 10:**  Review the response within the application.

Once your application is up and running, you can delete the folder containing the files you downloaded.



**Some Warnings **

While not absolutely necessary to use the program, this application is designed to store  student information.  Some of that information (such as phone number) might fall under  [Federal rules](http://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html) regarding  protecting student privacy.   While I have done my best to avoid situations which might expose private student information, I am making no guarantees as to data security.  You are responsible for reviewing the source code and making sure it meets the requirements of your institution.   If you are uncomfortable with adding student information to the application, you can still use it.   It's just that some of the features that involve matching students with consult responses won't work.

I have not installed any "backdoors" that would allow me to access your installation of the application.   You can review the source code to see for yourself.   If you wish me to provide some sort of assistance once you have the application set-up, you would have to provide me with credentials to access your application.
