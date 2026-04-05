/////////////////////////////////////////////////////////////////////////////
// REGISTRATION SETTINGS ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {
  CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION: true,
  // CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS: "1719810000000",    // 00:00 on July 1st, 2024 (CST) FIXME: testing
  // CONFIG_ANGLER_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1721023200000",    // 01:00 on July 15th, 2024 (CST) FIXME: testing
  // CONFIG_SPONSOR_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1721023200000",    // 01:00 on July 15th, 2024 (CST) FIXME: testing

  CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS: "1751346000000",    // 00:00 on July 1st, 2025 (CST) 
  CONFIG_ANGLER_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1752555600000",    // 00:00 on July 14th, 2025 (CST)    
  CONFIG_SPONSOR_REGISTRATION_CUTOFF_IN_LOCAL_TIME_IN_MS: "1752555600000",    // 00:00 on July 14th, 2025 (CST)    
  CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING:
    "Pre-registration (before July 1st, 2025):",    // FIXME: must be confirmed by client
  CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE: 130,    // FIXME: must be confirmed by client
  CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE: 110,    // FIXME: must be confirmed by client
  CONFIG_REGISTRATION_NORMAL_DATE_STRING:
    "Normal registration (after July 1st, 2025):",    // FIXME: must be confirmed by client
  CONFIG_REGISTRATION_NORMAL_ADULT_FEE: 150,    // FIXME: must be confirmed by client
  CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE: 130,    // FIXME: must be confirmed by client
  CONFIG_REGISTRATION_PAST_TEAMS_TABLES_FOR_AUTOCOMPLETE_NAME_LIST: [
    // "anglers2024",
  ],
  CONFIG_REGISTRATION_HAS_DISCLAIMERS: true,
  CONFIG_REGISTRATION_DISCLAIMERS: {
    Disclaimers: [
      // "It is up to the Tournament Director's discretion to reschedule or cancel due to weather.",
      "By entering this tournament participants agree to abide by all rules and decisions.",
      "All decisions made by the weigh master and/or tournament directors are final.",
    ],
    // Refunds: [
    //   "It is the intent of the tournament committee to refund 50% of entry fees if the tournament is cancelled.",
    // ],
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

