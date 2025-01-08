/////////////////////////////////////////////////////////////////////////////
// LEADERBOARD SETTINGS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
module.exports = {
  CONFIG_LEADERBOARD_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER: true,
  // CONFIG_LEADERBOARD_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS: "1753074000000",    // Monday, 21-July-2025 00:00 AM
  CONFIG_LEADERBOARD_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS: "1721538000000",    // TEST: Sunday, 21-July-2024 00:00 AM
  CONFIG_LEADERBOARD_CATEGORIES: [

    // Champions
    {
      title: "Offshore Division Grand Champion (Adult)",
      subtitle: "",
      numPlaces: 2,
      numTrophies: 2,
      display: true,
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
          },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },    
    {
      title: "Offshore Division Grand Champion (Junior)",
      subtitle: "",
      numPlaces: 2,
      numTrophies: 2,
      display: true,
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
          },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },    
    {
      title: "Bay/Surf Division Grand Champion (Adult)",
      subtitle: "",
      numPlaces: 2,
      numTrophies: 2,
      display: true,
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
            "Speckled Trout" : 8.3,
            "Spanish Mackerel" : 7.0,
          },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'firstPlaceCount', headerName: 'First Place Finishes', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesCount', headerName: 'Species Caught', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'firstPlaceCount', headerName: 'First Place Finishes', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesCount', headerName: 'Species Caught', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },    
    {
      title: "Bay/Surf Division Grand Champion (Junior)",
      subtitle: "",
      numPlaces: 2,
      numTrophies: 2,
      display: true,
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
          "Speckled Trout" : 8.3,
          "Spanish Mackerel" : 7.0,
        },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'firstPlaceCount', headerName: 'First Place Finishes', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesCount', headerName: 'Species Caught', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'firstPlaceCount', headerName: 'First Place Finishes', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'speciesCount', headerName: 'Species Caught', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },    
    {
      title: "Top Woman Angler",
      subtitle: "",
      numPlaces: 2,
      numTrophies: 2,
      display: true,
      url: "get_deepsea_roundup_top_woman_angler",
      inputs: [
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
          "Black Drum",
          "Bonito (Little Tunny)",
          "Flounder",
          "Gafftop",
          "Pompano",
          "Redfish",
          "Speckled Trout",
          "Spanish Mackerel",
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
          "Black Drum" : 11.6,
          "Bonito (Little Tunny)" : 16.0,
          "Flounder" : 5.4,
          "Gafftop" : 5.9,
          "Pompano" : 4.1,
          "Redfish" : 14.4,
          "Speckled Trout" : 8.3,
          "Spanish Mackerel" : 7.0,
        },
        },
      ],
      desktopColumns: [
        { field: 'place', headerName: 'Place', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'gender', headerName: 'Gender', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'points', headerName: 'Points', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'angler', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'gender', headerName: 'Gender', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'division', headerName: 'Division', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'ageBracket', headerName: 'Age', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'points', headerName: 'Points', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
        { field: 'tiebreaker', headerName: 'Tiebreaker', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
      ],
    },    
    {
      title: "Billfish Release Division",
      subtitle: "",
      numPlaces: 2,
      numTrophies: 2,
      display: true,
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

    // Offshore division
    { 
      title: "Offshore - Blue Marlin", 
      subtitle: "",
      numPlaces: 2, 
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
      numPlaces: 2, 
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
      numPlaces: 2, 
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
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blackfin Tuna (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Bonito (Little Tunny) (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Dolphin (Dorado Mahi) (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Jack Crevalle (Jackfish) (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - King Mackerel (Kingfish) (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Ling (Cobia) (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blacktip/Spinner Shark (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Wahoo (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Spanish Mackerel (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Yellowfin Tuna (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Red Snapper (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Barracuda (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blackfin Tuna (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Bonito (Little Tunny) (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Dolphin (Dorado Mahi) (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Jack Crevalle (Jackfish) (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - King Mackerel (Kingfish) (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Ling (Cobia) (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Blacktip/Spinner Shark (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Wahoo (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Spanish Mackerel (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Yellowfin Tuna (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Offshore - Red Snapper (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Bay/Surf
    { 
      title: "Bay/Surf - Black Drum (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Bonito (Little Tunny) (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Flounder (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Gafftop (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Pompano (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Redfish (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Speckled Trout (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Spanish Mackerel (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Black Drum (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Bonito (Little Tunny) (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Flounder (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Gafftop (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Pompano (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Redfish (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Speckled Trout (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Bay/Surf - Spanish Mackerel (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Flyfishing
    { 
      title: "Flyfishing - Redfish (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Flyfishing - Speckled Trout (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Flyfishing - Redfish (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Flyfishing - Speckled Trout (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },

    // Kayak
    { 
      title: "Kayak - Redfish (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Kayak - Speckled Trout (Adult)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Kayak - Redfish (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
    { 
      title: "Kayak - Speckled Trout (Junior)", 
      subtitle: "",
      numPlaces: 2, 
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
        { field: 'weight', headerName: 'Weight', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ],
      mobileColumns: [
        { field: 'place', headerName: 'Place', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'species', headerName: 'Species', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'name', headerName: 'Name', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'hometown', headerName: 'Hometown', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'weight', headerName: 'Weight', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'length', headerName: 'Length', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
        { field: 'girth', headerName: 'Girth', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false},
      ]
    },
  ]
};

