const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path');
const dotenv = require('dotenv');
const admin = require("firebase-admin");
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const morgan = require('morgan');

// Internal services & middleware
const cache = require('./services/cache');
const { errorHandler } = require('./middleware/errorHandler');

// ROUTES
const homeRoutes = require('./routes/homeRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const newsfeedRoutes = require('./routes/newsfeedRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const potRoutes = require('./routes/potRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const authorizeNetRoutes = require('./routes/authorizeNetRoutes');
// const auctionRoutes = require('./routes/auctionRoutes');

// ENVIRONMENT
dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 8000;

let clientUrl;
let serverUrl;
let stripe;
let webhookSecret;
let sessionSecret;

if (process.env.REACT_APP_NODE_ENV === "staging") {

  admin.initializeApp({
    credential: admin.credential.cert({
      "type": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_TYPE_STAGING,
      "project_id": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PROJECT_ID_STAGING,
      "private_key_id": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID_STAGING,
      "private_key": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_STAGING.replace(/\\n/g, '\n'),
      "client_email": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL_STAGING,
      "client_id": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_ID_STAGING,
      "auth_uri": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_AUTH_URI_STAGING,
      "token_uri": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_TOKEN_URI_STAGING,
      "auth_provider_x509_cert_url": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL_STAGING,
      "client_x509_cert_url": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL_STAGING,
      "universe_domain": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN_STAGING
    }),
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_STAGING,
  });

  clientUrl = process.env.REACT_APP_CLIENT_URL_STAGING;
  serverUrl = process.env.REACT_APP_SERVER_URL_STAGING;
  stripe = require("stripe")(process.env.REACT_APP_STRIPE_PRIVATE_KEY_TESTING);
  webhookSecret = process.env.REACT_APP_STRIPE_WEBHOOK_SECRET_KEY_TESTING;
  sessionSecret = process.env.REACT_APP_SESSION_SECRET_KEY_STAGING;

} else if (process.env.REACT_APP_NODE_ENV === "production") {

  admin.initializeApp({
    credential: admin.credential.cert({
      "type": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_TYPE_PRODUCTION,
      "project_id": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PROJECT_ID_PRODUCTION,
      "private_key_id": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID_PRODUCTION,
      "private_key": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_PRODUCTION.replace(/\\n/g, '\n'),
      "client_email": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL_PRODUCTION,
      "client_id": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_ID_PRODUCTION,
      "auth_uri": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_AUTH_URI_PRODUCTION,
      "token_uri": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_TOKEN_URI_PRODUCTION,
      "auth_provider_x509_cert_url": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL_PRODUCTION,
      "client_x509_cert_url": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL_PRODUCTION,
      "universe_domain": process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN_PRODUCTION
    }),
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_PRODUCTION,
  });

  clientUrl = process.env.REACT_APP_CLIENT_URL_PRODUCTION;
  serverUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
  stripe = require("stripe")(process.env.REACT_APP_STRIPE_PRIVATE_KEY_PRODUCTION);
  webhookSecret = process.env.REACT_APP_STRIPE_WEBHOOK_SECRET_KEY_PRODUCTION;
  sessionSecret = process.env.REACT_APP_SESSION_SECRET_KEY_PRODUCTION;

} else {
  console.error("REACT_APP_NODE_ENV is not set to 'staging' or 'production'");
}

// REDIS
const redisUrl = process.env.REDIS_TLS_URL || 'redis://127.0.0.1:6379';
const redisClient = redis.createClient({
  url: redisUrl,
  socket: {
    tls: (redisUrl.match(/rediss:/) != null),
    rejectUnauthorized: false,
  }
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('ready', () => console.log('Redis client ready'));
redisClient.on('end', () => console.log('Redis client disconnected'));
(async () => {
  try {
    await redisClient.connect();
    cache.init(redisClient); // Initialize cache service with the connected client
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// MIDDLEWARE
const allowedOrigins = [
  clientUrl,
  serverUrl,
  'https://www.deepsearoundup.customtournamentsolutions.com',
  'https://deepsearoundup.customtournamentsolutions.com',
  'https://deepsea-roundup-v3-staging-980ad25bef47.herokuapp.com',
  'https://deepsea-roundup-v3-prod-38a284cee946.herokuapp.com',
];

app.use(morgan('dev'));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(bodyParser.json({ limit: '15mb', verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.REACT_APP_NODE_ENV === 'production' || process.env.REACT_APP_NODE_ENV === 'staging',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));
app.use('/', express.static(path.join(__dirname, '../client/build')));

// ROUTES
app.use('/', homeRoutes);
app.use('/', registrationRoutes({ clientUrl, serverUrl, stripe, webhookSecret, redisClient }));
app.use('/', adminRoutes({ redisClient }));
app.use('/', newsfeedRoutes);
app.use('/', leaderboardRoutes);
app.use('/', potRoutes);
app.use('/', settingsRoutes);
app.use('/', authorizeNetRoutes);
// app.use('/', auctionRoutes);

// REDIRECT — serve React app for all non-API routes
if (process.env.REACT_APP_NODE_ENV === "staging" || process.env.REACT_APP_NODE_ENV === "production") {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// CENTRALIZED ERROR HANDLER (must be last middleware)
app.use(errorHandler);

// LISTEN
app.listen(port, () => {
  console.log(`Server is running on port ${port} [${process.env.REACT_APP_NODE_ENV}]`);
});
