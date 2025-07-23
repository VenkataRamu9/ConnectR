console.log('🛠 Starting server...')

const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const dotenv = require('dotenv')

console.log('✅ Modules imported')

const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')
const { handleSocket } = require('./sockets/socketHandler')

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

io.on('connection', (socket) => {
  console.log('🔌 New socket connection')
  handleSocket(socket, io)
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
