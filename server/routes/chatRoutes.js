const express = require('express')
const router = express.Router()
const {
  getRooms,
  createNewRoom,
  getMessages,
  postMessage
} = require('../controllers/chatController')

const authenticate = require('../middleware/authMiddleware')

router.use(authenticate)

router.get('/rooms', getRooms)
router.post('/rooms', createNewRoom)
router.get('/rooms/:roomId/messages', getMessages)
router.post('/rooms/:roomId/messages', postMessage)

module.exports = router
