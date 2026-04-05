/////////////////////////////////////////////////////////////////////////////
// POT SETTINGS /////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {
  CONFIG_POTS_SHOW_WINNERS_PUBLICLY: false,
  CONFIG_POTS_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER: true,
  CONFIG_POTS_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS: "1753074000000",    // Monday, 21-July-2025 00:00 AM
  // CONFIG_POTS_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS: "1721538000000",    // TEST: Sunday, 21-July-2024 00:00 AM
  CONFIG_POTS_TEAM_SUMMARY_DESKTOP_COLUMN_DEFINITIONS: [
    { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: false},
    { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
  ],
  CONFIG_POTS_TEAM_SUMMARY_MOBILE_COLUMN_DEFINITIONS: [
    { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: false},
    { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
  ],
  CONFIG_POTS_INDIVIDUAL_TEAM_SUMMARY_DESKTOP_COLUMN_DEFINITIONS: [
    { field: 'potName', headerName: 'Pot', flex: 3, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: false},
    { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: false},
    { field: 'payout', headerName: 'Payout', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
  ],
  CONFIG_POTS_INDIVIDUAL_TEAM_SUMMARY_MOBILE_COLUMN_DEFINITIONS: [
    { field: 'potName', headerName: 'Pot', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: false},
    { field: 'place', headerName: 'Place', width: 75, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: false},
    { field: 'payout', headerName: 'Payout', width: 125, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
  ],
  CONFIG_POTS_BOARD_LIST: [
    {"Catch & Release": [
      {title: "Blue Marlin ($500)", amount: 500, tournamentCut: 0.2},
      {title: "Blue Marlin ($1500)", amount: 1500, tournamentCut: 0.2},
      {title: "Blue Marlin ($2000)", amount: 2000, tournamentCut: 0.2},
      {title: "White Marlin ($500)", amount: 500, tournamentCut: 0.2},
      {title: "White Marlin ($1500)", amount: 1500, tournamentCut: 0.2},
      {title: "White Marlin ($2000)", amount: 2000, tournamentCut: 0.2},
      {title: "Sailfish ($500)", amount: 500, tournamentCut: 0.2},
      {title: "Sailfish ($1500)", amount: 1500, tournamentCut: 0.2},
      {title: "Sailfish ($2000)", amount: 2000, tournamentCut: 0.2},
    ]},
    {"Offshore": [
      {title: "Blackfin Tuna ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Blacktip (Spinner) Shark ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Bonito (Little Tunny) ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Dolphin (Dorado Mahi) ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Jack Crevalle (Jackfish) ($200)", amount: 200, tournamentCut: 0.2},
      {title: "King Mackerel (Kingfish) ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Ling (Cobia) ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Red Snapper ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Spanish Mackerel ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Wahoo ($200)", amount: 200, tournamentCut: 0.2},
      {title: "Yellowfin Tuna ($200)", amount: 200, tournamentCut: 0.2},
    ]},
    {"Bay/Surf": [
      {title: "Black Drum ($100)", amount: 100, tournamentCut: 0.2},
      {title: "Flounder ($100)", amount: 100, tournamentCut: 0.2},
      {title: "Gafftop ($100)", amount: 100, tournamentCut: 0.2},
      {title: "Redfish ($100)", amount: 100, tournamentCut: 0.2},
      {title: "Speckled Trout ($100)", amount: 100, tournamentCut: 0.2},
    ]},
  ],
  CONFIG_POTS_CATEGORIES: [

    // Catch & Release
    {
      title: "Blue Marlin ($500)",
      subtitle: "",
      potName: "Blue Marlin ($500)",
      entryAmount: 500,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Blue Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Blue Marlin ($1500)",
      subtitle: "",
      potName: "Blue Marlin ($1500)",
      entryAmount: 1500,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Blue Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Blue Marlin ($2000)",
      subtitle: "",
      potName: "Blue Marlin ($2000)",
      entryAmount: 2000,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Blue Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "White Marlin ($500)",
      subtitle: "",
      potName: "White Marlin ($500)",
      entryAmount: 500,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "White Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "White Marlin ($1500)",
      subtitle: "",
      potName: "White Marlin ($1500)",
      entryAmount: 1500,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "White Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "White Marlin ($2000)",
      subtitle: "",
      potName: "White Marlin ($2000)",
      entryAmount: 2000,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "White Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Sailfish ($500)",
      subtitle: "",
      potName: "Sailfish ($500)",
      entryAmount: 500,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Sailfish"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Sailfish ($1500)",
      subtitle: "",
      potName: "Sailfish ($1500)",
      entryAmount: 1500,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Sailfish"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Sailfish ($2000)",
      subtitle: "",
      potName: "Sailfish ($2000)",
      entryAmount: 2000,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_catch_and_release_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Sailfish"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'team', headerName: 'Team', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Time of Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'team', headerName: 'Team', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'lastCatch', headerName: 'Time of Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },

    // Offshore
    {
      title: "Blackfin Tuna ($200)",
      subtitle: "",
      potName: "Blackfin Tuna ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Blackfin Tuna"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Blacktip (Spinner) Shark ($200)",
      subtitle: "",
      potName: "Blacktip (Spinner) Shark ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Blacktip (Spinner) Shark"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Bonito (Little Tunny) ($200)",
      subtitle: "",
      potName: "Bonito (Little Tunny) ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Bonito (Little Tunny)"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Dolphin (Dorado Mahi) ($200)",
      subtitle: "",
      potName: "Dolphin (Dorado Mahi) ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Dolphin (Dorado Mahi)"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Jack Crevalle (Jackfish) ($200)",
      subtitle: "",
      potName: "Jack Crevalle (Jackfish) ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Jack Crevalle (Jackfish)"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "King Mackerel (Kingfish) ($200)",
      subtitle: "",
      potName: "King Mackerel (Kingfish) ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "King Mackerel (Kingfish)"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Ling (Cobia) ($200)",
      subtitle: "",
      potName: "Ling (Cobia) ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Ling (Cobia)"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Red Snapper ($200)",
      subtitle: "",
      potName: "Red Snapper ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Red Snapper"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Spanish Mackerel ($200)",
      subtitle: "",
      potName: "Spanish Mackerel ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Spanish Mackerel"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Wahoo ($200)",
      subtitle: "",
      potName: "Wahoo ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Wahoo"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Yellowfin Tuna ($200)",
      subtitle: "",
      potName: "Yellowfin Tuna ($200)",
      entryAmount: 200,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_offshore_pot_winner",
      inputs: [
        {division: "Offshore"},
        {ageBracket: "Adult"},
        {species: "Yellowfin Tuna"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },

    // Bay/Surf
    {
      title: "Black Drum ($100)",
      subtitle: "",
      potName: "Black Drum ($100)",
      entryAmount: 100,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_bay_surf_pot_winner",
      inputs: [
        {ageBracket: "Adult"},
        {species: "Black Drum"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Flounder ($100)",
      subtitle: "",
      potName: "Flounder ($100)",
      entryAmount: 100,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_bay_surf_pot_winner",
      inputs: [
        {ageBracket: "Adult"},
        {species: "Flounder"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Gafftop ($100)",
      subtitle: "",
      potName: "Gafftop ($100)",
      entryAmount: 100,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_bay_surf_pot_winner",
      inputs: [
        {ageBracket: "Adult"},
        {species: "Gafftop"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Redfish ($100)",
      subtitle: "",
      potName: "Redfish ($100)",
      entryAmount: 100,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_bay_surf_pot_winner",
      inputs: [
        {ageBracket: "Adult"},
        {species: "Redfish"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    },
    {
      title: "Speckled Trout ($100)",
      subtitle: "",
      potName: "Speckled Trout ($100)",
      entryAmount: 100,
      tournamentCut: 0.2,
      display: false,
      payoutStructure: {
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      url: "get_deepsea_roundup_bay_surf_pot_winner",
      inputs: [
        {ageBracket: "Adult"},
        {species: "Speckled Trout"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Angler', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'payout', headerName: 'Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'angler', headerName: 'Angler', width: 200, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'weight', headerName: 'Weight (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'length', headerName: 'Length (in)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'},
        { field: 'payout', headerName: 'Payout', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false, isCurrency: true},
      ]
    }
  ],
}

