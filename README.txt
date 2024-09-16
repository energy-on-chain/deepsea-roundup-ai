###############################################################################
# PROJECT: Fishing Tournament Template (V3)
# DATE STARTED: 2-August-2024
# DESCRIPTION: This is the third iteration of the "angler tourney application"
# based on customer feedback and lessons learned during the 2024 tournament
# season. This repo is meant to be "copy pasted" and customized / adapted for 
# individual tournaments. The potential functionality includes: catch tracking,
# realtime scoring (leaderboard), fish pots, linked merch sites, online 
# registration and payment, sponsor advertisement, auctions, and more.
###############################################################################
###############################################################################
###############################################################################
# CHANGELOG
# v3.0.0
# Initial commit of the project. 
###############################################################################
###############################################################################
###############################################################################
# DEV HOURS: 
# AS OF: DD MM YYYY
###############################################################################
###############################################################################
###############################################################################
# NEW TOURNAMENT SETUP
1. Clone new github repo for tournament from template 
  [] Repo: https://github.com/energy-on-chain/fishing-tournament-app-template-v3
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
  [] Get email and password from client
  [] Add client logo to the "payment receipt" template
  [] Setup staging webhook(s) for registration, pots
  [] Setup production webhook(s) for registration, pots
  [] Save project secred info to put into .env file (e.g. private key, webhook key)
5. Setup project Firebase services
  [] Authentication (add admin emails and passwords)
  [] Firestore Database
  [] Storage (for images)
  [] Save project secret info to put into .env file
  [] Set the Storage "Rules" as follows:
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
  [] Go to the google cloud console for the project and enable Cloud Storage
  [] Go to the settings tab for your storage bucked (staging and production), then create a new member called "allUsers" who is a "Storage Object Viewer"
7. Update the .env file in the main project directory
  [] Add client stripe info 
  [] Add client firebase info
  [] FIXME: Add google cloud info...?
8. Update all config files 
  [] adminConfig.js
  [] catchConfig.js
  [] dashboardConfig.js
  [] generalConfig.js
  [x] homeConfig.js
  [] leaderboardConfig.js
  [] newsfeedConfig.js
  [] potsConfig.js
  [] registrationConfig.js
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
- Start react: (run in client and api terminals: nvm use 21.6.0)
- Start redis server: (run in terminal: redis-server, confirm running: redis-cli ping)
- Start stripe webhook for local dev: (run in terminal: stripe listen --forward-to localhost:3001/api/registration-webhook)

