const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Initialize app
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const loginRoute = require('./routes/login');
const joinRoute = require('./routes/join');

app.use('/login', loginRoute);
app.use('/join', joinRoute);

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Optional: Multer error handler
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
