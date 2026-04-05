import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { loadConfigForYear } from '../config/masterConfig';

const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 10);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const generateLeaderboardReport = async (year, tournamentName) => {
  const doc = new jsPDF('landscape');
  const currentDate = dayjs().format('MMMM D, YYYY h:mm A [CST]');
  const REPORT_NUM_PLACES = 20; // Set fixed number of places for report

  // Load dynamic config for the specific year
  const config = await loadConfigForYear(year);

  let apiUrl = null;
  if (import.meta.env.VITE_NODE_ENV === "staging") {
    apiUrl = import.meta.env.VITE_SERVER_URL_STAGING;
  } else if (import.meta.env.VITE_NODE_ENV === "production") {
    apiUrl = import.meta.env.VITE_SERVER_URL_PRODUCTION;
  }

  // Fetch and process leaderboard data
  try {
    // Build queries for all leaderboard categories — both public species and champion categories
    const queries = config.leaderboardConfig.CONFIG_LEADERBOARD_CATEGORIES
      .map(item => ({
        title: item.title,
        subtitle: item.subtitle || "",
        url: item.url,
        body: JSON.stringify({
          catchYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
          anglerYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
          numPlaces: REPORT_NUM_PLACES, // Override numPlaces for report
          isReport: true,
          ...(item.inputs && item.inputs.length > 0
            ? item.inputs.reduce((acc, input) => ({ ...acc, ...input }), {})
            : {})
        }),
        desktopColumns: item.desktopColumns,
      }));

    // Fetch all data with increased number of places
    const res = await Promise.all(queries.map(query =>
      fetch(`${apiUrl}/api/${year}/${query.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: query.body
      }).then(res => res.json())
        .then(result => ({
          title: query.title,
          subtitle: query.subtitle,
          rows: Array.isArray(result) ? result : Object.values(result),
          desktopColumns: query.desktopColumns,
        }))
    ));

    // Generate the PDF
    res.forEach((category, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Add category title and timestamp
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category.title}`, 10, 10);
      doc.setFontSize(12);
      doc.text(`Generated on ${currentDate}`, 10, 20);

      if (category.subtitle) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text(category.subtitle, 10, 30);
      }

      // Generate table data
      const tableColumns = category.desktopColumns.map(col => col.headerName);
      const tableRows = category.rows
        .slice(0, REPORT_NUM_PLACES) // Ensure we only show up to REPORT_NUM_PLACES rows
        .map(row => category.desktopColumns.map(col => {
          // Handle special formatting for certain field types
          if (col.field === 'dateTime' || col.isDateTime) {
            return dayjs(row[col.field]).format('MM/DD/YYYY HH:mm:ss');
          }
          return row[col.field]?.toString() || 'N/A';
        }));

      // Add the table
      doc.autoTable({
        startY: category.subtitle ? 35 : 25,
        head: [tableColumns],
        body: tableRows,
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle'
        },
        headStyles: {
          fillColor: '#02133E',
          textColor: '#ffffff',
          halign: 'center',
          fontSize: 10,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Place column
          1: { cellWidth: 'auto' }, // Dynamic width for other columns
        },
        margin: { right: 10, left: 10 },
      });
    });

    // Add page numbers
    addPageNumbers(doc);

    // Save the PDF
    doc.save(`${tournamentName} ${year} Leaderboard Report.pdf`);

  } catch (error) {
    console.error("Error generating leaderboard report:", error);
    throw error; // Re-throw to handle in the UI
  }
};

