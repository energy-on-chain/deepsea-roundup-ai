import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './firebase'; // sets up auth + attaches the admin token to /api calls

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

