import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { loadConfigForYear } from '../config/masterConfig';
import './BasePage.css';

// All-time tournament records.
// angler / boat / year: fill in as confirmed from tournament archives.
const RECORD_GROUPS = [
  {
    division: 'Offshore — Billfish (Release)',
    note: 'Scored by point value at time of release',
    records: [
      { species: 'Blue Marlin',   weight: 592,   year: null, angler: null, boat: null },
      { species: 'White Marlin',  weight: 85.3,  year: null, angler: null, boat: null },
      { species: 'Sailfish',      weight: 95,    year: null, angler: null, boat: null },
      { species: 'Tarpon',        weight: 88,    year: null, angler: null, boat: null },
    ],
  },
  {
    division: 'Offshore — Meatfish',
    note: 'Scored by weight (lbs)',
    records: [
      { species: 'Barracuda',                weight: 41.3,  year: null, angler: null, boat: null },
      { species: 'Blackfin Tuna',            weight: 39.5,  year: null, angler: null, boat: null },
      { species: 'Blacktip/Spinner Shark',   weight: 667.4, year: null, angler: null, boat: null },
      { species: 'Bonito (Little Tunny)',    weight: 16,    year: null, angler: null, boat: null },
      { species: 'Dolphin (Dorado Mahi)',    weight: 65.6,  year: null, angler: null, boat: null },
      { species: 'Jack Crevalle (Jackfish)', weight: 36,    year: null, angler: null, boat: null },
      { species: 'King Mackerel (Kingfish)', weight: 56.8,  year: null, angler: null, boat: null },
      { species: 'Ling (Cobia)',             weight: 80.1,  year: null, angler: null, boat: null },
      { species: 'Red Snapper',              weight: 25.9,  year: null, angler: null, boat: null },
      { species: 'Spanish Mackerel',         weight: 7,     year: null, angler: null, boat: null },
      { species: 'Swordfish',                weight: 250,   year: null, angler: null, boat: null },
      { species: 'Wahoo',                    weight: 92,    year: null, angler: null, boat: null },
      { species: 'Yellowfin Tuna',           weight: 137.6, year: null, angler: null, boat: null },
    ],
  },
  {
    division: 'Bay / Surf',
    note: 'Scored by weight (lbs)',
    records: [
      { species: 'Black Drum',            weight: 11.6, year: null, angler: null, boat: null },
      { species: 'Bonito (Little Tunny)', weight: 16.0, year: null, angler: null, boat: null },
      { species: 'Flounder',              weight: 5.4,  year: null, angler: null, boat: null },
      { species: 'Gafftop',               weight: 5.9,  year: null, angler: null, boat: null },
      { species: 'Pompano',               weight: 4.1,  year: null, angler: null, boat: null },
      { species: 'Redfish',               weight: 14.4, year: null, angler: null, boat: null },
      { species: 'Sheepshead',            weight: 9.5,  year: null, angler: null, boat: null },
      { species: 'Spanish Mackerel',      weight: 7.0,  year: null, angler: null, boat: null },
      { species: 'Speckled Trout',        weight: 8.3,  year: null, angler: null, boat: null },
    ],
  },
];

const dash = (v) => (v != null ? v : '—');

function RecordTable({ records, headerBg, headerText, cellText, oddRowBg, isMobile }) {
  const cellSx = { color: cellText, borderColor: 'divider', py: 1 };
  const headSx = { color: headerText, fontWeight: 'bold', py: 1, borderColor: 'rgba(255,255,255,0.2)' };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: headerBg }}>
            <TableCell sx={headSx}>Species</TableCell>
            <TableCell sx={headSx} align="center">Record (lbs)</TableCell>
            {!isMobile && <TableCell sx={headSx} align="center">Year Set</TableCell>}
            {!isMobile && <TableCell sx={headSx}>Angler</TableCell>}
            {!isMobile && <TableCell sx={headSx}>Boat</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((r, i) => (
            <TableRow
              key={r.species}
              sx={{ backgroundColor: i % 2 !== 0 ? oddRowBg : 'transparent' }}
            >
              <TableCell sx={{ ...cellSx, fontWeight: 500 }}>{r.species}</TableCell>
              <TableCell sx={cellSx} align="center">{r.weight != null ? r.weight : '—'}</TableCell>
              {!isMobile && <TableCell sx={cellSx} align="center">{dash(r.year)}</TableCell>}
              {!isMobile && <TableCell sx={cellSx}>{dash(r.angler)}</TableCell>}
              {!isMobile && <TableCell sx={cellSx}>{dash(r.boat)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HistoricalRecordsPage() {
  const { year } = useParams();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'));
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfigForYear(year).then(setConfig).catch(() => {});
  }, [year]);

  if (!config) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const { stylingConfig } = config;
  const headerBg   = stylingConfig.CONFIG_STYLING_TABLE_HEADER_BACKGROUND_COLOR || '#02133e';
  const headerText = stylingConfig.CONFIG_STYLING_TABLE_HEADER_TEXT_COLOR       || '#ffffff';
  const cellText   = stylingConfig.CONFIG_STYLING_TABLE_CELL_TEXT_COLOR         || '#222222';
  const oddRowBg   = stylingConfig.CONFIG_STYLING_TABLE_ODD_ROW_BACKGROUND_COLOR || '#f5f5f5';
  const bannerBg   = stylingConfig.CONFIG_STYLING_BANNER_BACKGROUND_COLOR        || '#02133e';
  const bannerText = stylingConfig.CONFIG_STYLING_BANNER_TEXT_COLOR              || '#ffffff';

  return (
    <AnimatedPage>
      <main>
        {/* Banner */}
        <section style={{ backgroundColor: bannerBg }} className="section-banner">
          <h1 style={{ color: bannerText }}>Tournament Records</h1>
        </section>

        {/* Content */}
        <section className="section-leaderboard">
          <Box sx={{ width: '90%', mx: 'auto', pb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: cellText, mb: 3, fontStyle: 'italic', textAlign: 'center' }}
            >
              All-time records for the Deep Sea Roundup · Port Aransas, Texas
            </Typography>

            {RECORD_GROUPS.map((group) => (
              <Paper key={group.division} elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                {/* Section header */}
                <Box sx={{ backgroundColor: headerBg, px: 3, py: 1.5 }}>
                  <Typography sx={{ color: headerText, fontWeight: 'bold', fontSize: '1.1rem', display: 'inline' }}>
                    {group.division}
                  </Typography>
                  {group.note && (
                    <Typography component="span" sx={{ color: headerText, fontSize: '0.85rem', opacity: 0.8, ml: 1.5, fontStyle: 'italic' }}>
                      ({group.note})
                    </Typography>
                  )}
                </Box>

                <RecordTable
                  records={group.records}
                  headerBg={headerBg}
                  headerText={headerText}
                  cellText={cellText}
                  oddRowBg={oddRowBg}
                  isMobile={isMobile}
                />
              </Paper>
            ))}

            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'gray', fontStyle: 'italic', textAlign: 'center' }}>
              Entries marked "—" are pending confirmation from tournament archives. Contact the tournament committee to update historical data.
            </Typography>
          </Box>
        </section>

        <Footer />
      </main>
    </AnimatedPage>
  );
}

export default HistoricalRecordsPage;
