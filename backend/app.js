const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
const corsOptions = {
  origin: ['https://mariage-frontend.vercel.app', 'https://mariage-frontend-n8v9.vercel.app', 'http://localhost:4200'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files (uploaded images)
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api', require('./routes/gallery'));
app.use('/api/sync', require('./routes/sync'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const status = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ 
    status: 'ok', 
    dbState: states[status] || 'unknown',
    timestamp: new Date() 
  });
});

module.exports = app;
