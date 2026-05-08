/////////////////////////////////////////////////////////////////////////////
// REGISTRATION SETTINGS ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {
  // Payment provider: "stripe" | "authorize_net"
  // Switch back to "stripe" at any time — all Stripe infrastructure is preserved.
  CONFIG_PAYMENT_PROVIDER: "authorize_net",

  // Safety flag: set to true until prices/dates are officially confirmed.
  // While true, registration page shows an amber "Coming Soon" banner and disables the register button.
  CONFIG_REGISTRATION_PRICES_PENDING_CONFIRMATION: false,

  CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION: true,
  CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS: "1782882000000",    // 00:00 on July 1st, 2026 (CST)
  CONFIG_ANGLER_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1784091600000",    // 00:00 on July 14th, 2026 (CST)
  CONFIG_SPONSOR_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1784091600000",    // 00:00 on July 14th, 2026 (CST)
  CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING:
    "Pre-registration (before July 1st, 2026):",
  CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE: 150,
  CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE: 110,
  CONFIG_REGISTRATION_NORMAL_DATE_STRING:
    "Normal registration (after July 1st, 2026):",
  CONFIG_REGISTRATION_NORMAL_ADULT_FEE: 200,
  CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE: 130,
  CONFIG_REGISTRATION_PAST_TEAMS_TABLES_FOR_AUTOCOMPLETE_NAME_LIST: [
    // "anglers2025",
  ],
  CONFIG_REGISTRATION_HAS_DISCLAIMERS: true,
  CONFIG_REGISTRATION_DISCLAIMERS: {
    Disclaimers: [
      "By entering this tournament participants agree to abide by all rules and decisions.",
      "All decisions made by the weigh master and/or tournament directors are final.",
    ],
  },
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
