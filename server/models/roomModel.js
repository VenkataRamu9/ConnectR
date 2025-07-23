const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/chat.db')

// Create new chat room
const createRoom = (name, createdBy) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO rooms (name, created_by) VALUES (?, ?)`
    db.run(query, [name, createdBy], function (err) {
      if (err) return reject(err)
      resolve({id: this.lastID, name})
    })
  })
}

// Get all public rooms
const getAllRooms = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM rooms ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

module.exports = {
  createRoom,
  getAllRooms,
}
