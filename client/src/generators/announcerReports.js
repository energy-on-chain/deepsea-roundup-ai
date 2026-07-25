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
 * Visual style follows the reference announcer script example: a navy title card, rounded
 * navy division headers with a gold accent stripe, and a light "card" treatment (colored left
 * accent bar + numbered badge) for each Part 2 champion entry.
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

// Part 1 division order + a short subtitle line shown under each division's header card.
// Fly Fishing and Kayak have no Junior split -- adults and juniors compete together there.
const DIVISION_SECTIONS = [
  { label: 'Junior Bay/Surf Division', subtitle: '7 species in order -- runner-up announced before winner', division: 'Bay/Surf', ageBracket: 'Junior', species: BAY_SURF_SPECIES, bonusSpecies: BAY_SURF_BONUS_SPECIES },
  { label: 'Adult Bay/Surf Division', subtitle: '7 species in order -- runner-up announced before winner', division: 'Bay/Surf', ageBracket: 'Adult', species: BAY_SURF_SPECIES, bonusSpecies: BAY_SURF_BONUS_SPECIES },
  { label: 'Fly Fishing Division', subtitle: 'No Junior fly-fishing division', division: 'Flyfishing', ageBracket: 'Adult', species: FLY_KAYAK_SPECIES },
  { label: 'Kayak Division', subtitle: 'Runner-up announced before winner', division: 'Kayak', ageBracket: 'Adult', species: FLY_KAYAK_SPECIES },
  { label: 'Junior Offshore Division', subtitle: '17 species in order -- runner-up announced before winner', division: 'Offshore', ageBracket: 'Junior', species: OFFSHORE_SPECIES },
  { label: 'Adult Offshore Division', subtitle: '17 species in order -- runner-up announced before winner', division: 'Offshore', ageBracket: 'Adult', species: OFFSHORE_SPECIES },
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
const TEAL = [13, 92, 100];
const GOLD = [163, 116, 8];
const GRAY_DARK = [95, 101, 113];
const GRAY_TEXT = [122, 126, 136];
const CARD_BG = [239, 243, 248];
const LEGEND_BG = [235, 240, 245];
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
  const MARGIN = 13;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const GAP = 4; // standard breathing room between any two elements
  let cursorY = MARGIN;
  const recordBreakingNotes = []; // { species, angler, hometown, weight, record }

  const ensureSpace = (needed) => {
    if (cursorY + needed > PAGE_H - MARGIN) {
      doc.addPage();
      cursorY = MARGIN;
    }
  };

  const measureLines = (text, fontSize, fontStyle, width) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, width);
  };

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

  const drawParagraph = (text, opts = {}) => {
    const { fontSize = 9.5, fontStyle = 'normal', color = DARK, indent = 0, lineHeight = 4.4 } = opts;
    const lines = measureLines(text, fontSize, fontStyle, CONTENT_W - indent);
    ensureSpace(lines.length * lineHeight + 1);
    drawLines(lines, { fontSize, fontStyle, color, indent, lineHeight });
  };

  // Draws `prefix` in `prefixColor` immediately followed by `rest` in `restColor` on the same
  // line, at the current cursorY (does not wrap -- only used for short label+value lines).
  const drawTwoTone = (prefix, prefixColor, rest, restColor, { fontSize = 10, fontStyle = 'bold', restStyle = 'normal', indent = 0 } = {}) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...prefixColor);
    doc.text(prefix, MARGIN + indent, cursorY);
    const prefixWidth = doc.getTextWidth(prefix);
    doc.setFont('helvetica', restStyle);
    doc.setTextColor(...restColor);
    doc.text(rest, MARGIN + indent + prefixWidth, cursorY);
    doc.setTextColor(...DARK);
  };

  const drawPartLabel = (text) => {
    ensureSpace(13);
    doc.setFillColor(...TEAL);
    doc.rect(MARGIN, cursorY, CONTENT_W, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...WHITE);
    doc.text(text, MARGIN + 3, cursorY + 6.2);
    doc.setTextColor(...DARK);
    cursorY += 9 + GAP;
  };

  // Rounded navy card for a division header: number/name large + a lighter subtitle line,
  // with a gold accent stripe down the left edge -- matches the reference script's division
  // headers rather than the plain full-bleed bar used previously.
  const drawDivisionHeader = (label, subtitle) => {
    const boxHeight = 15;
    ensureSpace(boxHeight + GAP);
    doc.setFillColor(...NAVY);
    doc.roundedRect(MARGIN, cursorY, CONTENT_W, boxHeight, 2, 2, 'F');
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, cursorY, 2.2, boxHeight, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...WHITE);
    doc.text(label, MARGIN + 6, cursorY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.7);
    doc.setTextColor(190, 200, 220);
    doc.text(subtitle, MARGIN + 6, cursorY + 12);
    doc.setTextColor(...DARK);
    cursorY += boxHeight + GAP;
  };

  // Measures a plain (no background) Part 1 species entry so its exact height can be reserved
  // before drawing, keeping it from splitting across a page break.
  const measureSpeciesEntry = (headerText, body) => {
    const headerLineHeight = 5;
    const headerLines = measureLines(headerText, 11.5, 'bold', CONTENT_W);
    const headerHeight = headerLines.length * headerLineHeight;

    const bodyMeasured = body.map((item) => {
      const fontSize = item.fontSize || 9.7;
      const indent = item.indent != null ? item.indent : 3;
      const lineHeight = item.lineHeight || 4.15;
      const lines = measureLines(item.text, fontSize, item.fontStyle || 'normal', CONTENT_W - indent);
      return { ...item, lines, lineHeight, indent, fontSize };
    });
    const bodyHeight = bodyMeasured.reduce((sum, b) => sum + b.lines.length * b.lineHeight, 0);

    const headerGap = 1;
    const totalHeight = headerHeight + headerGap + bodyHeight + GAP;
    return { headerLines, headerHeight, headerLineHeight, bodyMeasured, headerGap, totalHeight };
  };

  const drawSpeciesEntry = (measured) => {
    ensureSpace(measured.totalHeight);
    drawLines(measured.headerLines, { fontSize: 11.5, fontStyle: 'bold', color: TEAL, indent: 0, lineHeight: measured.headerLineHeight });
    cursorY += measured.headerGap;
    measured.bodyMeasured.forEach((b) => {
      drawLines(b.lines, { fontSize: b.fontSize, fontStyle: b.fontStyle || 'normal', color: b.color || DARK, indent: b.indent, lineHeight: b.lineHeight });
    });
    cursorY += GAP;
  };

  // Formats one place's result, plus a separate record-breaking note line when the
  // species/weight combination beats the tournament record on file. Release species (Blue
  // Marlin/White Marlin/Sailfish/Tarpon) have no weigh-in, so no record check applies.
  const formatResultLine = (row, species, isRelease, includeBoat) => {
    const boatPart = includeBoat && row.boat ? `, Boat: ${row.boat}` : '';
    if (isRelease) {
      return { line: `${row.angler} (${row.hometown}${boatPart}) -- ${row.points} release points`, recordNote: null };
    }
    const weight = parseFloat(row.weight);
    const record = speciesRecords[species];
    let recordNote = null;
    if (record !== undefined && !isNaN(weight) && weight > record) {
      recordNote = `NEW TOURNAMENT RECORD (previous record: ${record} lbs)`;
      recordBreakingNotes.push({ species, angler: row.angler, hometown: row.hometown, weight: row.weight, record });
    }
    return {
      line: `${row.angler} (${row.hometown}${boatPart}) -- ${row.weight} lbs, ${row.length} in / ${row.girth} in girth`,
      recordNote,
    };
  };

  const buildSpeciesEntryData = (section, species) => {
    const title = titleFor(section.division, species, section.ageBracket);
    const rows = resultsByTitle[title] || [];
    const isRelease = section.division === 'Offshore' && RELEASE_SPECIES.has(species);
    const includeBoat = section.division === 'Offshore';

    const body = [];
    if (rows.length === 0) {
      body.push({ text: 'No qualifying catch in this division', fontStyle: 'italic', color: GRAY_TEXT });
    } else {
      const winner = rows[0];
      const runnerUp = rows[1];
      if (runnerUp) {
        const { line, recordNote } = formatResultLine(runnerUp, species, isRelease, includeBoat);
        body.push({ text: `RUNNER-UP  ${line}`, color: GRAY_DARK });
        if (recordNote) body.push({ text: recordNote, fontStyle: 'bold', color: GOLD, indent: 8 });
      }
      const { line, recordNote } = formatResultLine(winner, species, isRelease, includeBoat);
      body.push({ text: `WINNER  ${line}`, fontStyle: 'bold', color: GOLD });
      if (recordNote) body.push({ text: recordNote, fontStyle: 'bold', color: GOLD, indent: 8 });
      if (!runnerUp) {
        body.push({ text: 'No runner-up -- sole qualifying catch.', fontStyle: 'italic', color: GRAY_TEXT });
      }
    }
    return { headerText: species, body };
  };

  // --- Title card (rounded, "read top to bottom" folded into the subtitle) ---
  const titleCardHeight = 27;
  doc.setFillColor(...NAVY);
  doc.roundedRect(MARGIN, cursorY, CONTENT_W, titleCardHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text(tournamentName || `${year} Deepsea Roundup`, MARGIN + CONTENT_W / 2, cursorY + 10.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text('Final Results -- Announcer Script -- read top to bottom, in order', MARGIN + CONTENT_W / 2, cursorY + 17.5, { align: 'center' });
  doc.setFontSize(8.3);
  doc.setTextColor(195, 202, 222);
  doc.text(`Generated: ${generatedAt}`, MARGIN + CONTENT_W / 2, cursorY + 23, { align: 'center' });
  doc.setTextColor(...DARK);
  cursorY += titleCardHeight + GAP;

  // --- Legend / notices box ---
  const legendText1 = 'RUNNER-UP is announced first, WINNER second.';
  const legendText2 = 'Species with no qualifying catch are marked accordingly. Fly Fishing has no Junior division. NEW TOURNAMENT RECORD tags mark catches beating the on-file record -- records are only updated after the event, so scoring above still uses the pre-event value.';
  const legendLines2 = measureLines(legendText2, 8.3, 'italic', CONTENT_W - 6);
  const legendHeight = 6 + 4.4 + legendLines2.length * 3.9 + 4;
  ensureSpace(legendHeight + GAP);
  doc.setFillColor(...LEGEND_BG);
  doc.roundedRect(MARGIN, cursorY, CONTENT_W, legendHeight, 2, 2, 'F');
  cursorY += 5.5;
  drawLines(measureLines(legendText1, 9, 'bold', CONTENT_W - 6), { fontSize: 9, fontStyle: 'bold', color: DARK, indent: 3, lineHeight: 4.4 });
  cursorY += 1;
  drawLines(legendLines2, { fontSize: 8.3, fontStyle: 'italic', color: GRAY_TEXT, indent: 3, lineHeight: 3.9 });
  cursorY += 4;
  cursorY += GAP;

  // --- Part 1: Division Awards ---
  drawPartLabel('PART 1 -- DIVISION AWARDS (announced first, by species)');

  DIVISION_SECTIONS.forEach((section) => {
    const entriesData = section.species.map((species) => buildSpeciesEntryData(section, species));
    (section.bonusSpecies || []).forEach((species) => {
      const title = titleFor(section.division, species, section.ageBracket);
      if ((resultsByTitle[title] || []).length > 0) {
        entriesData.push(buildSpeciesEntryData(section, species));
      }
    });

    const measuredEntries = entriesData.map((e) => measureSpeciesEntry(e.headerText, e.body));
    const divisionHeaderHeight = 15 + GAP;
    const remainingSpace = PAGE_H - MARGIN - cursorY;
    const isNearTopOfPage = cursorY <= MARGIN + 1;

    // Only force a fresh page if there isn't even room for the header plus the first few
    // entries -- starting a division that then breaks after just one entry is the confusing
    // case being avoided; a division that shows most of its entries before a natural page
    // turn (like Offshore always will, since 17 species never fit on one page regardless) is
    // fine.
    const PREVIEW_ENTRY_COUNT = 3;
    const previewHeight = divisionHeaderHeight + measuredEntries
      .slice(0, PREVIEW_ENTRY_COUNT)
      .reduce((sum, m) => sum + m.totalHeight, 0);

    if (!isNearTopOfPage && remainingSpace < previewHeight) {
      doc.addPage();
      cursorY = MARGIN;
    }

    drawDivisionHeader(section.label, section.subtitle);
    measuredEntries.forEach((m) => drawSpeciesEntry(m));
  });

  drawParagraph(
    'Note: Sailfish and Tarpon each appear twice -- once above as an individual Offshore species trophy (release points), and again below in the Billfish/Tarpon Release Division (a boat competition, scored independently).',
    { fontSize: 8.3, fontStyle: 'italic', color: GRAY_TEXT, lineHeight: 3.9 }
  );

  // --- Part 2: Overall Tournament Champions ---
  doc.addPage();
  cursorY = MARGIN;
  drawPartLabel('PART 2 -- OVERALL CHAMPIONS (announced last, in this exact order)');

  const formatBaySurfGC = (row) => `Total Weight: ${row.totalWeight} lbs`;
  const formatOffshoreGC = (row) => `Boat: ${row.boatName || 'N/A'} -- ${row.points} pts -- ${row.speciesContributionSummary || ''}`;
  const formatTWADetail = (row) => `${row.trophySummary || ''} -- ${row.points} pts`;
  const formatRelease = (row) => `Boat competition -- ${row.totalPoints} pts -- Last Catch: ${row.latestRelease ? formatCentral(row.latestRelease, 'M/D/YY h:mm A') : 'N/A'}`;

  const formatterForTitle = (title) => {
    if (title.includes('Bay/Surf Division Grand Champion')) return formatBaySurfGC;
    if (title.includes('Offshore Division Grand Champion')) return formatOffshoreGC;
    return formatRelease; // Billfish/Tarpon Release Division
  };

  // Bay/Surf and Offshore Grand Champion rows are angler-based (angler/hometown). Billfish and
  // Tarpon Release are BOAT competitions -- their rows have no angler/hometown at all, only a
  // boatName, so they need their own "who" line rather than the angler-based one.
  const primaryLineForTitle = (title, row) => {
    if (title.includes('Release Division')) return row.boatName || 'Unknown';
    return `${row.angler} -- ${row.hometown}`;
  };

  // Measures a Part 2 "card": light background, colored left accent bar, numbered badge, a
  // title line, and one or more detail lines.
  const measureChampionCard = (number, titleText, detailLines, accentColor) => {
    const titleLines = measureLines(titleText, 11.5, 'bold', CONTENT_W - 18);
    const titleHeight = titleLines.length * 5;
    const detailMeasured = detailLines.map((d) => {
      const lines = measureLines(d.text, d.fontSize || 9.3, d.fontStyle || 'normal', CONTENT_W - 18);
      return { ...d, lines, lineHeight: d.lineHeight || 4.1 };
    });
    const detailHeight = detailMeasured.reduce((sum, d) => sum + d.lines.length * d.lineHeight, 0);

    const padding = 3.2, titleGap = 1;
    const innerHeight = titleHeight + titleGap + detailHeight;
    const totalHeight = Math.max(innerHeight + padding * 2, 13);
    return { number, titleText, titleLines, titleHeight, detailMeasured, padding, innerHeight, totalHeight, accentColor };
  };

  const drawChampionCard = (measured) => {
    ensureSpace(measured.totalHeight + GAP);
    const cardTop = cursorY;

    doc.setFillColor(...CARD_BG);
    doc.roundedRect(MARGIN, cardTop, CONTENT_W, measured.totalHeight, 1.5, 1.5, 'F');
    doc.setFillColor(...measured.accentColor);
    doc.roundedRect(MARGIN, cardTop, 1.8, measured.totalHeight, 1, 1, 'F');

    // Numbered badge, vertically centered on the card.
    const badgeSize = 7.2;
    const badgeX = MARGIN + 4;
    const badgeY = cardTop + (measured.totalHeight - badgeSize) / 2;
    doc.setFillColor(...measured.accentColor);
    doc.roundedRect(badgeX, badgeY, badgeSize, badgeSize, 1.4, 1.4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...WHITE);
    doc.text(String(measured.number), badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 1.2, { align: 'center' });
    doc.setTextColor(...DARK);

    // Content, starting after the badge.
    cursorY = cardTop + measured.padding;
    drawLines(measured.titleLines, { fontSize: 11.5, fontStyle: 'bold', color: NAVY, indent: 15, lineHeight: 5 });
    cursorY += measured.titleGap || 1;
    measured.detailMeasured.forEach((d) => {
      drawLines(d.lines, { fontSize: d.fontSize || 9.3, fontStyle: d.fontStyle || 'normal', color: d.color || GRAY_TEXT, indent: 15, lineHeight: d.lineHeight });
    });

    cursorY = cardTop + measured.totalHeight + GAP;
  };

  let announcementNumber = 1;

  CHAMPION_TITLES.forEach((title) => {
    const rows = resultsByTitle[title] || [];
    const winner = rows[0];
    const runnerUp = rows[1];

    if (title === 'Top Woman Angler') {
      const detailLines = [];
      if (winner) {
        detailLines.push({ text: `Winner: ${winner.angler} -- ${winner.hometown} -- ${formatTWADetail(winner)}`, color: DARK, fontStyle: 'bold' });
      } else {
        detailLines.push({ text: 'Winner: No qualifying angler', color: GRAY_TEXT, fontStyle: 'italic' });
      }
      if (runnerUp) {
        detailLines.push({ text: `Runner-up: ${runnerUp.angler} -- ${runnerUp.hometown} -- ${formatTWADetail(runnerUp)}`, color: GRAY_TEXT });
      } else {
        detailLines.push({ text: 'Runner-up: No qualifying angler', color: GRAY_TEXT, fontStyle: 'italic' });
      }
      const measured = measureChampionCard(announcementNumber, 'Top Woman Angler', detailLines, GOLD);
      drawChampionCard(measured);
      announcementNumber += 1;
    } else {
      const formatter = formatterForTitle(title);

      const ruDetail = runnerUp
        ? [{ text: primaryLineForTitle(title, runnerUp), color: DARK, fontStyle: 'bold' }, { text: formatter(runnerUp), color: GRAY_TEXT }]
        : [{ text: 'No qualifying entry', color: GRAY_TEXT, fontStyle: 'italic' }];
      const ruMeasured = measureChampionCard(announcementNumber, `${title} -- Runner-Up`, ruDetail, GRAY_DARK);
      drawChampionCard(ruMeasured);
      announcementNumber += 1;

      const chDetail = winner
        ? [{ text: primaryLineForTitle(title, winner), color: DARK, fontStyle: 'bold' }, { text: formatter(winner), color: GRAY_TEXT }]
        : [{ text: 'No qualifying entry', color: GRAY_TEXT, fontStyle: 'italic' }];
      const chMeasured = measureChampionCard(announcementNumber, `${title} -- Champion`, chDetail, GOLD);
      drawChampionCard(chMeasured);
      announcementNumber += 1;
    }
  });

  // --- Part 3: Tournament Records ---
  if (recordBreakingNotes.length > 0) {
    doc.addPage();
    cursorY = MARGIN;
    drawPartLabel('PART 3 -- TOURNAMENT RECORDS');
    drawParagraph(
      'These catches beat the on-file tournament record. Records are updated manually after the event -- none of the scoring in this report reflects these new values.',
      { fontSize: 8.3, fontStyle: 'italic', color: GRAY_TEXT, lineHeight: 3.9 }
    );
    cursorY += GAP - 1.5;

    recordBreakingNotes.forEach((note, i) => {
      const measured = measureChampionCard(
        i + 1,
        `${note.species} -- ${note.angler}`,
        [
          { text: note.hometown, color: GRAY_TEXT },
          { text: `${note.weight} lbs (previous record: ${note.record} lbs)`, fontStyle: 'bold', color: GOLD },
        ],
        GOLD
      );
      drawChampionCard(measured);
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
