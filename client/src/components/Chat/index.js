import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getSocket, fetchMessages } from '../../api'
import { useAuth } from '../../context/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './index.css'

const Chat = () => {
  const { roomId } = useParams()
  const { user, token } = useAuth()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typingUser, setTypingUser] = useState('')
  const messagesEndRef = useRef(null)
  const socket = getSocket()

  useEffect(() => {
    if (!socket || !token || !roomId || !user?.username) return

    const loadMessages = async () => {
      try {
        const data = await fetchMessages(roomId, token)
        setMessages(data)
        scrollToBottom()
      } catch (error) {
        console.error('❌ Failed to load messages:', error)
      }
    }

    socket.emit('joinRoom', roomId)

    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on('userTyping', ({ username }) => {
      setTypingUser(username)
      setTimeout(() => setTypingUser(''), 2000)
    })

    loadMessages()

    return () => {
      socket.emit('leaveRoom', roomId)
      socket.off('newMessage')
      socket.off('userTyping')
    }
  }, [socket, token, roomId, user?.username])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    if (socket) {
      socket.emit('typing', { roomId, username: user.username })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim() === '') return
    socket.emit('sendMessage', { roomId, content: newMessage })
    setNewMessage('')
  }

  return (
    <div className="chat-container">
      <div className="chat-room-header">
        <h1 className="chat-room-title">Room: {roomId}</h1>
      </div>

      <div className="chat-messages-section">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender === user.username ? 'sent' : 'received'}`}
          >
            <strong>{msg.sender}:</strong>{' '}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {typingUser && (
          <div className="typing-indicator">{typingUser} is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  )
}

export default Chat
