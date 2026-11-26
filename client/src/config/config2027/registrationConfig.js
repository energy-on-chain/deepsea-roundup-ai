/////////////////////////////////////////////////////////////////////////////
// REGISTRATION SETTINGS ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {
  // Safety flag: set to true until prices/dates are officially confirmed.
  // While true, registration page shows an amber "Coming Soon" banner and disables the register button.
  CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION: true,    // flip to false to open 2027 registration

  CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION: true,
  CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS: "1814331600000",    // PLACEHOLDER Wed 30-Jun-2027 00:00 CDT: confirm with client
  CONFIG_ANGLER_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1815541200000",    // PLACEHOLDER Wed 14-Jul-2027 00:00 CDT (end of Tue 13 Jul): confirm with client
  CONFIG_SPONSOR_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1815541200000",    // PLACEHOLDER Wed 14-Jul-2027 00:00 CDT (end of Tue 13 Jul): confirm with client
  CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING:
    "Pre-registration (before June 30th, 2027):",
  CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE: 150,    // PLACEHOLDER: confirm with client (2026 price)
  CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE: 110,    // PLACEHOLDER: confirm with client (2026 price)
  CONFIG_REGISTRATION_NORMAL_DATE_STRING:
    "Normal registration (after June 30th, 2027):",
  CONFIG_REGISTRATION_NORMAL_ADULT_FEE: 200,    // PLACEHOLDER: confirm with client (2026 price)
  CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE: 130,    // PLACEHOLDER: confirm with client (2026 price)
  CONFIG_REGISTRATION_PAST_TEAMS_TABLES_FOR_AUTOCOMPLETE_NAME_LIST: [
    // "anglers2026",
  ],
  CONFIG_REGISTRATION_HAS_DISCLAIMERS: true,
  CONFIG_REGISTRATION_DISCLAIMERS: {
    Disclaimers: [
      "By entering this tournament participants agree to abide by all rules and decisions.",
      "All decisions made by the weigh master and/or tournament directors are final.",
    ],
  },
  // PLACEHOLDER: 2026 sponsorship tiers and prices; confirm with client
  CONFIG_SPONSOR_REGISTRATION_TIERS: {
    "Tournament Top Sponsor": 25000,
    "Platinum Tier": 10000,
    "Gold Tier": 5000,
    "Silver Tier": 1000,
    "Bronze Tier": 500,
  },
  CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS: {
    "Single Day Exhibit - Friday": 750,
    "Single Day Exhibit - Saturday": 750,
    "Bill & Bo Horn Memorial Fish Fry": 1000,
    "Junior Boatmen Raffle": 1000,
    "Piggy Perch": 500,
    "Junior Trophies - Bay/Surf": 1500,
    "Junior Trophies - Offshore": 2000,
    "All Championship Trophies": 500,
    "Adult Division - 1st Place Trophies": 225,
    "Adult Division - 2nd Place Trophies": 175,
  },
  CONFIG_SPONSOR_REGISTRATION_RULES_HYPERLINK: "https://deepsearoundup.org/sponsorship-information/",
};
