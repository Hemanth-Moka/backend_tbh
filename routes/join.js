const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 },
  ]),
  async (req, res) => {
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

      const query = `
        INSERT INTO members (
          username, about, first_name, last_name, email,
          interest_area, motivation, experience, profile_photo, cover_photo
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
      `;

      const values = [
        username,
        about,
        firstName,
        lastName,
        email,
        interestArea,
        motivation,
        experience,
        profilePhoto,
        coverPhoto,
      ];

      const result = await pool.query(query, values);
      res.status(201).json({ message: 'Successfully registered', data: result.rows[0] });
    } catch (err) {
      console.error('Join form error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);


// GET all members
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Fetch members error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE member by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM members WHERE id = $1', [id]);
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
