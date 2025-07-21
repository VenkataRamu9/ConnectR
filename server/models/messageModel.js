const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/chat.db')

const saveRoomMessage = (senderId, roomId, content) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO messages (sender_id, room_id, content)
      VALUES (?, ?, ?)
    `
    db.run(query, [senderId, roomId, content], function (err) {
      if (err) return reject(err)
      resolve({ id: this.lastID })
    })
  })
}

const getRoomMessages = roomId => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT messages.id, messages.content, messages.created_at, users.username AS sender
      FROM messages
      JOIN users ON messages.sender_id = users.id
      WHERE messages.room_id = ?
      ORDER BY messages.created_at ASC
    `
    db.all(query, [roomId], (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

module.exports = {
  saveRoomMessage,
  getRoomMessages,
}
