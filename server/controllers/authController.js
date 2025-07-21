const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createUser, getUserByUsername } = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

const register = async (req, res) => {
  const { username, password } = req.body
  try {
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser(username, hashedPassword)

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await getUserByUsername(username)
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
}

module.exports = { register, login }
