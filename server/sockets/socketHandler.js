const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/userModel');
const { saveMessage, getMessagesByRoomId } = require('../models/messageModel');

const activeUsers = new Map(); // socketId => userId

function socketHandler(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('No token provided');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getUserById(decoded.id);

      if (!user) throw new Error('Invalid user');
      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket auth error:', err.message);
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 ${socket.user.username} connected`);

    activeUsers.set(socket.id, socket.user.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`${socket.user.username} joined room ${roomId}`);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.username} left room ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, content }) => {
      if (!roomId || !content) return;

      const message = await saveMessage({
        user_id: socket.user.id,
        room_id: roomId,
        content,
      });

      io.to(roomId).emit('newMessage', {
        id: message.id,
        room_id: roomId,
        user_id: socket.user.id,
        username: socket.user.username,
        content,
        created_at: message.created_at,
      });
    });

    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('typing', {
        username: socket.user.username,
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 ${socket.user.username} disconnected`);
      activeUsers.delete(socket.id);
    });
  });
}

module.exports = socketHandler;
