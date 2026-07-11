/**
 * pressReports.js
 *
 * End-of-day press / in-progress report.
 *
 * Shows all category leaders (all divisions and species) at the current moment.
 * Deliberately EXCLUDES overall tournament champions (Grand Champion Adult/Junior,
 * Top Woman Angler, Bay/Surf Grand Champion) because those standings are not
 * finalized until Sunday morning. Also excludes the Billfish/Tarpon Release
 * Divisions and the individual Blue Marlin/White Marlin/Sailfish/Tarpon angler
 * trophies -- these still appear in the full leaderboard/announcer reports, just
 * not this in-progress one.
 *
 * Compact format: multiple categories per page, minimal whitespace.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { loadConfigForYear } from '../config/masterConfig';

// Categories to exclude from the press report (not finalized until tournament end,
// or release-division results not meant for this report at all)
const EXCLUDE_FROM_PRESS = [
  'grand champion',
  'top woman angler',
  'billfish release division',
  'tarpon release division',
  'offshore - blue marlin',
  'offshore - white marlin',
  'offshore - sailfish',
  'offshore - tarpon',
];

const isExcluded = (title) =>
  EXCLUDE_FROM_PRESS.some(keyword => title.toLowerCase().includes(keyword));

// Report sections, in print order. Each always starts on a fresh page.
const SECTIONS = [
  'Offshore — Adult',
  'Offshore — Junior',
  'Bay/Surf — Adult',
  'Bay/Surf — Junior',
  'Kayak',
  'Flyfishing',
];

// Classifies a leaderboard category into one of SECTIONS, using its division/ageBracket inputs.
const classifySection = (item) => {
  const inputs = (item.inputs || []).reduce((acc, inp) => ({ ...acc, ...inp }), {});
  const { division, ageBracket } = inputs;

  if (division === 'Offshore' && ageBracket === 'Adult') return 'Offshore — Adult';
  if (division === 'Offshore' && ageBracket === 'Junior') return 'Offshore — Junior';
  if (division === 'Bay/Surf' && ageBracket === 'Adult') return 'Bay/Surf — Adult';
  if (division === 'Bay/Surf' && ageBracket === 'Junior') return 'Bay/Surf — Junior';
  if (division === 'Kayak') return 'Kayak';
  if (division === 'Flyfishing') return 'Flyfishing';

  return null; // unclassified -- omitted from the report rather than guessed at
};

const REPORT_NUM_PLACES = 2; // Press report: top 2 only (1st and 2nd place)
const PAGE_MARGIN = 10;
const PAGE_WIDTH = 297; // A4 landscape mm
const MIN_ROWS_HEIGHT_MM = 18; // Minimum space needed to start a new table on current page

const formatCellValue = (col, value) => {
  if (!value && value !== 0) return '—';
  if (col.isDateTime) return dayjs(value).format('M/D/YY h:mm A');
  if (col.isCurrency) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  }
  return value.toString();
};

const addPageNumbers = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.text(`Page ${i} of ${pageCount}`, w - PAGE_MARGIN, h - 5, { align: 'right' });
    doc.setTextColor(0);
  }
};

export const generatePressReport = async (year, tournamentName) => {
  const config = await loadConfigForYear(year);
  const apiUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL_PRODUCTION
    : import.meta.env.VITE_SERVER_URL_STAGING;

  const generatedAt = dayjs().format('MMMM D, YYYY h:mm A');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Filter and build queries (exclude grand champion / top woman angler) ---
  // Note: intentionally ignores the admin visibility (display) flag — reporters see all data.
  const categories = config.leaderboardConfig.CONFIG_LEADERBOARD_CATEGORIES.filter(
    item => !isExcluded(item.title)
  );

  const queries = categories.map(item => ({
    title: item.title,
    subtitle: item.subtitle || '',
    url: item.url,
    desktopColumns: item.desktopColumns,
    body: JSON.stringify({
      catchYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
      anglerYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
      numPlaces: REPORT_NUM_PLACES,
      isReport: true,
      ...(item.inputs ? item.inputs.reduce((acc, inp) => ({ ...acc, ...inp }), {}) : {}),
    }),
  }));

  const results = await Promise.all(
    queries.map(q =>
      fetch(`${apiUrl}/api/${year}/${q.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: q.body,
      })
        .then(r => r.json())
        .then(data => ({
          title: q.title,
          subtitle: q.subtitle,
          desktopColumns: q.desktopColumns,
          rows: Array.isArray(data) ? data : Object.values(data),
        }))
        .catch(() => ({ title: q.title, subtitle: q.subtitle, desktopColumns: q.desktopColumns, rows: [] }))
    )
  );

  // --- Page header helper (includes the current section name for clarity) ---
  let currentSectionName = '';
  const drawPageHeader = () => {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 19, 62); // DSR navy
    doc.text(
      `${tournamentName || year + ' Deepsea Roundup'} — Category Leaders (In Progress)`,
      PAGE_MARGIN, 10
    );
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(150, 40, 20); // accent color so the section is easy to spot at a glance
    doc.text(currentSectionName, PAGE_MARGIN, 16.5);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text(`Generated: ${generatedAt}  |  Overall champions not shown (not final until Sunday)`, PAGE_WIDTH - PAGE_MARGIN, 10, { align: 'right' });
    doc.setTextColor(0);
    doc.line(PAGE_MARGIN, 19, PAGE_WIDTH - PAGE_MARGIN, 19);
  };

  // --- Group categories into sections, preserving each section's category order ---
  const sectioned = new Map(SECTIONS.map(name => [name, []]));
  results.forEach(category => {
    const sourceItem = categories.find(c => c.title === category.title);
    const section = sourceItem ? classifySection(sourceItem) : null;
    if (section && sectioned.has(section)) sectioned.get(section).push(category);
  });

  let isFirstPage = true;
  let cursorY = 22;

  for (const sectionName of SECTIONS) {
    const sectionCategories = sectioned.get(sectionName).filter(c => c.rows.length > 0);
    if (sectionCategories.length === 0) continue;

    // Every section starts on a fresh page.
    if (!isFirstPage) doc.addPage();
    isFirstPage = false;
    currentSectionName = sectionName;
    drawPageHeader();
    cursorY = 22;

    for (const category of sectionCategories) {
      const label = category.title + (category.subtitle ? ` — ${category.subtitle}` : '');
      const tableColumns = category.desktopColumns.map(c => c.headerName);
      const tableRows = category.rows.slice(0, REPORT_NUM_PLACES).map(row =>
        category.desktopColumns.map(col => formatCellValue(col, row[col.field]))
      );

      // Estimate whether we have room (rough: header + rows * ~6mm each)
      const estimatedHeight = 8 + tableRows.length * 6 + 4;
      if (cursorY + estimatedHeight > pageHeight - 12) {
        doc.addPage();
        drawPageHeader();
        cursorY = 22;
      }

      // Category label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 19, 62);
      doc.text(label, PAGE_MARGIN, cursorY);
      doc.setTextColor(0);
      cursorY += 3;

      doc.autoTable({
        startY: cursorY,
        head: [tableColumns],
        body: tableRows,
        theme: 'striped',
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [2, 19, 62],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 1.5,
        },
        margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
        tableWidth: 'auto',
        didDrawPage: () => {
          drawPageHeader();
        },
      });

      cursorY = doc.lastAutoTable.finalY + 4;
    }
  }

  addPageNumbers(doc);
  doc.save(`${year}_DSR_Category_Leaders_${dayjs().format('YYYY-MM-DD_HHmm')}.pdf`);
};
