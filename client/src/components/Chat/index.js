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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!socket || !token || !roomId || !user?.username) return

    const loadMessages = async () => {
      try {
        console.log('🔐 Token in Chat:', token)
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
      scrollToBottom()
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

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)
    if (socket && user?.username) {
      socket.emit('typing', { roomId, username: user.username })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim() === '') return

    if (socket) {
      socket.emit('sendMessage', {
        roomId,
        content: newMessage,
      })
    }

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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        {typingUser && (
          <div className="typing-indicator styled-typing">{typingUser} is typing...</div>
        )}
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
        <button type="submit" className="send-button styled-send">Send</button>
      </form>
    </div>
  )
}

export default Chat
