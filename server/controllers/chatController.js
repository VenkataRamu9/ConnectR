const { getRoomMessages, saveRoomMessage } = require('../models/messageModel')

const getMessages = async (req, res) => {
  const { roomId } = req.params
  try {
    const messages = await getRoomMessages(roomId)
    return res.json(messages)
  } catch (err) {
    console.error('❌ Fetch messages error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getMessages,
  postMessage,
  getRooms,
  createNewRoom
}
