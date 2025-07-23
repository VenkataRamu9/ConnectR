const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashed);

    return res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    console.error('❌ Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
  message: 'Login successful',
  user: {
    id: user.id,
    username: user.username,
    email: user.email // if available
  },
  token
})

  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
