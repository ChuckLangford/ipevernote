# ipevernote
A node script that works in conjunction with a heroku instance to get your public IP address and then save that information in an Evernote note.  Use this client along with my [other](https://github.com/ChuckLangford/herokuipstream) repo.

## An Explanation
I created this script and the related server so I could always have my home IP address and remotely run tests on my Raspberry Pi. Sure, I could have setup dynamic dns but, frankly, this was more fun.

This script is setup so that you can either run it manually or, as a scheduled job. When properly configured, it will connect to your heroku instance (more about that [here](https://github.com/ChuckLangford/herokuipstream)), retrieve your home ip address, and then save that information into a single note within your Evernote account. Additionally, if you schedule the app to run more than once, it will update the same Evernote note, rather than create a new one each time.

## Installation
I'll start by presuming you've already got the [REQUIRED SERVER](https://github.com/ChuckLangford/herokuipstream) up and running.

Once you've cloned the code on your machine, cd into your copy and run:
```
npm install
touch production.config.json
touch sandbox.config.json
```
The config files are identical except for their values.  Evernote has a sandbox environment where you should test your code (including this code) and the production environment when you're ready to run. Here's a sample config file:
```
{
  "key": "<YOUR_DEV_PRIVATE_KEY>",
  "heroku": "<YOUR_HEROKU_SERVER>",
  "guidfile": "<TXT_FILE_THAT_CONTAINS_EVERNOTE_NOTE_GUID>"
}
```
The "key" value is your Evernote Developer Token.  Read more in the Evernote Key section below.

The "heroku" value is your heroku server that this code will query. The server only needs to return the ip address, nothing more.

The "guidfile" is just the name of the text file that you want the application to read/create.  The only thing it will contain is the guid of the Evernote note that is created.  If you delete this file, the application will simply create a new note the next time it runs.  This value should only be a name, not a full path.  The file will be created in the same directory as the code.

If you decide to work in the Evernote sandbox before running this against your production Evernote account, you'll need to change the following lines:
```
var config = require('./production.config.json');
var client = new Evernote.Client({token: config.key, sandbox: false});
```
to this:
```
var config = require('./staging.config.json');
var client = new Evernote.Client({token: config.key, sandbox: true});
```

## Evernote Key
I'm going to be intentionally vague about acquiring the Evernote key needed to run this for two reasons.  First, Evernote is able to change their procedures at anytime and without notice so being vague saves me from having to update this again.  Second, this code touches your actual Evernote account.  If you live inside Evernote like I do, then you don't want some code you found off the internet messing with your stuff without knowing exactly what it's going to do.

[Start Here](https://dev.evernote.com/).

One more thing.  This code expects to be run with a Developer Token.  Not OAuth.  Happy reading.
