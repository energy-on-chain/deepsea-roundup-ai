/////////////////////////////////////////////////////////////////////////////
// GENERAL SETTINGS /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {

  // VISUAL
  CONFIG_GENERAL_TOURNAMENT_NAME: "Deepsea Roundup",
  CONFIG_GENERAL_YEAR: "2026",
  CONFIG_GENERAL_TOURNAMENT_NUMBER: 90,
  CONFIG_GENERAL_HAS_INFO: true,
  CONFIG_GENERAL_HAS_REGISTRATION: true,
  CONFIG_GENERAL_HAS_LEADERBOARD: true,
  CONFIG_GENERAL_HAS_NEWSFEED: true,
  CONFIG_GENERAL_HAS_ADMIN: true,
  CONFIG_GENERAL_HAS_STATS_TAB: true,
  CONFIG_GENERAL_HAS_REPORTS_TAB: true,
  CONFIG_GENERAL_HAS_POTS: true,
  CONFIG_GENERAL_HAS_AUCTION: false,
  CONFIG_GENERAL_LINK_TO_TOURNAMENT_WEBSITE:
    "https://deepsearoundup.org/",
  CONFIG_GENERAL_LINK_TO_TOURNAMENT_RULES:
    "https://deepsearoundup.org/tournament-rules/",
  CONFIG_GENERAL_INFO_LINK_OBJECT: {
    "Tournament Site": "https://deepsearoundup.org/",
    Rules: "https://deepsearoundup.org/tournament-rules/",
  },
  CONFIG_GENERAL_TOURNAMENT_LINK_OBJECT: {
    Register: "/2026/register",
    Newsfeed: "/2026/newsfeed",
    Leaderboard: "/2026/leaderboard",
    Slideshow: "/2026/leaderboard-slideshow",
    Pots: "/2026/pots",
    Records: "/2026/records",
    "Piggy Perch": "/2026/piggy-perch",
    // "Auction": "/2026/auction",
  },
  CONFIG_GENERAL_ADMIN_LINK_OBJECT: {
    Settings: "/2026/admin",
    Dashboard: "/dashboard",
  },
  // CONTACT INFO
  CONFIG_GENERAL_CONTACT_FOOTER_LOCATION_STRING: "Austin, TX    -    New Orleans, LA", // Contact info
  CONFIG_GENERAL_CONTACT_FOOTER_PHONE_STRING: "Phone / Text: (630) 991-3012",
  CONFIG_GENERAL_CONTACT_FOOTER_EMAIL_STRING:
    "Email: support@customtournamentsolutions.com",
  CONFIG_GENERAL_CONTACT_FOOTER_COMPANY_COPYRIGHT_STRING:
    " Custom Tournament Solutions, 2023-Present, All Rights Reserved",
  CONFIG_GENERAL_CONTACT_INFO_ADMIN_NAME_1: "Cody Craig",
  CONFIG_GENERAL_CONTACT_INFO_ADMIN_NAME_2: "Matt Hartigan",
  CONFIG_GENERAL_CONTACT_INFO_ADMIN_EMAIL_1: "cody@arrowheadecology.com",
  CONFIG_GENERAL_CONTACT_INFO_ADMIN_EMAIL_2: "matthew@deepwaterdigital.tech",

  // FIREBASE
  CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME: "anglers2026", // Firebase
  CONFIG_GENERAL_FIREBASE_TEAMS_ID_NAME: "anglersId",
  CONFIG_GENERAL_FIREBASE_SPONSORS_TABLE_NAME: "sponsors2026",
  CONFIG_GENERAL_FIREBASE_SPONSORS_ID_NAME: "sponsorId",
  CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME: "catches2026",
  CONFIG_GENERAL_FIREBASE_CATCHES_ID_NAME: "catchId",
  CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_TABLE_NAME: "announcements2026",
  CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_ID_NAME: "announcementId",
  CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME: "pots2026",
  CONFIG_GENERAL_FIREBASE_POTS_ID_NAME: "potId",
  CONFIG_GENERAL_FIREBASE_AUCTION_TABLE_NAME: "auction2026",
  CONFIG_GENERAL_FIREBASE_AUCTION_ID_NAME: "auctionId",
};
