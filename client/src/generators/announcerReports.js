/**
 * announcerReports.js
 *
 * End-of-tournament announcer script.
 *
 * A read-aloud script, not a data table, in three parts:
 *   Part 1 — Division Awards: species-by-species through every division's individual trophies
 *            (runner-up announced before the winner; every official species gets a card even
 *            with no qualifying catch).
 *   Part 2 — Overall Tournament Champions: Grand Champions, Top Woman Angler, Billfish/Tarpon
 *            Release, in the tournament's traditional announcement order.
 *   Part 3 — Tournament Records: any catch that beat the on-file species record.
 *
 * Intended for use after final standings are confirmed Sunday morning.
 */

import jsPDF from 'jspdf';
import { formatCentral, centralTime } from '../utils/dateTime';
import { loadConfigForYear } from '../config/masterConfig';

const REPORT_NUM_PLACES = 2; // Runner-up + winner only

// Bay/Surf's 7 "official" species -- always get a card, even if empty.
const BAY_SURF_SPECIES = ['Black Drum', 'Spanish Mackerel', 'Flounder', 'Redfish', 'Gafftop', 'Speckled Trout', 'Sheepshead'];
// Bay/Surf also tracks Bonito and Pompano, but they're not part of the traditional 7 --
// only get a card if someone actually weighed one in.
const BAY_SURF_BONUS_SPECIES = ['Bonito (Little Tunny)', 'Pompano'];

// Offshore's 17 official species, in announcer read order.
const OFFSHORE_SPECIES = [
  'Barracuda', 'Swordfish', 'Blackfin Tuna', 'Red Snapper', 'Blue Marlin', 'Sailfish',
  'Bonito (Little Tunny)', 'Blacktip/Spinner Shark', 'Dolphin (Dorado Mahi)', 'Tarpon',
  'Jack Crevalle (Jackfish)', 'Wahoo', 'King Mackerel (Kingfish)', 'White Marlin',
  'Ling (Cobia)', 'Yellowfin Tuna', 'Spanish Mackerel',
];
// These four are scored on release points, not weight -- no weigh-in, so no weight/length/girth
// and no tournament-record comparison.
const RELEASE_SPECIES = new Set(['Blue Marlin', 'White Marlin', 'Sailfish', 'Tarpon']);

const FLY_KAYAK_SPECIES = ['Redfish', 'Speckled Trout'];

// Part 1 division order. Fly Fishing and Kayak have no Junior split -- adults and juniors
// compete together in those two divisions.
const DIVISION_SECTIONS = [
  { label: 'Junior Bay/Surf Division', division: 'Bay/Surf', ageBracket: 'Junior', species: BAY_SURF_SPECIES, bonusSpecies: BAY_SURF_BONUS_SPECIES },
  { label: 'Adult Bay/Surf Division', division: 'Bay/Surf', ageBracket: 'Adult', species: BAY_SURF_SPECIES, bonusSpecies: BAY_SURF_BONUS_SPECIES },
  { label: 'Fly Fishing Division', division: 'Flyfishing', ageBracket: 'Adult', species: FLY_KAYAK_SPECIES },
  { label: 'Kayak Division', division: 'Kayak', ageBracket: 'Adult', species: FLY_KAYAK_SPECIES },
  { label: 'Junior Offshore Division', division: 'Offshore', ageBracket: 'Junior', species: OFFSHORE_SPECIES },
  { label: 'Adult Offshore Division', division: 'Offshore', ageBracket: 'Adult', species: OFFSHORE_SPECIES },
];

const titleFor = (division, species, ageBracket) => `${division} - ${species} (${ageBracket})`;

// Part 2 champion order -- each produces a Runner-Up + Champion pair, except Top Woman Angler
// which is announced as a single combined card.
const CHAMPION_TITLES = [
  'Bay/Surf Division Grand Champion (Junior)',
  'Bay/Surf Division Grand Champion (Adult)',
  'Top Woman Angler',
  'Tarpon Release Division',
  'Billfish Release Division',
  'Offshore Division Grand Champion (Junior)',
  'Offshore Division Grand Champion (Adult)',
];

// --- Palette ---
const NAVY = [2, 19, 62];
const GOLD = [153, 110, 0];
const GOLD_BG = [255, 245, 210];
const GRAY = [110, 110, 110];
const CARD_BG = [243, 245, 250];
const DARK = [25, 25, 25];
const WHITE = [255, 255, 255];

export const generateAnnouncerReport = async (year, tournamentName) => {
  const config = await loadConfigForYear(year);
  const apiUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL_PRODUCTION
    : import.meta.env.VITE_SERVER_URL_STAGING;

  const generatedAt = formatCentral(undefined, 'MMMM D, YYYY h:mm A [CST]');
  const allCategories = config.leaderboardConfig.CONFIG_LEADERBOARD_CATEGORIES;
  const categoryByTitle = Object.fromEntries(allCategories.map(c => [c.title, c]));

  // Every species card needed for Part 1, in read order.
  const speciesCardSpecs = [];
  DIVISION_SECTIONS.forEach(section => {
    section.species.forEach(species => speciesCardSpecs.push({ section, species }));
    (section.bonusSpecies || []).forEach(species => speciesCardSpecs.push({ section, species }));
  });

  const allTitles = [
    ...speciesCardSpecs.map(spec => titleFor(spec.section.division, spec.species, spec.section.ageBracket)),
    ...CHAMPION_TITLES,
  ];

  const fetchResultsForTitle = async (title) => {
    const item = categoryByTitle[title];
    if (!item) return { title, rows: [] };
    const body = JSON.stringify({
      catchYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_CATCHES_TABLE_NAME,
      anglerYear: config.generalConfig.CONFIG_GENERAL_FIREBASE_TEAMS_TABLE_NAME,
      numPlaces: REPORT_NUM_PLACES,
      isReport: true,
      ...(item.inputs ? item.inputs.reduce((acc, inp) => ({ ...acc, ...inp }), {}) : {}),
    });
    try {
      const res = await fetch(`${apiUrl}/api/${year}/${item.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      return { title, rows: Array.isArray(data) ? data : Object.values(data) };
    } catch {
      return { title, rows: [] };
    }
  };

  const [resultsList, speciesRecords] = await Promise.all([
    Promise.all(allTitles.map(fetchResultsForTitle)),
    fetch(`${apiUrl}/api/${year}/get_species_records`).then(r => r.json()).catch(() => ({})),
  ]);
  const resultsByTitle = Object.fromEntries(resultsList.map(r => [r.title, r.rows]));

  // --- PDF setup ---
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let cursorY = MARGIN;
  const recordBreakingNotes = []; // { species, angler, hometown, weight, record }

  const ensureSpace = (needed) => {
    if (cursorY + needed > PAGE_H - MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
  };

  // Measures how many lines `text` wraps to at the given font, WITHOUT drawing anything.
  const measureLines = (text, fontSize, fontStyle, width) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, width);
  };

  // Draws pre-measured lines starting at the current cursorY, advancing it as it goes.
  const drawLines = (lines, { fontSize, fontStyle = 'normal', color = DARK, indent = 0, lineHeight = 5 }) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    lines.forEach((line) => {
      doc.text(line, MARGIN + indent, cursorY);
      cursorY += lineHeight;
    });
    doc.setTextColor(...DARK);
  };

  // Measures + immediately draws a simple paragraph (used for one-off notices, not cards).
  const drawParagraph = (text, opts = {}) => {
    const { fontSize = 10, fontStyle = 'normal', color = DARK, indent = 0, lineHeight = 5 } = opts;
    const lines = measureLines(text, fontSize, fontStyle, CONTENT_W - indent);
    ensureSpace(lines.length * lineHeight + 1);
    drawLines(lines, { fontSize, fontStyle, color, indent, lineHeight });
  };

  const drawPartLabel = (text, color = NAVY) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...color);
    doc.text(text, MARGIN, cursorY + 4);
    doc.setTextColor(...DARK);
    cursorY += 8;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, cursorY, PAGE_W - MARGIN, cursorY);
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 0, 0);
    cursorY += 4;
  };

  const drawSectionHeader = (label) => {
    ensureSpace(12);
    doc.setFillColor(...NAVY);
    doc.rect(MARGIN, cursorY, CONTENT_W, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...WHITE);
    doc.text(label, MARGIN + CONTENT_W / 2, cursorY + 6.3, { align: 'center' });
    doc.setTextColor(...DARK);
    cursorY += 9 + 3;
  };

  // Measures a "card" (a bold header line + a list of body lines) without drawing it, so the
  // exact height can be reserved with ensureSpace() before any of it is drawn -- this is what
  // keeps a card's own lines from being split across a page break.
  const measureCard = (headerText, headerOpts, body) => {
    const headerFontSize = headerOpts.fontSize || 12;
    const headerFontStyle = headerOpts.fontStyle || 'bold';
    const headerLineHeight = headerOpts.lineHeight || 5.5;
    const headerLines = measureLines(headerText, headerFontSize, headerFontStyle, CONTENT_W - 7);
    const headerHeight = headerLines.length * headerLineHeight;

    const bodyMeasured = body.map((item) => {
      const fontSize = item.fontSize || 10;
      const indent = item.indent != null ? item.indent : 7;
      const lineHeight = item.lineHeight || 4.8;
      const lines = measureLines(item.text, fontSize, item.fontStyle || 'normal', CONTENT_W - indent);
      return { ...item, lines, lineHeight, indent, fontSize };
    });
    const bodyHeight = bodyMeasured.reduce((sum, b) => sum + b.lines.length * b.lineHeight, 0);

    const paddingTop = 3.5, paddingBottom = 3, headerGap = 1.5;
    const totalHeight = paddingTop + headerHeight + headerGap + bodyHeight + paddingBottom;
    return { headerLines, headerHeight, headerFontSize, headerFontStyle, headerLineHeight, bodyMeasured, paddingTop, paddingBottom, headerGap, totalHeight };
  };

  // Draws a card measured by measureCard(), reserving its exact height first so it never splits.
  const drawMeasuredCard = (measured, headerOpts) => {
    const cardGap = 3;
    ensureSpace(measured.totalHeight + cardGap);
    const cardTop = cursorY;

    doc.setFillColor(...CARD_BG);
    doc.rect(MARGIN, cardTop, CONTENT_W, measured.totalHeight, 'F');
    doc.setFillColor(...(headerOpts.accentColor || NAVY));
    doc.rect(MARGIN, cardTop, 1.8, measured.totalHeight, 'F');

    cursorY = cardTop + measured.paddingTop;
    drawLines(measured.headerLines, {
      fontSize: measured.headerFontSize, fontStyle: measured.headerFontStyle,
      color: headerOpts.color || NAVY, indent: 7, lineHeight: measured.headerLineHeight,
    });

    cursorY = cardTop + measured.paddingTop + measured.headerHeight + measured.headerGap;
    measured.bodyMeasured.forEach((b) => {
      drawLines(b.lines, { fontSize: b.fontSize, fontStyle: b.fontStyle || 'normal', color: b.color || DARK, indent: b.indent, lineHeight: b.lineHeight });
    });

    cursorY = cardTop + measured.totalHeight + cardGap;
  };

  // Formats one place's result line, plus a separate record-breaking note line when the
  // species/weight combination beats the tournament record on file (kept as its own line,
  // rather than appended to the result line, so neither line gets unreasonably long). Release
  // species (Blue Marlin/White Marlin/Sailfish/Tarpon) have no weigh-in, so no record check.
  const formatEntry = (label, row, species, isRelease, includeBoat) => {
    const boatPart = includeBoat && row.boat ? `, Boat: ${row.boat}` : '';
    if (isRelease) {
      return { line: `${label}: ${row.angler} (${row.hometown}${boatPart}) -- ${row.points} release points`, recordNote: null };
    }
    const weight = parseFloat(row.weight);
    const record = speciesRecords[species];
    let recordNote = null;
    if (record !== undefined && !isNaN(weight) && weight > record) {
      recordNote = `NEW TOURNAMENT RECORD (previous record: ${record} lbs)`;
      recordBreakingNotes.push({ species, angler: row.angler, hometown: row.hometown, weight: row.weight, record });
    }
    return {
      line: `${label}: ${row.angler} (${row.hometown}${boatPart}) -- ${row.weight} lbs, ${row.length} in / ${row.girth} in girth`,
      recordNote,
    };
  };

  const buildSpeciesCardData = (section, species) => {
    const title = titleFor(section.division, species, section.ageBracket);
    const rows = resultsByTitle[title] || [];
    const isRelease = section.division === 'Offshore' && RELEASE_SPECIES.has(species);
    const includeBoat = section.division === 'Offshore';

    const body = [];
    if (rows.length === 0) {
      body.push({ text: 'No qualifying catch in this division', fontStyle: 'italic', color: GRAY });
    } else {
      const winner = rows[0];
      const runnerUp = rows[1];
      if (runnerUp) {
        const { line, recordNote } = formatEntry('RUNNER-UP', runnerUp, species, isRelease, includeBoat);
        body.push({ text: line, color: DARK });
        if (recordNote) body.push({ text: recordNote, fontStyle: 'bold', color: GOLD, indent: 11 });
      } else {
        body.push({ text: 'RUNNER-UP: No second qualifying catch', fontStyle: 'italic', color: GRAY });
      }
      const { line, recordNote } = formatEntry('WINNER', winner, species, isRelease, includeBoat);
      body.push({ text: line, fontStyle: 'bold', color: DARK });
      if (recordNote) body.push({ text: recordNote, fontStyle: 'bold', color: GOLD, indent: 11 });
    }
    return { headerText: species, headerOpts: { fontSize: 12, color: NAVY, accentColor: NAVY }, body };
  };

  // --- Title card ---
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, cursorY, CONTENT_W, 32, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...WHITE);
  doc.text(tournamentName || `${year} Deepsea Roundup`, MARGIN + CONTENT_W / 2, cursorY + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Announcer Script -- Final Results', MARGIN + CONTENT_W / 2, cursorY + 20, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setTextColor(200, 205, 225);
  doc.text(`Generated: ${generatedAt}`, MARGIN + CONTENT_W / 2, cursorY + 27, { align: 'center' });
  doc.setTextColor(...DARK);
  cursorY += 32 + 4;

  // --- Read-in-order reminder ---
  doc.setFillColor(...GOLD_BG);
  doc.rect(MARGIN, cursorY, CONTENT_W, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...GOLD);
  doc.text('READ THIS SCRIPT FROM TOP TO BOTTOM, IN ORDER.', MARGIN + CONTENT_W / 2, cursorY + 6, { align: 'center' });
  doc.setTextColor(...DARK);
  cursorY += 9 + 4;

  // --- Record-breaking disclaimer ---
  drawParagraph(
    'NEW TOURNAMENT RECORD tags mark catches that beat the on-file record. Records are only updated after the event, so all scoring above still uses the pre-event value.',
    { fontSize: 8.5, fontStyle: 'italic', color: GRAY, lineHeight: 4.2 }
  );
  cursorY += 2;

  // --- Part 1: Division Awards ---
  drawPartLabel('PART 1 -- DIVISION AWARDS', NAVY);

  DIVISION_SECTIONS.forEach((section) => {
    const cardsData = section.species.map((species) => buildSpeciesCardData(section, species));
    (section.bonusSpecies || []).forEach((species) => {
      const title = titleFor(section.division, species, section.ageBracket);
      if ((resultsByTitle[title] || []).length > 0) {
        cardsData.push(buildSpeciesCardData(section, species));
      }
    });

    const measuredCards = cardsData.map((c) => measureCard(c.headerText, c.headerOpts, c.body));
    const sectionHeaderHeight = 12;
    const totalSectionHeight = sectionHeaderHeight + measuredCards.reduce((sum, m) => sum + m.totalHeight + 3, 0);
    const fitsOnFreshPage = totalSectionHeight <= PAGE_H - MARGIN * 2;
    const isNearTopOfPage = cursorY <= MARGIN + 1;
    const remainingSpace = PAGE_H - MARGIN - cursorY;

    // Start short divisions on a fresh page rather than letting them split after just a card
    // or two -- long divisions (Offshore) won't fit on any single page anyway, so they're left
    // to paginate naturally (each individual card still can't split, just the division as a
    // whole spans pages, which isn't the confusing case being avoided here).
    if (!isNearTopOfPage && fitsOnFreshPage && totalSectionHeight > remainingSpace) {
      doc.addPage();
      cursorY = MARGIN;
    }

    drawSectionHeader(section.label);
    cardsData.forEach((c, i) => drawMeasuredCard(measuredCards[i], c.headerOpts));
  });

  drawParagraph(
    'Note: Sailfish and Tarpon each appear twice -- once above as an individual Offshore species trophy (release points), and again below in the Billfish/Tarpon Release Division (a boat competition, scored independently).',
    { fontSize: 8.5, fontStyle: 'italic', color: GRAY, lineHeight: 4.2 }
  );

  // --- Part 2: Overall Tournament Champions ---
  doc.addPage();
  cursorY = MARGIN;
  drawPartLabel('PART 2 -- OVERALL TOURNAMENT CHAMPIONS', NAVY);

  const formatBaySurfGC = (row) => `${row.angler} (${row.hometown}) -- Total Weight: ${row.totalWeight} lbs`;
  const formatOffshoreGC = (row) => `${row.angler} (${row.hometown}${row.boatName ? `, Boat: ${row.boatName}` : ''}) -- ${row.points} pts -- ${row.speciesContributionSummary || ''}`;
  const formatTWA = (row) => `${row.angler} (${row.hometown}) -- ${row.trophySummary || ''} -- ${row.points} pts`;
  const formatRelease = (row) => `${row.boatName} -- ${row.totalPoints} pts -- Last Catch: ${row.latestRelease ? formatCentral(row.latestRelease, 'M/D/YY h:mm A') : 'N/A'}`;

  const formatterForTitle = (title) => {
    if (title.includes('Bay/Surf Division Grand Champion')) return formatBaySurfGC;
    if (title.includes('Offshore Division Grand Champion')) return formatOffshoreGC;
    if (title === 'Top Woman Angler') return formatTWA;
    return formatRelease; // Billfish/Tarpon Release Division
  };

  let announcementNumber = 1;

  CHAMPION_TITLES.forEach((title) => {
    const rows = resultsByTitle[title] || [];
    const winner = rows[0];
    const runnerUp = rows[1];
    const formatter = formatterForTitle(title);

    if (title === 'Top Woman Angler') {
      const winnerText = winner ? formatter(winner) : 'No qualifying angler';
      const runnerUpText = runnerUp ? formatter(runnerUp) : 'No qualifying angler';
      const body = [
        { text: `Champion: ${winnerText}`, fontStyle: 'bold', color: DARK },
        { text: `Runner-Up: ${runnerUpText}`, color: DARK },
      ];
      const measured = measureCard(`${announcementNumber}. ${title}`, { fontSize: 12.5, color: NAVY }, body);
      drawMeasuredCard(measured, { accentColor: GOLD });
      announcementNumber += 1;
    } else {
      const runnerUpText = runnerUp ? formatter(runnerUp) : 'No qualifying entry';
      const winnerText = winner ? formatter(winner) : 'No qualifying entry';

      const ruMeasured = measureCard(
        `${announcementNumber}. ${title} -- Runner-Up`,
        { fontSize: 12, color: NAVY },
        [{ text: runnerUpText, color: DARK }]
      );
      drawMeasuredCard(ruMeasured, { accentColor: NAVY });
      announcementNumber += 1;

      const chMeasured = measureCard(
        `${announcementNumber}. ${title} -- Champion`,
        { fontSize: 12, color: NAVY },
        [{ text: winnerText, fontStyle: 'bold', color: DARK }]
      );
      drawMeasuredCard(chMeasured, { accentColor: GOLD });
      announcementNumber += 1;
    }
  });

  // --- Part 3: Tournament Records ---
  if (recordBreakingNotes.length > 0) {
    doc.addPage();
    cursorY = MARGIN;
    drawPartLabel('PART 3 -- TOURNAMENT RECORDS', GOLD);
    drawParagraph(
      'These catches beat the on-file tournament record. Records are updated manually after the event -- none of the scoring in this report reflects these new values.',
      { fontSize: 8.5, fontStyle: 'italic', color: GRAY, lineHeight: 4.2 }
    );
    cursorY += 2;

    recordBreakingNotes.forEach((note) => {
      const measured = measureCard(
        `${note.species} -- ${note.angler} (${note.hometown})`,
        { fontSize: 11.5, color: NAVY },
        [{ text: `${note.weight} lbs (previous record: ${note.record} lbs)`, fontStyle: 'bold', color: GOLD }]
      );
      drawMeasuredCard(measured, { accentColor: GOLD });
    });
  }

  // --- Page numbers ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' });
    doc.setTextColor(0);
  }

  doc.save(`${year}_DSR_Final_Announcer_Report_${centralTime().format('YYYY-MM-DD_HHmm')}.pdf`);
};
