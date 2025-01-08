import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { loadConfigForYear } from '../config/masterConfig';

const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 15, doc.internal.pageSize.getHeight() - 10);
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

export const generateRegistrationReport = (teams, year, tableProperties, tournamentName) => {
  const doc = new jsPDF('landscape');
  const currentDate = dayjs().format('MMMM D, YYYY h:mm A [CST]');
  
  // Define consistent margins
  const margins = {
    top: 20,
    left: 10
  };
  
  // Add header only on the first page
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Anglers registered for ${tournamentName} as of ${currentDate}`, margins.left, margins.top);

  // Columns to display in the desired order
  const selectedColumns = ['anglerName', 'email', 'phone', 'boatName', 'division', 'ageBracket', 'gender', 'hasCheckedIn'];

  // Get headers for the selected columns in the desired order
  const visibleColumns = tableProperties.filter(col => selectedColumns.includes(col.field));
  const tableColumn = visibleColumns.map(col => col.headerName);

  const tableRows = [];

  // Sort teams by team name
  const sortedTeams = Object.values(teams).sort((a, b) => a.anglerName.localeCompare(b.anglerName));

  sortedTeams.forEach((team, index) => {
    const teamData = visibleColumns.map(col => {
      if (col.field === 'registrationFee') {
        return formatCurrency(team[col.field] || 0);
      }
      return team[col.field] || '';
    });
    tableRows.push([index + 1, ...teamData]);
  });

  // Column styles matching the selectedColumns order
  const columnStyles = {
    0: { cellWidth: 10 },     // #
    1: { cellWidth: 40 },     // Angler Name
    2: { cellWidth: 40 },     // Boat Name
    3: { cellWidth: 20 },     // Division
    4: { cellWidth: 20 },     // Gender
    5: { cellWidth: 20 },     // Age
    6: { cellWidth: 60 },     // Email
    7: { cellWidth: 20 },     // Phone
    8: { cellWidth: 30 },     // Checked-In?
  };

  doc.autoTable({
    startY: margins.top + 10,  // Start table below header on first page
    head: [['#', ...tableColumn]],
    body: tableRows,
    theme: 'striped',
    styles: { fontSize: 10, halign: 'center', valign: 'middle', overflow: 'linebreak' },
    headStyles: { fillColor: '#02133E', textColor: '#ffffff', halign: 'center' },
    columnStyles: columnStyles,
    didDrawPage: function (data) {
      // No header needed on subsequent pages
      // Table will start at the top of the page
      if (data.pageNumber > 1) {
        data.cursor.y = 10; // Start table at top of page for all pages after the first
      }
    }
  });

  addPageNumbers(doc);

  // Save the PDF
  doc.save(`${tournamentName} ${year} Angler Check-In Form.pdf`);
};

export const fetchAndGenerateRegistrationReport = async (year, tournamentName, tableProperties) => {
  console.log('Fetching and generating registration report...');

  // Load dynamic config for the specific year
  const config = await loadConfigForYear(year);

  // Define environment
  let apiUrl = null; 
  if (process.env.REACT_APP_NODE_ENV === "staging") {
    apiUrl = process.env.REACT_APP_SERVER_URL_STAGING;
  } else if (process.env.REACT_APP_NODE_ENV === "production") {
    apiUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
  }

  try { 
    const response = await fetch(`${apiUrl}/api/${year}/admin_get_registered_team_data_for_report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const teamData = await response.json();
    generateRegistrationReport(teamData, year, tableProperties, tournamentName);
  } catch (error) {
    console.error("Error fetching team data or generating PDF:", error);
  }
};

