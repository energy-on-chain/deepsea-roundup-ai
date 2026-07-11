/**
 * announcerReports.js
 *
 * End-of-tournament announcer report.
 *
 * Shows ALL category results including overall tournament champions (Grand Champion
 * Adult/Junior, Top Woman Angler, Bay/Surf Grand Champion). Intended for use after
 * final standings are confirmed Sunday morning.
 *
 * Compact format: multiple categories per page, minimal whitespace.
 * Overall champions are printed first (prominent), then all category-by-category results.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { loadConfigForYear } from '../config/masterConfig';

// Keywords that identify overall tournament champion categories — printed first
const CHAMPION_KEYWORDS = [
  'grand champion',
  'top woman angler',
];

const isChampion = (title) =>
  CHAMPION_KEYWORDS.some(keyword => title.toLowerCase().includes(keyword));

// Billfish/Tarpon results each get their own page(s), separate from offshore meatfish.
// Billfish group = boat division + the three individual angler trophies it covers.
// Tarpon group = boat division + its one individual angler trophy.
const BILLFISH_GROUP_TITLES = ['Billfish Release Division', 'Offshore - Blue Marlin', 'Offshore - White Marlin', 'Offshore - Sailfish'];
const TARPON_GROUP_TITLES = ['Tarpon Release Division', 'Offshore - Tarpon'];
const GROUPED_TITLES = new Set([...BILLFISH_GROUP_TITLES, ...TARPON_GROUP_TITLES]);

const getForcedGroup = (title) => {
  if (BILLFISH_GROUP_TITLES.includes(title)) return 'billfish';
  if (TARPON_GROUP_TITLES.includes(title)) return 'tarpon';
  return null;
};

// The billfish/tarpon categories aren't contiguous in CONFIG_LEADERBOARD_CATEGORIES order
// (Tarpon Release Division sits between Billfish Release Division and the individual Blue
// Marlin/White Marlin/Sailfish trophies), so group membership alone isn't enough to force
// clean page breaks -- pull each group's categories together first, in the position the
// first one of either group originally occupied.
const reorderGroups = (list) => {
  const firstGroupedIdx = list.findIndex(c => GROUPED_TITLES.has(c.title));
  if (firstGroupedIdx === -1) return list;

  const ungrouped = list.filter(c => !GROUPED_TITLES.has(c.title));
  const billfishItems = BILLFISH_GROUP_TITLES.map(t => list.find(c => c.title === t)).filter(Boolean);
  const tarponItems = TARPON_GROUP_TITLES.map(t => list.find(c => c.title === t)).filter(Boolean);
  const insertAt = list.slice(0, firstGroupedIdx).filter(c => !GROUPED_TITLES.has(c.title)).length;

  return [
    ...ungrouped.slice(0, insertAt),
    ...billfishItems,
    ...tarponItems,
    ...ungrouped.slice(insertAt),
  ];
};

const REPORT_NUM_PLACES = 2; // Announcer report: top 2 only (1st and 2nd place)
const PAGE_MARGIN = 10;
const PAGE_WIDTH = 297;

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

export const generateAnnouncerReport = async (year, tournamentName) => {
  const config = await loadConfigForYear(year);
  const apiUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL_PRODUCTION
    : import.meta.env.VITE_SERVER_URL_STAGING;

  const generatedAt = dayjs().format('MMMM D, YYYY h:mm A');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageHeight = doc.internal.pageSize.getHeight();

  // Build queries for ALL categories — intentionally ignores display flag so grand champions always appear.
  const allCategories = config.leaderboardConfig.CONFIG_LEADERBOARD_CATEGORIES;

  const queries = allCategories.map(item => ({
    title: item.title,
    subtitle: item.subtitle || '',
    url: item.url,
    desktopColumns: item.desktopColumns,
    isChampion: isChampion(item.title),
    body: JSON.stringify({
      catchYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
      anglerYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
      numPlaces: REPORT_NUM_PLACES,
      isReport: true,
      ...(item.inputs ? item.inputs.reduce((acc, inp) => ({ ...acc, ...inp }), {}) : {}),
    }),
  }));

  const rawResults = await Promise.all(
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
          isChampion: q.isChampion,
          rows: Array.isArray(data) ? data : Object.values(data),
        }))
        .catch(() => ({
          title: q.title,
          subtitle: q.subtitle,
          desktopColumns: q.desktopColumns,
          isChampion: q.isChampion,
          rows: [],
        }))
    )
  );

  // Champions first, then other categories (billfish/tarpon regrouped so each gets its own page)
  const champions = rawResults.filter(r => r.isChampion);
  const others = reorderGroups(rawResults.filter(r => !r.isChampion));
  const results = [...champions, ...others];

  // --- Page header helper ---
  const drawPageHeader = (isFirstPage = false) => {
    if (isFirstPage) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(2, 19, 62);
      doc.text('End-of-Tournament Final Results — Announcer Report', PAGE_MARGIN, 10);
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(`Generated: ${generatedAt}`, PAGE_MARGIN, 16);
      doc.setTextColor(0);
      doc.line(PAGE_MARGIN, 18, PAGE_WIDTH - PAGE_MARGIN, 18);
      return 21;
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 19, 62);
      doc.text(
        `${tournamentName || year + ' Deepsea Roundup'} — Final Results (cont.)`,
        PAGE_MARGIN, 8
      );
      doc.setTextColor(0);
      doc.line(PAGE_MARGIN, 10, PAGE_WIDTH - PAGE_MARGIN, 10);
      return 13;
    }
  };

  let cursorY = drawPageHeader(true);
  let isFirst = true;
  // Tracks the page a header was last actually drawn on, so autoTable's didDrawPage
  // (which fires once per page a table touches, INCLUDING the page it starts on) never
  // redraws a header on top of one already drawn manually for that same page.
  let lastHeaderPage = doc.internal.getCurrentPageInfo().pageNumber;
  // Tracks the billfish/tarpon group (if any) the previous category belonged to, so a
  // fresh page is forced whenever that group changes -- entering a group, leaving one, or
  // switching from one group to the other.
  let previousGroup = null;

  for (const category of results) {
    if (category.rows.length === 0) continue;

    const label = category.title + (category.subtitle ? ` — ${category.subtitle}` : '');
    const tableColumns = category.desktopColumns.map(c => c.headerName);
    const tableRows = category.rows.slice(0, REPORT_NUM_PLACES).map(row =>
      category.desktopColumns.map(col => formatCellValue(col, row[col.field]))
    );

    const thisGroup = getForcedGroup(category.title);
    const forceGroupPageBreak = thisGroup !== previousGroup;
    previousGroup = thisGroup;

    const estimatedHeight = 8 + tableRows.length * 6 + 4;
    if (!isFirst && (forceGroupPageBreak || cursorY + estimatedHeight > pageHeight - 12)) {
      doc.addPage();
      cursorY = drawPageHeader(false);
      lastHeaderPage = doc.internal.getCurrentPageInfo().pageNumber;
    }
    isFirst = false;

    // Champion categories get a highlighted label
    if (category.isChampion) {
      doc.setFillColor(2, 19, 62);
      doc.rect(PAGE_MARGIN, cursorY - 0.5, PAGE_WIDTH - PAGE_MARGIN * 2, 5.5, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`★  ${label}`, PAGE_MARGIN + 2, cursorY + 3.5);
      doc.setTextColor(0);
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 19, 62);
      doc.text(label, PAGE_MARGIN, cursorY + 3);
      doc.setTextColor(0);
    }

    cursorY += 6;

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
        fillColor: category.isChampion ? [180, 140, 0] : [2, 19, 62],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1.5,
      },
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
      tableWidth: 'auto',
      didDrawPage: () => {
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        if (currentPage !== lastHeaderPage) {
          drawPageHeader(false);
          lastHeaderPage = currentPage;
        }
      },
    });

    cursorY = doc.lastAutoTable.finalY + 4;
  }

  addPageNumbers(doc);
  doc.save(`${year}_DSR_Final_Announcer_Report_${dayjs().format('YYYY-MM-DD_HHmm')}.pdf`);
};
