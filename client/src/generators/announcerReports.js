/**
 * announcerReports.js
 *
 * End-of-tournament announcer script.
 *
 * A read-aloud script, not a data table: Part 1 runs species-by-species through every
 * division's individual trophies (runner-up announced before the winner, and every
 * "official" species gets a card even with no qualifying catch); Part 2 runs through the
 * overall tournament champions (Grand Champions, Top Woman Angler, Billfish/Tarpon Release).
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

// Part 2 champion order -- each produces a Runner-Up + Champion numbered pair, except
// Top Woman Angler which is announced as a single combined card.
const CHAMPION_TITLES = [
  'Bay/Surf Division Grand Champion (Junior)',
  'Bay/Surf Division Grand Champion (Adult)',
  'Top Woman Angler',
  'Tarpon Release Division',
  'Billfish Release Division',
  'Offshore Division Grand Champion (Junior)',
  'Offshore Division Grand Champion (Adult)',
];

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
    section.species.forEach(species => speciesCardSpecs.push({ section, species, isBonus: false }));
    (section.bonusSpecies || []).forEach(species => speciesCardSpecs.push({ section, species, isBonus: true }));
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

  // --- PDF layout ---
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const MARGIN = 15;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let cursorY = MARGIN;
  const recordBreakingNotes = [];

  const ensureSpace = (needed) => {
    if (cursorY + needed > PAGE_H - MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
  };

  const drawWrappedText = (text, opts = {}) => {
    const { fontSize = 9.5, fontStyle = 'normal', color = [0, 0, 0], lineHeight = 4.5, indent = 0 } = opts;
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_W - indent);
    ensureSpace(lines.length * lineHeight + 1);
    lines.forEach(line => {
      doc.text(line, MARGIN + indent, cursorY);
      cursorY += lineHeight;
    });
    doc.setTextColor(0);
  };

  const drawSectionHeader = (label) => {
    ensureSpace(10);
    doc.setFillColor(2, 19, 62);
    doc.rect(MARGIN, cursorY - 4, CONTENT_W, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(label, MARGIN + 2, cursorY);
    doc.setTextColor(0);
    cursorY += 8;
  };

  // Formats one place's result line, appending a record-breaking note (and logging it for the
  // end-of-report summary) when the species/weight combination beats the tournament record on
  // file. Release species (Blue Marlin/White Marlin/Sailfish/Tarpon) have no weigh-in, so they
  // never get a record check.
  const formatEntryLine = (row, species, isRelease, includeBoat) => {
    const boatPart = includeBoat && row.boat ? `, Boat: ${row.boat}` : '';
    if (isRelease) {
      return `${row.angler} (${row.hometown}${boatPart}) — ${row.points} release points`;
    }
    const weight = parseFloat(row.weight);
    const record = speciesRecords[species];
    let recordNote = '';
    if (record !== undefined && !isNaN(weight) && weight > record) {
      recordNote = `  ⭐ NEW RECORD (previous record: ${record} lbs)`;
      recordBreakingNotes.push(`${species} — ${row.angler} (${row.hometown}): ${row.weight} lbs beats the previous record of ${record} lbs`);
    }
    return `${row.angler} (${row.hometown}${boatPart}) — ${row.weight} lbs, ${row.length} in / ${row.girth} in girth${recordNote}`;
  };

  const renderSpeciesCard = (section, species) => {
    const title = titleFor(section.division, species, section.ageBracket);
    const rows = resultsByTitle[title] || [];
    const isRelease = section.division === 'Offshore' && RELEASE_SPECIES.has(species);
    const includeBoat = section.division === 'Offshore';

    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(2, 19, 62);
    doc.text(species, MARGIN, cursorY);
    doc.setTextColor(0);
    cursorY += 5;

    if (rows.length === 0) {
      drawWrappedText('— No qualifying catch in this division —', { fontStyle: 'italic', color: [130, 130, 130], indent: 4 });
    } else {
      const winner = rows[0];
      const runnerUp = rows[1];
      if (runnerUp) {
        drawWrappedText(`Runner-Up: ${formatEntryLine(runnerUp, species, isRelease, includeBoat)}`, { indent: 4 });
      } else {
        drawWrappedText('Runner-Up: — No second qualifying catch —', { fontStyle: 'italic', color: [130, 130, 130], indent: 4 });
      }
      drawWrappedText(`WINNER: ${formatEntryLine(winner, species, isRelease, includeBoat)}`, { fontStyle: 'bold', indent: 4 });
    }
    cursorY += 2;
  };

  // --- Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(2, 19, 62);
  doc.text(tournamentName || `${year} Deepsea Roundup`, MARGIN, cursorY);
  cursorY += 7;
  doc.setFontSize(12);
  doc.text('Announcer Script — Final Results', MARGIN, cursorY);
  cursorY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(`Generated: ${generatedAt}`, MARGIN, cursorY);
  cursorY += 5;
  doc.setTextColor(0);
  doc.line(MARGIN, cursorY, PAGE_W - MARGIN, cursorY);
  cursorY += 6;

  drawWrappedText(
    'Catches marked ⭐ NEW RECORD exceeded the tournament record on file when this report was generated. Per tournament rules, records are only updated after the event concludes, so all scoring above uses the pre-event record value regardless of any record-breaking catch flagged below.',
    { fontSize: 8, fontStyle: 'italic', color: [140, 100, 0], lineHeight: 4 }
  );
  cursorY += 3;

  drawWrappedText('PART 1 — DIVISION AWARDS', { fontSize: 13, fontStyle: 'bold', color: [2, 19, 62], lineHeight: 6 });
  cursorY += 2;

  // --- Part 1 ---
  DIVISION_SECTIONS.forEach(section => {
    drawSectionHeader(section.label);
    section.species.forEach(species => renderSpeciesCard(section, species));
    (section.bonusSpecies || []).forEach(species => {
      const title = titleFor(section.division, species, section.ageBracket);
      if ((resultsByTitle[title] || []).length > 0) renderSpeciesCard(section, species);
    });
    cursorY += 2;
  });

  ensureSpace(12);
  drawWrappedText(
    'Note: Sailfish and Tarpon each appear twice in this tournament — once above as an individual Offshore species trophy (scored on release points) and again in the separate Billfish/Tarpon Release Division below (a boat competition, scored independently).',
    { fontSize: 8, fontStyle: 'italic', color: [100, 100, 100], lineHeight: 4 }
  );

  // --- Part 2 ---
  doc.addPage();
  cursorY = MARGIN;
  drawWrappedText('PART 2 — OVERALL TOURNAMENT CHAMPIONS', { fontSize: 13, fontStyle: 'bold', color: [2, 19, 62], lineHeight: 6 });
  cursorY += 2;

  const formatBaySurfGC = (row) => `${row.angler} (${row.hometown}) — Total Weight: ${row.totalWeight} lbs`;
  const formatOffshoreGC = (row) => `${row.angler} (${row.hometown}${row.boatName ? `, Boat: ${row.boatName}` : ''}) — ${row.points} pts — ${row.speciesContributionSummary || ''}`;
  const formatTWA = (row) => `${row.angler} (${row.hometown}) — ${row.trophySummary || ''} — ${row.points} pts`;
  const formatRelease = (row) => `${row.boatName} — ${row.totalPoints} pts — Last Catch: ${row.latestRelease ? formatCentral(row.latestRelease, 'M/D/YY h:mm A') : 'N/A'}`;

  const formatterForTitle = (title) => {
    if (title.includes('Bay/Surf Division Grand Champion')) return formatBaySurfGC;
    if (title.includes('Offshore Division Grand Champion')) return formatOffshoreGC;
    if (title === 'Top Woman Angler') return formatTWA;
    return formatRelease; // Billfish/Tarpon Release Division
  };

  const drawNumberedLine = (number, label, text, opts = {}) => {
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(2, 19, 62);
    doc.text(`${number}. ${label}`, MARGIN, cursorY);
    doc.setTextColor(0);
    cursorY += 5;
    drawWrappedText(text, { indent: 5, ...opts });
    cursorY += 2;
  };

  let announcementNumber = 1;

  CHAMPION_TITLES.forEach(title => {
    const rows = resultsByTitle[title] || [];
    const winner = rows[0];
    const runnerUp = rows[1];
    const formatter = formatterForTitle(title);

    if (title === 'Top Woman Angler') {
      const winnerText = winner ? formatter(winner) : '— No qualifying angler —';
      const runnerUpText = runnerUp ? formatter(runnerUp) : '— No qualifying angler —';
      ensureSpace(10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(2, 19, 62);
      doc.text(`${announcementNumber}. ${title}`, MARGIN, cursorY);
      doc.setTextColor(0);
      cursorY += 5;
      drawWrappedText(`Champion: ${winnerText}`, { indent: 5, fontStyle: 'bold' });
      drawWrappedText(`Runner-Up: ${runnerUpText}`, { indent: 5 });
      cursorY += 2;
      announcementNumber += 1;
    } else {
      const runnerUpText = runnerUp ? formatter(runnerUp) : '— No qualifying entry —';
      const winnerText = winner ? formatter(winner) : '— No qualifying entry —';
      drawNumberedLine(announcementNumber, `${title} — Runner-Up`, runnerUpText);
      announcementNumber += 1;
      drawNumberedLine(announcementNumber, `${title} — Champion`, winnerText, { fontStyle: 'bold' });
      announcementNumber += 1;
    }
  });

  // --- Record-breaking summary ---
  if (recordBreakingNotes.length > 0) {
    doc.addPage();
    cursorY = MARGIN;
    drawWrappedText('RECORD-BREAKING CATCHES THIS TOURNAMENT', { fontSize: 12, fontStyle: 'bold', color: [180, 140, 0], lineHeight: 6 });
    drawWrappedText(
      'These catches exceeded the tournament record on file. Records are updated manually after the event -- none of the scoring in this report reflects these new values.',
      { fontSize: 8, fontStyle: 'italic', color: [100, 100, 100], lineHeight: 4 }
    );
    cursorY += 2;
    recordBreakingNotes.forEach(note => drawWrappedText(`⭐ ${note}`, { indent: 2 }));
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
