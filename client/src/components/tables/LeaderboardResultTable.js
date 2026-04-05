import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useMediaQuery, useTheme, Card, CardContent, Typography, Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import './LeaderboardResultTable.css';
import { loadConfigForYear } from '../../config/masterConfig';

function LeaderboardResultTable(props) {
  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadConfigs = async () => {
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig);
    };
    loadConfigs();
  }, [year]);

  if (!config) {
    return <div>Loading...</div>;
  }

  const headerBg = config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_BACKGROUND_COLOR || '#02133e';
  const headerText = config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_TEXT_COLOR || '#ffffff';
  const cellText = config.stylingConfig.CONFIG_STYLING_TABLE_CELL_TEXT_COLOR || '#222222';
  const titleColor = config.stylingConfig.CONFIG_STYLING_LEADERBOARD_TITLE_TEXT_COLOR;
  const subtitleColor = config.stylingConfig.CONFIG_STYLING_LEADERBOARD_SUBTITLE_TEXT_COLOR;
  const subtitleStyle = config.stylingConfig.CONFIG_STYLING_LEADERBOARD_SUBTITLE_FONT_STYLE;

  const formatCellValue = (col, value) => {
    if (col.isDateTime && value) {
      return dayjs(value).format('MMMM Do, YYYY @ hh:mm A');
    }
    return value ?? '—';
  };

  const formattedColumns = props.columns.map((col) => {
    if (col.isDateTime) {
      return {
        ...col,
        valueFormatter: (params) => dayjs(params).format('MMMM Do, YYYY @ hh:mm A'),
      };
    }
    return col;
  });

  const titleLabel = props.title;
  const subtitleLabel = props.subtitle;

  if (isMobile) {
    const placeCol = formattedColumns.find(c => c.field === 'place');
    const nameCol = formattedColumns.find(c => /angler|^boat$|^name$/i.test(c.field) && c.field !== 'place')
      || formattedColumns.find(c => /team|boat/i.test(c.field));
    const statCol = formattedColumns.find(c => /points|weight|payout/i.test(c.field));
    const dateCol = formattedColumns.find(c => c.isDateTime);
    const otherCols = formattedColumns.filter(c => c !== placeCol && c !== nameCol && c !== statCol && c !== dateCol && c.field !== 'place');

    return (
      <Paper
        elevation={2}
        sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', ...props.style }}
      >
        {/* Card header */}
        <Box sx={{ backgroundColor: headerBg, px: 2, py: 1.5 }}>
          <Typography sx={{ color: headerText, fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.3 }}>
            {titleLabel}
          </Typography>
          {subtitleLabel && (
            <Typography sx={{ color: headerText, fontSize: '0.8rem', opacity: 0.85, fontStyle: subtitleStyle }}>
              {subtitleLabel}
            </Typography>
          )}
        </Box>
        {/* Rows */}
        <Box sx={{ p: 1 }}>
          {(props.rows || []).map((row, rowIndex) => {
            const placeNum = placeCol ? row[placeCol.field] : rowIndex + 1;
            const nameVal = nameCol ? row[nameCol.field] : null;
            const statVal = statCol ? row[statCol.field] : null;
            const dateVal = dateCol ? row[dateCol.field] : null;
            return (
              <Card
                key={row.id ?? rowIndex}
                variant="outlined"
                sx={{ mb: 1, borderColor: headerBg, borderWidth: 1 }}
              >
                <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      minWidth: 36, height: 36, borderRadius: 1,
                      backgroundColor: headerBg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Typography sx={{ color: headerText, fontWeight: 'bold', fontSize: '1rem' }}>
                        {placeNum}
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      {nameVal && (
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: cellText, lineHeight: 1.2 }}>
                          {nameVal}
                        </Typography>
                      )}
                      {statCol && statVal != null && (
                        <Typography sx={{ fontSize: '0.75rem', color: cellText, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {statCol.headerName}: {formatCellValue(statCol, statVal)}
                        </Typography>
                      )}
                      {dateCol && dateVal && (
                        <Typography sx={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {dateCol.headerName}: {formatCellValue(dateCol, dateVal)}
                        </Typography>
                      )}
                      {otherCols.map(col => (
                        <Typography key={col.field} sx={{ fontSize: '0.7rem', color: '#666' }}>
                          {col.headerName}: {formatCellValue(col, row[col.field])}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', ...props.style }}
    >
      {/* Card header */}
      <Box sx={{ backgroundColor: headerBg, px: 3, py: 1.5 }}>
        <Typography sx={{ color: headerText, fontWeight: 'bold', fontSize: '1.15rem', display: 'inline' }}>
          {titleLabel}
        </Typography>
        {subtitleLabel && (
          <Typography component="span" sx={{ color: headerText, fontSize: '0.95rem', fontStyle: subtitleStyle, opacity: 0.85, ml: 1.5 }}>
            ({subtitleLabel})
          </Typography>
        )}
      </Box>
      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <DataGrid
          rows={props.rows || []}
          columns={formattedColumns}
          sx={{
            border: 'none',
            borderRadius: 0,
            '.MuiDataGrid-row.Mui-odd': {
              backgroundColor: config.stylingConfig.CONFIG_STYLING_TABLE_ODD_ROW_BACKGROUND_COLOR,
              fontSize: '16px',
            },
            '.MuiDataGrid-columnHeaderTitleContainer': {
              backgroundColor: config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_BACKGROUND_COLOR,
              fontSize: '16px',
              color: config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_TEXT_COLOR,
              '.MuiSvgIcon-root': {
                color: config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_TEXT_COLOR,
              }
            },
            '& .super-app-theme--header': {
              backgroundColor: config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_BACKGROUND_COLOR,
              fontSize: '16px',
              color: config.stylingConfig.CONFIG_STYLING_TABLE_HEADER_TEXT_COLOR,
            },
            '& .MuiDataGrid-cell': {
              fontSize: '16px',
              color: config.stylingConfig.CONFIG_STYLING_TABLE_CELL_TEXT_COLOR,
            },
          }}
          hideFooter={true}
          density='compact'
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
          }
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
        />
      </Box>
    </Paper>
  );
}

export default LeaderboardResultTable;
