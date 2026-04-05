/**
 * potReports.js
 *
 * Pot winners report for tournament organizers.
 *
 * Page 1: Financial summary — grand totals + board breakdown + per-category breakdown.
 * Remaining pages: Compact winner results, multiple categories per page.
 *
 * Intentionally ignores the `display` flag — this report is for organizers and
 * shows every pot category that has at least one entrant.
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { loadConfigForYear } from '../config/masterConfig';

const PAGE_MARGIN = 10;
const PAGE_WIDTH = 297; // A4 landscape mm
const REPORT_NUM_PLACES = 20;

const fmt = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value || 0);

const formatCellValue = (col, value) => {
  if (!value && value !== 0) return '—';
  if (col.isDateTime) return dayjs(value).format('M/D/YY h:mm A');
  if (col.isCurrency) return fmt(value);
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

export const generatePotsReport = async (year, tournamentName) => {
  const config = await loadConfigForYear(year);
  const apiUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL_PRODUCTION
    : import.meta.env.VITE_SERVER_URL_STAGING;

  const generatedAt = dayjs().format('MMMM D, YYYY h:mm A');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Build queries — include ALL pot categories regardless of display flag ---
  const queries = config.potsConfig.CONFIG_POTS_CATEGORIES.map(item => ({
    title: item.title,
    subtitle: item.subtitle || '',
    url: item.url,
    entryAmount: item.entryAmount,
    tournamentCut: item.tournamentCut,
    payoutStructure: item.payoutStructure,
    desktopColumns: item.desktopColumns,
    body: JSON.stringify({
      catchYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
      anglerYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
      numPlaces: REPORT_NUM_PLACES,
      isReport: true,
      potName: item.potName,
      entryAmount: item.entryAmount,
      tournamentCut: item.tournamentCut,
      payoutStructure: item.payoutStructure,
      ...(item.inputs ? item.inputs.reduce((acc, inp) => ({ ...acc, ...inp }), {}) : {}),
    }),
  }));

  // --- Fetch winner results + raw pot docs in parallel ---
  const [rawResults, potDocs] = await Promise.all([
    Promise.all(
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
            url: q.url,
            entryAmount: q.entryAmount,
            tournamentCut: q.tournamentCut,
            desktopColumns: q.desktopColumns,
            rows: Array.isArray(data) ? data : Object.values(data),
          }))
          .catch(() => ({
            title: q.title,
            subtitle: q.subtitle,
            url: q.url,
            entryAmount: q.entryAmount,
            tournamentCut: q.tournamentCut,
            desktopColumns: q.desktopColumns,
            rows: [],
          }))
      )
    ),
    fetch(`${apiUrl}/api/${year}/get_all_pot_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(d => d.data || [])
      .catch(() => []),
  ]);

  // --- Only keep categories with actual catches (for results pages) ---
  const results = rawResults.filter(r => r.rows.length > 0);

  // --- Compute true entrant counts from raw pot documents ---
  const norm = (s) => (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase();
  const potEntrantCounts = {};
  potDocs.forEach(doc => {
    let boardSelections;
    try {
      boardSelections = typeof doc.boardSelections === 'string'
        ? JSON.parse(doc.boardSelections)
        : (Array.isArray(doc.boardSelections) ? doc.boardSelections : []);
    } catch { boardSelections = []; }
    boardSelections.forEach(board => {
      if (Array.isArray(board.potList)) {
        board.potList.forEach(pot => {
          const key = norm(pot);
          potEntrantCounts[key] = (potEntrantCounts[key] || 0) + 1;
        });
      }
    });
  });

  // --- Compute financial data using true entrant counts ---
  const boardMap = { 'Catch & Release': { gross: 0, cut: 0, net: 0 }, Offshore: { gross: 0, cut: 0, net: 0 }, 'Bay/Surf': { gross: 0, cut: 0, net: 0 } };
  const catFinancials = config.potsConfig.CONFIG_POTS_CATEGORIES.map(item => {
    const entrantCount = potEntrantCounts[norm(item.potName)] || 0;
    const gross = entrantCount * (item.entryAmount || 0);
    const cut = gross * (item.tournamentCut || 0);
    const net = gross - cut;

    const board = item.url?.includes('catch_and_release') ? 'Catch & Release'
      : item.url?.includes('offshore') ? 'Offshore'
      : 'Bay/Surf';

    boardMap[board].gross += gross;
    boardMap[board].cut += cut;
    boardMap[board].net += net;

    const resultMatch = rawResults.find(r => r.title === item.title);
    const winner = resultMatch?.rows.find(row => (row.payout || 0) > 0);
    const winnerName = winner ? (winner.angler || winner.team || '—') : (entrantCount > 0 ? 'No winner yet' : '—');
    const winnerPayout = winner?.payout || 0;

    return { title: item.title, board, entrantCount, gross, cut, net, winnerName, winnerPayout };
  }).filter(c => c.entrantCount > 0); // only show categories with entries in summary

  const totalGross = catFinancials.reduce((s, c) => s + c.gross, 0);
  const totalCut = catFinancials.reduce((s, c) => s + c.cut, 0);
  const totalNet = catFinancials.reduce((s, c) => s + c.net, 0);

  // =========================================================================
  // PAGE 1: Financial Summary
  // =========================================================================
  const name = tournamentName || `${year} Deepsea Roundup`;

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 19, 62);
  doc.text(name, PAGE_MARGIN, 10);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Pot Winners — Financial Summary', PAGE_MARGIN, 17);
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(`Generated: ${generatedAt}`, PAGE_MARGIN, 23);
  doc.setTextColor(0);
  doc.line(PAGE_MARGIN, 25, PAGE_WIDTH - PAGE_MARGIN, 25);

  // Grand total boxes
  const boxY = 28;
  const boxH = 14;
  const boxW = (PAGE_WIDTH - PAGE_MARGIN * 2 - 6) / 3;

  const drawBox = (x, label, value, fillColor, textColor = [255, 255, 255]) => {
    doc.setFillColor(...fillColor);
    doc.rect(x, boxY, boxW, boxH, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(label, x + boxW / 2, boxY + 4, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(fmt(value), x + boxW / 2, boxY + 11, { align: 'center' });
    doc.setTextColor(0);
  };

  drawBox(PAGE_MARGIN, 'Total Gross Collected', totalGross, [2, 19, 62]);
  drawBox(PAGE_MARGIN + boxW + 3, 'Tournament Cut', totalCut, [180, 100, 0]);
  drawBox(PAGE_MARGIN + (boxW + 3) * 2, 'Total Net Payout', totalNet, [20, 100, 60]);

  let y = boxY + boxH + 6;

  // Board breakdown
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 19, 62);
  doc.text('By Board', PAGE_MARGIN, y);
  doc.setTextColor(0);
  y += 3;

  const boardRows = Object.entries(boardMap)
    .filter(([, v]) => v.gross > 0)
    .map(([board, v]) => [board, fmt(v.gross), fmt(v.cut), fmt(v.net)]);

  doc.autoTable({
    startY: y,
    head: [['Board', 'Gross Collected', 'Tournament Cut', 'Net Payout']],
    body: boardRows,
    theme: 'striped',
    styles: { fontSize: 8, cellPadding: 1.5, halign: 'center', valign: 'middle' },
    headStyles: { fillColor: [2, 19, 62], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', halign: 'center' },
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    tableWidth: 'auto',
  });

  y = doc.lastAutoTable.finalY + 6;

  // Per-category breakdown
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 19, 62);
  doc.text('By Category', PAGE_MARGIN, y);
  doc.setTextColor(0);
  y += 3;

  const catRows = catFinancials.map(c => [
    c.title,
    c.board,
    c.entrantCount,
    fmt(c.gross),
    fmt(c.cut),
    fmt(c.net),
    c.winnerName,
    fmt(c.winnerPayout),
  ]);

  doc.autoTable({
    startY: y,
    head: [['Category', 'Board', 'Entrants', 'Gross', 'Cut', 'Net', '1st Place', 'Payout']],
    body: catRows,
    theme: 'striped',
    styles: { fontSize: 7, cellPadding: 1.5, halign: 'center', valign: 'middle', overflow: 'linebreak' },
    headStyles: { fillColor: [2, 19, 62], textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { halign: 'left' }, 6: { halign: 'left' } },
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    tableWidth: 'wrap',
  });

  // =========================================================================
  // REMAINING PAGES: Compact winner results (multi-category per page)
  // =========================================================================
  const drawResultsPageHeader = (isFirst = false) => {
    if (isFirst) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 19, 62);
      doc.text(name, PAGE_MARGIN, 10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Pot Winners — Full Results', PAGE_MARGIN, 17);
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(`Generated: ${generatedAt}`, PAGE_MARGIN, 23);
      doc.setTextColor(0);
      doc.line(PAGE_MARGIN, 25, PAGE_WIDTH - PAGE_MARGIN, 25);
      return 28;
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 19, 62);
      doc.text(`${name} — Pot Winners (cont.)`, PAGE_MARGIN, 8);
      doc.setTextColor(0);
      doc.line(PAGE_MARGIN, 10, PAGE_WIDTH - PAGE_MARGIN, 10);
      return 13;
    }
  };

  doc.addPage();
  let cursorY = drawResultsPageHeader(true);
  let isFirstCategory = true;

  for (const category of results) {
    const label = category.title + (category.subtitle ? ` — ${category.subtitle}` : '');
    const tableColumns = category.desktopColumns.map(c => c.headerName);
    const tableRows = category.rows.slice(0, REPORT_NUM_PLACES).map(row =>
      category.desktopColumns.map(col => formatCellValue(col, row[col.field]))
    );

    const entrantCount = potEntrantCounts[norm(category.title)] || category.rows[0]?.entrantCount || 0;
    const gross = entrantCount * (category.entryAmount || 0);
    const net = gross * (1 - (category.tournamentCut || 0));
    const infoLine = `${entrantCount} entrant${entrantCount !== 1 ? 's' : ''} · Gross: ${fmt(gross)} · Net: ${fmt(net)}`;

    const estimatedHeight = 10 + 4 + tableRows.length * 6 + 4;
    if (!isFirstCategory && cursorY + estimatedHeight > pageHeight - 12) {
      doc.addPage();
      cursorY = drawResultsPageHeader(false);
    }
    isFirstCategory = false;

    // Category label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 19, 62);
    doc.text(label, PAGE_MARGIN, cursorY + 3);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text(infoLine, PAGE_MARGIN, cursorY + 7);
    doc.setTextColor(0);
    cursorY += 9;

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
        drawResultsPageHeader(false);
      },
    });

    cursorY = doc.lastAutoTable.finalY + 5;
  }

  addPageNumbers(doc);
  doc.save(`${year}_DSR_Pot_Winners_${dayjs().format('YYYY-MM-DD_HHmm')}.pdf`);
};
