const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../db');

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// POST /join
router.post('/', upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'cover_photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      username, about, first_name, last_name,
      email, interest_area, motivation, experience
    } = req.body;

    const profile_photo = req.files['profile_photo']?.[0]?.filename || null;
    const cover_photo = req.files['cover_photo']?.[0]?.filename || null;

    const result = await pool.query(
      `INSERT INTO users (
        username, about, profile_photo, cover_photo,
        first_name, last_name, email, interest_area,
        motivation, experience
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        username, about, profile_photo, cover_photo,
        first_name, last_name, email, interest_area,
        motivation, experience
      ]
    );

    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Join route error:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
