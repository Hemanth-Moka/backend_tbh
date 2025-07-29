require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import the login route
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);  // This means POST /login will go to routes/login.js

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
