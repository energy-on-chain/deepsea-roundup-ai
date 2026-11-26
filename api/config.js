/**
 * config.js — one place that decides which environment we are in and where
 * each secret comes from.
 *
 * Cloud Run (staging / production):
 *   APP_ENV                staging | production        (plain env var)
 *   STORAGE_BUCKET         Firebase default bucket      (plain env var)
 *   ADMIN_EMAILS           comma-separated allowlist    (plain env var)
 *   STRIPE_SECRET_KEY      from Secret Manager
 *   STRIPE_WEBHOOK_SECRET  from Secret Manager
 *   RESEND_API_KEY         from Secret Manager (read by services/emailService.js)
 *   EMAIL_FROM             sender address for Resend    (plain env var)
 *   Firebase Admin uses the service's built-in identity — no key needed.
 *
 * Local dev / legacy Heroku: falls back to the old REACT_APP_* variables in
 * the root .env so nothing breaks before cutover.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const env = process.env.APP_ENV || process.env.REACT_APP_NODE_ENV || 'staging';
if (env !== 'staging' && env !== 'production') {
  throw new Error(`APP_ENV must be "staging" or "production", got "${env}"`);
}
const isProd = env === 'production';
const SUFFIX = isProd ? 'PRODUCTION' : 'STAGING';

const legacy = (name) => process.env[`REACT_APP_${name}_${SUFFIX}`];

// Old-style service account pasted into env vars (Heroku/local). Cloud Run leaves this null.
const legacyServiceAccount = legacy('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')
  ? {
      type: legacy('GOOGLE_SERVICE_ACCOUNT_TYPE'),
      project_id: legacy('GOOGLE_SERVICE_ACCOUNT_PROJECT_ID'),
      private_key_id: legacy('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID'),
      private_key: legacy('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
      client_email: legacy('GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL'),
      client_id: legacy('GOOGLE_SERVICE_ACCOUNT_CLIENT_ID'),
      auth_uri: legacy('GOOGLE_SERVICE_ACCOUNT_AUTH_URI'),
      token_uri: legacy('GOOGLE_SERVICE_ACCOUNT_TOKEN_URI'),
      auth_provider_x509_cert_url: legacy('GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL'),
      client_x509_cert_url: legacy('GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL'),
      universe_domain: legacy('GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN'),
    }
  : null;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  || process.env[isProd ? 'REACT_APP_STRIPE_PRIVATE_KEY_PRODUCTION' : 'REACT_APP_STRIPE_PRIVATE_KEY_TESTING'];
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  || process.env[isProd ? 'REACT_APP_STRIPE_WEBHOOK_SECRET_KEY_PRODUCTION' : 'REACT_APP_STRIPE_WEBHOOK_SECRET_KEY_TESTING'];

// Where the site is served from. Used for CORS and to build Stripe return URLs.
const allowedOrigins = [
  process.env.CLIENT_URL,
  legacy('CLIENT_URL'),
  legacy('SERVER_URL'),
  'https://deepsearoundup.customtournamentsolutions.com',
  'https://www.deepsearoundup.customtournamentsolutions.com',
  'https://deepsea-roundup-ai-dev.web.app',
  'https://deepsea-roundup-ai-dev.firebaseapp.com',
  'https://deepsea-roundup-ai-prod.web.app',
  'https://deepsea-roundup-ai-prod.firebaseapp.com',
  'https://deepsea-roundup-v3-staging-980ad25bef47.herokuapp.com',
  'https://deepsea-roundup-v3-prod-38a284cee946.herokuapp.com',
  'http://localhost:3000',
].filter(Boolean).map((u) => u.replace(/\/$/, ''));

// Default return URL for Stripe when the request carries no usable Origin header.
const defaultClientUrl = (process.env.CLIENT_URL || legacy('CLIENT_URL') || 'http://localhost:3000').replace(/\/$/, '');

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

module.exports = {
  env,
  isProd,
  legacyServiceAccount,
  storageBucket: process.env.STORAGE_BUCKET || legacy('FIREBASE_STORAGE_BUCKET'),
  stripeSecretKey,
  stripeWebhookSecret,
  allowedOrigins,
  defaultClientUrl,
  adminEmails,
};
