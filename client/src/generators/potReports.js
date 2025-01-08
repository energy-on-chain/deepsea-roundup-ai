import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { loadConfigForYear } from '../config/masterConfig';  // Dynamic config loader

const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 10);
  }
};

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const generatePotsReport = async (year, tournamentName) => {
  const doc = new jsPDF('landscape');
  const currentDate = dayjs().format('MMMM D, YYYY h:mm A [CST]');
  const REPORT_NUM_PLACES = 20; // Set fixed number of places for report

  // Load dynamic config for the specific year
  const config = await loadConfigForYear(year);

  let apiUrl = null;
  if (process.env.REACT_APP_NODE_ENV === "staging") {
    apiUrl = process.env.REACT_APP_SERVER_URL_STAGING;
  } else if (process.env.REACT_APP_NODE_ENV === "production") {
    apiUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
  }

  // Fetch and process pot data
  try {
    // Build queries for pot categories dynamically from config
    const queries = config.potsConfig.CONFIG_POTS_CATEGORIES
      .filter(item => item.display) // Only include categories marked for display
      .map(item => ({
        title: item.title,
        subtitle: item.subtitle || "",
        url: item.url,
        body: JSON.stringify({
          catchYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
          anglerYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
          numPlaces: REPORT_NUM_PLACES, // Override numPlaces for report
          isReport: true,
          title: item.title,
          subtitle: item.subtitle || "",
          potName: item.potName,
          entryAmount: item.entryAmount,
          tournamentCut: item.tournamentCut,
          ...(item.inputs && item.inputs.length > 0
            ? item.inputs.reduce((acc, input) => ({ ...acc, ...input }), {})
            : {})
        }),
        desktopColumns: item.desktopColumns,
        entryAmount: item.entryAmount,
        tournamentCut: item.tournamentCut,
      }));

    // Fetch all data with increased number of places
    const results = await Promise.all(queries.map(async (query) => {
      const response = await fetch(`${apiUrl}/api/${year}/${query.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: query.body
      });
      
      const result = await response.json();

      // Process the result similar to how it's done in PotsPage.js
      const tempRows = [];
      Object.keys(result).forEach((catchKey, i) => {
        let tempObject = {...result[catchKey], id: i, catchId: catchKey};
        tempRows.push(tempObject);
      });

      return {
        title: query.title,
        subtitle: query.subtitle,
        rows: tempRows,
        desktopColumns: query.desktopColumns,
        entryAmount: query.entryAmount,
        tournamentCut: query.tournamentCut,
        numPlaces: REPORT_NUM_PLACES
      };
    }));

    // Fetch pot entries to calculate total entries
    const potEntriesResponse = await fetch(`${apiUrl}/api/${year}/get_all_pot_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({potYear: `pots${year}`})
    });
    const potEntriesData = await potEntriesResponse.json();

    // Process entries to count participants
    const processEntries = (potTitle) => {
      const boardPotTitles = config.potsConfig.CONFIG_POTS_BOARD_LIST
        .flatMap(boardObj => 
          Object.values(boardObj)[0].map(pot => pot.title)
        );
      
      // Find the specific pot's details
      const potDetails = boardPotTitles.find(title => title === potTitle);
      
      // Count entries for this specific pot
      const entries = potEntriesData.data.filter(entry => {
        const boardSelections = typeof entry.boardSelections === 'string' 
          ? JSON.parse(entry.boardSelections) 
          : entry.boardSelections;
        
        return boardSelections.some(board => 
          board.potList.includes(potTitle)
        );
      });

      return {
        totalEntries: entries.length,
        entryAmount: entries.length * (potDetails.amount || 100), // Default to 100 if not found
        tournamentCut: potDetails.tournamentCut || 0.2 // Default to 20% if not found
      };
    };

    // Generate the PDF
    results.forEach((category, index) => {
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

      // Calculate pot details
      const { totalEntries, entryAmount, tournamentCut } = processEntries(category.title);
      const grossTotal = entryAmount;
      const netTotal = grossTotal * (1 - tournamentCut);

      // Display pot details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Entries: ${totalEntries}`, 10, category.subtitle ? 40 : 30);
      doc.text(`Gross Pot: ${formatCurrency(grossTotal)}`, 10, category.subtitle ? 47 : 37);
      doc.text(`Net Payout: ${formatCurrency(netTotal)}`, 10, category.subtitle ? 54 : 44);

      // Generate table data
      const tableColumns = category.desktopColumns.map(col => col.headerName);
      const tableRows = category.rows
        .slice(0, REPORT_NUM_PLACES) // Ensure we only show up to REPORT_NUM_PLACES rows
        .map(row => category.desktopColumns.map(col => {
          // Handle special formatting for certain field types
          if (col.field === 'dateTime' || col.isDateTime) {
            return dayjs(row[col.field]).format('MM/DD/YYYY HH:mm:ss');
          }
          if (col.isCurrency) {
            return formatCurrency(row[col.field] || 0);
          }
          return row[col.field]?.toString() || 'N/A';
        }));

      // Add the table
      if (tableRows.length > 0) {
        doc.autoTable({
          startY: category.subtitle ? 62 : 52,
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
      } else {
        // If no rows, add a message
        doc.text('No results available for this category.', 10, category.subtitle ? 62 : 52);
      }
    });

    // Add page numbers
    addPageNumbers(doc);

    // Save the PDF
    doc.save(`${tournamentName} ${year} Pot Standings Report.pdf`);

  } catch (error) {
    console.error("Error generating pot report:", error);
    throw error; // Re-throw to handle in the UI
  }
};

