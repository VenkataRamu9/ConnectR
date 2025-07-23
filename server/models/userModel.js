const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/chat.db');

// Get user by ID
const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Get user by username
const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Create new user
const createUser = (username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(query, [username, hashedPassword], function (err) {
      if (err) return reject(err);
      // Get newly inserted user
      resolve({ id: this.lastID, username });
    });
  });
};

module.exports = {
  getUserById,
  getUserByUsername,
  createUser,
};
