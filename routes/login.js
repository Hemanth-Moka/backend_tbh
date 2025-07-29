const express = require('express');
const router = express.Router();
const pool = require('../db'); // Shared pool
// const bcrypt = require('bcrypt'); // Uncomment if using hashing

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const admin = result.rows[0];

    // Plain text password check (for now)
    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If using bcrypt:
    // const match = await bcrypt.compare(password, admin.password);
    // if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
