const { createRoom, getAllRooms } = require('../models/roomModel')
const { saveRoomMessage, getRoomMessages } = require('../models/messageModel')

const getRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms()
    res.json(rooms)
  } catch (err) {
    console.error('Error fetching rooms:', err)
    res.status(500).json({ error: 'Failed to fetch rooms' })
  }
}

const createNewRoom = async (req, res) => {
  try {
    const { name } = req.body
    const createdBy = req.user.id
    const room = await createRoom(name, createdBy)
    res.status(201).json(room)
  } catch (err) {
    console.error('Error creating room:', err)
    res.status(500).json({ error: 'Failed to create room' })
  }
}

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params
    const messages = await getRoomMessages(roomId)
    res.json(messages)
  } catch (err) {
    console.error('Error fetching messages:', err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

const postMessage = async (req, res) => {
  try {
    const { roomId } = req.params
    const { content } = req.body
    const senderId = req.user.id
    await saveRoomMessage(senderId, roomId, content)
    res.status(201).json({ message: 'Message sent' })
  } catch (err) {
    console.error('Error posting message:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
}

module.exports = {
  getRooms,
  createNewRoom,
  getMessages,
  postMessage
}
