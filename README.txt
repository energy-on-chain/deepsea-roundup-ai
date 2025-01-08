###############################################################################
# PROJECT: Fishing Tournament Template (V3)
# IMPLEMENTED FOR: Deepsea Roundup
# DATE STARTED: 2-December-2024
# DESCRIPTION: This is the codebase for the Deepsea Roundup annual fishing 
# tournament, implemented using the v3 angler tourney template. 
###############################################################################
###############################################################################
###############################################################################
# CHANGELOG
# v0.0.1 
# Initial commit of the project. 
# Firebase projects: deepsea-roundup-v3-staging, deepsea-roundup-v3-prod
###############################################################################
###############################################################################
###############################################################################
# DEV HOURS: 0
# AS OF: 2-December-2024
###############################################################################
###############################################################################
###############################################################################
# NEW TOURNAMENT SETUP
1. Clone new github repo for tournament from template (use chat gpt instructions)
  [x] Repo: https://github.com/energy-on-chain/fishing-tournament-app-template-v3
2. Update client artwork (use https://imageresizer.com/)
  [x] Homepage logo for desktop (location="client/src/images/HomePageLogoDesktop.png" maxWidth=1020px)
  [x] Homepage logo for tablet (location="client/src/images/HomePageLogoTablet.png" maxWidth=750px)
  [x] Homepage logo for mobile (location="client/src/images/HomePageLogoMobile.png" location= maxWidth=350px)
  [x] Navbar logo for all devices (location="client/src/images/NavBarLogo.png" size=125px wide by 63px tall or smaller)
  [x] Favicon logo for all devices (location="client/public/favicon.ico" size=48px by 48px )
  [x] Add all necessary logos to the src/components/dashboard folder for display on the dashboard page
3. Update the client/public folder
  [x] Add client title to index.html 
4. Setup project Stripe services
  [x] Get email and password from client
  [x] Add client logo to the "payment receipt" template
  [] Setup staging webhook(s) for registration, pots
  [] Setup production webhook(s) for registration, pots
  [] Save project secret info to put into .env file (e.g. private key, webhook key)
5. Setup project Firebase services
  [x] Authentication (add admin emails and passwords)
  [x] Firestore Database
  [x] Storage (for images)
  [x] Save project secret info to put into .env file
  [x] Set the Storage "Rules" as follows:
    rules_version = '2';
    // Craft rules based on data in your Firestore database
    // allow write: if firestore.get(
    //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          // Allow anyone to read
          allow read: if true;
          // Allow only authenticated users to write
          allow write: if request.auth != null;
        }
      }
    }
6. Setup google cloud services
  [x] Go to the google cloud console for the project and enable Cloud Storage
  [x] Go to the settings tab for your storage bucked (staging and production), then create a new member called "allUsers" who is a "Storage Object Viewer"
7. Update the .env file in the main project directory
  [] Add client stripe info 
  [x] Add client firebase info
  [x] Add client google cloud info
8. Update all config files 
  [] adminConfig.js
  [] catchConfig.js
  [] dashboardConfig.js
  [x] generalConfig.js
  [x] homeConfig.js
  [] leaderboardConfig.js
  [x] newsfeedConfig.js
  [] potsConfig.js
  [x] registrationConfig.js
  [] stylingConfig.js
9. Deploy to heroku
  [] Enable automatic re-deployment via github push for staging and production
  [] Enter all variables from .env file to config_vars tab for staging and production
  [] FIXME: Redis?
10. Testing
  [] Stripe webhook urls for staging and production environment
  [] FIXME: additional testing...?
###############################################################################
###############################################################################
###############################################################################
# DEV NOTES
- Link to historical catch records: https://roundup.portasouthjetty.com/wp-content/uploads/images/2023-06-22/15p1.jpg
- Start react: (run in client and api terminals: nvm use 21.6.0)
- Start redis server: (run in terminal: redis-server, confirm running: redis-cli ping)
- Start stripe webhook for local dev: (run in terminal: stripe listen --forward-to localhost:3001/api/registration_webhook)

EXTRAS:
[x] Google Cloud - Go to "Service Accounts" in cloud project console sidebar. Create a json key, then add the created file to the local project main directory. After that, add the json file to your .gitignore file. Finally, add all of the contents to your .env files.
[] HostGator - Adding the aliases...
[] Redis - How to use this...

FUTURE
[] Handle free anglers associated with sponsor signups
