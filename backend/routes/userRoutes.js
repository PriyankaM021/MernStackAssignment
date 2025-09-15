const users = [
  {email: 'priya123@gmail.com', password: 'pass123', name: 'priya'}
];
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let users = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ msg: "User already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, email, password: hashed };
  users.push(user);
  res.json({ msg: "Registered successfully" });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ msg: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

module.exports = router;
