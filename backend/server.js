const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Statische Dateien freigeben:
app.use(express.static(path.join(__dirname, '../frontend')));

// API-Routes:
app.use('/api/auth', authRoutes);

// Fallback: Root zeigt Loginseite
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
