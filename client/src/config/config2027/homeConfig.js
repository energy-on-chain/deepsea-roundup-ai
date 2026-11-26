/////////////////////////////////////////////////////////////////////////////
// HOMEPAGE SETTINGS ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {
  // false: home page shows the date string above and hides the countdown. Set true once dates are final.
  CONFIG_HOME_DATES_CONFIRMED: false,
  CONFIG_HOME_TOURNAMENT_DATE_STRING: "Dates to be announced",    // TODO(2027): confirm (e.g. "July 8th - 11th, 2027")
  CONFIG_HOME_TOURNAMENT_HEADLINE_STRING: "Join the 91st edition of the Gulf Coast's oldest fishing tournament!",
  CONFIG_HOME_TOURNAMENT_START_IN_LOCAL_TIME_IN_MS: "1815022800000",    // TODO(2027): confirm (tentative: Thu, Jul 8, 2027, 12:00 AM CT)
  CONFIG_HOME_PAST_TOURNAMENT_RESULT_STRINGS: [
    "2026 Tournament: 411 anglers / 381 catches / $66,100 total pot",
    "2025 Tournament: 360 anglers / 336 catches / $41,900 total pot",
    "2024 Tournament: 410 anglers / 343 catches / $46,075 total pot",
  ],
  CONFIG_HOME_SPECIES_TYPE_LIST_FOR_CATCH_COUNT: [
    "Billfish",
    "Meatfish",
  ],
  CONFIG_HOME_CATCH_STAT_TYPE: "catches",
};
