require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Routes
const loginRoute = require('./routes/login');
const joinRoute = require('./routes/join');

app.use('/login', loginRoute);
app.use('/join', joinRoute);

// Optional: Multer error handler
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    // Handle multer-specific errors
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
