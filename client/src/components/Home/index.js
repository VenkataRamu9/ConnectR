import './index.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const rooms = [
    { id: 'general', name: 'General Chat' },
    { id: 'react', name: 'React Developers' },
    { id: 'support', name: 'Tech Support' },
  ]

  return (
    <div className="home-container">
      <h1 className="home-heading">Explore Chat Zones</h1>
      <ul className="room-list">
        {rooms.map(room => (
          <li key={room.id} className="room-item">
            <button
              type="button"
              className="join-room-button"
              onClick={() => navigate(`/chat/${room.id}`)}
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
