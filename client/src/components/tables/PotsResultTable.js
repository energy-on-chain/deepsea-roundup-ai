import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { useMediaQuery, useTheme, Card, CardContent, Typography, Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import './LeaderboardResultTable.css';
import { loadConfigForYear } from '../../config/masterConfig';

function PotsResultTable(props) {
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
  const subtitleStyle = config.stylingConfig.CONFIG_STYLING_POTS_SUBTITLE_FONT_STYLE;

  const payoutColumn = props.columns.find((col) => col.field === 'payout');
  const totalPayout = props.rows[0]?.totalPayout || 0;
  const formattedTotalPayout = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPayout);

  const formatCellValue = (col, value) => {
    if (col.isDateTime && value) {
      return dayjs(value).format('MMMM Do, YYYY @ hh:mm A');
    }
    if (col.isCurrency) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value ?? 0);
    }
    return value ?? '—';
  };

  const formattedColumns = props.columns.map((col) => {
    if (col.isDateTime) {
      return {
        ...col,
        valueFormatter: (params) => dayjs(params).format('MMMM Do, YYYY @ hh:mm A'),
      };
    } else if (col.isCurrency) {
      return {
        ...col,
        valueFormatter: (params) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params),
      };
    }
    return col;
  });

  if (isMobile) {
    const placeCol = formattedColumns.find(c => c.field === 'place');
    const nameCol = formattedColumns.find(c => /team|angler|^name$/i.test(c.field) && c.field !== 'place');
    const payoutCol = formattedColumns.find(c => c.isCurrency || /payout/i.test(c.field));
    const dateCol = formattedColumns.find(c => c.isDateTime);
    const otherCols = formattedColumns.filter(c => c !== placeCol && c !== nameCol && c !== payoutCol && c !== dateCol);

    return (
      <Paper
        elevation={2}
        sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', ...props.style }}
      >
        {/* Card header */}
        <Box sx={{ backgroundColor: headerBg, px: 2, py: 1.5 }}>
          <Typography sx={{ color: headerText, fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.3 }}>
            {props.title}
            {totalPayout > 0 && (
              <Typography component="span" sx={{ fontSize: '0.85rem', opacity: 0.85, ml: 1 }}>
                ({formattedTotalPayout} total)
              </Typography>
            )}
          </Typography>
          {props.subtitle && (
            <Typography sx={{ color: headerText, fontSize: '0.8rem', opacity: 0.85, fontStyle: subtitleStyle }}>
              {props.subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 1 }}>
          {(props.rows || []).map((row, rowIndex) => {
            const placeNum = placeCol ? row[placeCol.field] : rowIndex + 1;
            const nameVal = nameCol ? row[nameCol.field] : null;
            const payoutValue = row[payoutColumn?.field] || 0;
            const isWinner = payoutValue > 0;
            return (
              <Card
                key={row.id ?? rowIndex}
                variant="outlined"
                sx={{ mb: 1, borderColor: isWinner ? headerBg : '#ccc', borderWidth: isWinner ? 2 : 1 }}
              >
                <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      minWidth: 36, height: 36, borderRadius: 1,
                      backgroundColor: isWinner ? headerBg : '#aaa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
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
                      {payoutCol && (
                        <Typography sx={{ fontSize: '0.75rem', color: isWinner ? cellText : '#888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {payoutCol.headerName}: {formatCellValue(payoutCol, row[payoutCol.field])}
                        </Typography>
                      )}
                      {dateCol && row[dateCol.field] && (
                        <Typography sx={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {dateCol.headerName}: {formatCellValue(dateCol, row[dateCol.field])}
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
          {props.title}
        </Typography>
        {totalPayout > 0 && (
          <Typography component="span" sx={{ color: headerText, fontSize: '0.95rem', opacity: 0.85, ml: 1.5 }}>
            ({formattedTotalPayout} total)
          </Typography>
        )}
        {props.subtitle && (
          <Typography component="span" sx={{ color: headerText, fontSize: '0.95rem', fontStyle: subtitleStyle, opacity: 0.85, ml: 1.5 }}>
            ({props.subtitle})
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
          getRowClassName={(params) => {
            const payoutValue = params.row[payoutColumn?.field] || 0;
            return payoutValue > 0 ? 'winner-row' : 'loser-row';
          }}
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
        />
      </Box>
    </Paper>
  );
}

export default PotsResultTable;
