import axios from 'axios'
import { io } from 'socket.io-client'

const API_BASE = 'http://localhost:5000/api'

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/register`, userData)
  return res.data
}

export const loginUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/login`, userData)
  return res.data
}

export const fetchRooms = async (token) => {
  const res = await axios.get(`${API_BASE}/chat/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const createRoom = async (name, token) => {
  const res = await axios.post(
    `${API_BASE}/chat/rooms`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}

export const fetchMessages = async (roomId, token) => {
  const res = await axios.get(`${API_BASE}/chat/rooms/${roomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const sendMessage = async (roomId, content, token) => {
  const res = await axios.post(
    `${API_BASE}/chat/rooms/${roomId}/messages`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}

let socket = null

export const connectSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'], // Ensures using WebSocket
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected')
      socket.emit('authenticate', { token })
    })

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message || err)
    })
  }

  return socket
}

export const getSocket = () => socket
