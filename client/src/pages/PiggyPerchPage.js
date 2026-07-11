import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import LeaderboardResultTable from '../components/tables/LeaderboardResultTable';
import './BasePage.css';

import { loadConfigForYear } from '../config/masterConfig';

// Piggy Perch (12-and-under) results are judge-registered by hand at the dock, not entered
// through the catch-logging flow, so there's no Firestore data for this division -- results
// are hardcoded here after the tournament instead.
const PIGGY_PERCH_COLUMNS_DESKTOP = [
  { field: 'category', headerName: 'Category', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
  { field: 'winner', headerName: 'Winner', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
  { field: 'result', headerName: 'Result', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
];

const PIGGY_PERCH_COLUMNS_MOBILE = [
  { field: 'category', headerName: 'Category', width: 150, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
  { field: 'winner', headerName: 'Winner', width: 180, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
  { field: 'result', headerName: 'Result', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center', isDateTime: false },
];

const PIGGY_PERCH_RESULTS_2026 = [
  {
    title: 'Girls Under 6',
    rows: [
      { id: 1, category: 'Most Fish', winner: 'Cambria Self', result: '24 fish' },
      { id: 2, category: 'Largest Fish', winner: 'Carson Blanchard', result: '7 1/8' },
      { id: 3, category: 'Smallest Fish', winner: 'Emberleigh Mathisen', result: '3 7/8' },
    ],
  },
  {
    title: 'Girls Over 6',
    rows: [
      { id: 1, category: 'Most Fish', winner: 'Harper Barton', result: '14 fish' },
      { id: 2, category: 'Largest Fish', winner: 'Reid Wallace', result: '8 3/4' },
      { id: 3, category: 'Smallest Fish', winner: 'Vivian Cianfarani', result: '3 3/4' },
    ],
  },
  {
    title: 'Boys Under 6',
    rows: [
      { id: 1, category: 'Most Fish', winner: 'Barrett Owens', result: '18 fish' },
      { id: 2, category: 'Largest Fish', winner: 'Matthieu Arceneaux', result: '8 1/4' },
      { id: 3, category: 'Smallest Fish', winner: 'Kyle McIntyre', result: '3 3/8' },
    ],
  },
  {
    title: 'Boys Over 6',
    rows: [
      { id: 1, category: 'Most Fish', winner: 'Ash Kiesel', result: '33 fish' },
      { id: 2, category: 'Largest Fish', winner: 'Cullen Self', result: '7' },
      { id: 3, category: 'Largest Fish', winner: 'Brennan Thompson', result: '7' },
      { id: 4, category: 'Smallest Fish', winner: 'Waylon McClellan', result: '3 1/4' },
    ],
  },
  {
    title: 'Sportsman',
    rows: [
      { id: 1, category: 'Sportsman Award', winner: 'Charles Zaludek', result: '—' },
    ],
  },
];

function PiggyPerchPage() {
  const { year } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig);
    };
    loadConfig();
  }, [year]);

  return (
    <AnimatedPage>
      <main>
        {config && (
          <>
            {/* BANNER */}
            <section style={{ backgroundColor: config?.stylingConfig?.CONFIG_STYLING_BANNER_BACKGROUND_COLOR }} className="section-banner">
              <h1 style={{ color: config?.stylingConfig?.CONFIG_STYLING_BANNER_TEXT_COLOR }}>Piggy Perch Results</h1>
            </section>

            <section className="section-view">
              <Box sx={{ width: '90%', typography: 'body1' }}>
                <br/>
                {PIGGY_PERCH_RESULTS_2026.map(division => (
                  <LeaderboardResultTable
                    key={division.title}
                    style={{ width: '100%' }}
                    title={division.title}
                    rows={division.rows}
                    columns={matches ? PIGGY_PERCH_COLUMNS_DESKTOP : PIGGY_PERCH_COLUMNS_MOBILE}
                    scroll={matches ? null : "scroll"}
                    density="compact"
                  />
                ))}
              </Box>
            </section>

            <Footer />
          </>
        )}
      </main>
    </AnimatedPage>
  );
}

export default PiggyPerchPage;
