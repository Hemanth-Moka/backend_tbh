const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Accept text fields and 2 images
const cpUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 },
]);

router.post('/', cpUpload, async (req, res) => {
  try {
    const {
      username,
      about,
      firstName,
      lastName,
      email,
      interestArea,
      motivation,
      experience,
    } = req.body;

    const profilePhoto = req.files['profilePhoto']?.[0]?.filename || null;
    const coverPhoto = req.files['coverPhoto']?.[0]?.filename || null;

    await pool.query(
      `INSERT INTO users (
        username, about, profile_photo, cover_photo,
        first_name, last_name, email,
        interest_area, motivation, experience
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        username,
        about,
        profilePhoto,
        coverPhoto,
        firstName,
        lastName,
        email,
        interestArea,
        motivation,
        experience,
      ]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Join error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
