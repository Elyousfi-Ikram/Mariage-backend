const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

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
app.use('/api', require('./routes/gallery')); // Gallery routes are at /api root in service?

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
