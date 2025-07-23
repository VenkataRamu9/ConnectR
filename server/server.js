const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { handleSocket } = require('./sockets/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => handleSocket(socket, io));

const dbFilePath = path.join(__dirname, 'db', 'chat.db');
const db = new sqlite3.Database(dbFilePath, err => {
  if (err) console.error('❌ Failed to connect to DB:', err.message);
  else {
    console.log('✅ Connected to SQLite database.');
    const migrationPath = path.join(__dirname, 'migrations', 'init.sql');
    const migrationScript = fs.readFileSync(migrationPath, 'utf8');
    db.exec(migrationScript, err => {
      if (err) console.error('❌ Migration error:', err.message);
      else console.log('✅ Database schema initialized.');
    });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));