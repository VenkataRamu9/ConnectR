const { getRoomMessages } = require('../models/messageModel');

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await getRoomMessages(roomId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { getMessages };