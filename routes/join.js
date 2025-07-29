// routes/join.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  }
});

const cpUpload = upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'cover_photo', maxCount: 1 }
]);

router.post('/', cpUpload, async (req, res) => {
  try {
    const {
      username, about, first_name,
      last_name, email, interest_area,
      motivation, experience
    } = req.body;

    const profilePhoto = req.files['profile_photo']?.[0]?.filename || null;
    const coverPhoto = req.files['cover_photo']?.[0]?.filename || null;

    const insertQuery = `
      INSERT INTO users (
        username, about, profile_photo, cover_photo,
        first_name, last_name, email, interest_area,
        motivation, experience, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
      RETURNING *;
    `;

    const values = [
      username, about, profilePhoto, coverPhoto,
      first_name, last_name, email, interest_area,
      motivation, experience
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (error) {
    console.error('DB insert error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
