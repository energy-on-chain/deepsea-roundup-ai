/**
 * auth.js — server-side admin check.
 *
 * The admin page signs in with Firebase Auth; the browser attaches the user's
 * ID token as `Authorization: Bearer <token>` (see client/src/firebase.js).
 * Here we verify that token and, when ADMIN_EMAILS is set, that the email is
 * on the allowlist. Without this, anyone could call /api/:year/admin_* directly.
 */

const { getAuth } = require('firebase-admin/auth');
const config = require('../config');

async function readAdmin(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  if (!match) return null;
  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    const email = (decoded.email || '').toLowerCase();
    if (config.adminEmails.length && !config.adminEmails.includes(email)) return null;
    return { uid: decoded.uid, email };
  } catch (err) {
    return null;
  }
}

// Rejects the request unless a signed-in admin made it.
async function requireAdmin(req, res, next) {
  const user = await readAdmin(req);
  if (!user) return res.status(401).json({ error: 'Admin sign-in required' });
  req.adminUser = user;
  next();
}

// Lets the request through either way; sets req.adminUser when an admin made it.
async function optionalAdmin(req, res, next) {
  req.adminUser = await readAdmin(req);
  next();
}

if (!config.adminEmails.length) {
  console.warn('ADMIN_EMAILS is not set: any signed-in Firebase user counts as an admin.');
}

module.exports = { requireAdmin, optionalAdmin };
