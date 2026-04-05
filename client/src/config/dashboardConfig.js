/////////////////////////////////////////////////////////////////////////////
// DASHBOARD SETTINGS ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
const dashboardConfig = {
  firebaseStagingConfig: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_STAGING,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_STAGING,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_STAGING,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_STAGING,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_STAGING,
    appId: import.meta.env.VITE_FIREBASE_APP_ID_STAGING,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_STAGING,
  },
  firebaseProductionConfig: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PRODUCTION,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PRODUCTION,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PRODUCTION,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PRODUCTION,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_PRODUCTION,
    appId: import.meta.env.VITE_FIREBASE_APP_ID_PRODUCTION,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_PRODUCTION,
  },
  CONFIG_DASHBOARD_UPCOMING_AND_ACTIVE_TOURNAMENT_DATA: [
    {
      logo: './DeepseaRoundupLogo2026.jpg',
      title: "Deepsea Roundup 2026 (90th Edition)",
      dates: "July 9th - 12th 2026",
      home: "/2026/home",
      register: "/2026/register",
      leaderboard: "/2026/leaderboard",
      pots: "/2026/pots",
      newsfeed: "/2026/newsfeed",
      records: "/2026/records",
      auction: null,
      admin: "/2026/admin",
    },
  ],

  CONFIG_DASHBOARD_PAST_TOURNAMENT_DATA: [
    {
      logo: './DeepseaRoundupLogo2025.jpg',
      title: "Deepsea Roundup 2025",
      dates: "July 10th - 13th 2025",
      home: "/2025/home",
      register: "/2025/register",
      leaderboard: "/2025/leaderboard",
      pots: "/2025/pots",
      newsfeed: "/2025/newsfeed",
      auction: null,
      admin: "/2025/admin",
    },
    {
      logo: './DeepseaRoundupLogo2024.jpg',
      title: "Deepsea Roundup 2024",
      dates: "July 11th - 14th 2024",
      home: "/2024/home",
      register: "/2024/register",
      leaderboard: "/2024/leaderboard",
      pots: "/2024/pots",
      newsfeed: "/2024/newsfeed",
      auction: null,
      admin: "/2024/admin",
    },
  ],
};

export default dashboardConfig;
