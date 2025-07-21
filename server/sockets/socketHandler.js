const jwt = require('jsonwebtoken')
const { getUserByUsername } = require('../models/userModel')
const { saveRoomMessage } = require('../models/messageModel')

const JWT_SECRET = process.env.JWT_SECRET
const onlineUsers = new Map()

const handleSocket = (socket, io) => {
  console.log('🔌 A client connected')

  // Authenticate first
  socket.on('authenticate', async ({ token }) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await getUserByUsername(decoded.username)
      if (!user) {
        console.log('❌ User not found')
        return socket.disconnect()
      }

      socket.user = { id: user.id, username: user.username }
      onlineUsers.set(user.id, socket.id)

      console.log(`✅ ${user.username} is online`)
      io.emit('userStatus', { userId: user.id, status: 'online' })

      // After authentication, register remaining socket events
      registerRoomEvents(socket, io, user)

    } catch (err) {
      console.log('❌ Invalid token, disconnecting...')
      socket.disconnect()
    }
  })
}

function registerRoomEvents(socket, io, user) {
  socket.on('joinRoom', roomId => {
    socket.join(roomId)
    console.log(`👤 ${user.username} joined room ${roomId}`)
  })

  socket.on('leaveRoom', roomId => {
    socket.leave(roomId)
    console.log(`👤 ${user.username} left room ${roomId}`)
  })

  socket.on('typing', ({ roomId }) => {
    socket.to(roomId).emit('userTyping', { username: user.username })
  })

  socket.on('sendMessage', async ({ roomId, content }) => {
    if (!socket.user) return
    const saved = await saveRoomMessage(user.id, roomId, content)

    const messageData = {
      id: saved.id,
      content,
      roomId,
      sender: user.username,
      createdAt: new Date().toISOString(),
    }

    io.to(roomId).emit('newMessage', messageData)
  })

  socket.on('disconnect', () => {
    onlineUsers.delete(user.id)
    console.log(`🔴 ${user.username} disconnected`)
    io.emit('userStatus', { userId: user.id, status: 'offline' })
  })
}

module.exports = { handleSocket }
