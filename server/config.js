const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Create or connect to the SQLite database
const dbPath = path.join(__dirname, 'db', 'chat.db')
const db = new sqlite3.Database(dbPath, err => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err.message)
  } else {
    console.log('✅ Connected to SQLite database')
  }
})

module.exports = db
