import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getSocket, fetchMessages } from '../../api'
import { useAuth } from '../../context/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './index.css'

let socket

const Chat = () => {
  const { roomId } = useParams()
  const { user, token } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [typingUser, setTypingUser] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!token || !roomId || !user?.username) return

    socket = getSocket(token)

    // Authenticate and join room
    socket.on('connect', () => {
      socket.emit('authenticate', { token })
    })

    socket.on('authenticated', () => {
      socket.emit('joinRoom', roomId)
    })

    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message])
      scrollToBottom()
    })

    socket.on('userTyping', ({ username }) => {
      setTypingUser(username)
      setTimeout(() => setTypingUser(''), 2000)
    })

    const loadMessages = async () => {
      try {
        const data = await fetchMessages(roomId, token)
        setMessages(data)
        scrollToBottom()
      } catch (error) {
        console.error('❌ Failed to load messages:', error)
      }
    }

    loadMessages()

    return () => {
      if (socket) {
        socket.emit('leaveRoom', roomId)
        socket.off('newMessage')
        socket.off('userTyping')
        socket.off('authenticated')
      }
    }
  }, [token, roomId, user?.username])

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    if (socket && e.target.value.length < 3) {
      socket.emit('typing', { roomId })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = newMessage.trim()
    if (!trimmed) return

    // Send message including user info
    socket.emit('sendMessage', {
      roomId,
      content: trimmed,
      sender: user.username,
    })

    setNewMessage('')
  }

  return (
    <div className="chat-container styled-chat">
      <div className="chat-room-header styled-header">
        <h1 className="chat-room-title">Room: {roomId}</h1>
      </div>

      <div className="chat-messages-section styled-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.sender === user?.username ? 'sent styled-sent' : 'received styled-received'
            }`}
          >
            <strong className="sender-name">{msg.sender}:</strong>{' '}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {typingUser && <div className="typing-indicator styled-typing">{typingUser} is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form styled-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input styled-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button type="submit" className="send-button styled-send">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
