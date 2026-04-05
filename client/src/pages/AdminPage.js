import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {auth} from "../firebase";
import {signOut, signInWithEmailAndPassword} from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import AnimatedPage from './AnimatedPage';
import CrudTable from '../components/tables/CrudTable';
import LeaderboardResultTable from '../components/tables/LeaderboardResultTable';
import PotsResultTable from '../components/tables/PotsResultTable';
import Footer from '../components/Footer';
import Login from '../components/Login';
import { fetchAndGenerateRegistrationReport } from '../generators/registrationReports';
import { generateLeaderboardReport } from '../generators/leaderboardReports';
import { generatePotsReport } from '../generators/potReports';
import { generatePressReport } from '../generators/pressReports';
import { generateAnnouncerReport } from '../generators/announcerReports';
import "./RegisterPage.css";
import { loadConfigForYear } from '../config/masterConfig';

function AdminPage() {   

  // STATE - GENERAL
  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();    // device size
  const matches = useMediaQuery(theme.breakpoints.up("md"));  
  const isMobile = !matches; // Detect if the user is on mobile
  const currentUser = JSON.parse(window.localStorage.getItem('user'));    // login status
  const [tabName, setTabName] = useState(window.localStorage.getItem('selectedTab') || "Catches"); 
  const [tableProperties, setTableProperties] = useState([])
  const [apiUrl, setApiUrl] = useState();
  const today = new Date();
  const desktopScroll = null;
  const mobileScroll = 'scroll';
  const [style, setStyle] = useState();
  const [initialState, setInitialState] = useState();
  const [pageSizeOptions, setPageSizeOptions] = useState();

  // STATE - TEAMS (ANGLERS)
  const [anglerRows, setAnglerRows] = useState([]);
  const [anglerRowsHaveLoaded, setAnglerRowsHaveLoaded] = useState(false);
  const [isAddAnglerModalOpen, setIsAddAnglerModalOpen] = useState(false);
  const [isDeleteAnglerModalOpen, setIsDeleteAnglerModalOpen] = useState(false);
  const [isEditAnglerModalOpen, setIsEditAnglerModalOpen] = useState(false);
  const [deleteAnglerInfo, setDeleteAnglerInfo] = useState();
  const [editAnglerInfo, setEditAnglerInfo] = useState();
  const [registrationStats, setRegistrationStats] = useState({
    totalAnglers: 0,
    checkedInAnglers: 0,
    totalRegistrationFees: 0,
  });
  const openAddAnglerModal = () => {setIsAddAnglerModalOpen(true)};
  const closeAddAnglerModal = () => {setIsAddAnglerModalOpen(false)};
  const openEditAnglerModal = () => {setIsEditAnglerModalOpen(true)};
  const closeEditAnglerModal = () => {setIsEditAnglerModalOpen(false)};
  const openDeleteAnglerModal = () => {setIsDeleteAnglerModalOpen(true)};
  const closeDeleteAnglerModal = () => {setIsDeleteAnglerModalOpen(false)};
  const [isEarlyBird, setIsEarlyBird] = useState(false);
  const [earlyBird, setEarlyBird] = useState({
    adultEarlybirdFee: 0,
    juniorEarlybirdFee: 0,
    date: '',
  });
  const [normalFee, setNormalFee] = useState({
    adultNormalfee: 0,
    juniorNormalfee: 0,
    date: '',
  });

  // STATE - SPONSORS
  const [sponsorRows, setSponsorRows] = useState([]);
  const [sponsorRowsHaveLoaded, setSponsorRowsHaveLoaded] = useState(false);
  const [isAddSponsorModalOpen, setIsAddSponsorModalOpen] = useState(false);
  const [isDeleteSponsorModalOpen, setIsDeleteSponsorModalOpen] = useState(false);
  const [isEditSponsorModalOpen, setIsEditSponsorModalOpen] = useState(false);
  const [deleteSponsorInfo, setDeleteSponsorInfo] = useState();
  const [editSponsorInfo, setEditSponsorInfo] = useState();
  const [sponsorStats, setSponsorStats] = useState({
    totalSponsors: 0,
    totalSponsorDonations: 0,
  });
  const openAddSponsorModal = () => {setIsAddSponsorModalOpen(true)};
  const closeAddSponsorModal = () => {setIsAddSponsorModalOpen(false)};
  const openEditSponsorModal = () => {setIsEditSponsorModalOpen(true)};
  const closeEditSponsorModal = () => {setIsEditSponsorModalOpen(false)};
  const openDeleteSponsorModal = () => {setIsDeleteSponsorModalOpen(true)};
  const closeDeleteSponsorModal = () => {setIsDeleteSponsorModalOpen(false)};

  // STATE - CATCHES
  const [catchRows, setCatchRows] = useState([]);
  const [catchRowsHaveLoaded, setCatchRowsHaveLoaded] = useState(false);
  const [isAddCatchModalOpen, setIsAddCatchModalOpen] = useState(false);
  const [isDeleteCatchModalOpen, setIsDeleteCatchModalOpen] = useState(false);
  const [isEditCatchModalOpen, setIsEditCatchModalOpen] = useState(false);
  const [deleteCatchInfo, setDeleteCatchInfo] = useState();
  const [editCatchInfo, setEditCatchInfo] = useState();
  const [catchesStats, setCatchesStats] = useState({
    totalFish: 0,
    divisionStats: null,
  });
  const openAddCatchModal = () => {setIsAddCatchModalOpen(true)};
  const closeAddCatchModal = () => {setIsAddCatchModalOpen(false)};
  const openEditCatchModal = () => {setIsEditCatchModalOpen(true)};
  const closeEditCatchModal = () => {setIsEditCatchModalOpen(false)};
  const openDeleteCatchModal = () => {setIsDeleteCatchModalOpen(true)};
  const closeDeleteCatchModal = () => {setIsDeleteCatchModalOpen(false)};

  // STATE - ANNOUNCEMENTS
  const [announcementRows, setAnnouncementRows] = useState([]);
  const [announcementRowsHaveLoaded, setAnnouncementRowsHaveLoaded] = useState(false);
  const [isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen] = useState(false);
  const [isDeleteAnnouncementModalOpen, setIsDeleteAnnouncementModalOpen] = useState(false);
  const [isEditAnnouncementModalOpen, setIsEditAnnouncementModalOpen] = useState(false);
  const [deleteAnnouncementInfo, setDeleteAnnouncementInfo] = useState();
  const [editAnnouncementInfo, setEditAnnouncementInfo] = useState();
  const openAddAnnouncementModal = () => {setIsAddAnnouncementModalOpen(true)};
  const closeAddAnnouncementModal = () => {setIsAddAnnouncementModalOpen(false)};
  const openEditAnnouncementModal = () => {setIsEditAnnouncementModalOpen(true)};
  const closeEditAnnouncementModal = () => {setIsEditAnnouncementModalOpen(false)};
  const openDeleteAnnouncementModal = () => {setIsDeleteAnnouncementModalOpen(true)};
  const closeDeleteAnnouncementModal = () => {setIsDeleteAnnouncementModalOpen(false)};

  // STATE - POTS
  const [potRows, setPotRows] = useState([]);
  const [potRowsHaveLoaded, setPotRowsHaveLoaded] = useState(false);
  const [isAddPotModalOpen, setIsAddPotModalOpen] = useState(false);
  const [isDeletePotModalOpen, setIsDeletePotModalOpen] = useState(false);
  const [isEditPotModalOpen, setIsEditPotModalOpen] = useState(false);
  const [deletePotInfo, setDeletePotInfo] = useState();
  const [editPotInfo, setEditPotInfo] = useState();
  const [potStats, setPotStats] = useState({
    totalPotSize: 0,
    boardTotals: {},
  });
  const openAddPotModal = () => {setIsAddPotModalOpen(true)};
  const closeAddPotModal = () => {setIsAddPotModalOpen(false)};
  const openEditPotModal = () => {setIsEditPotModalOpen(true)};
  const closeEditPotModal = () => {setIsEditPotModalOpen(false)};
  const openDeletePotModal = () => {setIsDeletePotModalOpen(true)};
  const closeDeletePotModal = () => {setIsDeletePotModalOpen(false)};

  // STATE - AUCTION
  // FIXME

  // REPORTS
  const [isRegistrationReportLoading, setIsRegistrationReportLoading] = useState(false);
  const [isLeaderboardReportLoading, setIsLeaderboardReportLoading] = useState(false);
  const [isPotsReportLoading, setIsPotsReportLoading] = useState(false);
  const [isPressReportLoading, setIsPressReportLoading] = useState(false);
  const [isAnnouncerReportLoading, setIsAnnouncerReportLoading] = useState(false);

  // INITIALIZE
  useEffect(() => {
    const selectedTab = tabName || "Catches";  // Ensure fallback to the default tab
    fetchConfigAndData(tabName); // Load config and fetch data
  }, [year, tabName]);  // add tabName as a dependency to re-fetch when the tab changes

  const fetchConfigAndData = async (tab) => {

    setLoading(true);

    try {
      const loadedConfig = await loadConfigForYear(year); // Load the config dynamically
      setConfig(loadedConfig); // Set the loaded configuration

      const {
        generalConfig: {
          CONFIG_GENERAL_TOURNAMENT_NAME,
          CONFIG_GENERAL_YEAR,    
          CONFIG_GENERAL_HAS_REGISTRATION,
          CONFIG_GENERAL_HAS_NEWSFEED,
          CONFIG_GENERAL_HAS_POTS,
          CONFIG_GENERAL_HAS_AUCTION,
          CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,   // firebase properties
          CONFIG_GENERAL_FIREBASE_TEAMS_ID_NAME,   
          CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,  
          CONFIG_GENERAL_FIREBASE_CATCHES_ID_NAME,
          CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_TABLE_NAME,  
          CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_ID_NAME,
          CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME,  
          CONFIG_GENERAL_FIREBASE_POTS_ID_NAME,
          CONFIG_GENERAL_FIREBASE_AUCTION_TABLE_NAME,    
          CONFIG_GENERAL_FIREBASE_AUCTION_ID_NAME,
          CONFIG_GENERAL_HAS_LEADERBOARD,
        },
        stylingConfig: {
          CONFIG_STYLING_BANNER_BACKGROUND_COLOR,
          CONFIG_STYLING_BANNER_TEXT_COLOR,
          CONFIG_STYLING_LOGIN_TEXT_COLOR,
          CONFIG_STYLING_STATS_TEXT_COLOR,
        },
        registrationConfig: {
          CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION,
          CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE,
          CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE,
          CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING,
          CONFIG_REGISTRATION_NORMAL_ADULT_FEE,
          CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE,
          CONFIG_REGISTRATION_NORMAL_DATE_STRING,
          CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS,
        },
        adminConfig: {
          CONFIG_ADMIN_DEFAULT_TAB_NAME,
          CONFIG_ADMIN_DEFAULT_TAB_NAME_LIST,
          CONFIG_ADMIN_TOURNAMENT_START_DATE_STRING,
          CONFIG_ADMIN_TOURNAMENT_END_DATE_STRING,
          CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANGLERS,    // display properties
          CONFIG_ADMIN_TABLE_PROPERTIES_FOR_SPONSORS,
          CONFIG_ADMIN_TABLE_PROPERTIES_FOR_CATCHES,
          CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANNOUNCEMENTS,
          CONFIG_ADMIN_TABLE_PROPERTIES_FOR_POTS,
          CONFIG_ADMIN_TABLE_PROPERTIES_FOR_AUCTIONS,
        },
        catchConfig: {
          CONFIG_CATCHES_STATS_LIST, 
          CONFIG_CATCHES_SPECIES_LIST,
        },
        potsConfig: {
          CONFIG_POTS_BOARD_LIST,
        },
      } = loadedConfig;

      setEarlyBird({
        hasEarlyBird: loadedConfig.registrationConfig.CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION,
        adultEarlybirdFee: loadedConfig.registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_ADULT_FEE,
        juniorEarlybirdFee: loadedConfig.registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_JUNIOR_FEE,
        date: loadedConfig.registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_DATE_STRING,
      });
      setNormalFee({
        adultNormalfee: loadedConfig.registrationConfig.CONFIG_REGISTRATION_NORMAL_ADULT_FEE,
        juniorNormalfee: loadedConfig.registrationConfig.CONFIG_REGISTRATION_NORMAL_JUNIOR_FEE,
        date: loadedConfig.registrationConfig.CONFIG_REGISTRATION_NORMAL_DATE_STRING,
      });

      const currentTime = new Date().getTime();
      if (currentTime > loadedConfig.registrationConfig.CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS){
        setIsEarlyBird(false);
      } else {
        setIsEarlyBird(true);
      }

      const apiUrl = import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_SERVER_URL_PRODUCTION
        : import.meta.env.VITE_SERVER_URL_STAGING;

      setApiUrl(apiUrl);

      // Clear all row data
      setAnglerRows([]);
      setAnglerRowsHaveLoaded(false);
      setSponsorRows([]);
      setSponsorRowsHaveLoaded(false);
      setCatchRows([]);
      setCatchRowsHaveLoaded(false);
      setAnnouncementRows([]);
      setAnnouncementRowsHaveLoaded(false);
      setPotRows([]);
      setPotRowsHaveLoaded(false);
      // FIXME: auctions
  
      // Define tab settings
      let tableName;
      let idName;
      let tempTableProperties;
      switch (tab) {   
        case 'Anglers':
          tableName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME;
          idName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_ID_NAME;
          tempTableProperties = loadedConfig.adminConfig.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANGLERS;
          break;
        case 'Sponsors':
          tableName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_SPONSORS_TABLE_NAME;
          idName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_SPONSORS_ID_NAME;
          tempTableProperties = loadedConfig.adminConfig.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_SPONSORS;
          break;
        case 'Catches':
          tableName = CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME;
          idName = CONFIG_GENERAL_FIREBASE_CATCHES_ID_NAME;
          tempTableProperties = CONFIG_ADMIN_TABLE_PROPERTIES_FOR_CATCHES;
          break;
        case 'Announcements':
          tableName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_TABLE_NAME;
          idName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_ID_NAME;
          tempTableProperties = loadedConfig.adminConfig.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANNOUNCEMENTS;
          break;
        case 'Pots':
          tableName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME;
          idName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_POTS_ID_NAME;
          tempTableProperties = loadedConfig.adminConfig.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_POTS;
          break;
        case 'Auction':
          tableName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_AUCTION_TABLE_NAME;
          idName = loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_AUCTION_ID_NAME;
          tempTableProperties = loadedConfig.adminConfig.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_AUCTIONS;
          break;
        default:    // handles "Stats" and "Reports" tab cases
          break;
      }
      let tempRows = [];

      // Fetch tab data
      if (tab === "Stats") {
        try {

          // Registration
          if (loadedConfig.generalConfig.CONFIG_GENERAL_HAS_REGISTRATION) {
            const [totalAnglersRes, checkedInAnglersRes, totalRegistrationFeesRes, totalSponsorRes, totalSponsorDonationRes] = await Promise.all([
              fetch(`${apiUrl}/api/${year}/registration_get_number_of_registered_teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamTableName: loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME })
              }),
              fetch(`${apiUrl}/api/${year}/registration_get_number_of_checked_in_teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamTableName: loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME })
              }),
              fetch(`${apiUrl}/api/${year}/registration_get_total_registration_fees_collected`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamTableName: loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME })
              }),
              fetch(`${apiUrl}/api/${year}/registration_get_number_of_registered_sponsors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({})
              }),
              fetch(`${apiUrl}/api/${year}/registration_get_total_sponsor_donations_collected`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({})
              }),
            ]);

            const totalAnglers = await totalAnglersRes.json();
            const checkedInAnglers = await checkedInAnglersRes.json();
            const totalRegistrationFees = await totalRegistrationFeesRes.json();
            const totalSponsors = await totalSponsorRes.json();
            const totalSponsorDonations = await totalSponsorDonationRes.json();

        
            // Update state with fetched data
            setRegistrationStats({
              totalAnglers: totalAnglers.totalTeams,
              checkedInAnglers: checkedInAnglers.checkedInTeams,
              totalRegistrationFees: totalRegistrationFees.totalRegistrationFees,
            });

            setSponsorStats({
              totalSponsors: totalSponsors.totalSponsors,
              totalSponsorDonations: totalSponsorDonations.totalDonationFees,
            });
          }

          // Catches
          if (loadedConfig.generalConfig.CONFIG_GENERAL_HAS_NEWSFEED) {
            try {
              // Fetch total fish count as a promise
              const totalFishRes = fetch(`${apiUrl}/api/${year}/admin_get_total_catch_count`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ catchYear: loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME })
              }).then(res => res.json());

              // Fetch fish count by species
              const divisionStatsPromises = loadedConfig.catchConfig.CONFIG_CATCHES_STATS_LIST.map((division) => {
                return fetch(`${apiUrl}/api/${year}/admin_get_total_catch_count_by_division`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ catchYear: loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME, division: division })
                })
                .then(res => res.json())
                .then(data => ({ division, count: data.divisionCount }));
              });

              // Wait for all promises to resolve
              const [totalFishData, ...divisionStats] = await Promise.all([totalFishRes, ...divisionStatsPromises]);
              console.log('divisionStats:', divisionStats)

              // Parse the results
              const totalFishCount = totalFishData.totalFishCount;
              const divisionCountStats = divisionStats.reduce((acc, { division, count }) => {
                acc[division] = count;
                return acc;
              }, {});

              // Update the state
              setCatchesStats({
                totalFish: totalFishCount,
                divisionStats: divisionCountStats,
              });

            } catch (error) {
              console.error('Error fetching catches data:', error);
            }
          }         

          if (loadedConfig.generalConfig.CONFIG_GENERAL_HAS_POTS) {
            try {
              // Fetch total pot size data
              const boardNames = loadedConfig.potsConfig.CONFIG_POTS_BOARD_LIST.map(board => Object.keys(board)[0]);
              const potSizeRes = await fetch(`${apiUrl}/api/${year}/get_total_pot_size_data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ potYear: loadedConfig.generalConfig.CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME, boardNames })
              });
              const potSizeData = await potSizeRes.json();
          
              // Parse the results
              const boardTotals = potSizeData.boardTotals;
              const totalPotSize = potSizeData.totalPotSize;

              console.log("boardTotals", boardTotals)
          
              // Update the state
              setPotStats({
                totalPotSize,
                boardTotals,
              });
          
            } catch (error) {
              console.error('Error fetching pot data:', error);
            }
          }

        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      } else if (tab !== "Reports" && tab !== "Champions" && tab !== "Pot Winners") {
        const res = await fetch(`${apiUrl}/api/${year}/admin_get_database_list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName: tableName })
        });
        await res.json().then(result => {
          Object.keys(result).forEach((elementKey, i) => {
            let tempObject = { ...result[elementKey] };
            tempObject["id"] = i;
            tempObject[idName] = elementKey;
            tempRows.push(tempObject);
            console.log('List of fetched data for tab:');
            console.log(tempObject);
          });
        });
      }
      
      // Set general state
      setApiUrl(apiUrl);
      setTableProperties(tempTableProperties);
      setStyle({ height: 800, width: '100%' });
      setInitialState({ pagination: { paginationModel: { page: 0, pageSize: 10 } } });
      setPageSizeOptions([5, 10, 25, 100]);

      // Set specific tab state
      if (tab === 'Anglers') {
        setAnglerRows(tempRows);
        setAnglerRowsHaveLoaded(true);
      } else if (tab === 'Sponsors') {
        setSponsorRows(tempRows);
        setSponsorRowsHaveLoaded(true);
      } else if (tab === 'Catches') {
        setCatchRows(tempRows);
        setCatchRowsHaveLoaded(true);
      } else if (tab === 'Announcements') {
        setAnnouncementRows(tempRows);
        setAnnouncementRowsHaveLoaded(true);
      } else if (tab === 'Pots') {
        setPotRows(tempRows);
        setPotRowsHaveLoaded(true);
      } else if (tab === 'Auction') {
        // FIXME
      }
  
      // Set all modal states
      // Anglers
      setIsAddAnglerModalOpen(false);   
      setIsEditAnglerModalOpen(false);
      setIsDeleteAnglerModalOpen(false);

      // Sponsors
      setIsAddSponsorModalOpen(false);   
      setIsEditSponsorModalOpen(false);
      setIsDeleteSponsorModalOpen(false);

      // Catches
      setIsAddCatchModalOpen(false);   
      setIsEditCatchModalOpen(false);
      setIsDeleteCatchModalOpen(false);

      // Announcements
      setIsAddAnnouncementModalOpen(false);   
      setIsEditAnnouncementModalOpen(false);
      setIsDeleteAnnouncementModalOpen(false);

      // Pots FIXME
      setIsAddPotModalOpen(false);
      setIsEditPotModalOpen(false);
      setIsDeletePotModalOpen(false);

      // Auction FIXME
  
    } catch (error) {
      console.log('There was an error loading the server data for the default tab on the admin page: ' + error);
    } finally {
      setLoading(false);
    };
  } 
  
  // HELPERS
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleTabChange = (event, newTab) => {
    setTabName(newTab);
    window.localStorage.setItem('selectedTab', newTab); // Save the selected tab to local storage
    fetchConfigAndData(newTab);
  };

  const delayRefresh = () => {
    setTimeout(() => {
      console.log('Delaying page refresh...');
      window.location.reload();
    }, 2000);
  }

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  // AUTHENTICATION
  const handleLogin = (e, email, password) => {

    if (!validateEmail(email)) {
      toast.error("Please input a valid email.");
      return;
    }

    if (!password) {
      toast.error("Please input your password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        toast.success("Login successful! Redirecting...");
        window.localStorage.setItem('user', JSON.stringify(userCredential.user));   
        delayRefresh();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Invalid login attempt. Please try again or contact the site administrator.")
      })

  }

  const handleLogout = (e) => {
    signOut(auth)
      .then(() => {
        window.localStorage.setItem('user', JSON.stringify(null));
        toast.success('Logout successful! Redirecting...');
        delayRefresh();        
      })
      .catch(error => {
        console.log(error);
        toast.error("There was an error while attempting to log you out. Please contact the site administrator.")
      })
  }

  // REPORT GENERATORS
  const handleGenerateRegistrationReport = async (year) => {
    setIsRegistrationReportLoading(true); // Set the loading state
    try {
      console.log('In handleGenerateRegistrationReport...');
      await fetchAndGenerateRegistrationReport(year, config?.generalConfig?.CONFIG_GENERAL_TOURNAMENT_NAME, config?.adminConfig?.CONFIG_ADMIN_TABLE_PROPERTIES_FOR_ANGLERS);
    } catch (error) {
      console.error("Error generating registration report:", error);
    } finally {
      setIsRegistrationReportLoading(false); // Reset the loading state after completion
    }
  };


  const handleGenerateLeaderboardReport = async (year) => {
    setIsLeaderboardReportLoading(true);
    try {
      console.log('In handleGenerateLeaderboardReport...');
      await generateLeaderboardReport(year, config?.generalConfig?.CONFIG_GENERAL_TOURNAMENT_NAME);
    } catch (error) {
      console.error("Error generating leaderboard report:", error);
    } finally {
      setIsLeaderboardReportLoading(false);
    }
  };

  const handleGeneratePotsReport = async (year) => {
    setIsPotsReportLoading(true);
    try {
      console.log('In handleGeneratePotsReport...');
      await generatePotsReport(year, config?.generalConfig?.CONFIG_GENERAL_TOURNAMENT_NAME);
    } catch (error) {
      console.error("Error generating pots report:", error);
    } finally {
      setIsPotsReportLoading(false);
    }
  };

  const handleGeneratePressReport = async (year) => {
    setIsPressReportLoading(true);
    try {
      await generatePressReport(year, config?.generalConfig?.CONFIG_GENERAL_TOURNAMENT_NAME);
    } catch (error) {
      console.error("Error generating press report:", error);
    } finally {
      setIsPressReportLoading(false);
    }
  };

  const handleGenerateAnnouncerReport = async (year) => {
    setIsAnnouncerReportLoading(true);
    try {
      await generateAnnouncerReport(year, config?.generalConfig?.CONFIG_GENERAL_TOURNAMENT_NAME);
    } catch (error) {
      console.error("Error generating announcer report:", error);
    } finally {
      setIsAnnouncerReportLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <main>

        {/* BANNER */}
        <section style={{ backgroundColor: config?.stylingConfig?.CONFIG_STYLING_BANNER_BACKGROUND_COLOR }} className="section-banner">
          <h1 style={{ color: config?.stylingConfig?.CONFIG_STYLING_BANNER_TEXT_COLOR }}>Settings</h1>
        </section>

        <section className="section-logout">
          {(!(currentUser === undefined) && !(currentUser === null)) && 
            <Box sx={{ width: '90%', typography: 'body1' }}>
              <p style={{color: config?.stylingConfig?.CONFIG_STYLING_LOGIN_TEXT_COLOR}}>{`You are currently logged in as: ${currentUser.email}`}</p>
              <br/>

              <Button onClick={handleLogout} color="primary" variant="contained" fullwidth >Logout</Button>  
              <br/>
              <br/>

              <TabContext value={tabName}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList variant="scrollable" onChange={handleTabChange} aria-label="lab API tabs example">
                    {config?.adminConfig?.CONFIG_ADMIN_DEFAULT_TAB_NAME_LIST.map((tab) => (
                      <Tab key={tab} label={tab} value={tab} />
                    ))}
                  </TabList>
                </Box>

                {config?.adminConfig?.CONFIG_ADMIN_DEFAULT_TAB_NAME_LIST.map((tab) => {
                  if (tab === "Stats") {
                    return (
                      <TabPanel key="Stats" value="Stats">
                        <div>
                          { config?.generalConfig?.CONFIG_GENERAL_HAS_REGISTRATION && 
                            <div style={{color: config?.stylingConfig?.CONFIG_STYLING_STATS_TEXT_COLOR}}>
                              <h2>Registration</h2>
                              {isMobile ? (
                                <>
                                  <p><strong>Total Anglers Registered:</strong></p>
                                  <p>{registrationStats.totalAnglers} ({registrationStats.checkedInAnglers} checked-in)</p>
                                  <p><strong>Total Registration Fees Collected:</strong></p>
                                  <p> {formatCurrency(registrationStats.totalRegistrationFees)}</p>
                                </>
                              ) : (
                                <>
                                  <p><strong>Total Anglers Registered:</strong> {registrationStats.totalAnglers} ({registrationStats.checkedInAnglers} checked-in)</p>
                                  <p><strong>Total Registration Fees Collected:</strong> {formatCurrency(registrationStats.totalRegistrationFees)}</p>
                                  <p><strong>Total Sponsors Registered Online:</strong> {sponsorStats.totalSponsors}</p>
                                  <p><strong>Total Sponsor Online Donations:</strong> {formatCurrency(sponsorStats.totalSponsorDonations)}</p>
                                </>
                              )}
                              <br/>
                            </div>
                          }

                          {config?.generalConfig?.CONFIG_GENERAL_HAS_NEWSFEED &&
                            <div style={{color: config?.stylingConfig?.CONFIG_STYLING_STATS_TEXT_COLOR}}>
                              <h2>Catches</h2>
                              {console.log("Rendering catchesStats:", catchesStats)}
                              {isMobile ? (
                                <>
                                  <p><strong>Total Fish Caught:</strong></p>
                                  <p>{catchesStats.totalFish}</p>
                                  {catchesStats.divisionStats && Object.keys(catchesStats.divisionStats).map(division => (
                                    <div key={division}>
                                      <p>({catchesStats.divisionStats[division]} {division})</p>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <p>
                                    <strong>Total Fish Caught:</strong> {catchesStats.totalFish}
                                    {catchesStats.divisionStats && (
                                      <> (
                                        {Object.keys(catchesStats.divisionStats).map((division, index, array) => (
                                          <span key={division}>
                                            {catchesStats.divisionStats[division]} {division}
                                            {index < array.length - 1 && ', '}
                                          </span>
                                        ))}
                                        )
                                      </>
                                    )}
                                  </p>
                                </>
                              )}
                              <br />
                            </div>
                          }

                          {config?.generalConfig?.CONFIG_GENERAL_HAS_POTS && (
                            <div style={{color: config?.stylingConfig?.CONFIG_STYLING_STATS_TEXT_COLOR}}>
                              <h2>Pots</h2>
                              {isMobile ? (
                                <>
                                  <p><strong>Total Gross Pot:</strong></p>
                                  <p>-----</p>
                                  <p>{formatCurrency(potStats.totalPotSize)}</p>
                                  {Object.keys(potStats.boardTotals).map(board => (
                                    <p key={board}><strong>{board} Board Gross Total:</strong> {formatCurrency(potStats.boardTotals[board])}</p>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <p><strong>Total Gross Pot:</strong> {formatCurrency(potStats.totalPotSize)}</p>
                                  <p>-----</p>
                                  {Object.keys(potStats.boardTotals).map(board => (
                                    <p key={board}><strong>{board} Board Gross Total:</strong> {formatCurrency(potStats.boardTotals[board])}</p>
                                  ))}
                                </>
                              )}
                              <br />
                            </div>
                          )}

                        </div>
                      </TabPanel>
                    );
                  } else if (tab === "Reports") {
                    return (
                      <TabPanel key="Reports" value="Reports">
                        <div>

                          {config?.generalConfig?.CONFIG_GENERAL_HAS_REGISTRATION && (
                            <div>
                              <Button
                                onClick={() => handleGenerateRegistrationReport(config?.generalConfig?.CONFIG_GENERAL_YEAR)}
                                color="primary"
                                variant="contained"
                                disabled={isRegistrationReportLoading} // Disable while loading
                              >
                                {isRegistrationReportLoading ? "Processing..." : "Download Check-In Form"}
                              </Button>
                              <br /><br />
                            </div>
                          )}

                          {config?.generalConfig?.CONFIG_GENERAL_HAS_LEADERBOARD && (
                            <div>
                              <Button
                                onClick={() => handleGenerateLeaderboardReport(config?.generalConfig?.CONFIG_GENERAL_YEAR)}
                                color="primary"
                                variant="contained"
                                disabled={isLeaderboardReportLoading}
                              >
                                {isLeaderboardReportLoading ? "Processing..." : "Download Leaderboard"}
                              </Button>
                              <br /><br />
                            </div>
                          )}

                          {config?.generalConfig?.CONFIG_GENERAL_HAS_POTS && (
                            <div>
                              <Button
                                onClick={() => handleGeneratePotsReport(config?.generalConfig?.CONFIG_GENERAL_YEAR)}
                                color="primary"
                                variant="contained"
                                disabled={isPotsReportLoading}
                              >
                                {isPotsReportLoading ? "Processing..." : "Download Pot Standings"}
                              </Button>
                              <br /><br />
                            </div>
                          )}

                          <div>
                            <Button
                              onClick={() => handleGeneratePressReport(config?.generalConfig?.CONFIG_GENERAL_YEAR)}
                              color="secondary"
                              variant="contained"
                              disabled={isPressReportLoading}
                            >
                              {isPressReportLoading ? "Processing..." : "Download Press Report (End-of-Day)"}
                            </Button>
                            <br /><br />
                          </div>

                          <div>
                            <Button
                              onClick={() => handleGenerateAnnouncerReport(config?.generalConfig?.CONFIG_GENERAL_YEAR)}
                              color="secondary"
                              variant="contained"
                              disabled={isAnnouncerReportLoading}
                            >
                              {isAnnouncerReportLoading ? "Processing..." : "Download Announcer Report (End-of-Tournament)"}
                            </Button>
                            <br /><br />
                          </div>

                        </div>
                      </TabPanel>
                    );
                  } else if (tab === "Pot Winners") {
                    return (
                      <PotWinnersTab
                        key="Pot Winners"
                        year={year}
                        apiUrl={apiUrl}
                        config={config}
                        matches={matches}
                      />
                    );
                  } else if (tab === "Champions") {
                    return (
                      <ChampionsTab
                        key="Champions"
                        year={year}
                        apiUrl={apiUrl}
                        config={config}
                        matches={matches}
                      />
                    );
                  } else if (tab === "Records") {
                    return (
                      <RecordsTab
                        key="Records"
                        year={year}
                        apiUrl={apiUrl}
                        config={config}
                      />
                    );
                  } else if (tab === "Anglers") {
                    return (
                      <TabPanel key={tab} value={tab}>
                        {!anglerRowsHaveLoaded ? (
                          <CircularProgress />
                        ) : (
                          <div style={style}> 
                            <CrudTable
                              // dates
                              today={today}
                              startDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_START_DATE_STRING}
                              endDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_END_DATE_STRING}

                              // registration data
                              tableName={config?.generalConfig?.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME}
                              isEarlyBird={isEarlyBird}
                              earlyBirdData={earlyBird}
                              normalData={normalFee}

                              // table styling
                              tableType={tab}
                              buttonLabel={`Add ${tab}`}
                              tableProperties={tableProperties}
                              style={style}
                              rows={anglerRows || []}
                              scroll={matches ? desktopScroll : mobileScroll}
                              initialState={initialState}
                              pageSizeOptions={pageSizeOptions}
                              checkboxSelection={true}

                              // add
                              addStatus={isAddAnglerModalOpen}
                              openAddModal={openAddAnglerModal}
                              closeAddModal={closeAddAnglerModal}

                              // edit
                              editStatus={isEditAnglerModalOpen}
                              editInfo={editAnglerInfo}
                              setEditInfo={setEditAnglerInfo}
                              openEditModal={openEditAnglerModal}
                              closeEditModal={closeEditAnglerModal}

                              // delete
                              deleteStatus={isDeleteAnglerModalOpen}
                              deleteInfo={deleteAnglerInfo}
                              setDeleteInfo={setDeleteAnglerInfo}
                              openDeleteModal={openDeleteAnglerModal}
                              closeDeleteModal={closeDeleteAnglerModal}
                            />
                          </div>
                        )}
                      </TabPanel>
                    );
                  } else if (tab === "Sponsors") {
                    return (
                      <TabPanel key={tab} value={tab}>
                        {!sponsorRowsHaveLoaded ? (
                          <CircularProgress />
                        ) : (
                          <div style={style}> 
                            <CrudTable
                              // dates
                              today={today}
                              startDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_START_DATE_STRING}
                              endDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_END_DATE_STRING}

                              // sponsor config
                              tableName={config?.generalConfig?.CONFIG_GENERAL_FIREBASE_SPONSORS_TABLE_NAME}

                              // table styling
                              tableType={tab}
                              buttonLabel={`Add ${tab}`}
                              tableProperties={tableProperties}
                              style={style}
                              rows={sponsorRows || []}
                              scroll={matches ? desktopScroll : mobileScroll}
                              initialState={initialState}
                              pageSizeOptions={pageSizeOptions}
                              checkboxSelection={true}

                              // add
                              addStatus={isAddSponsorModalOpen}
                              openAddModal={openAddSponsorModal}
                              closeAddModal={closeAddSponsorModal}

                              // edit
                              editStatus={isEditSponsorModalOpen}
                              editInfo={editSponsorInfo}
                              setEditInfo={setEditSponsorInfo}
                              openEditModal={openEditSponsorModal}
                              closeEditModal={closeEditSponsorModal}

                              // delete
                              deleteStatus={isDeleteSponsorModalOpen}
                              deleteInfo={deleteSponsorInfo}
                              setDeleteInfo={setDeleteSponsorInfo}
                              openDeleteModal={openDeleteSponsorModal}
                              closeDeleteModal={closeDeleteSponsorModal}
                            />
                          </div>
                        )}
                      </TabPanel>
                    );
                  } else if (tab === "Catches") {
                    return (
                      <TabPanel key={tab} value={tab}>
                        {!catchRowsHaveLoaded ? (
                          <CircularProgress />
                        ) : (
                          <div style={style}> 
                            <CrudTable
                              // dates
                              today={today}
                              startDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_START_DATE_STRING}
                              endDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_END_DATE_STRING}

                              // sponsor config
                              tableName={config?.generalConfig?.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME}

                              // table styling
                              tableType={tab}
                              buttonLabel={`Add ${tab}`}
                              tableProperties={tableProperties}
                              style={style}
                              rows={catchRows || []}
                              scroll={matches ? desktopScroll : mobileScroll}
                              initialState={initialState}
                              pageSizeOptions={pageSizeOptions}
                              checkboxSelection={true}

                              // add
                              addStatus={isAddCatchModalOpen}
                              openAddModal={openAddCatchModal}
                              closeAddModal={closeAddCatchModal}

                              // edit
                              editStatus={isEditCatchModalOpen}
                              editInfo={editCatchInfo}
                              setEditInfo={setEditCatchInfo}
                              openEditModal={openEditCatchModal}
                              closeEditModal={closeEditCatchModal}

                              // delete
                              deleteStatus={isDeleteCatchModalOpen}
                              deleteInfo={deleteCatchInfo}
                              setDeleteInfo={setDeleteCatchInfo}
                              openDeleteModal={openDeleteCatchModal}
                              closeDeleteModal={closeDeleteCatchModal}
                            />
                          </div>
                        )}
                      </TabPanel>
                    );
                  } else if (tab === "Announcements") {
                    return (
                      <TabPanel key={tab} value={tab}>
                        {!announcementRowsHaveLoaded ? (
                          <CircularProgress />
                        ) : (
                          <div style={style}> 
                            <CrudTable
                              // dates
                              today={today}
                              startDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_START_DATE_STRING}
                              endDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_END_DATE_STRING}

                              // sponsor config
                              tableName={config?.generalConfig?.CONFIG_GENERAL_FIREBASE_ANNOUNCEMENTS_TABLE_NAME}

                              // table styling
                              tableType={tab}
                              buttonLabel={`Add ${tab}`}
                              tableProperties={tableProperties}
                              style={style}
                              rows={announcementRows || []}
                              scroll={matches ? desktopScroll : mobileScroll}
                              initialState={initialState}
                              pageSizeOptions={pageSizeOptions}
                              checkboxSelection={true}

                              // add
                              addStatus={isAddAnnouncementModalOpen}
                              openAddModal={openAddAnnouncementModal}
                              closeAddModal={closeAddAnnouncementModal}

                              // edit
                              editStatus={isEditAnnouncementModalOpen}
                              editInfo={editAnnouncementInfo}
                              setEditInfo={setEditAnnouncementInfo}
                              openEditModal={openEditAnnouncementModal}
                              closeEditModal={closeEditAnnouncementModal}

                              // delete
                              deleteStatus={isDeleteAnnouncementModalOpen}
                              deleteInfo={deleteAnnouncementInfo}
                              setDeleteInfo={setDeleteAnnouncementInfo}
                              openDeleteModal={openDeleteAnnouncementModal}
                              closeDeleteModal={closeDeleteAnnouncementModal}
                            />
                          </div>
                        )}
                      </TabPanel>
                    );
                  } else if (tab === "Pots") {
                    return (
                      <TabPanel key={tab} value={tab}>
                        {!potRowsHaveLoaded ? (
                          <CircularProgress />
                        ) : (
                          <div style={style}> 
                            <CrudTable
                              // dates
                              today={today}
                              startDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_START_DATE_STRING}
                              endDate={config?.adminConfig?.CONFIG_ADMIN_TOURNAMENT_END_DATE_STRING}

                              // sponsor config
                              tableName={config?.generalConfig?.CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME}

                              // table styling
                              tableType={tab}
                              buttonLabel={`Add ${tab}`}
                              tableProperties={tableProperties}
                              style={style}
                              rows={potRows || []}
                              scroll={matches ? desktopScroll : mobileScroll}
                              initialState={initialState}
                              pageSizeOptions={pageSizeOptions}
                              checkboxSelection={true}

                              // add
                              addStatus={isAddPotModalOpen}
                              openAddModal={openAddPotModal}
                              closeAddModal={closeAddPotModal}

                              // edit
                              editStatus={isEditPotModalOpen}
                              editInfo={editPotInfo}
                              setEditInfo={setEditPotInfo}
                              openEditModal={openEditPotModal}
                              closeEditModal={closeEditPotModal}

                              // delete
                              deleteStatus={isDeletePotModalOpen}
                              deleteInfo={deletePotInfo}
                              setDeleteInfo={setDeletePotInfo}
                              openDeleteModal={openDeletePotModal}
                              closeDeleteModal={closeDeletePotModal}
                            />
                          </div>
                        )}
                      </TabPanel>
                    );
                  }

                })}

              </TabContext>

            </Box> 
          }
          {(currentUser === undefined || currentUser === null) && <Login handleLogin={handleLogin} handleLogout={handleLogout} />}     
        </section>

        <Footer/>
      </main>
    </AnimatedPage>
  );
}

/**
 * PotWinnersTab — admin-only view of pot winner results.
 * Two sub-views: "By Category" (each pot's winners) and "By Team" (total winnings per team/angler).
 * Hidden from the public pots page until CONFIG_POTS_SHOW_WINNERS_PUBLICLY is set to true
 * in the year's potsConfig.js (then redeploy).
 */
function PotWinnersTab({ year, apiUrl, config, matches }) {
  const [results, setResults] = useState([]);
  const [allPotDocs, setAllPotDocs] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [subTab, setSubTab] = useState('byCategory');

  useEffect(() => {
    if (!apiUrl || !config || loaded) return;

    const {
      generalConfig: {
        CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
        CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME,
      },
      potsConfig: { CONFIG_POTS_CATEGORIES },
    } = config;

    const queries = CONFIG_POTS_CATEGORIES.map(item => {
      const bodyData = {
        catchYear: CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
        potYear: CONFIG_GENERAL_FIREBASE_POTS_TABLE_NAME,
        isReport: false,
        title: item.title,
        subtitle: item.subtitle || '',
        potName: item.potName,
        entryAmount: item.entryAmount,
        tournamentCut: item.tournamentCut,
        payoutStructure: item.payoutStructure,
        numPlaces: Object.keys(item.payoutStructure).length,
        ...(item.inputs ? item.inputs.reduce((acc, inp) => ({ ...acc, ...inp }), {}) : {}),
      };
      return {
        title: item.title,
        subtitle: item.subtitle || '',
        url: item.url,
        entryAmount: item.entryAmount,
        tournamentCut: item.tournamentCut,
        body: JSON.stringify(bodyData),
        desktopColumns: item.desktopColumns,
        mobileColumns: item.mobileColumns,
      };
    });

    const winnerPromises = queries.map(q =>
      fetch(`${apiUrl}/api/${year}/${q.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: q.body,
      })
        .then(r => r.json())
        .then(data => {
          const rows = Array.isArray(data)
            ? data.map((row, i) => ({ ...row, id: i }))
            : Object.values(data).map((row, i) => ({ ...row, id: i }));
          return { title: q.title, subtitle: q.subtitle, rows, url: q.url, entryAmount: q.entryAmount, tournamentCut: q.tournamentCut, desktopColumns: q.desktopColumns, mobileColumns: q.mobileColumns };
        })
        .catch(() => ({ title: q.title, subtitle: q.subtitle, rows: [], url: q.url, entryAmount: q.entryAmount, tournamentCut: q.tournamentCut, desktopColumns: q.desktopColumns, mobileColumns: q.mobileColumns }))
    );

    const potDocsPromise = fetch(`${apiUrl}/api/${year}/get_all_pot_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(d => d.data || [])
      .catch(() => []);

    Promise.all([Promise.all(winnerPromises), potDocsPromise]).then(([res, potDocs]) => {
      setResults(res);
      setAllPotDocs(potDocs);
      setLoaded(true);
    });
  }, [apiUrl, config, year, loaded]);

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n || 0);

  // Financial summary — uses raw pot docs for true entrant counts (includes pots with no catches)
  const financials = React.useMemo(() => {
    if (!loaded || !allPotDocs) return null;

    // Build per-pot entrant count from all pot documents
    const norm = (s) => (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
    const potEntrantCounts = {};
    allPotDocs.forEach(doc => {
      let boardSelections;
      try {
        boardSelections = typeof doc.boardSelections === 'string'
          ? JSON.parse(doc.boardSelections)
          : (Array.isArray(doc.boardSelections) ? doc.boardSelections : []);
      } catch { boardSelections = []; }
      boardSelections.forEach(board => {
        if (Array.isArray(board.potList)) {
          board.potList.forEach(pot => {
            const key = norm(pot);
            potEntrantCounts[key] = (potEntrantCounts[key] || 0) + 1;
          });
        }
      });
    });

    const boards = { 'Catch & Release': { gross: 0, cut: 0, net: 0, entries: 0 }, 'Offshore': { gross: 0, cut: 0, net: 0, entries: 0 }, 'Bay/Surf': { gross: 0, cut: 0, net: 0, entries: 0 } };
    const cats = config.potsConfig.CONFIG_POTS_CATEGORIES.map(item => {
      const entrantCount = potEntrantCounts[norm(item.potName)] || 0;
      const gross = entrantCount * (item.entryAmount || 0);
      const cut = gross * (item.tournamentCut || 0);
      const net = gross - cut;
      const board = item.url?.includes('catch_and_release') ? 'Catch & Release' : item.url?.includes('offshore') ? 'Offshore' : 'Bay/Surf';
      const resultMatch = results.find(r => r.title === item.title);
      const winner = resultMatch?.rows.find(row => (row.payout || 0) > 0);
      const winnerName = winner ? (winner.angler || winner.team || '—') : (entrantCount > 0 ? 'No winner yet' : '—');
      const winnerPayout = winner?.payout || 0;
      if (boards[board]) { boards[board].gross += gross; boards[board].cut += cut; boards[board].net += net; boards[board].entries += entrantCount; }
      return { title: item.title, board, entrantCount, gross, cut, net, winnerName, winnerPayout };
    });
    const totalGross = cats.reduce((s, c) => s + c.gross, 0);
    const totalCut = cats.reduce((s, c) => s + c.cut, 0);
    const totalNet = cats.reduce((s, c) => s + c.net, 0);
    return { boards, cats, totalGross, totalCut, totalNet };
  }, [loaded, allPotDocs, results, config]);

  // By-team summary
  const teamSummary = React.useMemo(() => {
    if (!loaded) return [];
    const teamMap = {};
    results.forEach(category => {
      category.rows.forEach(row => {
        const name = row.angler || row.team || 'Unknown';
        if (!teamMap[name]) teamMap[name] = { name, totalPayout: 0, wins: [] };
        teamMap[name].totalPayout += row.payout || 0;
        if (row.payout > 0) {
          const place = row.place === 1 ? '1st' : row.place === 2 ? '2nd' : `${row.place}th`;
          teamMap[name].wins.push(`${category.title} — ${place} (${fmt(row.payout)})`);
        }
      });
    });
    return Object.values(teamMap).filter(t => t.totalPayout > 0).sort((a, b) => b.totalPayout - a.totalPayout).map((t, i) => ({ ...t, id: i }));
  }, [loaded, results]);

  const teamColumns = [
    { field: 'name', headerName: 'Angler / Team', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left' },
    { field: 'totalPayout', headerName: 'Total Payout', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
      valueFormatter: (value) => fmt(value) },
    { field: 'wins', headerName: 'Pot Wins', flex: 4, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'left',
      valueFormatter: (value) => Array.isArray(value) ? value.join(' | ') : '' },
  ];

  const statCell = { p: 1.5, textAlign: 'center', minWidth: 110 };
  const statLabel = { fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.25 };
  const statValue = { fontWeight: 'bold', fontSize: '1.05rem' };

  return (
    <TabPanel key="Pot Winners" value="Pot Winners">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Pot winner standings are visible here only. To publish them on the public pots page,
        set <code>CONFIG_POTS_SHOW_WINNERS_PUBLICLY: true</code> in the year's potsConfig.js and redeploy.
      </Typography>

      {!loaded && <CircularProgress />}

      {/* Financial Summary */}
      {loaded && financials && (
        <Box sx={{ mb: 3 }}>
          {/* Grand totals row */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Gross Collected', value: fmt(financials.totalGross), color: '#02133E' },
              { label: 'Tournament Cut', value: fmt(financials.totalCut), color: '#b45309' },
              { label: 'Total Net Payout', value: fmt(financials.totalNet), color: '#166534' },
            ].map(s => (
              <Box key={s.label} sx={{ flex: 1, minWidth: 160, bgcolor: s.color, borderRadius: 1.5, p: 1.5, color: '#fff', textAlign: 'center' }}>
                <Box sx={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Box>
                <Box sx={{ fontWeight: 'bold', fontSize: '1.3rem', mt: 0.25 }}>{s.value}</Box>
              </Box>
            ))}
          </Box>

          {/* Board-by-board breakdown */}
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden', mb: 1.5 }}>
            <Box sx={{ bgcolor: '#02133E', color: '#fff', px: 2, py: 0.75, fontWeight: 'bold', fontSize: '0.85rem' }}>By Board</Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(4, 1fr)', bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
              {['Board', 'Entries', 'Gross', 'Tournament Cut', 'Net Payout'].map(h => (
                <Box key={h} sx={{ ...statCell, ...statLabel, fontWeight: 'bold', color: '#333' }}>{h}</Box>
              ))}
            </Box>
            {Object.entries(financials.boards).map(([board, b]) => (
              <Box key={board} sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(4, 1fr)', borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 0 } }}>
                <Box sx={{ ...statCell, fontWeight: 'bold', textAlign: 'left', fontSize: '0.85rem' }}>{board}</Box>
                <Box sx={{ ...statCell }}>{b.entries}</Box>
                <Box sx={{ ...statCell }}>{fmt(b.gross)}</Box>
                <Box sx={{ ...statCell, color: '#b45309' }}>{fmt(b.cut)}</Box>
                <Box sx={{ ...statCell, color: '#166534', fontWeight: 'bold' }}>{fmt(b.net)}</Box>
              </Box>
            ))}
          </Box>

          {/* Category-level breakdown table */}
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ bgcolor: '#02133E', color: '#fff', px: 2, py: 0.75, fontWeight: 'bold', fontSize: '0.85rem' }}>By Category</Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr', bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
              {['Pot', 'Entries', 'Gross', 'Cut', 'Net', 'Winner'].map(h => (
                <Box key={h} sx={{ ...statCell, ...statLabel, fontWeight: 'bold', color: '#333' }}>{h}</Box>
              ))}
            </Box>
            {financials.cats.filter(c => c.entrantCount > 0).map(c => (
              <Box key={c.title} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr', borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 0 }, '&:hover': { bgcolor: '#fafafa' } }}>
                <Box sx={{ ...statCell, textAlign: 'left', fontSize: '0.8rem', fontWeight: 500 }}>{c.title}</Box>
                <Box sx={{ ...statCell, fontSize: '0.85rem' }}>{c.entrantCount}</Box>
                <Box sx={{ ...statCell, fontSize: '0.85rem' }}>{fmt(c.gross)}</Box>
                <Box sx={{ ...statCell, fontSize: '0.85rem', color: '#b45309' }}>{fmt(c.cut)}</Box>
                <Box sx={{ ...statCell, fontSize: '0.85rem', color: '#166534', fontWeight: 'bold' }}>{fmt(c.net)}</Box>
                <Box sx={{ ...statCell, fontSize: '0.8rem', textAlign: 'left' }}>{c.winnerName !== '—' ? `${c.winnerName} (${fmt(c.winnerPayout)})` : '—'}</Box>
              </Box>
            ))}
            {financials.cats.every(c => c.entrantCount === 0) && (
              <Box sx={{ p: 2, color: 'text.secondary', fontSize: '0.85rem' }}>No pot entries found.</Box>
            )}
          </Box>
        </Box>
      )}

      {/* Sub-tab toggle */}
      {loaded && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant={subTab === 'byCategory' ? 'contained' : 'outlined'} size="small" onClick={() => setSubTab('byCategory')}>By Category</Button>
          <Button variant={subTab === 'byTeam' ? 'contained' : 'outlined'} size="small" onClick={() => setSubTab('byTeam')}>By Team / Angler</Button>
        </Box>
      )}

      {loaded && subTab === 'byCategory' && (
        <>
          {results.map(result => (
            result.rows.length > 0 ? (
              <Box key={result.title} sx={{ mb: 1 }}>
                <PotsResultTable
                  style={{ width: '100%' }}
                  title={`${result.title}${result.rows[0]?.entrantCount != null ? ` — ${result.rows[0].entrantCount} entrant${result.rows[0].entrantCount !== 1 ? 's' : ''}` : ''}`}
                  subtitle={result.subtitle}
                  rows={result.rows}
                  columns={matches ? result.desktopColumns : result.mobileColumns}
                  density="compact"
                />
              </Box>
            ) : null
          ))}
          {results.every(r => r.rows.length === 0) && (
            <Typography variant="body2" color="text.secondary">No pot results yet — catches need to be recorded first.</Typography>
          )}
        </>
      )}

      {loaded && subTab === 'byTeam' && (
        <>
          {teamSummary.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No pot payouts calculated yet.</Typography>
          ) : (
            <PotsResultTable style={{ width: '100%' }} title="Total Pot Winnings by Angler / Team" subtitle="" rows={teamSummary} columns={teamColumns} density="compact" />
          )}
        </>
      )}
    </TabPanel>
  );
}

/**
 * ChampionsTab — admin-only view of champion category standings (categories with display: false).
 * These are hidden from the public leaderboard until CONFIG_LEADERBOARD_SHOW_CHAMPIONS_PUBLICLY
 * is set to true in the year's leaderboardConfig.js (then redeploy).
 */
function ChampionsTab({ year, apiUrl, config, matches }) {
  const [results, setResults] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!apiUrl || !config || loaded) return;

    const {
      generalConfig: { CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME, CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME },
      leaderboardConfig: { CONFIG_LEADERBOARD_CATEGORIES },
    } = config;

    // Champion categories are those explicitly marked display: false
    const championCategories = CONFIG_LEADERBOARD_CATEGORIES.filter(item => item.display === false);

    const queries = championCategories.map(item => {
      const bodyData = {
        catchYear: CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
        anglerYear: CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
        numPlaces: item.numPlaces,
        isReport: false,
        ...(item.inputs ? item.inputs.reduce((acc, inp) => ({ ...acc, ...inp }), {}) : {}),
      };
      return {
        title: item.title,
        subtitle: item.subtitle || '',
        url: item.url,
        body: JSON.stringify(bodyData),
        desktopColumns: item.desktopColumns,
        mobileColumns: item.mobileColumns,
      };
    });

    Promise.all(
      queries.map(q =>
        fetch(`${apiUrl}/api/${year}/${q.url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: q.body,
        })
          .then(r => r.json())
          .then(data => {
            const rows = Object.keys(data).map((k, i) => ({ ...data[k], id: i, catchId: k }));
            return { title: q.title, subtitle: q.subtitle, rows, desktopColumns: q.desktopColumns, mobileColumns: q.mobileColumns };
          })
          .catch(() => ({ title: q.title, subtitle: q.subtitle, rows: [], desktopColumns: q.desktopColumns, mobileColumns: q.mobileColumns }))
      )
    ).then(res => {
      setResults(res);
      setLoaded(true);
    });
  }, [apiUrl, config, year, loaded]);

  return (
    <TabPanel key="Champions" value="Champions">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Champion standings are visible here only. To publish them on the public leaderboard after the tournament,
        set <code>CONFIG_LEADERBOARD_SHOW_CHAMPIONS_PUBLICLY: true</code> in the year's leaderboardConfig.js and redeploy.
      </Typography>
      {!loaded && <CircularProgress />}
      {loaded && results.map(result => (
        result.rows.length > 0 ? (
          <LeaderboardResultTable
            key={result.title}
            style={{ width: '100%' }}
            title={result.title}
            subtitle={result.subtitle}
            rows={result.rows}
            columns={matches ? result.desktopColumns : result.mobileColumns}
            density="compact"
          />
        ) : (
          <Typography key={result.title} variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {result.title}: No results yet.
          </Typography>
        )
      ))}
    </TabPanel>
  );
}

/**
 * RecordsTab — admin view of DSR species record weights per year.
 * Records are stored in Firebase (speciesRecords/{year}) and used for tiebreaker calculations.
 * On first load, falls back to config defaults; after saving, Firebase values take over.
 */
function RecordsTab({ year, apiUrl, config }) {
  const [records, setRecords] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Derive species list + config defaults from the Top Woman Angler leaderboard category
  const twaCategory = config?.leaderboardConfig?.CONFIG_LEADERBOARD_CATEGORIES?.find(
    c => c.url === 'get_deepsea_roundup_top_woman_angler'
  );
  const inputs = twaCategory?.inputs?.reduce((acc, inp) => ({ ...acc, ...inp }), {}) || {};
  const configDefaults = inputs.historicalRecordCatchData || {};
  const billfishSpecies = inputs.billfishSpeciesList || [];
  const meatfishSpecies = inputs.meatfishSpeciesList || [];

  // Bay/Surf-only species (same mapping used in leaderboard controller)
  const baySurfOnlySpecies = new Set(['Black Drum', 'Flounder', 'Gafftop', 'Pompano', 'Redfish', 'Speckled Trout']);
  const offshoreMeatfish = meatfishSpecies.filter(s => !baySurfOnlySpecies.has(s));
  const baySurfMeatfish = meatfishSpecies.filter(s => baySurfOnlySpecies.has(s));

  useEffect(() => {
    if (!apiUrl || loaded) return;
    fetch(`${apiUrl}/api/${year}/get_species_records`)
      .then(r => r.json())
      .then(data => {
        // Merge config defaults with Firebase values (Firebase takes precedence)
        setRecords({ ...configDefaults, ...data });
        setLoaded(true);
      })
      .catch(() => {
        setRecords({ ...configDefaults });
        setLoaded(true);
      });
  }, [apiUrl, year, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (species, value) => {
    setRecords(prev => ({ ...prev, [species]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    // Convert all values to numbers before saving
    const toSave = {};
    for (const [species, val] of Object.entries(records)) {
      const w = parseFloat(val);
      if (!isNaN(w)) toSave[species] = w;
    }
    fetch(`${apiUrl}/api/${year}/set_species_records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSave),
    })
      .then(r => r.json())
      .then(() => {
        toast.success('Species records saved!');
        setSaving(false);
      })
      .catch(() => {
        toast.error('Error saving records.');
        setSaving(false);
      });
  };

  const sectionStyle = { mb: 3 };
  const rowStyle = { display: 'grid', gridTemplateColumns: '220px 120px 40px', alignItems: 'center', gap: 1, mb: 1 };

  const renderSpeciesRows = (speciesList) =>
    speciesList.map(species => (
      <Box key={species} sx={rowStyle}>
        <Typography variant="body2">{species}</Typography>
        <TextField
          type="number"
          size="small"
          inputProps={{ step: '0.1', min: '0' }}
          value={records[species] ?? ''}
          onChange={e => handleChange(species, e.target.value)}
        />
        <Typography variant="body2" color="text.secondary">lbs</Typography>
      </Box>
    ));

  return (
    <TabPanel key="Records" value="Records">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        DSR tournament species records for <strong>{year}</strong>. These are used for tiebreaker calculations
        in the Offshore Grand Champion and Top Woman Angler standings. Update whenever a record is broken
        during the tournament — changes take effect within 60 seconds (cache TTL).
      </Typography>

      {!loaded ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={sectionStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Billfish / Tarpon (Release)</Typography>
            {renderSpeciesRows(billfishSpecies)}
          </Box>

          <Box sx={sectionStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Offshore Meatfish</Typography>
            {renderSpeciesRows(offshoreMeatfish)}
          </Box>

          <Box sx={sectionStyle}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Bay/Surf Species</Typography>
            {renderSpeciesRows(baySurfMeatfish)}
          </Box>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ mt: 1 }}
          >
            {saving ? 'Saving...' : `Save ${year} Records`}
          </Button>
        </>
      )}
    </TabPanel>
  );
}

export default AdminPage;

