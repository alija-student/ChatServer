const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// statische Dateien (Root + views)
app.use(express.static(path.join(__dirname)));
app.use('/views', express.static(path.join(__dirname, 'views')));

// JSON body parsing
app.use(express.json());

// Index liefern
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Login endpoint: erwartet { identifier, password }
app.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Fehlende Anmeldedaten' });
    }

    // user.json im Projekt-Root lesen
    const raw = await fs.readFile(path.join(__dirname, 'user.json'), 'utf8');
    const users = JSON.parse(raw);

    const idLower = identifier.toLowerCase();
    const user = users.find(u =>
      (u.email && u.email.toLowerCase() === idLower) ||
      (u.username && u.username.toLowerCase() === idLower)
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Benutzer nicht gefunden' });
    }

    // Klartext-Vergleich (nur für Entwicklung). In Produktion: Hashing verwenden.
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Falsches Passwort' });
    }

    // Erfolgreich: sende Benutzerdaten ohne Passwort
    const { password: _pw, ...safeUser } = user;
    console.log(`Passwort war korrekt!`);
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Serverfehler' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
