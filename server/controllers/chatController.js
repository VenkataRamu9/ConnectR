const { getAllRooms, createRoom, getRoomMessages, saveMessage } = require('../models/messageModel')

const getRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms()
    res.json(rooms)
  } catch (err) {
    console.error('❌ Error fetching rooms:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const createNewRoom = async (req, res) => {
  const { name } = req.body
  try {
    const room = await createRoom(name)
    res.status(201).json(room)
  } catch (err) {
    console.error('❌ Error creating room:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const getMessages = async (req, res) => {
  const { roomId } = req.params
  try {
    const messages = await getRoomMessages(roomId)
    res.json(messages)
  } catch (err) {
    console.error('❌ Fetch messages error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const postMessage = async (req, res) => {
  const { roomId } = req.params
  const { content } = req.body
  const sender = req.user?.username || 'Anonymous'

  try {
    const message = await saveMessage({ roomId, content, sender })
    res.status(201).json(message)
  } catch (err) {
    console.error('❌ Error saving message:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getRooms,
  createNewRoom,
  getMessages,
  postMessage,
}
