const db = require('../db/database');

const saveRoomMessage = (userId, roomId, content) => {
  const query = `INSERT INTO messages (user_id, room_id, content, created_at) VALUES (?, ?, ?, datetime('now'))`;
  return db.run(query, [userId, roomId, content]);
};

const getRoomMessages = (roomId) => {
  const query = `
    SELECT messages.content, users.username AS sender, messages.created_at 
    FROM messages 
    JOIN users ON messages.user_id = users.id 
    WHERE room_id = ? 
    ORDER BY messages.created_at ASC
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [roomId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = { saveRoomMessage, getRoomMessages };