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
# CHANGELOG
# v3.0.0
# Initial commit of the project. 
###############################################################################
###############################################################################
# DEV HOURS: 6
# AS OF: 3 August 2024
###############################################################################
###############################################################################
# NEW TOURNAMENT SETUP STEPS
1. Fork new github repo for tournament from template
2. Get artwork from client
  - Homepage logo for desktop (location="client/src/images/HomePageLogoDesktop.png" maxWidth=1020px)
  - Homepage logo for tablet (location="client/src/images/HomePageLogoTablet.png" maxWidth=750px)
  - Homepage logo for mobile (location="client/src/images/HomePageLogoMobile.png" location= maxWidth=350px)
  - Navbar logo for all devices (location="client/src/images/NavBarLogo.png" size=125px wide by 63px tall or smaller)
  - Favicon logo for all devices (location="client/public/favicon.ico" size=48px by 48px )
3. Update the client/public folder
  - Add client title to index.html 
  - Add client favicon.ico to folder
4. Update the .env file in the main project directory
  - Add client stripe (local testing using a terminal with: stripe listen --forward-to localhost:3001/api/registration-webhook)
  - Add client firebase
  - Add google Cloud
5. Update the config.js file at client/src/config.js
  - Update the stripe webhook urls for test and production (test them both!!!)
###############################################################################
###############################################################################
# FUTURE FEATURE ADDITIONS
- Sponsors page (display them, link to sites)
- Sponsor registration
- Media (photos, videos of past tournaments)
- Merch shop (standalone, with registration)
- Newsfeed
- Stats (public/private)
- Participants (angler/boat profiles)
- Email list (customer follow up, advertising, etc.)
###############################################################################
###############################################################################
#DEV TODO
[x] New template repo
[x] Footer
[x] Home
[] Registration
[] Admin
[] Catches
[] Leaderboard
[] Pots
[] Auction
[] Styling
[] Create subdomains of customtournamentsolutions/[EVENT_NAME_GOES_HERE]
[] Deploy (dev branch, heroku)
[] Test (from blank template using BFP2024 data as if it were BFP2025)
[] Finish setting up BFP2025

REGISTRATION
[x] Universal cutoff timestamp
[x] Handle multiple disclaimers (e.g. weather, refunds)
[x] Autocomplete using past entry data
[x] Convert double lists to objects in config file (e.g. disclaimers)
--------
[] Setup server with stripe (add checkedIn box) 
[] Attempt to clear all console errors during stripe usage...
[] Handle multiple unpaid add-ons (e.g. hometown)
[] Handle multiple paid add-ons (e.g. exta wristbands)
[] Handle image file uploading for registrants... dictate size, etc... how do you change it on the back end?
[] Bulk upload feature for teams using a csv (scripts folder, templates folder)

ADMIN
[] vars: numLeaderboardAwards (e.g. top 3?)
[] Login + logout
[] Stay on same tab on refresh
[] Team tab
[] Catches tab
[] Pots tab
[] Auction tab
[] Reports tab (registration check-in, leaderboard summary, pot summary, auction summary, full award summary that includes)
[] Stats tab
[] Settings tab (hideLeaderboard, hidePots, hideAuction, hide? all pages by toggling the hasWhatever variable)
[] Full catch report (timestamp vs l/w/g)

CATCHES
[] vars: listOfFieldsToDisplay (e.g. name, age, gender, team, length, width, girth)
[] Searchable by team / angler
[] Bulk upload feature for catches

LEADERBOARD
[] vars: numLeaderboardRows, hasSpeciesWinners, hasGrandChampion, hasGrandSlam, hasCatchAndReleaseDaily, hasMeatfishDaily, finalResultsTimestamp
[] Add title mapping (e.g. ?Grand Champion? endpoint can use a different name)
[] Add point mapping for all fish types? e.g. 1lb = 1pt, blue marlin = 100pts
[] Toggle ?preliminary? vs ?final? message using config file time stamp
[] Views: list, select, slideshow
[] If no winners yet, post empty table

POTS
[] vars: numLeaderboardRows, hasSpeciesWinners, hasGrandChampion, hasGrandSlam, hasCatchAndReleaseDaily, hasMeatfishDaily, finalResultsTimestamp
[] Toggle ?preliminary? vs ?final? message using config file time stamp
[] Board views: grid, select
[] Standings views: list, select, slideshow
[] Integrate STRIPE payments? ?hasPaid?? just like check-in field
[] Board creation? hasCatchAndReleaseBoard, hasMeatfishBoard with name mapping
[] If no winner yet, post empty table
[] Deleting a team deletes their pots too
[] Add stat to homepage

AUCTION
[] vars: auctionStartTimestamp, auctionEndTiimestamp, hideAuctionEmails, hideAuctionPhoneNumbers, *checkboxStrings: e.g. is 21?*
[] See DSR notes?
[] Add stat to the homepage

STYLING
[] Loading screens for all
[] Move the header and background colors to the config file
[] Sorting arrows visible on tables
[] "FIXME" search and replace
[] BasePage.css (multiple)
[] HomePage.css (multiple)
[] RegisterPage.css (multiple)
[] RootNavigation.css (multiple)

