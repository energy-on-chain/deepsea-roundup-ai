/**
 * Email notification service (SMTP via nodemailer).
 *
 * Configured entirely via env vars -- SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS /
 * SMTP_FROM. If those aren't set, sendMail logs a warning and no-ops instead of throwing,
 * so a registration flow never breaks just because email isn't configured yet.
 */

const nodemailer = require('nodemailer');

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = parseInt(SMTP_PORT || '587', 10);
  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // true for 465 (implicit TLS), false for 587/others (STARTTLS)
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return _transporter;
}

async function sendMail({ to, subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(`Email not sent (SMTP not configured): "${subject}" to ${to}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent: "${subject}" to ${to}`);
  } catch (error) {
    console.error(`Error sending email ("${subject}" to ${to}):`, error);
  }
}

// Fixed internal recipient list for sponsor-registration notifications.
const SPONSOR_NOTIFICATION_RECIPIENTS = [
  'support@customtournamentsolutions.com',
  'cody@arrowheadecology.com',
  'matthew@deepwaterdigital.tech',
];

async function notifySponsorRegistered(sponsorData) {
  const { sponsorName, selectedTier, selectedSponsorships, totalFee, email, phone } = sponsorData;

  const subject = `New Sponsor Registration: ${sponsorName}`;
  const sponsorshipsLine = Array.isArray(selectedSponsorships) && selectedSponsorships.length > 0
    ? selectedSponsorships.join(', ')
    : 'None';

  const text = [
    'A new sponsor has registered on the Deep Sea Roundup site.',
    '',
    `Sponsor: ${sponsorName}`,
    `Tier: ${selectedTier || 'N/A'}`,
    `Additional Sponsorships: ${sponsorshipsLine}`,
    `Total Fee: $${totalFee || 0}`,
    `Email: ${email || 'N/A'}`,
    `Phone: ${phone || 'N/A'}`,
  ].join('\n');

  await sendMail({
    to: SPONSOR_NOTIFICATION_RECIPIENTS.join(', '),
    subject,
    text,
  });
}

module.exports = { sendMail, notifySponsorRegistered };
