import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Select, MenuItem, InputLabel, Autocomplete, TextField } from "@mui/material";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Stack } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SimplifiedEntries from '../components/SimplifiedEntries';
import ToggleSliderButton from '../components/buttons/ToggleSliderButton';
import PotCarousel from '../components/PotCarousel';
import PotsResultTable from '../components/tables/PotsResultTable';
import './BasePage.css';

import { loadConfigForYear } from '../config/masterConfig';

dayjs.extend(advancedFormat);

function PotsPage() {

  // STATE - GENERAL
  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [timestamp, setTimestamp] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [tournamentHasStarted, setTournamentHasStarted] = useState(false);
  const [isPreliminaryResults, setIsPreliminaryResults] = useState(true);
  const [allDataIsFetched, setAllDataIsFetched] = useState(false);

  // STATE - ENTRIES
  const [potEntryData, setPotEntryData] = useState();    // data
  const [potEntryDataHasLoaded, setPotEntryDataHasLoaded] = useState(false);
  const displayOptions = ["Entries", "Payouts"];    // display options
  const [displaySelection, setDisplaySelection] = useState("Payouts");
  const entriesViewOptions = ["Board", "By Pot", "By Entrant"]    // for entries
  const [selectedBoard, setSelectedBoard] = useState("Catch & Release"); // Default board
  const [entriesViewSelection, setEntriesViewSelection] = useState("Board");
  const [entriesBoardOptions, setEntriesBoardOptions] = useState();
  const [entriesBoardSelection, setBoardSelection] = useState();

  const [registeredTeamList, setRegisteredTeamList] = useState([]);
  const [registeredTeamNameList, setRegisteredTeamNameList] = useState([]);
  const [teamNameListIsLoaded, setTeamNameListIsLoaded] = useState(false);

  const [registeredAnglerList, setRegisteredAnglerList] = useState([]);
  const [registeredAnglerNameList, setRegisteredAnglerNameList] = useState([]);
  const [anglerNameListIsLoaded, setAnglerNameListIsLoaded] = useState(false);

  const [entriesTeamSelection, setEntriesTeamSelection] = useState();
  const [entriesAnglerSelection, setEntriesAnglerSelection] = useState();
  const [entriesPotOptions, setEntriesPotOptions] = useState();
  const [entriesPotSelection, setEntriesPotSelection] = useState();

  // STATE - PAYOUTS
  const payoutsViewOptions = ["By Pot", "By Entrant"];    // for payouts
  const [payoutsViewSelection, setPayoutsViewSelection] = useState("By Pot");
  const payoutsDisplayOptions = ["List", "Select", "Slideshow"];
  const [payoutsDisplaySelection, setPayoutsDisplaySelection] = useState("List");
  const [payoutsSelectedResult, setPayoutsSelectedResult] = useState([]);
  const [payoutsHasSelectedResult, setPayoutsHasSelectedResult] = useState(false);
  const [payoutsResultArray, setPayoutsResultArray] = useState([]);
  const [payoutsTeamResultSummary, setPayoutsTeamResultSummary] = useState([]);
  const [payoutsTeamSelection, setPayoutsTeamSelection] = useState();
  const [payoutsAnglerSelection, setPayoutsAnglerSelection] = useState();
  const [payoutsTeamResultObject, setPayoutsTeamResultObject] = useState([]);
  const [totalGrossPot, setTotalGrossPot] = useState(0);

  // STATE - ADDITIONAL
  const [entriesParticipantType, setEntriesParticipantType] = useState('team');
  const [payoutsParticipantType, setPayoutsParticipantType] = useState('team');
  const [payoutsAnglerResultSummary, setPayoutsAnglerResultSummary] = useState([]);
  const [payoutsAnglerResultObject, setPayoutsAnglerResultObject] = useState({});

  useEffect(() => {
    fetchConfigAndData();
  }, [year]);

  useEffect(() => {
    if (potEntryData) {
      const totalPot = potEntryData.reduce((acc, entry) => {
        return acc + (entry.totalPotFee || 0); // Sum totalPotFee from each entry
      }, 0);
      setTotalGrossPot(totalPot);
    }
  }, [potEntryData]); // Runs this effect whenever potEntryData is updated

  const fetchConfigAndData = async () => {
    try {
      const loadedConfig = await loadConfigForYear(year); // Load config dynamically
      setConfig(loadedConfig); // Store the loaded config
      
      const {
        generalConfig: {
          CONFIG_GENERAL_YEAR,
          CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
          CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME,
          CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
        },
        stylingConfig: {
          CONFIG_STYLING_BANNER_BACKGROUND_COLOR,
          CONFIG_STYLING_BANNER_TEXT_COLOR,
          CONFIG_STYLING_POTS_TIMESTAMP_TEXT_COLOR,
          CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
          CONFIG_STYLING_SECTION_BACKGROUND_COLOR,
          CONFIG_STYLING_SECTION_TEXT_COLOR,
          CONFIG_STYLING_H2_COLOR,
        },
        homeConfig: {
          CONFIG_HOME_SPECIES_TYPE_LIST_FOR_CATCH_COUNT,
        },
        potsConfig: {
          CONFIG_POTS_TEAM_SUMMARY_DESKTOP_COLUMN_DEFINITIONS,
          CONFIG_POTS_TEAM_SUMMARY_MOBILE_COLUMN_DEFINITIONS,
          CONFIG_POTS_INDIVIDUAL_TEAM_SUMMARY_DESKTOP_COLUMN_DEFINITIONS,
          CONFIG_POTS_INDIVIDUAL_TEAM_SUMMARY_MOBILE_COLUMN_DEFINITIONS,
          CONFIG_POTS_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER,
          CONFIG_POTS_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS,
          CONFIG_POTS_CATEGORIES,
          CONFIG_POTS_BOARD_LIST,
        },
      } = loadedConfig;

      // Set toggle menu options
      setEntriesBoardOptions(CONFIG_POTS_BOARD_LIST.map(boardObj => Object.keys(boardObj)[0]));
      setEntriesPotOptions(CONFIG_POTS_BOARD_LIST.flatMap(boardObj => {
        const boardName = Object.keys(boardObj)[0];  // Extract the board name
        return boardObj[boardName].map(pot => pot.title);  // Extract the pot titles for each board
      }))

      // Assess and set preliminary result status
      if (CONFIG_POTS_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER) {
        let now = dayjs().valueOf();
        setIsPreliminaryResults(parseInt(CONFIG_POTS_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS) > now);
        setTimestamp(generateTimestamp());
      } else {
        setIsPreliminaryResults(false);
      };

      const apiUrl = process.env.REACT_APP_NODE_ENV === "production"
      ? process.env.REACT_APP_SERVER_URL_PRODUCTION
      : process.env.REACT_APP_SERVER_URL_STAGING;

      // Build queries for payouts
      const queries = CONFIG_POTS_CATEGORIES.map((item) => {

        // Basic data
        let bodyData = { 
          catchYear: CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
          potYear: CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME,
          isReport: false, 
          title: item.title,
          subtitle: item.subtitle || "",
          potName: item.potName,
          entryAmount: item.entryAmount,
          tournamentCut: item.tournamentCut,
          payoutStructure: item.payoutStructure,
          numPlaces: Object.keys(item.payoutStructure).length,
          // Convert inputs array to a single object
          ...item.inputs.reduce((acc, input) => ({ ...acc, ...input }), {})
        };
      
        // Add any extra inputs required (e.g. specific date)
        if (item.inputs && item.inputs.length > 0) {
          item.inputs.forEach(input => {
            Object.keys(input).forEach(param => {
              bodyData[param] = input[param];
            });
          })
        }
      
        // Return above info, including rest of query items
        return {
          url: item.url,
          body: JSON.stringify(bodyData),
          display: item.display,
          title: item.title,
          subtitle: item.subtitle || "",
          numPlaces: Object.keys(item.payoutStructure).length,
          desktopColumns: item.desktopColumns,
          mobileColumns: item.mobileColumns,
        };
      });    

      // Execute data retrieval
      confirmTournamentStarted(apiUrl, loadedConfig);
      fetchData(apiUrl, queries, setPayoutsResultArray);
      setHasLoaded(true);

  } catch (error) {
    console.error('Error loading config or fetching data:', error);
  }
  };

  const fetchData = async (apiUrl, queries, setResults) => {

    try {

      // ENTRIES - Get registered participant list
      fetch(`${apiUrl}/api/${year}/admin_get_database_list`, {    
        method: 'POST',    
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({tableName: `anglers${year}`})
      })
      .then(res => res.json())
      .then(data => {
        const {
          teamList,
          teamNameList,
          anglerList,
          anglerNameList
        } = transformParticipantData(data);
  
        setRegisteredTeamList(teamList);
        setRegisteredTeamNameList(teamNameList);
        setTeamNameListIsLoaded(true);
        
        setRegisteredAnglerList(anglerList);
        setRegisteredAnglerNameList(anglerNameList);
        setAnglerNameListIsLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching participant data:', error);
        toast.error('Error loading participant data. Please try again.');
      });

      // ENTRIES - Get all pot data
      fetch(`${apiUrl}/api/${year}/get_all_pot_data`, {    
        method: 'POST',    
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({potYear: `pots${year}`})
      })
      .then(res => res.json())
      .then(data => {
        // Parse the boardSelections string for each entry
        const parsedData = data.data.map(entry => ({
          ...entry,
          // Parse the stringified boardSelections back into an array
          boardSelections: typeof entry.boardSelections === 'string' 
            ? JSON.parse(entry.boardSelections)
            : entry.boardSelections
        }));
        
        setPotEntryData(parsedData);
        setPotEntryDataHasLoaded(true);
        console.log('Parsed pot entry data:', parsedData);
      })
      .catch(error => {
        console.error('Error fetching pot entry data:', error);
        toast.error('Error loading pot entries. Please try again.');
      });

      // PAYOUTS - Fetch pot results for all categories
      const res = await Promise.all(queries.map((query) => {
        return fetch(`${apiUrl}/api/${year}/${query.url}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: query.body
        }).then(r => r.json()).then((result) => {
          var tempObject = {};
          var tempRows = [];
          Object.keys(result).map((catchKey, i) => {
            let tempObject = {...result[catchKey], id: i, catchId: catchKey};
            tempRows.push(tempObject);
          });
          tempObject = {
            title: query.title, 
            subtitle: query.subtitle,
            numPlaces: query.numPlaces,
            rows: tempRows, 
            desktopColumns: query.desktopColumns, 
            mobileColumns: query.mobileColumns
          };
          console.log(tempObject);
          return tempObject;
        });
      }));
      setResults(res);

      // PAYOUTS - Set pot results for all teams
      // Team summary
      const payoutsTeamMap = {};    
      res.forEach(potResult => {
        potResult.rows.forEach(row => {
          const team = row.team;
          if (!payoutsTeamMap[team]) {
            payoutsTeamMap[team] = { team: team, payout: 0 };
          }
          payoutsTeamMap[team].payout += row.payout; // Accumulate payout for each team
        });
      });
      const teamSummaryArray = Object.values(payoutsTeamMap).sort((a, b) => b.payout - a.payout);
      setPayoutsTeamResultSummary(teamSummaryArray);

      // Individual team summary
      const payoutsTeamResultObject = {};
      res.forEach(potResult => {
        potResult.rows.forEach(row => {
          const team = row.team;
          if (!payoutsTeamResultObject[team]) {
            payoutsTeamResultObject[team] = [];
          }
          if (row.payout > 0) {
            payoutsTeamResultObject[team].push({
              potName: potResult.title,
              place: row.place,
              payout: row.payout,
            });
          }
        });
      });
      Object.keys(payoutsTeamResultObject).forEach(team => {
        payoutsTeamResultObject[team].sort((a, b) => b.payout - a.payout);
      });
      setPayoutsTeamResultObject(payoutsTeamResultObject);

      // PAYOUTS - Set pot results for all anglers
      // FIXME: in the same way that we did for teams, set these results for anglers (add new variables as needed)

      // Confirm all data has been fetched from server
      setAllDataIsFetched(true);

    } catch (error) {
      console.log('There was an error loading initial data from the server in the admin add pots component: ' + error);
    }
  };

  const confirmTournamentStarted = async (apiUrl ,loadedConfig) => {
    const { CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME } = loadedConfig.generalConfig;
    const { CONFIG_HOME_SPECIES_TYPE_LIST_FOR_CATCH_COUNT } = loadedConfig.homeConfig;
    try {
      fetch(`${apiUrl}/api/${year}/get_catch_count_for_homepage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          catchesTableName: CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
          speciesTypeList: CONFIG_HOME_SPECIES_TYPE_LIST_FOR_CATCH_COUNT,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.count === 0) {
          setTournamentHasStarted(false);
        } else {
          setTournamentHasStarted(true);
        }
      })
      .catch(e => console.error(e));
    } catch (error) {
      console.error('Error confirming whether tournament has started: ', error);
    }
  };

  const generateTimestamp = () => {
    const now = dayjs();
    const timeString = now.format('hh:mm A');
    const dateString = now.format('DD MMMM YYYY');
    return `Preliminary pot standings as of: ${timeString} on ${dateString}.`;
  };

  const transformParticipantData = (data) => {
    const teamList = [];
    const teamNameList = [];
    const anglerList = [];
    const anglerNameList = [];
    
    // Process each angler entry
    Object.entries(data).forEach(([id, angler]) => {
      // Add to angler lists
      const anglerObj = {
        id: id,
        ...angler
      };
      anglerList.push(anglerObj);
      
      anglerNameList.push({
        id: id,
        label: angler.anglerName,
        anglerData: anglerObj
      });
      
      // If they're on a boat, add to team lists
      if (angler.boatName && angler.boatName.trim() !== '') {
        const teamObj = {
          id: angler.boatName,
          teamName: angler.boatName,
          members: [anglerObj]
        };
        
        // Check if team already exists
        const existingTeamIndex = teamList.findIndex(t => t.id === angler.boatName);
        if (existingTeamIndex === -1) {
          teamList.push(teamObj);
          teamNameList.push({
            teamKey: angler.boatName,
            teamData: teamObj,
            label: angler.boatName
          });
        } else {
          teamList[existingTeamIndex].members.push(anglerObj);
        }
      }
    });
    
    return {
      teamList,
      teamNameList,
      anglerList,
      anglerNameList
    };
  };
  
  const handleEntriesPotSelection = (event, value) => {
    setEntriesPotSelection(value);
  };

  const handlePayoutsTeamSelection = (event, value) => {
    if (value && value.teamData) {
      setPayoutsTeamSelection(value.teamData.teamName);
    } else {
      setPayoutsTeamSelection(null);
    }
  };

  const handlePayoutsAnglerSelection = (event, value) => {
    if (value && value.anglerData) {
      setPayoutsAnglerSelection(value.anglerData.anglerName);
    } else {
      setPayoutsAnglerSelection(null);
    }
  };

  const handlePayoutsSelectResult = (e) => {
    let result = payoutsResultArray.filter(item => item.title === e.target.value);
    setPayoutsSelectedResult(result);
    setPayoutsHasSelectedResult(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPlace = (num) => {
    const j = num % 10,
          k = num % 100;
    if (j === 1 && k !== 11) {
      return `${num}st`;
    }
    if (j === 2 && k !== 12) {
      return `${num}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${num}rd`;
    }
    return `${num}th`;
  };  

  const getTeamTotalPayout = (teamName) => {
    return payoutsTeamResultObject[teamName]?.reduce((sum, result) => sum + result.payout, 0) || 0;
  };
  
  const getAnglerTotalPayout = (anglerName) => {
    return payoutsAnglerResultObject[anglerName]?.reduce((sum, result) => sum + result.payout, 0) || 0;
  };
  
  const getTeamPayoutRows = (teamName) => {
    return (payoutsTeamResultObject[teamName] || []).map((result, index) => ({
      ...result,
      id: index,
      place: formatPlace(result.place)
    }));
  };
  
  const getAnglerPayoutRows = (anglerName) => {
    return (payoutsAnglerResultObject[anglerName] || []).map((result, index) => ({
      ...result,
      id: index,
      place: formatPlace(result.place)
    }));
  };

  const handleEntriesTeamSelection = (event, value) => {
    if (value && value.teamData) {
      setEntriesTeamSelection(value.label); // Change from teamData.teamName to label
    } else {
      setEntriesTeamSelection(null);
    }
  };
  
  const handleEntriesAnglerSelection = (event, value) => {
    if (value && value.anglerData) {
      setEntriesAnglerSelection(value.label); // Change from anglerData.anglerName to label
    } else {
      setEntriesAnglerSelection(null);
    }
  };
  
  return (
    <AnimatedPage>
      <main>
        {/* BANNER */}
        <section style={{ backgroundColor: config?.stylingConfig?.CONFIG_STYLING_BANNER_BACKGROUND_COLOR }} className="section-banner">
          <h1 style={{ color: config?.stylingConfig?.CONFIG_STYLING_BANNER_TEXT_COLOR }}>Pots</h1>
        </section>
  
        {/* SELECT VIEW ENTRIES OR PAYOUTS */}
        {allDataIsFetched && (
          <section className="section-leaderboard">
            <div>
              {matches ? (
                <div>
                  <ToggleSliderButton 
                    choice={displaySelection} 
                    choiceList={displayOptions} 
                    aligment={displaySelection} 
                    setAlignment={setDisplaySelection} 
                  />
                </div>
              ) : (
                <div>
                  <Select 
                    labelId="view-label" 
                    id="view" 
                    value={displaySelection} 
                    onChange={(e) => setDisplaySelection(e.target.value)}
                  >
                    {displayOptions.map(view => (
                      <MenuItem key={view} value={view}>View {view}</MenuItem>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </section>
        )} 
  
        {/* SET DETAILED VIEW OPTIONS */}
        {allDataIsFetched && (
          <section className="section-leaderboard">
            <div>
              {/* "BY ..." SELECTION */}
              {matches ? (
                <div>
                  {displaySelection === "Entries" && (
                    <ToggleSliderButton 
                      choice={entriesViewSelection} 
                      choiceList={entriesViewOptions} 
                      aligment={entriesViewSelection} 
                      setAlignment={setEntriesViewSelection}
                    />
                  )}
                  {displaySelection === "Payouts" && (
                    <>
                      <ToggleSliderButton 
                        choice={payoutsDisplaySelection} 
                        choiceList={payoutsDisplayOptions} 
                        aligment={payoutsDisplaySelection} 
                        setAlignment={setPayoutsDisplaySelection}
                      />
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {displaySelection === "Entries" && (
                    <Select 
                      labelId="view-label" 
                      id="view" 
                      value={entriesViewSelection} 
                      onChange={(e) => setEntriesViewSelection(e.target.value)}
                    >
                      {entriesViewOptions.map(view => (
                        <MenuItem key={view} value={view}>{view}</MenuItem>
                      ))}
                    </Select>
                  )}
                  {displaySelection === "Payouts" && (
                    <div>
                      <Select 
                        labelId="view-label" 
                        id="view" 
                        value={payoutsViewSelection} 
                        onChange={(e) => setPayoutsViewSelection(e.target.value)}
                      >
                        {payoutsViewOptions.map(view => (
                          <MenuItem key={view} value={view}>{view}</MenuItem>
                        ))}
                      </Select>
                      <Select 
                        labelId="view-payouts-label" 
                        id="payouts-view" 
                        value={payoutsDisplaySelection} 
                        onChange={(e) => setPayoutsDisplaySelection(e.target.value)}
                      >
                        {payoutsDisplayOptions.map(view => (
                          <MenuItem key={view} value={view}>{view}</MenuItem>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
  
        <section className="section-view">
          <Box sx={{ width: '90%', typography: 'body1' }}>
            {/* Preliminary results disclaimer message */}
            {(allDataIsFetched && isPreliminaryResults && displaySelection === "Payouts") && (
              <div>
                <br/>
                <h1 style={{ fontSize: '30px', marginBottom: '20px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
                  Total Pot Value: {formatCurrency(totalGrossPot)}
                </h1>
                <h3 className="timestamp-text" style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TIMESTAMP_TEXT_COLOR}}>
                  <em>{timestamp}</em>
                </h3>
              </div>
            )}
  
            {/* Holdover message if there are no catches yet */}
            {(!tournamentHasStarted && displaySelection === "Payouts") && (
              <div>
                <br/>
                <h2 style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>
                  The {year} tournament will begin soon!
                </h2>
              </div>
            )}
  
            {/* Loading screen while fetching data from server */}
            {!allDataIsFetched && (
              <>
                <br/>
                <br/>
                <h1 style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>
                  Loading, one moment please...
                </h1>
                <CircularProgress/>
              </>
            )}
  
            {/* ENTRIES SECTION */}
            {displaySelection === "Entries" && (
              <>

                {/* ENTRIES - BY BOARD */}
                {(displaySelection === "Entries") && (entriesViewSelection === "Board") && (
                  <>
                    <br/> 

                    {/* Board Selection Dropdown */}
                    <div className='pot-div' style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                      <Select
                        value={selectedBoard}
                        onChange={(e) => setSelectedBoard(e.target.value)}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value="Catch & Release">Catch & Release</MenuItem>
                        <MenuItem value="Offshore">Offshore</MenuItem>
                        <MenuItem value="Bay/Surf">Bay/Surf</MenuItem>
                      </Select>
                    </div>

                    {/* Board Table Display */}
                    <div className="board-display">
                      <h3 style={{fontStyle: "italic", color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}} >
                        Scroll bar at bottom if needed
                      </h3>
                      <br/>

                      {potEntryData ? (
                        (() => {
                          // Step 1: Get pot names for selected board
                          let allPots = [];
                          config?.potsConfig?.CONFIG_POTS_BOARD_LIST.forEach(boardObj => {
                            if (Object.keys(boardObj)[0] === selectedBoard) {
                              Object.values(boardObj).forEach(potArray => {
                                potArray.forEach(pot => {
                                  allPots.push(pot.title);
                                });
                              });
                            }
                          });

                          // Step 2: Get entries for the selected board
                          const entriesData = potEntryData
                            .filter(entry => {
                              const boardSelection = entry.boardSelections.find(bs => bs.board === selectedBoard);
                              return boardSelection !== undefined;
                            })
                            .map(entry => {
                              const boardSelection = entry.boardSelections.find(bs => bs.board === selectedBoard);
                              return {
                                name: entry.name, // This is either team name or angler name
                                potsEntered: boardSelection ? boardSelection.potList.sort() : []
                              };
                            });

                          // Step 3: Initialize counter for total entries
                          const totalEntered = allPots.map(() => 0);

                          // Define table styles
                          const headerCellStyle = {
                            border: '1px solid #ddd',
                            padding: '8px',
                            fontSize: '14px',
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                            position: 'sticky',
                            top: 0,
                            zIndex: 2,
                            color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
                          };

                          const nameCellStyle = {
                            border: '1px solid #ddd',
                            padding: '8px',
                            fontSize: '14px',
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#fff',
                            zIndex: 1,
                            fontWeight: 'bold',
                            color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
                          };

                          const tableCellStyle = {
                            border: '1px solid #ddd',
                            padding: '8px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
                          };

                          return (
                            <div className="scroll-wrapper">
                              <div className="scroll-content">
                                <table className="pot-table">
                                  <thead>
                                    <tr>
                                      <th className="sticky-col" style={headerCellStyle}>
                                        {selectedBoard === "Bay/Surf" ? "Angler" : "Team"}
                                      </th>
                                      {allPots.map((potName, index) => (
                                        <th key={index} style={headerCellStyle}>{potName}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entriesData.map((entry, entryIndex) => (
                                      <tr key={entryIndex}>
                                        <td className="sticky-col" style={nameCellStyle}>{entry.name}</td>
                                        {allPots.map((potName, potIndex) => {
                                          const entered = entry.potsEntered.includes(potName);
                                          if (entered) totalEntered[potIndex] += 1;
                                          return (
                                            <td key={potIndex} style={tableCellStyle}>
                                              {entered ? 'X' : ''}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}

                                    {/* Total Entries row */}
                                    <tr>
                                      <td style={{ ...nameCellStyle, fontWeight: 'bold' }}>Total Entries</td>
                                      {totalEntered.map((count, index) => (
                                        <td key={index} style={{ ...tableCellStyle, fontWeight: 'bold' }}>
                                          {count}
                                        </td>
                                      ))}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <p style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>
                          No pot entry data available.
                        </p>
                      )}
                    </div>
                  </>
                )}
  
                {/* ENTRIES - BY POT */}
                {entriesViewSelection === "By Pot" && (                   
                  <>                     
                    <br/>                     
                    <div className='pot-div'>                       
                      <Autocomplete                         
                        className='pot-autocomplete'                         
                        disablePortal                         
                        id="select-entries-by-pot-autocomplete-box"                         
                        value={entriesPotSelection}                         
                        options={entriesPotOptions}                         
                        renderInput={(params) => <TextField {...params} label="Select Pot" />}                         
                        onChange={handleEntriesPotSelection}                         
                        sx={{ width: '400px' }}                         
                      />                     
                    </div>                     
                    <br/>        

                    {/* Display summary */}
                    {entriesPotSelection && (
                      <>
                        {potEntryData ? (
                          (() => {
                            // Find which board contains this pot
                            let potBoard = '';
                            let potAmount = 0;
                            let tournamentCut = 1;

                            config?.potsConfig?.CONFIG_POTS_BOARD_LIST.forEach(boardObj => {
                              Object.entries(boardObj).forEach(([boardName, potArray]) => {
                                potArray.forEach(pot => {
                                  if (pot.title === entriesPotSelection) {
                                    potBoard = boardName;
                                    potAmount = pot.amount;
                                    tournamentCut = pot.tournamentCut;
                                  }
                                });
                              });
                            });

                            // Get all entries for this pot
                            const selectedPotEntries = potEntryData
                              .filter(entry => {
                                return entry.boardSelections.some(boardSelection => 
                                  boardSelection.potList.includes(entriesPotSelection)
                                );
                              })
                              .map(entry => entry.name)
                              .sort(); // Sort names alphabetically

                            const grossTotal = selectedPotEntries.length * potAmount;
                            const netTotal = grossTotal * (1 - tournamentCut);

                            return (
                              <div>
                                <p style={{ fontSize: '20px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
                                  <strong>Pot Name:</strong> {entriesPotSelection}
                                </p>
                                <p style={{ fontSize: '20px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
                                  <strong>Total Payout:</strong> {formatCurrency(netTotal)}
                                </p>
                                <p style={{ fontSize: '20px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
                                  <strong>{potBoard === 'Bay/Surf' ? 'Anglers' : 'Teams'} Entered ({selectedPotEntries.length})</strong>
                                </p>
                                <ul>
                                  {selectedPotEntries.map((name, index) => (
                                    <p key={index} style={{ 
                                      fontSize: '18px', 
                                      color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
                                      marginLeft: '20px'
                                    }}>
                                      {name}
                                    </p>
                                  ))}
                                </ul>
                              </div>
                            );
                          })()
                        ) : (
                          <p style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>
                            No entries found for this pot.
                          </p>
                        )}
                      </>
                    )}
                  </>                 
                )}
  
                {/* ENTRIES - BY TEAM/ANGLER */}
                {entriesViewSelection === "By Entrant" && (
                  <SimplifiedEntries
                    registeredTeamNameList={registeredTeamNameList}
                    registeredAnglerNameList={registeredAnglerNameList}
                    potEntryData={potEntryData}
                    formatCurrency={formatCurrency}
                    config={config}
                    teamNameListIsLoaded={teamNameListIsLoaded}
                    anglerNameListIsLoaded={anglerNameListIsLoaded}
                  />
                )}

              </>
            )}
  
            {/* PAYOUTS SECTION */}
            {displaySelection === "Payouts" && tournamentHasStarted && (
            <>
              {/* List View */}
              {payoutsDisplaySelection === "List" && (
                <>
                  <br/>
                  {!hasLoaded ? (
                    <div>
                      <h1 style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>Loading...</h1>
                      <CircularProgress />
                    </div>
                  ) : (
                    <>
                      {payoutsResultArray.map(result => {
                        if (result.rows.length > 0) {
                          return (
                            <PotsResultTable
                              key={result.title}
                              style={{ width: '100%' }}
                              title={result.title}
                              subtitle={result.subtitle}
                              numPlaces={result.numPlaces}  
                              rows={result.rows}
                              columns={matches ? (result.desktopColumns || []) : (result.mobileColumns || [])}
                              scroll={matches ? null : "scroll"}
                              density="compact"
                            />
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                </>
              )}

              {/* Slideshow View */}
              {payoutsDisplaySelection === "Slideshow" && (
                <>
                  <br/>
                  {!hasLoaded ? (
                    <div>
                      <h1 style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>Loading...</h1>
                      <CircularProgress />
                    </div>
                  ) : (
                    <>
                      <PotCarousel results={payoutsResultArray} />
                    </>
                  )}
                </>
              )}

              {/* Select View */}
              {payoutsDisplaySelection === "Select" && (
                <>
                  <br/>
                    <>
                      <div className='pot-div'>
                        <Autocomplete
                          className='pot-autocomplete'
                          disablePortal
                          id="select-payouts-by-pot-autocomplete-box"
                          value={payoutsSelectedResult[0]?.title || ''}
                          options={config?.potsConfig?.CONFIG_POTS_CATEGORIES.map(cat => cat.title)}
                          renderInput={(params) => <TextField {...params} label="Select Pot" />}  
                          onChange={(_, value) => {
                            let result = payoutsResultArray.filter(item => item.title === value);
                            setPayoutsSelectedResult(result);
                            setPayoutsHasSelectedResult(true);
                          }}
                          sx={{ width: '400px' }}
                        />
                      </div>
                      <br />
                      {payoutsHasSelectedResult && payoutsSelectedResult.map(result => (
                        result.rows.length > 0 ? (
                          <PotsResultTable
                            key={result.title}
                            style={{ width: '100%' }}
                            title={result.title}
                            subtitle={result.subtitle}
                            numPlaces={result.numPlaces}
                            rows={result.rows}
                            columns={matches ? result.desktopColumns : result.mobileColumns}
                            scroll={matches ? null : "scroll"}
                            density="compact"
                          />
                        ) : (
                          <p style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>
                            No results yet for {result.title}
                          </p>
                        )
                      ))}
                    </>

                </>
              )}
            </>
            )}

          </Box>
        </section>
        <Footer/>
      </main>
    </AnimatedPage>
  );

}

export default PotsPage;

