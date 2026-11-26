const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const { checkCollectionParams } = require('./middleware/collections');

// FIREBASE ADMIN
// On Cloud Run the service's own identity is used automatically (no key in env).
// Locally / on legacy Heroku the pasted service-account vars are used instead.
admin.initializeApp({
  ...(config.legacyServiceAccount ? { credential: admin.credential.cert(config.legacyServiceAccount) } : {}),
  storageBucket: config.storageBucket,
});

// STRIPE
if (!config.stripeSecretKey) console.warn('STRIPE_SECRET_KEY is not set: checkout will fail.');
const stripe = require('stripe')(config.stripeSecretKey || 'sk_missing');
const webhookSecret = config.stripeWebhookSecret;

// ROUTES
const homeRoutes = require('./routes/homeRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const newsfeedRoutes = require('./routes/newsfeedRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const potRoutes = require('./routes/potRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const port = process.env.PORT || 8000;

// Cloud Run / Firebase Hosting sit in front of us; trust their X-Forwarded-* headers.
app.set('trust proxy', true);

// MIDDLEWARE
app.use(morgan(config.isProd ? 'combined' : 'dev'));

app.use(cors({
  origin: (origin, callback) => {
    // Same-origin requests (via Firebase Hosting) and server-to-server calls (Stripe) carry no Origin.
    if (!origin) return callback(null, true);
    if (config.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Keep the raw body: the Stripe webhook verifies its signature against it.
app.use(bodyParser.json({ limit: '15mb', verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));

// Public read routes take Firestore collection names from the body; only allow the expected ones.
app.use('/api', checkCollectionParams);

// Health check for uptime monitoring and deploy smoke tests.
app.get('/api/health', (req, res) => res.json({ ok: true, env: config.env }));

app.use('/', homeRoutes);
app.use('/', registrationRoutes({ stripe, webhookSecret }));
app.use('/', adminRoutes);
app.use('/', newsfeedRoutes);
app.use('/', leaderboardRoutes);
app.use('/', potRoutes);
app.use('/', settingsRoutes);

// STATIC SITE
// Firebase Hosting serves the site in staging/production. When the build is present
// (local `vite build`, or legacy Heroku) Express can still serve it as before.
const buildDir = path.join(__dirname, '../client/build');
if (fs.existsSync(buildDir)) {
  app.use('/', express.static(buildDir));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(buildDir, 'index.html')));
}

// CENTRALIZED ERROR HANDLER (must be last middleware)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port} [${config.env}]`);
});
