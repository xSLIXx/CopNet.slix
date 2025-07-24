const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.post('/register', async (req, res) => {
  const { dienstnummer, name, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO officers (dienstnummer, name, password, role) VALUES ($1, $2, $3, $4)',
    [dienstnummer, name, hashedPassword, role]
  );
  res.json({ message: 'Officer erstellt!' });
});

router.post('/login', async (req, res) => {
  const { dienstnummer, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM officers WHERE dienstnummer = $1',
    [dienstnummer]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Ungültig' });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: 'Falsches Passwort' });
  }

  const token = jwt.sign(
    { dienstnummer: user.dienstnummer, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;
