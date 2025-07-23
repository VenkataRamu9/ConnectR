const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/chat.db')

const getUserById = id => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err)
      resolve(row)
    })
  })
}

module.exports = {
  getUserById,
  // include other model methods like createUser, getUserByUsername, etc.
}
