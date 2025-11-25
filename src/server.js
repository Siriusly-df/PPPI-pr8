require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'dev_secret';

const users = [
  { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: 2, email: 'user@example.com', password: 'user123', role: 'user' }
];

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '15m' });
  res.json({ access_token: token, token_type: 'Bearer', expires_in: 900 });
});

app.get('/profile', requireAuth, (req, res) => {
  res.json({ user_id: req.user.sub, role: req.user.role });
});

app.delete('/users/:id', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ message: `User ${req.params.id} deleted (demo)` });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));