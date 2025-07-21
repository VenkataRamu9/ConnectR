const jwt = require('jsonwebtoken')
const { getUserById } = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'No token provided' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await getUserById(decoded.id)
    if (!user) return res.status(401).json({ error: 'User not found' })

    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' })
  }
}

module.exports = verifyToken
