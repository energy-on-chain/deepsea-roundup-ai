/**
 * collections.js — the public leaderboard, pot, newsfeed and home routes take the
 * Firestore collection to read from the request body (e.g. { catchYear: "catches2026" }).
 * Without a check, anyone could point them at another collection, such as the angler
 * list with its emails and phone numbers. Each known field must name a collection of
 * the expected kind for some year.
 */

const EXPECTED = {
  catchYear: 'catches',
  catchesTableName: 'catches',
  anglerYear: 'anglers',
  teamsYear: 'anglers',
  teamTableName: 'anglers',
  announcementsYear: 'announcements',
  potYear: 'pots',
};

function checkCollectionParams(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object') return next();
  for (const [field, prefix] of Object.entries(EXPECTED)) {
    if (!(field in body)) continue;
    const value = body[field];
    if (typeof value !== 'string' || !new RegExp(`^${prefix}\\d{4}$`).test(value)) {
      return res.status(400).json({ error: `Invalid ${field}` });
    }
  }
  next();
}

module.exports = { checkCollectionParams, EXPECTED };
