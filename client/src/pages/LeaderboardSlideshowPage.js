import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import Carousel from '../components/Carousel';
import './BasePage.css';

import { loadConfigForYear } from '../config/masterConfig';

dayjs.extend(advancedFormat);

// Standalone, chrome-light slideshow view of the leaderboard -- meant to be pointed a
// monitor with the browser's own auto-page-refresh set up on it. Always shows the
// carousel (no List/Select toggle), so a full page reload can never leave it stuck on
// a different view the way the main LeaderboardPage's "List" default would.
function LeaderboardSlideshowPage() {
  const { year } = useParams();
  const [timestamp, setTimestamp] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [tournamentHasStarted, setTournamentHasStarted] = useState(false);
  const [resultArray, setResultArray] = useState([]);
  const [isPreliminaryResults, setIsPreliminaryResults] = useState(true);
  const [allDataIsFetched, setAllDataIsFetched] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchConfigAndData();
  }, [year]);

  const fetchConfigAndData = async () => {
    try {
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig);

      const {
        generalConfig: {
          CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
          CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
        },
        leaderboardConfig: {
          CONFIG_LEADERBOARD_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER,
          CONFIG_LEADERBOARD_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS,
          CONFIG_LEADERBOARD_CATEGORIES,
          CONFIG_LEADERBOARD_SHOW_CHAMPIONS_PUBLICLY,
        }
      } = loadedConfig;

      const apiUrl = import.meta.env.VITE_NODE_ENV === "production"
        ? import.meta.env.VITE_SERVER_URL_PRODUCTION
        : import.meta.env.VITE_SERVER_URL_STAGING;

      if (CONFIG_LEADERBOARD_INCLUDE_PRELIMINARY_RESULTS_DISCLAIMER) {
        let now = dayjs().valueOf();
        setIsPreliminaryResults(parseInt(CONFIG_LEADERBOARD_PRELIMINARY_RESULTS_DISCLAIMER_CUTOFF_IN_LOCAL_TIME_IN_MS) > now);
        setTimestamp(generateTimestamp());
      } else {
        setIsPreliminaryResults(false);
      }

      // Champions (display: false) are hidden from the public leaderboard until CONFIG_LEADERBOARD_SHOW_CHAMPIONS_PUBLICLY is set to true.
      const publicCategories = CONFIG_LEADERBOARD_CATEGORIES.filter(
        item => item.display !== false || CONFIG_LEADERBOARD_SHOW_CHAMPIONS_PUBLICLY
      );

      const queries = publicCategories.map((item) => {
        let bodyData = {
          catchYear: CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
          anglerYear: CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
          numPlaces: item.numPlaces,
          isReport: false,
        };
        if (item.inputs && item.inputs.length > 0) {
          item.inputs.forEach(input => {
            Object.keys(input).forEach(param => {
              bodyData[param] = input[param];
            });
          });
        }
        return {
          title: item.title,
          subtitle: item.subtitle || "",
          numPlaces: item.numPlaces,
          url: item.url,
          body: JSON.stringify(bodyData),
          desktopColumns: item.desktopColumns,
          mobileColumns: item.mobileColumns,
        };
      });

      confirmTournamentStarted(apiUrl, loadedConfig);
      fetchData(apiUrl, queries, setResultArray);
      setHasLoaded(true);

    } catch (error) {
      console.error('Error loading config or fetching data:', error);
    }
  };

  const fetchData = async (apiUrl, queries, setResults) => {
    try {
      const res = await Promise.all(queries.map((query) => {
        return fetch(`${apiUrl}/api/${year}/${query.url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: query.body
        }).then(r => r.json()).then((result) => {
          var tempRows = [];
          Object.keys(result).map((catchKey, i) => {
            let tempObject = { ...result[catchKey], id: i, catchId: catchKey };
            tempRows.push(tempObject);
          });
          return {
            title: query.title,
            subtitle: query.subtitle,
            numPlaces: query.numPlaces,
            rows: tempRows,
            desktopColumns: query.desktopColumns,
            mobileColumns: query.mobileColumns
          };
        });
      }));

      setResults(res);
      setAllDataIsFetched(true);

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const confirmTournamentStarted = async (apiUrl, loadedConfig) => {
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
        setTournamentHasStarted(data.count !== 0);
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
    return `Preliminary leaderboard as of: ${timeString} on ${dateString}.`;
  };

  return (
    <AnimatedPage>
      <main>
        {config && (
          <section className="section-view">
            <Box sx={{ width: '95%', typography: 'body1' }}>
              {isPreliminaryResults && (
                <div>
                  <br/>
                  <h3 className="timestamp-text" style={{ color: config?.stylingConfig?.CONFIG_STYLING_LEADERBOARD_TIMESTAMP_TEXT_COLOR }}>
                    <em>{timestamp}</em>
                  </h3>
                </div>
              )}

              {!tournamentHasStarted && (
                <div>
                  <br />
                  <h2 style={{ color: config?.stylingConfig?.CONFIG_STYLING_H2_COLOR }}>
                    The {config?.generalConfig?.CONFIG_GENERAL_YEAR} tournament will begin soon!
                  </h2>
                </div>
              )}

              {!allDataIsFetched && (
                <>
                  <br/>
                  <h1 style={{color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR}}>
                    Loading, one moment please...
                  </h1>
                  <CircularProgress/>
                </>
              )}

              {tournamentHasStarted && (
                !hasLoaded ? (
                  <div><h1>Loading...</h1></div>
                ) : (
                  <div>
                    <br/>
                    <Carousel results={resultArray} />
                  </div>
                )
              )}
            </Box>
          </section>
        )}
      </main>
    </AnimatedPage>
  );
}

export default LeaderboardSlideshowPage;
