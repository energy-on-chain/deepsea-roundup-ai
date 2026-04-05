import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimatedPage from './AnimatedPage';
import Footer from '../components/Footer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { loadConfigForYear } from '../config/masterConfig';

import './BasePage.css';

// Historical records data for the Deepsea Roundup
// FIXME: replace with actual all-time records (species, weight_lbs, length_in, year_set, angler_name, boat_name)
const HISTORICAL_RECORDS = [
  // Offshore — Billfish
  { id: 1, division: 'Offshore', type: 'Billfish', species: 'Blue Marlin', weight: 592, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 2, division: 'Offshore', type: 'Billfish', species: 'White Marlin', weight: 85.3, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 3, division: 'Offshore', type: 'Billfish', species: 'Sailfish', weight: 95, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 4, division: 'Offshore', type: 'Billfish', species: 'Tarpon', weight: 88, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  // Offshore — Meatfish
  { id: 5, division: 'Offshore', type: 'Meatfish', species: 'Barracuda', weight: 41.3, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 6, division: 'Offshore', type: 'Meatfish', species: 'Blackfin Tuna', weight: 39.5, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 7, division: 'Offshore', type: 'Meatfish', species: 'Bonito (Little Tunny)', weight: 16, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 8, division: 'Offshore', type: 'Meatfish', species: 'Dolphin (Dorado Mahi)', weight: 65.6, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 9, division: 'Offshore', type: 'Meatfish', species: 'Jack Crevalle (Jackfish)', weight: 36, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 10, division: 'Offshore', type: 'Meatfish', species: 'King Mackerel (Kingfish)', weight: 56.8, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 11, division: 'Offshore', type: 'Meatfish', species: 'Ling (Cobia)', weight: 80.1, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 12, division: 'Offshore', type: 'Meatfish', species: 'Blacktip/Spinner Shark', weight: 667.4, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 13, division: 'Offshore', type: 'Meatfish', species: 'Swordfish', weight: null, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 14, division: 'Offshore', type: 'Meatfish', species: 'Wahoo', weight: 92, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 15, division: 'Offshore', type: 'Meatfish', species: 'Spanish Mackerel', weight: 7, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 16, division: 'Offshore', type: 'Meatfish', species: 'Yellowfin Tuna', weight: 137.6, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 17, division: 'Offshore', type: 'Meatfish', species: 'Red Snapper', weight: 25.9, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  // Bay/Surf
  { id: 18, division: 'Bay/Surf', type: 'Meatfish', species: 'Black Drum', weight: 11.6, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 19, division: 'Bay/Surf', type: 'Meatfish', species: 'Flounder', weight: 5.4, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 20, division: 'Bay/Surf', type: 'Meatfish', species: 'Gafftop', weight: 5.9, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 21, division: 'Bay/Surf', type: 'Meatfish', species: 'Pompano', weight: 4.1, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 22, division: 'Bay/Surf', type: 'Meatfish', species: 'Redfish', weight: 14.4, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 23, division: 'Bay/Surf', type: 'Meatfish', species: 'Speckled Trout', weight: 8.3, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
  { id: 24, division: 'Bay/Surf', type: 'Meatfish', species: 'Spanish Mackerel', weight: 7.0, length: null, year: null, angler: 'FIXME', boat: 'FIXME' },
];

const COLUMNS = [
  { field: 'division', headerName: 'Division', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
  { field: 'type', headerName: 'Type', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
  { field: 'species', headerName: 'Species', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
  { field: 'weight', headerName: 'Record Weight (lbs)', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value != null ? params.value : '—' },
  { field: 'year', headerName: 'Year Set', flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value != null ? params.value : '—' },
  { field: 'angler', headerName: 'Angler', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value === 'FIXME' ? '—' : params.value },
  { field: 'boat', headerName: 'Boat', flex: 2, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value === 'FIXME' ? '—' : params.value },
];

const MOBILE_COLUMNS = [
  { field: 'species', headerName: 'Species', width: 180, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
  { field: 'weight', headerName: 'Record (lbs)', width: 120, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value != null ? params.value : '—' },
  { field: 'year', headerName: 'Year', width: 100, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value != null ? params.value : '—' },
  { field: 'angler', headerName: 'Angler', width: 160, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center',
    valueFormatter: (params) => params.value === 'FIXME' ? '—' : params.value },
];

function HistoricalRecordsPage() {
  const { year } = useParams();
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'));
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const cfg = await loadConfigForYear(year);
      setConfig(cfg);
      setLoading(false);
    };
    fetchConfig();
  }, [year]);

  if (loading || !config) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const { stylingConfig } = config;

  return (
    <AnimatedPage>
      <Box className="base-page-container">
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{ color: stylingConfig.CONFIG_STYLING_H2_COLOR, fontWeight: 'bold', mb: 1 }}
          >
            Tournament Historical Records
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: stylingConfig.CONFIG_STYLING_P_COLOR, mb: 3, fontStyle: 'italic' }}
          >
            All-time records for the Deepsea Roundup
          </Typography>

          <Box
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: stylingConfig.CONFIG_STYLING_TABLE_HEADER_BACKGROUND_COLOR,
                color: stylingConfig.CONFIG_STYLING_TABLE_HEADER_TEXT_COLOR,
              },
            }}
          >
            <DataGrid
              rows={HISTORICAL_RECORDS}
              columns={isMobile ? MOBILE_COLUMNS : COLUMNS}
              autoHeight
              disableRowSelectionOnClick
              hideFooter
              sx={{
                '& .MuiDataGrid-row:nth-of-type(odd)': {
                  backgroundColor: stylingConfig.CONFIG_STYLING_TABLE_ODD_ROW_BACKGROUND_COLOR,
                },
                '& .MuiDataGrid-cell': {
                  color: stylingConfig.CONFIG_STYLING_TABLE_CELL_TEXT_COLOR,
                },
              }}
            />
          </Box>

          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'gray', fontStyle: 'italic' }}>
            Note: Records marked with "—" are pending confirmation from tournament archives. Contact the tournament committee to update historical data.
          </Typography>
        </Box>
        <Footer config={config} />
      </Box>
    </AnimatedPage>
  );
}

export default HistoricalRecordsPage;
