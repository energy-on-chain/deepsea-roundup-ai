import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';
import { Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SimplifiedEntries from '../components/SimplifiedEntries';
import ToggleSliderButton from '../components/buttons/ToggleSliderButton';
import './BasePage.css';

import { loadConfigForYear } from '../config/masterConfig';

function PotsPage() {

  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [allDataIsFetched, setAllDataIsFetched] = useState(false);

  // STATE - ENTRIES
  const [potEntryData, setPotEntryData] = useState(null);
  const [potEntryDataHasLoaded, setPotEntryDataHasLoaded] = useState(false);

  const viewOptions = ["Board", "By Pot", "By Entrant"];
  const [viewSelection, setViewSelection] = useState("Board");
  const [selectedBoard, setSelectedBoard] = useState("Catch & Release");

  const [registeredTeamNameList, setRegisteredTeamNameList] = useState([]);
  const [registeredAnglerNameList, setRegisteredAnglerNameList] = useState([]);
  const [teamNameListIsLoaded, setTeamNameListIsLoaded] = useState(false);
  const [anglerNameListIsLoaded, setAnglerNameListIsLoaded] = useState(false);

  const [entriesPotOptions, setEntriesPotOptions] = useState([]);
  const [entriesPotSelection, setEntriesPotSelection] = useState(null);

  useEffect(() => {
    fetchConfigAndData();
  }, [year]);

  const fetchConfigAndData = async () => {
    try {
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig);

      const {
        generalConfig: {
          CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME,
          CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
        },
        potsConfig: {
          CONFIG_POTS_BOARD_LIST,
        },
      } = loadedConfig;

      // Build flat list of all pot titles across all boards for the "By Pot" autocomplete
      const allPotTitles = CONFIG_POTS_BOARD_LIST.flatMap(boardObj => {
        const boardName = Object.keys(boardObj)[0];
        return boardObj[boardName].map(pot => pot.title);
      });
      setEntriesPotOptions(allPotTitles);

      const apiUrl = import.meta.env.VITE_NODE_ENV === "production"
        ? import.meta.env.VITE_SERVER_URL_PRODUCTION
        : import.meta.env.VITE_SERVER_URL_STAGING;

      fetchEntryData(apiUrl, CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME, CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME);

    } catch (error) {
      console.error('Error loading config or fetching data:', error);
    }
  };

  const fetchEntryData = async (apiUrl, teamsTableName, potsTableName) => {
    try {
      // Fetch registered participant list
      fetch(`${apiUrl}/api/${year}/admin_get_database_list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName: teamsTableName }),
      })
        .then(res => res.json())
        .then(data => {
          const { teamNameList, anglerNameList } = transformParticipantData(data);
          setRegisteredTeamNameList(teamNameList);
          setTeamNameListIsLoaded(true);
          setRegisteredAnglerNameList(anglerNameList);
          setAnglerNameListIsLoaded(true);
        })
        .catch(error => {
          console.error('Error fetching participant data:', error);
          toast.error('Error loading participant data. Please try again.');
        });

      // Fetch all pot entry data
      fetch(`${apiUrl}/api/${year}/get_all_pot_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ potYear: potsTableName }),
      })
        .then(res => res.json())
        .then(data => {
          const parsedData = data.data.map(entry => ({
            ...entry,
            boardSelections: typeof entry.boardSelections === 'string'
              ? JSON.parse(entry.boardSelections)
              : (entry.boardSelections || []),
          }));
          setPotEntryData(parsedData);
          setPotEntryDataHasLoaded(true);

          // Build By Pot dropdown options from actual stored data (handles config/data title mismatches)
          const titleSet = new Set();
          parsedData.forEach(entry => {
            (entry.boardSelections || []).forEach(bs => {
              (bs.potList || []).forEach(t => titleSet.add(t));
            });
          });
          if (titleSet.size > 0) {
            setEntriesPotOptions([...titleSet].sort());
          }
        })
        .catch(error => {
          console.error('Error fetching pot entry data:', error);
          toast.error('Error loading pot entries. Please try again.');
          setPotEntryData([]);
          setPotEntryDataHasLoaded(true);
        });

      setAllDataIsFetched(true);
    } catch (error) {
      console.error('Error fetching entry data:', error);
    }
  };

  const transformParticipantData = (data) => {
    const teamList = [];
    const teamNameList = [];
    const anglerList = [];
    const anglerNameList = [];

    Object.entries(data).forEach(([id, angler]) => {
      const anglerObj = { id, ...angler };
      anglerList.push(anglerObj);
      anglerNameList.push({ id, label: angler.anglerName, anglerData: anglerObj });

      if (angler.boatName && angler.boatName.trim() !== '') {
        const existingTeamIndex = teamList.findIndex(t => t.id === angler.boatName);
        if (existingTeamIndex === -1) {
          const teamObj = { id: angler.boatName, teamName: angler.boatName, members: [anglerObj] };
          teamList.push(teamObj);
          teamNameList.push({ teamKey: angler.boatName, teamData: teamObj, label: angler.boatName });
        } else {
          teamList[existingTeamIndex].members.push(anglerObj);
        }
      }
    });

    return { teamList, teamNameList, anglerList, anglerNameList };
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  // ---- Board helpers ----

  // Returns pot objects [{title, amount, tournamentCut}] for a board, sourced from stored data.
  // Falls back to config if no stored data is available. Amounts come from config when titles match.
  const getBoardPotsFromData = (boardName) => {
    const configPots = [];
    (config?.potsConfig?.CONFIG_POTS_BOARD_LIST || []).forEach(boardObj => {
      if (Object.keys(boardObj)[0] === boardName) {
        Object.values(boardObj)[0].forEach(pot => configPots.push(pot));
      }
    });

    if (!potEntryData || potEntryData.length === 0) return configPots;

    // Build column list from what's actually in the stored data for this board
    const titleSet = new Set();
    potEntryData.forEach(entry => {
      (entry.boardSelections || []).forEach(bs => {
        if (bs.board === boardName) {
          (bs.potList || []).forEach(t => titleSet.add(t));
        }
      });
    });
    if (titleSet.size === 0) return configPots;

    // Enrich stored titles with config amounts where titles match exactly
    const configByTitle = {};
    configPots.forEach(pot => { configByTitle[pot.title] = pot; });

    return [...titleSet].sort().map(title => {
      if (configByTitle[title]) return configByTitle[title];
      // Fallback: parse amount from title string, e.g. "Wahoo ($200)" → 200
      const match = title?.match(/\(\$(\d+)\)$/);
      const amount = match ? parseInt(match[1], 10) : 0;
      return { title, amount, tournamentCut: 0.2 }; // assume standard 20% cut if not in config
    });
  };

  const getBoardNames = () =>
    (config?.potsConfig?.CONFIG_POTS_BOARD_LIST || []).map(boardObj => Object.keys(boardObj)[0]);

  const getEntriesForBoard = (boardName) => {
    if (!potEntryData) return [];
    return potEntryData
      .filter(entry => (entry.boardSelections || []).some(bs => bs.board === boardName))
      .map(entry => {
        const bs = entry.boardSelections.find(bs => bs.board === boardName);
        return { name: entry.name, potsEntered: bs ? bs.potList : [] };
      });
  };

  const getPotDetails = (potTitle) => {
    let details = null;
    (config?.potsConfig?.CONFIG_POTS_BOARD_LIST || []).forEach(boardObj => {
      const boardName = Object.keys(boardObj)[0];
      boardObj[boardName].forEach(pot => {
        if (pot.title === potTitle) details = { ...pot, boardName };
      });
    });
    // Fallback: find board name from stored data (handles title mismatches vs config)
    if (!details && potEntryData) {
      for (const entry of potEntryData) {
        for (const bs of (entry.boardSelections || [])) {
          if ((bs.potList || []).includes(potTitle)) {
            // Parse amount from the title itself, e.g. "Blackfin Tuna ($200)" → 200
            const match = potTitle?.match(/\(\$(\d+)\)$/);
            const amount = match ? parseInt(match[1], 10) : 0;
            details = { title: potTitle, boardName: bs.board, amount, tournamentCut: 0.2 };
            break;
          }
        }
        if (details) break;
      }
    }
    return details;
  };

  const getEntriesForPot = (potTitle) => {
    if (!potEntryData) return [];
    return potEntryData
      .filter(entry =>
        (entry.boardSelections || []).some(bs => (bs.potList || []).includes(potTitle))
      )
      .map(entry => entry.name)
      .sort();
  };

  // ---- Table styles ----
  const titleColor = config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR;
  const headerCellStyle = {
    border: '1px solid #ddd', padding: '8px', fontSize: '14px',
    backgroundColor: '#f4f4f4', fontWeight: 'bold',
    position: 'sticky', top: 0, zIndex: 2, color: titleColor,
  };
  const nameCellStyle = {
    border: '1px solid #ddd', padding: '8px', fontSize: '14px',
    position: 'sticky', left: 0, backgroundColor: '#fff', zIndex: 1,
    fontWeight: 'bold', color: titleColor,
  };
  const tableCellStyle = {
    border: '1px solid #ddd', padding: '8px', textAlign: 'center',
    fontSize: '14px', color: titleColor,
  };

  return (
    <AnimatedPage>
      <main>
        {/* BANNER */}
        <section style={{ backgroundColor: config?.stylingConfig?.CONFIG_STYLING_BANNER_BACKGROUND_COLOR }} className="section-banner">
          <h1 style={{ color: config?.stylingConfig?.CONFIG_STYLING_BANNER_TEXT_COLOR }}>Pots</h1>
        </section>

        {/* VIEW TOGGLE */}
        {allDataIsFetched && (
          <section className="section-leaderboard">
            {matches ? (
              <ToggleSliderButton
                choice={viewSelection}
                choiceList={viewOptions}
                aligment={viewSelection}
                setAlignment={setViewSelection}
              />
            ) : (
              <Select
                value={viewSelection}
                onChange={(e) => setViewSelection(e.target.value)}
              >
                {viewOptions.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </Select>
            )}
          </section>
        )}

        <section className="section-view">
          <Box sx={{ width: '90%', typography: 'body1' }}>

            {/* Loading */}
            {!allDataIsFetched && (
              <>
                <br/><br/>
                <h1 style={{ color: titleColor }}>Loading, one moment please...</h1>
                <CircularProgress />
              </>
            )}

            {allDataIsFetched && (
              <>
                {/* ── BOARD VIEW ─────────────────────────────────────── */}
                {viewSelection === "Board" && (
                  <>
                    <br/>
                    {/* Board selector */}
                    <div className='pot-div' style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                      <Select
                        value={selectedBoard}
                        onChange={(e) => setSelectedBoard(e.target.value)}
                        sx={{ minWidth: 200 }}
                      >
                        {getBoardNames().map(name => (
                          <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </div>

                    <div className="board-display">
                      <h3 style={{ fontStyle: "italic", color: titleColor }}>
                        Scroll bar at bottom if needed
                      </h3>
                      <br/>

                      {!potEntryDataHasLoaded ? (
                        <CircularProgress />
                      ) : (() => {
                        const boardPots = getBoardPotsFromData(selectedBoard);
                        const entriesData = getEntriesForBoard(selectedBoard);
                        const totalEntered = boardPots.map(() => 0);

                        return (
                          <div className="scroll-wrapper">
                            <div className="scroll-content">
                              <table className="pot-table">
                                <thead>
                                  <tr>
                                    <th className="sticky-col" style={headerCellStyle}>
                                      {selectedBoard === "Bay/Surf" ? "Angler" : "Team"}
                                    </th>
                                    {boardPots.map((pot, i) => (
                                      <th key={i} style={headerCellStyle}>{pot.title}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {entriesData.map((entry, ei) => (
                                    <tr key={ei}>
                                      <td className="sticky-col" style={nameCellStyle}>{entry.name}</td>
                                      {boardPots.map((pot, pi) => {
                                        const entered = (entry.potsEntered || []).includes(pot.title);
                                        if (entered) totalEntered[pi] += 1;
                                        return (
                                          <td key={pi} style={tableCellStyle}>
                                            {entered ? '✓' : ''}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}

                                  {/* Total Entries row */}
                                  <tr>
                                    <td style={{ ...nameCellStyle, fontWeight: 'bold', borderTop: '2px solid #aaa' }}>
                                      Entries
                                    </td>
                                    {totalEntered.map((count, i) => (
                                      <td key={i} style={{ ...tableCellStyle, fontWeight: 'bold', borderTop: '2px solid #aaa' }}>
                                        {count}
                                      </td>
                                    ))}
                                  </tr>

                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}

                {/* ── BY POT VIEW ────────────────────────────────────── */}
                {viewSelection === "By Pot" && (
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
                        onChange={(e, value) => setEntriesPotSelection(value)}
                        sx={{ width: '400px' }}
                      />
                    </div>
                    <br/>

                    {entriesPotSelection && (() => {
                      const potDetails = getPotDetails(entriesPotSelection);
                      const entries = getEntriesForPot(entriesPotSelection);

                      if (!potEntryDataHasLoaded) return <CircularProgress />;

                      return (
                        <div>
                          <p style={{ fontSize: '20px', color: titleColor }}>
                            <strong>Pot:</strong> {entriesPotSelection}
                          </p>
                          <p style={{ fontSize: '20px', color: titleColor }}>
                            <strong>{potDetails?.boardName === 'Bay/Surf' ? 'Anglers' : 'Teams'} Entered: {entries.length}</strong>
                          </p>
                          {entries.length === 0 ? (
                            <p style={{ fontSize: '16px', color: titleColor, marginLeft: '20px', fontStyle: 'italic' }}>
                              No entries yet.
                            </p>
                          ) : (
                            entries.map((name, i) => (
                              <p key={i} style={{ fontSize: '18px', color: titleColor, marginLeft: '20px' }}>
                                {name}
                              </p>
                            ))
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}

                {/* ── BY ENTRANT VIEW ────────────────────────────────── */}
                {viewSelection === "By Entrant" && (
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
          </Box>
        </section>

        <Footer />
      </main>
    </AnimatedPage>
  );
}

export default PotsPage;
