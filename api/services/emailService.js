/**
 * Email notification service (Resend).
 *
 * Configured entirely via env vars -- RESEND_API_KEY / EMAIL_FROM. If RESEND_API_KEY isn't
 * set, sendMail logs a warning and no-ops instead of throwing, so a registration flow never
 * breaks just because email isn't configured yet.
 */

const { Resend } = require('resend');

let _resend = null;

function getClient() {
  if (_resend) return _resend;
  if (!process.env.RESEND_API_KEY) return null;
  _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

async function sendMail({ to, subject, text, html }) {
  const resend = getClient();
  if (!resend) {
    console.warn(`Email not sent (RESEND_API_KEY not configured): "${subject}" to ${to}`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    if (error) {
      console.error(`Error sending email ("${subject}" to ${to}):`, error);
      return;
    }
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
    to: SPONSOR_NOTIFICATION_RECIPIENTS,
    subject,
    text,
  });
}

module.exports = { sendMail, notifySponsorRegistered };
