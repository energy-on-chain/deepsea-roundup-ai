/////////////////////////////////////////////////////////////////////////////
// LEADERBOARD SETTINGS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export default {
  // Set to true after the tournament concludes to make champion results public on the leaderboard page.
  CONFIG_LEADERBOARD_SHOW_CHAMPIONS_PUBLICLY: false,
  CONFIG_LEADERBOARD_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER: true,
  CONFIG_LEADERBOARD_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS: "1784610000000",    // Monday, 20-July-2026 00:00 AM CST
  CONFIG_LEADERBOARD_CATEGORIES: [

    // Champions
    {
      title: "Offshore Division Grand Champion (Adult)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_offshore_grand_champion",
      inputs: [
        {ageBracket: "Adult"},
        {billfishSpeciesList: ["Blue Marlin", "White Marlin", "Sailfish", "Tarpon"]},
        {meatfishSpeciesList: [
            "Barracuda",
            "Blackfin Tuna",
            "Bonito (Little Tunny)",
            "Dolphin (Dorado Mahi)",
            "Jack Crevalle (Jackfish)",
            "King Mackerel (Kingfish)",
            "Ling (Cobia)",
            "Blacktip/Spinner Shark",
            "Wahoo",
            "Spanish Mackerel",
            "Yellowfin Tuna",
            "Red Snapper",
            "Swordfish",
          ]
        },
        {historicalRecordCatchData:
          {
            "Blue Marlin": 592,
            "Sailfish": 95,
            "Tarpon": 88,
            "White Marlin": 85.3,
            "Barracuda": 41.3,
            "Blackfin Tuna": 39.5,
            "Bonito (Little Tunny)": 16,
            "Dolphin (Dorado Mahi)": 65.6,
            "Jack Crevalle (Jackfish)": 36,
            "King Mackerel (Kingfish)": 56.8,
            "Ling (Cobia)": 80.1,
            "Blacktip/Spinner Shark": 667.4,
            "Wahoo": 92,
            "Spanish Mackerel": 7,
            "Yellowfin Tuna": 137.6,
            "Red Snapper": 25.9,
            "Swordfish": 250,
          },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesContributionSummary', headerName: 'Species Contributions', flex: 4, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left', isDateTime: false },
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesContributionSummary', headerName: 'Species Contributions', width: 340, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left', isDateTime: false },
        { field: 'points', headerName: 'Points', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },
    {
      title: "Offshore Division Grand Champion (Junior)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_offshore_grand_champion",
      inputs: [
        {ageBracket: "Junior"},
        {billfishSpeciesList: ["Blue Marlin", "White Marlin", "Sailfish", "Tarpon"]},
        {meatfishSpeciesList: [
            "Barracuda",
            "Blackfin Tuna",
            "Bonito (Little Tunny)",
            "Dolphin (Dorado Mahi)",
            "Jack Crevalle (Jackfish)",
            "King Mackerel (Kingfish)",
            "Ling (Cobia)",
            "Blacktip/Spinner Shark",
            "Wahoo",
            "Spanish Mackerel",
            "Yellowfin Tuna",
            "Red Snapper",
            "Swordfish",
          ]
        },
        {historicalRecordCatchData:
          {
            "Blue Marlin": 592,
            "Sailfish": 95,
            "Tarpon": 88,
            "White Marlin": 85.3,
            "Barracuda": 41.3,
            "Blackfin Tuna": 39.5,
            "Bonito (Little Tunny)": 16,
            "Dolphin (Dorado Mahi)": 65.6,
            "Jack Crevalle (Jackfish)": 36,
            "King Mackerel (Kingfish)": 56.8,
            "Ling (Cobia)": 80.1,
            "Blacktip/Spinner Shark": 667.4,
            "Wahoo": 92,
            "Spanish Mackerel": 7,
            "Yellowfin Tuna": 137.6,
            "Red Snapper": 25.9,
            "Swordfish": 250,
          },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesContributionSummary', headerName: 'Species Contributions', flex: 4, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left', isDateTime: false },
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesContributionSummary', headerName: 'Species Contributions', width: 340, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left', isDateTime: false },
        { field: 'points', headerName: 'Points', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },
    {
      title: "Bay/Surf Division Grand Champion (Adult)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_bay_surf_grand_champion",
      inputs: [
        {ageBracket: "Adult"},
        {meatfishSpeciesList: [
            "Black Drum",
            "Bonito (Little Tunny)",
            "Flounder",
            "Gafftop",
            "Pompano",
            "Redfish",
            "Sheepshead",
            "Speckled Trout",
            "Spanish Mackerel",
          ]
        },
        {historicalRecordCatchData:
          {
            "Black Drum" : 11.6,
            "Bonito (Little Tunny)" : 16.0,
            "Flounder" : 5.4,
            "Gafftop" : 5.9,
            "Pompano" : 4.1,
            "Redfish" : 14.4,
            "Sheepshead" : 9.5,
            "Speckled Trout" : 8.3,
            "Spanish Mackerel" : 7.0,
          },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hasFirstPlaceFish', headerName: 'First Place Fish', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Black Drum', headerName: 'Black Drum (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Bonito (Little Tunny)', headerName: 'Bonito (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Flounder', headerName: 'Flounder (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Gafftop', headerName: 'Gafftop (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Pompano', headerName: 'Pompano (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Redfish', headerName: 'Redfish (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Sheepshead', headerName: 'Sheepshead (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Speckled Trout', headerName: 'Speckled Trout (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Spanish Mackerel', headerName: 'Spanish Mackerel (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalWeight', headerName: 'Total Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hasFirstPlaceFish', headerName: '1st Fish', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Black Drum', headerName: 'Blk Drum', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Bonito (Little Tunny)', headerName: 'Bonito', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Flounder', headerName: 'Flounder', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Gafftop', headerName: 'Gafftop', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Pompano', headerName: 'Pompano', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Redfish', headerName: 'Redfish', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Sheepshead', headerName: 'Sheepshead', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Speckled Trout', headerName: 'Sp. Trout', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Spanish Mackerel', headerName: 'Sp. Mack.', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalWeight', headerName: 'Total (lbs)', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },
    {
      title: "Bay/Surf Division Grand Champion (Junior)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_bay_surf_grand_champion",
      inputs: [
        {ageBracket: "Junior"},
        {meatfishSpeciesList: [
          "Black Drum",
          "Bonito (Little Tunny)",
          "Flounder",
          "Gafftop",
          "Pompano",
          "Redfish",
          "Sheepshead",
          "Speckled Trout",
          "Spanish Mackerel",
        ]
      },
      {historicalRecordCatchData:
        {
          "Black Drum" : 11.6,
          "Bonito (Little Tunny)" : 16.0,
          "Flounder" : 5.4,
          "Gafftop" : 5.9,
          "Pompano" : 4.1,
          "Redfish" : 14.4,
          "Sheepshead" : 9.5,
          "Speckled Trout" : 8.3,
          "Spanish Mackerel" : 7.0,
        },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hasFirstPlaceFish', headerName: 'First Place Fish', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Black Drum', headerName: 'Black Drum (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Bonito (Little Tunny)', headerName: 'Bonito (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Flounder', headerName: 'Flounder (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Gafftop', headerName: 'Gafftop (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Pompano', headerName: 'Pompano (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Redfish', headerName: 'Redfish (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Sheepshead', headerName: 'Sheepshead (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Speckled Trout', headerName: 'Speckled Trout (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Spanish Mackerel', headerName: 'Spanish Mackerel (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalWeight', headerName: 'Total Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hasFirstPlaceFish', headerName: '1st Fish', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Black Drum', headerName: 'Blk Drum', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Bonito (Little Tunny)', headerName: 'Bonito', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Flounder', headerName: 'Flounder', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Gafftop', headerName: 'Gafftop', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Pompano', headerName: 'Pompano', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Redfish', headerName: 'Redfish', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Sheepshead', headerName: 'Sheepshead', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Speckled Trout', headerName: 'Sp. Trout', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'Spanish Mackerel', headerName: 'Sp. Mack.', width: 90, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalWeight', headerName: 'Total (lbs)', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },
    {
      title: "Top Woman Angler",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_top_woman_angler",
      inputs: [
        // Per rules: TWA is scored on Offshore/Bay-Surf weigh-ins only -- billfish (release,
        // no weigh-in) does not count, so this stays an empty array rather than a species list.
        {billfishSpeciesList: []},
        {meatfishSpeciesList: [
          "Barracuda",
          "Blackfin Tuna",
          "Bonito (Little Tunny)",
          "Dolphin (Dorado Mahi)",
          "Jack Crevalle (Jackfish)",
          "King Mackerel (Kingfish)",
          "Ling (Cobia)",
          "Blacktip/Spinner Shark",
          "Wahoo",
          "Spanish Mackerel",
          "Yellowfin Tuna",
          "Red Snapper",
          "Swordfish",
          "Black Drum",
          "Flounder",
          "Gafftop",
          "Pompano",
          "Redfish",
          "Speckled Trout",
          "Sheepshead",
        ]
      },
      {historicalRecordCatchData:
        {
          "Blue Marlin": 592,
          "Sailfish": 95,
          "Tarpon": 88,
          "White Marlin": 85.3,
          "Barracuda": 41.3,
          "Blackfin Tuna": 39.5,
          "Bonito (Little Tunny)": 16,
          "Dolphin (Dorado Mahi)": 65.6,
          "Jack Crevalle (Jackfish)": 36,
          "King Mackerel (Kingfish)": 56.8,
          "Ling (Cobia)": 80.1,
          "Blacktip/Spinner Shark": 667.4,
          "Wahoo": 92,
          "Spanish Mackerel": 7,
          "Yellowfin Tuna": 137.6,
          "Red Snapper": 25.9,
          "Swordfish": 250,
          "Black Drum": 11.6,
          "Flounder": 5.4,
          "Gafftop": 5.9,
          "Pompano": 4.1,
          "Redfish": 14.4,
          "Speckled Trout": 8.3,
          "Sheepshead": 9.5,
        },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'trophySummary', headerName: 'Trophies Won', flex: 4, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left', isDateTime: false },
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'avgWeightPct', headerName: 'Avg Weight %', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'trophySummary', headerName: 'Trophies Won', width: 350, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left', isDateTime: false },
        { field: 'points', headerName: 'Points', width: 80, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'avgWeightPct', headerName: 'Avg Weight %', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },
    {
      title: "Billfish Release Division",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_billfish_release_champion",
      inputs: [
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalPoints', headerName: 'Total Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'latestRelease', headerName: 'Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalPoints', headerName: 'Total Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'latestRelease', headerName: 'Last Catch', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true },
      ],
    },
    {
      title: "Tarpon Release Division",
      subtitle: "Boat competition -- entirely separate from Billfish Release Division scoring",
      numPlaces: 5,
      numTrophies: 2,
      display: false,
      url: "get_deepsea_roundup_tarpon_release_champion",
      inputs: [
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalPoints', headerName: 'Total Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'latestRelease', headerName: 'Last Catch', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'boatName', headerName: 'Boat Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'totalPoints', headerName: 'Total Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'latestRelease', headerName: 'Last Catch', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true },
      ],
    },

    // Offshore division
    { 
      title: "Offshore - Blue Marlin", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true,
      url: "get_deepsea_roundup_billfish_species_winner",     
      inputs: [
        {species: "Blue Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'boat', headerName: 'Boat', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Last Catch', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'boat', headerName: 'Boat', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
      ]
    },
    { 
      title: "Offshore - White Marlin", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2, 
      display: true,
      url: "get_deepsea_roundup_billfish_species_winner",     
      inputs: [
        {species: "White Marlin"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'boat', headerName: 'Boat', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Last Catch', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'boat', headerName: 'Boat', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
      ]
    },
    { 
      title: "Offshore - Sailfish", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2, 
      display: true,
      url: "get_deepsea_roundup_billfish_species_winner",     
      inputs: [
        {species: "Sailfish"}
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'boat', headerName: 'Boat', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Last Catch', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'boat', headerName: 'Boat', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'lastCatch', headerName: 'Last Catch', width: 300, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: true},
      ]
    },

    { 
      title: "Offshore - Barracuda (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2, 
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Barracuda", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blackfin Tuna (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2, 
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Blackfin Tuna", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Bonito (Little Tunny) (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2, 
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Bonito (Little Tunny)", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Dolphin (Dorado Mahi) (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Dolphin (Dorado Mahi)", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Jack Crevalle (Jackfish) (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Jack Crevalle (Jackfish)", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - King Mackerel (Kingfish) (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "King Mackerel (Kingfish)", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Ling (Cobia) (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Ling (Cobia)", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blacktip/Spinner Shark (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Blacktip/Spinner Shark", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Wahoo (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Wahoo", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Spanish Mackerel (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Spanish Mackerel", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Yellowfin Tuna (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Yellowfin Tuna", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Red Snapper (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Red Snapper", 
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Barracuda (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Barracuda", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blackfin Tuna (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Blackfin Tuna", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Bonito (Little Tunny) (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Bonito (Little Tunny)", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Dolphin (Dorado Mahi) (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Dolphin (Dorado Mahi)", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Jack Crevalle (Jackfish) (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Jack Crevalle (Jackfish)", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - King Mackerel (Kingfish) (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "King Mackerel (Kingfish)", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Ling (Cobia) (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Ling (Cobia)", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blacktip/Spinner Shark (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Blacktip/Spinner Shark", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Wahoo (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Wahoo", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Spanish Mackerel (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Spanish Mackerel", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Yellowfin Tuna (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Yellowfin Tuna", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Red Snapper (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Red Snapper", 
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Offshore - Swordfish
    {
      title: "Offshore - Swordfish (Adult)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",
      inputs: [
        {
          species: "Swordfish",
          ageBracket: "Adult",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    {
      title: "Offshore - Swordfish (Junior)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",
      inputs: [
        {
          species: "Swordfish",
          ageBracket: "Junior",
          division: "Offshore",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Bay/Surf
    {
      title: "Bay/Surf - Black Drum (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Black Drum", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Bonito (Little Tunny) (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Bonito (Little Tunny)", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Flounder (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Flounder", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Gafftop (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Gafftop", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Pompano (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Pompano", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Redfish (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Redfish", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Speckled Trout (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Speckled Trout", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Spanish Mackerel (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Spanish Mackerel", 
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Black Drum (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Black Drum", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Bonito (Little Tunny) (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Bonito (Little Tunny)", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Flounder (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Flounder", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Gafftop (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Gafftop", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Pompano (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Pompano", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Redfish (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Redfish", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Speckled Trout (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Speckled Trout", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Spanish Mackerel (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Spanish Mackerel", 
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Bay/Surf - Sheepshead
    {
      title: "Bay/Surf - Sheepshead (Adult)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",
      inputs: [
        {
          species: "Sheepshead",
          ageBracket: "Adult",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    {
      title: "Bay/Surf - Sheepshead (Junior)",
      subtitle: "",
      numPlaces: 5,
      numTrophies: 2,
      display: true,
      url: "get_deepsea_roundup_meatfish_species_winner",
      inputs: [
        {
          species: "Sheepshead",
          ageBracket: "Junior",
          division: "Bay/Surf",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Flyfishing
    {
      title: "Flyfishing - Redfish (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Redfish", 
          ageBracket: "Adult",
          division: "Flyfishing",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Flyfishing - Speckled Trout (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Speckled Trout", 
          ageBracket: "Adult",
          division: "Flyfishing",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Flyfishing - Redfish (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Redfish", 
          ageBracket: "Junior",
          division: "Flyfishing",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Flyfishing - Speckled Trout (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Speckled Trout", 
          ageBracket: "Junior",
          division: "Flyfishing",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Kayak
    { 
      title: "Kayak - Redfish (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Redfish", 
          ageBracket: "Adult",
          division: "Kayak",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Kayak - Speckled Trout (Adult)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Speckled Trout", 
          ageBracket: "Adult",
          division: "Kayak",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Kayak - Redfish (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Redfish", 
          ageBracket: "Junior",
          division: "Kayak",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Kayak - Speckled Trout (Junior)", 
      subtitle: "",
      numPlaces: 5, 
      numTrophies: 2,
      display: true, 
      url: "get_deepsea_roundup_meatfish_species_winner",     
      inputs: [
        {
          species: "Speckled Trout", 
          ageBracket: "Junior",
          division: "Kayak",
        }
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight (lbs)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth (in)', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

  ]
};

