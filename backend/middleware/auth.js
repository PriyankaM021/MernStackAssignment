const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'No token, authorization denied' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
}

module.exports = auth;
