import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/register`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/auth/login`, userData);
  return res.data;
};

export const fetchMessages = async (roomId, token) => {
  const res = await axios.get(`${API_BASE}/chat/rooms/${roomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => console.log('✅ Socket connected'));
    socket.on('connect_error', (err) => console.error('❌ Socket error:', err.message));
  }
  return socket;
};

export const getSocket = () => socket;

export const sendMessage = (roomId, message) => {
  if (socket && socket.connected) {
    socket.emit('sendMessage', { roomId, content: message });
  }
};

export const onNewMessage = (callback) => {
  if (socket) {
    socket.on('newMessage', callback);
  }
};

export const onTyping = (callback) => {
  if (socket) {
    socket.on('typing', callback);
  }
};

export const emitTyping = (roomId) => {
  if (socket && socket.connected) {
    socket.emit('typing', { roomId });
  }
};
