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


The program doesn't send the tweet.   However, it will generate a "draft tweet" that you can cut and paste into the Twitter website, an email, a Blackboard Announcement, or whatever method by which you choose to disseminate the consult request.



### Technical Details

The application uses [Twilio](http://www.Twilio.com) as a backend for the voice recording and text messages.   The faculty member has to have their own Twilio account and is responsible for whatever [charges](https://www.twilio.com/pricing) are incurred.   I do not have any financial interest in Twilio.  For sake of disclosure, some of the other providers of similar services are [Tropo](https://www.tropo.com/), [Plivo](https://www.plivo.com/), and [Nexmo](https://www.nexmo.com/).    Fork requests from persons wishing to adapt this software for use with other company's backends are welcome.

![](https://github.com/gtheilman/OncallAssignments/blob/master/media/Process.png)
 
The program is written in JavaScript using Bootstrap and the Meteor framework.   Meteor was chosen to allow for simple deployment by faculty members with little programming experience.   

Meteor lends itself well to deployment using a [Platform as a Service](https://en.wikipedia.org/wiki/Platform_as_a_service) (Paas) provider.  These are services where the server itself is managed by the company and the user is simply responsible for uploading and maintaining the application running on it. 

Deploying to [Meteor's own hosting service](https://www.meteor.com/try/6)   is the simplest option (and it is free!).  However, you have less control than you might if you use other "for pay" options such as [Modulus](http://help.modulus.io/customer/portal/articles/1647770-using-meteor-with-modulus), [Heroku](https://github.com/jordansissel/heroku-buildpack-meteor) or [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx).

###Installation

If you are a faculty member at an accredited health-care education school and would like assistance setting this up for your institution, please feel free to contact me.   

Installation does involve some use of the command line.  If you have no idea what "ls", "sudo" or "mkdir" mean, it might be best to get someone to help you.  But, if you are feeling adventurous, go ahead and follow the instructions below.

**Step 1** Sign up for a [Meteor account](https://www.meteor.com/)

It may not be immediately obvious, but to create an account you first click on the "Sign In" button on the Meteor website.  Then you will be given the opportunity to create a new account.


**Step 2:** Install Meteor on your local Windows, Mac or Linux computer.

The official instructions are [here](https://www.meteor.com/install), but you also might find these [unofficial instructions](http://meteortips.com/first-meteor-tutorial/getting-started/)  helpful.   

_Windows:_   The Windows installation process is pretty similar to what you see with installing other Windows programs.


_Mac:_  The Mac installer requires that you use [Terminal](http://guides.macrumors.com/Terminal).   You can [find the icon to open Terminal](http://www.wikihow.com/Open-Applications-Using-Terminal-on-Mac) in your Applications/Utilities folder.  Once you have Terminal open, cut and paste [the command](https://www.meteor.com/install) from the Meteor website into the Terminal window.  Then press <code>return</code>.


You can skip the "demo application" that Meteor asks you to create.

**Step 3:**  Download the application files to your local computer

Go to the [releases page](https://github.com/gtheilman/OnCallAssignments/releases) to obtain the most recent version of the application.   Download the zip file.

If you have a Mac, it will probably unzip the folder for you automatically.

If you have Windows, you'll need to unzip the folder yourself.

**Step 4:**  Run the application locally at least once.  

This involves going into Terminal (or Windows command prompt) and changing to the directory containing the Meteor files.  It can sometimes be difficult to figure out the path to the files you just downloaded.  Here's a way of doing it that might be easiest:

 
1.  Go back to the Terminal  (or [Windows command prompt](Open the [command prompt](http://www.7tutorials.com/7-ways-launch-command-prompt-windows-7-windows-8) )).

2. From the command prompt, type <code>cd </code>.   That's the letter "c" , the letter "d" and a space.  Don't hit return yet.

3. From with Windows _File Manager_ (or OSX _Finder_) locate the folder with the files you just downloaded and unzipped.  It probably starts with "OnCallAssignments-".  Don't move it from its original location.

4. [Drag](http://osxdaily.com/2009/11/23/copy-a-files-path-to-the-terminal-by-dragging-and-dropping/) the folder _name_ with little folder icon in front of it into the Terminal/command prompt window.   You are not selecting a bunch of files, but just that one line with the folder name.  Make sure you choose the folder immediately above the collection of files.

![](https://github.com/gtheilman/OncallAssignments/blob/master/media/folders.jpg) 
 
Drop it anywhere in the Terminal/command prompt window.

Click with your mouse anywhere in the Terminal/command prompt window.  Now press the <code>Enter/return</code> key.

Type the word <code>meteor</code> in the Terminal window.   Press the <code>Enter/return</code> key.  It will take a few minutes for the installation process to complete.



**Step 5:**  Deploy the application

While you can open the application in a web browser while it is running on your local computer, you'll likely have problems with Twilio if your program is not accessible to the outside world.   So, we're going to stop the program on your local computer by holding down the <code>Ctrl</code> (or <code>control</code>key and tapping <code>c</code> twice
 

Instead, we are going to [install your application]  (http://docs.meteor.com/#/basic/quickstart)  on Meteor's free server to try it out.  

Think of a unique one-word name for the application. Suppose you decide to call it <code>foo</code>.

Then, from the command prompt (or Terminal) type <code>meteor deploy foo </code> (or whatever name you chose).    Press the <code>Enter/return</code> key.

You will likely be asked for your Meteor username and password during this process.   When you type your password, it won't look like anything is happening on the screen.  Don't worry, it _is_ being typed.  When you are done,   press the <code>Enter/return</code> key.

After you successfully deploy to Meteor, a URL where your application can be accessed will be in the Terminal/command prompt window.  It will very likely be something like <code>http://foo.meteor.com</code>.  Make a note of it.

Once your application is up and running, you can delete the folder containing the files you downloaded.


###Initial Use

**Step 1:** Open the application in your web browser using the provided URL  

When the application is initially set up, the _login | password_  is _admin | admin_.   Change the admin email and password right away to something private by clicking on the _Faculty_ menu item and then _View/Edit/Delete_.  *Make sure you provide a real email address*.  The only way to recover a password is by requesting that the application send an password reset link by email.   If you forget your password and have not provided a recovery email address, you are locked out of the application.  

**Step 2:**  Sign up for a [Twilio account](https://www.twilio.com/)

The Twilio website walks you through the process of obtaining a phone number, but [this video](https://www.youtube.com/watch?v=MR5sAZUlx_0) might also help.  At this point, you don't need to provide Twilio a credit card.  The phone number used in the demo account is limited, but sufficient for testing purposes.


**Step 3:**  Enter your Twilio credentials into the application.

These are the AccountSID and AuthToken associated with your Twilio account.  They can be accessed in your account settings on the Twilio website.  Copy and paste these into the "Credentials" page in the application.

**Step 4:**  Click on the _Consults_ menu item and call the Twilio phone number listed there.  If you have not given Twilio a credit card number, make sure you call from a cell phone that you have "validated" with Twilio.    That's fine if you are just testing the application.

You'll first hear the "nag" message telling you to upgrade.  Press a key and you will hear the actual prompt for the consult.   Leave a message, then press any key on the cell phone to finish.

Within a few seconds you should get a text message with a link to the recording.

**Step 5:**  Review the response within the application by clicking on _Edit/View/Grade_ from within the _Consults_ page.


### Other Uses

This software might be useful for any situation where you might wish to record something a student is saying and have it reviewed/scored later.   
*  Patient counseling exercises:   Call the Twilio number and put the cell phone on "speakerphone".    Have the student counsel the "patient".
*  Practice having a pharmacy student call a "pharmacy" to request that a prescription be transferred.
*  Calling a "physician's office" to clarify a prescription.

###Notification of Use

**If you use this software for a class, please send me an email letting me know.**  This is just so I can include some information on my faculty activity report regarding how the software is being used.

### Disclaimers

While not absolutely necessary to use the program, this application is designed to store  student information.  Some of that information (such as phone numbers) might fall under  [Federal rules](http://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html) regarding  protecting student records.   While I have done my best to avoid situations which might expose private student information, I am making no guarantees as to data security.  You are responsible for reviewing the source code and making sure it meets the requirements of your institution.   If you are uncomfortable with adding student information to the application, **just don't add it**.   You can still have students phone in their reponses, it's just that some of the features that involve matching students with responses won't work.

I have not installed any "backdoors" that would allow me to access your installation of the application.   You can review the source code to see for yourself.   If you wish me to provide some sort of assistance once you have the application set-up, you would have to provide me with credentials to access your application.

Please review the software's license regarding lack of warranty and liability.    We are not responsible for anything bad that happens as a result of your using this software.


